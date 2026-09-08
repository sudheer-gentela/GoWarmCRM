/*
 * GoWarmCRM — WebMCP tool registration
 * https://gowarmcrm.com
 *
 * Exposes the marketing site's key actions to AI agents via the WebMCP
 * imperative API (navigator.modelContext). Tools are registered in a single
 * provideContext() call. Page-specific tools are only added on the pages that
 * can actually service them.
 *
 * Nothing here submits a form or mutates server state without a human. The
 * demo-request tool prefills the contact form and hands control back to the
 * user; it deliberately does not auto-submit.
 *
 * Spec: https://webmachinelearning.github.io/webmcp/
 */
(function () {
  'use strict';

  var ctx =
    (typeof navigator !== 'undefined' && navigator.modelContext) ||
    (typeof document !== 'undefined' && document.modelContext) ||
    null;

  if (!ctx || typeof ctx.provideContext !== 'function') {
    // Browser has no WebMCP support (or no polyfill). Nothing to do.
    return;
  }

  var ORIGIN = 'https://gowarmcrm.com';

  // ---------------------------------------------------------------------
  // Reference data — keep in sync with /skills/*/references/*.md
  // ---------------------------------------------------------------------

  var PLANS = [
    {
      name: 'Growth',
      price_usd_per_month: 999,
      billing: 'Billed annually (~$11,988/year). Flat rate, not per seat.',
      covers: 'Up to 20 reps and 5 manager seats.',
      includes: [
        'Nightly diagnostic engine across deals, prospects, contracts, cases, handovers',
        'Live action queue for every rep',
        'AI-drafted next actions (rep approval required)',
        'Unlimited playbooks and play chaining',
        'CRM connectors: Salesforce, HubSpot, Pipedrive, Zoho, Dynamics',
        'Email and calendar signal ingestion',
        'Forecast health dashboard, manager action overview, RevOps view',
        'Diagnostic rule customisation (35+ rules with per-org thresholds)',
        'Priority support and onboarding'
      ],
      notes: 'AI usage is metered separately and billed on actual usage on top of the plan fee. No implementation fee.'
    },
    {
      name: 'Enterprise',
      price_usd_per_month: null,
      billing: 'Custom pricing.',
      covers: 'Organisations above 20 reps.',
      includes: [
        'Everything in Growth',
        'Custom integrations and adapter development',
        'Multi-team configuration',
        'Bring-your-own AI key (OpenAI, Anthropic, others)',
        'SSO and advanced security controls',
        'SLA-backed support and quarterly business reviews'
      ],
      notes: 'Contact sales at https://gowarmcrm.com/contact for a quote.'
    }
  ];

  var INTEGRATIONS = {
    salesforce: {
      name: 'Salesforce',
      status: 'Production-ready',
      detail: 'Bidirectional sync via adapter pattern with deterministic external-ID matching. Per-org field_map configuration.',
      setup: '1-2 weeks for standard schemas',
      url: ORIGIN + '/salesforce-integration'
    },
    hubspot: {
      name: 'HubSpot',
      status: 'In development',
      detail: 'Adapter built on the same orchestrator pattern as Salesforce, currently in customer pilots.',
      setup: '~1 week post-GA',
      url: ORIGIN + '/crm-integration'
    },
    dynamics: {
      name: 'Microsoft Dynamics',
      status: 'Scoped',
      detail: 'Adapter architecture defined, awaiting build prioritisation.',
      setup: 'Contact sales to discuss timeline',
      url: ORIGIN + '/crm-integration'
    },
    pipedrive: {
      name: 'Pipedrive',
      status: 'Scoped',
      detail: 'Adapter architecture defined.',
      setup: 'Contact sales for pilot eligibility',
      url: ORIGIN + '/crm-integration'
    },
    zoho: {
      name: 'Zoho',
      status: 'Scoped',
      detail: 'Adapter architecture defined.',
      setup: 'Contact sales',
      url: ORIGIN + '/crm-integration'
    },
    gmail: {
      name: 'Gmail / Google Workspace',
      status: 'Production-ready',
      detail: 'OAuth-based, read-only by default. Reads last two-way contact date, response latency and thread frequency. Calendar signals: meetings scheduled, accepted, declined, ghosted, rebooked.',
      setup: 'Same day',
      url: ORIGIN + '/crm-integration'
    },
    outlook: {
      name: 'Outlook / Exchange',
      status: 'Production-ready',
      detail: 'Same signal coverage as Gmail, via Microsoft Graph OAuth.',
      setup: 'Same day',
      url: ORIGIN + '/crm-integration'
    }
  };

  var ALIASES = {
    sfdc: 'salesforce',
    'sales force': 'salesforce',
    'hub spot': 'hubspot',
    'microsoft dynamics': 'dynamics',
    'dynamics 365': 'dynamics',
    'google workspace': 'gmail',
    google: 'gmail',
    gsuite: 'gmail',
    'g suite': 'gmail',
    microsoft: 'outlook',
    exchange: 'outlook',
    office365: 'outlook',
    'office 365': 'outlook',
    o365: 'outlook'
  };

  var PAGES = [
    { path: '/', title: 'Homepage', about: 'Category overview, the execution gap, interactive recoverable-pipeline calculator' },
    { path: '/how-it-works', title: 'How It Works', about: 'Nightly diagnostic engine, action queue, AI-drafted next actions' },
    { path: '/problems', title: 'Problems We Solve', about: 'Deal rot, forecast blindness, handoff gaps, expansion blindness, playbook abandonment' },
    { path: '/pricing', title: 'Pricing', about: 'Tiers, what is included, comparison vs building in-house' },
    { path: '/execution-gap', title: 'Execution Gap', about: 'Why CRMs track but do not execute, and the structural fix' },
    { path: '/platform-overview', title: 'Platform Overview', about: 'All five modules: Prospecting, Sales, CLM, Service, Handover' },
    { path: '/crm-integration', title: 'CRM Integration', about: 'Salesforce, HubSpot, Pipedrive, Zoho, Dynamics' },
    { path: '/salesforce-integration', title: 'Salesforce Integration', about: 'Adapter pattern, deterministic ID-based sync, write-back' },
    { path: '/for-vp-sales', title: 'For VP Sales', about: 'Forecast accuracy, rescued deals, new-AE ramp, tool consolidation' },
    { path: '/for-ceo', title: 'For CEOs', about: 'Revenue predictability, investor-grade metrics, board narrative' },
    { path: '/ai-shift', title: 'The AI Shift in B2B Selling', about: 'Five-part thesis on how LLMs changed B2B buying and selling' },
    { path: '/skills', title: 'GoWarm Skills', about: 'Playbook plays as AI-drafted, rep-approved actions' },
    { path: '/blog', title: 'GoWarm Insights', about: 'Articles on pipeline execution, forecasting, playbook adoption' },
    { path: '/about', title: 'About', about: 'Company and team' },
    { path: '/contact', title: 'Contact / Book a Demo', about: 'Book a 20-minute demo' }
  ];

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  function ok(payload) {
    return {
      content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload
    };
  }

  function el(id) {
    return document.getElementById(id);
  }

  function setValue(id, value) {
    var node = el(id);
    if (!node || value === undefined || value === null || value === '') return false;
    node.value = String(value);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function usd(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  var path = window.location.pathname.replace(/\/+$/, '') || '/';

  // ---------------------------------------------------------------------
  // Site-wide tools
  // ---------------------------------------------------------------------

  var tools = [];

  tools.push({
    name: 'gowarm_get_pricing',
    description:
      'Returns current GoWarmCRM plans, what each plan includes, and an indicative monthly cost for a given team size. GoWarmCRM is priced flat-rate, not per seat. Use when a user asks how much GoWarmCRM costs, what a plan includes, or which plan fits their team.',
    inputSchema: {
      type: 'object',
      properties: {
        team_size: {
          type: 'integer',
          description: 'Number of sales reps. Optional. If given, the response names the plan that fits.',
          minimum: 1
        }
      }
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    execute: function (args) {
      var size = args && args.team_size;
      var recommended = null;
      if (typeof size === 'number' && size > 0) {
        recommended = size <= 20
          ? { plan: 'Growth', indicative_monthly_usd: 999, note: 'Flat rate — the price does not change with rep count inside the 20-rep band.' }
          : { plan: 'Enterprise', indicative_monthly_usd: null, note: 'Above 20 reps the answer is Enterprise with custom pricing. Contact sales for a quote.' };
      }
      return ok({
        plans: PLANS,
        team_size: size || null,
        recommended: recommended,
        pricing_page: ORIGIN + '/pricing',
        contact_url: ORIGIN + '/contact'
      });
    }
  });

  tools.push({
    name: 'gowarm_check_integration',
    description:
      'Checks whether GoWarmCRM integrates with a given CRM, email platform or sales tool, and returns integration depth, status and indicative setup time. Use when a user asks "does GoWarmCRM work with X". Call with no arguments to list every supported integration.',
    inputSchema: {
      type: 'object',
      properties: {
        tool: {
          type: 'string',
          description: 'Name of the CRM, email platform or sales tool to check, e.g. "Salesforce", "HubSpot", "Outlook". Omit to list all.'
        }
      }
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    execute: function (args) {
      var q = args && args.tool ? String(args.tool).trim().toLowerCase() : '';
      if (!q) {
        return ok({
          supported: Object.keys(INTEGRATIONS).map(function (k) { return INTEGRATIONS[k]; }),
          integrations_page: ORIGIN + '/crm-integration'
        });
      }
      var key = ALIASES[q] || q.replace(/[^a-z0-9]/g, '');
      var hit = INTEGRATIONS[key];
      if (!hit) {
        return ok({
          query: args.tool,
          supported: false,
          message:
            'Not currently a supported integration. GoWarmCRM supports Salesforce, HubSpot, Pipedrive, Zoho, Dynamics, Gmail/Google Workspace and Outlook/Exchange. Contact sales to discuss feasibility for anything else.',
          contact_url: ORIGIN + '/contact',
          integrations_page: ORIGIN + '/crm-integration'
        });
      }
      return ok({ query: args.tool, supported: true, integration: hit });
    }
  });

  tools.push({
    name: 'gowarm_estimate_execution_gap',
    description:
      'Estimates the recoverable revenue a B2B sales team is losing to execution gaps (stalled deals, missed follow-ups, broken handovers), given active pipeline value and team size. Returns a central estimate and a range. Use when a user asks how much pipeline they are losing or is building a business case for a sales execution layer.',
    inputSchema: {
      type: 'object',
      properties: {
        active_pipeline_usd: {
          type: 'number',
          description: 'Total open opportunity value across the team, in USD.',
          minimum: 0
        },
        team_size: {
          type: 'integer',
          description: 'Number of sales reps.',
          minimum: 1
        }
      },
      required: ['active_pipeline_usd']
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    execute: function (args) {
      var pipeline = Number(args.active_pipeline_usd);
      if (!isFinite(pipeline) || pipeline <= 0) {
        return ok({ error: 'active_pipeline_usd must be a positive number in USD.' });
      }
      var central = pipeline * 0.25 * 0.40;
      var low = pipeline * 0.20 * 0.35;
      var high = pipeline * 0.30 * 0.45;
      return ok({
        active_pipeline_usd: pipeline,
        team_size: (args && args.team_size) || null,
        recoverable_estimate_usd: Math.round(central),
        recoverable_estimate_display: usd(central),
        recoverable_range_usd: [Math.round(low), Math.round(high)],
        assumptions: {
          stall_rate_central: 0.25,
          stall_rate_range: [0.20, 0.30],
          recovery_rate_central: 0.40,
          recovery_rate_range: [0.35, 0.45]
        },
        caveat:
          'Industry-benchmark estimate, not a guarantee. Actual recovery depends on pipeline quality, deal complexity and team adoption.',
        next_step_url: ORIGIN + '/contact'
      });
    }
  });

  tools.push({
    name: 'gowarm_find_page',
    description:
      'Finds the right GoWarmCRM page for a topic and returns its URL plus a markdown URL for direct reading. Use when a user asks where to read about pricing, integrations, the execution gap, the platform modules, or the AI Shift series.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'What the user wants to read about, e.g. "pricing", "salesforce", "how it works".'
        }
      },
      required: ['topic']
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
    execute: function (args) {
      var q = String(args.topic || '').toLowerCase();
      var scored = PAGES.map(function (p) {
        var hay = (p.path + ' ' + p.title + ' ' + p.about).toLowerCase();
        var score = 0;
        q.split(/[^a-z0-9]+/).forEach(function (term) {
          if (term.length > 2 && hay.indexOf(term) !== -1) score += 1;
        });
        return { page: p, score: score };
      })
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 4)
        .map(function (r) {
          return {
            title: r.page.title,
            url: ORIGIN + r.page.path,
            markdown_url: ORIGIN + (r.page.path === '/' ? '/index.md' : r.page.path + '.md'),
            about: r.page.about
          };
        });

      return ok({
        query: args.topic,
        matches: scored,
        content_map: ORIGIN + '/llms.txt',
        note: 'Every core page is also served as markdown — append .md to the path, or send Accept: text/markdown.'
      });
    }
  });

  // ---------------------------------------------------------------------
  // Homepage-only: drive the live recoverable-pipeline calculator
  // ---------------------------------------------------------------------

  if (path === '/' && el('pipeline') && el('stall') && el('recovery')) {
    tools.push({
      name: 'gowarm_set_calculator',
      description:
        'Sets the interactive recoverable-pipeline calculator on the GoWarmCRM homepage and returns the recalculated figure shown on the page. Use when the user wants to see their own numbers in the on-page calculator.',
      inputSchema: {
        type: 'object',
        properties: {
          pipeline_millions: {
            type: 'number',
            description: 'Active pipeline in millions of USD. Range 1-50.',
            minimum: 1,
            maximum: 50
          },
          stall_rate_percent: {
            type: 'number',
            description: 'Assumed stall rate as a percentage. Range 10-40, in steps of 5. Defaults to 25.',
            minimum: 10,
            maximum: 40
          },
          recovery_rate_percent: {
            type: 'number',
            description: 'Assumed recovery rate as a percentage. Range 20-60, in steps of 5. Defaults to 40.',
            minimum: 20,
            maximum: 60
          }
        },
        required: ['pipeline_millions']
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute: function (args) {
        var pipe = Math.round(clamp(Number(args.pipeline_millions), 1, 50));
        setValue('pipeline', pipe);

        if (args.stall_rate_percent !== undefined) {
          setValue('stall', Math.round(clamp(Number(args.stall_rate_percent), 10, 40) / 5) * 5);
        }
        if (args.recovery_rate_percent !== undefined) {
          setValue('recovery', Math.round(clamp(Number(args.recovery_rate_percent), 20, 60) / 5) * 5);
        }

        if (typeof window.calcUpdate === 'function') window.calcUpdate();

        var section = el('pipeline');
        if (section && section.scrollIntoView) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return ok({
          pipeline_millions: Number(el('pipeline').value),
          stall_rate_percent: Number(el('stall').value),
          recovery_rate_percent: Number(el('recovery').value),
          recoverable_displayed: el('calc-output') ? el('calc-output').textContent : null,
          explanation: el('calc-sub') ? el('calc-sub').textContent : null
        });
      }
    });
  }

  // ---------------------------------------------------------------------
  // Contact-page-only: prefill the demo request form (never auto-submits)
  // ---------------------------------------------------------------------

  if (path === '/contact' && el('email')) {
    tools.push({
      name: 'gowarm_prepare_demo_request',
      description:
        'Prefills the GoWarmCRM demo request form on the contact page with details the user has supplied, then scrolls to it so the user can review and submit it themselves. This tool never submits the form — the user must press submit.',
      inputSchema: {
        type: 'object',
        properties: {
          first_name: { type: 'string', description: "User's first name." },
          last_name: { type: 'string', description: "User's last name." },
          email: { type: 'string', description: 'Work email address.' },
          company: { type: 'string', description: 'Company name.' },
          role: { type: 'string', description: 'Job role, matched against the role dropdown.' },
          team_size: { type: 'string', description: 'Sales team size, matched against the team size dropdown.' },
          crm: { type: 'string', description: 'Current CRM, matched against the CRM dropdown.' },
          problem: { type: 'string', description: 'What the user is trying to fix.' }
        },
        required: ['email']
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute: function (args) {
        function matchSelect(id, wanted) {
          var node = el(id);
          if (!node || !wanted) return null;
          var want = String(wanted).toLowerCase();
          for (var i = 0; i < node.options.length; i++) {
            var opt = node.options[i];
            var text = (opt.text || '').toLowerCase();
            var val = (opt.value || '').toLowerCase();
            if (text.indexOf(want) !== -1 || val.indexOf(want) !== -1 || want.indexOf(text) !== -1) {
              node.value = opt.value;
              node.dispatchEvent(new Event('change', { bubbles: true }));
              return opt.text;
            }
          }
          return null;
        }

        var filled = [];
        if (setValue('fname', args.first_name)) filled.push('first_name');
        if (setValue('lname', args.last_name)) filled.push('last_name');
        if (setValue('email', args.email)) filled.push('email');
        if (setValue('company', args.company)) filled.push('company');
        if (setValue('problem', args.problem)) filled.push('problem');
        if (matchSelect('role', args.role)) filled.push('role');
        if (matchSelect('team-size', args.team_size)) filled.push('team_size');
        if (matchSelect('crm', args.crm)) filled.push('crm');

        var wrap = el('form-wrap');
        if (wrap && wrap.scrollIntoView) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (el('fname')) el('fname').focus();

        return ok({
          fields_prefilled: filled,
          submitted: false,
          next_step:
            'The form is prefilled but not submitted. Ask the user to review the details on the page and press the submit button themselves.'
        });
      }
    });
  }

  // ---------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------

  try {
    ctx.provideContext({ tools: tools });
  } catch (err) {
    if (window.console && console.warn) {
      console.warn('[GoWarmCRM] WebMCP registration failed:', err);
    }
  }
})();
