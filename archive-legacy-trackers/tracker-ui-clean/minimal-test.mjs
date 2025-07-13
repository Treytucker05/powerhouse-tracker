// minimal-test.mjs
import './node-bootstrap.js';
console.log('Starting minimal test...');

// Try importing just one simple module
const module = await import('./js/ui/navigation.js');
console.log('Import successful:', typeof module.showSection);
