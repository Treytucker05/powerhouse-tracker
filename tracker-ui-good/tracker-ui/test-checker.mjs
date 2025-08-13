#!/usr/bin/env node

import { spawn } from 'child_process';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
};

console.log(`${colors.bright}🔍 Quick Test Infrastructure Check${colors.reset}\n`);

function runQuickCheck() {
    return new Promise((resolve) => {
        console.log(`${colors.blue}Testing basic vitest setup...${colors.reset}`);

        const child = spawn('pnpm', ['exec', 'vitest', '--version'], {
            stdio: 'pipe',
            shell: true
        });

        let output = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            output += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`${colors.green}✅ Vitest is working${colors.reset}`);
                console.log(`Version: ${output.trim()}\n`);

                // Now try to run a simple test command
                console.log(`${colors.blue}Testing vitest configuration...${colors.reset}`);

                const configTest = spawn('pnpm', ['exec', 'vitest', 'run', '--reporter=verbose', '--run', '--passWithNoTests'], {
                    stdio: 'pipe',
                    shell: true
                });

                let configOutput = '';

                configTest.stdout.on('data', (data) => {
                    configOutput += data.toString();
                    process.stdout.write('.');
                });

                configTest.stderr.on('data', (data) => {
                    configOutput += data.toString();
                    process.stdout.write('!');
                });

                configTest.on('close', (configCode) => {
                    console.log('\n');

                    if (configCode === 0) {
                        console.log(`${colors.green}✅ Vitest configuration is working${colors.reset}`);
                        console.log(`${colors.blue}Output preview:${colors.reset}`);
                        console.log(configOutput.slice(-200) + '...\n');
                    } else {
                        console.log(`${colors.red}❌ Vitest configuration has issues${colors.reset}`);
                        console.log(`${colors.yellow}Error output:${colors.reset}`);
                        console.log(configOutput);
                    }

                    resolve(configCode === 0);
                });

                // Timeout for config test
                setTimeout(() => {
                    configTest.kill('SIGKILL');
                    console.log(`\n${colors.yellow}⏰ Configuration test timed out${colors.reset}`);
                    resolve(false);
                }, 15000);

            } else {
                console.log(`${colors.red}❌ Vitest is not working properly${colors.reset}`);
                console.log(`Error: ${output}`);
                resolve(false);
            }
        });

        // Timeout for version check
        setTimeout(() => {
            child.kill('SIGKILL');
            console.log(`${colors.yellow}⏰ Version check timed out${colors.reset}`);
            resolve(false);
        }, 10000);
    });
}

runQuickCheck().then((success) => {
    if (success) {
        console.log(`${colors.green}${colors.bright}🎉 Test infrastructure looks good!${colors.reset}`);
        console.log(`${colors.blue}You can now run: pnpm run test:progressive${colors.reset}`);
    } else {
        console.log(`${colors.red}${colors.bright}🚨 Test infrastructure has issues${colors.reset}`);
        console.log(`${colors.yellow}Please check your vitest setup and configuration${colors.reset}`);
    }
}).catch(console.error);
