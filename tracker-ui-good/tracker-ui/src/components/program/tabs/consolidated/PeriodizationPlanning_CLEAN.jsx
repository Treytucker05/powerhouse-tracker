import React, { useState } from 'react';
import {
    Calendar,
    TrendingUp,
    Target,
    Clock,
    BarChart3,
    CheckCircle,
    RotateCcw,
    Activity,
    Settings,
    Layers,
    Zap,
    ArrowRight,
    PlayCircle,
    Plus
} from 'lucide-react';
import { EnhancedMacrocyclePlanner } from '../../../../../components/macrocycle/EnhancedMacrocyclePlanner';

/**
 * PeriodizationPlanning.jsx - Unified Enhanced Periodization Planning
 * 
 * Features:
 * - Uses enhanced multi-goal macrocycle system exclusively
 * - Removed traditional single-goal toggle to avoid confusion
 * - Streamlined interface with enhanced capabilities
 */

const PeriodizationPlanning = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    // State for comprehensive periodization (using enhanced mode only)
    const [periodization, setPeriodization] = useState({
        macrocycle: {
            duration: 52, // weeks
            startDate: new Date(),
            goals: [],
            phases: []
        },
        mesocycles: [],
        competitions: [],
        deloads: {
            frequency: 4, // every 4 weeks
            type: 'volume', // volume, intensity, complete
            duration: 1 // weeks
        }
    });

    const handleMacrocycleUpdate = (macrocycleData) => {
        setPeriodization(prev => ({
            ...prev,
            ...macrocycleData
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-400" />
                        Periodization Planning
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Design comprehensive multi-goal training periodization with advanced calendar visualization and drag-and-drop planning
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                    <span className="text-white font-medium">Enhanced System</span>
                </div>
            </div>

            {/* Enhanced Multi-Goal Planning - Unified System */}
            <EnhancedMacrocyclePlanner
                onMacrocycleChange={handleMacrocycleUpdate}
                initialData={periodization}
                onNext={onNext}
                onPrevious={onPrevious}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
            />

            {/* Key Benefits */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Enhanced Planning Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Multiple concurrent training goals
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Drag-and-drop mesocycle planning
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Interactive calendar visualization
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Goal-specific mesocycle generation
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Extended timeline management (52+ weeks)
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Competition and peaking integration
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodizationPlanning;
