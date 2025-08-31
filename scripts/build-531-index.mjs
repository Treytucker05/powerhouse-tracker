import fs from 'fs';
import path from 'path';
import process from 'process';

function readJson(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function toArray(x) { return Array.isArray(x) ? x : (x ? [x] : []); }

function main() {
    const dir = path.resolve(process.cwd(), process.argv[2] || 'data/programs/531');
    if (!fs.existsSync(dir)) {
        console.error('Directory not found:', dir);
        process.exit(1);
    }
    const entries = [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
    for (const f of files) {
        const fp = path.join(dir, f);
        const data = readJson(fp);
        if (!data || data.programId !== '531') continue;
        const weeks = toArray(data.weeks).map(w => w.id).filter(Boolean);
        const schedules = toArray(data.schedules).map(s => s.id).filter(Boolean);
        const supplemental = toArray(data.supplemental).map(s => s.id).filter(Boolean);
        const templates = toArray(data.templates).map(t => t.id).filter(Boolean);
        entries.push({
            file: f,
            version: data.version || null,
            sourceTitle: data.source?.sourceTitle || null,
            year: data.source?.year ?? null,
            pages: data.source?.pageRanges || [],
            counts: {
                weeks: weeks.length,
                schedules: schedules.length,
                supplemental: supplemental.length,
                templates: templates.length
            },
            weekIds: weeks,
            scheduleIds: schedules,
            supplementalIds: supplemental,
            templateIds: templates
        });
    }
    entries.sort((a, b) => String(a.version || '').localeCompare(String(b.version || '')));
    const out = {
        kind: 'index',
        program: '531',
        generatedAt: new Date().toISOString(),
        files: entries
    };
    const outPath = path.join(dir, '_index.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log('Wrote index:', outPath, `(${entries.length} files)`);
}

main();
