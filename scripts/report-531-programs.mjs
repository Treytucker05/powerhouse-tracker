import fs from 'fs';
import path from 'path';
import process from 'process';

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function h2(s) { return `## ${s}`; }
function h3(s) { return `### ${s}`; }

function bulletList(items) {
    return items.map(i => `- ${i}`).join('\n');
}

function summarizeProgram(dir, file) {
    const p = path.join(dir, file);
    const j = readJson(p);
    const title = `${j.source?.sourceTitle || j.version} (${file})`;
    const lines = [];
    lines.push(`# 5/3/1 Program: ${j.version}`);
    lines.push('');
    lines.push(bulletList([
        `File: ${file}`,
        `Source: ${j.source?.sourceTitle || '—'}`,
        `Edition: ${j.source?.edition ?? '—'}`,
        `Year: ${j.source?.year ?? '—'}`,
    ]));
    if (Array.isArray(j.source?.pageRanges) && j.source.pageRanges.length) {
        lines.push('');
        lines.push(h3('pages'));
        lines.push(bulletList(j.source.pageRanges));
    }
    lines.push('');
    lines.push(h2('lifts'));
    const liftKeys = ['squat', 'bench', 'deadlift', 'press'];
    for (const k of liftKeys) {
        const L = j.lifts?.[k];
        if (!L) continue;
        lines.push(`- ${k}: ${L.name}${L.aliases?.length ? ` (aliases: ${L.aliases.join(', ')})` : ''}`);
    }
    const weeks = (j.weeks || []).map(w => `${w.id}${w.label ? ` — ${w.label}` : ''}`);
    lines.push('');
    lines.push(h2('weeks'));
    lines.push(weeks.length ? bulletList(weeks) : '- —');
    const schedules = (j.schedules || []).map(s => `${s.id}${s.label ? ` — ${s.label}` : ''}`);
    lines.push('');
    lines.push(h2('schedules'));
    lines.push(schedules.length ? bulletList(schedules) : '- —');
    const supps = (j.supplemental || []).map(s => `${s.id}${s.name ? ` — ${s.name}` : ''}`);
    lines.push('');
    lines.push(h2('supplemental'));
    lines.push(supps.length ? bulletList(supps) : '- —');
    const templates = (j.templates || []).map(t => `${t.id}${t.name ? ` — ${t.name}` : ''}`);
    lines.push('');
    lines.push(h2('templates'));
    lines.push(templates.length ? bulletList(templates) : '- —');
    if (Array.isArray(j.notes) && j.notes.length) {
        lines.push('');
        lines.push(h2('notes'));
        lines.push(bulletList(j.notes));
    }
    lines.push('');
    return lines.join('\n');
}

function main() {
    const dir = path.resolve(process.cwd(), process.argv[2] || 'data/programs/531');
    const outDir = path.resolve(process.cwd(), 'reports');
    fs.mkdirSync(outDir, { recursive: true });
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
    const indexLines = ['# 5/3/1 Programs Summary', '', `Generated: ${new Date().toISOString()}`, ''];
    for (const f of files.sort()) {
        const md = summarizeProgram(dir, f);
        const out = path.join(outDir, f.replace(/\.json$/, '.md'));
        fs.writeFileSync(out, md, 'utf8');
        indexLines.push(`- ${f.replace(/\.json$/, '.md')}`);
    }
    fs.writeFileSync(path.join(outDir, '531_programs_index.md'), indexLines.join('\n') + '\n', 'utf8');
    console.log(`Wrote ${files.length} program summaries to ${outDir}`);
}

main();
