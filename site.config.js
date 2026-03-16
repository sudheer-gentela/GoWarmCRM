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
  BRAND_COMPANY:     "GoWarm CRM",        // Company name (footer copyright, bios)
  BRAND_TAGLINE:     "Practical intelligence for B2B sales leaders at companies doing $5M–$500M in revenue.",

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
  fileMap: {
    "index":                       "index.html",
    "is-your-crm-a-crud-app":      "article-1.html",
    "are-your-sales-playbooks-working": "article-2.html",
    "crm-rebuild-or-recommit":     "article-3.html",
    "crm-integration-complexity":  "article-4.html",
    "revops-stack-crm-foundation":  "article-5.html",
    "contact":                     "contact.html",
    "crm-diagnostic":              "diagnostic.html",
  },

};

module.exports = config;
