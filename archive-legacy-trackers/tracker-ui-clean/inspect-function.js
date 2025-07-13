// Debug the exact import resolution
import { exportChart } from './js/algorithms/dataExport.js';

console.log('=== FUNCTION INSPECTION ===');
console.log('Function name:', exportChart.name);
console.log('Function length:', exportChart.length);
console.log('Function source (first 500 chars):');
console.log(exportChart.toString().substring(0, 500));
console.log('=== FUNCTION SOURCE (FULL) ===');
console.log(exportChart.toString());
