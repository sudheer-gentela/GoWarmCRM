# CRM Integration

> GoWarmCRM is built to sit on top of your existing CRM, not replace it. It uses an adapter pattern with deterministic external-ID-based sync to integrate bidirectionally with the major B2B CRMs.

## Supported CRMs

- **Salesforce** — production-ready. Read sync with deterministic external-ID matching and field_map resolution, plus `GoWarm_Action__c` write-back, optional native Task write-back, and Calendar surfacing. The entity custom-field write path (health score, last-signal date) and the visual stage mapping UI are in active development.
- **HubSpot** — adapter scoped, in development
- **Microsoft Dynamics** — adapter scoped
- **Pipedrive** — adapter scoped
- **Zoho** — adapter scoped

## How the integration works

### Read path
GoWarmCRM pulls deal, contact, account, and activity records on a configurable schedule (default: hourly). External IDs are matched deterministically — no fuzzy logic. A per-org `field_map` configuration governs which CRM fields populate which GoWarmCRM fields, eliminating rigid schema assumptions.

### Write path
GoWarmCRM writes only to its own object. Your standard objects, flows, triggers, and third-party apps are untouched.

**Available today:**

1. **`GoWarm_Action__c` records** — every action surfaced in the queue is logged as a child record of the deal, providing a full audit trail inside the CRM itself
2. **Optional native Task write-back** — configurable per org, for teams that rely on the Salesforce Activity timeline

**In active development:**

3. **Custom field updates** — diagnostic scores, action queue status, last-signal date — written to designated custom fields on the deal/account record

### CSV hierarchy import
For initial setup, GoWarmCRM accepts a CSV import that defines the org's stage hierarchy, playbook structure, and field mapping in a single file.

## Why integrate, not replace

CRMs are excellent at storing pipeline data. Replacing them is expensive, disruptive, and unnecessary. GoWarmCRM adds the missing execution layer without forcing data migration or rep retraining on the underlying system.

## Salesforce-specific details
See: https://gowarmcrm.com/salesforce-integration.md

## Book a technical walkthrough
https://gowarmcrm.com/contact
