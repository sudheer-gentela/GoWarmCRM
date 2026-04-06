"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// site.config.js — single source of truth for all blog metadata
//
// ── Fields required for every NEW article entry ──────────────────────────────
//   slug            URL slug (must match filename without .html)
//   title           Full page title including " | GoWarm Insights" suffix
//   description     Meta description, 140–160 chars ideally
//   schema          "Article" for articles, "WebPage" for index/contact
//   datePublished   YYYY-MM-DD — used in Article schema + sitemap <lastmod>
//   dateModified    YYYY-MM-DD — defaults to datePublished if omitted
//   keywords        Comma-separated string — injected into Article schema
//   cardLabel       Short topic label shown on blog index card
//   cardExcerpt     2–3 sentence teaser for the blog index card
//   cardMeta        Read time + audience string for card footer
//   category        "crm" | "dec" | "ops" | "fin" — drives filter pills
//   roles           Space-separated string: "vps rvp cto cfo ceo"
//   tldr            Array of strings — injected as TL;DR box in article
//   faqs            Array of {q, a} objects — injected as FAQPage schema
//
// ── SEO fields generated automatically by build.js (no manual entry needed) ──
//   BreadcrumbList, Organization, SoftwareApplication, author, image,
//   og:site_name, sitemap <lastmod>
// ─────────────────────────────────────────────────────────────────────────────

const config = {
  // ── Brand & site ──────────────────────────────────────────────────────────
  SITE_URL:         "https://www.gowarmcrm.com/blog",
  PRODUCT_URL:      "https://www.gowarmcrm.com",
  BRAND_PUBLICATION:"GoWarm Insights",
  BRAND_COMPANY:    "GoWarmCRM",
  BRAND_TAGLINE:    "Practical intelligence for B2B sales and business leaders.",
  OG_IMAGE:         "/blog/og-image.png",
  TWITTER_HANDLE:   "@gowarmcrm",

  // ── Organisation identity (used in Article + Organization schemas) ────────
  BRAND_LOGO_URL:   "https://www.gowarmcrm.com/favicon-512x512.png",
  ORG_SOCIAL: [
    "https://twitter.com/gowarmcrm",
    "https://www.linkedin.com/company/gowarmcrm"
  ],

  // ── Pages ─────────────────────────────────────────────────────────────────
  pages: {

    // ── Non-article pages ──────────────────────────────────────────────────
    "index": {
      slug:        "index",
      title:       "GoWarm Insights — Sales Execution Intelligence for B2B Revenue Leaders",
      description: "Practical guides, diagnostics, and frameworks for VP Sales, RevOps, and Sales Directors who want execution intelligence — not just pipeline visibility from their CRM.",
      schema:      "WebPage"
    },

    "contact": {
      slug:        "contact",
      title:       "Book a Free GoWarmCRM Demo — See Your Pipeline With New Eyes",
      description: "Book a free 20-minute GoWarmCRM demo. We'll review your current pipeline setup and show you exactly what the action engine would surface in your data today. No pitch, no obligation.",
      schema:      "WebPage"
    },

    // ── Articles ───────────────────────────────────────────────────────────

    "is-your-crm-a-crud-app": {
      slug:          "is-your-crm-a-crud-app",
      datePublished: "2025-10-15",
      keywords:      "CRM CRUD app, Salesforce wasted investment, CRM adoption, CRM value, sales productivity, system of record vs system of action",
      navLabel:      "Are you using Salesforce as a CRUD app?",
      cardLabel:     "Self-Diagnostic",
      cardExcerpt:   "Five patterns that reveal you're paying $150k/year for a glorified spreadsheet — and what good actually looks like.",
      cardMeta:      "8 min read · VP Sales",
      category:      "crm",
      roles:         "vps ceo",
      tldr: [
        "Most Salesforce users get pipeline visibility and reporting — things a spreadsheet could do.",
        "5 warning signals: reps log calls after the fact, nothing triggers on stage change, pipeline reviews are interrogations, playbooks live in a doc nobody reads, forecast is gut feel.",
        "The diagnostic question: how many automated next steps did your CRM generate in the last 90 days without anyone creating them manually?",
        "The gap between what most orgs do and what's possible isn't a technology gap — it's a configuration and adoption gap."
      ],
      title:       "Is Your CRM Just a CRUD App? 5 Signs You're Wasting Your Investment | GoWarm Insights",
      description: "Most Salesforce users pay $150k/year for pipeline visibility a spreadsheet could provide. Here are 5 diagnostic signals that reveal you're using your CRM as a data entry tool — not a revenue engine.",
      label:       "Self-Diagnostic",
      audience:    "VP Sales · Sales Directors",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "How do I know if my team is using Salesforce properly?", a: "Key signals of poor CRM adoption include: reps logging calls after the fact, no automated next steps after stage changes, pipeline reviews that rely on rep memory rather than system data, playbooks stored in external documents nobody reads, and forecasts based on gut feel rather than system-calculated probability." },
        { q: "What is the average cost of Salesforce for a mid-market company?", a: "When you include licenses, admin overhead, and integrations, the average mid-market company spends between $80,000 and $200,000 per year on Salesforce." },
        { q: "What is a system of action versus a system of record in CRM?", a: "A system of record stores what happened — calls logged, deals tracked, contacts managed. A system of action drives what should happen next — automated tasks, triggered workflows, next-step recommendations. Most CRM implementations function as systems of record when they should be systems of action." },
        { q: "Why do sales reps avoid updating the CRM?", a: "Reps avoid CRM updates when the system gives them nothing useful in return. If logging a call doesn't surface next steps, trigger automations, or make their job easier, it becomes pure compliance work. The fix is a CRM configured to reward good behavior, not just record it." }
      ]
    },

    "are-your-sales-playbooks-working": {
      slug:          "are-your-sales-playbooks-working",
      datePublished: "2025-11-20",
      keywords:      "sales playbook adoption, measure playbook effectiveness, sales execution, playbook metrics, play completion rate",
      navLabel:      "Are your playbooks working?",
      cardLabel:     "Playbooks",
      cardExcerpt:   "A playbook nobody executes is worse than no playbook at all. Here's how to tell the difference — and fix it.",
      cardMeta:      "7 min read · RevOps · Enablement",
      category:      "crm",
      roles:         "rvp vps",
      tldr: [
        "Most orgs have playbooks. Very few have playbook execution — guidance that actually changes rep behaviour at the moment of a sale.",
        "A dormant playbook is worse than no playbook: it creates false confidence that the process is being followed when it isn't.",
        "Three metrics that tell the truth: play completion rate, stage velocity by playbook, win rate by play used.",
        "If a rep has to leave their CRM workflow to find the playbook, adoption will be near zero."
      ],
      title:       "Are Your Sales Playbooks Actually Working? How to Measure Playbook Adoption | GoWarm Insights",
      description: "A playbook nobody executes creates false confidence — it's worse than no playbook at all. Here's how to measure play completion rate, stage velocity, and win rate by playbook to know if yours are working.",
      label:       "Playbooks · Enablement",
      audience:    "RevOps · Sales Enablement",
      readTime:    "7 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you measure sales playbook effectiveness?", a: "The three core metrics are: play completion rate, stage velocity by playbook, and win rate by play used." },
        { q: "Why do sales playbooks fail to get adopted?", a: "Playbooks fail when they're designed as training documents rather than operational tools. If reps have to leave their CRM workflow to find and read a playbook, adoption approaches zero." },
        { q: "What is the difference between a playbook and playbook execution?", a: "A playbook is a document. Playbook execution is the system by which that guidance actually changes rep behavior at the moment of a sales interaction." },
        { q: "What is a good play completion rate for sales playbooks?", a: "A completion rate below 40% indicates the play isn't being used. Above 80% with no outcome differentiation suggests reps are ticking boxes without it changing behavior." }
      ]
    },

    "crm-rebuild-or-recommit": {
      slug:          "crm-rebuild-or-recommit",
      datePublished: "2025-12-10",
      keywords:      "Salesforce vs HubSpot, CRM decision framework, switch CRM, rebuild CRM, custom CRM build, CRM switching costs",
      navLabel:      "Rebuild or recommit?",
      cardLabel:     "Decision Framework",
      cardExcerpt:   "Not a vendor pitch. A real decision framework for whether to stay, switch, or build — and how to avoid the status quo trap.",
      cardMeta:      "10 min read · CTO · VP Sales",
      category:      "dec",
      roles:         "cto vps ceo",
      tldr: [
        "Before evaluating alternatives, answer honestly: is this a platform problem or an adoption and configuration problem? Most orgs mistake the second for the first.",
        "Salesforce is right for you if: complex multi-stakeholder deals, dedicated admin capacity, 50+ reps, significant existing integrations.",
        "True switching costs: data migration (budget 2–3x the vendor estimate), 60–90 days of reduced rep productivity, process redesign, integration rebuilds.",
        "The worst outcome: six months of evaluation, organisational energy around change, then returning to the status quo with nothing changed."
      ],
      title:       "Salesforce vs Switch vs Build Custom: The Honest CRM Decision Framework | GoWarm Insights",
      description: "Should you stay on Salesforce, move to a lighter CRM, or build custom? A real evaluation framework covering true switching costs, when custom makes sense, and how to avoid spending 6 months evaluating and returning to the status quo.",
      label:       "Decision Framework",
      audience:    "CTO · VP Sales",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do I know if Salesforce is the right CRM for my company?", a: "Salesforce is the right fit if you have a genuinely complex sales process, dedicated Salesforce admin capacity, a team of 50+ reps, and existing data and integrations that would be expensive to rebuild." },
        { q: "What is the true cost of switching CRM systems?", a: "The true cost includes data migration (typically 2-3x the vendor's estimate), rep retraining and 60-90 days of reduced productivity, process redesign, and integration rebuilds." },
        { q: "When does building a custom CRM make sense?", a: "Custom CRM makes sense when your sales process has genuinely idiosyncratic requirements no commercial platform addresses, the business logic is core IP, and you can commit to owning the system for 3+ years." }
      ]
    },

    "crm-integration-complexity": {
      slug:          "crm-integration-complexity",
      datePublished: "2025-11-28",
      keywords:      "CRM integration complexity, Salesforce integration, CRM migration, tech stack integration, load-bearing integrations",
      navLabel:      "The integration trap",
      cardLabel:     "Integration Strategy",
      cardExcerpt:   "You have 12 integrations and a working system. Here's how to separate legitimate switching costs from integration inertia — and what to do about either.",
      cardMeta:      "9 min read · VP Sales · RevOps · CTO",
      category:      "crm",
      roles:         "rvp cto vps",
      tldr: [
        "Integration complexity is the most effective reason organisations give for tolerating a CRM that isn't delivering — and it's often used as an excuse, not a genuine constraint.",
        "Three categories: load-bearing (genuinely critical), convenience (real value, rebuildable), ghost (no live purpose, just inflates switching cost).",
        "Integration quality degrades silently — the sync that worked in 2021 may be dropping records today.",
        "Staying and fixing is only legitimate as a strategy if you can answer: fix what, by when, measured how?"
      ],
      title:       "CRM Integration Complexity: Legitimate Cost or Excuse for Inertia? | GoWarm Insights",
      description: "You have 12 integrations and a working system. Before using that as a reason to avoid fixing your CRM, audit what those integrations actually do. A framework for separating load-bearing integrations from convenience and ghost integrations.",
      label:       "Integration Strategy",
      audience:    "VP Sales · RevOps · CTO",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you decide if CRM integration complexity justifies staying on your current platform?", a: "Classify your integrations into three categories: load-bearing, convenience, and ghost. Only load-bearing integrations deserve serious weight in switching cost calculations." },
        { q: "What percentage of CRM integrations are actually still needed?", a: "In most CRM audits, 20-30% of integrations are ghost integrations — built for use cases that have since changed or disappeared." },
        { q: "When is it right to stay on Salesforce and fix the configuration?", a: "Staying and fixing is the right answer when load-bearing integrations are genuinely complex and proprietary, when the team has deep institutional knowledge, or when a major business event within 18 months makes disruption particularly costly." }
      ]
    },

    "revops-stack-crm-foundation": {
      slug:          "revops-stack-crm-foundation",
      datePublished: "2025-10-30",
      keywords:      "RevOps tech stack, CRM data quality, Gong Clari integration, revenue operations foundation, sales intelligence tools",
      navLabel:      "Do your RevOps tools actually help?",
      cardLabel:     "RevOps Stack",
      cardExcerpt:   "Gong, Clari, Outreach — great tools. But intelligence layers built on broken CRM data amplify noise, not signal. Here's the honest diagnostic.",
      cardMeta:      "9 min read · RevOps · VP Sales · Sales Ops",
      category:      "crm",
      roles:         "rvp cto",
      tldr: [
        "Tools like Outreach exist because CRMs failed at the workflow layer. In a well-designed system, what they do belongs inside the CRM itself.",
        "Gong and Clari are genuinely different — conversation intelligence and revenue forecasting are capabilities the CRM was never designed to provide.",
        "But both depend heavily on CRM data quality. Clari running on inflated pipeline and stale close dates produces a forecast that looks precise and is structurally wrong.",
        "Fix the foundation first. Intelligence tools amplify what's underneath them — good or bad."
      ],
      title:       "Why Your Gong, Clari, and Outreach Stack Depends on CRM Data Quality | GoWarm Insights",
      description: "RevOps tools like Gong and Clari are intelligence multipliers — but they're only as good as the CRM data they read. Broken CRM foundation means your forecasting model is fitting corrupted data.",
      label:       "RevOps Stack",
      audience:    "RevOps · VP Sales · Sales Ops",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "Do I need to fix my CRM if I already have Gong and Clari?", a: "Yes — more urgently than if you didn't have them. These tools amplify what's underneath them — good or bad." },
        { q: "What is the difference between sales engagement tools and CRM?", a: "Tools like Outreach and Salesloft primarily do what a well-configured CRM should handle natively. They exist as a category because CRMs historically failed at the workflow layer." },
        { q: "Is Gong a replacement for CRM?", a: "No. Gong is a conversation intelligence layer that sits above CRM data. But Gong's insights depend heavily on calls being linked to accurate opportunity records in the CRM." }
      ]
    },

    "crm-implementation-guide": {
      slug:          "crm-implementation-guide",
      datePublished: "2025-10-10",
      keywords:      "CRM implementation guide, how to implement a CRM, CRM setup best practices, Salesforce implementation, CRM change management",
      navLabel:      "How to implement a CRM",
      cardLabel:     "CRM Implementation",
      cardExcerpt:   "Most implementations fail not because of the tool chosen, but because the process wasn't documented first. A framework covering process design, tool selection, change management, and the first 90 days.",
      cardMeta:      "10 min read · VP Sales · Sales Ops · RevOps",
      category:      "dec",
      roles:         "vps rvp",
      tldr: [
        "The tool is the last decision, not the first.",
        "Document your actual sales process — not the ideal one — before opening a single demo.",
        "Change management is the implementation. Reps will use a system that helps them sell and ignore one that doesn't.",
        "Five first-90-days mistakes: configuring for the ideal process, too many fields too early, no data quality owner, measuring adoption by logins, treating go-live as the finish line."
      ],
      title:       "How to Implement a CRM: A Practical Framework for Getting It Right | GoWarm Insights",
      description: "Most CRM implementations fail not because of the tool chosen, but because the process wasn't documented before the tool was selected.",
      label:       "CRM Implementation",
      audience:    "VP Sales · Sales Ops · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "What is the first step in implementing a CRM?", a: "Document your actual sales process before evaluating any tools. Spend two weeks talking to sales reps about how they sell today — not how you want them to sell." },
        { q: "Which CRM should a small or mid-market B2B company implement?", a: "The right CRM depends on your sales motion. High-volume short-cycle sales suit HubSpot or Pipedrive. Enterprise multi-stakeholder deals justify Salesforce." },
        { q: "How do you get sales reps to adopt a new CRM?", a: "Design the CRM for rep productivity, not just management visibility. Involve reps in configuration before it's finished. Adoption typically takes 60-90 days of consistent reinforcement after go-live." }
      ]
    },

    "lead-generation-discovery-meetings": {
      slug:          "lead-generation-discovery-meetings",
      datePublished: "2025-10-20",
      keywords:      "lead generation B2B, book discovery meetings, SDR outreach, improve pipeline generation, ICP definition, lead to SAL rate",
      navLabel:      "Improving lead generation",
      cardLabel:     "Lead Generation",
      cardExcerpt:   "Most lead gen underperformance is a definition problem, not a volume problem. ICP, qualification frameworks, and the metrics that show where your funnel is actually breaking.",
      cardMeta:      "10 min read · VP Sales · Head of Growth · RevOps",
      category:      "ops",
      roles:         "vps rvp",
      tldr: [
        "Most lead gen underperformance is a definition problem, not a volume problem.",
        "A usable ICP has four parts: firmographic profile, situational trigger, buyer persona, and a disqualifying signal.",
        "The metrics that actually diagnose the problem: lead-to-SAL rate, contact-to-meeting rate, meeting show rate, discovery-to-opportunity rate.",
        "Add volume only when ICP is tight, messaging is working, show rate is healthy, and discovery conversion is strong."
      ],
      title:       "How to Improve Lead Generation and Book More Discovery Meetings | GoWarm Insights",
      description: "Most lead gen underperformance is a definition problem, not a volume problem. Before hiring more SDRs or buying another sequencing tool, get alignment on ICP, lead qualification, and the metrics that show where your funnel is breaking.",
      label:       "Lead Generation",
      audience:    "VP Sales · Head of Growth · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you improve B2B lead generation?", a: "Start by diagnosing where the funnel is breaking before changing volume or tooling." },
        { q: "What is an ideal customer profile (ICP) and how do you define one?", a: "A usable ICP has four components: a firmographic profile, a situational trigger, a buyer persona, and a disqualifying signal." },
        { q: "What is a good discovery meeting show rate?", a: "A healthy meeting show rate is 70% or above." }
      ]
    },

    "crm-roi-cfo-questions": {
      slug:          "crm-roi-cfo-questions",
      datePublished: "2025-10-25",
      keywords:      "CRM ROI, CFO CRM questions, justify CRM investment, CRM business case, CRM cost per deal",
      navLabel:      "CFO questions on CRM spend",
      cardLabel:     "CFO · Finance",
      cardExcerpt:   "Your CRM line item is growing and the answers are vague. Six specific questions that cut through — and what a real answer looks like versus a deflection.",
      cardMeta:      "9 min read · CFO · Finance Directors · CEOs",
      category:      "fin",
      roles:         "cfo ceo",
      tldr: [
        "Most CFOs approve CRM renewals because disrupting the revenue org feels riskier than the cost — not because the ROI is clear.",
        "The foundational question: what did the CRM generate last quarter that a spreadsheet couldn't have?",
        "Forecast accuracy below 70% is a direct revenue risk.",
        "Ask for a capability audit: what features are contracted, which are activated, which are actually used."
      ],
      title:       "CFO Questions to Ask Your CRO to Justify the CRM Investment | GoWarm Insights",
      description: "Your CRM spend is rising and the business case is unclear. Six specific questions a CFO should ask their CRO.",
      label:       "CFO · Finance",
      audience:    "CFOs · Finance Directors · CEOs",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "How should a CFO evaluate CRM investment?", a: "Ask six specific questions: what did the CRM generate last quarter that a spreadsheet couldn't? What is forecast accuracy? What is the cost per closed deal? What is the real adoption rate? What capability is being paid for but not used? What would the same outcomes cost with a simpler platform?" },
        { q: "What is a reasonable CRM ROI expectation?", a: "A well-adopted CRM should produce measurable outcomes: forecast accuracy within 10% of actual close, shortening deal velocity over time, and higher win rates among reps with high CRM adoption." },
        { q: "How do you know if your CRM is worth the cost?", a: "Can your CRO name three specific deals in the last six months that closed better, faster, or at all because of CRM-driven activity?" }
      ]
    },

    "crm-roi-cro-response": {
      slug:          "crm-roi-cro-response",
      datePublished: "2025-11-01",
      keywords:      "prove CRM ROI, CRM investment value, CRM productivity metrics, sales technology ROI, win rate by adoption cohort",
      navLabel:      "Proving CRM ROI to your CFO",
      cardLabel:     "CRM ROI · Finance",
      cardExcerpt:   "Candour plus a plan beats a polished deck every time. How to build an honest ROI case — and what options to present when the numbers are weak.",
      cardMeta:      "10 min read · CROs · VP Sales · RevOps",
      category:      "fin",
      roles:         "vps cfo ceo",
      tldr: [
        "A polished deck of lagging metrics won't satisfy a financially rigorous CFO. Candour paired with a plan will.",
        "Build the ROI case in three parts: productivity value, revenue impact, cost avoidance.",
        "If adoption is low and the numbers are weak, say so — and present three options.",
        "Win rate by adoption cohort is the most compelling metric."
      ],
      title:       "How to Prove CRM ROI to Your CFO — and What to Do When the Numbers Are Weak | GoWarm Insights",
      description: "Your CFO is questioning the CRM spend. Here is how to build an honest ROI case using productivity value, revenue impact, and cost avoidance.",
      label:       "CRM ROI · Finance",
      audience:    "CROs · VP Sales · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "How do you calculate CRM ROI?", a: "Build the case in three components: productivity value (time saved per rep multiplied by rep cost), revenue impact (specific deals closed faster or rescued), and cost avoidance (what the next-best alternative would cost)." },
        { q: "What metrics should I show my CFO to justify CRM spend?", a: "Forecast accuracy versus actual close; deal velocity trend; win rate by CRM adoption cohort; new rep ramp time; and pipeline coverage ratio accuracy." },
        { q: "What should you do if your CRM is not delivering ROI?", a: "Present three options honestly: invest in an adoption improvement programme; right-size the contract; or conduct a structured evaluation of alternatives." }
      ]
    },

    "forecast-accuracy-arr": {
      slug:          "forecast-accuracy-arr",
      datePublished: "2025-12-01",
      keywords:      "sales forecast accuracy, ARR forecast, pipeline forecasting, improve sales forecast, RevOps forecasting, structured vs unstructured data",
      navLabel:      "Why your sales forecast is unreliable",
      cardLabel:     "Forecasting · ARR",
      cardExcerpt:   "Manual forecast assembly breaks at every step. Here is why the process itself is the problem — and what structured data, ARR timing, and honest accuracy measurement actually look like.",
      cardMeta:      "10 min read · VP Sales · RevOps · CRO",
      category:      "ops",
      roles:         "vps rvp ceo",
      tldr: [
        "When RevOps analysts update CRM data with sales leaders, they are correcting a symptom. The root cause is reps not maintaining records accurately in real time.",
        "Structured data and unstructured data have very different reliability properties — your forecast should be built on the first, refined by the second.",
        "ARR timing inconsistency is the most common source of disconnect between sales and finance.",
        "Track your Commit category close rate over four quarters. Below 75% means your Commit definition is too loose."
      ],
      title:       "Why Your Sales Forecast Is Unreliable — and How to Fix It | GoWarm Insights",
      description: "If your RevOps team is manually assembling your forecast from sales leader conversations, the process itself is the problem.",
      label:       "Forecasting · ARR",
      audience:    "VP Sales · RevOps · CRO",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "Why is my sales forecast always inaccurate?", a: "Manual forecast assembly breaks at four points: CRM data is wrong; the forecast inherits sales leader bias; structured and unstructured data are mixed; and ARR timing is inconsistent." },
        { q: "What is the difference between structured and unstructured data in sales forecasting?", a: "Structured data is objective CRM signals. Unstructured data is qualitative rep narrative. A trustworthy forecast builds the baseline from structured data." },
        { q: "When should ARR be counted in a sales forecast?", a: "Maintain two numbers: a sales forecast based on signature date and a revenue forecast based on recognition date." }
      ]
    },

    "sales-team-task-tracking": {
      slug:          "sales-team-task-tracking",
      datePublished: "2025-11-18",
      keywords:      "sales task tracking, sales follow-up system, CRM task management, rep next steps, deal handoff process",
      navLabel:      "Team task tracking and workflow",
      cardLabel:     "Sales Operations",
      cardExcerpt:   "When reps miss follow-ups and deals fall through the cracks, the instinct is to add a tool. Almost always the right fix is to configure the CRM they already have.",
      cardMeta:      "9 min read · VP Sales · Sales Managers · RevOps",
      category:      "ops",
      roles:         "vps rvp",
      tldr: [
        "Reps miss follow-ups not because they lack a task tool but because no system is telling them what to do next.",
        "Sales tasks belong in the CRM — attached to the deal they relate to, visible to the manager without switching tools.",
        "A well-configured CRM generates tasks automatically at every stage transition.",
        "The most commonly missed configuration: a required handoff note when deal ownership changes."
      ],
      title:       "Your Sales Team Is Missing Follow-Ups and Working from Memory. Here Is What to Fix | GoWarm Insights",
      description: "When reps miss next steps, drop handoffs, and managers cannot see what is happening on deals, the fix is almost never a new tool. It is configuring the CRM they already have.",
      label:       "Sales Operations",
      audience:    "VP Sales · Sales Managers · RevOps",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "Should sales teams use a project management tool or CRM for task tracking?", a: "Sales tasks belong in the CRM. Every sales task is associated with a specific deal, contact, and stage." },
        { q: "How do you stop deals from falling through the cracks?", a: "Configure automatic task generation at every stage transition, a no-activity alert, and a manager view showing overdue tasks and stale deals daily." },
        { q: "How do you manage sales rep handoffs effectively?", a: "Require a complete activity log, a next-step task assigned to the new owner, and a handoff note at every handoff." }
      ]
    },

    "discovery-call-dropoff": {
      slug:          "discovery-call-dropoff",
      datePublished: "2025-11-10",
      keywords:      "discovery call drop-off, stage progression sales, pipeline conversion rate, sales funnel leaks, stage 1 to stage 2 conversion",
      navLabel:      "High discovery volume, low stage progression",
      cardLabel:     "Pipeline · Discovery",
      cardExcerpt:   "High discovery call volume with alarming drop-off between stages almost always traces to one of three causes. The fix depends entirely on which one — and they require completely different interventions.",
      cardMeta:      "10 min read · VP Sales · Sales Managers · RevOps",
      category:      "ops",
      roles:         "vps rvp",
      tldr: [
        "Three root causes — ICP failure, call quality failure, next step failure. They look similar. They require different fixes.",
        "Pull stage 1 to stage 2 conversion by rep. High variance = skills or process problem. Low conversion across all reps = ICP or qualification problem.",
        "A discovery call that ends with an interested prospect who has no reason to move forward quickly is a failed call.",
        "Stage definitions are the upstream fix."
      ],
      title:       "High Discovery Call Volume, Low Stage Progression: What to Fix | GoWarm Insights",
      description: "High discovery call volume with alarming drop-off from stage 1 to stage 3 almost always traces to one of three root causes: ICP failure, call quality failure, or next step failure.",
      label:       "Pipeline · Discovery",
      audience:    "VP Sales · Sales Managers · RevOps",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "Why are deals dropping off after discovery calls?", a: "There are three distinct causes: wrong people reaching discovery; call not establishing compelling problem or urgency; call ends without committed next step." },
        { q: "What should be true before a deal moves from stage 1 to stage 2?", a: "Three things confirmed: a specific business problem, the economic buyer identified by name, and a specific next step agreed with a date." },
        { q: "What is a good stage 1 to stage 2 conversion rate?", a: "Below 30% indicates a qualification or call quality problem. Above 50% may suggest stage 2 entry criteria are too loose." }
      ]
    },

    "account-research-module-build-vs-buy": {
      slug:          "account-research-module-build-vs-buy",
      datePublished: "2025-11-15",
      keywords:      "account research module, Salesforce account research, build vs buy CRM, AppExchange tools, custom Salesforce module, CRM architecture",
      navLabel:      "Account research: build, buy or configure?",
      cardLabel:     "CRM Architecture",
      cardExcerpt:   "Native config, AppExchange, custom Salesforce module, or fully custom CRM — four options with very different total cost of ownership.",
      cardMeta:      "12 min read · CTO · VP Sales · RevOps",
      category:      "dec",
      roles:         "cto vps rvp ceo",
      tldr: [
        "The right answer depends on how differentiated your research process actually is, your internal technical capacity, and three-year TCO — not year-one cost.",
        "AppExchange tools carry three underestimated risks: data residency exposure, sync reliability degradation, and switching costs higher than they appear.",
        "A custom Salesforce module is a maintain-forever commitment. Budget ongoing developer time from day one.",
        "A fully custom CRM is a product, not a project. Most organisations underestimate the perpetual engineering ownership required.",
        "AI-native research tools have emerged as a credible fifth option. Run a 30-day pilot before concluding custom is necessary."
      ],
      title:       "Build, Buy or Configure? Choosing the Right Account Research Module | GoWarm Insights",
      description: "Should you configure Salesforce natively, install an AppExchange tool, build a custom Salesforce module, or move to a fully custom CRM? A decision framework based on total cost of ownership.",
      label:       "Build vs Buy · CRM Architecture",
      audience:    "CTO · VP Sales · RevOps · Sales Ops",
      readTime:    "12 min read",
      schema:      "Article",
      faqs: [
        { q: "Should I build a custom CRM or use Salesforce?", a: "A custom CRM is right in a narrow set of circumstances: proprietary logic no commercial CRM can accommodate, an engineering team that can own the platform indefinitely, and validated that existing platforms genuinely cannot meet your requirements." },
        { q: "What are the risks of using an AppExchange tool for CRM enrichment?", a: "Data residency and compliance exposure, sync reliability that degrades silently, and switching costs higher than they appear after 18 months of enrichment." },
        { q: "When does it make sense to build a custom module inside Salesforce?", a: "When your research process is genuinely differentiated and you have internal Salesforce development capacity that can maintain the code across three annual platform releases." }
      ]
    },

    "pricing-approval-workflow-crm": {
      slug:          "pricing-approval-workflow-crm",
      datePublished: "2025-12-12",
      keywords:      "pricing approval workflow, CRM approval process, Salesforce CPQ, sales pricing automation, pricing audit trail",
      navLabel:      "Pricing approval workflows: configure, build or buy?",
      cardLabel:     "CRM Architecture",
      cardExcerpt:   "Native Salesforce handles most pricing approval use cases without additional tooling. Here is how to know if your situation is in that majority.",
      cardMeta:      "11 min read · VP Sales · RevOps · CTO",
      category:      "dec",
      roles:         "cto vps rvp ceo",
      tldr: [
        "Most organisations over-engineer pricing approval. Native Salesforce approval processes handle the majority of use cases without any additional tooling or cost.",
        "CPQ tools are justified when your quoting process is complex. They are not justified for discount governance on a straightforward product set.",
        "Pricing approval audit trails have downstream commercial and legal significance.",
        "Before evaluating any tool: write your approval trigger conditions, approval chain, and approver roles on one page."
      ],
      title:       "Pricing Approval Workflows: Should You Configure, Build or Buy? | GoWarm Insights",
      description: "Should you configure a native Salesforce approval process, install a CPQ or AppExchange tool, build a custom module, or use a standalone solution? A decision framework covering audit trail requirements, approval complexity, and total cost of ownership.",
      label:       "Sales Process · CRM Architecture",
      audience:    "VP Sales · RevOps · CTO · Sales Ops",
      readTime:    "11 min read",
      schema:      "Article",
      faqs: [
        { q: "Can Salesforce handle pricing approval workflows natively?", a: "Yes, for the majority of use cases. Salesforce's built-in approval process engine supports multi-step approvals, conditional entry criteria, and a complete immutable audit history." },
        { q: "When do you need CPQ for pricing approval?", a: "CPQ is justified when the approval workflow is inseparable from a complex quoting problem: bundling logic, configuration rules, and volume pricing that need to be enforced before a quote reaches the approval stage." },
        { q: "What are the audit trail requirements for pricing approval?", a: "Pricing approval records need to be immutable, accessible to finance and legal without requiring Salesforce access, and retained for the appropriate period." }
      ]
    },

    "pipeline-deals-going-dark": {
      slug:          "pipeline-deals-going-dark",
      datePublished: "2025-11-05",
      keywords:      "deals going dark, pipeline stall, deal gone dark, CRM deal monitoring, sales pipeline health, stage 3 pipeline risk",
      navLabel:      "Why your best deals go dark",
      cardLabel:     "Pipeline Health",
      cardExcerpt:   "The gap between stage 3 and stage 4 is where most revenue disappears. Five signals that reveal a deal going dark — and the rescue pattern that catches them before they are gone.",
      cardMeta:      "8 min read · VP Sales · RevOps",
      category:      "ops",
      roles:         "vps rvp",
      tldr: [
        "Deals go dark at stage 3 because the rep has done their job and the CRM shows a healthy pipeline while the deal quietly dies.",
        "The earliest signal: response latency increasing. Hours to days — visible in your activity log before any other indicator.",
        "The most diagnostic signal: when did the prospect last actually respond?",
        "Rescue outreach: acknowledge the silence, create a reason to re-engage, make disqualification easy."
      ],
      title:       "Why Your Best Deals Go Dark — and How to Catch Them Before They Are Gone | GoWarm Insights",
      description: "The gap between stage 3 and stage 4 is where most revenue disappears. Five CRM signals that reveal deals going dark, why stage 3 is structurally dangerous, and the rescue pattern that works before it is too late.",
      label:       "Pipeline Health",
      audience:    "VP Sales · RevOps",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "Why do deals go dark in sales pipelines?", a: "Deals go dark at stage 3 because the rep has less control here, the champion's urgency dissipates after the sales conversation, and the CRM shows the deal as active so nothing triggers an alert." },
        { q: "What are the signs a deal is going dark?", a: "Five signals: response latency increasing; last two-way interaction over 10 days old; economic buyer never directly engaged; close date pushed more than once; no mutual next step with a future date." },
        { q: "How do you rescue a dark deal?", a: "Acknowledge the silence directly, create a specific reason to re-engage beyond wanting a decision, and make disqualification easy." }
      ]
    },

    "per-user-ai-settings-crm": {
      slug:          "per-user-ai-settings-crm",
      datePublished: "2025-12-15",
      keywords:      "AI CRM settings, per-user AI configuration, sales AI personalisation, CRM AI tools, role-based AI defaults",
      navLabel:      "Per-user AI settings in your CRM",
      cardLabel:     "AI in CRM",
      cardExcerpt:   "AEs, SDRs, and CSMs need fundamentally different intelligence from their CRM. When one AI configuration serves everyone, most of it is noise.",
      cardMeta:      "6 min read · Sales Leaders · RevOps",
      category:      "crm",
      roles:         "vps rvp ceo",
      tldr: [
        "One AI configuration for all roles is the primary reason CRM AI has high demo appeal and low adoption.",
        "AEs need deal health and prioritised actions. SDRs need pre-contact research briefs. CSMs need churn signals. Managers need exceptions. These are different products.",
        "The right model: role-based defaults defined by RevOps, user-level overrides for specialists.",
        "The adoption test: ask users across roles what the AI told them this week that they acted on."
      ],
      title:       "Per-User AI Settings: Why One Prompt Does Not Fit Your Whole Sales Team | GoWarm Insights",
      description: "AEs, SDRs, and CSMs need different AI intelligence from their CRM. When a single configuration serves everyone, most of it is noise.",
      label:       "AI in CRM",
      audience:    "Sales Leaders · RevOps",
      readTime:    "6 min read",
      schema:      "Article",
      faqs: [
        { q: "Why do CRM AI features have low adoption?", a: "Most CRM AI is configured once and served uniformly to all users. The output is not close enough to what any specific role needs to be immediately actionable." },
        { q: "What AI does an AE need versus an SDR?", a: "AEs need deal health signals and prioritised actions. SDRs need pre-contact account research." },
        { q: "How should per-user CRM AI be configured?", a: "Role-based defaults by RevOps, with user-level overrides. Each role gets a default covering data scope, output format, trigger conditions, and prompt context." }
      ]
    },

    "playbook-adoption-crm": {
      slug:          "playbook-adoption-crm",
      datePublished: "2025-11-25",
      keywords:      "playbook adoption, sales playbook CRM, why playbooks fail, sales execution platform, play completion rate",
      navLabel:      "The playbook adoption problem nobody talks about",
      cardLabel:     "Playbooks",
      cardExcerpt:   "You built the playbook. Nobody is following it. The problem is not culture — it is that your CRM does not surface the next play at the moment it matters.",
      cardMeta:      "7 min read · Enablement · VP Sales",
      category:      "crm",
      roles:         "vps rvp",
      tldr: [
        "Playbook adoption is primarily a delivery problem. A rep in a difficult conversation will not leave their CRM to find the enablement platform.",
        "The fix: playbook content lives inside the CRM, attached to the relevant stage, visible without navigation.",
        "Effective delivery is contextual: the right play surfaces based on deal attributes.",
        "The meaningful metric is play completion rate."
      ],
      title:       "The Playbook Adoption Problem Nobody Talks About | GoWarm Insights",
      description: "You built the playbook. Nobody is following it. The issue is not culture — your CRM does not surface the next play at the moment it matters.",
      label:       "Playbooks",
      audience:    "Enablement · VP Sales",
      readTime:    "7 min read",
      schema:      "Article",
      faqs: [
        { q: "Why do sales reps not follow playbooks?", a: "The primary reason is delivery, not culture. A rep in a difficult conversation will not leave their CRM to find the playbook." },
        { q: "How do you increase sales playbook adoption?", a: "Move the playbook into the CRM as executable tasks. Configure contextual delivery based on deal attributes. Track play completion rate rather than content engagement." },
        { q: "What is play completion rate?", a: "The percentage of plays triggered by deal conditions that were actually completed by the assigned rep." }
      ]
    },

    // ── NEW ARTICLES (April 2026) ────────────────────────────────────────────

    "playbook-segmentation-smb-enterprise-geography": {
      slug:          "playbook-segmentation-smb-enterprise-geography",
      datePublished: "2026-12-08",
      keywords:      "sales playbook segmentation, SMB vs enterprise playbook, playbook by geography, B2B sales playbook, multi-segment sales process",
      navLabel:      "Playbooks for every segment and geography",
      cardLabel:     "Playbooks & Enablement",
      cardExcerpt:   "A single playbook that tries to serve SMB, Mid-Market, and Enterprise across the US, Europe, and APAC is a compromise document. Here's how to segment intelligently without losing your team in the complexity.",
      cardMeta:      "11 min read · VP Sales · Revenue Leaders",
      category:      "ops",
      roles:         "vps rvp ceo",
      tldr: [
        "A single playbook across SMB, Mid-Market, and Enterprise is not efficiency — it's a compromise that serves nobody well.",
        "Market segment, geography, and product maturity are three independent dimensions that each materially change how a deal is won.",
        "New-product sales require an education-first playbook. Established-product sales require a displacement playbook. Mixing them is one of the most common causes of missed quota in expansion markets.",
        "The solution to playbook complexity is not fewer playbooks — it's a CRM that surfaces the right play automatically based on deal attributes."
      ],
      title:       "Why Your Sales Playbook Cannot Be the Same for SMB, Mid-Market, Enterprise — and Every Geography | GoWarm Insights",
      description: "A single playbook that tries to serve SMB, Mid-Market, and Enterprise across the US, Europe, and APAC is not a playbook — it's a compromise document. Here's how to segment intelligently and manage the complexity without your team losing the plot.",
      label:       "Playbooks · Enablement",
      audience:    "VP Sales · Revenue Leaders",
      readTime:    "11 min read",
      schema:      "Article",
      faqs: [
        { q: "Should SMB and Enterprise sales teams use the same playbook?", a: "No. SMB and Enterprise deals differ fundamentally in cycle length, stakeholder count, decision-making process, and the role of price. The minimum viable segmentation is three playbooks: one for SMB, one for Mid-Market, one for Enterprise — with geographic and product maturity variants layered on top." },
        { q: "How do sales playbooks need to change for different geographies?", a: "US buyers move faster and expect direct ROI conversations early. European buyers prefer structured processes and technical depth. APAC buying is relationship-driven with longer trust-building phases. These differences require adapted cadence lengths, messaging anchors, and meeting formats." },
        { q: "How does product maturity change the sales playbook?", a: "A new product requires an education-first playbook: establish the problem before positioning the solution. An established product shifts to a differentiation and displacement playbook. Mixing these frameworks is one of the most common causes of playbook underperformance." },
        { q: "How many playbooks is too many? How do you manage playbook complexity?", a: "The answer is not to reduce the number of playbooks but to make the right playbook visible at the right moment. Build as many playbooks as the data says you need, then solve the delivery problem with the CRM system." }
      ]
    },

    "crm-owner-capabilities": {
      slug:          "crm-owner-capabilities",
      datePublished: "2026-12-05",
      keywords:      "CRM ownership, RevOps CRM admin, who should own CRM, CRM manager profile, CRM administrator vs CRM owner",
      navLabel:      "Who should own your CRM tech stack?",
      cardLabel:     "CRM Decisions",
      cardExcerpt:   "Most organisations assign CRM ownership to the most technical person available. What they actually need is the best coordinator in the building — and those are rarely the same person.",
      cardMeta:      "10 min read · RevOps · Sales Leaders",
      category:      "dec",
      roles:         "cto vps rvp ceo",
      tldr: [
        "CRM ownership is primarily a coordination and governance problem, not a technical one. The wrong hire optimises the system. The right hire makes the system matter to the business.",
        "The single most important capability is stakeholder management: holding the competing interests of Sales, Marketing, Finance, and IT in tension and making decisions most of the room can live with.",
        "Project management discipline is what separates CRM owners who deliver a roadmap from those who manage an endless queue of requests without visible progress.",
        "Technology fluency matters — but it's a threshold requirement, not a differentiator.",
        "Where the role sits in the org chart matters less than whether the person has credibility across all stakeholder groups."
      ],
      title:       "Who Should Own Your CRM Tech Stack? The Profile Most Companies Get Wrong | GoWarm Insights",
      description: "Most organisations give CRM ownership to the most technically capable person available. That's the wrong decision. Here's the profile of the person who actually succeeds in the role — and the common miscast patterns that quietly derail revenue operations.",
      label:       "CRM Decisions",
      audience:    "RevOps · Sales Leaders · CTOs",
      readTime:    "10 min read",
      schema:      "Article",
      faqs: [
        { q: "Who should own the CRM in a company?", a: "CRM ownership works best with someone who has strong project management capability, a track record of stakeholder management across Sales, Marketing, Finance, and IT, and functional understanding of the technology landscape. The role is primarily a coordination and governance function, not a configuration function." },
        { q: "What skills does a CRM owner need?", a: "The critical skills are: structured project management, stakeholder management across all revenue functions, technology literacy sufficient to evaluate vendor claims and trade-offs, and change management capability to drive adoption. Technical configuration skill is useful but secondary." },
        { q: "Should CRM ownership sit in Sales, IT, or Operations?", a: "Each placement has predictable failure modes. Revenue Operations is usually the most balanced structural choice, but only works if the owner has genuine credibility with both Sales and IT. Structure should follow the person, not precede them." },
        { q: "What is the difference between a CRM administrator and a CRM owner?", a: "A CRM administrator manages technical configuration. A CRM owner is accountable for outcomes: data quality, adoption rates, process adherence, and the platform roadmap. Many organisations have administrators and mistake that for ownership." }
      ]
    },

    // ── April 2026 expansion articles ──────────────────────────────────────────

    "revenue-leak-auditors-wont-catch": {
      slug:          "revenue-leak-auditors-wont-catch",
      datePublished: "2026-04-06",
      keywords:      "sales execution leakage, revenue leak, pipeline leakage finance, CFO sales pipeline, stalled deals cost",
      navLabel:      "The revenue leak your auditors won't catch",
      cardLabel:     "Finance · Revenue Risk",
      cardExcerpt:   "Sales execution leakage — revenue lost when qualified deals stall due to inaction — appears in no audit, no variance report, and no board pack. Here is how to identify and quantify it.",
      cardMeta:      "8 min read · CFOs · Finance Directors · CEOs",
      category:      "fin",
      roles:         "cfo ceo rvp",
      tldr: [
        "Sales execution leakage — revenue lost when qualified deals stall due to inaction — is not captured in any standard financial report.",
        "Industry data consistently puts the rate of deals that stall without a structured next action at 20–30% of active pipeline.",
        "Unlike competitive losses, execution leakage is largely recoverable — with the right action at the right time.",
        "The financial case for an execution layer is not a sales productivity argument. It is a recoverable revenue argument."
      ],
      title:       "The Revenue Leak Your Auditors Won't Catch | GoWarm Insights",
      description: "Finance teams track receivables, COGS, and burn rate. Nobody tracks how much revenue disappears between a qualified deal and a closed one. Here's what that gap looks like — and how to quantify it.",
      label:       "Finance · Revenue Risk",
      audience:    "CFOs · Finance Directors · CEOs",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "What is sales execution leakage?", a: "Sales execution leakage is the revenue lost when qualified deals stall, go dark, or close below value — not because of product fit, pricing, or competition, but because no structured action was taken at the right time. It is distinct from standard win/loss and appears in no audit or financial report." },
        { q: "How do you quantify pipeline leakage?", a: "The basic calculation: take your active pipeline value, apply your historical stall rate (typically 20–30%), then apply your recovery rate if structured follow-up is applied. The gap between expected and actual close value, when deals stall, is your execution leakage figure." },
        { q: "Why doesn't finance track sales execution leakage?", a: "Because it doesn't show up as a cost — it shows up as revenue that was never recognised. The deal closes below forecast or disappears from the pipeline with no corresponding journal entry. Standard financial reporting has no mechanism to distinguish deals lost to competition from deals lost to inaction." }
      ]
    },

    "crm-spend-win-rate": {
      slug:          "crm-spend-win-rate",
      datePublished: "2026-04-06",
      keywords:      "CRM ROI win rate, CRM spend returns, CRM investment business case, sales win rate improvement, CRM execution gap",
      navLabel:      "Why your CRM spend doesn't show up in win rate",
      cardLabel:     "CRM ROI · Finance",
      cardExcerpt:   "CRM spend has grown for a decade. Win rates haven't moved. The structural reason — and what the CRM investment is actually buying versus what moves win rate.",
      cardMeta:      "9 min read · CFOs · CROs · VP Sales",
      category:      "fin",
      roles:         "cfo vps ceo",
      tldr: [
        "CRMs are systems of record. Win rate is determined by execution. The two are structurally disconnected.",
        "More CRM spend increases the quality of your record-keeping. It does not increase the quality of your reps' daily actions.",
        "The execution gap — between what the CRM recorded and what the rep does tomorrow — is where win rate is determined.",
        "Closing that gap requires a different layer entirely: one that reads the CRM, diagnoses the pipeline, and surfaces what needs to happen next."
      ],
      title:       "Why Your CRM Spend Doesn't Show Up in Win Rate | GoWarm Insights",
      description: "CRM spend has grown consistently for a decade. Industry win rates haven't moved in the same direction. Understanding the gap between CRM investment and sales outcome tells you exactly what the CRM is — and isn't — doing.",
      label:       "CRM ROI · Finance",
      audience:    "CFOs · CROs · VP Sales",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "Why doesn't CRM investment improve win rates?", a: "CRMs are systems of record, not systems of action. They store what happened — calls logged, stages updated, notes entered. They do not tell reps what to do next or ensure that the right action happens at the right time. Win rate improvement requires execution, not data storage." },
        { q: "What is the difference between a CRM and a sales execution platform?", a: "A CRM records what happened in your pipeline. A sales execution platform reads that data, runs diagnostic rules, and tells your team what to do next — surfacing stalled deals, triggering playbooks on stage changes, and producing a prioritised action queue for every rep, every day." },
        { q: "What does CRM spend actually buy?", a: "CRM spend buys three things: a structured record of your pipeline, reporting and forecasting capability, and a platform on which automation and integrations can be built. It does not buy execution — the consistent daily action that determines whether deals close. That requires a different layer." }
      ]
    },

    "sales-forecast-miss-cost": {
      slug:          "sales-forecast-miss-cost",
      datePublished: "2026-04-06",
      keywords:      "sales forecast miss cost, forecast accuracy business impact, revenue forecast CFO, pipeline forecast board, FP&A sales forecast",
      navLabel:      "Sales forecast miss: what it costs beyond the quarter",
      cardLabel:     "Finance · Forecasting",
      cardExcerpt:   "A forecast miss affects hiring decisions, capital allocation, board credibility, and CAC — for months after the quarter closes. The full accounting of a recurring miss.",
      cardMeta:      "9 min read · CFOs · CEOs · FP&A · CROs",
      category:      "fin",
      roles:         "cfo ceo vps rvp",
      tldr: [
        "Only 24% of sales organisations achieve forecasts within 5% of actual close. 43% miss by 10% or more — every quarter.",
        "The costs extend beyond the revenue shortfall: hiring plans, capital allocation, investor confidence, and CAC calculations are all built on the forecast number.",
        "Most forecast inaccuracy is not a market signal. It is an execution signal — deals that were in the pipeline and should have closed but didn't because the right action wasn't taken.",
        "Forecast accuracy improves most reliably when inputs change from rep-reported confidence to activity-signal-derived probability."
      ],
      title:       "Sales Forecast Miss: What It Costs the Business Beyond the Quarter | GoWarm Insights",
      description: "A forecast miss is treated as a sales problem. The downstream costs — hiring decisions made on wrong data, investment sized to revenue that didn't arrive, board credibility spent — accrue far beyond the sales org.",
      label:       "Finance · Forecasting",
      audience:    "CFOs · CEOs · FP&A · CROs",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "What are the real costs of a sales forecast miss?", a: "Beyond the direct revenue shortfall, a forecast miss drives: hiring against a plan built on revenue that didn't arrive; capital allocation decisions sized to overestimated pipeline; board credibility costs that affect fundraising and strategic conversations; and compounding CAC distortion where marketing investment is benchmarked against conversion rates that execution failure is quietly reducing." },
        { q: "What causes consistent sales forecast inaccuracy?", a: "The primary cause is that most forecasts are assembled from rep-reported confidence and manager judgement rather than from objective activity signals. When the forecast number reflects what reps believe rather than what email cadence, meeting patterns, and deal progression data show, it will be consistently biased toward optimism." },
        { q: "How do you improve sales forecast accuracy?", a: "Forecast accuracy improves when the inputs change. Reading email activity, calendar data, and meeting patterns directly — rather than relying on rep-updated stage labels and verbal confidence estimates — produces a forecast grounded in what is actually happening in each deal, not what the rep last logged." }
      ]
    },

    "sales-rep-turnover-finance": {
      slug:          "sales-rep-turnover-finance",
      datePublished: "2026-04-06",
      keywords:      "sales rep turnover cost, sales attrition finance, pipeline transition cost, AE ramp cost, sales execution retention",
      navLabel:      "Sales rep turnover as a finance problem",
      cardLabel:     "Finance · Sales Operations",
      cardExcerpt:   "The fully loaded cost of rep departure — including pipeline transition leakage and opportunity cost — regularly exceeds 2.5× OTE. Most of it is untracked and preventable.",
      cardMeta:      "9 min read · CFOs · COOs · VP Sales",
      category:      "fin",
      roles:         "cfo vps ceo",
      tldr: [
        "Industry benchmarks put the fully loaded cost of replacing an AE at 1.5–2× their annual on-target earnings — before pipeline transition losses.",
        "Pipeline transition leakage — deals that go dark or are lost when a rep departs — is rarely modelled but is often larger than the direct replacement cost.",
        "Execution discipline reduces transition cost: documented deals with clear stakeholder maps and next steps are transferable. Deals that lived in the rep's head are not.",
        "The ROI case for execution infrastructure includes every personnel change, not just the current quarter's closed revenue."
      ],
      title:       "Sales Rep Turnover as a Finance Problem | GoWarm Insights",
      description: "Sales rep turnover is framed as an HR and management issue. The true financial model — recruiting cost, ramp shortfall, pipeline transition leakage, and opportunity cost — makes it one of the highest-cost recurring events in a sales organisation.",
      label:       "Finance · Sales Operations",
      audience:    "CFOs · COOs · VP Sales · Finance Directors",
      readTime:    "9 min read",
      schema:      "Article",
      faqs: [
        { q: "What is the true cost of a sales rep departure?", a: "The full cost has four components: direct replacement cost (recruiting fee, offer premium, ramp-period quota shortfall, onboarding time); pipeline transition leakage (the portion of the departing rep's pipeline that deteriorates during handover, typically 25–40%); opportunity cost from the ramp period (pipeline not sourced while the new rep is learning the territory); and compounding territory effects if turnover is frequent. Total cost regularly exceeds 2.5× annual OTE." },
        { q: "What is pipeline transition leakage?", a: "Pipeline transition leakage is the revenue lost when a sales rep departs and their active pipeline deteriorates during the transition period. Deals that depended on the rep's personal relationship with the prospect may stall or be abandoned. The leakage is typically 25–40% of the departing rep's expected close value, appearing in win/loss reporting as competitive losses rather than transition failures." },
        { q: "How does execution discipline reduce sales rep turnover cost?", a: "When deals are documented with structured stakeholder maps, engagement history, and clear next steps — rather than existing primarily in the rep's memory — the pipeline is transferable. A new rep can pick up deals in days rather than weeks, transition leakage drops significantly, and ramp time is shorter because the pipeline is already understandable." }
      ]
    },

    "marketing-leads-disappear-pipeline": {
      slug:          "marketing-leads-disappear-pipeline",
      datePublished: "2026-04-06",
      keywords:      "MQL pipeline leakage, marketing qualified lead conversion, sales execution MQL, lead handoff failure, marketing sales alignment execution",
      navLabel:      "Why marketing qualified leads disappear in the pipeline",
      cardLabel:     "Marketing · Pipeline",
      cardExcerpt:   "Most MQL attrition is execution attrition — not lead quality failure. How to run the diagnostic that proves it, and what changes when execution discipline is applied to inbound.",
      cardMeta:      "8 min read · CMOs · Demand Gen VPs · VP Sales · RevOps",
      category:      "ops",
      roles:         "cmo vps rvp ceo",
      tldr: [
        "44% of salespeople follow up on a lead only once before abandoning it. 80% of B2B conversions require five or more attempts.",
        "Most MQL attrition is execution attrition — not lead quality failure. The same leads, with structured multi-touch follow-up, convert at measurably higher rates.",
        "Marketing teams are measured on pipeline generated. An execution gap in sales silently reduces that metric regardless of lead quality.",
        "The diagnostic is in the follow-up data: compare conversion rates for leads that received 1–2 attempts versus 4–5+ attempts. The gap tells you whether the problem is the leads or the execution."
      ],
      title:       "Why Marketing Qualified Leads Disappear in the Pipeline | GoWarm Insights",
      description: "Marketing generates the leads. Sales loses them in the pipeline. The handoff failure between marketing and sales execution isn't a lead quality problem — it's a follow-through problem. Here's what the data shows.",
      label:       "Marketing · Pipeline Execution",
      audience:    "CMOs · Demand Gen VPs · VP Sales · RevOps",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "Why do MQLs not convert to opportunities?", a: "The most common cause of MQL-to-opportunity conversion failure is not lead quality. It is follow-up discipline — the proportion of MQLs that receive only one outreach attempt before being marked as unresponsive. Research consistently shows that 44% of salespeople follow up only once, while 80% of deals require five or more attempts. Most MQL attrition happens in this gap." },
        { q: "How do you distinguish a lead quality problem from a sales execution problem?", a: "The diagnostic is in the follow-up data. If MQLs that received only one or two outreach attempts before being marked unresponsive convert at similar rates to those that received five or more attempts — the problem is lead quality. If MQLs with more follow-up attempts convert significantly better — the problem is execution discipline, not the leads themselves." },
        { q: "What is the marketing team's stake in sales execution quality?", a: "Marketing teams are measured on pipeline generated and lead volume. Both metrics are directly affected by how thoroughly sales follows up on inbound leads. A marketing team generating high-quality MQLs into a pipeline with weak execution discipline will consistently underperform on conversion metrics — not because their leads are poor, but because the execution layer is losing the leads marketing generated." }
      ]
    },

    "execution-layer-costs-cac": {
      slug:          "execution-layer-costs-cac",
      datePublished: "2026-04-06",
      keywords:      "customer acquisition cost execution, CAC sales execution, CAC inflation pipeline, sales pipeline CAC, marketing efficiency sales",
      navLabel:      "What a broken sales execution layer costs your CAC",
      cardLabel:     "Marketing · Unit Economics",
      cardExcerpt:   "When execution fails, CAC inflates regardless of marketing efficiency — because the denominator shrinks. The three execution mechanisms that drive CAC up, and why fixing execution beats increasing spend.",
      cardMeta:      "8 min read · CMOs · CFOs · Growth VPs · CEOs",
      category:      "fin",
      roles:         "cmo cfo ceo vps",
      tldr: [
        "CAC = marketing spend ÷ customers acquired. If customers acquired drops due to execution failure, CAC rises — even if every marketing efficiency metric is unchanged.",
        "Sales execution leakage (deals that stall and are lost to inaction) silently reduces the denominator in your CAC calculation every quarter.",
        "Improving execution efficiency is a more capital-efficient way to reduce CAC than increasing top-of-funnel spend.",
        "Most CAC optimisation conversations focus on the numerator. The denominator — conversion rate through the sales execution layer — offers equal or greater leverage."
      ],
      title:       "What a Broken Sales Execution Layer Costs Your CAC | GoWarm Insights",
      description: "CAC is calculated as marketing spend divided by customers acquired. But when sales execution is broken, the denominator shrinks — not because of lead quality, but because qualified deals stall and are lost to inaction. Here is the full CAC impact.",
      label:       "Marketing · Unit Economics",
      audience:    "CMOs · CFOs · Growth VPs · CEOs",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "How does sales execution failure inflate CAC?", a: "CAC = marketing spend ÷ customers acquired. When sales execution fails — deals stall without re-engagement, MQLs are abandoned after one attempt, qualified opportunities are lost to inaction — the denominator shrinks. The same marketing spend produces fewer customers, and CAC rises regardless of marketing efficiency. This is execution-driven CAC inflation, and it is invisible in standard marketing analytics." },
        { q: "Is CAC an execution metric or a marketing metric?", a: "CAC is traditionally treated as a marketing metric because it includes marketing spend. But the denominator — customers acquired — is directly affected by sales execution quality. When the execution layer fails to follow up consistently, the conversion rate drops and CAC inflates. Improving execution efficiency is often a more capital-efficient route to CAC reduction than increasing top-of-funnel marketing spend." },
        { q: "What is execution-adjusted CAC?", a: "Execution-adjusted CAC models what CAC would be if the execution layer were functioning at its potential — with consistent multi-touch follow-up, structured deal re-engagement, and minimal abandonment. The gap between actual CAC and execution-adjusted CAC is the cost the execution layer is adding to every customer the business acquires." }
      ]
    },

    "board-sales-execution": {
      slug:          "board-sales-execution",
      datePublished: "2026-04-06",
      keywords:      "board sales execution, CEO board pipeline, sales execution strategy board, revenue predictability board, sales infrastructure board",
      navLabel:      "What I'd tell my board about sales execution",
      cardLabel:     "CEO · Board",
      cardExcerpt:   "The conversation about execution infrastructure worth having before a pattern of misses makes it unavoidable — and the four metrics that give a board a real view of revenue predictability.",
      cardMeta:      "8 min read · CEOs · Board Members · CROs · CFOs",
      category:      "fin",
      roles:         "ceo cfo vps",
      tldr: [
        "Pipeline value tells you what might close. Execution discipline tells you what will. Boards routinely track the former and rarely assess the latter.",
        "Revenue predictability — the ability to forecast within 10% consistently — is as much an infrastructure question as a talent question.",
        "The execution gap is the structural distance between what was planned and what reps actually did each day. Most boards have no visibility into it.",
        "Surfacing the execution gap proactively — before a pattern of misses makes it unavoidable — is one of the highest-value conversations a CEO can lead with their board."
      ],
      title:       "What I'd Tell My Board About Sales Execution | GoWarm Insights",
      description: "Boards ask about pipeline, forecast, and headcount. The deeper question — whether the organisation has a structural execution layer — rarely surfaces until after a miss. Here is the conversation worth having before that happens.",
      label:       "CEO · Board · Strategy",
      audience:    "CEOs · Board Members · CROs · CFOs",
      readTime:    "8 min read",
      schema:      "Article",
      faqs: [
        { q: "What should a CEO tell their board about sales execution?", a: "A CEO should bring the execution infrastructure conversation to the board proactively — before a pattern of forecast misses makes it reactive. The frame: the organisation has identified the layer that determines whether pipeline closes at its projected rate, has made a deliberate infrastructure investment to systematise it, and here are the four metrics that will track whether it is working: pipeline stall rate, playbook completion rate, rolling forecast accuracy, and handover completion rate." },
        { q: "What is pipeline execution health and how do you measure it?", a: "Pipeline execution health is a set of leading indicators that reveal whether deals are being managed with the discipline required to close at their projected rate. Key metrics: pipeline stall rate (target below 15%), playbook completion rate (target above 70%), rolling 6-quarter forecast accuracy (target within 8-10%), and handover completion rate (target above 85%)." },
        { q: "Why is revenue predictability a CEO-level infrastructure question?", a: "Revenue predictability that depends on individual manager coaching and rep behaviour cannot scale reliably beyond a certain team size and degrades with every personnel change. An organisation that systematises execution — nightly diagnostics, automatic playbook triggers, activity-signal-based forecasting — produces predictability that is structural rather than talent-dependent. That is a CEO-level strategic decision, not a sales ops configuration choice." }
      ]
    },

  }, // end pages

  // ── File map — order here determines footer "Latest Articles" order ─────────
  // Add new articles at the BOTTOM of this list.
  fileMap: {
    "index":                                              "index.html",
    "is-your-crm-a-crud-app":                            "is-your-crm-a-crud-app.html",
    "are-your-sales-playbooks-working":                  "are-your-sales-playbooks-working.html",
    "crm-rebuild-or-recommit":                           "crm-rebuild-or-recommit.html",
    "crm-integration-complexity":                        "crm-integration-complexity.html",
    "revops-stack-crm-foundation":                       "revops-stack-crm-foundation.html",
    "contact":                                           "contact.html",
    "crm-roi-cfo-questions":                             "crm-roi-cfo-questions.html",
    "crm-roi-cro-response":                              "crm-roi-cro-response.html",
    "forecast-accuracy-arr":                             "forecast-accuracy-arr.html",
    "sales-team-task-tracking":                          "sales-team-task-tracking.html",
    "discovery-call-dropoff":                            "discovery-call-dropoff.html",
    "account-research-module-build-vs-buy":              "account-research-module-build-vs-buy.html",
    "pricing-approval-workflow-crm":                     "pricing-approval-workflow-crm.html",
    "pipeline-deals-going-dark":                         "pipeline-deals-going-dark.html",
    "per-user-ai-settings-crm":                          "per-user-ai-settings-crm.html",
    "playbook-adoption-crm":                             "playbook-adoption-crm.html",
    "crm-implementation-guide":                          "crm-implementation-guide.html",
    "lead-generation-discovery-meetings":                "lead-generation-discovery-meetings.html",
    // ─── NEW (April 2026) ─────────────────────────────────────────────────────
    "playbook-segmentation-smb-enterprise-geography":    "playbook-segmentation-smb-enterprise-geography.html",
    "crm-owner-capabilities":                            "crm-owner-capabilities.html",
    "revenue-leak-auditors-wont-catch":                  "revenue-leak-auditors-wont-catch.html",
    "crm-spend-win-rate":                                "crm-spend-win-rate.html",
    "sales-forecast-miss-cost":                          "sales-forecast-miss-cost.html",
    "sales-rep-turnover-finance":                        "sales-rep-turnover-finance.html",
    "marketing-leads-disappear-pipeline":                "marketing-leads-disappear-pipeline.html",
    "execution-layer-costs-cac":                         "execution-layer-costs-cac.html",
    "board-sales-execution":                             "board-sales-execution.html",
    // ─── Add new articles below this line ─────────────────────────────────────
  },
};

module.exports = config;
