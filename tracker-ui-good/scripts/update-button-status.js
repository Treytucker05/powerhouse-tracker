// Script to update buttons.json with the new Phase-3 handler status
// Run with: node scripts/update-button-status.js

import fs from 'fs';
import path from 'path';

console.log("Updating button handler status...\n");

try {
  const buttonsPath = path.join(process.cwd(), 'buttons.json');
  const buttonsData = JSON.parse(fs.readFileSync(buttonsPath, 'utf8'));
  
  // Phase-3 handlers that were just implemented
  const newHandlers = {
    'btnNextWeek': 'nextWeek',
    'btnProcessWeeklyAdjustments': 'processWeeklyAdjustments',
    'btnWeeklyIntelligenceReport': 'weeklyIntelligenceReport',
    'btnPredictDeloadTiming': 'predictDeloadTiming',
    'btnPlateauAnalysis': 'plateauAnalysis'
  };
  
  let updatedCount = 0;
  
  // Update the button status
  buttonsData.buttons.forEach(button => {
    if (newHandlers[button.id]) {
      if (!button.hasHandler) {
        console.log(`✅ Updating ${button.id} → hasHandler: true, handlerName: ${newHandlers[button.id]}`);
        button.hasHandler = true;
        button.handlerName = newHandlers[button.id];
        updatedCount++;
      }
    }
  });
  
  if (updatedCount > 0) {
    fs.writeFileSync(buttonsPath, JSON.stringify(buttonsData, null, 2));
    console.log(`\n🎉 Updated ${updatedCount} button(s) in buttons.json`);
    
    // Calculate new coverage
    const totalButtons = buttonsData.buttons.length;
    const workingButtons = buttonsData.buttons.filter(b => b.hasHandler).length;
    const coverage = Math.round((workingButtons / totalButtons) * 100);
    
    console.log(`📊 New handler coverage: ${workingButtons}/${totalButtons} (${coverage}%)`);
  } else {
    console.log("ℹ️  No updates needed - all buttons already marked correctly");
  }
  
} catch (error) {
  console.error("Error updating button status:", error.message);
}
