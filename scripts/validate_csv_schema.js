#!/usr/bin/env node
/**
 * validate_csv_schema.js
 * Usage: node scripts/validate_csv_schema.js [--schemas=schemas.json]
 *
 * Exits 0 if all headers match expected normalized headers.
 * Exits 1 if any mismatch found.
 */

const fs = require('fs');
const path = require('path');

const arg = process.argv.find(a => a.startsWith('--schemas=')) || '--schemas=schemas.json';
const SCHEMAS_PATH = arg.split('=')[1];

function normalizeHeaderLine(line) {
  return line
    .replace(/^\uFEFF/, '')            // BOM
    .split(',')
    .map(h => h.trim())
    .filter(h => h.length > 0)
    .map(h => h.toLowerCase().trim()
      .replace(/\s+/g,'_')
      .replace(/[^\w_]/g,'')
    );
}

function readFirstNonEmptyLine(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const l of lines) {
    if (l && l.trim().length) return l.trim();
  }
  return '';
}

function arraysEqual(a,b){
  if (a.length !== b.length) return false;
  for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false;
  return true;
}

function reportDiff(expected, actual){
  const extra = actual.filter(x=>!expected.includes(x));
  const missing = expected.filter(x=>!actual.includes(x));
  return { extra, missing };
}

async function main(){
  if (!fs.existsSync(SCHEMAS_PATH)) {
    console.error(`Schemas file not found: ${SCHEMAS_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(SCHEMAS_PATH, 'utf8');
  let schemas;
  try { schemas = JSON.parse(raw); } catch(e){
    console.error('Invalid JSON in schemas file.', e.message);
    process.exit(1);
  }

  let hasError = false;
  console.log('Validating CSV headers against', SCHEMAS_PATH, '\n');

  for (const rel of Object.keys(schemas)) {
    const expected = schemas[rel];
    const filePathCandidates = [
      path.join(process.cwd(), rel),
      path.join(process.cwd(), 'public', rel),
      path.join(process.cwd(), 'tracker-ui-good', 'tracker-ui', 'public', rel),
      path.join(process.cwd(), 'tracker-ui-good', 'tracker-ui', rel)
    ];
    const filePath = filePathCandidates.find(p => fs.existsSync(p));
    if (!filePath) {
      console.warn(`MISSING FILE: ${rel}`);
      hasError = true;
      continue;
    }
    const headerLine = readFirstNonEmptyLine(filePath);
    if (!headerLine) {
      console.warn(`EMPTY HEADER: ${filePath}`);
      hasError = true;
      continue;
    }
    const actual = normalizeHeaderLine(headerLine);
    const normalizedExpected = expected.map(h=>h.toLowerCase().replace(/\s+/g,'_').replace(/[^\w_]/g,''));
    if (!arraysEqual(normalizedExpected, actual)) {
      const diff = reportDiff(normalizedExpected, actual);
      console.error(`HEADER MISMATCH: ${filePath}`);
      console.error(' Expected:', normalizedExpected.join(','));
      console.error(' Actual:  ', actual.join(','));
      if (diff.missing.length) console.error(' Missing:', diff.missing.join(', '));
      if (diff.extra.length) console.error(' Extra:  ', diff.extra.join(', '));
      hasError = true;
    } else {
      console.log(`OK: ${filePath}`);
    }
  }

  if (hasError) {
    console.error('\nOne or more CSV headers did not match expected schema.');
    process.exit(1);
  } else {
    console.log('\nAll CSV headers match expected schemas.');
    process.exit(0);
  }
}

main();
