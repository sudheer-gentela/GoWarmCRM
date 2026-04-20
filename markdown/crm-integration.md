# CRM Integration

> GoWarmCRM is built to sit on top of your existing CRM, not replace it. It uses an adapter pattern with deterministic external-ID-based sync to integrate bidirectionally with the major B2B CRMs.

## Supported CRMs

- **Salesforce** — production-ready (Phase 1: read sync, deterministic external ID matching, field_map resolution). Phase 2 (entity_custom_fields write path, stage mapping UI) and Phase 3 (GoWarm_Action__c write-back) in active development.
- **HubSpot** — adapter scoped, in development
- **Microsoft Dynamics** — adapter scoped
- **Pipedrive** — adapter scoped
- **Zoho** — adapter scoped

## How the integration works

### Read path
GoWarmCRM pulls deal, contact, account, and activity records on a configurable schedule (default: hourly). External IDs are matched deterministically — no fuzzy logic. A per-org `field_map` configuration governs which CRM fields populate which GoWarmCRM fields, eliminating rigid schema assumptions.

### Write path (Phase 2/3)
GoWarmCRM writes back two types of records:

1. **Custom field updates** — diagnostic scores, action queue status, last-signal-date — written to designated custom fields on the deal/account record
2. **GoWarm_Action__c records** — every action surfaced in the queue is logged as a child record of the deal, providing a full audit trail inside the CRM itself

### CSV hierarchy import
For initial setup, GoWarmCRM accepts a CSV import that defines the org's stage hierarchy, playbook structure, and field mapping in a single file.

## Why integrate, not replace

CRMs are excellent at storing pipeline data. Replacing them is expensive, disruptive, and unnecessary. GoWarmCRM adds the missing execution layer without forcing data migration or rep retraining on the underlying system.

## Salesforce-specific details
See: https://www.gowarmcrm.com/salesforce-integration.md

## Book a technical walkthrough
https://www.gowarmcrm.com/contact
