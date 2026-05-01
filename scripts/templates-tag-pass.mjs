#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data/extraction');
const UI_DATA_DIR = path.join(ROOT, 'tracker-ui-good/tracker-ui/data/extraction');
// Note: repo uses templates_master.csv; include both names for compatibility
const TPL_FILES = ['templates.csv', 'templates_master.csv', 'templates_additions.csv'];

const DRY = !process.argv.includes('--write');

function parseCsv(text) {
    // minimal safe CSV (handles quotes + commas)
    const rows = [];
    let i = 0, cur = '', cell = [], inQ = false;
    const pushCell = () => { cell.push(cur); cur = ''; };
    const pushRow = () => { rows.push(cell); cell = []; };
    while (i <= text.length) {
        const ch = text[i++];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { pushCell(); }
        else if ((ch === '\n' || ch === '\r' && text[i] !== '\n') && !inQ) { pushCell(); if (cell.length > 1 || (cell.length === 1 && cell[0] !== '')) pushRow(); }
        else if (ch === undefined) { pushCell(); if (cell.length > 1 || (cell.length === 1 && cell[0] !== '')) pushRow(); }
        else { cur += ch ?? ''; }
    }
    // trim BOM/whitespace
    return rows.map(r => r.map(c => (c || '').trim().replace(/^\uFEFF/, '').replace(/^"|"$/g, '')));
}
function stringifyCsv(header, rows) {
    const esc = (s = '') => {
        const v = String(s);
        return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    return [header.join(','), ...rows.map(r => header.map(h => esc(r[h] ?? '')).join(','))].join('\n');
}
function readCsvObj(p) {
    const text = fs.readFileSync(p, 'utf8');
    const [hdr, ...lines] = parseCsv(text);
    const header = hdr;
    const objs = lines.map(cols => {
        const o = {};
        header.forEach((h, i) => o[h] = cols[i] ?? '');
        return o;
    });
    return { header, rows: objs };
}
function writeCsvObj(p, header, rows) {
    fs.writeFileSync(p, stringifyCsv(header, rows), 'utf8');
}

// ---------- Tag helpers ----------
function norm(s = '') { return s.toLowerCase(); }
function add(set, k) { if (k) set.add(k); }
function tagFromDays(dpw) {
    const n = parseInt(dpw, 10);
    return n ? `frequency:${n}d` : null;
}
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
    return null;
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
    const x = norm(mode + ' ' + targets); const out = [];
    if (/triumvirate/.test(x)) out.push('assistance:triumvirate');
    if (/periodization bible|3 movement/.test(x)) out.push('assistance:movement-families');
    if (/bodyweight/.test(x)) out.push('assistance:bodyweight');
    if (/circuit/.test(x)) out.push('assistance:circuits');
    return out;
}
function templateTagByBook(book = '', category = '') {
    const b = norm(book), c = norm(category);
    if (/football/.test(b) || /football/.test(c)) return 'template:football';
    if (/forever/.test(b)) return 'template:forever';
    if (/beyond/.test(b)) return 'template:beyond';
    if (/5\/?3\/?1(?!.*beyond|.*forever)/.test(b) || /2nd edition|1st edition|classic/.test(b)) return 'template:classic';
    return null;
}
function goalTag(goal = '') {
    const g = norm(goal);
    if (/hypertrophy|size/.test(g)) return 'goal:hypertrophy';
    if (/conditioning|work capacity|fat loss|weight loss/.test(g)) return 'goal:conditioning';
    if (/strength|powerlifting|max/.test(g)) return 'goal:strength';
    if (/balanced|general|all-around/.test(g)) return 'goal:balanced';
    return null;
}

function deriveTags(row) {
    const tags = new Set((row.tags || '').split('|').map(s => s.trim()).filter(Boolean));

    // frequency
    add(tags, tagFromDays(row.days_per_week));

    // scheme
    add(tags, deriveSchemeTag(row.scheme || row.core_scheme || row['Main Work']));

    // supplemental
    for (const t of deriveSupplementalTags(row.supplemental || row['Supplemental'] || '')) add(tags, t);

    // assistance
    for (const t of deriveAssistanceTags(row.assistance_mode || '', row.assistance_targets || row['Assistance'] || '')) add(tags, t);

    // leader/anchor
    const la = norm(row.leader_anchor_fit || row['Leader/Anchor'] || '');
    if (/leader/.test(la)) add(tags, 'phase:leader');
    if (/anchor/.test(la)) add(tags, 'phase:anchor');

    // book/category template group
    add(tags, templateTagByBook(row.book || row['Book'] || '', row.category || ''));

    // seasonality (pass-through if already normalized)
    const sea = norm(row.seasonality || '');
    if (sea === 'off-season' || sea === 'off') add(tags, 'season:off');
    if (sea === 'in-season' || sea === 'in') add(tags, 'season:in');

    // jokers/pr flags
    const jk = norm(String(row.jokers_allowed || ''));
    if (jk === 'true') add(tags, 'jokers:yes');
    else if (jk === 'false') add(tags, 'jokers:no');

    const prs = norm(String(row.pr_sets_allowed || ''));
    if (prs === 'true') add(tags, 'prs:yes');
    else if (prs === 'false') add(tags, 'prs:no');

    // goal
    add(tags, goalTag(row.goal || ''));

    return Array.from(tags).sort().join('|');
}

function backfillUi(row) {
    const trimmed = s => (s || '').trim();
    if (!trimmed(row.ui_main)) {
        const s = row.scheme || row.core_scheme || row['Main Work'];
        row.ui_main = s ? `${s} main work.` : 'Main work as prescribed.';
    }
    if (!trimmed(row.ui_supplemental)) {
        const s = row.supplemental || row['Supplemental'];
        if (s) row.ui_supplemental = `Supplemental: ${s}.`;
    }
    if (!trimmed(row.ui_assistance)) {
        const s = row.assistance_mode || row.assistance_targets || row['Assistance'];
        if (s) row.ui_assistance = `Assistance: ${s}.`;
    }
    if (!trimmed(row.ui_conditioning)) {
        const s = row.conditioning_mode || row['Conditioning'];
        if (s) row.ui_conditioning = `Conditioning: ${s}.`;
    }
    if (!trimmed(row.ui_notes)) {
        const s = row.leader_anchor_fit || row['Leader/Anchor'] || row.notes || row['Notes'];
        if (s) row.ui_notes = s;
    }
}

function ensureHeaders(header) {
    const needed = ['tags', 'ui_main', 'ui_supplemental', 'ui_assistance', 'ui_conditioning', 'ui_notes'];
    for (const k of needed) if (!header.includes(k)) header.push(k);
}

function loadCatalog() {
    const candidates = [
        path.join(DATA_DIR, 'tag_catalog.csv'),
        path.join(UI_DATA_DIR, 'tag_catalog.csv'),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            const { header, rows } = readCsvObj(p);
            // Ensure color column exists
            if (!header.includes('color')) header.push('color');
            return { path: p, header, rows };
        }
    }
    return null;
}

function ensureCatalogEntries(catalog, usedTagKeys) {
    if (!catalog) return { added: 0 };
    const keyIdx = new Map(catalog.rows.map((r, i) => [r.key, i]));
    let added = 0;
    for (const key of usedTagKeys) {
        if (!key || keyIdx.has(key)) continue;
        const [group, labelRaw] = key.includes(':') ? key.split(':') : ['misc', key];
        const label = (labelRaw || key).replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
        const row = { key, group, label, description: '', color: '' };
        // ensure header coverage
        for (const h of ['key', 'group', 'label', 'description', 'color']) if (!catalog.header.includes(h)) catalog.header.push(h);
        catalog.rows.push(row);
        keyIdx.set(key, catalog.rows.length - 1);
        added++;
    }
    return { added };
}

function writeCatalog(catalog) {
    if (!catalog) return;
    writeCsvObj(catalog.path, catalog.header, catalog.rows);
}

function titleCaseGroup(group) {
    const g = String(group || '').toLowerCase();
    const map = {
        template: 'Template',
        scheme: 'Scheme',
        supplemental: 'Supplemental',
        assistance: 'Assistance',
        season: 'Season',
        population: 'Population',
        conditioning: 'Conditioning',
        goal: 'Goal',
        phase: 'Phase',
        rule: 'Rule',
        meta: 'Meta',
        misc: 'Meta',
    };
    return map[g] || (group || 'Meta');
}

function colorForGroup(group, key) {
    const g = titleCaseGroup(group);
    switch (g) {
        case 'Scheme': return '#60a5fa'; // blue-400
        case 'Supplemental':
            if (key?.includes('bbb')) return '#f59e0b'; // amber-500
            if (key?.includes('fsl')) return '#10b981'; // emerald-500
            if (key?.includes('ssl')) return '#84cc16'; // lime-500
            return '#f97316'; // orange-500
        case 'Assistance': return '#14b8a6'; // teal-500
        case 'Season': return key?.includes('in') ? '#eab308' : '#22c55e'; // yellow/green
        case 'Population': return '#8b5cf6'; // violet-500
        case 'Conditioning': return '#06b6d4'; // cyan-500
        case 'Goal':
            if (key?.includes('strength')) return '#ef4444'; // red-500
            if (key?.includes('hypertrophy')) return '#f472b6'; // pink-400
            if (key?.includes('conditioning')) return '#06b6d4'; // cyan
            return '#a3e635'; // lime-400 balanced
        case 'Phase': return key?.includes('anchor') ? '#fb923c' : '#f87171'; // orange/red
        case 'Template':
            if (key?.includes('football')) return '#16a34a'; // green-600
            if (key?.includes('forever')) return '#f43f5e'; // rose-500
            if (key?.includes('beyond')) return '#a855f7'; // purple-500
            return '#3b82f6'; // blue-500
        default: return '';
    }
}

function normalizeAndColorizeCatalog(catalog) {
    if (!catalog) return { normalized: 0, colored: 0 };
    let normalized = 0, colored = 0;
    for (const r of catalog.rows) {
        const g = titleCaseGroup(r.group);
        if (r.group !== g) { r.group = g; normalized++; }
        if (!r.color || !String(r.color).trim()) {
            const c = colorForGroup(r.group, r.key);
            if (c) { r.color = c; colored++; }
        }
    }
    return { normalized, colored };
}

function run() {
    let changed = 0, scanned = 0, missingPages = 0, missingBook = 0;
    const usedTagKeys = new Set();
    const mergedRows = [];
    const mergedHeader = [
        'id', 'display_name', 'source_book', 'source_pages', 'core_scheme', 'supplemental', 'assistance_guideline', 'conditioning_guideline', 'leader_anchor', 'category', 'tags', 'ui_main', 'ui_supplemental', 'ui_assistance', 'ui_conditioning', 'ui_notes', 'time_per_session_min', 'experience'
    ];
    for (const file of TPL_FILES) {
        const p = path.join(DATA_DIR, file);
        if (!fs.existsSync(p)) continue;
        const { header, rows } = readCsvObj(p);
        ensureHeaders(header);

        rows.forEach(r => {
            scanned++;

            // derive new tags
            const newTags = deriveTags(r);
            if (newTags !== (r.tags || '')) { r.tags = newTags; changed++; }
            newTags.split('|').filter(Boolean).forEach(k => usedTagKeys.add(k));

            // backfill UI
            const before = JSON.stringify([r.ui_main, r.ui_supplemental, r.ui_assistance, r.ui_conditioning, r.ui_notes]);
            backfillUi(r);
            const after = JSON.stringify([r.ui_main, r.ui_supplemental, r.ui_assistance, r.ui_conditioning, r.ui_notes]);
            if (before !== after) changed++;

            const pages = r.pages || r.Page;
            const book = r.book || r.Book;
            if (!(pages || '').trim()) missingPages++;
            if (!(book || '').trim()) missingBook++;

            // Build merged row with unified schema
            const id = (r.id || '').trim() || (String(r['Template Name'] || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
            const merged = {
                id,
                display_name: (r.display_name || r['Template Name'] || '').trim(),
                source_book: (r.source_book || r.book || r['Book'] || '').trim(),
                source_pages: (r.source_pages || r.pages || r['Page'] || '').trim(),
                core_scheme: (r.core_scheme || r['Main Work'] || '').trim(),
                supplemental: (r.supplemental || r['Supplemental'] || '').trim(),
                assistance_guideline: (r.assistance_guideline || r.assistance_mode || r.assistance_targets || r['Assistance'] || '').trim(),
                conditioning_guideline: (r.conditioning_guideline || r.conditioning_mode || r['Conditioning'] || '').trim(),
                leader_anchor: (r.leader_anchor || r.leader_anchor_fit || r['Leader/Anchor'] || '').trim(),
                category: (r.category || '').trim(),
                tags: (r.tags || '').trim(),
                ui_main: r.ui_main || '',
                ui_supplemental: r.ui_supplemental || '',
                ui_assistance: r.ui_assistance || '',
                ui_conditioning: r.ui_conditioning || '',
                ui_notes: r.ui_notes || r.notes || r['Notes'] || '',
                time_per_session_min: (r.time_per_session_min || '').trim(),
                experience: (r.experience || '').trim(),
            };
            mergedRows.push(merged);
        });

        if (!DRY) writeCsvObj(p, header, rows);
    }

    // Update tag catalog with any missing keys
    const catalog = loadCatalog();
    const { added } = ensureCatalogEntries(catalog, usedTagKeys);
    const { normalized, colored } = normalizeAndColorizeCatalog(catalog);
    if (!DRY && catalog && (added > 0 || normalized > 0 || colored > 0)) writeCatalog(catalog);

    console.log(DRY ? 'Dry run — no files written.' : 'Write mode — files updated.');
    console.log(`Templates scanned: ${scanned}`);
    console.log(`Rows changed/backfilled: ${changed}`);
    console.log(`Missing pages: ${missingPages}  |  Missing book: ${missingBook}`);
    console.log(`Catalog additions: ${added || 0} | normalized groups: ${normalized || 0} | colored: ${colored || 0}`);
    console.log('Tip: keep blanks for pages you haven\'t verified yet — we favor accuracy over guesses.');

    // Emit unified merged CSV for research
    if (!DRY) {
        // De-dupe by id (prefer later entries to override earlier ones)
        const byId = new Map();
        for (const r of mergedRows) byId.set(r.id || r.display_name, r);
        const mergedOut = Array.from(byId.values());
        const outPath = path.join(DATA_DIR, 'templates_merged.csv');
        writeCsvObj(outPath, mergedHeader, mergedOut);
        console.log(`Wrote merged CSV: ${path.relative(ROOT, outPath)} (${mergedOut.length} rows)`);
        // Also write to UI data dir so it is shipped with the app
        try {
            if (!fs.existsSync(UI_DATA_DIR)) fs.mkdirSync(UI_DATA_DIR, { recursive: true });
            const uiOut = path.join(UI_DATA_DIR, 'templates_merged.csv');
            writeCsvObj(uiOut, mergedHeader, mergedOut);
            console.log(`Wrote merged CSV: ${path.relative(ROOT, uiOut)} (${mergedOut.length} rows)`);
        } catch { }
    }
}

run();
