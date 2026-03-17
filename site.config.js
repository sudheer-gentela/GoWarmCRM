// ─────────────────────────────────────────────────────────────────────────────
// site.config.js
// Central configuration for GoWarm Insights
// Change SITE_URL and BRAND values here to redeploy on a different domain.
// This file is imported by build.js to inject config into all HTML pages.
// ─────────────────────────────────────────────────────────────────────────────

const config = {

  // ── Domain & URLs ──────────────────────────────────────────────────────────
  // Change SITE_URL to move the whole site to a new domain.
  // No trailing slash.
  SITE_URL: "https://go-warm-crm.vercel.app",

  // The product/company website (linked from footer and author bios)
  PRODUCT_URL: "https://gowarm.ai",

  // ── Brand ──────────────────────────────────────────────────────────────────
  BRAND_PUBLICATION: "GoWarm Insights",   // Publication name (nav, footer, OG)
  BRAND_COMPANY:     "GoWarm",        // Company name (footer copyright, bios)
  BRAND_TAGLINE:     "Practical intelligence for B2B sales and business leaders.",

  // ── SEO Defaults ───────────────────────────────────────────────────────────
  // Used as fallback OG image for all pages
  OG_IMAGE: "/og-image.png",             // Place a 1200x630 image in your repo root

  // Twitter/X handle (optional — remove or leave blank to skip twitter:site tag)
  TWITTER_HANDLE: "@gowarmcrm",

  // ── Pages ──────────────────────────────────────────────────────────────────
  // slug:        URL path (no leading slash) — becomes the actual filename
  // title:       <title> tag and og:title
  // description: meta description and og:description
  // label:       article category label shown on the page
  // audience:    shown in article meta row
  // readTime:    shown in article meta row
  // schema:      "Article" | "FAQPage" | "WebPage" — controls JSON-LD type
  // faqs:        optional — array of {q, a} shown as FAQ schema for AEO

  pages: {

    "index": {
      slug:        "index",
      title:       "CRM Intelligence for B2B Sales Leaders | GoWarm Insights",
      description: "Practical guides, diagnostics, and frameworks for VP Sales, RevOps, and Sales Directors who want more from their CRM than pipeline tracking.",
      schema:      "WebPage",
    },

    "is-your-crm-a-crud-app": {
      slug:        "is-your-crm-a-crud-app",
      navLabel:    "Are you using Salesforce as a CRUD app?",
      cardLabel:   "Self-Diagnostic",
      cardExcerpt: "Five patterns that reveal you're paying $150k/year for a glorified spreadsheet — and what good actually looks like.",
      cardMeta:    "8 min read · VP Sales",
      tldr: [
        "Most Salesforce users get pipeline visibility and reporting — things a spreadsheet could do.",
        "5 warning signals: reps log calls after the fact, nothing triggers on stage change, pipeline reviews are interrogations, playbooks live in a doc nobody reads, forecast is gut feel.",
        "The diagnostic question: how many automated next steps did your CRM generate in the last 90 days without anyone creating them manually?",
        "The gap between what most orgs do and what's possible isn't a technology gap — it's a configuration and adoption gap.",
      ],
      title:       "Is Your CRM Just a CRUD App? 5 Signs You're Wasting Your Investment | GoWarm Insights",
      description: "Most Salesforce users pay $150k/year for pipeline visibility a spreadsheet could provide. Here are 5 diagnostic signals that reveal you're using your CRM as a data entry tool — not a revenue engine.",
      label:       "Self-Diagnostic",
      audience:    "VP Sales · Sales Directors",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "How do I know if my team is using Salesforce properly?",
          a: "Key signals of poor CRM adoption include: reps logging calls after the fact, no automated next steps after stage changes, pipeline reviews that rely on rep memory rather than system data, playbooks stored in external documents nobody reads, and forecasts based on gut feel rather than system-calculated probability." },
        { q: "What is the average cost of Salesforce for a mid-market company?",
          a: "When you include licenses, admin overhead, and integrations, the average mid-market company spends between $80,000 and $200,000 per year on Salesforce." },
        { q: "What is a system of action versus a system of record in CRM?",
          a: "A system of record stores what happened — calls logged, deals tracked, contacts managed. A system of action drives what should happen next — automated tasks, triggered workflows, next-step recommendations. Most CRM implementations function as systems of record when they should be systems of action." },
        { q: "Why do sales reps avoid updating the CRM?",
          a: "Reps avoid CRM updates when the system gives them nothing useful in return. If logging a call doesn't surface next steps, trigger automations, or make their job easier, it becomes pure compliance work. The fix is a CRM configured to reward good behavior, not just record it." },
      ],
    },

    "are-your-sales-playbooks-working": {
      slug:        "are-your-sales-playbooks-working",
      navLabel:    "Are your playbooks working?",
      cardLabel:   "Playbooks",
      cardExcerpt: "A playbook nobody executes is worse than no playbook at all. Here's how to tell the difference — and fix it.",
      cardMeta:    "7 min read · RevOps · Enablement",
      tldr: [
        "Most orgs have playbooks. Very few have playbook execution — guidance that actually changes rep behaviour at the moment of a sale.",
        "A dormant playbook is worse than no playbook: it creates false confidence that the process is being followed when it isn't.",
        "Three metrics that tell the truth: play completion rate, stage velocity by playbook, win rate by play used.",
        "If a rep has to leave their CRM workflow to find the playbook, adoption will be near zero.",
      ],
      title:       "Are Your Sales Playbooks Actually Working? How to Measure Playbook Adoption | GoWarm Insights",
      description: "A playbook nobody executes creates false confidence — it's worse than no playbook at all. Here's how to measure play completion rate, stage velocity, and win rate by playbook to know if yours are working.",
      label:       "Playbooks · Enablement",
      audience:    "RevOps · Sales Enablement",
      readTime:    "7 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you measure sales playbook effectiveness?",
          a: "The three core metrics are: play completion rate (what percentage of reps complete the associated actions when a play is triggered), stage velocity by playbook (do deals where the play was executed move through stages faster), and win rate by play used (is there a measurable win rate difference between deals where the play ran versus those where it didn't)." },
        { q: "Why do sales playbooks fail to get adopted?",
          a: "Playbooks fail when they're designed as training documents rather than operational tools. If reps have to leave their CRM workflow to find and read a playbook, adoption approaches zero. Playbooks need to be embedded in the deal workflow, triggered automatically at the right deal stage, with defined completion criteria and outcome tracking." },
        { q: "What is the difference between a playbook and playbook execution?",
          a: "A playbook is a document — a collection of guidance and best practices. Playbook execution is the system by which that guidance actually changes rep behavior at the moment of a sales interaction. Most organisations have the first. Very few have the second." },
        { q: "What is a good play completion rate for sales playbooks?",
          a: "A completion rate below 40% indicates the play isn't being used. Above 80% with no outcome differentiation suggests reps are ticking boxes without it changing behavior. The target is high completion paired with measurable outcome improvement — stage velocity or win rate lift." },
      ],
    },

    "crm-rebuild-or-recommit": {
      slug:        "crm-rebuild-or-recommit",
      navLabel:    "Rebuild or recommit?",
      cardLabel:   "Decision Framework",
      cardExcerpt: "Not a vendor pitch. A real decision framework for whether to stay, switch, or build — and how to avoid the status quo trap.",
      cardMeta:    "10 min read · CTO · VP Sales",
      tldr: [
        "Before evaluating alternatives, answer honestly: is this a platform problem or an adoption and configuration problem? Most orgs mistake the second for the first.",
        "Salesforce is right for you if: complex multi-stakeholder deals, dedicated admin capacity, 50+ reps, significant existing integrations.",
        "True switching costs: data migration (budget 2–3x the vendor estimate), 60–90 days of reduced rep productivity, process redesign, integration rebuilds.",
        "The worst outcome: six months of evaluation, organisational energy around change, then returning to the status quo with nothing changed.",
      ],
      title:       "Salesforce vs Switch vs Build Custom: The Honest CRM Decision Framework | GoWarm Insights",
      description: "Should you stay on Salesforce, move to a lighter CRM, or build custom? A real evaluation framework covering true switching costs, when custom makes sense, and how to avoid spending 6 months evaluating and returning to the status quo.",
      label:       "Decision Framework",
      audience:    "CTO · VP Sales",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do I know if Salesforce is the right CRM for my company?",
          a: "Salesforce is the right fit if you have a genuinely complex sales process (multi-stakeholder, long-cycle enterprise), dedicated Salesforce admin capacity, a team of 50+ reps, and existing data and integrations that would be expensive to rebuild. If none of these apply, you may be over-CRMed." },
        { q: "What is the true cost of switching CRM systems?",
          a: "The true cost includes data migration (typically 2-3x the vendor's estimate), rep retraining and 60-90 days of reduced productivity, process redesign, and integration rebuilds. All of these must be quantified honestly before evaluating alternatives." },
        { q: "When does building a custom CRM make sense?",
          a: "Custom CRM makes sense when your sales process has genuinely idiosyncratic requirements no commercial platform addresses, the business logic is core IP, and you can commit to owning the system for 3+ years including ongoing maintenance. It is a trap when driven by frustration with existing platforms rather than a specific capability gap." },
        { q: "What is the worst outcome of a CRM evaluation?",
          a: "Spending six months evaluating, building organizational energy around change, and returning to the status quo with nothing changed. This depletes political capital, signals to reps that nothing will change, and validates learned helplessness. Setting a hard decision date at the start of any evaluation prevents this." },
      ],
    },

    "crm-integration-complexity": {
      slug:        "crm-integration-complexity",
      navLabel:    "The integration trap",
      cardLabel:   "Integration Strategy",
      cardExcerpt: "You have 12 integrations and a working system. Here's how to separate legitimate switching costs from integration inertia — and what to do about either.",
      cardMeta:    "9 min read · VP Sales · RevOps · CTO",
      tldr: [
        "Integration complexity is the most effective reason organisations give for tolerating a CRM that isn't delivering — and it's often used as an excuse, not a genuine constraint.",
        "Three categories: load-bearing (genuinely critical), convenience (real value, rebuildable), ghost (no live purpose, just inflates switching cost).",
        "Integration quality degrades silently — the sync that worked in 2021 may be dropping records today, with reps having quietly built workarounds around the gaps.",
        "Staying and fixing is only legitimate as a strategy if you can answer: fix what, by when, measured how?",
      ],
      title:       "CRM Integration Complexity: Legitimate Cost or Excuse for Inertia? | GoWarm Insights",
      description: "You have 12 integrations and a working system. Before using that as a reason to avoid fixing your CRM, audit what those integrations actually do. A framework for separating load-bearing integrations from convenience and ghost integrations.",
      label:       "Integration Strategy",
      audience:    "VP Sales · RevOps · CTO",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you decide if CRM integration complexity justifies staying on your current platform?",
          a: "Classify your integrations into three categories: load-bearing (genuinely complex, mission-critical processes break without them), convenience (real value but not blocking anything critical), and ghost (built for use cases that no longer exist). Most switching cost calculations include all three. Only load-bearing integrations deserve serious weight." },
        { q: "What percentage of CRM integrations are actually still needed?",
          a: "In most CRM audits, 20-30% of integrations are ghost integrations — built for use cases that have since changed or disappeared. They contribute to the switching cost calculation but have no operational value." },
        { q: "When is it right to stay on Salesforce and fix the configuration?",
          a: "Staying and fixing is the right answer when load-bearing integrations are genuinely complex and proprietary, when the team has deep institutional knowledge of the current architecture, or when a major business event within 18 months makes disruption particularly costly. But staying and fixing requires a real improvement project with defined metrics — not continued optimisation around the edges." },
      ],
    },

    "revops-stack-crm-foundation": {
      slug:        "revops-stack-crm-foundation",
      navLabel:    "Do your RevOps tools actually help?",
      cardLabel:   "RevOps Stack",
      cardExcerpt: "Gong, Clari, Outreach — great tools. But intelligence layers built on broken CRM data amplify noise, not signal. Here's the honest diagnostic.",
      cardMeta:    "9 min read · RevOps · VP Sales · Sales Ops",
      tldr: [
        "Tools like Outreach exist because CRMs failed at the workflow layer. In a well-designed system, what they do belongs inside the CRM itself.",
        "Gong and Clari are genuinely different — conversation intelligence and revenue forecasting are capabilities the CRM was never designed to provide.",
        "But both depend heavily on CRM data quality. Clari running on inflated pipeline and stale close dates produces a forecast that looks precise and is structurally wrong.",
        "Fix the foundation first. Intelligence tools amplify what's underneath them — good or bad.",
      ],
      title:       "Why Your Gong, Clari, and Outreach Stack Depends on CRM Data Quality | GoWarm Insights",
      description: "RevOps tools like Gong and Clari are intelligence multipliers — but they're only as good as the CRM data they read. Broken CRM foundation means your forecasting model is fitting corrupted data and your call intelligence is pattern-matching against noise.",
      label:       "RevOps Stack",
      audience:    "RevOps · VP Sales · Sales Ops",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "Do I need to fix my CRM if I already have Gong and Clari?",
          a: "Yes — more urgently than if you didn't have them. Gong and Clari derive their value from CRM data quality. If pipeline hygiene is poor, close dates are inflated, and reps aren't logging activity, Clari's forecast model is fitting corrupted inputs and Gong's deal intelligence is pattern-matching against inaccurate deal records. The tools amplify what's underneath them — good or bad." },
        { q: "What is the difference between sales engagement tools and CRM?",
          a: "Tools like Outreach and Salesloft primarily do what a well-configured CRM should handle natively — sequence management, task automation, activity logging, next-step generation. They exist as a category because CRMs historically failed at the workflow layer. In a well-designed system, these capabilities belong inside the CRM itself." },
        { q: "Is Gong a replacement for CRM?",
          a: "No. Gong is a conversation intelligence layer that sits above CRM data — processing audio, identifying language patterns, and surfacing deal risk signals. These are genuinely distinct capabilities no CRM should try to replicate. But Gong's insights depend heavily on calls being linked to accurate opportunity records in the CRM." },
        { q: "How do I know if my Clari forecast is accurate?",
          a: "Compare Clari's forecast to actual close rates over the last four quarters. If forecast accuracy is below 75%, the question is whether the model is misconfigured or whether it's reading low-quality pipeline data. Poor pipeline hygiene — inflated stages, stale close dates, zombie deals — produces a forecast that looks precise but is structurally unreliable." },
      ],
    },

    "crm-implementation-guide": {
      slug:        "crm-implementation-guide",
      navLabel:    "How to implement a CRM",
      cardLabel:   "CRM Implementation",
      cardExcerpt: "Most implementations fail not because of the tool chosen, but because the process wasn't documented first. A framework covering process design, tool selection, change management, and the first 90 days.",
      cardMeta:    "10 min read · VP Sales · Sales Ops · RevOps",
      tldr: [
        "The tool is the last decision, not the first. Organisations that get CRM right spend more time on process design before vendor evaluation than on the implementation itself.",
        "Document your actual sales process — not the ideal one — before opening a single demo. Every point of disagreement between reps is a future data quality problem.",
        "Change management is the implementation. Reps will use a system that helps them sell and ignore one that doesn't. Design for rep productivity, not management visibility.",
        "Five first-90-days mistakes: configuring for the ideal process, too many fields too early, no data quality owner, measuring adoption by logins, treating go-live as the finish line.",
      ],
      title:       "How to Implement a CRM: A Practical Framework for Getting It Right | GoWarm Insights",
      description: "Most CRM implementations fail not because of the tool chosen, but because the process wasn't documented before the tool was selected. A step-by-step framework covering process design, tool selection, change management, and the first 90 days.",
      label:       "CRM Implementation",
      audience:    "VP Sales · Sales Ops · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "What is the first step in implementing a CRM?",
          a: "Document your actual sales process before evaluating any tools. Spend two weeks talking to sales reps about how they sell today — not how you want them to sell. Map the process with clear definitions of what has to happen at each stage before a deal moves forward. Every CRM implementation that skips this step produces a system that doesn't match how people work." },
        { q: "Which CRM should a small or mid-market B2B company implement?",
          a: "The right CRM depends on your sales motion. High-volume, short-cycle sales (under 30 days) suit lightweight tools like HubSpot or Pipedrive. Mid-market 30-90 day cycles need solid workflow automation and forecast tools. Enterprise multi-stakeholder deals justify Salesforce. Founder-led or early-stage teams (under 5 reps) should start with something configurable in a day before investing in a full platform." },
        { q: "How do you get sales reps to adopt a new CRM?",
          a: "Design the CRM for rep productivity, not just management visibility. Involve reps in configuration before it's finished — ask what information would help them before calls, what takes too long to log. The manager's behaviour sets the standard: if pipeline reviews bypass the CRM, reps learn it doesn't matter. Adoption typically takes 60-90 days of consistent reinforcement after go-live." },
        { q: "What are the biggest mistakes in a first CRM implementation?",
          a: "The five most common mistakes are: configuring for an ideal process rather than the current one, adding too many fields too early, having no data quality owner, measuring adoption by logins rather than data completeness, and treating go-live as the finish line rather than the start of the adoption phase." },
      ],
    },

    "lead-generation-discovery-meetings": {
      slug:        "lead-generation-discovery-meetings",
      navLabel:    "Improving lead generation",
      cardLabel:   "Lead Generation",
      cardExcerpt: "Most lead gen underperformance is a definition problem, not a volume problem. ICP, qualification frameworks, and the metrics that show where your funnel is actually breaking.",
      cardMeta:    "10 min read · VP Sales · Head of Growth · RevOps",
      tldr: [
        "Most lead gen underperformance is a definition problem, not a volume problem. Adding more outreach before fixing conversion rates generates more noise faster.",
        "A usable ICP has four parts: firmographic profile, situational trigger, buyer persona, and a disqualifying signal. If sales and marketing can't independently write the same sentence, you don't have an ICP.",
        "The metrics that actually diagnose the problem: lead-to-SAL rate, contact-to-meeting rate (target 5%+ for cold outbound), meeting show rate (target 70%+), discovery-to-opportunity rate.",
        "Add volume only when ICP is tight, messaging is working, show rate is healthy, and discovery conversion is strong. Before that, scaling makes the problem harder to diagnose.",
      ],
      title:       "How to Improve Lead Generation and Book More Discovery Meetings | GoWarm Insights",
      description: "Most lead gen underperformance is a definition problem, not a volume problem. Before hiring more SDRs or buying another sequencing tool, get alignment on ICP, lead qualification, and the metrics that actually show where your funnel is breaking.",
      label:       "Lead Generation",
      audience:    "VP Sales · Head of Growth · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you improve B2B lead generation?",
          a: "Start by diagnosing where the funnel is breaking before changing volume or tooling. Measure contact-to-meeting rate, meeting show rate, and discovery-to-opportunity rate. If contact-to-meeting is below 5% for cold outbound, the problem is messaging or targeting. If show rate is below 70%, the problem is qualification — meetings are being booked before genuine interest is established. Fix the conversion rate before scaling volume." },
        { q: "What is an ideal customer profile (ICP) and how do you define one?",
          a: "A usable ICP has four components: a firmographic profile (company size, industry, revenue range), a situational trigger (what has to be happening at the company for them to be a real prospect now), a buyer persona (who experiences the problem and has authority to buy), and a disqualifying signal (what makes a company definitively not your customer). The fastest way to build it is to analyse your last 10-15 closed won deals and identify what they had in common that other prospects didn't." },
        { q: "What is a good discovery meeting show rate?",
          a: "A healthy meeting show rate is 70% or above. Below that level, meetings are being booked before genuine interest is established — prospects agreed to get off the phone, not because they were curious. The fix is better qualification before booking, not better reminder sequences." },
        { q: "What is the difference between MQL, SAL, and SQL?",
          a: "An MQL (marketing qualified lead) meets firmographic criteria and has shown intent signals. An SAL (sales accepted lead) is an MQL that sales has reviewed and agreed meets the ICP — this is the handoff point. An SQL (sales qualified lead) has been contacted, responded, and meets qualification criteria like budget, authority, need, and timeline. The SAL stage is commonly skipped, causing marketing to pass unreviewed leads directly into outreach sequences." },
        { q: "When should you hire SDRs to improve lead generation?",
          a: "Add SDR volume when your ICP is tight, your messaging is working (contact-to-meeting rate above 8%), your show rate is healthy, and your discovery-to-opportunity rate is strong. If those conditions aren't met, adding SDRs generates more noise and burns through your best prospects before you've figured out what to say to them." },
      ],
    },

    "crm-roi-cfo-questions": {
      slug:        "crm-roi-cfo-questions",
      navLabel:    "CFO questions on CRM spend",
      cardLabel:   "CFO · Finance",
      cardExcerpt: "Your CRM line item is growing and the answers are vague. Six specific questions that cut through — and what a real answer looks like versus a deflection.",
      cardMeta:    "9 min read · CFO · Finance Directors · CEOs",
      tldr: [
        "Most CFOs approve CRM renewals because disrupting the revenue org feels riskier than the cost — not because the ROI is clear.",
        "The foundational question: what did the CRM generate last quarter that a spreadsheet couldn't have? If the answer is vague, you have your answer.",
        "Forecast accuracy below 70% is a direct revenue risk — it means hiring, capacity, and investment decisions are being made on unreliable data.",
        "Ask for a capability audit: what features are contracted, which are activated, which are actually used. In most orgs, 30–50% of contracted capability sits idle.",
      ],
      title:       "CFO Questions to Ask Your CRO to Justify the CRM Investment | GoWarm Insights",
      description: "Your CRM spend is rising and the business case is unclear. Six specific questions a CFO should ask their CRO — with guidance on what a real answer looks like versus a deflection.",
      label:       "CFO · Finance",
      audience:    "CFOs · Finance Directors · CEOs",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "How should a CFO evaluate CRM investment?",
          a: "Ask six specific questions: what did the CRM generate last quarter that a spreadsheet couldn't? What is forecast accuracy and how much comes from the system versus manager judgement? What is the cost per closed deal attributable to CRM-driven activity? What is the real adoption rate measured by data completeness? What capability is being paid for but not used? What would the same outcomes cost with a simpler platform?" },
        { q: "What is a reasonable CRM ROI expectation?",
          a: "A well-adopted CRM should produce measurable outcomes: forecast accuracy within 10% of actual close, shortening deal velocity over time, higher win rates among reps with high CRM adoption, and reduced rep ramp time due to playbooks embedded in the system. If none of these can be demonstrated after two or more years of use, the system has an adoption problem rather than a technology problem." },
        { q: "How do you know if your CRM is worth the cost?",
          a: "The most direct test: can your CRO name three specific deals in the last six months that closed better, faster, or at all because of CRM-driven activity? If they cannot, the CRM is functioning as a system of record rather than a system of action — and the incremental value above a much cheaper contact management tool is unclear." },
      ],
    },

    "crm-roi-cro-response": {
      slug:        "crm-roi-cro-response",
      navLabel:    "Proving CRM ROI to your CFO",
      cardLabel:   "CRM ROI · Finance",
      cardExcerpt: "Candour plus a plan beats a polished deck every time. How to build an honest ROI case — and what options to present when the numbers are weak.",
      cardMeta:    "10 min read · CROs · VP Sales · RevOps",
      tldr: [
        "A polished deck of lagging metrics won't satisfy a financially rigorous CFO. Candour paired with a plan will.",
        "Build the ROI case in three parts: productivity value (time saved per rep), revenue impact (specific deals the system influenced), cost avoidance (what the alternative would cost).",
        "If adoption is low and the numbers are weak, say so — and present three options: invest in adoption, right-size the contract, or evaluate alternatives.",
        "Win rate by adoption cohort is the most compelling metric: split reps into high/low CRM adoption groups and compare close rates. A meaningful gap is hard to argue with.",
      ],
      title:       "How to Prove CRM ROI to Your CFO — and What to Do When the Numbers Are Weak | GoWarm Insights",
      description: "Your CFO is questioning the CRM spend. Here is how to build an honest ROI case using productivity value, revenue impact, and cost avoidance — and what options to present when the current system isn't delivering.",
      label:       "CRM ROI · Finance",
      audience:    "CROs · VP Sales · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you calculate CRM ROI?",
          a: "Build the case in three components: productivity value (time saved per rep multiplied by rep cost, e.g. 45 minutes per day saved across 20 reps at £80k fully loaded = ~£750k recovered time annually), revenue impact (specific deals closed faster or rescued by system activity), and cost avoidance (what the next-best alternative would cost). Most organisations only attempt the third component, which produces weak cases." },
        { q: "What metrics should I show my CFO to justify CRM spend?",
          a: "The five metrics that hold up to scrutiny: forecast accuracy versus actual close (target within 10%); deal velocity trend over 6-8 quarters; win rate by CRM adoption cohort (high vs low users); new rep ramp time before and after CRM adoption; and pipeline coverage ratio accuracy. Avoid vanity metrics like pipeline value or number of activities logged, which don't isolate CRM contribution." },
        { q: "What should you do if your CRM is not delivering ROI?",
          a: "Present three options honestly: invest in an adoption improvement programme with specific targets and a timeline; right-size the contract by auditing unused capability and renegotiating (typically reduces cost 20-40%); or conduct a structured evaluation of alternatives before the next renewal. The worst option is continuing to pay full price for partial value while avoiding the conversation." },
        { q: "How do you reduce CRM costs without switching platforms?",
          a: "Conduct a capability audit: list everything contracted, identify what is activated and what is actually used. Most enterprise CRM contracts include modules sold in the initial deal and never implemented. Renegotiating down to active usage — removing unused modules, adjusting licence tiers — typically reduces cost by 20-40% without changing how the sales team works." },
      ],
    },

    "forecast-accuracy-arr": {
      slug:        "forecast-accuracy-arr",
      navLabel:    "Why your sales forecast is unreliable",
      cardLabel:   "Forecasting · ARR",
      cardExcerpt: "Manual forecast assembly breaks at every step. Here is why the process itself is the problem — and what structured data, ARR timing, and honest accuracy measurement actually look like.",
      cardMeta:    "10 min read · VP Sales · RevOps · CRO",
      tldr: [
        "When RevOps analysts update CRM data with sales leaders, they are correcting a symptom. The root cause is reps not maintaining records accurately in real time.",
        "Structured data (stage, time in stage, days since contact) and unstructured data (rep narrative) have very different reliability properties — your forecast should be built on the first, refined by the second.",
        "ARR timing inconsistency is the most common source of disconnect between sales and finance. Define commit date, signature date, billing start, and revenue recognition separately.",
        "The most revealing metric: track your Commit category close rate over four quarters. Below 75% means your Commit definition is too loose — fix that before any tooling investment.",
      ],
      title:       "Why Your Sales Forecast Is Unreliable — and How to Fix It | GoWarm Insights",
      description: "If your RevOps team is manually assembling your forecast from sales leader conversations, the process itself is the problem. Why manual forecast assembly breaks, what structured vs unstructured data means for accuracy, and how to measure forecast reliability honestly.",
      label:       "Forecasting · ARR",
      audience:    "VP Sales · RevOps · CRO",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "Why is my sales forecast always inaccurate?",
          a: "Manual forecast assembly breaks at four points: CRM data is wrong because reps update it for compliance; the forecast inherits sales leader bias; structured and unstructured data are mixed without distinction; and ARR timing is inconsistent. A reliable forecast is built primarily from structured CRM signals with human judgement used to refine individual deals." },
        { q: "What is the difference between structured and unstructured data in sales forecasting?",
          a: "Structured data is objective CRM signals: time in stage, days since last contact, stakeholders engaged, close date, stage probability. Unstructured data is qualitative rep narrative. A trustworthy forecast builds the baseline from structured data and uses unstructured context only to adjust individual deals at the margin." },
        { q: "When should ARR be counted in a sales forecast?",
          a: "Maintain two numbers: a sales forecast based on signature date and a revenue forecast based on recognition date. These can differ significantly on multi-year deals. The most common source of distrust between finance and revenue leadership is each team using different timing assumptions on the same deal." },
      ],
    },

    "sales-team-task-tracking": {
      slug:        "sales-team-task-tracking",
      navLabel:    "Team task tracking and workflow",
      cardLabel:   "Sales Operations",
      cardExcerpt: "When reps miss follow-ups and deals fall through the cracks, the instinct is to add a tool. Almost always the right fix is to configure the CRM they already have. Here is what that actually looks like.",
      cardMeta:    "9 min read · VP Sales · Sales Managers · RevOps",
      tldr: [
        "Reps miss follow-ups not because they lack a task tool but because no system is telling them what to do next, when, and what happens if they don't.",
        "Project management tools are for flexible work. Sales tasks belong in the CRM — attached to the deal they relate to, visible to the manager without switching tools.",
        "A well-configured CRM generates tasks automatically at every stage transition, assigns them with owners and deadlines, and surfaces overdue tasks to the manager daily.",
        "The most commonly missed configuration: a required handoff note when deal ownership changes. Five minutes to write. Its absence costs multiple customer interactions to recover.",
      ],
      title:       "Your Sales Team Is Missing Follow-Ups and Working from Memory. Here Is What to Fix | GoWarm Insights",
      description: "When reps miss next steps, drop handoffs, and managers cannot see what is happening on deals, the fix is almost never a new tool. It is configuring the CRM they already have. Here is what a well-configured next-step system looks like.",
      label:       "Sales Operations",
      audience:    "VP Sales · Sales Managers · RevOps",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "Should sales teams use a project management tool or CRM for task tracking?",
          a: "Sales tasks belong in the CRM. Every sales task is associated with a specific deal, contact, and stage — disconnecting it into a separate tool means the manager cannot see task status without leaving the pipeline, and task completion has no effect on deal progress. Project management tools are appropriate for work around the sales process: onboarding, campaigns, cross-functional deal support." },
        { q: "How do you stop deals from falling through the cracks?",
          a: "Configure three things: automatic task generation at every stage transition with specific owners and due dates; a no-activity alert surfacing deals with nothing logged in 7-14 days; and a manager view showing overdue tasks and stale deals daily. Together these ensure no deal can go quietly dormant without surfacing to someone who can act." },
        { q: "How do you manage sales rep handoffs effectively?",
          a: "Require three things at every handoff: a complete activity log, a next-step task assigned to the new owner with a due date, and a handoff note written by the departing owner. Make the handoff note a required field when deal ownership changes. Without enforcement it will always be skipped." },
      ],
    },

    "discovery-call-dropoff": {
      slug:        "discovery-call-dropoff",
      navLabel:    "High discovery volume, low stage progression",
      cardLabel:   "Pipeline · Discovery",
      cardExcerpt: "High discovery call volume with alarming drop-off between stages almost always traces to one of three causes. The fix depends entirely on which one — and they require completely different interventions.",
      cardMeta:    "10 min read · VP Sales · Sales Managers · RevOps",
      tldr: [
        "Three root causes — wrong people reaching discovery (ICP failure), calls not establishing value or urgency (quality failure), no committed next step before the call ends (handoff failure). They look similar. They require different fixes.",
        "The diagnostic: pull stage 1 to stage 2 conversion by rep. High variance = skills or process problem. Low conversion across all reps = ICP or qualification problem.",
        "A discovery call that ends with an interested prospect who has no reason to move forward quickly is a failed call — even if every question was asked correctly.",
        "Stage definitions are the upstream fix. If moving to stage 2 means 'the rep thinks it's interesting' rather than confirmed problem, economic buyer, and next step — your pipeline stages carry no information about deal quality.",
      ],
      title:       "High Discovery Call Volume, Low Stage Progression: What to Fix | GoWarm Insights",
      description: "High discovery call volume with alarming drop-off from stage 1 to stage 3 almost always traces to one of three root causes: ICP failure, call quality failure, or next step failure. Here is how to diagnose which one you have — and what to do about it.",
      label:       "Pipeline · Discovery",
      audience:    "VP Sales · Sales Managers · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "Why are deals dropping off after discovery calls?",
          a: "There are three distinct causes: the wrong people are reaching discovery because qualification is too loose; the call is not establishing a compelling problem or urgency; or the call ends without a committed next step. Pull stage 1 to stage 2 conversion by rep — high variance between reps means a skills problem; uniformly low conversion means an ICP or qualification problem." },
        { q: "What should be true before a deal moves from stage 1 to stage 2?",
          a: "Three things confirmed: a specific business problem (not product interest), the economic buyer identified by name, and a specific next step agreed with a date before the call ends. Deals that move without these criteria produce pipeline that looks active but cannot close." },
        { q: "What is a good stage 1 to stage 2 conversion rate?",
          a: "Below 30% indicates a qualification or call quality problem. Above 50% may suggest stage 2 entry criteria are too loose. Track by rep — the variance between reps is more informative than the average and immediately tells you whether you have a market problem or a process problem." },
      ],
    },

    "contact": {
      slug:        "contact",
      title:       "Free CRM Consultation — GoWarm Insights",
      description: "Book a free 30-minute CRM diagnostic call. We'll review your setup, tell you whether you have a platform or adoption problem, and give you 2-3 specific next steps — no pitch, no obligation.",
      schema:      "WebPage",
    },

    "crm-diagnostic": {
      slug:        "crm-diagnostic",
      title:       "Free CRM Diagnostic: Is Your CRM Earning Its Keep? | GoWarm Insights",
      description: "Answer 5 questions about how your team uses your CRM. Get a scored diagnostic — plus specific findings on call logging, stage automation, pipeline reviews, playbook adoption, and forecast reliability.",
      schema:      "WebPage",
    },

  },

  // ── Slug → filename mapping ─────────────────────────────────────────────────
  // Maps the new SEO slugs back to the original HTML filenames
  // so you can rename files without breaking the build.
  // fileMap: maps each page config key to the ACTUAL filename in your repo.
  // These are the filenames as they exist on disk — build.js edits them in place.
  // If you rename a file, update it here.
  fileMap: {
    "index":                            "index.html",
    "is-your-crm-a-crud-app":           "is-your-crm-a-crud-app.html",
    "are-your-sales-playbooks-working":  "are-your-sales-playbooks-working.html",
    "crm-rebuild-or-recommit":          "crm-rebuild-or-recommit.html",
    "crm-integration-complexity":       "crm-integration-complexity.html",
    "revops-stack-crm-foundation":      "revops-stack-crm-foundation.html",
    "contact":                          "contact.html",
    "crm-diagnostic":                   "diagnostic.html",
    "crm-roi-cfo-questions":            "crm-roi-cfo-questions.html",
    "crm-roi-cro-response":             "crm-roi-cro-response.html",
    "forecast-accuracy-arr":            "forecast-accuracy-arr.html",
    "sales-team-task-tracking":         "sales-team-task-tracking.html",
    "discovery-call-dropoff":           "discovery-call-dropoff.html",
    "crm-implementation-guide":         "crm-implementation-guide.html",
    "lead-generation-discovery-meetings": "lead-generation-discovery-meetings.html",
  },

};

module.exports = config;
