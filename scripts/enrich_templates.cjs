#!/usr/bin/env node
/*
 Enrich 5/3/1 templates: normalize, tag, badge, and emit JSON + per-template MD stubs.
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const UI_ROOT = path.join(ROOT, 'tracker-ui-good', 'tracker-ui');
// Prefer local install under tracker-ui subproject to avoid root deps
let Papa;
try { Papa = require('papaparse'); }
catch {
    try { Papa = require(path.join(UI_ROOT, 'node_modules', 'papaparse')); }
    catch { throw new Error('papaparse not found. Install in tracker-ui-good/tracker-ui'); }
}
const CSV_DIR = path.join(UI_ROOT, 'public', 'methodology', 'extraction');
const OUT_DIR = path.join(UI_ROOT, 'public', 'templates');
const RESEARCH_DIR = path.join(ROOT, 'research');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function readCsv(file) {
    const txt = fs.readFileSync(path.join(CSV_DIR, file), 'utf8');
    const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true });
    return parsed.data || [];
}
function slugifyId(s) {
    return String(s || '')
        .trim()
        .toLowerCase()
        .replace(/^(jack\s+sh\*t|jack\s+shit)$/i, 'jackshit')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
}
function normBool(v) {
    const s = String(v ?? '').trim().toLowerCase();
    if (s === 'true' || s === 'yes' || s === 'y' || s === '1') return true;
    if (s === 'false' || s === 'no' || s === 'n' || s === '0') return false;
    return undefined;
}
function splitTags(raw) {
    const parts = String(raw || '')
        .split(/[|,]/g)
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    return Array.from(new Set(parts));
}
function addHeuristicTags(tpl, tags) {
    const all = new Set(tags);
    const has = (x) => Array.from(all).includes(x);
    const inc = (x) => { if (!has(x)) all.add(x); };
    const scheme = String(tpl.scheme || '').toLowerCase();
    const supplemental = String(tpl.supplemental || '').toLowerCase();
    const leaderAnchor = String(tpl.leader_anchor_fit || '').toLowerCase();
    const display = String(tpl.display_name || '').toLowerCase();

    if (/5s\s*pro/.test(scheme)) { inc('5s_pro'); inc('no_pr'); }
    if ((/531|5\/?3\/?1/.test(scheme)) && /pr/.test(scheme)) { inc('531_pr'); inc('pr_sets'); }
    if (/bbb|5x10/.test(supplemental)) { inc('bbb'); inc('hypertrophy'); inc('volume'); }
    if (/ssl/.test(supplemental)) { inc('ssl'); inc('strength'); }
    if (/fsl/.test(supplemental)) { inc('fsl'); inc('volume_mod'); }
    if (normBool(tpl.jokers_allowed) === true) { inc('jokers'); }
    if (/leader/.test(leaderAnchor)) inc('leader');
    if (/anchor/.test(leaderAnchor)) inc('anchor');
    if (String(tpl.assistance_mode || '').toLowerCase() === 'bodyweight') inc('bodyweight');
    const knownNames = ['triumvirate', 'boring but strong', 'krypteia', 'leviathan', 'svr', 'periodization bible', 'hardgainers', 'jack sh*t', 'jack shit'];
    for (const n of knownNames) {
        if (display.includes(n)) { inc(slugifyId(n)); }
    }
    return Array.from(all);
}
function deriveBadges(tpl) {
    const t = Number(tpl.time_per_session_min) || Number(tpl["time_per_session_min"]) || NaN;
    let time_band = 'varies';
    if (!isNaN(t)) {
        if (t <= 35) time_band = '25–35m';
        else if (t <= 60) time_band = '45–60m';
        else if (t <= 70) time_band = '55–70m';
    }
    const exp = String(tpl.experience || '').toLowerCase();
    let difficulty = exp === 'beginner' ? 'Beginner' : exp === 'intermediate' ? 'Intermediate' : exp === 'advanced' ? 'Advanced' : undefined;
    if (!difficulty) difficulty = /high\s*stress|very\s*challenging/.test(String(tpl.notes || '').toLowerCase()) ? 'Advanced' : 'All Levels';

    const sup = String(tpl.supplemental || '').toLowerCase();
    const id = String(tpl.id || '')
    let focus = 'General';
    if (/bbb/.test(sup)) focus = 'Hypertrophy';
    else if (/ssl/.test(sup) || /5s\s*pro/.test(String(tpl.scheme || '').toLowerCase())) focus = 'Strength';
    else if (/periodization\s*bible/.test(id)) focus = 'Balanced Development';

    return { time_band, difficulty, focus };
}

function makeDetail(tpl) {
    const rawTags = splitTags(tpl.tags || tpl["tags(raw)"] || tpl.tag_list);
    const tags = addHeuristicTags(tpl, rawTags);
    const badges = deriveBadges(tpl);
    const blurbSeed = tpl.notes || tpl.ui_main || tpl.ui_supplemental || '';
    const blurb = blurbSeed ? String(blurbSeed).trim() : 'NEEDS_RESEARCH';
    const best_for = 'NEEDS_RESEARCH';
    const avoid_if = 'NEEDS_RESEARCH';
    const pitfalls = 'NEEDS_RESEARCH';
    return {
        id: tpl.id,
        display_name: tpl.display_name,
        badges,
        tags,
        blurb,
        best_for,
        avoid_if,
        pitfalls,
    };
}

function main() {
    ensureDir(OUT_DIR);
    ensureDir(RESEARCH_DIR);
    const master = readCsv('templates_master.csv');
    const additions = readCsv('templates_additions.csv');

    const addById = new Map();
    additions.forEach(r => { const id = String(r.id || '').trim().toLowerCase(); if (id) addById.set(id, r); });

    // Merge by id if possible; otherwise derive id from display name in master
    const seen = new Set();
    const records = [];

    master.forEach(row => {
        const display_name = String(row['Template Name'] || row.Template || row.display_name || '').trim();
        const idRaw = display_name ? slugifyId(display_name) : '';
        const add = addById.get(idRaw) || null;
        const merged = {
            id: idRaw,
            display_name: display_name || idRaw,
            scheme: row['Main Work'] || row.scheme || '',
            supplemental: row['Supplemental'] || row.supplemental || '',
            assistance_mode: row['Assistance'] || row.assistance_mode || '',
            leader_anchor_fit: row['Leader/Anchor'] || row.leader_anchor || '',
            pr_sets_allowed: add?.pr_sets_allowed ?? row.pr_sets_allowed,
            jokers_allowed: add?.jokers_allowed ?? row.jokers_allowed,
            days_per_week: add?.days_per_week ?? row.days_per_week,
            tm_default_pct: add?.tm_default_pct ?? row.tm_default_pct,
            time_per_session_min: add?.time_per_session_min ?? row.time_per_session_min,
            time_per_week_min: add?.time_per_week_min ?? row.time_per_week_min,
            experience: add?.experience ?? row.experience,
            notes: add?.notes ?? row.notes ?? '',
            tags: add?.tags ?? row.tags ?? '',
            ui_main: add?.ui_main ?? '',
            ui_supplemental: add?.ui_supplemental ?? '',
        };
        if (!merged.id) return;
        if (seen.has(merged.id)) return; // keep first occurrence
        seen.add(merged.id);
        records.push(merged);
    });

    // Include additions not present in master (by id)
    additions.forEach(add => {
        const id = String(add.id || '').trim().toLowerCase();
        if (!id || seen.has(id)) return;
        records.push({
            id,
            display_name: add.display_name || id,
            scheme: add.scheme || '',
            supplemental: add.supplemental || '',
            assistance_mode: add.assistance_mode || '',
            leader_anchor_fit: add.leader_anchor || add.leader_anchor_fit || '',
            pr_sets_allowed: add.pr_sets_allowed,
            jokers_allowed: add.jokers_allowed,
            days_per_week: add.days_per_week,
            tm_default_pct: add.tm_default_pct,
            time_per_session_min: add.time_per_session_min,
            time_per_week_min: add.time_per_week_min,
            experience: add.experience,
            notes: add.notes || '',
            tags: add.tags || '',
            ui_main: add.ui_main || '',
            ui_supplemental: add.ui_supplemental || '',
        });
    });

    // Normalize flags and numbers
    records.forEach(r => {
        r.pr_sets_allowed = normBool(r.pr_sets_allowed);
        r.jokers_allowed = normBool(r.jokers_allowed);
        ['days_per_week', 'tm_default_pct', 'time_per_session_min', 'time_per_week_min'].forEach(k => {
            if (r[k] != null && r[k] !== '') r[k] = Number(r[k]);
        });
    });

    const details = records.map(makeDetail);

    // Write enriched.json
    fs.writeFileSync(path.join(OUT_DIR, 'enriched.json'), JSON.stringify(details, null, 2));

    // Write per-template markdown and build index
    const index = [];
    let needsResearch = 0;
    details.forEach(d => {
        const md = `# ${d.display_name}\n\n## Overview\n${d.blurb}\n\n## Badges\n- Time: ${d.badges.time_band}\n- Difficulty: ${d.badges.difficulty}\n- Focus: ${d.badges.focus}\n\n## Tags\n${d.tags.join(', ')}\n\n## Best For\n${d.best_for}\n\n## Avoid If\n${d.avoid_if}\n\n## Pitfalls\n${d.pitfalls}\n`;
        fs.writeFileSync(path.join(OUT_DIR, `${d.id}.md`), md);
        index.push({ id: d.id, display_name: d.display_name, tags: d.tags, badges: d.badges });
        if ([d.blurb, d.best_for, d.avoid_if, d.pitfalls].some(v => String(v).includes('NEEDS_RESEARCH'))) needsResearch++;
    });
    fs.writeFileSync(path.join(OUT_DIR, '_index.json'), JSON.stringify(index, null, 2));

    // Research report
    const total = details.length;
    const missingLines = details
        .filter(d => [d.blurb, d.best_for, d.avoid_if, d.pitfalls].some(v => String(v).includes('NEEDS_RESEARCH')))
        .map(d => `- ${d.id} (${d.display_name})`)
        .join('\n');
    ensureDir(RESEARCH_DIR);
    fs.writeFileSync(path.join(RESEARCH_DIR, 'missing_templates.md'), `# Templates needing research\n\nTotal: ${total}\nNeeds research: ${needsResearch}\n\n${missingLines}\n`);

    return { total, needsResearch };
}

if (require.main === module) {
    const { total, needsResearch } = main();
    console.log(JSON.stringify({ total, needsResearch }));
}
