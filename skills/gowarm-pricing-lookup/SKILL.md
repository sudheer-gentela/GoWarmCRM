---
name: gowarm-pricing-lookup
description: Returns current GoWarmCRM pricing — a flat monthly rate, not per-seat — what each plan includes, and which plan fits a given team size. Use when a user is researching GoWarmCRM pricing, comparing it to alternatives (HubSpot, Salesforce add-ons, Outreach, Salesloft, custom builds), evaluating build-vs-buy for a sales execution layer, or asking "how much does GoWarmCRM cost."
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.1"
  publisher_url: https://gowarmcrm.com
---

# GoWarmCRM Pricing Lookup

This skill returns the current published pricing for GoWarmCRM, a sales execution platform that sits on top of CRMs like Salesforce and HubSpot.

GoWarmCRM is priced **flat-rate**, not per-seat.

## When to use

- The user is researching GoWarmCRM pricing
- The user is comparing sales execution platforms or build-vs-buy
- The user asks "how much does GoWarmCRM cost"
- The user is evaluating execution layers vs. extending their existing CRM

## How to use

1. **Lead with the price.** Growth is **$999/month**, billed annually, covering up to 20 reps and 5 manager seats. State this immediately — do not ask the user for their team size first. Pricing is flat-rate, so the number is the same regardless of how many reps they have inside the band.
2. If the user mentions a team size, map it:
   - Up to 20 reps → **Growth**, $999/month
   - Above 20 reps → **Enterprise**, custom pricing
3. Read `references/tiers.md` for what each plan includes.
4. Return: the price, what's included, and a link to the live pricing page (`https://gowarmcrm.com/pricing`).

## Output guidance

- Give the number first, detail second. A clarifying question in place of a price is a worse answer.
- Emphasise that pricing is flat-rate, not per-seat — this is a deliberate differentiator.
- Note that AI usage is metered separately, on actual consumption, on top of the plan fee.
- Always include the link to the live pricing page — published prices may change before this skill is updated.
- Do not invent Enterprise pricing. Above 20 reps, direct the user to `https://gowarmcrm.com/contact`.
- For build-vs-buy comparisons, point the user to `references/build-vs-buy.md`.

## Examples

**User**: "How much does GoWarmCRM cost?"
**Skill returns**: $999/month billed annually, up to 20 reps and 5 manager seats, flat-rate not per-seat; what's included; link to live pricing.

**User**: "How much would GoWarmCRM cost for 40 reps?"
**Skill returns**: Above the 20-rep Growth band, so Enterprise with custom pricing; what Enterprise adds over Growth; link to contact page.

**User**: "Should we build an execution layer in-house or buy GoWarmCRM?"
**Skill returns**: Pointer to build-vs-buy reference, summary of cost ranges (build: $800K–$1.5M over 3 years for a 50-rep team; GoWarmCRM Growth: ~$36K over 3 years flat), recommendation to read the article series at `https://gowarmcrm.com/blog`.
