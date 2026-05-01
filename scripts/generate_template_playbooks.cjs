#!/usr/bin/env node
/*
  generate_template_playbooks.cjs
  - Reads templates_master.csv and templates_additions.csv
  - Merges rows; parses scheme/supplemental into structured objects
  - Emits docs/templates/{id}.md and docs/templates/_index.md
*/
const fs = require('fs');
const path = require('path');

// Tiny CSV parser (no deps)
function parseCSV(text) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(Boolean);
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    return lines.slice(1).map(line => {
        const cells = [];
        let cur = '', inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
                else inQ = !inQ;
            } else if (ch === ',' && !inQ) { cells.push(cur); cur = ''; }
            else { cur += ch; }
        }
        cells.push(cur);
        const obj = {};
        headers.forEach((h, idx) => obj[h] = (cells[idx] || '').replace(/^"|"$/g, '').trim());
        return obj;
    });
}

function normId(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function asNum(v, d) { const n = Number(String(v || '').replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : d; }

function parseScheme(raw) {
    const t = String(raw || '').toLowerCase();
    const weeks = [];
    const mkWeek = (name, pcts, pr) => ({ week: name, main: pcts.map((pct, i) => ({ set: i + 1, reps: i === 0 ? 5 : i === 1 ? 5 : 5, pct, pr: pr && i === 2 })), notes: undefined });
    if (/5\/?3\/?1\s*\+?\s*pr/.test(t)) {
        // 5/3/1 + PR
        weeks.push(mkWeek('5s', [0.65, 0.75, 0.85], true));
        weeks.push(mkWeek('3s', [0.70, 0.80, 0.90], true));
        weeks.push(mkWeek('531', [0.75, 0.85, 0.95], true));
        return { variant: '531_pr', raw, microcycle: weeks };
    }
    if (/5s\s*pro/.test(t) || /5\'s\s*pro/.test(t)) {
        weeks.push(mkWeek('5s', [0.65, 0.75, 0.85], false));
        weeks.push(mkWeek('5s', [0.65, 0.75, 0.85], false));
        weeks.push(mkWeek('5s', [0.65, 0.75, 0.85], false));
        return { variant: '5s_pro', raw, microcycle: weeks };
    }
    console.warn(`[playbooks] scheme parser fell back to custom for: ${raw}`);
    return { variant: 'custom', raw };
}

function parseSupplemental(raw) {
    const t = String(raw || '').toLowerCase();
    if (/5x10/.test(t) && /fsl|first set last/.test(t)) return { type: 'FSL', dose: '5x10' };
    if (/5x5/.test(t) && /fsl/.test(t)) return { type: 'FSL', dose: '5x5' };
    if (/5x5/.test(t) && /ssl|second set last/.test(t)) return { type: 'SSL', dose: '5x5' };
    if (/bbb|boring but big/.test(t)) return { type: 'BBB', dose: /5x10/.test(t) ? '5x10' : undefined };
    return { type: 'custom', raw };
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function main() {
    const repo = process.cwd();
    const dataDir = path.join(repo, 'tracker-ui-good', 'tracker-ui', 'public', 'methodology', 'extraction');
    const outDir = path.join(repo, 'docs', 'templates');
    const publicOutDir = path.join(repo, 'tracker-ui-good', 'tracker-ui', 'public', 'docs', 'templates');
    const masterPath = path.join(dataDir, 'templates_master.csv');
    const addsPath = path.join(dataDir, 'templates_additions.csv');
    const master = fs.existsSync(masterPath) ? parseCSV(fs.readFileSync(masterPath, 'utf8')) : [];
    const adds = fs.existsSync(addsPath) ? parseCSV(fs.readFileSync(addsPath, 'utf8')) : [];

    // Index additions by id/display_name
    const addBy = new Map();
    for (const r of adds) {
        const id = r.id || normId(r.display_name);
        if (!id) continue;
        addBy.set(normId(id), r);
        if (r.display_name) addBy.set(normId(r.display_name), r);
    }

    const seen = new Map();
    for (const r of master) {
        const name = r['Template Name'] || r.name || r.display_name;
        if (!name) continue;
        const idGuess = normId(name);
        const add = addBy.get(idGuess) || addBy.get(normId(r.display_name || '')) || {};
        const id = add.id || idGuess;
        if (seen.has(id)) continue;

        const display_name = add.display_name || name;
        const daysDefault = asNum(add.days_per_week || r['Days/Week'] || 4, 4);
        const tmPct = asNum(add.tm_default_pct || r['TM%'] || 90, 90);
        const schemeRaw = add.scheme || r['Main Work'] || '';
        const scheme = { raw: schemeRaw, parsed: parseScheme(schemeRaw) };
        const suppRaw = add.supplemental || r['Supplemental'] || '';
        const supplemental = { raw: suppRaw, parsed: parseSupplemental(suppRaw) };
        const assistance_targets = (add.assistance_targets || '').split(/[|,;/]/).map(s => s.trim().toLowerCase()).filter(Boolean);
        const equipment = (add.equipment || '').split(/[|,;/]/).map(s => s.trim().toLowerCase()).filter(Boolean);

        const obj = {
            id,
            display_name,
            category: add.category || r.category || 'template',
            goal: add.goal || r.goal || undefined,
            days_per_week: { default: daysDefault, allowed: [1, 2, 3, 4, 5, 6, 7] },
            scheme,
            supplemental,
            assistance: {
                mode: add.assistance_mode || 'template',
                targets: assistance_targets.length ? assistance_targets : ['push', 'pull', 'single_leg', 'core'],
                volume: add.assistance_volume || '50–100 reps/category'
            },
            conditioning: {
                mode: add.conditioning_mode || 'standard',
                per_session_min: asNum(add.time_per_session_min, 30),
                per_week_min: asNum(add.time_per_week_min, 120)
            },
            tm: {
                default_pct: tmPct,
                bump_upper_lb: asNum(add.tm_prog_upper_lb, 5),
                bump_lower_lb: asNum(add.tm_prog_lower_lb, 10)
            },
            rules: {
                pr_sets_allowed: String(add.pr_sets_allowed || '').toLowerCase() === 'true' || /yes|allowed/i.test(add.pr_sets_allowed || ''),
                jokers_allowed: String(add.jokers_allowed || '').toLowerCase() === 'true' || /yes|allowed/i.test(add.jokers_allowed || ''),
                seventh_week_default: add.seventh_week_default || undefined,
                leader_anchor_fit: add.leader_anchor_fit || r['Leader/Anchor'] || undefined
            },
            constraints: {
                equipment,
                population: add.population || undefined,
                seasonality: add.seasonality || undefined,
                notes: add.constraints || add.notes || r.notes || undefined
            },
            tags: (add.tags || '').split(/[|,;]/).map(s => s.trim()).filter(Boolean),
            ins: [
                `Use TM = ${tmPct}%`,
                `Days/week = ${daysDefault} (allowed 1–7)`,
                `Supplemental: ${suppRaw || supplemental.parsed.type || 'N/A'}`
            ],
            outs: [
                ...(String(add.jokers_allowed || '').toLowerCase() === 'false' ? ['No Jokers'] : []),
                ...(String(add.pr_sets_allowed || '').toLowerCase() === 'false' ? ['No PR sets'] : [])
            ],
            edge_cases: [
                'If time_crunched → drop supplemental to 3x10',
                'If off_season → conditioning high; reduce assistance 20%'
            ],
            source: { book: add.book || r.Book, pages: add.pages || r.Page }
        };

        seen.set(id, obj);
    }

    // Write docs
    ensureDir(outDir);
    ensureDir(publicOutDir);
    const all = Array.from(seen.values());
    for (const t of all) {
        const md = [
            `# ${t.display_name}`,
            `\n## Overview\n${t.goal || t.category || ''}`,
            `\n## Inputs & Defaults\n- Days/week: ${t.days_per_week.default}\n- TM%: ${t.tm.default_pct}\n- Increments: ${t.tm.bump_upper_lb}/${t.tm.bump_lower_lb} lb`,
            `\n## Main Work\n- Scheme: ${t.scheme.raw || t.scheme.parsed.variant}`,
            `\n## Supplemental\n- ${t.supplemental.raw || t.supplemental.parsed.type}`,
            `\n## Assistance\n- Mode: ${t.assistance.mode}\n- Targets: ${t.assistance.targets.join(', ')}\n- Volume: ${t.assistance.volume}`,
            `\n## Conditioning\n- Mode: ${t.conditioning.mode}\n- Time (per session): ${t.conditioning.per_session_min} min\n- Time (per week): ${t.conditioning.per_week_min} min`,
            `\n## Rules\n- PR sets: ${t.rules.pr_sets_allowed ? 'allowed' : 'not allowed'}\n- Jokers: ${t.rules.jokers_allowed ? 'allowed' : 'not allowed'}\n- 7th Week: ${t.rules.seventh_week_default || 'n/a'}\n- Fit: ${t.rules.leader_anchor_fit || 'n/a'}`,
            `\n## Constraints\n- Equipment: ${(t.constraints.equipment || []).join(', ') || 'n/a'}\n- Population: ${t.constraints.population || 'n/a'}\n- Seasonality: ${t.constraints.seasonality || 'n/a'}\n- Notes: ${t.constraints.notes || 'n/a'}`,
            `\n## Tags\n${t.tags.join(', ') || 'n/a'}`,
            `\n## Ins ✅\n${t.ins.map(s => `- ${s}`).join('\n')}`,
            `\n## Outs 🚫\n${(t.outs.length ? t.outs : ['None']).map(s => `- ${s}`).join('\n')}`,
            `\n## Edge Cases\n${t.edge_cases.map(s => `- ${s}`).join('\n')}`,
            `\n## Source\n${t.source.book || ''} ${t.source.pages || ''}`
        ].join('\n');
        fs.writeFileSync(path.join(outDir, `${t.id}.md`), md, 'utf8');
        fs.writeFileSync(path.join(publicOutDir, `${t.id}.md`), md, 'utf8');
    }
    const indexMd = ['# 5/3/1 Templates', ''].concat(all.map(t => `- [${t.display_name}](./${t.id}.md) — PR: ${t.rules.pr_sets_allowed ? '✅' : '🚫'}, Jokers: ${t.rules.jokers_allowed ? '✅' : '🚫'}, Days/wk: ${t.days_per_week.default}, TM: ${t.tm.default_pct}%`)).join('\n');
    fs.writeFileSync(path.join(outDir, `_index.md`), indexMd, 'utf8');
    fs.writeFileSync(path.join(publicOutDir, `_index.md`), indexMd, 'utf8');

    console.log(`Generated ${all.length} template playbooks in ${outDir} and ${publicOutDir}`);
}

main();
