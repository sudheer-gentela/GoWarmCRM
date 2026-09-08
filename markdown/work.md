# GoWarm Work — Project and Daily Work Tracking

> GoWarm Work is the project and daily work tracking half of the GoWarmCRM platform. It is built for companies up to 500 people in any industry — construction, manufacturing, services, agencies, professional firms — where the founder or managing director has stopped being able to see the work directly and there is nobody whose job it is to maintain a project tool. The organising principle: the record of work is a byproduct of doing it, not a second job on top of it.

## The problem it addresses

Past a certain size, everything a founder knows about their own company arrives as a description of work rather than the work: a status deck assembled the night before, a weekly review reporting what people chose to raise, a dashboard that is green because nobody set a threshold, a project tool holding last month's dates.

Each is a record of reporting, not a record of work. The cause is structural — the act of recording has been separated from the act of working — so it degrades fastest under pressure, which is when accuracy matters most.

## The two modules

### Projects

For anything with a shape: an implementation, a site, a build, a migration, an audit, a retainer, or a standing capability that will never finish.

- Stages with gates that hold the next stage shut until the current one is met
- Task dependencies, checked for circularity at creation
- A baseline frozen when the project starts, so drift is a measured difference rather than a renegotiation
- Evidence attached to a task before it closes — a file, a link, or a note that cannot be quietly rewritten
- Timeboxed and standing modes, so a retainer is not a project permanently at 90 per cent
- Bill of Quantities with an append-only spend ledger, rate snapshots, corrections booked as reversals, and approved variations kept separate from the original bill

### Daily work

For the people whose contribution never appears in any deal, ticket or dashboard, and who are currently tracked in a shared spreadsheet.

- One short line a day per piece of work, written by the person doing it
- Recurring work that never completes, and assigned work that completes once
- A controlled list of activity types, so three spellings of one activity do not become three lines in the rollup
- An "Other" escape hatch that never blocks anyone, feeding a queue the manager promotes or merges from
- Logging measured against working days and a holiday calendar, not against generated tasks
- A manager view placing each person's logging record beside their open and overdue project tasks, with a full per-person timeline

## Four design decisions that change what the numbers mean

1. **The text lives in exactly one row.** An update posted on a project task *is* the person's daily work entry, not a copy of it. The same row is read by their own day view, by the task, and by the manager rollup. Two stored copies would require synchronisation, and synchronisation drift makes two screens disagree — after which neither is trusted.

2. **Nothing is generated, so nothing accumulates.** No scheduler creates entries. A day with no entry is an absence, not an unfinished item. Compliance is days logged divided by working days in the window, with the denominator coming from the person's schedule and the holiday calendar. In one live system, a generated action queue for a single user grew from 389 to 541 to 583 open items, then sat unchanged for nineteen days with every digest unread. That is the resting state of any tool that manufactures work.

3. **Not everything is supposed to finish.** Two independent axes: customer or internal, and timeboxed or standing. All four combinations occur — an implementation with a go-live, a managed-service retainer, an internal migration with an owner and a date, and a standing capability such as training or compliance. Standing work is retired rather than completed, and stays out of delivery statistics.

4. **Money sits on the same object as the work.** Bill of Quantities progress is stored as increments rather than running totals; every entry snapshots the rate it was booked at; a mistake is corrected by a reversal pointing at the original; approved variations are kept apart from the bill so the reason a project grew is not absorbed into it.

## What it deliberately does not do

No timers, no screenshots, no idle detection, no hour counting, no productivity score. The measure a manager sees is whether work was recorded on a working day and what it was. A record people are afraid of is a record nobody writes honestly.

## Conversations

Under 500 people, much of a project's real history sits in messaging groups. An administrator can attach the conversations a team already uses to the project they belong to, on channels the organisation chooses and consents to, so that history lands against the right work instead of scrolling away.

## Who it is for

Companies up to 500 people, in any industry. What they share is not size but a gap: nobody's full-time job is keeping the record of work truthful, so the founder or managing director has been doing it instead. In use across construction and interiors; engineering and manufacturing services; IT services and agencies; professional services; facilities and field service; and internal functions such as data, marketing, finance and delivery. Bill of Quantities support, standing work and evidence requirements exist because the first users were not software teams.

## Pricing

- **Work** — $999/month, up to 25 users. Projects and daily work, manager rollup and per-person timeline, Bill of Quantities with procurement and variations, multiple departments with separate schedules and holiday calendars, conversation attachment on chosen channels, document storage connections, onboarding session.
- **Work Enterprise** — custom, above 25 users. Adds single sign-on, custom onboarding and data migration, priority support and SLA, named point of contact.

Priced by organisation rather than per seat. Modules are enabled per organisation, so an org can run projects and daily work with every sales module switched off, and add them later without migrating anything.

## Related reading
- The argument in full: https://gowarmcrm.com/why-you-stopped-knowing.md
- Sales execution side of the platform: https://gowarmcrm.com/index.md
- Platform overview: https://gowarmcrm.com/platform-overview.md
- Pricing: https://gowarmcrm.com/pricing.md
- Contact: https://gowarmcrm.com/contact.md
