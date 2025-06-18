#!/usr/bin/env node

/**
 * Report Missing Handlers
 * 
 * Reads buttons.json and identifies buttons that are missing handlers.
 * Reports buttons where:
 * - hasHandler is false OR
 * - handlerName is "(none)"
 * 
 * Usage: node scripts/report-missing-handlers.js
 */

import fs from 'fs';

// Input file path
const BUTTONS_FILE = 'buttons.json';

/**
 * Read and parse the buttons.json file
 */
function readButtonsData() {
  try {
    const data = fs.readFileSync(BUTTONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading ${BUTTONS_FILE}:`, error.message);
    if (error.code === 'ENOENT') {
      console.log(`💡 Please run the inventory script first to generate ${BUTTONS_FILE}`);
    }
    process.exit(1);
  }
}

/**
 * Check if a button is missing a handler
 */
function isMissingHandler(button) {
  return button.hasHandler === false || button.handlerName === "(none)";
}

/**
 * Generate expected handler name based on button ID
 */
function getExpectedHandlerName(buttonId) {
  // For most buttons, the expected handler name matches the button ID
  // Remove 'btn' prefix if present for the function name
  if (buttonId.startsWith('btn')) {
    const functionName = buttonId.substring(3); // Remove 'btn'
    // Convert to camelCase function name
    return functionName.charAt(0).toLowerCase() + functionName.slice(1);
  }
  return buttonId;
}

/**
 * Format section name for display (remove expand arrows and extra info)
 */
function formatSection(section) {
  return section
    .replace(/▼/g, '')
    .replace(/\s+\d+\s+actions?\s*$/i, '')
    .trim();
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Scanning for buttons with missing handlers...\n');
  
  // Check if buttons file exists
  if (!fs.existsSync(BUTTONS_FILE)) {
    console.error(`❌ ${BUTTONS_FILE} not found.`);
    console.log(`💡 Please run the inventory generation script first.`);
    process.exit(1);
  }
  
  // Read buttons data
  const data = readButtonsData();
  const buttons = data.buttons || [];
  
  console.log(`📊 Loaded ${buttons.length} buttons from ${BUTTONS_FILE}\n`);
  
  // Find buttons with missing handlers
  const missingHandlers = buttons.filter(isMissingHandler);
  
  if (missingHandlers.length === 0) {
    console.log('🎉 All buttons have handlers! No missing handlers found.');
    return;
  }
  
  console.log(`❌ Found ${missingHandlers.length} buttons with missing handlers:\n`);
  
  // Print table header
  console.log('| Section | Button ID | Label | Expected Handler | Status |');
  console.log('|---------|-----------|-------|------------------|--------|');
  
  // Print each button with missing handler
  missingHandlers.forEach(button => {
    const section = formatSection(button.section || 'Unknown');
    const buttonId = button.id || 'unknown';
    const label = button.label === '(no label)' ? '(unlabeled)' : (button.label || '(unknown)');
    const expectedHandler = getExpectedHandlerName(buttonId);
    
    // Determine status
    let status = '';
    if (button.hasHandler === false && button.handlerName === '(none)') {
      status = 'No handler + No name';
    } else if (button.hasHandler === false) {
      status = 'No handler';
    } else if (button.handlerName === '(none)') {
      status = 'No handler name';
    }
    
    // Escape pipe characters for markdown table
    const escapePipes = (str) => String(str).replace(/\|/g, '\\|');
    
    console.log(`| ${escapePipes(section)} | ${escapePipes(buttonId)} | ${escapePipes(label)} | ${escapePipes(expectedHandler)} | ${escapePipes(status)} |`);
  });
  
  console.log('\n📋 Summary:');
  console.log(`   Total buttons: ${buttons.length}`);
  console.log(`   Missing handlers: ${missingHandlers.length}`);
  console.log(`   Handler coverage: ${Math.round(((buttons.length - missingHandlers.length) / buttons.length) * 100)}%`);
  
  // Group by section for additional insights
  const bySection = missingHandlers.reduce((acc, button) => {
    const section = formatSection(button.section || 'Unknown');
    if (!acc[section]) acc[section] = [];
    acc[section].push(button);
    return acc;
  }, {});
  
  console.log('\n📊 Missing handlers by section:');
  Object.entries(bySection)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([section, buttons]) => {
      console.log(`   ${section}: ${buttons.length} missing`);
    });
  
  console.log('\n💡 Next steps:');
  console.log('   1. Implement missing handler functions');
  console.log('   2. Attach handlers to window object or appropriate modules');
  console.log('   3. Update button event listeners');
  console.log('   4. Re-run inventory to verify fixes');
}

// Run the script
main();
