#!/usr/bin/env node

/**
 * Final Cleanup Report
 * Shows the current state after cleanup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = __dirname;

console.log('🎯 FINAL CLEANUP REPORT\n');
console.log('======================\n');

// Check current directory structure
function analyzeDirectory(dirPath, level = 0) {
    const fullPath = path.join(baseDir, dirPath);
    const indent = '  '.repeat(level);

    try {
        const files = fs.readdirSync(fullPath);
        console.log(`${indent}📁 ${dirPath}/ (${files.length} items)`);

        files.forEach(file => {
            const filePath = path.join(fullPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                if (level < 2) { // Limit depth
                    analyzeDirectory(path.join(dirPath, file), level + 1);
                } else {
                    console.log(`${indent}  📁 ${file}/ (${fs.readdirSync(filePath).length} items)`);
                }
            } else {
                const size = (stats.size / 1024).toFixed(1);
                console.log(`${indent}  📄 ${file} (${size}KB)`);
            }
        });
    } catch (error) {
        console.log(`${indent}❌ ${dirPath} - ${error.message}`);
    }
}

console.log('📊 CURRENT STRUCTURE:\n');
analyzeDirectory('src');

// Check for any remaining backup or duplicate files
console.log('\n🔍 SCANNING FOR REMAINING CLEANUP CANDIDATES:\n');

function scanForCleanupCandidates(dirPath) {
    const fullPath = path.join(baseDir, dirPath);

    try {
        const files = fs.readdirSync(fullPath);

        files.forEach(file => {
            const filePath = path.join(fullPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                scanForCleanupCandidates(path.join(dirPath, file));
            } else {
                // Check for backup, duplicate, or test files
                if (file.includes('.backup') ||
                    file.includes('.bak') ||
                    file.includes('_BACKUP_') ||
                    file.includes('New.jsx') ||
                    file.includes('Enhanced.jsx') ||
                    file.includes('.skip.') ||
                    file.includes('Test.jsx') ||
                    file.includes('Debug.jsx')) {

                    const size = (stats.size / 1024).toFixed(1);
                    console.log(`⚠️ Potential cleanup candidate: ${path.join(dirPath, file)} (${size}KB)`);
                }
            }
        });
    } catch (error) {
        // Skip directories we can't read
    }
}

scanForCleanupCandidates('src');

console.log('\n✨ Cleanup report complete!');
console.log('\n📈 BENEFITS ACHIEVED:');
console.log('• Removed outdated backup files');
console.log('• Eliminated duplicate page components');
console.log('• Cleaned up unused debug components');
console.log('• Removed empty directories');
console.log('• Simplified project structure');
console.log('• Reduced bundle size potential');
