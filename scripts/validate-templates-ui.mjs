#!/usr/bin/env node
/*
 UI templates validator:
 - supplemental_scheme ∈ {fsl,ssl,bbb,bbs}
 - seventh_week_mode ∈ {deload,tm_test}
 - tm_pct_default ∈ {85,90} (accepts synonyms: tm_default_pct)
 Also performs light sanity on percent_of='tm' rows when present.
*/
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const okSchemes = new Set(['fsl', 'ssl', 'bbb', 'bbs']);
const okSeventh = new Set(['deload', 'tm_test']);
const okTmPct = new Set(['85', '90', 85, 90]);

function readJSON(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function readCSV(p) {
    const text = fs.readFileSync(p, 'utf8');
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map((ln, idx) => {
        const cols = [];
        let cur = '';
        let inQ = false;
        for (let i = 0; i < ln.length; i++) {
            const ch = ln[i];
            if (ch === '"') {
                if (inQ && ln[i + 1] === '"') { cur += '"'; i++; }
                else inQ = !inQ;
            } else if (ch === ',' && !inQ) {
                cols.push(cur); cur = '';
            } else {
                cur += ch;
            }
        }
        cols.push(cur);
        const row = {};
        headers.forEach((h, i) => { row[h] = (cols[i] ?? '').trim(); });
        (row).__line = idx + 2;
        return row;
    });
}

function fail(msg) { console.error(`ERROR: ${msg}`); process.exitCode = 1; }
function info(msg) { console.log(msg); }

function checkProgram(prog, label) {
    try {
        const scheme = prog?.supplemental_scheme ?? prog?.supplemental?.schemeId ?? prog?.program?.supplemental?.schemeId;
        if (scheme && !okSchemes.has(String(scheme).toLowerCase())) fail(`${label}: invalid supplemental_scheme '${scheme}'`);
        const mode = prog?.seventh_week_mode ?? prog?.seventhWeek?.mode;
        if (mode && !okSeventh.has(String(mode).toLowerCase())) fail(`${label}: invalid seventh_week_mode '${mode}'`);
        const weeks = prog?.weeks || prog?.program?.weeks || [];
        for (const w of weeks) {
            const days = w.days || [];
            for (const d of days) {
                const main = d.main || d.mainSets || d.main_work;
                if (main && Array.isArray(main.sets || main.rows)) {
                    const rows = main.sets || main.rows;
                    rows.forEach((r, idx) => {
                        if (r && 'percent_of' in r && r.percent_of !== 'tm') fail(`${label}: main set percent_of not 'tm' (week ${w.week}, set ${idx + 1})`);
                    });
                }
                const supp = d.supplemental;
                if (supp && typeof supp === 'object' && 'percent_of' in supp && supp.percent_of !== 'tm') fail(`${label}: supplemental percent_of not 'tm'`);
            }
        }
    } catch (e) {
        fail(`${label}: exception ${e.message}`);
    }
}

function checkTemplatesCsv(filePath) {
    if (!fs.existsSync(filePath)) return;
    const rows = readCSV(filePath);
    for (const r of rows) {
        const tm = r.tm_pct_default ?? r.tm_default_pct;
        if (tm != null && String(tm).trim() !== '') {
            if (!okTmPct.has(tm)) fail(`${filePath}:${r.__line} tm_pct_default must be 85 or 90 (got '${tm}')`);
        }
        const seventh = r.seventh_week_default ?? r.seventh_week_mode;
        if (seventh && !okSeventh.has(String(seventh).toLowerCase())) fail(`${filePath}:${r.__line} seventh_week_default must be deload|tm_test (got '${seventh}')`);
    }
}

function main() {
    // JSON sources (optional): UI preview or sample program JSONs
    const inputs = [];
    const previewPath = path.join(ROOT, 'tracker-ui-good', 'tracker-ui', 'public', 'preview', 'program.json');
    if (fs.existsSync(previewPath)) inputs.push({ path: previewPath, json: readJSON(previewPath) });
    const programsDir = path.join(ROOT, 'data', 'programs', '531');
    if (fs.existsSync(programsDir)) {
        for (const f of fs.readdirSync(programsDir)) {
            if (f.endsWith('.json')) {
                const p = path.join(programsDir, f);
                inputs.push({ path: p, json: readJSON(p) });
            }
        }
    }
    inputs.forEach(({ path: p, json }) => checkProgram(json, p));

    // CSV sources: additions (both workspace and built public mirror if present)
    const csvCandidates = [
        path.join(ROOT, 'tracker-ui-good', 'tracker-ui', 'data', 'extraction', 'templates_additions.csv'),
        path.join(ROOT, 'tracker-ui-good', 'tracker-ui', 'public', 'methodology', 'extraction', 'templates_additions.csv')
    ];
    csvCandidates.forEach(checkTemplatesCsv);

    if (process.exitCode) {
        console.error('Template UI validation failed.');
        process.exit(process.exitCode);
    }
    console.log('Template UI validation passed.');
}

main();
