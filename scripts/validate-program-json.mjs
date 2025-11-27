import fs from 'fs';
import path from 'path';
import process from 'process';
import Ajv from 'ajv';

function expandGlobs(inputs) {
    const out = [];
    for (const p of inputs) {
        if (!p.includes('*')) { out.push(p); continue; }
        const dir = path.dirname(p);
        const base = path.basename(p).replace('*', '');
        if (!fs.existsSync(dir)) continue;
        for (const f of fs.readdirSync(dir)) {
            if (f.endsWith(base) || base === '' || f.match(new RegExp('^' + base.replace(/\./g, '\\.') + '$'))) {
                out.push(path.join(dir, f));
            }
        }
    }
    return out;
}

function usage() {
    console.error('Usage: node scripts/validate-program-json.mjs <schemaPath> <jsonFileOrGlob...>');
    process.exit(2);
}

async function main() {
    const [, , schemaPath, ...rawFiles] = process.argv;
    if (!schemaPath || rawFiles.length === 0) usage();

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);

    const files = expandGlobs(rawFiles).filter(f => !path.basename(f).startsWith('_'));
    if (files.length === 0) { console.error('No files matched'); process.exit(1); }
    let failed = 0;
    let validated = 0;
    for (const f of files) {
        const abs = path.resolve(process.cwd(), f);
        const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
        // Skip non-program aggregate files (like _index.json)
        if (!data || data.programId !== '531') {
            console.log(`~ skipped (not a 531 program file): ${f}`);
            continue;
        }
        const ok = validate(data);
        if (!ok) {
            failed++;
            console.error(`\n× ${f}`);
            for (const err of validate.errors || []) {
                console.error(`  • ${err.instancePath || '/'} ${err.message}`);
            }
        } else {
            console.log(`✓ ${f}`);
        }
        validated++;
    }

    if (failed) process.exit(1);
    if (validated === 0) {
        console.warn('No 531 program files validated.');
    }
}

main().catch(e => { console.error(e); process.exit(1); });
