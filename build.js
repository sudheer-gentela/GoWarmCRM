// build.js
// Run with: node build.js
// Reads site.config.js and injects SEO/AEO meta tags, canonical URLs,
// Open Graph tags, Twitter cards, JSON-LD schema, and renames files
// to SEO-friendly slugs.
//
// Output: ./dist/ folder ready to deploy to Vercel.

"use strict";

const fs   = require("fs");
const path = require("path");
const config = require("./site.config.js");

const SRC  = __dirname;
const DIST = path.join(__dirname, "dist");

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fullUrl(slug) {
  if (slug === "index") return config.SITE_URL + "/";
  return `${config.SITE_URL}/${slug}`;
}

function buildSeoBlock(pageKey) {
  const page = config.pages[pageKey];
  if (!page) return "";

  const url        = fullUrl(page.slug);
  const title      = page.title;
  const desc       = page.description;
  const ogImage    = config.SITE_URL + config.OG_IMAGE;
  const twitterTag = config.TWITTER_HANDLE
    ? `  <meta name="twitter:site" content="${config.TWITTER_HANDLE}" />\n`
    : "";

  // ── Standard meta ──
  let block = `
  <!-- SEO -->
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
${twitterTag}  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${ogImage}" />
`;

  // ── JSON-LD Schema ──
  if (page.schema === "Article") {
    const articleSchema = {
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
    block += `\n  <script type="application/ld+json">\n  ${JSON.stringify(articleSchema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  if (page.schema === "WebPage") {
    const webSchema = {
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
    block += `\n  <script type="application/ld+json">\n  ${JSON.stringify(webSchema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  // ── FAQ Schema (AEO) ──
  if (page.faqs && page.faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": page.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    };
    block += `\n  <script type="application/ld+json">\n  ${JSON.stringify(faqSchema, null, 2).replace(/\n/g, "\n  ")}\n  </script>\n`;
  }

  return block;
}

function buildSitemapEntry(pageKey) {
  const page = config.pages[pageKey];
  const url  = fullUrl(page.slug);
  return `  <url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${pageKey === "index" ? "1.0" : "0.8"}</priority>\n  </url>`;
}

// ── Process HTML ──────────────────────────────────────────────────────────────

function processHtml(srcFile, pageKey) {
  let html = fs.readFileSync(srcFile, "utf8");
  const page = config.pages[pageKey];

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  // 2. Replace meta description
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    `<meta name="description" content="${page.description}" />`
  );

  // 3. Inject SEO block before </head>
  const seoBlock = buildSeoBlock(pageKey);
  html = html.replace("</head>", seoBlock + "\n</head>");

  // 4. Inject SITE_URL into any /api/submit fetch calls and article href links
  //    so auto-reply emails use the right domain
  html = html.replace(
    /https:\/\/your-site\.vercel\.app/g,
    config.SITE_URL
  );

  // 5. Update internal links to use new SEO slugs
  Object.entries(config.fileMap).forEach(([slug, filename]) => {
    if (filename === "index.html") return; // index.html stays as index.html
    // Replace href="article-X.html" with href="/slug" style links
    const escapedFilename = filename.replace(".", "\\.");
    const re = new RegExp(`href="${escapedFilename}"`, "g");
    html = html.replace(re, `href="${slug}"`);
  });

  return html;
}

// ── Build ─────────────────────────────────────────────────────────────────────

function build() {
  ensureDir(DIST);
  ensureDir(path.join(DIST, "api"));

  const processedPages = [];

  // Process each HTML page
  Object.entries(config.fileMap).forEach(([pageKey, filename]) => {
    const srcFile = path.join(SRC, filename);
    if (!fs.existsSync(srcFile)) {
      console.warn(`  SKIP (not found): ${filename}`);
      return;
    }

    const html     = processHtml(srcFile, pageKey);
    // Output as SEO slug filename (index stays index.html)
    const outName  = pageKey === "index" ? "index.html" : `${pageKey}.html`;
    const outFile  = path.join(DIST, outName);
    fs.writeFileSync(outFile, html);
    console.log(`  ✓ ${filename} → ${outName}`);
    processedPages.push(pageKey);
  });

  // Copy non-HTML assets
  ["style.css", "og-image.png"].forEach(asset => {
    const src = path.join(SRC, asset);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, asset));
      console.log(`  ✓ Copied ${asset}`);
    }
  });

  // Copy api/ folder
  const apiSrc = path.join(SRC, "api");
  if (fs.existsSync(apiSrc)) {
    ensureDir(path.join(DIST, "api"));
    fs.readdirSync(apiSrc).forEach(f => {
      fs.copyFileSync(path.join(apiSrc, f), path.join(DIST, "api", f));
      console.log(`  ✓ Copied api/${f}`);
    });
  }

  // Write submit.js env var injection (SITE_URL → process.env.SITE_URL)
  const submitSrc = path.join(SRC, "api", "submit.js");
  if (fs.existsSync(submitSrc)) {
    let submitJs = fs.readFileSync(submitSrc, "utf8");
    // Ensure SITE_URL falls back to config value if env var missing
    submitJs = submitJs.replace(
      `process.env.SITE_URL || "https://your-site.vercel.app"`,
      `process.env.SITE_URL || "${config.SITE_URL}"`
    );
    fs.writeFileSync(path.join(DIST, "api", "submit.js"), submitJs);
    console.log("  ✓ api/submit.js patched with SITE_URL fallback");
  }

  // Copy package.json and vercel.json
  ["package.json", "vercel.json"].forEach(f => {
    const src = path.join(SRC, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, f));
      console.log(`  ✓ Copied ${f}`);
    }
  });

  // Generate sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${processedPages.map(buildSitemapEntry).join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
  console.log("  ✓ sitemap.xml generated");

  // Generate robots.txt
  const robots = `User-agent: *\nAllow: /\nSitemap: ${config.SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), robots);
  console.log("  ✓ robots.txt generated");

  console.log(`\nBuild complete → ./dist/`);
  console.log(`Site URL: ${config.SITE_URL}`);
  console.log(`\nTo change domain: edit SITE_URL in site.config.js and run node build.js again.\n`);
}

build();
