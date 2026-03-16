// build.js
// Run with: node build.js
//
// What this does:
//   - Reads each HTML file IN PLACE (no dist/ folder, no renaming)
//   - Injects/updates SEO meta, canonical URL, Open Graph, Twitter Card,
//     JSON-LD Article schema, FAQ schema (AEO), robots, and SITE_URL references
//   - Generates sitemap.xml and robots.txt alongside the HTML files
//   - Writes changes back to the same file
//
// To change domain: edit SITE_URL in site.config.js, run node build.js again.
// Safe to run multiple times — existing SEO blocks are replaced, not duplicated.

"use strict";

const fs     = require("fs");
const path   = require("path");
const config = require("./site.config.js");
const ROOT   = __dirname;

// ── URL helper ────────────────────────────────────────────────────────────────
function pageUrl(pageKey) {
  const slug = config.pages[pageKey].slug;
  if (slug === "index") return config.SITE_URL + "/";
  return `${config.SITE_URL}/${slug}`;
}

// ── Build the SEO block to inject ─────────────────────────────────────────────
function buildSeoBlock(pageKey) {
  const page = config.pages[pageKey];
  if (!page) return "";

  const url      = pageUrl(pageKey);
  const title    = page.title;
  const desc     = page.description;
  const ogImage  = config.SITE_URL + config.OG_IMAGE;
  const twHandle = config.TWITTER_HANDLE
    ? `  <meta name="twitter:site"        content="${config.TWITTER_HANDLE}" />\n`
    : "";

  let block = `
  <!-- ═══ SEO / AEO — injected by build.js (safe to re-run) ═══ -->
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${url}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${ogImage}" />
  <meta property="og:site_name"   content="${config.BRAND_PUBLICATION}" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
${twHandle}  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${ogImage}" />
  <!-- ═══ end SEO block ═══ -->
`;

  // Article JSON-LD
  if (page.schema === "Article") {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": desc,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": config.BRAND_PUBLICATION,
        "url": config.SITE_URL,
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    };
    block += `\n  <!-- Article schema -->\n  <script type="application/ld+json">\n  ${JSON.stringify(schema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  // WebPage JSON-LD
  if (page.schema === "WebPage") {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": config.BRAND_PUBLICATION,
        "url": config.SITE_URL,
      },
    };
    block += `\n  <!-- WebPage schema -->\n  <script type="application/ld+json">\n  ${JSON.stringify(schema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  // FAQ schema (AEO — targets Google People Also Ask / AI answer boxes)
  if (page.faqs && page.faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": page.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    };
    block += `\n  <!-- FAQ schema (AEO) -->\n  <script type="application/ld+json">\n  ${JSON.stringify(faqSchema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  return block;
}

// ── Process a single HTML file in-place ───────────────────────────────────────
function processFile(filename, pageKey) {
  const filepath = path.join(ROOT, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  SKIP (not found): ${filename}`);
    return false;
  }

  let html = fs.readFileSync(filepath, "utf8");
  const page = config.pages[pageKey];

  // 1. Remove any previously injected SEO block (safe re-run)
  html = html.replace(
    /\n  <!-- ═══ SEO \/ AEO[\s\S]*?end SEO block ═══ -->\n/g,
    ""
  );
  // Also remove any previously injected schema script tags
  html = html.replace(
    /\n  <!-- (?:Article|WebPage|FAQ) schema -->[\s\S]*?<\/script>\n/g,
    ""
  );

  // 2. Update <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  // 3. Update meta description
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    `<meta name="description" content="${page.description}" />`
  );

  // 4. Inject fresh SEO block before </head>
  html = html.replace("</head>", buildSeoBlock(pageKey) + "</head>");

  // 5. Fix any SITE_URL fallback placeholder in submit.js references
  html = html.replace(/https:\/\/your-site\.vercel\.app/g, config.SITE_URL);

  fs.writeFileSync(filepath, html);
  return true;
}

// ── Generate sitemap.xml ──────────────────────────────────────────────────────
function buildSitemap() {
  const entries = Object.keys(config.pages).map(pageKey => {
    const url = pageUrl(pageKey);
    const priority = pageKey === "index" ? "1.0" : "0.8";
    return `  <url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
  console.log("  ✓ sitemap.xml");
}

// ── Generate robots.txt ───────────────────────────────────────────────────────
function buildRobots() {
  const txt = `User-agent: *\nAllow: /\nSitemap: ${config.SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(ROOT, "robots.txt"), txt);
  console.log("  ✓ robots.txt");
}

// ── Patch api/submit.js SITE_URL fallback ─────────────────────────────────────
function patchSubmitJs() {
  const submitPath = path.join(ROOT, "api", "submit.js");
  if (!fs.existsSync(submitPath)) return;

  let src = fs.readFileSync(submitPath, "utf8");
  // Replace any hardcoded fallback URL with current SITE_URL from config
  src = src.replace(
    /process\.env\.SITE_URL \|\| "https?:\/\/[^"]+"/g,
    `process.env.SITE_URL || "${config.SITE_URL}"`
  );
  fs.writeFileSync(submitPath, src);
  console.log("  ✓ api/submit.js SITE_URL patched");
}

// ── Main ──────────────────────────────────────────────────────────────────────
function run() {
  console.log(`\nBuilding in-place for: ${config.SITE_URL}\n`);

  let ok = 0;
  // fileMap: pageKey → actual filename in repo
  Object.entries(config.fileMap).forEach(([pageKey, filename]) => {
    const updated = processFile(filename, pageKey);
    if (updated) {
      console.log(`  ✓ ${filename}`);
      ok++;
    }
  });

  buildSitemap();
  buildRobots();
  patchSubmitJs();

  console.log(`\nDone — ${ok} files updated in place.`);
  console.log(`To change domain: edit SITE_URL in site.config.js and run node build.js again.\n`);
}

run();
