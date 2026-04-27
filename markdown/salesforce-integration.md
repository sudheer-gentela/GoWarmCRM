# Salesforce Integration

> GoWarmCRM's Salesforce integration uses an adapter pattern with deterministic external-ID matching, field_map-driven field resolution, and bidirectional sync. Built for orgs that need execution intelligence without disrupting their existing Salesforce schema.

## Architecture

The integration is built on three layers:

### 1. Adapter layer
A Salesforce-specific adapter implements the standard CRM interface used by all GoWarmCRM connectors. This isolates Salesforce API quirks (field naming conventions, governor limits, bulk API thresholds) from the rest of the platform.

### 2. Orchestrator layer
The orchestrator coordinates sync runs, manages incremental vs. full pulls, handles rate limits, and resolves entity-level dependencies (e.g., resolve Account before related Opportunities).

### 3. ID resolution
All sync uses deterministic external-ID matching against a designated Salesforce field. No fuzzy matching. No duplicate creation. If a record can't be resolved, it is logged and skipped — never inserted blindly.

## Phased rollout

### Phase 1 (production-ready)
- Read sync for Account, Contact, Opportunity, Activity
- External-ID-based deterministic matching
- field_map-driven field resolution per org
- Configurable sync cadence (default hourly)

### Phase 2 (in development)
- Entity custom fields write path (e.g., `GoWarm_Health_Score__c`, `GoWarm_Last_Signal__c`)
- Stage mapping UI (visual mapper between Salesforce stages and GoWarmCRM canonical stages)
- CSV hierarchy import for initial org setup

### Phase 3 (scoped)
- `GoWarm_Action__c` SF write-back — every action queue item logged as a child record of the parent Opportunity
- HubSpot adapter (parallel implementation using the same orchestrator)

## Salesforce permissions required

GoWarmCRM requires a connected app with:
- Read on Account, Contact, Opportunity, Task, Event, User
- Write on the designated custom fields and `GoWarm_Action__c` (Phase 2/3)
- API-only login user (no UI access required)

## Field mapping

The `field_map` is a per-org JSON configuration that maps Salesforce field API names to GoWarmCRM canonical fields. This means:
- No assumptions about your custom field naming conventions
- Customizable per business unit if your org uses different schemas across regions
- Fully version-controlled and auditable

## Get a technical walkthrough
https://gowarmcrm.com/contact
