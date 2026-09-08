#!/usr/bin/env node
/**
 * apply-work-pass2.js
 *
 *   node scripts/apply-work-pass2.js --dry-run     show every change, write nothing
 *   node scripts/apply-work-pass2.js               apply
 *
 * Adds the GoWarm Work pillar to the existing site. Five edits, all idempotent —
 * run it twice and the second run reports "already applied" for everything.
 *
 *   1. NAV        adds a "GoWarm Work" item before Pricing in every page that
 *                 has a .nav-links list (website/*.html and website/ai-shift/*.html)
 *   2. INDEX      adds a section pointing at /work, between PROBLEMS and COMPARE
 *   3. PLATFORM   adds Projects + Daily Work module rows, a hero pill, and bumps
 *                 the module count stat from 11 to 13
 *   4. PRICING    adds a Work strip above the "Not sure which plan fits?" note
 *   5. CONTACT    adds a hidden source input + the contact-source.js include
 *
 * Line endings are preserved: every edit inserts text around existing anchors
 * rather than rewriting whole files.
 *
 * Run against the website repo root (the directory holding website/, markdown/,
 * skills/ and sitemap.xml), or pass the root as the first non-flag argument.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry-run');
const argRoot = process.argv.slice(2).find((a) => !a.startsWith('--'));

/* ── locate the repo root ──────────────────────────────────────────────── */

const CANDIDATES = [
  argRoot,
  process.env.GW_SITE_ROOT,
  process.cwd(),
  path.join(__dirname, '..'),
].filter(Boolean);

const ROOT = CANDIDATES.find((p) => {
  try {
    return fs.existsSync(path.join(p, 'website', 'index.html'));
  } catch {
    return false;
  }
});

if (!ROOT) {
  console.error('\nCould not find the site root (a directory containing website/index.html).');
  console.error('Looked in:\n');
  CANDIDATES.forEach((p) => console.error('  ' + p));
  console.error('\n  node scripts/apply-work-pass2.js /path/to/website-gowarmcrm\n');
  process.exit(2);
}

const done = [];
const skipped = [];
const warned = [];

function readFileIfExists(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function write(p, next, label) {
  if (DRY) {
    done.push(`${label}  (dry run — not written)`);
    return;
  }
  fs.writeFileSync(p, next);
  done.push(label);
}

/* ═══ 1. NAV ═══════════════════════════════════════════════════════════════ */

const NAV_ITEM = '<li><a href="/work">GoWarm Work</a></li>';
// matches both the plain and the class="active" form of the Pricing item
const NAV_ANCHOR = /([ \t]*)<li><a href="\/pricing"( class="active")?>Pricing<\/a><\/li>/;

function navFiles() {
  const dirs = [path.join(ROOT, 'website'), path.join(ROOT, 'website', 'ai-shift')];
  const out = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.html')) out.push(path.join(dir, name));
    }
  }
  return out.sort();
}

function applyNav() {
  const files = navFiles();
  let changed = 0;
  const noNav = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const src = readFileIfExists(file);
    if (src === null) continue;

    if (!src.includes('<ul class="nav-links">')) {
      noNav.push(rel);
      continue;
    }
    if (src.includes('href="/work"')) {
      skipped.push(`nav       ${rel} — already has the Work item`);
      continue;
    }
    const m = src.match(NAV_ANCHOR);
    if (!m) {
      warned.push(`nav       ${rel} — has a nav but no Pricing item to anchor on; add "${NAV_ITEM}" by hand`);
      continue;
    }
    const indent = m[1];
    const next = src.replace(NAV_ANCHOR, `${indent}${NAV_ITEM}\n${m[0]}`);
    write(file, next, `nav       ${rel}`);
    changed += 1;
  }

  if (noNav.length) {
    warned.push(
      `nav       ${noNav.length} page(s) have no .nav-links list and were left alone: ${noNav.join(', ')}`
    );
  }
  return changed;
}

/* ═══ 2. INDEX SECTION ═════════════════════════════════════════════════════ */

const INDEX_ANCHOR = '  <!-- 5. COMPARE — with CRM attack line -->';

const INDEX_BLOCK = `  <!-- 5c. GOWARM WORK -->
  <section id="work-strip" style="padding:76px 0;border-bottom:1px solid var(--border);background:var(--cream-2);">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;" class="workstrip-inner">
        <div>
          <span style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--rust);display:block;margin-bottom:18px;">GoWarm Work</span>
          <h2 style="font-family:var(--serif);font-size:36px;font-weight:700;color:var(--ink);line-height:1.18;margin-bottom:18px;">Execution is not only a sales problem.</h2>
          <p style="font-family:var(--body-serif);font-size:16px;color:var(--ink-2);line-height:1.8;font-weight:300;margin-bottom:16px;">The same gap runs through delivery. Projects that quietly stopped three weeks ago. People whose work appears in no pipeline and no dashboard. A shared spreadsheet standing in for a system of record, and a founder who is the integration layer between all of it.</p>
          <p style="font-family:var(--body-serif);font-size:16px;color:var(--ink-2);line-height:1.8;font-weight:300;margin-bottom:26px;">GoWarm Work is project and daily work tracking built on the same principle: the record of work is a byproduct of doing it, not a second job on top of it. Same platform, switched on per organisation.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="/work" class="btn btn-primary">See GoWarm Work</a>
            <a href="/why-you-stopped-knowing" class="btn btn-outline">Read the argument</a>
          </div>
        </div>
        <div style="display:grid;gap:12px;">
          <div style="background:#fff;border:1px solid var(--border);border-left:3px solid var(--rust);border-radius:8px;padding:22px 24px;">
            <div style="font-family:var(--serif);font-size:18px;font-weight:600;color:var(--ink);margin-bottom:7px;">Written once, read in three places</div>
            <div style="font-size:13.5px;color:var(--ink-3);line-height:1.6;">One line from the person doing the work shows on their day, against the project task, and in their manager's view.</div>
          </div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:22px 24px;">
            <div style="font-family:var(--serif);font-size:18px;font-weight:600;color:var(--ink);margin-bottom:7px;">Nothing to fall behind on</div>
            <div style="font-size:13.5px;color:var(--ink-3);line-height:1.6;">No system generates work for anyone, so no queue grows past the point of being read.</div>
          </div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:22px 24px;">
            <div style="font-family:var(--serif);font-size:18px;font-weight:600;color:var(--ink);margin-bottom:7px;">Runs without a project office</div>
            <div style="font-size:13.5px;color:var(--ink-3);line-height:1.6;">Gates, dependencies, a frozen baseline and required evidence do what an administrator would otherwise be doing.</div>
          </div>
        </div>
      </div>
    </div>
    <style>@media (max-width:900px){#work-strip .workstrip-inner{grid-template-columns:1fr;gap:36px;}#work-strip h2{font-size:28px;}}</style>
  </section>

`;

function applyIndex() {
  const file = path.join(ROOT, 'website', 'index.html');
  const rel = path.relative(ROOT, file);
  const src = readFileIfExists(file);
  if (src === null) return warned.push(`index     ${rel} not found`);

  if (src.includes('id="work-strip"')) {
    return skipped.push(`index     ${rel} — Work section already present`);
  }
  if (!src.includes(INDEX_ANCHOR)) {
    return warned.push(
      `index     ${rel} — anchor "${INDEX_ANCHOR.trim()}" not found; paste the block before the COMPARE section by hand`
    );
  }
  write(file, src.replace(INDEX_ANCHOR, INDEX_BLOCK + INDEX_ANCHOR), `index     ${rel} — Work section added`);
}

/* ═══ 3. PLATFORM OVERVIEW ═════════════════════════════════════════════════ */

const PO_PILL_ANCHOR = '<span class="pill"><span class="pill-dot"></span>Prospecting</span>';
const PO_PILL_NEW =
  '<span class="pill"><span class="pill-dot"></span>Prospecting</span>\n        <span class="pill"><span class="pill-dot"></span>Projects</span>\n        <span class="pill"><span class="pill-dot"></span>Daily Work</span>';

const PO_ROW_ANCHOR = `        <div class="module-row">
          <div class="module-icon">🎯</div>
          <div><div class="module-name">Prospecting</div><div class="module-desc">Outbound prospecting, sequences, sender accounts, prospect inbox, and AI-generated next steps.</div></div>
          <div class="module-who">SDR / BDR</div>
        </div>`;

const PO_ROWS_NEW =
  PO_ROW_ANCHOR +
  `
        <div class="module-row">
          <div class="module-icon">🧱</div>
          <div><div class="module-name">Projects</div><div class="module-desc">Stages with gates, task dependencies, a baseline frozen at start, evidence required to close, and Bill of Quantities with an append-only spend ledger. Timeboxed and standing work are tracked separately.</div></div>
          <div class="module-who">Delivery / PM</div>
        </div>
        <div class="module-row">
          <div class="module-icon">🗒️</div>
          <div><div class="module-name">Daily Work</div><div class="module-desc">One line a day from the person doing the work, read by their own day, the project task and the manager rollup. Measured against working days, not against generated tasks.</div></div>
          <div class="module-who">Everyone</div>
        </div>`;

const PO_STAT_ANCHOR = `<div class="stat-num">11</div>
          <div class="stat-label">Platform modules covering the full GTM motion</div>`;
const PO_STAT_NEW = `<div class="stat-num">13</div>
          <div class="stat-label">Platform modules covering sales execution and delivery</div>`;

function applyPlatformOverview() {
  const file = path.join(ROOT, 'website', 'platform-overview.html');
  const rel = path.relative(ROOT, file);
  let src = readFileIfExists(file);
  if (src === null) return warned.push(`platform  ${rel} not found`);

  if (src.includes('<div class="module-name">Daily Work</div>')) {
    return skipped.push(`platform  ${rel} — Projects/Daily Work rows already present`);
  }

  const parts = [];

  const pillCount = src.split(PO_PILL_ANCHOR).length - 1;
  if (pillCount === 0) {
    warned.push(`platform  ${rel} — Prospecting pill not found; add the Projects and Daily Work pills by hand`);
  } else {
    src = src.split(PO_PILL_ANCHOR).join(PO_PILL_NEW);
    parts.push(`${pillCount} hero pill block(s)`);
  }

  if (!src.includes(PO_ROW_ANCHOR)) {
    warned.push(`platform  ${rel} — Prospecting module row not found; add the two module rows by hand`);
  } else {
    src = src.replace(PO_ROW_ANCHOR, PO_ROWS_NEW);
    parts.push('2 module rows');
  }

  if (!src.includes(PO_STAT_ANCHOR)) {
    warned.push(`platform  ${rel} — module-count stat not found; check the "11 modules" figure by hand`);
  } else {
    src = src.replace(PO_STAT_ANCHOR, PO_STAT_NEW);
    parts.push('module count 11 → 13');
  }

  if (!parts.length) return;
  write(file, src, `platform  ${rel} — ${parts.join(', ')}`);
}

/* ═══ 4. PRICING STRIP ═════════════════════════════════════════════════════ */

const PRICING_ANCHOR = '      <div class="custom-note">';

const PRICING_BLOCK = `      <div id="work-strip" style="margin-top:32px;background:#fff;border:1px solid var(--border);border-left:3px solid var(--rust);border-radius:10px;padding:32px 36px;">
        <div style="display:flex;gap:36px;align-items:center;flex-wrap:wrap;justify-content:space-between;">
          <div style="flex:1 1 420px;">
            <div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:12px;">GoWarm Work · priced separately</div>
            <h3 style="font-family:var(--serif);font-size:24px;font-weight:700;color:var(--ink);line-height:1.25;margin-bottom:10px;">Not buying this for a sales team?</h3>
            <p style="font-family:var(--body-serif);font-size:15px;color:var(--ink-3);line-height:1.75;font-weight:300;">Projects and daily work tracking run on the same platform, switched on per organisation, and can be bought on their own with no sales module enabled. <strong style="font-family:var(--sans);font-size:14px;color:var(--ink);font-weight:600;">$999/month for up to 25 users</strong>, custom above that. Already on a sales plan? Talk to us about the combined price rather than buying twice.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start;flex:0 0 auto;">
            <a href="/work" class="btn btn-primary" style="white-space:nowrap;">See GoWarm Work</a>
            <a href="/why-you-stopped-knowing" style="font-size:12px;color:var(--rust);font-weight:600;white-space:nowrap;">Read the argument →</a>
          </div>
        </div>
      </div>

`;

function applyPricing() {
  const file = path.join(ROOT, 'website', 'pricing.html');
  const rel = path.relative(ROOT, file);
  const src = readFileIfExists(file);
  if (src === null) return warned.push(`pricing   ${rel} not found`);

  if (src.includes('id="work-strip"')) {
    return skipped.push(`pricing   ${rel} — Work strip already present`);
  }
  if (!src.includes(PRICING_ANCHOR)) {
    return warned.push(`pricing   ${rel} — custom-note anchor not found; paste the strip above it by hand`);
  }
  write(file, src.replace(PRICING_ANCHOR, PRICING_BLOCK + PRICING_ANCHOR), `pricing   ${rel} — Work strip added`);
}

/* ═══ 5. CONTACT SOURCE FIELD ══════════════════════════════════════════════ */

const CONTACT_INPUT_ANCHOR = '          <div id="form-wrap">';
const CONTACT_INPUT_NEW =
  CONTACT_INPUT_ANCHOR +
  '\n            <input type="hidden" id="source" value="sales" />';

const CONTACT_SCRIPT_ANCHOR = '  <script src="/website/webmcp.js" defer></script>';
const CONTACT_SCRIPT_NEW =
  '  <script src="/website/contact-source.js"></script>\n' + CONTACT_SCRIPT_ANCHOR;

function applyContact() {
  const file = path.join(ROOT, 'website', 'contact.html');
  const rel = path.relative(ROOT, file);
  let src = readFileIfExists(file);
  if (src === null) return warned.push(`contact   ${rel} not found`);

  if (src.includes('id="source"')) {
    return skipped.push(`contact   ${rel} — source field already present`);
  }

  const parts = [];

  if (!src.includes(CONTACT_INPUT_ANCHOR)) {
    warned.push(`contact   ${rel} — #form-wrap not found; add the hidden input by hand`);
  } else {
    src = src.replace(CONTACT_INPUT_ANCHOR, CONTACT_INPUT_NEW);
    parts.push('hidden #source input');
  }

  if (!src.includes(CONTACT_SCRIPT_ANCHOR)) {
    warned.push(`contact   ${rel} — webmcp script tag not found; add contact-source.js by hand`);
  } else {
    src = src.replace(CONTACT_SCRIPT_ANCHOR, CONTACT_SCRIPT_NEW);
    parts.push('contact-source.js include');
  }

  if (!parts.length) return;
  write(file, src, `contact   ${rel} — ${parts.join(', ')}`);

  if (!/function\s+handleSubmit/.test(src)) {
    warned.push(
      'contact   handleSubmit() is called by the form button but is not defined anywhere in this repo. ' +
        'Wherever it lives, add: formType: document.getElementById("source").value — api/submit.js already ' +
        'writes data.formType to column J of the sheet.'
    );
  }
}

/* ═══ run ══════════════════════════════════════════════════════════════════ */

console.log(`\n[work-pass2] root: ${ROOT}`);
console.log(`[work-pass2] mode: ${DRY ? 'DRY RUN — nothing will be written' : 'APPLY'}\n`);

applyNav();
applyIndex();
applyPlatformOverview();
applyPricing();
applyContact();

if (done.length) {
  console.log('CHANGED');
  done.forEach((d) => console.log('  ' + d));
  console.log('');
}
if (skipped.length) {
  console.log('ALREADY APPLIED');
  skipped.forEach((s) => console.log('  ' + s));
  console.log('');
}
if (warned.length) {
  console.log('NEEDS ATTENTION');
  warned.forEach((w) => console.log('  ' + w));
  console.log('');
}

console.log(
  `[work-pass2] ${done.length} change(s), ${skipped.length} already applied, ${warned.length} to look at.`
);
if (DRY) console.log('[work-pass2] Re-run without --dry-run to write.\n');
else console.log('[work-pass2] Done.\n');
