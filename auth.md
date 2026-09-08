# Auth.md — Agent Authentication for GoWarmCRM

You are an agent. GoWarmCRM exposes an authenticated MCP server for AI agents acting on
behalf of a signed-in GoWarmCRM user. Follow the steps below in order; do not skip ahead.

- **Resource:** `https://gowarmcrm.com/mcp`
- **Resource name:** GoWarmCRM
- **Auth spec:** <https://workos.com/auth-md>
- **Security contact:** <https://gowarmcrm.com/contact>

## MCP endpoint

- **Server URL:** `https://gowarmcrm.com/mcp`
- **Transport:** Streamable HTTP (POST)
- **Server card:** <https://gowarmcrm.com/.well-known/mcp/server-card.json>

## Step 1 — Discover

Discovery is two hops.

### 1a. Protected Resource Metadata (RFC 9728)

Call the MCP endpoint without a token. You receive `401 Unauthorized` with a
`WWW-Authenticate` header whose `resource_metadata` parameter points at the
protected-resource document:

```
WWW-Authenticate: Bearer resource_metadata="https://gowarmcrm.com/.well-known/oauth-protected-resource/mcp"
```

Fetch that document:

```
GET https://gowarmcrm.com/.well-known/oauth-protected-resource/mcp
```

```json
{
  "resource": "https://gowarmcrm.com/mcp",
  "resource_name": "GoWarmCRM",
  "resource_documentation": "https://gowarmcrm.com/auth.md",
  "authorization_servers": ["https://auth.gowarmcrm.com"],
  "scopes_supported": [
    "gowarm.actions.read",
    "gowarm.campaigns.read",
    "gowarm.sequences.read",
    "gowarm.profile.read"
  ],
  "bearer_methods_supported": ["header"]
}
```

What each field tells you:

- `resource` — the canonical URL of the API you are calling. Use it as the `resource`
  indicator when requesting a token, and as the `aud` when minting an assertion.
- `resource_name` / `resource_documentation` — surface these to the user when asking
  for consent.
- `authorization_servers` — the OAuth Authorization Server for this resource. The
  `agent_auth` block lives on its metadata document (see 1b).
- `scopes_supported` — request only from this list.

### 1b. Authorization Server Metadata (RFC 8414)

Fetch the authorization server's metadata:

```
GET https://auth.gowarmcrm.com/.well-known/oauth-authorization-server
```

It is also mirrored at
<https://gowarmcrm.com/.well-known/oauth-authorization-server>.

The document carries the standard OAuth endpoints plus an `agent_auth` block:

```json
{
  "issuer": "https://auth.gowarmcrm.com",
  "authorization_endpoint": "https://auth.gowarmcrm.com/oauth2/authorize",
  "token_endpoint": "https://auth.gowarmcrm.com/oauth2/token",
  "registration_endpoint": "https://auth.gowarmcrm.com/oauth2/register",
  "revocation_endpoint": "https://auth.gowarmcrm.com/oauth2/revoke",
  "jwks_uri": "https://auth.gowarmcrm.com/oauth2/jwks",
  "code_challenge_methods_supported": ["S256"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "agent_auth": {
    "skill": "https://gowarmcrm.com/auth.md",
    "register_uri": "https://auth.gowarmcrm.com/agent/identity",
    "claim_uri": "https://auth.gowarmcrm.com/agent/identity/claim",
    "revocation_uri": "https://auth.gowarmcrm.com/oauth2/revoke",
    "identity_types_supported": ["identity_assertion", "service_auth"],
    "identity_assertion": {
      "assertion_types_supported": ["urn:ietf:params:oauth:token-type:id-jag"],
      "credential_types_supported": ["access_token"]
    },
    "service_auth": {
      "credential_types_supported": ["access_token"]
    },
    "events_supported": []
  }
}
```

Use only the methods and credential types listed in `agent_auth`.

## Step 2 — Pick a method

| Situation | Method |
| --- | --- |
| A human is present and can complete a browser sign-in | **Authorization Code + PKCE** (Step 3a) |
| You are an agent provider that can mint an ID-JAG for the user | **`identity_assertion` + ID-JAG** (Step 3b) |
| You know the user's email but hold no assertion | **`service_auth` + claim ceremony** (Step 3c) |

GoWarmCRM does **not** support anonymous registration. Every session is bound to a
signed-in GoWarmCRM user, and every tool call is scoped to that user's organisation.

## Step 3 — Register

### 3a. Authorization Code + PKCE (interactive)

1. Register your client if you have not already. Either:
   - **Client ID Metadata Document (CIMD)** — pass a hosted client-metadata URL as your
     `client_id`; no pre-registration call is needed. Or
   - **Dynamic Client Registration (RFC 7591)** — `POST` your client metadata to
     `registration_endpoint` and keep the returned `client_id`.
2. Redirect the user to `authorization_endpoint` with `code_challenge_method=S256`,
   your redirect URI, the scopes you need from `scopes_supported`, and
   `resource=https://gowarmcrm.com/mcp`.
3. Exchange the returned `code` at `token_endpoint` with your `code_verifier` and the
   same `resource` value.

### 3b. `identity_assertion` + ID-JAG

Confirm the user consents to asserting their identity to GoWarmCRM, using the
`resource_name` and scope set from Step 1. Then mint an ID-JAG with
`aud = https://gowarmcrm.com/mcp` and post it to `register_uri`:

```
POST https://auth.gowarmcrm.com/agent/identity
Content-Type: application/json

{
  "type": "identity_assertion",
  "assertion_type": "urn:ietf:params:oauth:token-type:id-jag",
  "assertion": "<id-jag>",
  "resource": "https://gowarmcrm.com/mcp",
  "requested_credential_type": "access_token",
  "requested_scopes": ["gowarm.actions.read", "gowarm.campaigns.read"]
}
```

On success you receive a service-signed identity assertion. Exchange it at
`token_endpoint` for an `access_token`.

If GoWarmCRM has never seen this user–agent pair, the response is a `401` with
`error: "interaction_required"` and a `claim` block. Continue at Step 3c from the
claim ceremony.

### 3c. `service_auth` + claim ceremony

```
POST https://auth.gowarmcrm.com/agent/identity
Content-Type: application/json

{
  "type": "service_auth",
  "email": "user@company.com",
  "resource": "https://gowarmcrm.com/mcp",
  "requested_credential_type": "access_token"
}
```

The response carries a claim block shaped like RFC 8628 device authorization:

```json
{
  "registration_id": "reg_...",
  "registration_type": "service_auth",
  "claim_url": "https://auth.gowarmcrm.com/agent/identity/claim",
  "claim_token": "clm_...",
  "claim_token_expires": "2026-01-01T00:00:00Z",
  "post_claim_scopes": ["gowarm.actions.read", "gowarm.campaigns.read"],
  "claim": {
    "user_code": "123456",
    "verification_uri": "https://auth.gowarmcrm.com/login?return_to=%2Fclaim",
    "expires_in": 600,
    "interval": 5
  }
}
```

Surface `verification_uri` and `user_code` to the user. The user signs in to
GoWarmCRM, sees a confirmation page naming your agent, and types the code. Poll
`token_endpoint` at `interval` seconds until the ceremony completes and an
`access_token` is returned. GoWarmCRM never emails the code.

## Step 4 — Call the API

```
POST https://gowarmcrm.com/mcp
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json, text/event-stream
```

- **Bearer method:** `Authorization` header only.
- **Resource indicator:** `https://gowarmcrm.com/mcp` — tokens are audience-bound.
- Tokens are scoped to a single GoWarmCRM organisation and inherit that user's
  row-level permissions. An agent can never read data the user cannot read.

## Step 5 — Errors and revocation

| Error | Where | What to do |
| --- | --- | --- |
| `401 invalid_token` | `/mcp` | Refresh, or restart from Step 1 |
| `403 insufficient_scope` | `/mcp` | Re-authorize with the scope named in `WWW-Authenticate` |
| `401 interaction_required` | `/agent/identity` | Run the claim ceremony (Step 3c) |
| `400 invalid_assertion` | `/agent/identity` | Mint a fresh ID-JAG with the correct `aud` |

Revoke a credential at `https://auth.gowarmcrm.com/oauth2/revoke` (RFC 7009). Users can
also revoke agent access from their GoWarmCRM account settings, which invalidates every
token issued to that agent immediately.

## Available tools

See the server card at
<https://gowarmcrm.com/.well-known/mcp/server-card.json> for the authoritative list.
