#!/usr/bin/env node
/**
 * Regenerates the sha256 for every skill listed in
 * .well-known/agent-skills/index.json from the on-disk SKILL.md.
 *
 * Run modes:
 *   node scripts/build-skills-index.js          → rewrite index.json in place
 *   node scripts/build-skills-index.js --check  → exit 1 if any hash is stale (CI)
 *
 * The index is the discovery surface for agent clients that verify integrity.
 * If a hash drifts, a conforming client rejects the skill silently — so this
 * must run on every build, not by hand.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, '.well-known', 'agent-skills', 'index.json');
const SKILLS_DIR = path.join(ROOT, 'skills');

const checkOnly = process.argv.includes('--check');

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function fail(msg) {
  console.error(`[skills-index] ERROR: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(INDEX_PATH)) fail(`missing ${path.relative(ROOT, INDEX_PATH)}`);

const raw = fs.readFileSync(INDEX_PATH, 'utf8');
let index;
try {
  index = JSON.parse(raw);
} catch (err) {
  fail(`index.json is not valid JSON — ${err.message}`);
}

if (!Array.isArray(index.skills)) fail('index.json has no "skills" array');

// Every skill directory on disk must be represented in the index, and vice
// versa. A skill that exists but isn't indexed is invisible to agent clients.
const onDisk = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md')))
  .map((d) => d.name)
  .sort();

const indexed = index.skills.map((s) => s.name).sort();

const missingFromIndex = onDisk.filter((n) => !indexed.includes(n));
const missingFromDisk = indexed.filter((n) => !onDisk.includes(n));

if (missingFromIndex.length) fail(`skill(s) on disk but not in index.json: ${missingFromIndex.join(', ')}`);
if (missingFromDisk.length) fail(`skill(s) in index.json but not on disk: ${missingFromDisk.join(', ')}`);

let stale = 0;
for (const skill of index.skills) {
  const skillPath = path.join(SKILLS_DIR, skill.name, 'SKILL.md');
  const actual = sha256(skillPath);
  if (skill.sha256 !== actual) {
    stale += 1;
    console.log(`[skills-index] ${skill.name}: ${String(skill.sha256).slice(0, 8)}… → ${actual.slice(0, 8)}…`);
    skill.sha256 = actual;
  }
}

if (checkOnly) {
  if (stale) fail(`${stale} stale hash(es). Run: npm run build:skills-index`);
  console.log(`[skills-index] OK — ${index.skills.length} skill(s), all hashes current.`);
  process.exit(0);
}

if (stale) {
  // Preserve the file's trailing newline convention.
  const out = JSON.stringify(index, null, 2) + (raw.endsWith('\n') ? '\n' : '');
  fs.writeFileSync(INDEX_PATH, out);
  console.log(`[skills-index] Rewrote index.json — ${stale} hash(es) updated.`);
} else {
  console.log(`[skills-index] OK — ${index.skills.length} skill(s), all hashes already current.`);
}
