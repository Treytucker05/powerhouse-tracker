#!/usr/bin/env node
// Minimal CSV lint: validate header and row column counts for templates_additions.csv
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const file = path.join(root, 'data', 'extraction', 'templates_additions.csv');
const REQUIRED_HEADER = 'id,display_name,category,goal,days_per_week,scheme,supplemental,assistance_mode,assistance_targets,conditioning_mode,time_per_session_min,time_per_week_min,leader_anchor_fit,pr_sets_allowed,jokers_allowed,amrap_style,deload_policy,seventh_week_default,tm_default_pct,tm_prog_upper_lb,tm_prog_lower_lb,equipment,population,seasonality,constraints,experience,book,pages,notes,tags';

function parseCsv(text) {
    // Very lightweight CSV split that respects simple quoted fields without embedded newlines
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(Boolean);
    const rows = lines.map(line => {
        const out = [];
        let cur = '';
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQ && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQ = !inQ;
                }
            } else if (ch === ',' && !inQ) {
                out.push(cur);
                cur = '';
            } else {
                cur += ch;
            }
        }
        out.push(cur);
        return out;
    });
    return rows;
}

try {
    const text = fs.readFileSync(file, 'utf8');
    const rows = parseCsv(text);
    if (!rows.length) throw new Error('Empty CSV');
    const header = rows[0].join(',');
    if (header !== REQUIRED_HEADER) {
        console.error('[error] Header mismatch');
        console.error('Expected:', REQUIRED_HEADER);
        console.error('Actual  :', header);
        process.exit(1);
    }
    const cols = rows[0].length;
    console.log(`[debug] Header columns: ${cols}`);
    if (rows.length > 1) {
        console.log(`[debug] First data row columns: ${rows[1].length}`);
    }
    let issues = 0;
    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (r.length !== cols) {
            console.error(`[error] Row ${i + 1} has ${r.length} columns (expected ${cols})`);
            if (i === 1) {
                rows[0].forEach((h, idx) => {
                    console.error(`  [${idx}] ${h} = ${JSON.stringify(r[idx] ?? '')}`);
                });
                if (r.length > cols) {
                    for (let extra = cols; extra < r.length; extra++) {
                        console.error(`  [extra ${extra}] = ${JSON.stringify(r[extra])}`);
                    }
                }
            }
            issues++;
        }
    }
    if (issues) {
        process.exit(1);
    }
    console.log(`[info] templates_additions.csv rows: ${rows.length - 1}`);
    console.log('CSV Lint OK — no issues found');
} catch (e) {
    console.error('[error] CSV validation failed:', e.message);
    process.exit(1);
}
