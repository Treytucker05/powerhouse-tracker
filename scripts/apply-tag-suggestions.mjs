#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data/extraction');
const REPORT = path.join(ROOT, 'reports', 'tag-audit.csv');
const TPL_FILES = ['templates.csv', 'templates_additions.csv'];
const UI_DATA_DIR = path.join(ROOT, 'tracker-ui-good/tracker-ui/data/extraction');
const TAG_CATALOG = fs.existsSync(path.join(DATA_DIR, 'tag_catalog.csv'))
    ? path.join(DATA_DIR, 'tag_catalog.csv')
    : path.join(UI_DATA_DIR, 'tag_catalog.csv');
const WRITE = process.argv.includes('--write');

function parseCsv(text) {
    const rows = [];
    let cell = '', row = [], q = false;
    for (let i = 0; i <= text.length; i++) {
        const ch = text[i];
        if (ch === '"') { q = !q; }
        else if ((ch === ',' || ch === undefined) && !q) { row.push(cell); cell = ''; if (ch === undefined) rows.push(row); }
        else if ((ch === '\n' || ch === '\r') && !q) { row.push(cell); cell = ''; if (row.length) rows.push(row); row = []; if (ch === '\r' && text[i + 1] === '\n') i++; }
        else { cell += ch ?? ''; }
    }
    return rows.map(r => r.map(c => (c ?? '').trim().replace(/^"|"$/g, '')));
}
function readCsvObj(p) {
    const text = fs.readFileSync(p, 'utf8');
    const [hdr, ...lines] = parseCsv(text);
    const header = hdr;
    const rows = lines.map(cols => {
        const o = {};
        header.forEach((h, i) => o[h] = cols[i] ?? '');
        return o;
    });
    return { header, rows };
}
function writeCsvObj(p, header, rows) {
    const esc = s => {
        const v = String(s ?? '');
        return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const csv = [header.join(','), ...rows.map(r => header.map(h => esc(r[h] ?? '')).join(','))].join('\n');
    fs.writeFileSync(p, csv, 'utf8');
}

function loadCatalogKeys() {
    const { header, rows } = readCsvObj(TAG_CATALOG);
    const idx = (n) => header.findIndex(h => h.toLowerCase() === n.toLowerCase());
    const ki = idx('key');
    const set = new Set();
    rows.forEach(r => {
        const k = (r[header[ki]] || r.key || '').trim();
        if (k) set.add(k);
    });
    return set;
}

function loadAudit() {
    if (!fs.existsSync(REPORT)) throw new Error('Missing reports/tag-audit.csv — run `npm run audit:tags` first.');
    const { header, rows } = readCsvObj(REPORT);
    const idx = (n) => header.findIndex(h => h === n);
    const idI = idx('id');
    const suggI = idx('suggested_additions');
    const unknownI = idx('unknown_tag_keys');
    const uncoloredI = idx('uncolored_tag_keys');

    const map = new Map();
    rows.forEach(r => {
        const id = (r[header[idI]] || r.id || '').trim();
        if (!id) return;
        const suggestions = (r[header[suggI]] || '').split('|').map(s => s.trim()).filter(Boolean);
        const unknown = (r[header[unknownI]] || '').split('|').map(s => s.trim()).filter(Boolean);
        const uncolored = (r[header[uncoloredI]] || '').split('|').map(s => s.trim()).filter(Boolean);
        map.set(id, { suggestions, unknown, uncolored });
    });
    return map;
}

function splitTags(raw = '') { return raw.split('|').map(x => x.trim()).filter(Boolean); }
function joinTags(arr) { return Array.from(new Set(arr.filter(Boolean))).sort().join('|'); }

function processFile(p, auditMap, catalogKeys) {
    const { header, rows } = readCsvObj(p);
    let changed = 0;
    const idCol = header.includes('id') ? 'id' : null;
    if (!idCol) return { header, rows, changed };

    rows.forEach(r => {
        const id = (r[idCol] || '').trim();
        if (!id || !auditMap.has(id)) return;

        const { suggestions } = auditMap.get(id);

        // Only keep suggestions that already exist in catalog
        const safe = suggestions.filter(k => catalogKeys.has(k));
        if (safe.length === 0) return;

        const before = r.tags || '';
        const merged = joinTags([...splitTags(before), ...safe]);
        if (merged !== before) {
            r.tags = merged;
            changed++;
        }
    });

    if (WRITE) writeCsvObj(p, header, rows);
    return { header, rows, changed, path: p };
}

(function main() {
    const catalogKeys = loadCatalogKeys();
    const auditMap = loadAudit();

    let totalChanged = 0;
    const results = [];

    for (const f of TPL_FILES) {
        const p = path.join(DATA_DIR, f);
        if (!fs.existsSync(p)) continue;
        const res = processFile(p, auditMap, catalogKeys);
        totalChanged += (res.changed || 0);
        results.push({ file: path.relative(ROOT, p), changed: res.changed || 0 });
    }

    console.log(WRITE ? 'Apply mode — files updated.' : 'Dry run — no files written.');
    results.forEach(r => console.log(`${r.file}: rows updated ${r.changed}`));
    console.log(`Total rows updated: ${totalChanged}`);

    if (totalChanged === 0) {
        console.log('No safe suggestions to apply. If audit shows unknown tags, handle them in the catalog first.');
    } else {
        console.log('Tip: run `npm run audit:tags` again to confirm a clean slate.');
    }
})();
