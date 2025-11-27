#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

const colors = { green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[34m', reset: '\x1b[0m', bright: '\x1b[1m' };
const here = dirname(fileURLToPath(import.meta.url));
const appDir = fs.existsSync(resolve(here, 'vitest.local.js')) ? here : resolve(here, 'tracker-ui-good', 'tracker-ui');

function run(cmd, args) {
    const r = spawnSync(cmd, args, { cwd: appDir, stdio: 'inherit', shell: process.platform === 'win32' });
    return r.status ?? 1;
}

console.log(`\n🔍 Quick Test Infrastructure Check (dir: ${appDir})\n`);

let status = run('npx', ['vitest', 'run', '-c', 'vitest.local.js', '--reporter=dot', '--passWithNoTests']);
if (status === 0) { console.log(`${colors.green}✅ Vitest (npx) OK${colors.reset}`); process.exit(0); }

if (spawnSync('pnpm', ['-v'], { stdio: 'ignore', shell: true }).status === 0) {
    status = run('pnpm', ['vitest', 'run', '-c', 'vitest.local.js', '--reporter=dot', '--passWithNoTests']);
    if (status === 0) process.exit(0);
}

status = run('npm', ['run', 'test:run', '--silent']);
if (status === 0) process.exit(0);

console.log(`${colors.red}❌ All test launch strategies failed${colors.reset}`);
process.exit(status || 1);
