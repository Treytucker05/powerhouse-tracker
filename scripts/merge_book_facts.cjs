#!/usr/bin/env node
/*
 Merge book facts into enriched template data and regenerate markdown docs.
 Spec:
 1) Read tracker-ui-good/tracker-ui/public/templates/enriched.json and templates/*.md
 2) Load books_facts.csv at repo root with headers:
    template_id,display_name,book,page,field,value,quote,confidence,replace
 3) For each row: resolve template by template_id or slug(display_name). Normalize field.
    - field==tags: split on [|,] and dedupe into template.tags
    - field in textFields: if replace==true or existing is NEEDS_RESEARCH then set; else append as new paragraph. Attach citation array per field.
    - field in numericFields: coerce number and set if valid.
 4) After processing: write enriched.json (with .bak backup) and regenerate per-template markdown files with sections.
 5) Update _index.json summary.
 6) Print concise summary and exit 0.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const UI_ROOT = path.join(ROOT, 'tracker-ui-good', 'tracker-ui');
const TEMPLATES_DIR = path.join(UI_ROOT, 'public', 'templates');
const ENRICHED_PATH = path.join(TEMPLATES_DIR, 'enriched.json');
const INDEX_PATH = path.join(TEMPLATES_DIR, '_index.json');
const BOOKS_CSV = path.join(ROOT, 'books_facts.csv');

// CSV parser (prefer papaparse from UI project if available)
let Papa;
try { Papa = require('papaparse'); }
catch {
    try { Papa = require(path.join(UI_ROOT, 'node_modules', 'papaparse')); }
    catch { Papa = null; }
}

function slug(s) {
    return String(s || '')
        .trim()
        .toLowerCase()
        .replace(/^(jack\s*sh\*t|jack\s*shit)$/i, 'jackshit')
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function readCsvRows(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    if (Papa) {
        const r = Papa.parse(text, { header: true, skipEmptyLines: true });
        return Array.isArray(r.data) ? r.data : [];
    }
    // Fallback tiny parser (no quoted commas support)
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    if (!headerLine) return [];
    const headers = headerLine.split(',');
    return lines.map(l => {
        const cells = l.split(',');
        const o = {}; headers.forEach((h, i) => { o[h] = cells[i]; });
        return o;
    });
}

function normalizeField(f) {
    const key = String(f || '').trim().toLowerCase().replace(/\s+/g, '_');
    const map = {
        overview: 'blurb',
        description: 'blurb',
        best: 'best_for',
        bestfor: 'best_for',
        avoid: 'avoid_if',
        pitfalls: 'pitfalls',
        supplementalnotes: 'supplemental_note',
        supplemental_note: 'supplemental_note',
        schemenote: 'scheme_note',
        scheme_note: 'scheme_note',
        notes: 'blurb',
        source: 'source',
        tags: 'tags',
        tm: 'tm_default_pct',
        tm_default_pct: 'tm_default_pct',
        days_per_week: 'days_per_week'
    };
    return map[key] || key;
}

const textFields = new Set(['blurb', 'best_for', 'avoid_if', 'pitfalls', 'supplemental_note', 'scheme_note', 'source']);
const numericFields = new Set(['tm_default_pct', 'days_per_week']);

function mergeCitation(store, field, entry) {
    if (!store.citations) store.citations = {};
    if (!Array.isArray(store.citations[field])) store.citations[field] = [];
    // Basic dedupe by book+page+quote
    const sig = (e) => `${e.book || ''}|${e.page || ''}|${(e.quote || '').slice(0, 80)}`;
    const seen = new Set(store.citations[field].map(sig));
    if (!seen.has(sig(entry))) store.citations[field].push(entry);
}

function applyRow(tpl, row) {
    const rawField = row.field;
    const field = normalizeField(rawField);
    const valRaw = String(row.value ?? '').trim();
    const replace = String(row.replace ?? '').trim().toLowerCase();
    const shouldReplace = replace === 'true' || replace === '1' || replace === 'yes' || replace === 'y';
    const citation = {
        book: String(row.book || '').trim(),
        page: String(row.page || '').trim(),
        quote: String(row.quote || '').trim(),
        confidence: String(row.confidence || '').trim()
    };

    if (field === 'tags') {
        const pieces = valRaw.split(/[|,]/g).map(s => s.trim().toLowerCase()).filter(Boolean);
        const tags = Array.from(new Set([...(tpl.tags || []), ...pieces]));
        tpl.tags = tags;
        if (citation.book || citation.page || citation.quote) mergeCitation(tpl, 'tags', citation);
        return true;
    }

    if (numericFields.has(field)) {
        const num = Number(valRaw);
        if (!Number.isNaN(num)) { tpl[field] = num; }
        if (citation.book || citation.page || citation.quote) mergeCitation(tpl, field, citation);
        return true;
    }

    if (textFields.has(field)) {
        const existing = String(tpl[field] ?? '').trim();
        if (shouldReplace || existing === '' || existing === 'NEEDS_RESEARCH') {
            tpl[field] = valRaw;
        } else if (valRaw) {
            tpl[field] = existing ? `${existing}\n\n${valRaw}` : valRaw;
        }
        if (citation.book || citation.page || citation.quote) mergeCitation(tpl, field, citation);
        return true;
    }

    // Unknown field => skip but not fatal
    return false;
}

function renderMarkdown(d) {
    const badges = d.badges || {};
    const sections = [];
    sections.push(`# ${d.display_name}\n`);
    sections.push(`## Overview\n${d.blurb || ''}`);
    sections.push(`## Badges\n- Time: ${badges.time_band || 'varies'}\n- Difficulty: ${badges.difficulty || 'All Levels'}\n- Focus: ${badges.focus || 'General'}`);
    sections.push(`## Tags\n${(d.tags || []).join(', ')}`);
    sections.push(`## Best For\n${d.best_for || ''}`);
    sections.push(`## Avoid If\n${d.avoid_if || ''}`);
    sections.push(`## Pitfalls\n${d.pitfalls || ''}`);
    sections.push(`## Supplemental Notes\n${d.supplemental_note || ''}`);
    sections.push(`## Scheme Notes\n${d.scheme_note || ''}`);
    const cites = d.citations || {};
    const flat = Object.entries(cites).flatMap(([field, arr]) =>
        (Array.isArray(arr) ? arr : []).map(c => ({ field, ...c }))
    );
    if (flat.length) {
        sections.push('## Sources');
        flat.forEach(c => {
            const bits = [c.book, c.page ? `p.${c.page}` : null].filter(Boolean).join(', ');
            const q = c.quote ? `“${c.quote}”` : '';
            const conf = c.confidence ? ` (${c.confidence})` : '';
            sections.push(`- ${bits}: ${q}${conf} — ${c.field}`);
        });
    } else {
        sections.push('## Sources\n');
    }
    return sections.join('\n\n') + '\n';
}

function main() {
    ensureDir(TEMPLATES_DIR);
    if (!fs.existsSync(ENRICHED_PATH)) {
        console.error('enriched.json not found at', ENRICHED_PATH);
        console.log(JSON.stringify({ templatesUpdated: 0, rowsProcessed: 0, rowsSkipped: 0, note: 'no enriched.json' }));
        return 0;
    }
    const enriched = readJson(ENRICHED_PATH);
    const byId = new Map();
    const bySlug = new Map();
    for (const d of enriched) {
        if (!d) continue;
        if (d.id) byId.set(String(d.id).trim(), d);
        const disp = String(d.display_name || '').trim();
        if (disp) bySlug.set(slug(disp), d);
    }

    const rows = readCsvRows(BOOKS_CSV);
    let rowsProcessed = 0, rowsSkipped = 0;
    let touched = new Set();
    for (const row of rows) {
        const id = String(row.template_id || '').trim();
        const dn = String(row.display_name || '').trim();
        const key = id || (dn ? slug(dn) : '');
        const tpl = (id && byId.get(id)) || (key && byId.get(key)) || (key && bySlug.get(key));
        if (!tpl) { rowsSkipped++; continue; }
        const ok = applyRow(tpl, row);
        if (ok) { rowsProcessed++; touched.add(tpl.id); }
    }

    // Backup enriched.json
    try { fs.copyFileSync(ENRICHED_PATH, ENRICHED_PATH + '.bak'); } catch { }

    // Write updated enriched.json
    writeJson(ENRICHED_PATH, enriched);

    // Regenerate markdown and index
    const index = [];
    for (const d of enriched) {
        const md = renderMarkdown(d);
        fs.writeFileSync(path.join(TEMPLATES_DIR, `${d.id}.md`), md);
        index.push({ id: d.id, display_name: d.display_name, tags: d.tags || [], badges: d.badges || {} });
    }
    writeJson(INDEX_PATH, index);

    // Compute remaining NEEDS_RESEARCH
    const needsFields = ['blurb', 'best_for', 'avoid_if', 'pitfalls', 'supplemental_note', 'scheme_note', 'source'];
    const stillNeeds = enriched
        .filter(d => needsFields.some(f => String(d[f] || '').includes('NEEDS_RESEARCH')))
        .map(d => d.id);

    const out = {
        templatesUpdated: touched.size,
        rowsProcessed,
        rowsSkipped,
        needsResearchTemplates: stillNeeds
    };
    console.log(JSON.stringify(out));
    return 0;
}

if (require.main === module) {
    try { process.exitCode = main(); }
    catch (e) { console.error(e); process.exit(1); }
}
