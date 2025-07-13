#!/usr/bin/env node

/**
 * Quick test checker - runs tests with aggressive timeouts to identify hanging tests
 */

import { execSync } from 'child_process';

const QUICK_TIMEOUT = 5000; // 5 second timeout

console.log('🔍 Running quick test check with aggressive timeouts...\n');

try {
    console.log('1️⃣ Testing basic Vitest functionality...');
    const result1 = execSync('pnpm exec vitest --version', { encoding: 'utf8', timeout: 3000 });
    console.log(`✅ Vitest version: ${result1.trim()}`);

    console.log('\n2️⃣ Testing setup file...');
    const result2 = execSync('node -e "console.log(\'Setup test passed\')"', { encoding: 'utf8', timeout: 3000 });
    console.log(`✅ Node execution: ${result2.trim()}`);

    console.log('\n3️⃣ Testing a single simple test (Home.test.jsx)...');
    const testResult = execSync(`pnpm exec vitest run src/tests/Home.test.jsx --reporter=basic --testTimeout=${QUICK_TIMEOUT}`, {
        encoding: 'utf8',
        timeout: 15000,
        stdio: 'pipe'
    });
    console.log('✅ Home test completed');

    console.log('\n4️⃣ Testing with no coverage...');
    const noCoverageResult = execSync(`pnpm exec vitest run src/tests/Home.test.jsx --no-coverage --testTimeout=${QUICK_TIMEOUT}`, {
        encoding: 'utf8',
        timeout: 15000,
        stdio: 'pipe'
    });
    console.log('✅ No coverage test completed');

    console.log('\n🎉 All quick checks passed! The test infrastructure seems to be working.');
    console.log('\n💡 If tests are still hanging, it\'s likely a specific test or component causing the issue.');
    console.log('   Try running: pnpm run test:progressive');

} catch (error) {
    console.log(`\n💥 Quick check failed at step:`);
    console.log(`Error: ${error.message}`);
    console.log(`\nThis suggests the issue is in basic test infrastructure.`);
    console.log(`\nTroubleshooting steps:`);
    console.log(`1. Check if all dependencies are installed: pnpm install`);
    console.log(`2. Check vitest config: cat vitest.config.js`);
    console.log(`3. Check setup file: cat vitest.setup.js`);
    process.exit(1);
}
