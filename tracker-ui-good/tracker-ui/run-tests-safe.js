#!/usr/bin/env node

/**
 * Safe Test Runner - Runs tests in isolated batches to prevent hangs
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Test batch configuration
const BATCH_SIZE = 5; // Run 5 tests at a time
const TEST_TIMEOUT = 15000; // 15 second timeout per batch
const FORCE_KILL_TIMEOUT = 20000; // Force kill after 20 seconds

async function findAllTestFiles() {
    const testFiles = [];

    async function scanDir(dir) {
        try {
            const entries = await readdir(join(__dirname, dir), { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.includes('node_modules')) {
                    await scanDir(fullPath);
                } else if (entry.isFile() && /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(entry.name)) {
                    testFiles.push(fullPath.replace(/\\/g, '/'));
                }
            }
        } catch (err) {
            // Skip directories we can't read
        }
    }

    await scanDir('src');
    return testFiles;
}

function runTestBatch(testFiles) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Running batch: ${testFiles.join(', ')}`);

        const child = spawn('npx', ['vitest', 'run', '--config', 'vitest.local.js', ...testFiles], {
            stdio: 'pipe',
            shell: true,
            cwd: __dirname
        });

        let stdout = '';
        let stderr = '';
        let completed = false;

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (!completed) {
                completed = true;
                console.log(`✅ Batch completed with code ${code}`);
                if (stdout) console.log('STDOUT:', stdout.slice(-500)); // Last 500 chars
                if (stderr && code !== 0) console.log('STDERR:', stderr.slice(-500));
                resolve({ code, stdout, stderr });
            }
        });

        child.on('error', (err) => {
            if (!completed) {
                completed = true;
                console.log(`❌ Batch error:`, err.message);
                resolve({ code: 1, stdout, stderr: err.message });
            }
        });

        // Timeout handler
        const timeout = setTimeout(() => {
            if (!completed) {
                completed = true;
                console.log(`⏰ Batch timed out after ${TEST_TIMEOUT}ms - killing process`);
                child.kill('SIGTERM');

                // Force kill after additional delay
                setTimeout(() => {
                    try {
                        child.kill('SIGKILL');
                    } catch (e) {
                        // Process might already be dead
                    }
                }, 3000);

                resolve({ code: 124, stdout, stderr: 'TIMEOUT' });
            }
        }, TEST_TIMEOUT);

        // Clear timeout if process completes normally
        child.on('close', () => clearTimeout(timeout));
    });
}

async function main() {
    console.log('🔍 Finding all test files...');
    const allTestFiles = await findAllTestFiles();
    console.log(`📁 Found ${allTestFiles.length} test files`);

    if (allTestFiles.length === 0) {
        console.log('❌ No test files found');
        process.exit(1);
    }

    // Split into batches
    const batches = [];
    for (let i = 0; i < allTestFiles.length; i += BATCH_SIZE) {
        batches.push(allTestFiles.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Created ${batches.length} batches of ${BATCH_SIZE} tests each`);

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let failedBatches = [];

    for (let i = 0; i < batches.length; i++) {
        console.log(`\n📊 Progress: ${i + 1}/${batches.length} batches`);
        const result = await runTestBatch(batches[i]);

        if (result.code === 0) {
            console.log(`✅ Batch ${i + 1} passed`);
            // Try to extract test counts from output
            const passMatch = result.stdout.match(/(\d+) passed/);
            if (passMatch) totalPassed += parseInt(passMatch[1]);
        } else if (result.code === 124) {
            console.log(`⏰ Batch ${i + 1} timed out`);
            failedBatches.push({ batch: i + 1, files: batches[i], reason: 'TIMEOUT' });
        } else {
            console.log(`❌ Batch ${i + 1} failed with code ${result.code}`);
            failedBatches.push({ batch: i + 1, files: batches[i], reason: `EXIT_CODE_${result.code}` });
            const failMatch = result.stderr.match(/(\d+) failed/);
            if (failMatch) totalFailed += parseInt(failMatch[1]);
        }

        // Small delay between batches to let system clean up
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 FINAL RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Total passed: ${totalPassed}`);
    console.log(`❌ Total failed: ${totalFailed}`);
    console.log(`📦 Batches completed: ${batches.length - failedBatches.length}/${batches.length}`);

    if (failedBatches.length > 0) {
        console.log(`\n🚨 FAILED BATCHES:`);
        failedBatches.forEach(({ batch, files, reason }) => {
            console.log(`  Batch ${batch} (${reason}): ${files.join(', ')}`);
        });
    }

    const overallSuccess = failedBatches.length === 0;
    console.log(`\n🎯 Overall result: ${overallSuccess ? '✅ SUCCESS' : '❌ SOME FAILURES'}`);

    process.exit(overallSuccess ? 0 : 1);
}

main().catch(err => {
    console.error('💥 Runner crashed:', err);
    process.exit(1);
});
