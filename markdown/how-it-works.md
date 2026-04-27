# How GoWarmCRM Works

> A nightly diagnostic engine that reads behavioral signals from your stack, surfaces the exact actions reps need to take, and uses AI to draft the next action for every alert.

## The three-layer execution engine

### 1. Nightly diagnostic
Every night, GoWarmCRM runs rule-based diagnostics across five entity types: deals, prospects, contracts, service cases, and handovers. Each entity is scored against per-org thresholds (35+ rules, fully configurable). The output is a prioritised list of issues — stalled deals, missed playbook steps, broken handovers, expansion signals, contract risk — with deal value, time-at-risk, and recommended action attached.

### 2. Live action queue
Reps don't open dashboards. They open an action queue. Each item is ranked by urgency, deal value, and time-at-risk. Alerts persist intelligently — snoozes are honored, playbook progress is preserved, and items disappear automatically when the underlying condition resolves.

### 3. AI-drafted next action
Every alert ships with an AI-drafted action — an email, a Slack message, a meeting invite, a CRM update. Reps approve, edit, or skip in one click. AI never sends without rep approval. Per-user settings tune tone, channel, and verbosity to each rep's style.

## Signal sources

GoWarmCRM reads from four signal sources, not just your CRM:

- **Email activity** — last two-way contact date, response latency, thread frequency
- **Calendar events** — meetings scheduled, accepted, declined, ghosted, or rebooked
- **Meeting patterns** — frequency over time, single-threaded vs. multi-stakeholder, engagement trajectory
- **CRM fields** — stage, value, owner, close date — as one input, not the only one

This is why the diagnostic works even when reps don't update fields. The signal is already there in the inbox and the calendar.

## Modules

GoWarmCRM operates across five modules with 35 stages and 147 plays:

1. **Prospecting** — outbound sequences, LinkedIn engagement, lead scoring, SAL qualification
2. **Sales** — opportunity stages, deal coaching, stall detection, forecasting signals
3. **CLM (Contract Lifecycle)** — pricing approvals, contract negotiation, signature follow-up
4. **Service** — onboarding execution, ticket SLA monitoring, escalation routing
5. **Handover** — commitment capture from sales to CS, delivery tracking, accountability loop

## CRM integration

GoWarmCRM uses an adapter pattern with deterministic external-ID matching to sync bidirectionally with:

- Salesforce (Phase 1 production-ready; Phase 2 + 3 in development)
- HubSpot
- Microsoft Dynamics
- Pipedrive
- Zoho

Field-level sync is governed by a per-org `field_map` — no rigid schema assumptions.

## Book a demo
https://gowarmcrm.com/contact
