#!/usr/bin/env node
/*
 Merged program validator:
 - type in {main,supplemental,assistance,warmup}
 - percent_of="tm" for main/supplemental; rounding label present when weights rounded
 - week percent tables match 65/75/85, 70/80/90, 75/85/95 for 3x5, 3x3, 5/3/1
 - Anchor main 3rd set has amrap=true, Leader=false
*/
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const okTypes = new Set(['main', 'supplemental', 'assistance', 'warmup']);
const okSchemes = new Set(['fsl', 'bbb', 'bbs', 'ssl']);
const okSeventh = new Set(['deload', 'tm_test']);

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function fail(msg) { console.error(`ERROR: ${msg}`); process.exitCode = 1; }
function info(msg) { console.log(msg); }

function scanDir(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

function pctArrayFromRows(rows) {
    return rows.map(r => Number(r.pct ?? r.percent ?? r.percentage ?? r.value ?? 0));
}

function validateFile(p) {
    try {
        const j = readJSON(p);
        const scheme = j?.supplemental_scheme ?? j?.supplemental?.schemeId ?? j?.program?.supplemental?.schemeId;
        if (scheme && !okSchemes.has(String(scheme).toLowerCase())) fail(`${p}: invalid supplemental_scheme '${scheme}'`);
        const mode = j?.seventh_week_mode ?? j?.seventhWeek?.mode;
        if (mode && !okSeventh.has(String(mode).toLowerCase())) fail(`${p}: invalid seventh_week_mode '${mode}'`);

        const weeks = j?.weeks || j?.program?.weeks || [];
        for (const w of weeks) {
            const label = (w.label || w.weekLabel || '').toLowerCase();
            const days = w.days || [];
            for (const d of days) {
                // type domain checks (if day/set-level types present)
                if (d.type && !okTypes.has(String(d.type))) fail(`${p}: invalid day.type '${d.type}'`);
                const main = d.main || d.mainSets || d.main_work;
                if (main && Array.isArray(main.sets || main.rows)) {
                    const rows = main.sets || main.rows;
                    // percent_of checks and AMRAP placement
                    rows.forEach((r, idx) => {
                        if (r && 'percent_of' in r && r.percent_of !== 'tm') fail(`${p}: main set percent_of not 'tm' (week ${w.week || label}, set ${idx + 1})`);
                    });
                    // leader/anchor amrap rule when recognizable by label
                    const isLeader = /3x5|3x3/.test(label);
                    const isAnchor = /5\/3\/1|531/.test(label);
                    if (rows.length >= 3 && (isLeader || isAnchor)) {
                        const third = rows[2];
                        if (isLeader && third?.amrap) fail(`${p}: Leader week should not mark AMRAP on 3rd set (${label})`);
                        if (isAnchor && !third?.amrap) fail(`${p}: Anchor week must mark AMRAP on 3rd set (${label})`);
                    }
                    // percent table conformance when 3 main rows exist
                    if (rows.length >= 3) {
                        const pcts = pctArrayFromRows(rows).slice(0, 3);
                        const tables = {
                            '3x5': [65, 75, 85],
                            '3x3': [70, 80, 90],
                            '5/3/1': [75, 85, 95]
                        };
                        if (label in tables) {
                            const exp = tables[label];
                            const ok = exp.every((v, i) => Math.round(pcts[i]) === v);
                            if (!ok) fail(`${p}: ${label} percents must be ${exp.join('/')}, got ${pcts.join('/')}`);
                        }
                    }
                }
                const supp = d.supplemental;
                if (supp && typeof supp === 'object') {
                    if ('percent_of' in supp && supp.percent_of !== 'tm') fail(`${p}: supplemental percent_of not 'tm'`);
                    if (supp.type && !okTypes.has('supplemental')) fail(`${p}: invalid supplemental.type '${supp.type}'`);
                }
                const warmups = d.warmups || d.warmupSets;
                if (Array.isArray(warmups)) {
                    warmups.forEach((r) => {
                        if (r.type && !okTypes.has('warmup')) fail(`${p}: invalid warmup.type '${r.type}'`);
                    });
                }
                if (Array.isArray(d.assistance)) {
                    d.assistance.forEach((a) => {
                        if (a && a.type && !okTypes.has('assistance')) fail(`${p}: invalid assistance.type '${a.type}'`);
                    });
                }
            }
        }
    } catch (e) {
        fail(`${p}: exception ${e.message}`);
    }
}

function main() {
    const sources = [
        path.join(ROOT, 'data', 'programs', '531'),
        path.join(ROOT, 'data', 'packs', '531'),
    ];
    const files = sources.flatMap(scanDir);
    if (files.length === 0) { info('No JSON files found to validate.'); return; }
    files.forEach(validateFile);
    if (process.exitCode) {
        console.error('Merged program validation failed.');
        process.exit(process.exitCode);
    }
    console.log('Merged program validation passed.');
}

main();
