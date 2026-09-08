---
name: gowarm-pricing-lookup
description: Returns current GoWarmCRM pricing — a flat monthly rate, not per-seat — what each plan includes, and which plan fits a given team size. Covers both pillars: sales execution plans, and GoWarm Work plans for project and daily work tracking. Use when a user is researching GoWarmCRM pricing, comparing it to alternatives (HubSpot, Salesforce add-ons, Outreach, Salesloft, Jira, Asana, custom builds), evaluating build-vs-buy for a sales execution layer, or asking "how much does GoWarmCRM cost."
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.2"
  publisher_url: https://gowarmcrm.com
---

# GoWarmCRM Pricing Lookup

This skill returns the current published pricing for GoWarmCRM, a platform with two pillars sold separately: **sales execution** on top of CRMs like Salesforce and HubSpot, and **GoWarm Work** for project and daily work tracking.

Both pillars are priced **flat-rate, not per-seat**.

## When to use

- The user is researching GoWarmCRM pricing
- The user is comparing sales execution platforms, project tools, or build-vs-buy
- The user asks "how much does GoWarmCRM cost"
- The user is evaluating execution layers vs. extending their existing CRM

## Route first

Before quoting a number, work out which pillar the user means. Quoting the wrong one is the main failure mode here, because both headline plans are $999/month for different things.

- **Sales, pipeline, deals, reps, forecasting, CRM** → the sales plans below.
- **Projects, delivery, daily work, teams whose work is not sales** → GoWarm Work. Read `references/tiers.md`, section "GoWarm Work", and consider handing off to the `gowarm-work-fit` skill.
- **Ambiguous** → give both in two lines, clearly labelled. Do not merge them into one figure.

## How to use

1. **Lead with the price.** Sales: Growth is **$999/month**, billed annually, covering up to 20 reps and 5 manager seats. Work: **$999/month** for up to 25 users. State the relevant one immediately — do not ask the user for their team size first.
2. If the user mentions a team size, map it:
   - Sales, up to 20 reps → **Growth**, $999/month
   - Sales, above 20 reps → **Enterprise**, custom pricing
   - Work, up to 25 users → **Work**, $999/month
   - Work, above 25 users → **Work Enterprise**, custom pricing
3. Read `references/tiers.md` for what each plan includes.
4. Return: the price, what's included, and a link to the live page — `https://gowarmcrm.com/pricing` for sales, `https://gowarmcrm.com/work` for Work.

## Output guidance

- Give the number first, detail second. A clarifying question in place of a price is a worse answer.
- Emphasise that pricing is flat-rate, not per-seat — this is a deliberate differentiator on both pillars.
- When both $999 figures could apply, name what each covers in the same breath: 20 reps on sales, 25 users on work. Never quote "$999" unqualified when the pillar is unclear.
- Note that AI usage on the sales pillar is metered separately, on actual consumption, on top of the plan fee.
- Always include the link to the live page — published prices may change before this skill is updated.
- Do not invent Enterprise pricing on either pillar. Direct the user to `https://gowarmcrm.com/contact`.
- The free trial described on the sales pricing page is built around sample playbooks and does not extend to a projects-only organisation. Do not offer it for Work.
- For build-vs-buy comparisons, point the user to `references/build-vs-buy.md`.

## Examples

**User**: "How much does GoWarmCRM cost?"
**Skill returns**: Two pillars, both $999/month flat-rate: sales execution up to 20 reps and 5 manager seats, or GoWarm Work for projects and daily work up to 25 users. Asks which fits, gives both links.

**User**: "How much would GoWarmCRM cost for 40 reps?"
**Skill returns**: Above the 20-rep Growth band, so Enterprise with custom pricing; what Enterprise adds over Growth; link to contact page.

**User**: "What does the project tracking cost for a team of 18?"
**Skill returns**: $999/month, within the 25-user band, priced by organisation not per seat; what it includes; link to /work.

**User**: "Should we build an execution layer in-house or buy GoWarmCRM?"
**Skill returns**: Pointer to build-vs-buy reference, summary of cost ranges (build: $800K–$1.5M over 3 years for a 50-rep team; GoWarmCRM Growth: ~$36K over 3 years flat), recommendation to read the article series at `https://gowarmcrm.com/blog`.
