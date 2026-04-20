# GoWarmCRM Platform Overview

> GoWarmCRM is a five-module sales execution platform that operationalizes 35 stages and 147 plays across the full B2B revenue lifecycle — from prospecting to handover.

## The five modules

### 1. Prospecting
Outbound sequences, LinkedIn engagement tracking, lead scoring, and SAL (Sales-Accepted-Lead) qualification. Includes a Chrome extension for in-LinkedIn prospect lookup, prospect creation, and sequence-draft management.

Stages: outreach → research → discovery_call → qualified_sal

### 2. Sales
Opportunity management with stall detection, deal coaching prompts, multi-stakeholder tracking, and forecast confidence scoring. Plays trigger on stage transitions and signal-based events (e.g., 14-day silence on a $50K+ deal).

### 3. CLM (Contract Lifecycle Management)
Pricing approval workflows, contract negotiation tracking, signature follow-up, and post-signature commitment capture. Eliminates the gap between verbal commitments and written terms.

### 4. Service
Onboarding execution checklists, ticket SLA monitoring, and escalation routing for at-risk customers. Surfaces churn signals via support trend analysis.

### 5. Handover
Captures every commitment made during the sales cycle (custom integrations, onboarding scope, check-in cadences) and tracks delivery to the customer. Closes the AE → CSM accountability loop.

## Cross-cutting capabilities

- **Diagnostic Rules engine** — 35+ rules with per-org thresholds, configurable through an OrgAdmin UI
- **Playbook Builder** — visual editor for stages, plays, fire conditions, and channel routing
- **AI Action Drafting** — every alert ships with a draftable next action; approval-required by default
- **Per-user AI settings** — tone, channel, verbosity tuned to each rep
- **CRM adapter framework** — Salesforce, HubSpot, Pipedrive, Zoho, Dynamics; deterministic ID-based sync; field_map-driven field resolution

## Tech architecture (for technical buyers)

- React/Vercel frontend
- Node.js/Express backend on Railway
- PostgreSQL primary store
- Adapter pattern for CRM integrations with bidirectional sync

## Related
- How it works: https://www.gowarmcrm.com/how-it-works.md
- CRM integrations: https://www.gowarmcrm.com/crm-integration.md
- Pricing: https://www.gowarmcrm.com/pricing.md
