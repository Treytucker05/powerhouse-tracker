import React from 'react';
import UnifiedMacrocyclePlanner from '../../macrocycle/UnifiedMacrocyclePlanner';

/**
 * MacrocycleStructure - Unified macrocycle planning component
 * Now uses the complete unified system merging all features
 */
const MacrocycleStructure = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    return (
        <UnifiedMacrocyclePlanner
            onNext={onNext}
            onPrevious={onPrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
        />
    );
};

export default MacrocycleStructure;
