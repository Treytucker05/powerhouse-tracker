#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data/extraction');
const REPORT_DIR = path.join(ROOT, 'reports');
const UI_DATA_DIR = path.join(ROOT, 'tracker-ui-good/tracker-ui/data/extraction');
// Probe existing files dynamically across root and UI paths
const FILE_CANDIDATES = [
    path.join(DATA_DIR, 'templates_merged.csv'),
    path.join(DATA_DIR, 'templates.csv'),
    path.join(DATA_DIR, 'templates_master.csv'),
    path.join(DATA_DIR, 'templates_additions.csv'),
    path.join(UI_DATA_DIR, 'templates_merged.csv'),
    path.join(UI_DATA_DIR, 'templates_additions.csv'),
];
const FILES = FILE_CANDIDATES.filter(p => fs.existsSync(p));
const TAG_CATALOG = fs.existsSync(path.join(DATA_DIR, 'tag_catalog.csv'))
    ? path.join(DATA_DIR, 'tag_catalog.csv')
    : path.join(UI_DATA_DIR, 'tag_catalog.csv');

if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

function parseCsv(text) {
    // minimal CSV parser handling quotes/commas
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

function loadTagCatalog() {
    const { header, rows } = readCsvObj(TAG_CATALOG);
    const idx = name => header.findIndex(h => h.toLowerCase() === name.toLowerCase());
    const ki = idx('key'), gi = idx('group'), li = idx('label'), di = idx('description'), ci = idx('color');
    const map = new Map();
    rows.forEach(r => {
        const key = (r[header[ki]] || r.key || '').trim();
        if (!key) return;
        map.set(key, {
            key,
            group: (r[header[gi]] || r.group || '').trim(),
            label: (r[header[li]] || r.label || key).trim(),
            description: (r[header[di]] || r.description || '').trim(),
            color: (r[header[ci]] || r.color || '').trim(),
        });
    });
    return map;
}

function norm(s = '') { return s.toLowerCase(); }
function splitTags(raw = '') { return raw.split('|').map(x => x.trim()).filter(Boolean); }

// lightweight heuristics for suggestions
function deriveSchemeTag(s = '') {
    const x = norm(s);
    if (/spinal/.test(x)) return 'scheme:spinal-tap';
    if (/svr\s*ii|\bsvr 2\b/.test(x)) return 'scheme:svr-ii';
    if (/\bsvr\b/.test(x)) return 'scheme:svr';
    if (/5x5\/?3\/?1/.test(x)) return 'scheme:5x5-531';
    if (/5s\s*pro/.test(x)) return 'scheme:5s-pro';
    if (/(3\/5\/1|\b351\b)/.test(x)) return 'scheme:351';
    if (/(5\/3\/1|\b531\b)/.test(x)) return 'scheme:531';
    if (/full\s*body/.test(x)) return 'scheme:full-body';
    return '';
}
function deriveSupplementalTags(s = '') {
    const x = norm(s); const out = [];
    if (/bbb/.test(x) && /beefcake/.test(x)) out.push('supplemental:bbb-beefcake');
    else if (/bbb|boring but big/.test(x)) out.push('supplemental:bbb');
    if (/fsl|first set last/.test(x)) out.push('supplemental:fsl');
    if (/ssl|second set last/.test(x)) out.push('supplemental:ssl');
    return out;
}
function deriveAssistanceTags(mode = '', targets = '') {
    const x = norm(`${mode} ${targets}`); const out = [];
    if (/triumvirate/.test(x)) out.push('assistance:triumvirate');
    if (/periodization bible|3 movement/.test(x)) out.push('assistance:movement-families');
    if (/bodyweight/.test(x)) out.push('assistance:bodyweight');
    if (/circuit/.test(x)) out.push('assistance:circuits');
    return out;
}
function derivePhaseTag(la = '') {
    const x = norm(la);
    if (/leader/.test(x)) return 'phase:leader';
    if (/anchor/.test(x)) return 'phase:anchor';
    return '';
}
function deriveTemplateGroup(book = '', category = '') {
    const b = norm(book), c = norm(category);
    if (/football/.test(b) || /football/.test(c)) return 'template:football';
    if (/forever/.test(b)) return 'template:forever';
    if (/beyond/.test(b)) return 'template:beyond';
    if (/powerlifting/.test(b) || /powerlifting/.test(c)) return 'template:powerlifting';
    if (/5\/?3\/?1(?!.*beyond|.*forever)/.test(b) || /classic|1st|2nd edition/.test(b)) return 'template:classic';
    return '';
}

function audit() {
    const catalog = loadTagCatalog();
    const unknownKeys = new Set();
    const uncoloredKeys = new Set();
    const report = [];

    let scanned = 0;

    for (const p of FILES) {
        const { header, rows } = readCsvObj(p);

        rows.forEach(r => {
            scanned++;
            // Normalize field names across merged/master/additions
            const id = r.id || '';
            const name = r.display_name || r['Template Name'] || '';
            const book = r.source_book || r.book || r['Book'] || '';
            const pages = r.source_pages || r.pages || r['Page'] || '';

            const present = new Set(splitTags(r.tags || ''));
            const unknown = [];
            const uncolored = [];

            for (const t of present) {
                if (!catalog.has(t)) { unknown.push(t); unknownKeys.add(t); continue; }
                const meta = catalog.get(t);
                if (!meta.color) { uncolored.push(t); uncoloredKeys.add(t); }
            }

            // missing key categories
            const frequency = String(r.days_per_week || '').trim();
            const hasFreq = Array.from(present).some(k => /^frequency:\d+d$/.test(k));
            const missing_frequency = !!frequency && !hasFreq ? 'yes' : '';

            const schemeTag = deriveSchemeTag(r.scheme || r.core_scheme || r['Main Work'] || '');
            const hasScheme = Array.from(present).some(k => k.startsWith('scheme:'));
            const missing_scheme = schemeTag && !hasScheme ? 'yes' : '';

            const suppTags = deriveSupplementalTags(r.supplemental || r['Supplemental'] || '');
            const hasSupp = Array.from(present).some(k => k.startsWith('supplemental:'));
            const missing_supplemental = (suppTags.length && !hasSupp) ? 'yes' : '';

            const assistTargets = r.assistance_targets || r.assistance_guideline || r['Assistance'] || '';
            const assistTags = deriveAssistanceTags(r.assistance_mode || '', assistTargets);
            const hasAssist = Array.from(present).some(k => k.startsWith('assistance:'));
            const missing_assistance = (assistTags.length && !hasAssist) ? 'yes' : '';

            const phaseTag = derivePhaseTag(r.leader_anchor_fit || r.leader_anchor || r['Leader/Anchor'] || '');
            const hasPhase = Array.from(present).some(k => k.startsWith('phase:'));
            const missing_phase = (phaseTag && !hasPhase) ? 'yes' : '';

            const templateGroup = deriveTemplateGroup(book || '', r.category || '');
            const hasTemplateGroup = Array.from(present).some(k => k.startsWith('template:'));
            const missing_template_group = (templateGroup && !hasTemplateGroup) ? 'yes' : '';

            // suggestions (safe only)
            const suggestions = new Set();
            if (!hasTemplateGroup && templateGroup) suggestions.add(templateGroup);
            if (missing_frequency) {
                const n = parseInt(frequency, 10);
                if (n) suggestions.add(`frequency:${n}d`);
            }
            if (missing_scheme && schemeTag) suggestions.add(schemeTag);
            for (const s of suppTags) if (!hasSupp) suggestions.add(s);
            for (const a of assistTags) if (!hasAssist) suggestions.add(a);
            if (missing_phase && phaseTag) suggestions.add(phaseTag);

            report.push({
                id, display_name: name, book, pages,
                tags: Array.from(present).join('|'),
                unknown_tag_keys: unknown.join('|'),
                uncolored_tag_keys: uncolored.join('|'),
                missing_frequency,
                missing_scheme,
                missing_supplemental,
                missing_assistance,
                missing_phase,
                missing_template_group,
                suggested_additions: Array.from(suggestions).join('|')
            });
        });
    }

    // write report
    const header = [
        'id', 'display_name', 'book', 'pages', 'tags',
        'unknown_tag_keys', 'uncolored_tag_keys',
        'missing_frequency', 'missing_scheme', 'missing_supplemental', 'missing_assistance', 'missing_phase', 'missing_template_group',
        'suggested_additions'
    ];
    const outPath = path.join(REPORT_DIR, 'tag-audit.csv');
    writeCsvObj(outPath, header, report);

    // summary
    console.log(`Scanned templates: ${scanned}`);
    console.log(`Unknown tag keys: ${unknownKeys.size}`);
    console.log(`Catalog keys missing color: ${uncoloredKeys.size}`);
    console.log(`Report written: ${path.relative(ROOT, outPath)}`);
}

audit();
