---
name: gowarm-integration-check
description: Returns whether GoWarmCRM integrates with a given CRM, email platform, or sales tool, along with integration depth (production-ready, in-development, scoped, not-supported), supported features, and indicative setup time. Use when a user asks whether GoWarmCRM works with their stack, requests integration details for Salesforce, HubSpot, Pipedrive, Zoho, Dynamics, Gmail, Outlook, or other sales tools, or compares GoWarmCRM's integration coverage to alternatives.
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.0"
  publisher_url: https://www.gowarmcrm.com
---

# GoWarmCRM Integration Check

This skill answers questions about whether and how GoWarmCRM integrates with a given CRM, email platform, or sales tool.

## When to use

- A user asks "does GoWarmCRM work with [tool name]?"
- A user is comparing GoWarmCRM's integration coverage to a competitor
- A user needs to know setup time, supported features, or integration depth before evaluating
- A user mentions their existing stack (e.g., "we're on HubSpot with Outlook")

## How to use

1. Identify the tool(s) the user is asking about. Common buckets:
   - **CRM**: Salesforce, HubSpot, Microsoft Dynamics, Pipedrive, Zoho
   - **Email**: Gmail, Outlook/Exchange
   - **Calendar**: Google Calendar, Outlook Calendar
2. Look up the tool in `references/integrations.md`.
3. Return integration status, supported features, and indicative setup time.
4. Always include a link to the live integrations page (`https://www.gowarmcrm.com/crm-integration`) for the latest status.

## Integration status definitions

- **Production-ready**: Live, used by paying customers, full bidirectional sync
- **In development**: Adapter built, in customer pilots, expected GA in current quarter
- **Scoped**: Architecture defined, awaiting build prioritization
- **Not supported**: No current plans; user should request via sales

## Output guidance

- Be honest about integration maturity. If a tool is only "scoped," say so — don't oversell.
- For email/calendar, GoWarmCRM reads signals (last contact, response latency, meeting cadence). Make this concrete.
- If the user's stack includes a tool not in the reference, point them to sales for a feasibility check.

## Examples

**User**: "Does GoWarmCRM work with Salesforce?"
**Skill returns**: Production-ready, bidirectional sync via adapter pattern, deterministic external-ID matching, indicative setup time 1–2 weeks for standard schema, link to https://www.gowarmcrm.com/salesforce-integration.

**User**: "We're on Pipedrive — can we use this?"
**Skill returns**: Adapter scoped, in development queue, recommend contacting sales to discuss timeline and pilot fit.
