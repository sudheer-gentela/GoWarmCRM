# Auth.md — Agent Authentication for GoWarmCRM

GoWarmCRM exposes an authenticated MCP server for AI agents acting on behalf of a signed-in user.

## MCP endpoint
- **Server URL:** https://gowarmcrm.com/mcp
- **Transport:** Streamable HTTP (POST)
- **Server card:** https://gowarmcrm.com/.well-known/mcp/server-card.json

## Authorization
Access requires an OAuth 2.1 access token. Discovery follows the standard MCP/OAuth flow:

1. Call the MCP endpoint without a token. You receive `401 Unauthorized` with a `WWW-Authenticate` header whose `resource_metadata` points to the protected-resource document.
2. **Protected Resource Metadata (RFC 9728):** https://gowarmcrm.com/.well-known/oauth-protected-resource
3. That document names the authorization server. Fetch its metadata (RFC 8414); it is also mirrored at https://gowarmcrm.com/.well-known/oauth-authorization-server.
4. Obtain a token via Authorization Code with PKCE, then call the MCP endpoint with `Authorization: Bearer <token>`.

## Client registration
No manual pre-registration is required. The authorization server supports:
- **Client ID Metadata Document (CIMD)** — clients identify themselves by a hosted metadata URL.
- **Dynamic Client Registration (RFC 7591)** — for clients that register programmatically.

## Tokens
- **Grant type:** `authorization_code` (PKCE required)
- **Resource indicator:** `https://gowarmcrm.com/mcp` — tokens are audience-bound to this resource.
- **Bearer method:** `Authorization` header.

## Security contact
https://gowarmcrm.com/contact
