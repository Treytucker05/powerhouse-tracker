import React from 'react';
import { EnhancedMacrocyclePlanner } from '../../macrocycle/EnhancedMacrocyclePlanner';

/**
 * MacrocycleStructure - Unified macrocycle planning component
 * Now uses the enhanced multi-goal system instead of the legacy single-goal approach
 */
const MacrocycleStructure = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    return (
        <EnhancedMacrocyclePlanner
            onNext={onNext}
            onPrevious={onPrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
        />
    );
};

export default MacrocycleStructure;
