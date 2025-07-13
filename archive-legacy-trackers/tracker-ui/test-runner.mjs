#!/usr/bin/env node

/**
 * Progressive test runner with progress indicators
 * This script runs tests incrementally to identify bottlenecks
 */

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const TEST_DIRS = [
    'src/tests',
    'src/__tests__',
    '__tests__'
];

function findTestFiles(dir) {
    const files = [];
    try {
        const items = readdirSync(dir);
        for (const item of items) {
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
                files.push(...findTestFiles(fullPath));
            } else if (item.endsWith('.test.js') || item.endsWith('.test.jsx') || item.endsWith('.spec.js') || item.endsWith('.spec.jsx')) {
                files.push(fullPath);
            }
        }
    } catch (err) {
        // Directory doesn't exist
    }
    return files;
}

function runSingleTest(testFile, index, total) {
    console.log(`\n🧪 [${index + 1}/${total}] Running: ${testFile}`);
    console.log(`Progress: [${'█'.repeat(Math.floor((index + 1) / total * 20))}${' '.repeat(20 - Math.floor((index + 1) / total * 20))}] ${Math.round((index + 1) / total * 100)}%`);

    try {
        const start = Date.now();
        const result = execSync(`pnpm exec vitest run "${testFile}" --reporter=basic --no-coverage`, {
            encoding: 'utf8',
            timeout: 30000, // 30 second timeout per file
            stdio: 'pipe'
        });
        const duration = Date.now() - start;
        console.log(`✅ Passed in ${duration}ms`);
        return { file: testFile, status: 'passed', duration, output: result };
    } catch (error) {
        const duration = Date.now() - start;
        console.log(`❌ Failed in ${duration}ms`);
        console.log(`Error: ${error.message}`);
        return { file: testFile, status: 'failed', duration, error: error.message };
    }
}

async function main() {
    console.log('🚀 Starting progressive test runner...\n');

    // Find all test files
    const allTestFiles = [];
    for (const dir of TEST_DIRS) {
        allTestFiles.push(...findTestFiles(dir));
    }

    console.log(`Found ${allTestFiles.length} test files:`);
    allTestFiles.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));

    if (allTestFiles.length === 0) {
        console.log('No test files found!');
        process.exit(1);
    }

    console.log('\n' + '='.repeat(50));

    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < allTestFiles.length; i++) {
        const result = runSingleTest(allTestFiles[i], i, allTestFiles.length);
        results.push(result);

        // Stop on first failure for debugging
        if (result.status === 'failed') {
            console.log('\n💥 Stopping on first failure for debugging');
            break;
        }
    }

    const totalTime = Date.now() - startTime;

    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log(`Total time: ${totalTime}ms`);

    const passed = results.filter(r => r.status === 'passed');
    const failed = results.filter(r => r.status === 'failed');

    console.log(`✅ Passed: ${passed.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (failed.length > 0) {
        console.log('\nFailed tests:');
        failed.forEach(f => console.log(`  - ${f.file}: ${f.error}`));
        process.exit(1);
    }

    console.log('\n🎉 All tests passed!');
}

main().catch(console.error);
