import { exportChart } from './js/algorithms/dataExport.js';

const invalidData = { type: 'unknown' };
console.log('Input data:', invalidData);
console.log('Type:', invalidData.type);
console.log('Type check:', !['volume-progression', 'strength-progression', 'fatigue-analysis', 'performance-tracking'].includes(invalidData.type));

const result = exportChart(invalidData, { format: 'svg' });

console.log('Result:', JSON.stringify(result, null, 2));
console.log('Success:', result.success);
console.log('Error:', result.error);
