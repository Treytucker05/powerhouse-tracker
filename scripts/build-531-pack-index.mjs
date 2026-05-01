import fs from 'fs';
import path from 'path';
import process from 'process';

function readJson(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function main() {
    const dir = path.resolve(process.cwd(), process.argv[2] || 'data/packs/531');
    if (!fs.existsSync(dir)) {
        console.error('Packs directory not found:', dir);
        process.exit(1);
    }
    const entries = [];
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
        const data = readJson(path.join(dir, f));
        if (!data || data.kind !== 'pack' || data.program !== '531') continue;
        entries.push({ file: f, title: data.title || null, sourceProgramFile: data.sourceProgramFile || null, steps: (data.sequence || []).length });
    }
    entries.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    const out = { kind: 'pack-index', program: '531', generatedAt: new Date().toISOString(), files: entries };
    const outPath = path.join(dir, '_index.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log('Wrote pack index:', outPath, `(${entries.length} files)`);
}

main();
