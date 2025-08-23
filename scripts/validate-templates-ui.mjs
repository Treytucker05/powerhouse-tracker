#!/usr/bin/env node
// Minimal UI validator: ensure tags parse, booleans are lowercase if present, and fields exist
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const file = path.join(root, 'data', 'extraction', 'templates_additions.csv');

function readCsvRows(fp) {
    const txt = fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = txt.split('\n').filter(Boolean);
    const rows = [];
    let header = null;
    for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        let cells = [];
        let cur = '';
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
                else inQ = !inQ;
            } else if (ch === ',' && !inQ) {
                cells.push(cur);
                cur = '';
            } else {
                cur += ch;
            }
        }
        cells.push(cur);
        if (!header) header = cells;
        else rows.push(cells);
    }
    return { header, rows };
}

let errors = 0;
try {
    const { header, rows } = readCsvRows(file);
    const h = (n) => header.indexOf(n);
    const idx = {
        id: h('id'),
        display_name: h('display_name'),
        tags: h('tags'),
        pr_sets_allowed: h('pr_sets_allowed'),
        jokers_allowed: h('jokers_allowed'),
    };
    for (const [k, v] of Object.entries(idx)) {
        if (v < 0) { console.error(`[error] Missing header column: ${k}`); errors++; }
    }
    rows.forEach((r, i) => {
        const rowNum = i + 2;
        const id = r[idx.id];
        const name = r[idx.display_name];
        if (!id) { console.error(`[error] Row ${rowNum}: missing id`); errors++; }
        if (!name) { console.error(`[error] Row ${rowNum}: missing display_name`); errors++; }
        const tags = (r[idx.tags] || '').split('|').filter(Boolean);
        const tagOk = tags.every(t => t.includes(':'));
        if (!tagOk) { console.error(`[error] Row ${rowNum}: tag missing group prefix (expected group:key)`); errors++; }
        // Booleans must be lowercase
        const bools = ['pr_sets_allowed', 'jokers_allowed'];
        bools.forEach(col => {
            const v = r[idx[col]];
            if (v && v !== 'true' && v !== 'false' && v !== '""') {
                console.error(`[error] Row ${rowNum}: ${col} must be lowercase true/false (found: ${v})`);
                errors++;
            }
        });
    });
    if (errors) process.exit(1);
    console.log('Validation complete. Rows needing backfill if --write used: 0');
} catch (e) {
    console.error('[error] UI validation failed:', e.message);
    process.exit(1);
}
