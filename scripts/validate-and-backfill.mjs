#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'tracker-ui-good', 'tracker-ui', 'data', 'extraction');

const FILES = ['templates_master.csv', 'templates_additions.csv'];

function readCsv(p) {
    const text = fs.readFileSync(p, 'utf8');
    const rows = text.split(/\r?\n/).filter(Boolean);
    const header = rows[0].split(',');
    const out = rows.slice(1).map(line => {
        const cells = line.split(',').map(c => c.replace(/^"|"$/g, ''));
        const obj = {};
        header.forEach((h, i) => obj[h] = cells[i] ?? '');
        return obj;
    });
    return { header, rows: out };
}

function writeCsv(p, header, rows) {
    const escape = s => (s ?? '').toString().includes(',') ? `"${(s ?? '').toString().replace(/"/g, '""')}"` : (s ?? '');
    const lines = [header.join(','), ...rows.map(r => header.map(h => escape(r[h] ?? '')).join(','))];
    fs.writeFileSync(p, lines.join('\n'));
}

function ensureFields(row) {
    const fields = ['tags', 'ui_main', 'ui_supplemental', 'ui_assistance', 'ui_conditioning', 'ui_notes'];
    for (const f of fields) if (!(f in row)) row[f] = '';
    // Simple heuristics
    if (!row.ui_main) row.ui_main = row.scheme ? `${row.scheme} main work.` : (row['Main Work'] ? `${row['Main Work']}.` : 'Main work as prescribed.');
    if (!row.ui_assistance && row.assistance_mode) row.ui_assistance = row.assistance_mode;
    if (!row.ui_conditioning && row.conditioning_mode) row.ui_conditioning = row.conditioning_mode;
    if (!row.ui_notes && row.notes) row.ui_notes = row.notes;

    // Tags defaults
    const tags = new Set((row.tags || '').split('|').map(s => s.trim()).filter(Boolean));
    const add = (k) => { if (k) tags.add(k); };
    const scheme = (row.scheme || row.core_scheme || row['Main Work'] || '').toLowerCase();
    if (scheme.includes('5/3/1') || scheme.includes('531')) add('scheme:531');
    const am = (row.assistance_mode || row['Assistance'] || '').toLowerCase();
    if (am.includes('movement') && am.includes('category')) add('assistance:movement-families');
    const goal = (row.goal || '').toLowerCase();
    if (goal.includes('balanced')) add('goal:balanced');
    const dpw = parseInt(row.days_per_week || '', 10);
    if (dpw && dpw > 0) add(`frequency:${dpw}d`);

    row.tags = Array.from(tags).join('|');
}

const WRITE = process.argv.includes('--write');
let updated = 0;
for (const f of FILES) {
    const p = path.join(DATA_DIR, f);
    if (!fs.existsSync(p)) continue;
    const { header, rows } = readCsv(p);
    const H = new Set(header);
    ['tags', 'ui_main', 'ui_supplemental', 'ui_assistance', 'ui_conditioning', 'ui_notes'].forEach(k => { if (!H.has(k)) header.push(k); });

    rows.forEach(r => {
        const before = JSON.stringify([r.tags, r.ui_main, r.ui_supplemental, r.ui_assistance, r.ui_conditioning, r.ui_notes]);
        ensureFields(r);
        const after = JSON.stringify([r.tags, r.ui_main, r.ui_supplemental, r.ui_assistance, r.ui_conditioning, r.ui_notes]);
        if (before !== after) updated++;
    });

    if (WRITE) writeCsv(p, header, rows);
}

if (WRITE) {
    console.log(`Backfill complete. Rows updated: ${updated}`);
} else {
    console.log(`Validation complete. Rows needing backfill if --write used: ${updated}`);
    console.log('Run: npm run fix:templates:ui  to apply changes.');
}
