import React from 'react';
import { MacrocycleBuilderProvider } from '../../contexts/MacrocycleBuilderContext.tsx';
import ProgramDetails from '../ProgramDetails.tsx';
import TemplateSelection from './TemplateSelection.tsx';
import TimelineBlocks from './TimelineBlocks.tsx';
import VolumeDistribution from './VolumeDistribution.tsx';
import ReviewGenerate from './ReviewGenerate.tsx';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext.tsx';

// Advanced Macrocycle Builder Wrapper
const MacrocycleBuilderWrapper = ({ onBack }) => {
    const { state } = useBuilder();
    const { currentStep } = state;

    const steps = [
        { id: 1, name: 'Program Details', icon: '📝' },
        { id: 2, name: 'Template Selection', icon: '📋' },
        { id: 3, name: 'Timeline Blocks', icon: '📅' },
        { id: 3.5, name: 'Volume Distribution', icon: '📊' },
        { id: 4, name: 'Review & Generate', icon: '✅' }
    ];

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ProgramDetails />;
            case 2:
                return <TemplateSelection />;
            case 3:
                return <TimelineBlocks />;
            case 3.5:
                return <VolumeDistribution />;
            case 4:
                return <ReviewGenerate />;
            default:
                return <ProgramDetails />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Back to Overview Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <span>←</span>
                    <span>Back to Overview</span>
                </button>
                <div className="text-gray-400 text-sm">
                    Advanced Macrocycle Builder
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Build Progress</h3>
                    <span className="text-gray-400 text-sm">
                        Step {currentStep} of {steps.length}
                    </span>
                </div>

                {/* Step Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    ></div>
                </div>

                {/* Step Breadcrumbs */}
                <div className="flex items-center space-x-2 overflow-x-auto">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2">
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${currentStep >= step.id
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                <span>{step.icon}</span>
                                <span className="hidden sm:inline">{step.name}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="text-gray-600">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Step Content */}
            <div className="min-h-[600px]">
                {renderStep()}
            </div>
        </div>
    );
};

// Simple Builder for other contexts
const SimpleProgramBuilder = ({ onBack, programData, setProgramData, selectedLevel, error, setError, isLoading, saveProgram }) => {
    const contextInfo = {
        meso: {
            title: 'Mesocycle Builder',
            description: 'Create 4-6 week training blocks with specific focuses',
            icon: '📊',
            features: ['Block periodization', 'Progressive overload', 'Fatigue management']
        },
        micro: {
            title: 'Microcycle Builder',
            description: 'Design weekly training schedules',
            icon: '📋',
            features: ['Daily workout planning', 'Session structure', 'Recovery scheduling']
        }
    };

    const info = contextInfo[selectedLevel] || contextInfo.meso;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <span>←</span>
                    <span>Back to Overview</span>
                </button>
                <div className="text-gray-400 text-sm">
                    {info.title}
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                        <p className="text-gray-400 text-sm">{info.description}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">Key Features:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                        {info.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span className="text-green-400">•</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Program Name
                        </label>
                        <input
                            type="text"
                            value={programData?.name || ''}
                            onChange={(e) => setProgramData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
                            placeholder={`Enter ${selectedLevel} name...`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Duration ({selectedLevel === 'micro' ? 'days' : 'weeks'})
                        </label>
                        <input
                            type="number"
                            value={programData?.duration || (selectedLevel === 'micro' ? 7 : 4)}
                            onChange={(e) => setProgramData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
                            min="1"
                            max={selectedLevel === 'micro' ? 14 : 52}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Training Days per Week
                        </label>
                        <select
                            value={programData?.trainingDays || 4}
                            onChange={(e) => setProgramData(prev => ({ ...prev, trainingDays: parseInt(e.target.value) }))}
                            className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
                        >
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="6">6 Days</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => saveProgram(programData)}
                        disabled={isLoading || !programData?.name?.trim()}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : `Create ${selectedLevel?.toUpperCase()} Program`}
                    </button>
                </div>
            </div>

            {/* Future Enhancement Notice */}
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400">🚀</span>
                    <span className="text-blue-300 font-medium">Coming Soon</span>
                </div>
                <p className="text-blue-200 text-sm">
                    Advanced {selectedLevel} builder with detailed phase planning, auto-regulation, and RP methodology integration.
                </p>
            </div>
        </div>
    );
};

// Context-Aware Builder Component
const ContextAwareBuilder = ({
    context,
    onBack,
    programData,
    setProgramData,
    selectedLevel,
    error,
    setError,
    isLoading,
    saveProgram
}) => {
    // For macrocycle context, use the advanced builder
    if (context === 'macro' || selectedLevel === 'macro') {
        return (
            <MacrocycleBuilderProvider>
                <MacrocycleBuilderWrapper onBack={onBack} />
            </MacrocycleBuilderProvider>
        );
    }

    // For other contexts, use the simple builder
    return (
        <SimpleProgramBuilder
            onBack={onBack}
            programData={programData}
            setProgramData={setProgramData}
            selectedLevel={selectedLevel}
            error={error}
            setError={setError}
            isLoading={isLoading}
            saveProgram={saveProgram}
        />
    );
};

export default ContextAwareBuilder;
