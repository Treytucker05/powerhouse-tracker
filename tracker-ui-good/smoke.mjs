// smoke.mjs — Enhanced Node.js smoke test for powerhouse-rp-toolkit
import './node-bootstrap.js';

console.log('🧪 Bootstrapped Node environment');

// Test Event polyfills
const ev = new Event('check');
const cev = new CustomEvent('custom', { detail: { test: true } });

if (!(ev instanceof Event) || !(cev instanceof CustomEvent)) {
  throw new Error('Event polyfill failed');
}

console.log('✅ Event system working');

// Test basic imports
try {
  const { TrainingState } = await import('./js/core/trainingState.js');
  console.log('✅ TrainingState imported');
} catch (err) {
  console.error('❌ TrainingState failed:', err.message);
}

try {
  const { showSection } = await import('./js/ui/navigation.js');
  console.log('✅ Navigation imported');
} catch (err) {
  console.error('❌ Navigation failed:', err.message);
}

console.log('🎉 Basic toolkit components load correctly 👍');
