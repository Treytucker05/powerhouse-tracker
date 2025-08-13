import React from 'react';
import UnifiedMacrocyclePlanner from '../../../../../components/macrocycle/UnifiedMacrocyclePlanner';

/**
 * PeriodizationPlanning.jsx - Unified Enhanced Periodization Planning
 * 
 * Features:
 * - Uses unified macrocycle system merging all legacy and enhanced features
 * - Single comprehensive interface eliminating confusion
 * - Complete periodization toolset in one component
 */

const PeriodizationPlanning = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    return (
        <UnifiedMacrocyclePlanner
            onNext={onNext}
            onPrevious={onPrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
        />
    );
};

export default PeriodizationPlanning;
