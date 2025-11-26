// Filters harvest_531_table.txt to retain only true source/config files per user rules.
// Allowed roots: tracker-ui-good\\tracker-ui\\src\\, js\\, scripts\\, methodology\\packs\\
// (methodology packs only, not verification), plus scripts/ for verify script.
// Excluded patterns: node_modules, dist, build, .gh-pages, temp-deploy, assets, public, docs, playwright-report,
// e2e-standalone/playwright-report, .parcel-cache, *.map, *.min.*, lockfiles, index.html, hashed bundle JS/CSS, .mdb
// Also exclude methodology/verification.

const fs = require('fs');

const IN = 'harvest_531_table.txt';
const OUT = 'harvest_531_table_filtered.txt';

const raw = fs.readFileSync(IN, 'utf8').split(/\r?\n/);
if (!raw.length) {
    console.error('Input table empty.');
    process.exit(1);
}

const header = raw[0];
const lines = raw.slice(1);

// Helper regexes
const allowedPrefix = [
    /^tracker-ui-good\\tracker-ui\\src\\/i,
    /^js\\/i,
    /^scripts\\/i,
    /^methodology\\packs\\/i,
];

const excludePatterns = [
    /node_modules/i,
    /(^|\\)(dist|build)(\\|$)/i,
    /\.gh-pages/i,
    /temp-deploy/i,
    /(^|\\)assets(\\|$)/i,
    /(^|\\)public(\\|$)/i,
    /(^|\\)docs(\\|$)/i,
    /playwright-report/i,
    /e2e-standalone\\playwright-report/i,
    /\.parcel-cache/i,
    /\.map$/i,
    /\.min\./i,
    /package-lock\.json$/i,
    /pnpm-lock\.yaml$/i,
    /yarn-lock\.yaml$/i,
    /index\.html$/i,
    /ProgramDesignWorkspace\.[0-9a-f]{8}\.js$/i,
    /\.mdb$/i,
    /methodology\\verification\\/i,
];

function isAllowed(file) {
    if (!allowedPrefix.some(rx => rx.test(file))) return false;
    if (excludePatterns.some(rx => rx.test(file))) return false;
    return true;
}

const outLines = [];
for (const line of lines) {
    if (!line.trim()) continue;
    // Expect format: Term | File path | Line numbers
    const parts = line.split(' | ');
    if (parts.length < 3) continue; // malformed
    const filePath = parts[1].trim();
    if (isAllowed(filePath)) {
        outLines.push(line);
    }
}

// Sort for determinism: by Term then File path
outLines.sort((a, b) => {
    const [termA, fileA] = a.split(' | ');
    const [termB, fileB] = b.split(' | ');
    if (termA === termB) return fileA.localeCompare(fileB);
    return termA.localeCompare(termB);
});

fs.writeFileSync(OUT, [header, ...outLines].join('\n'), 'utf8');
console.log(`Filtered rows: ${outLines.length}`);
console.log(`Wrote ${OUT}`);
