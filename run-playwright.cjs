#!/usr/bin/env node

// Run Playwright in a completely isolated environment
const { spawn } = require('child_process');
const path = require('path');

// Clear any vitest-related environment variables
const env = { ...process.env };
delete env.VITEST;
delete env.VITEST_CONFIG;

// Remove vitest-related modules from NODE_PATH if present
if (env.NODE_PATH) {
  env.NODE_PATH = env.NODE_PATH
    .split(path.delimiter)
    .filter(p => !p.includes('vitest'))
    .join(path.delimiter);
}

// Run playwright directly - Windows compatible
const isWindows = process.platform === 'win32';
const command = isWindows ? 'npx.cmd' : 'npx';

const playwright = spawn(command, ['playwright', 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
  cwd: process.cwd(),
  shell: isWindows
});

playwright.on('exit', (code) => {
  process.exit(code);
});
