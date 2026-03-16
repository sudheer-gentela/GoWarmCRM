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
      <a href="index.html" class="nav-logo">${logo}</a>
      <nav>
        <ul class="nav-links">
          <li><a href="index.html#articles">Articles</a></li>
          <li><a href="diagnostic.html">CRM Diagnostic</a></li>
          <li><a href="contact.html">Work With Us</a></li>
          <li><a href="contact.html" class="nav-cta">Get a Free Audit</a></li>
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
  // Build article list: only pages that have a navLabel, in fileMap order
  const articleLinks = Object.entries(cfg.fileMap)
    .filter(([pageKey]) => cfg.pages[pageKey] && cfg.pages[pageKey].navLabel)
    .map(([pageKey, filename]) =>
      `            <li><a href="${filename}">${cfg.pages[pageKey].navLabel}</a></li>`
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
          <h4>Articles</h4>
          <ul>
${articleLinks}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get Help</h4>
          <ul>
            <li><a href="diagnostic.html">Free CRM Diagnostic</a></li>
            <li><a href="contact.html">Request a Consultation</a></li>
            <li><a href="${cfg.PRODUCT_URL}" target="_blank" rel="noopener">${cfg.BRAND_COMPANY} →</a></li>
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
// 5. Process a single file in-place
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
  html = stripBlock(html, NAV_START, NAV_END);
  if (html.includes('<header class="site-nav">')) {
    html = html.replace(
      /<header class="site-nav">[\s\S]*?<\/header>/,
      buildNav()
    );
  } else {
    html = html.replace("<body>", `<body>\n  ${buildNav()}`);
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  html = stripBlock(html, FOOTER_START, FOOTER_END);
  if (html.includes('<footer class="site-footer">')) {
    html = html.replace(
      /<footer class="site-footer">[\s\S]*?<\/footer>/,
      buildFooter()
    );
  } else {
    html = html.replace("</body>", `  ${buildFooter()}\n</body>`);
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
