#!/usr/bin/env node

/**
 * Save clipboard contents to buttons.json
 * 
 * Reads the system clipboard and writes its contents to buttons.json at the project root.
 * Useful for saving the JSON output from the Step 1A browser console script.
 * 
 * Usage: node scripts/save-clipboard-json.js
 */

import fs from 'fs';
import clipboardy from 'clipboardy';

// Output file path
const OUTPUT_FILE = 'buttons.json';

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('📋 Reading clipboard contents...');
    
    // Read clipboard content
    const clipboardContent = await clipboardy.read();
    
    if (!clipboardContent || clipboardContent.trim() === '') {
      console.error('❌ Clipboard is empty or contains no text');
      process.exit(1);
    }
    
    // Validate JSON format (optional - will write regardless)
    try {
      JSON.parse(clipboardContent);
      console.log('✅ Valid JSON detected in clipboard');
    } catch (parseError) {
      console.warn('⚠️  Warning: Clipboard content may not be valid JSON');
      console.warn('    Saving anyway - please verify the content manually');
    }
    
    // Write to file (overwrite if exists)
    fs.writeFileSync(OUTPUT_FILE, clipboardContent, 'utf8');
    
    // Get file size for confirmation
    const stats = fs.statSync(OUTPUT_FILE);
    const fileSize = stats.size;
    
    console.log(`✅ ${OUTPUT_FILE} saved (${fileSize} bytes)`);
    
    // Show preview of content (first 200 chars)
    const preview = clipboardContent.length > 200 
      ? clipboardContent.substring(0, 200) + '...'
      : clipboardContent;
    
    console.log('\n📄 Content preview:');
    console.log(preview);
    
  } catch (error) {
    console.error('❌ Error saving clipboard to JSON:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
