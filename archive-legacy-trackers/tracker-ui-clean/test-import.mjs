// test-import.mjs
import './node-bootstrap.js';
console.log('Bootstrap complete');

try {
  const deload = await import('./js/algorithms/deload.js');
  console.log('Deload exports:', Object.keys(deload));
} catch (err) {
  console.error('Deload import error:', err.message);
}

try {
  const intelligence = await import('./js/algorithms/intelligence.js');
  console.log('Intelligence exports:', Object.keys(intelligence));
} catch (err) {
  console.error('Intelligence import error:', err.message);
}
