// index.js — Main entry point with auto-bootstrap for Node.js environments
if (typeof window === 'undefined') {
  await import('./node-bootstrap.js');
}

// Core algorithm exports
export * from './js/algorithms/intelligence.js';
export * from './js/algorithms/deload.js';
export * from './js/algorithms/dataExport.js';
export * from './js/algorithms/volume.js';
export * from './js/algorithms/effort.js';
export * from './js/algorithms/fatigue.js';

// UI and navigation exports
export * from './js/ui/navigation.js';
export * from './js/ui/buttonHandlers.js';

// Core state management
export * from './js/core/trainingState.js';
export * from './js/core/workflowPhases.js';

// Utility exports
export * from './js/utils/performance.js';
export * from './js/utils/userFeedback.js';
