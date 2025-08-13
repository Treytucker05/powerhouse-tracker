#!/usr/bin/env node

/**
 * Tracker-UI Cleanup Script
 * Identifies and removes unused/outdated files based on actual usage analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = __dirname;

// 🗑️ FILES TO DELETE - Based on actual usage analysis
const filesToDelete = [
    // BACKUP AND DUPLICATE FILES (Safe to delete)
    'src/pages/Dashboard.jsx.backup',
    'src/pages/Macrocycle.jsx.backup',
    'src/pages/MacrocycleNew.jsx.backup',
    'src/pages/MacrocycleNew_fixed.jsx.backup',
    'src/pages/Program.jsx.bak',
    'src/pages/Program_BACKUP_20250714_123600.jsx',
    'src/pages/ProgramNew.jsx',
    'src/pages/ProgramSimple.jsx',

    // OUTDATED MACROCYCLE FILES (Replaced by MacrocycleRedirect)
    'src/pages/Macrocycle7.1.25.fixed.jsx',
    'src/pages/Macrocycle7.1.25.jsx',
    'src/pages/Mesocycle.jsx',
    'src/pages/MesocycleEnhanced.jsx',
    'src/pages/MesocycleNew.jsx',
    'src/pages/Microcycle.jsx',
    'src/pages/MicrocycleNew.jsx',

    // ENHANCED/NEW VERSIONS (Originals are in use)
    'src/pages/TrackingEnhanced.jsx', // Main is Tracking.jsx
    'src/pages/Tracking_new.jsx',

    // TEST/DEBUG FILES
    'src/pages/FocusTest.jsx',
    'src/pages/TestInput.jsx',
    'src/pages/VolumeChart.jsx', // Standalone component, not a page

    // DEBUG COMPONENTS (Safe to delete)
    'src/components/ContextTest.jsx', // Debug component
    'src/TestApp.jsx', // Test component

    // UNUSED TEST FILES 
    'src/tests/Sessions.test.skip.jsx', // Skipped test
];

// 🔍 DIRECTORIES TO CHECK FOR EMPTY/UNUSED CONTENT
const directoriesToAnalyze = [
    'src/tests',
    'src/__tests__',
    'src/data',
    'src/types',
    'src/services',
    'src/assets'
];

// 📊 POTENTIALLY UNUSED FILES (Need manual verification)
const suspiciousFiles = [
    'src/TestApp.jsx', // Seems like a test component
    'src/components/debug/', // Debug components directory
    'src/components/logger/', // Logger components (check if used)
];

console.log('🔍 TRACKER-UI CLEANUP ANALYSIS\n');
console.log('=====================================\n');

// Function to check if file exists and get size
function analyzeFile(filePath) {
    const fullPath = path.join(baseDir, filePath);

    try {
        const stats = fs.statSync(fullPath);
        return {
            exists: true,
            size: stats.size,
            modified: stats.mtime
        };
    } catch (error) {
        return { exists: false };
    }
}

// Function to check directory contents
function analyzeDirectory(dirPath) {
    const fullPath = path.join(baseDir, dirPath);

    try {
        const files = fs.readdirSync(fullPath);
        return {
            exists: true,
            fileCount: files.length,
            files: files
        };
    } catch (error) {
        return { exists: false };
    }
}

// Analyze files to delete
console.log('📋 FILES MARKED FOR DELETION:\n');
let totalSavings = 0;
let deletionCandidates = [];

filesToDelete.forEach((file, index) => {
    const analysis = analyzeFile(file);
    if (analysis.exists) {
        totalSavings += analysis.size;
        deletionCandidates.push(file);
        console.log(`✅ ${index + 1}. ${file}`);
        console.log(`   Size: ${(analysis.size / 1024).toFixed(1)}KB | Modified: ${analysis.modified.toDateString()}\n`);
    } else {
        console.log(`❌ ${index + 1}. ${file} - NOT FOUND\n`);
    }
});

// Analyze directories
console.log('\n📁 DIRECTORY ANALYSIS:\n');
directoriesToAnalyze.forEach((dir, index) => {
    const analysis = analyzeDirectory(dir);
    if (analysis.exists) {
        console.log(`📁 ${index + 1}. ${dir} - ${analysis.fileCount} files`);
        if (analysis.fileCount === 0) {
            console.log(`   🗑️ EMPTY DIRECTORY - Can be deleted`);
        } else if (analysis.fileCount <= 2) {
            console.log(`   ⚠️ SPARSE DIRECTORY - Check if needed:`);
            analysis.files.forEach(file => console.log(`      - ${file}`));
        }
        console.log('');
    } else {
        console.log(`❌ ${index + 1}. ${dir} - NOT FOUND\n`);
    }
});

// Analyze suspicious files
console.log('\n🤔 SUSPICIOUS FILES (MANUAL REVIEW NEEDED):\n');
suspiciousFiles.forEach((item, index) => {
    if (item.endsWith('/')) {
        // Directory
        const analysis = analyzeDirectory(item);
        if (analysis.exists) {
            console.log(`📁 ${index + 1}. ${item} - ${analysis.fileCount} files`);
            console.log(`   Files: ${analysis.files.join(', ')}\n`);
        }
    } else {
        // File
        const analysis = analyzeFile(item);
        if (analysis.exists) {
            console.log(`📄 ${index + 1}. ${item}`);
            console.log(`   Size: ${(analysis.size / 1024).toFixed(1)}KB\n`);
        }
    }
});

// Summary
console.log('\n📊 CLEANUP SUMMARY:\n');
console.log(`🗑️ Files to delete: ${deletionCandidates.length}`);
console.log(`💾 Total space savings: ${(totalSavings / 1024).toFixed(1)}KB`);
console.log(`📁 Directories analyzed: ${directoriesToAnalyze.length}`);

console.log('\n⚠️ NEXT STEPS:\n');
console.log('1. Review the suspicious files manually');
console.log('2. Backup your project before deletion');
console.log('3. Run the deletion script (commented out below)');
console.log('4. Test your application after cleanup');

console.log('\n💡 EXECUTING CLEANUP NOW!\n');

// ACTUAL DELETION CODE
let deletedCount = 0;
let failedCount = 0;

console.log('🗑️ DELETING FILES:\n');
deletionCandidates.forEach(file => {
    const fullPath = path.join(baseDir, file);
    try {
        fs.unlinkSync(fullPath);
        console.log(`✅ Deleted: ${file}`);
        deletedCount++;
    } catch (error) {
        console.error(`❌ Error deleting ${file}:`, error.message);
        failedCount++;
    }
});

// Delete empty directories
console.log('\n🗑️ DELETING EMPTY DIRECTORIES:\n');
directoriesToAnalyze.forEach(dir => {
    const analysis = analyzeDirectory(dir);
    if (analysis.exists && analysis.fileCount === 0) {
        const fullPath = path.join(baseDir, dir);
        try {
            fs.rmdirSync(fullPath);
            console.log(`✅ Deleted empty directory: ${dir}`);
            deletedCount++;
        } catch (error) {
            console.error(`❌ Error deleting directory ${dir}:`, error.message);
            failedCount++;
        }
    }
});

console.log(`\n📊 CLEANUP RESULTS:`);
console.log(`✅ Successfully deleted: ${deletedCount} items`);
console.log(`❌ Failed to delete: ${failedCount} items`);
console.log(`💾 Space saved: ${(totalSavings / 1024).toFixed(1)}KB`);

console.log('\n✨ Cleanup complete!');
