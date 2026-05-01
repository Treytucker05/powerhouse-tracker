// Direct test of exportChart function to bypass any caching
import { exportChart } from './js/algorithms/dataExport.js';

console.log('=== DIRECT NODE TEST ===');
console.log('Testing exportChart with invalid data...');

const invalidData = { type: 'unknown' };
const result = exportChart(invalidData, { format: 'svg' });

console.log('Result:', JSON.stringify(result, null, 2));
console.log('Success:', result.success);
console.log('Expected: false, Got:', result.success);

if (result.success === false) {
  console.log('✅ TEST PASSED - Function correctly returned false');
} else {
  console.log('❌ TEST FAILED - Function returned true instead of false');
}
