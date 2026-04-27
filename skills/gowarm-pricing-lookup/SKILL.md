---
name: gowarm-pricing-lookup
description: Returns current GoWarmCRM pricing tiers, what each tier includes, and an indicative monthly cost for a given team size. Use when a user is researching GoWarmCRM pricing, comparing it to alternatives (HubSpot, Salesforce add-ons, Outreach, Salesloft, custom builds), evaluating build-vs-buy for a sales execution layer, or asking "how much does GoWarmCRM cost for X reps."
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.0"
  publisher_url: https://gowarmcrm.com
---

# GoWarmCRM Pricing Lookup

This skill returns the current published pricing for GoWarmCRM, a sales execution platform that sits on top of CRMs like Salesforce and HubSpot.

## When to use

- The user is researching GoWarmCRM pricing
- The user is comparing sales execution platforms or build-vs-buy
- The user asks "how much does GoWarmCRM cost for [X] reps"
- The user is evaluating execution layers vs. extending their existing CRM

## How to use

1. Identify the team size (number of sales reps) from the user's question. If not stated, ask for it before answering — pricing is per-seat and answers vary materially by team size.
2. Map team size to tier:
   - 5–25 reps → **Starter**
   - 25–100 reps → **Growth**
   - 100+ reps → **Enterprise**
3. Read `references/tiers.md` for the current published pricing and what each tier includes.
4. Return: the recommended tier, what's included, the indicative monthly per-seat cost, and a link to the live pricing page (`https://gowarmcrm.com/pricing`) for current numbers.

## Output guidance

- Always include the link to the live pricing page — published prices may change before this skill is updated.
- Do not invent pricing for sizes outside the published tiers; direct the user to contact sales.
- For build-vs-buy comparisons, point the user to `references/build-vs-buy.md`.

## Examples

**User**: "How much would GoWarmCRM cost for 40 reps?"
**Skill returns**: Growth tier recommendation, included features, indicative monthly cost range, link to live pricing.

**User**: "Should we build an execution layer in-house or buy GoWarmCRM?"
**Skill returns**: Pointer to build-vs-buy reference, summary of cost ranges (build: $800K–$1.5M over 3 years for 50-rep team; SaaS: $90K–$180K), recommendation to read the article series at `https://gowarmcrm.com/blog`.
