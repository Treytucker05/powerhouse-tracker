#!/usr/bin/env node

/**
 * Convert inventory JSON to comprehensive markdown audit tables
 * 
 * Reads buttons.json (exported from Step 1A console script) and generates:
 * 1. BUTTON_MASTER_TABLE.md - Complete button inventory with audit columns
 * 2. CALCULATOR_AUDIT.md - Calculator analysis and RP book accuracy tracking
 * 
 * Usage: node scripts/convert-inventory-to-md.js
 */

import fs from 'fs';
import path from 'path';

// File paths
const INPUT_FILE = 'buttons.json';
const BUTTON_OUTPUT = 'BUTTON_MASTER_TABLE.md';
const CALCULATOR_OUTPUT = 'CALCULATOR_AUDIT.md';

/**
 * Read and parse the buttons.json inventory file
 */
function readInventory() {
  try {
    const data = fs.readFileSync(INPUT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading ${INPUT_FILE}:`, error.message);
    process.exit(1);
  }
}

/**
 * Determine button category based on section/context
 */
function categorizeButton(section, buttonId, form) {
  if (buttonId.includes('Live') || buttonId.includes('Session')) return 'Live Monitoring';
  if (buttonId.includes('RP') || buttonId.includes('Algorithm')) return 'RP Algorithms';
  if (buttonId.includes('Auto') || buttonId.includes('Progression')) return 'Auto-Progression';
  if (buttonId.includes('Intelligence') || buttonId.includes('AI')) return 'AI/Intelligence';
  if (buttonId.includes('Deload') || buttonId.includes('Analysis')) return 'Analysis';
  if (buttonId.includes('Setup') || buttonId.includes('Config')) return 'Configuration';
  if (buttonId.includes('Volume') || buttonId.includes('Frequency')) return 'Volume Management';
  if (section?.includes('Foundation')) return 'Foundation';
  if (section?.includes('Mesocycle')) return 'Mesocycle';
  if (section?.includes('Weekly')) return 'Weekly Management';
  if (section?.includes('Daily')) return 'Daily Execution';
  if (section?.includes('Deload')) return 'Deload Management';
  return 'General';
}

/**
 * Check if button has a working handler
 */
function hasWorkingHandler(buttonId, handlerInfo) {
  if (!handlerInfo) return '❌';
  if (handlerInfo.includes('✅') || handlerInfo.includes('attached')) return '✅';
  if (handlerInfo.includes('stub') || handlerInfo.includes('placeholder')) return '⚠️';
  return '❌';
}

/**
 * Extract form context for button
 */
function getFormContext(button, allInputs) {
  const form = button.form || button.calculator || button.section || 'Unknown';
  
  // Find related inputs
  const relatedInputs = allInputs.filter(input => 
    input.form === form || 
    input.calculator === form ||
    input.section === form
  );
  
  const inputList = relatedInputs.length > 0 
    ? relatedInputs.map(i => i.id || i.name).join(', ')
    : 'None';
    
  return { form, inputs: inputList };
}

/**
 * Generate BUTTON_MASTER_TABLE.md
 */
function generateButtonMasterTable(inventory) {
  const { buttons = [], inputs = [] } = inventory;
  
  // Sort buttons by section, then by button ID
  const sortedButtons = [...buttons].sort((a, b) => {
    const sectionA = a.section || a.calculator || 'Unknown';
    const sectionB = b.section || b.calculator || 'Unknown';
    
    if (sectionA !== sectionB) {
      return sectionA.localeCompare(sectionB);
    }
    return (a.id || a.buttonId || '').localeCompare(b.id || b.buttonId || '');
  });

  let markdown = `# Button Master Table

Generated on ${new Date().toLocaleDateString()}

Complete inventory of all buttons with audit tracking for RP book alignment and functionality.

| Section | Button ID | Label | Form | Inputs | Category | RP Book Reference | Formula Accuracy | Handler | Works? | Priority | Notes |
|---------|-----------|-------|------|--------|----------|-------------------|------------------|---------|--------|----------|-------|
`;

  sortedButtons.forEach(button => {
    const buttonId = button.id || button.buttonId || 'unknown';
    const label = button.label || button.text || '(no label)';
    const section = button.section || button.calculator || button.form || 'Unknown';
    
    const formContext = getFormContext(button, inputs);
    const category = categorizeButton(section, buttonId, formContext.form);
    const works = hasWorkingHandler(buttonId, button.handler);
    
    // Escape pipe characters in content
    const escapePipes = (str) => String(str).replace(/\|/g, '\\|');
    
    markdown += `| ${escapePipes(section)} | ${escapePipes(buttonId)} | ${escapePipes(label)} | ${escapePipes(formContext.form)} | ${escapePipes(formContext.inputs)} | ${escapePipes(category)} |  |  | ${escapePipes(button.handler || 'None')} | ${works} |  |  |\n`;
  });

  return markdown;
}

/**
 * Extract calculator information from inventory
 */
function extractCalculators(inventory) {
  const { buttons = [], algorithms = [], inputs = [] } = inventory;
  const calculators = new Map();

  // Group by calculator/form/section
  buttons.forEach(button => {
    const calcName = button.calculator || button.form || button.section || 'Unknown';
    if (!calculators.has(calcName)) {
      calculators.set(calcName, {
        name: calcName,
        buttons: [],
        inputs: [],
        algorithms: [],
        purpose: ''
      });
    }
    calculators.get(calcName).buttons.push(button);
  });

  // Add inputs to calculators
  inputs.forEach(input => {
    const calcName = input.calculator || input.form || input.section || 'Unknown';
    if (calculators.has(calcName)) {
      calculators.get(calcName).inputs.push(input);
    }
  });

  // Add algorithms to calculators
  algorithms.forEach(algorithm => {
    const calcName = algorithm.calculator || algorithm.category || 'Unknown';
    if (calculators.has(calcName)) {
      calculators.get(calcName).algorithms.push(algorithm);
    } else {
      // Create new calculator entry for algorithm-only calculators
      calculators.set(calcName, {
        name: calcName,
        buttons: [],
        inputs: [],
        algorithms: [algorithm],
        purpose: algorithm.purpose || ''
      });
    }
  });

  return Array.from(calculators.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Determine calculator purpose from components
 */
function getCalculatorPurpose(calculator) {
  if (calculator.purpose) return calculator.purpose;
  
  const name = calculator.name.toLowerCase();
  if (name.includes('volume')) return 'Volume landmark setup and progression tracking';
  if (name.includes('meso')) return 'Mesocycle planning and periodization';
  if (name.includes('deload')) return 'Deload timing and recovery analysis';
  if (name.includes('frequency')) return 'Training frequency optimization';
  if (name.includes('live')) return 'Real-time training session monitoring';
  if (name.includes('intelligence')) return 'AI-powered training optimization';
  if (name.includes('analytics')) return 'Performance analytics and insights';
  if (name.includes('feedback')) return 'Set feedback and autoregulation';
  if (name.includes('weekly')) return 'Weekly planning and progression';
  if (name.includes('daily')) return 'Daily training execution';
  
  return 'Training calculator/tool';
}

/**
 * Generate CALCULATOR_AUDIT.md
 */
function generateCalculatorAudit(inventory) {
  const calculators = extractCalculators(inventory);
  
  let markdown = `# Calculator Audit

Generated on ${new Date().toLocaleDateString()}

Analysis of all calculators and their alignment with RP book formulas and methodology.

| Calculator | Purpose | RP Book Formula | Current Implementation | Accuracy | Test Cases | Notes |
|------------|---------|-----------------|------------------------|----------|------------|-------|
`;

  calculators.forEach(calc => {
    const purpose = getCalculatorPurpose(calc);
    const implementation = calc.algorithms.length > 0 
      ? `${calc.algorithms.length} algorithm(s), ${calc.buttons.length} action(s)`
      : `${calc.buttons.length} action(s) only`;
    
    // Escape pipe characters
    const escapePipes = (str) => String(str).replace(/\|/g, '\\|');
    
    markdown += `| ${escapePipes(calc.name)} | ${escapePipes(purpose)} |  | ${escapePipes(implementation)} |  |  |  |\n`;
  });

  markdown += `

## Calculator Details

`;

  calculators.forEach(calc => {
    markdown += `### ${calc.name}\n\n`;
    markdown += `**Purpose:** ${getCalculatorPurpose(calc)}\n\n`;
    
    if (calc.buttons.length > 0) {
      markdown += `**Buttons (${calc.buttons.length}):**\n`;
      calc.buttons.forEach(btn => {
        const buttonId = btn.id || btn.buttonId || 'unknown';
        const label = btn.label || btn.text || '(no label)';
        markdown += `- \`${buttonId}\`: ${label}\n`;
      });
      markdown += '\n';
    }
    
    if (calc.inputs.length > 0) {
      markdown += `**Inputs (${calc.inputs.length}):**\n`;
      calc.inputs.forEach(input => {
        const inputId = input.id || input.name || 'unknown';
        const inputType = input.type || 'unknown';
        markdown += `- \`${inputId}\` (${inputType})\n`;
      });
      markdown += '\n';
    }
    
    if (calc.algorithms.length > 0) {
      markdown += `**Algorithms (${calc.algorithms.length}):**\n`;
      calc.algorithms.forEach(algo => {
        const algoName = algo.name || algo.function || 'unknown';
        markdown += `- \`${algoName}\`\n`;
      });
      markdown += '\n';
    }
    
    markdown += '---\n\n';
  });

  return markdown;
}

/**
 * Write file with error handling
 */
function writeFile(filename, content) {
  try {
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`✅ Generated ${filename}`);
  } catch (error) {
    console.error(`❌ Error writing ${filename}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Converting inventory JSON to markdown audit tables...\n');
  
  // Check if input file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Input file ${INPUT_FILE} not found.`);
    console.log(`💡 Please run the Step 1A console script first to generate the inventory.`);
    process.exit(1);
  }
  
  // Read inventory
  const inventory = readInventory();
  console.log(`📊 Loaded inventory with:`);
  console.log(`   - ${inventory.buttons?.length || 0} buttons`);
  console.log(`   - ${inventory.inputs?.length || 0} inputs`);
  console.log(`   - ${inventory.algorithms?.length || 0} algorithms\n`);
  
  // Generate button master table
  const buttonTable = generateButtonMasterTable(inventory);
  writeFile(BUTTON_OUTPUT, buttonTable);
  
  // Generate calculator audit
  const calculatorAudit = generateCalculatorAudit(inventory);
  writeFile(CALCULATOR_OUTPUT, calculatorAudit);
  
  console.log('\n🎉 Conversion complete!');
  console.log(`📝 Review the generated files:`);
  console.log(`   - ${BUTTON_OUTPUT} - Complete button inventory with audit columns`);
  console.log(`   - ${CALCULATOR_OUTPUT} - Calculator analysis and RP book tracking`);
}

// Run if called directly
main();

export { readInventory, generateButtonMasterTable, generateCalculatorAudit };
