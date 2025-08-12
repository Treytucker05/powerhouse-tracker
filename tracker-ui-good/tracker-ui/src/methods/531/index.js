// Barrel exports for 5/3/1 V2 method module
// Provides a single import surface for components, context, and engines.

// Components
export { default as ProgramWizard531V2 } from './components/ProgramWizard531V2.jsx';
export { default as Program531ActiveV2 } from './components/Program531ActiveV2.jsx';

// Context
export { ProgramProviderV2, ProgramV2Provider } from './contexts/ProgramContextV2.jsx';
export * from './contexts/ProgramContextV2.jsx'; // includes hooks/utilities if any

// Engines (explicit exports to prevent name collisions)
export * from './engines/FiveThreeOneEngine.v2.js';
export { computeAssistanceLoad, buildAssistanceForDay } from './engines/AssistanceEngine.v2.js';

// Optional default-style aliases (if consumers want explicit names)
// (Note: underlying engine files export only functions; no default export provided.)
