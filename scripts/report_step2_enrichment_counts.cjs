#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const UI_ROOT = path.join(process.cwd(), 'tracker-ui-good', 'tracker-ui');
const CSV_DIR = path.join(UI_ROOT, 'public', 'methodology', 'extraction');
const ENRICHED = path.join(UI_ROOT, 'public', 'templates', 'enriched.json');

function slugUnderscore(s) {
    return String(s || '').toLowerCase().trim().replace(/['’]/g, '').replace(/\s*\(.*?\)\s*/g, m => m) // keep text inside
        .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function toTitle(row) {
    const name = String(row['Template Name'] ?? row.Template ?? '').trim();
    return name || String(row.display_name || '').trim() || '';
}
function toId(row) {
    const name = toTitle(row);
    if (!name) return String(row.id || '').trim();
    return name.toLowerCase().replace(/^(jack sh\*t|jack shit)$/, 'jackshit').replace(/[^a-z0-9]+/g, '_');
}
function readCsv(file) {
    const txt = fs.readFileSync(path.join(CSV_DIR, file), 'utf8');
    // naive csv split, good enough for count purpose when there are no embedded commas in these columns
    const [headerLine, ...lines] = txt.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',');
    return lines.map(line => {
        const cells = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h] = cells[i]);
        return obj;
    });
}

const master = readCsv('templates_master.csv');
const additions = readCsv('templates_additions.csv');
const ids = new Set();
master.forEach(r => { const id = toId(r); if (id) ids.add(id); });
// Merge by id, additions override: keep ids only
additions.forEach(r => { const id = String(r.id || '').trim().toLowerCase(); if (id) ids.add(id); });

const enriched = JSON.parse(fs.readFileSync(ENRICHED, 'utf8'));
const map = {};
enriched.forEach(d => {
    if (!d) return;
    if (d.id) map[d.id] = d;
    if (d.display_name) map[slugUnderscore(d.display_name)] = d;
});

let withTags = 0, needsResearch = 0, total = 0, noDetail = 0;
for (const id of ids) {
    total++;
    const d = map[id];
    const tags = (d && Array.isArray(d.tags)) ? d.tags.filter(Boolean) : [];
    if (tags.length > 0) withTags++; else needsResearch++;
    if (!d) noDetail++;
}

console.log(JSON.stringify({ totalCards: total, withTags, needsResearch, noDetailMatched: noDetail }));
