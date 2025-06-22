// Test debug script
import { exportChart } from './js/algorithms/dataExport.js';
import fs from 'fs';

console.log('=== RUNNING DEBUG TEST ===');

// Check what the file actually contains
const fileContent = fs.readFileSync('./js/algorithms/dataExport.js', 'utf8');
console.log('File starts with:', fileContent.substring(0, 200));
console.log('File contains "unknown":', fileContent.includes('unknown'));
console.log('File contains "throw new Error":', fileContent.includes('throw new Error'));

// Check the function itself
console.log('exportChart function:', exportChart.toString().substring(0, 300));

const invalidData = { type: 'unknown' };
console.log('Calling exportChart with:', invalidData);

try {
  const result = exportChart(invalidData, { format: 'svg' });
  console.log('Result:', result);
  console.log('Result.success:', result.success);
} catch (error) {
  console.log('Error thrown:', error.message);
}
