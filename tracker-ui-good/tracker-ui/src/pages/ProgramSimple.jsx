import React from 'react';
import ProgramNew from './ProgramNew';

/**
 * Legacy Program.jsx - Now redirects to new modular architecture
 * 
 * This file has been refactored from 3454 lines into a modular architecture:
 * - ProgramContext.jsx: Centralized state management
 * - useProgramHooks.js: Custom hooks for complex logic
 * - ProgramOverview.jsx: Assessment and training model selection
 * - BlockSequencing.jsx: Drag & drop calendar interface
 * - LoadingParameters.jsx: Per-block parameter configuration
 * - TrainingMethods.jsx: Training method selection
 * - ProgramPreview.jsx: Program generation and preview
 * 
 * Benefits of the new architecture:
 * - No more Temporal Dead Zone issues
 * - Much easier to debug and maintain
 * - Better separation of concerns
 * - Easier testing
 * - Better performance through code splitting
 */

const Program = () => {
    return <ProgramNew />;
};

export default Program;
