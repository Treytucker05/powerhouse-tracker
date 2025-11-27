// Barrel exports for 5/3/1 V2 method module
// Provides a single import surface for components, context, and engines.

// Components
// NOTE: ProgramWizard531V2 intentionally NOT exported here to preserve dynamic code-splitting.
// It is lazy-loaded directly in App.jsx. Exporting it statically here caused Rollup to pull it
// into the main chunk (warning about dynamic + static import). Keep only the active view.
export { default as Program531ActiveV2 } from './components/Program531ActiveV2.jsx';

// Context
export { ProgramProviderV2, ProgramV2Provider } from './contexts/ProgramContextV2.jsx';
export * from './contexts/ProgramContextV2.jsx'; // includes hooks/utilities if any

// Engines (explicit exports to prevent name collisions)
export * from './engines/FiveThreeOneEngine.v2.js';
export { computeAssistanceLoad, buildAssistanceForDay } from './engines/AssistanceEngine.v2.js';

// Assistance rules (normalizeAssistance, assistanceFor, expectedAssistanceCount)
export * from './assistanceRules.js';

// Optional default-style aliases (if consumers want explicit names)
// (Note: underlying engine files export only functions; no default export provided.)

// Rounding utilities (needed by several step components importing from barrel)
// Fixes runtime import error: barrel previously did not re-export roundToIncrement
export { roundToIncrement, roundUpToIncrement, roundDownToIncrement } from '../../lib/math/rounding.ts';
