#!/usr/bin/env node

import { spawn } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
};

// Progress bar function
function updateProgressBar(current, total, testName = '') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);

    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    const testDisplay = testName ? ` | ${testName.slice(-40)}` : '';

    process.stdout.write(`\r${colors.blue}Progress: ${colors.bright}[${bar}] ${percentage}%${colors.reset} (${current}/${total})${testDisplay}`);
}

// Function to find all test files
function findTestFiles(dir, testFiles = []) {
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findTestFiles(fullPath, testFiles);
        } else if (item.endsWith('.test.jsx') || item.endsWith('.test.js') || item.endsWith('.test.ts') || item.endsWith('.test.tsx')) {
            testFiles.push(fullPath);
        }
    }

    return testFiles;
}

// Function to run a single test file
function runSingleTest(testFile, timeout = 30000) {
    return new Promise((resolve) => {
        console.log(`\n${colors.yellow}📋 Running: ${colors.bright}${relative(process.cwd(), testFile)}${colors.reset}`);

        const startTime = Date.now();
        const child = spawn('pnpm', ['exec', 'vitest', 'run', testFile, '--reporter=verbose'], {
            stdio: 'pipe',
            shell: true
        });

        let output = '';
        let hasOutput = false;

        // Set up timeout
        const timeoutId = setTimeout(() => {
            console.log(`\n${colors.red}⏰ Test timed out after ${timeout / 1000}s${colors.reset}`);
            child.kill('SIGKILL');
            resolve({
                file: testFile,
                status: 'timeout',
                duration: Date.now() - startTime,
                output: output
            });
        }, timeout);

        child.stdout.on('data', (data) => {
            hasOutput = true;
            output += data.toString();
            // Show real-time output for long-running tests
            process.stdout.write('.');
        });

        child.stderr.on('data', (data) => {
            hasOutput = true;
            output += data.toString();
            process.stdout.write('!');
        });

        child.on('close', (code) => {
            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;

            let status;
            if (code === 0) {
                status = 'pass';
                console.log(`\n${colors.green}✅ PASSED${colors.reset} (${duration}ms)`);
            } else {
                status = 'fail';
                console.log(`\n${colors.red}❌ FAILED${colors.reset} (${duration}ms)`);
            }

            resolve({
                file: testFile,
                status: status,
                duration: duration,
                output: output,
                hasOutput: hasOutput
            });
        });

        child.on('error', (error) => {
            clearTimeout(timeoutId);
            console.log(`\n${colors.red}💥 ERROR: ${error.message}${colors.reset}`);
            resolve({
                file: testFile,
                status: 'error',
                duration: Date.now() - startTime,
                output: output + error.message,
                hasOutput: hasOutput
            });
        });
    });
}

async function main() {
    console.log(`${colors.bright}🧪 Progressive Test Runner${colors.reset}\n`);

    // Find all test files
    const testFiles = findTestFiles('./src');

    if (testFiles.length === 0) {
        console.log(`${colors.yellow}No test files found in ./src${colors.reset}`);
        return;
    }

    console.log(`Found ${testFiles.length} test files:\n`);
    testFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${relative(process.cwd(), file)}`);
    });

    console.log(`\n${colors.bright}Starting progressive test run...${colors.reset}\n`);

    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < testFiles.length; i++) {
        const testFile = testFiles[i];
        updateProgressBar(i, testFiles.length, relative(process.cwd(), testFile));

        const result = await runSingleTest(testFile, 45000); // 45 second timeout per test
        results.push(result);

        updateProgressBar(i + 1, testFiles.length);
    }

    // Final summary
    console.log(`\n\n${colors.bright}📊 Test Results Summary${colors.reset}\n`);

    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const timedOut = results.filter(r => r.status === 'timeout').length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}⏰ Timed out: ${timedOut}${colors.reset}`);
    console.log(`${colors.red}💥 Errors: ${errors}${colors.reset}`);

    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️  Total time: ${Math.round(totalTime / 1000)}s`);

    // Show problematic tests
    const problemTests = results.filter(r => r.status !== 'pass');
    if (problemTests.length > 0) {
        console.log(`\n${colors.bright}🚨 Problematic Tests:${colors.reset}\n`);
        problemTests.forEach(result => {
            const icon = result.status === 'timeout' ? '⏰' : result.status === 'error' ? '💥' : '❌';
            console.log(`${icon} ${relative(process.cwd(), result.file)} (${result.status}, ${result.duration}ms)`);

            if (result.status === 'timeout') {
                console.log(`   ${colors.yellow}This test is likely hanging - check for infinite loops or missing awaits${colors.reset}`);
            }

            if (!result.hasOutput && result.status !== 'pass') {
                console.log(`   ${colors.yellow}No output detected - possible setup issue${colors.reset}`);
            }
        });
    }

    process.exit(failed > 0 || timedOut > 0 || errors > 0 ? 1 : 0);
}

main().catch(console.error);
