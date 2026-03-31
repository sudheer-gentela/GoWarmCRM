// build.js
// Run with: node build.js
//
// ── What this does ───────────────────────────────────────────────────────────
//   1. SEO/AEO  — injects/refreshes meta tags, canonical URLs, Open Graph,
//                 Twitter Card, JSON-LD Article/WebPage/FAQ schema in every file
//   2. Nav      — regenerates the <header class="site-nav"> block in every file
//                 from site.config.js (brand name, links)
//   3. Footer   — regenerates <footer class="site-footer"> in every file,
//                 including the full article list, from site.config.js
//   4. Sitemap  — writes sitemap.xml
//   5. Robots   — writes robots.txt
//   6. API patch— updates SITE_URL fallback in api/submit.js
//
// ── Adding a new article ─────────────────────────────────────────────────────
//   1. Create the HTML file  (content only — nav/footer are auto-generated)
//   2. Add one entry to site.config.js  pages  and  fileMap
//   3. Run: node build.js
//   4. git push  →  Vercel deploys
//
// Safe to run multiple times — all injected blocks carry markers and are
// replaced cleanly on every run. Nothing is ever duplicated.
// ─────────────────────────────────────────────────────────────────────────────

"use strict";

const fs   = require("fs");
const path = require("path");
const cfg  = require("./site.config.js");
const ROOT = __dirname;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function pageUrl(pageKey) {
  const slug = cfg.pages[pageKey].slug;
  return slug === "index" ? cfg.SITE_URL + "/" : `${cfg.SITE_URL}/${slug}`;
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripBlock(html, startMarker, endMarker) {
  const re = new RegExp(`\\n?${escRe(startMarker)}[\\s\\S]*?${escRe(endMarker)}\\n?`, "g");
  return html.replace(re, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SEO / AEO block
// ─────────────────────────────────────────────────────────────────────────────

const SEO_START = "<!-- ═══ SEO/AEO:START ═══ -->";
const SEO_END   = "<!-- ═══ SEO/AEO:END ═══ -->";

function buildSeoBlock(pageKey) {
  const page    = cfg.pages[pageKey];
  const url     = pageUrl(pageKey);
  const ogImage = cfg.SITE_URL + cfg.OG_IMAGE;
  const twTag   = cfg.TWITTER_HANDLE
    ? `  <meta name="twitter:site"        content="${cfg.TWITTER_HANDLE}" />\n`
    : "";

  let block = `${SEO_START}
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${url}" />
  <meta property="og:title"       content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:image"       content="${ogImage}" />
  <meta property="og:site_name"   content="${cfg.BRAND_PUBLICATION}" />
  <meta name="twitter:card"        content="summary_large_image" />
${twTag}  <meta name="twitter:title"       content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image"       content="${ogImage}" />`;

  if (page.schema === "Article") {
    const s = {
      "@context": "https://schema.org", "@type": "Article",
      "headline": page.title, "description": page.description, "url": url,
      "publisher": { "@type": "Organization", "name": cfg.BRAND_PUBLICATION, "url": cfg.SITE_URL },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    };
    block += `\n  <script type="application/ld+json">${JSON.stringify(s)}</script>`;
  }

  if (page.schema === "WebPage") {
    const s = {
      "@context": "https://schema.org", "@type": "WebPage",
      "name": page.title, "description": page.description, "url": url,
      "publisher": { "@type": "Organization", "name": cfg.BRAND_PUBLICATION, "url": cfg.SITE_URL },
    };
    block += `\n  <script type="application/ld+json">${JSON.stringify(s)}</script>`;
  }

  if (page.faqs && page.faqs.length) {
    const s = {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": page.faqs.map(f => ({
        "@type": "Question", "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    };
    block += `\n  <script type="application/ld+json">${JSON.stringify(s)}</script>`;
  }

  block += `\n  ${SEO_END}`;
  return block;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Nav block — auto-generated from cfg
// ─────────────────────────────────────────────────────────────────────────────

const NAV_START = "<!-- ═══ NAV:START ═══ -->";
const NAV_END   = "<!-- ═══ NAV:END ═══ -->";

function buildNav() {
  const words = cfg.BRAND_PUBLICATION.split(" ");
  const logo  = `${words[0]}<span>${words.slice(1).join(" ")}</span>`;

  return `${NAV_START}
  <header class="site-nav">
    <div class="container">
      <a href="/blog" class="nav-logo">${logo}</a>
      <nav>
        <ul class="nav-links">
          <li><a href="/blog#articles">Articles</a></li>
          <li><a href="/contact" class="nav-cta">Get a Free Audit</a></li>
          <li><a href="/" style="font-size:13px;color:var(--ink-4);border-left:1px solid var(--border);padding-left:16px;margin-left:4px;">← GoWarmCRM</a></li>
        </ul>
      </nav>
      <button class="nav-hamburger" aria-label="Open menu" onclick="toggleMobileNav()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  ${NAV_END}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Footer block — auto-generated from cfg, article list from fileMap
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_START = "<!-- ═══ FOOTER:START ═══ -->";
const FOOTER_END   = "<!-- ═══ FOOTER:END ═══ -->";

function buildFooter() {
  // Latest 6 articles: pages with a navLabel, in fileMap order (oldest first),
  // excluding non-article pages (index, contact, diagnostic). Take last 6.
  const NON_ARTICLE = new Set(["index", "contact", "crm-diagnostic"]);
  const latestSix = Object.entries(cfg.fileMap)
    .filter(([pageKey]) => !NON_ARTICLE.has(pageKey) && cfg.pages[pageKey] && cfg.pages[pageKey].navLabel)
    .slice(-6)
    .map(([pageKey, filename]) =>
      `            <li><a href="/blog/${filename.replace(/\.html$/, "")}">${cfg.pages[pageKey].navLabel}</a></li>`
    )
    .join("\n");

  const words   = cfg.BRAND_PUBLICATION.split(" ");
  const logo    = `${words[0]}<span>${words.slice(1).join(" ")}</span>`;
  const domain  = cfg.PRODUCT_URL.replace(/^https?:\/\//, "");
  const year    = new Date().getFullYear();

  return `${FOOTER_START}
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">${logo}</div>
          <p class="footer-tagline">${cfg.BRAND_TAGLINE} Published by the team at ${cfg.BRAND_COMPANY}.</p>
        </div>
        <div class="footer-col">
          <h4>Topics</h4>
          <ul>
            <li><a href="/blog#articles">All Articles</a></li>
            <li><a href="/blog#articles">CRM Health</a></li>
            <li><a href="/blog#articles">Decisions</a></li>
            <li><a href="/blog#articles">Revenue Ops</a></li>
            <li><a href="/blog#articles">Finance &amp; ROI</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Latest Articles</h4>
          <ul>
${latestSix}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get Help</h4>
          <ul>
            <li><a href="/diagnostic">Free CRM Diagnostic</a></li>
            <li><a href="/contact">Request a Consultation</a></li>
            <li><a href="${cfg.PRODUCT_URL}">${cfg.BRAND_COMPANY} ↗</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} ${cfg.BRAND_COMPANY}. All rights reserved.</span>
        <span>${domain}</span>
      </div>
    </div>
  </footer>
  ${FOOTER_END}`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. TLDR block — injected after article-deck, before article body
// ─────────────────────────────────────────────────────────────────────────────

const TLDR_START = "<!-- ═══ TLDR:START ═══ -->";
const TLDR_END   = "<!-- ═══ TLDR:END ═══ -->";

function buildTldr(pageKey) {
  const page = cfg.pages[pageKey];
  if (!page || !page.tldr || !page.tldr.length) return "";

  const items = page.tldr
    .map(point => `          <li>${point}</li>`)
    .join("\n");

  return `${TLDR_START}
        <div class="tldr-box">
          <div class="tldr-label">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:14px;height:14px;flex-shrink:0;margin-top:1px"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3.5M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            TL;DR — 60-second read
          </div>
          <ul class="tldr-list">
${items}
          </ul>
        </div>
        ${TLDR_END}`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. Articles grid — auto-generated in index.html from cfg
// ─────────────────────────────────────────────────────────────────────────────

const GRID_START = "<!-- ═══ ARTICLES-GRID:START ═══ -->";
const GRID_END   = "<!-- ═══ ARTICLES-GRID:END ═══ -->";

function buildArticlesGrid() {
  const articles = Object.entries(cfg.fileMap)
    .filter(([pageKey]) => {
      const p = cfg.pages[pageKey];
      return p && p.cardLabel && p.cardExcerpt && p.cardMeta;
    });

  const count = articles.length;

  const cards = articles.map(([pageKey, filename]) => {
    const p = cfg.pages[pageKey];
    const cat   = p.category || "crm";
    const roles = p.roles    || "vps";
    // Tag colour class based on category
    const tagClass = { crm:"gc-crm", dec:"gc-dec", ops:"gc-ops", fin:"gc-fin" }[cat] || "gc-crm";
    return `
        <a href="/blog/${filename.replace('.html', '')}" class="gc-card" data-topic="${cat}" data-roles="${roles}">
          <span class="gc-tag ${tagClass}">${p.cardLabel}</span>
          <div class="gc-title">${p.navLabel}</div>
          <div class="gc-excerpt">${p.cardExcerpt}</div>
          <div class="gc-meta">${p.cardMeta}</div>
        </a>`;
  }).join("\n");

  return `${GRID_START}
  <section class="articles-section" id="articles" style="padding-top:32px;">
    <div class="container">

      <!-- Topic/Role toggle + filter pills -->
      <div class="gc-topbar">
        <div class="gc-tbtns">
          <button class="gc-tbtn gc-on" onclick="gcSwitch(this,'topic')">By Topic</button>
          <button class="gc-tbtn" onclick="gcSwitch(this,'role')">By Role</button>
        </div>
        <div class="gc-sep"></div>
        <div class="gc-pills" id="gc-pills-topic">
          <button class="gc-pill gc-on" onclick="gcFilter(this,'all')">All ${count}</button>
          <button class="gc-pill" onclick="gcFilter(this,'crm')">CRM Health</button>
          <button class="gc-pill" onclick="gcFilter(this,'dec')">Decisions</button>
          <button class="gc-pill" onclick="gcFilter(this,'ops')">Revenue Ops</button>
          <button class="gc-pill" onclick="gcFilter(this,'fin')">Finance &amp; ROI</button>
        </div>
        <div class="gc-pills" id="gc-pills-role" style="display:none">
          <button class="gc-pill gc-on" onclick="gcFilter(this,'all')">All roles</button>
          <button class="gc-pill" onclick="gcFilter(this,'vps')">VP Sales</button>
          <button class="gc-pill" onclick="gcFilter(this,'rvp')">RevOps</button>
          <button class="gc-pill" onclick="gcFilter(this,'cto')">CTO</button>
          <button class="gc-pill" onclick="gcFilter(this,'cfo')">CFO</button>
          <button class="gc-pill" onclick="gcFilter(this,'ceo')">CEO · Founder</button>
        </div>
        <span class="gc-count" id="gc-count">${count} articles</span>
      </div>

      <!-- Card grid -->
      <div class="gc-grid" id="gc-grid">
${cards}
      </div>

    </div>
  </section>

  <script>
    var gcMode = 'topic';
    function gcSwitch(btn, mode) {
      gcMode = mode;
      document.querySelectorAll('.gc-tbtn').forEach(function(b){b.classList.remove('gc-on');});
      btn.classList.add('gc-on');
      document.getElementById('gc-pills-topic').style.display = mode==='topic' ? 'flex' : 'none';
      document.getElementById('gc-pills-role').style.display  = mode==='role'  ? 'flex' : 'none';
      var pills = document.getElementById(mode==='topic'?'gc-pills-topic':'gc-pills-role');
      pills.querySelectorAll('.gc-pill').forEach(function(p){p.classList.remove('gc-on');});
      pills.querySelector('.gc-pill').classList.add('gc-on');
      gcApply('all');
    }
    function gcFilter(pill, val) {
      pill.closest('.gc-pills').querySelectorAll('.gc-pill').forEach(function(p){p.classList.remove('gc-on');});
      pill.classList.add('gc-on');
      gcApply(val);
    }
    function gcApply(val) {
      var cards = document.querySelectorAll('#gc-grid .gc-card');
      var n = 0;
      cards.forEach(function(c){
        var show = val==='all';
        if (!show) {
          if (gcMode==='topic') show = c.dataset.topic===val;
          else show = c.dataset.roles && c.dataset.roles.split(' ').indexOf(val)!==-1;
        }
        c.style.display = show ? '' : 'none';
        if (show) n++;
      });
      var el = document.getElementById('gc-count');
      if (el) el.textContent = n + ' article' + (n!==1?'s':'');
    }
  <\/script>
  ${GRID_END}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Process a single file in-place
// ─────────────────────────────────────────────────────────────────────────────

function processFile(filename, pageKey) {
  const filepath = path.join(ROOT, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  SKIP (not found): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, "utf8");
  const page = cfg.pages[pageKey];

  // ── SEO ──────────────────────────────────────────────────────────────────
  // Remove legacy markers from old build.js format
  html = html.replace(/\n  <!-- ═══ SEO \/ AEO[\s\S]*?end SEO block ═══ -->\n/g, "");
  html = html.replace(/\n  <!-- (?:Article|WebPage|FAQ) schema -->[\s\S]*?<\/script>\n/g, "");
  // Remove current-format markers
  html = stripBlock(html, SEO_START, SEO_END);
  // Update title and description
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    `<meta name="description" content="${page.description}" />`
  );
  // Inject fresh SEO block before </head>
  html = html.replace("</head>", `\n  ${buildSeoBlock(pageKey)}\n</head>`);

  // ── Nav ───────────────────────────────────────────────────────────────────
  // Strip marker-wrapped block AND any bare hardcoded block (handles duplicates)
  html = stripBlock(html, NAV_START, NAV_END);
  html = html.replace(/<header[^>]*class="site-nav"[^>]*>[\s\S]*?<\/header>/g, "");
  // Inject fresh nav after <body>
  html = html.replace("<body>", `<body>\n  ${buildNav()}`);

  // ── Footer ────────────────────────────────────────────────────────────────
  // Strip marker-wrapped block AND any bare hardcoded block (handles duplicates)
  html = stripBlock(html, FOOTER_START, FOOTER_END);
  html = html.replace(/<footer[^>]*class="site-footer"[^>]*>[\s\S]*?<\/footer>/g, "");
  // Inject fresh footer before </body>
  html = html.replace("</body>", `  ${buildFooter()}\n</body>`);

  // ── Articles grid (index.html only) ──────────────────────────────────────
  html = stripBlock(html, GRID_START, GRID_END);
  if (html.includes(GRID_START.replace(" ═══ -->"," ═══ -->")) || filename === "index.html") {
    const gridHtml = buildArticlesGrid();
    if (html.includes(GRID_START)) {
      html = html.replace(GRID_START, "").replace(GRID_END, "");
    }
    // Inject before the CTA band section
    html = html.replace(
      '<!-- CTA BAND -->',
      gridHtml + '\n\n  <!-- CTA BAND -->'
    );
  }

  // ── TLDR ─────────────────────────────────────────────────────────────────
  const tldrHtml = buildTldr(pageKey);
  html = stripBlock(html, TLDR_START, TLDR_END);
  if (tldrHtml) {
    // Inject after the article-deck paragraph, before the article body div
    if (html.includes('<div class="article-body">')) {
      html = html.replace(
        '<div class="article-body">',
        `${tldrHtml}\n        <div class="article-body">`
      );
    }
  }

  // ── SITE_URL placeholder ──────────────────────────────────────────────────
  html = html.replace(/https:\/\/your-site\.vercel\.app/g, cfg.SITE_URL);

  fs.writeFileSync(filepath, html);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Sitemap + robots + api patch
// ─────────────────────────────────────────────────────────────────────────────

function buildSitemap() {
  const entries = Object.keys(cfg.pages).map(k => {
    const url = pageUrl(k);
    const pri = k === "index" ? "1.0" : "0.8";
    return `  <url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${pri}</priority>\n  </url>`;
  });
  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`
  );
  console.log("  ✓ sitemap.xml");
}

function buildRobots() {
  fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${cfg.SITE_URL}/sitemap.xml\n`
  );
  console.log("  ✓ robots.txt");
}

function patchSubmitJs() {
  const p = path.join(ROOT, "api", "submit.js");
  if (!fs.existsSync(p)) return;
  let src = fs.readFileSync(p, "utf8");
  src = src.replace(
    /process\.env\.SITE_URL \|\| "https?:\/\/[^"]+"/g,
    `process.env.SITE_URL || "${cfg.SITE_URL}"`
  );
  fs.writeFileSync(p, src);
  console.log("  ✓ api/submit.js patched");
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

function run() {
  console.log(`\nBuilding in-place → ${cfg.SITE_URL}\n`);
  let ok = 0;
  Object.entries(cfg.fileMap).forEach(([pageKey, filename]) => {
    if (processFile(filename, pageKey)) {
      console.log(`  ✓ ${filename}`);
      ok++;
    }
  });
  buildSitemap();
  buildRobots();
  patchSubmitJs();

  console.log(`\n✓ Done — ${ok} files updated.`);
  console.log(`\nTo add a new article next time:`);
  console.log(`  1. Create  your-slug.html  (write content — no nav/footer needed)`);
  console.log(`  2. Add one entry to site.config.js  →  pages  +  fileMap`);
  console.log(`  3. node build.js`);
  console.log(`  4. git push  →  Vercel deploys automatically\n`);
}

run();
