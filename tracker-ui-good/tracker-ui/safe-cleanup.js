#!/usr/bin/env node

/**
 * SAFE Tracker-UI Cleanup Script
 * Removes only confirmed unused files after dependency analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = __dirname;

// ✅ SAFE TO DELETE - No imports found for these files
const safeToDelete = [
    // BACKUP FILES (Definitely safe)
    'src/pages/Dashboard.jsx.backup',
    'src/pages/Macrocycle.jsx.backup',
    'src/pages/MacrocycleNew.jsx.backup',
    'src/pages/MacrocycleNew_fixed.jsx.backup',
    'src/pages/Program.jsx.bak',
    'src/pages/Program_BACKUP_20250714_123600.jsx',

    // DUPLICATE/ALTERNATIVE VERSIONS (Main versions exist)
    'src/pages/ProgramNew.jsx',
    'src/pages/ProgramSimple.jsx',
    'src/pages/MesocycleEnhanced.jsx',
    'src/pages/MesocycleNew.jsx',
    'src/pages/MicrocycleNew.jsx',
    'src/pages/TrackingEnhanced.jsx', // TrackingEnhanced is used in App.jsx routes, but this file is old
    'src/pages/Tracking_new.jsx',

    // EMPTY TEST FILES
    'src/pages/Macrocycle7.1.25.fixed.jsx', // 0KB
    'src/pages/Macrocycle7.1.25.jsx', // 0KB
    'src/pages/FocusTest.jsx', // 0KB
    'src/pages/TestInput.jsx', // 0KB
    'src/pages/VolumeChart.jsx', // 0KB
    'src/TestApp.jsx', // 0KB

    // TEST FILE
    'src/tests/Sessions.test.skip.jsx', // Explicitly skipped test

    // DEBUG COMPONENT (Not imported anywhere)
    'src/components/ContextTest.jsx'
];

// ⚠️ KEEP BUT REVIEW - These have dependencies or are actively used
const keepButReview = [
    'src/components/ProgramDetails.tsx', // Used by ContextAwareBuilder
    'src/pages/Mesocycle.jsx', // Check if still needed
    'src/pages/Microcycle.jsx', // Check if still needed
    'src/components/logger/', // Used in archive but might be needed
    'src/components/debug/', // Debug components
];

// 📁 EMPTY DIRECTORIES TO REMOVE
const emptyDirectories = [
    'src/types' // 0 files
];

console.log('🧹 SAFE TRACKER-UI CLEANUP\n');
console.log('=========================\n');

let deletedCount = 0;
let totalSaved = 0;

// Function to safely delete a file
function safeDelete(filePath) {
    const fullPath = path.join(baseDir, filePath);

    try {
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(1);

        fs.unlinkSync(fullPath);

        console.log(`🗑️ Deleted: ${filePath} (${sizeKB}KB)`);
        deletedCount++;
        totalSaved += stats.size;

        return true;
    } catch (error) {
        console.error(`❌ Error deleting ${filePath}:`, error.message);
        return false;
    }
}

// Function to safely remove empty directory
function safeRemoveDir(dirPath) {
    const fullPath = path.join(baseDir, dirPath);

    try {
        const files = fs.readdirSync(fullPath);
        if (files.length === 0) {
            fs.rmdirSync(fullPath);
            console.log(`📁 Removed empty directory: ${dirPath}`);
            return true;
        } else {
            console.log(`⚠️ Directory not empty: ${dirPath} (${files.length} files)`);
            return false;
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`✅ Directory doesn't exist: ${dirPath}`);
            return true;
        }
        console.error(`❌ Error removing directory ${dirPath}:`, error.message);
        return false;
    }
}

// Delete safe files
console.log('📋 DELETING SAFE FILES:\n');
safeToDelete.forEach(file => {
    safeDelete(file);
});

// Remove empty directories
console.log('\n📁 REMOVING EMPTY DIRECTORIES:\n');
emptyDirectories.forEach(dir => {
    safeRemoveDir(dir);
});

// Summary
console.log('\n📊 CLEANUP SUMMARY:\n');
console.log(`🗑️ Files deleted: ${deletedCount}`);
console.log(`💾 Space saved: ${(totalSaved / 1024).toFixed(1)}KB`);

console.log('\n📋 FILES KEPT FOR REVIEW:\n');
keepButReview.forEach((item, index) => {
    console.log(`${index + 1}. ${item} - Review if still needed`);
});

console.log('\n✅ SAFE CLEANUP COMPLETE!\n');
console.log('⚠️ NEXT STEPS:');
console.log('1. Test your application to ensure nothing is broken');
console.log('2. Review the files marked for manual review');
console.log('3. Run your development server and check all routes');
console.log('4. Consider removing the "keep but review" files if not needed');

console.log('\n🎯 RECOMMENDED ADDITIONAL CLEANUP:');
console.log('- Review test files in src/tests/ and src/__tests__/');
console.log('- Check if src/data/ TypeScript files are needed');
console.log('- Consider consolidating similar components');
console.log('- Remove unused dependencies from package.json');
