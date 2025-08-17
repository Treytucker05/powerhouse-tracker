import React, { useState, useCallback, memo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, Table, Eye, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar-styles.css';

import { MacrocycleBuilderProvider } from '../../contexts/MacrocycleBuilderContext.tsx';
import ProgramDetails from '../ProgramDetails.tsx';
import TemplateSelection from './TemplateSelection.tsx';
import TimelineBlocks from './TimelineBlocks.tsx';
import VolumeDistribution from './VolumeDistribution.tsx';
import ReviewGenerate from './ReviewGenerate.tsx';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext.tsx';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Builder Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-400 mb-2 text-2xl">⚠️</div>
                        <div className="text-white mb-2">Builder Error</div>
                        <div className="text-gray-400 text-sm mb-4">
                            Something went wrong with the advanced builder.
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                this.props.onBack && this.props.onBack();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Back to Overview
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Simple Program Details Form (fallback when main builder has issues)
const SimpleProgramDetailsForm = ({ selectedLevel, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        goal: 'hypertrophy',
        duration: selectedLevel === 'micro' ? 1 : selectedLevel === 'meso' ? 4 : 12,
        trainingDays: 4
    });

    const levelInfo = {
        macro: { title: 'Macrocycle Program', subtitle: 'Complete Training Program (12+ weeks)', icon: '🎯' },
        meso: { title: 'Mesocycle Block', subtitle: 'Training Block (4-6 weeks)', icon: '📊' },
        micro: { title: 'Microcycle Week', subtitle: 'Weekly Structure (1-2 weeks)', icon: '📋' }
    };

    const info = levelInfo[selectedLevel] || levelInfo.macro;

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                        <p className="text-gray-400 text-sm">{info.subtitle}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Program Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder={`Enter ${selectedLevel} name...`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Primary Goal
                        </label>
                        <select
                            value={formData.goal}
                            onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                            <option value="hypertrophy">Hypertrophy</option>
                            <option value="strength">Strength</option>
                            <option value="power">Power</option>
                            <option value="endurance">Endurance</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Duration ({selectedLevel === 'micro' ? 'weeks' : 'weeks'})
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
                            min="1"
                            max={selectedLevel === 'micro' ? 4 : selectedLevel === 'meso' ? 12 : 52}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Training Days per Week
                        </label>
                        <select
                            value={formData.trainingDays}
                            onChange={(e) => setFormData(prev => ({ ...prev, trainingDays: parseInt(e.target.value) }))}
                            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="6">6 Days</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            // For now just show success message
                            toast.success(`${selectedLevel.toUpperCase()} program "${formData.name}" created!`);
                        }}
                        disabled={!formData.name.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create {selectedLevel.toUpperCase()} Program
                    </button>
                </div>
            </div>
        </div>
    );
};

// Unified Advanced Builder - Works for all program levels
const UnifiedAdvancedBuilder = ({ onBack, selectedLevel, programData, setProgramData }) => {
    // Add error handling for useBuilder hook
    let builderState;
    let builderError = null;

    try {
        const { state } = useBuilder();
        builderState = state;
    } catch (error) {
        console.error('useBuilder hook error:', error);
        builderError = error;
    }

    // If there's an error with the builder context, show a fallback
    if (builderError || !builderState) {
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
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <div className="text-yellow-400 text-2xl mb-4">⚠️</div>
                    <h3 className="text-white font-semibold mb-2">Builder Loading Issue</h3>
                    <p className="text-yellow-200 text-sm mb-4">
                        The advanced builder is having trouble loading. You can still create programs using the basic interface.
                    </p>
                    <button
                        onClick={onBack}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Return to Overview
                    </button>
                </div>
            </div>
        );
    }

    const { currentStep } = builderState;

    // Adapt steps based on program level
    const getStepsForLevel = (level) => {
        const baseSteps = [
            { id: 1, name: 'Program Details', icon: '📝' },
            { id: 2, name: 'Template Selection', icon: '📋' },
            { id: 3, name: 'Timeline Blocks', icon: '📅' },
            { id: 3.5, name: 'Volume Distribution', icon: '📊' },
            { id: 3.7, name: 'Timeline View', icon: '🗓️' },
            { id: 4, name: 'Review & Generate', icon: '✅' }
        ];

        // Customize based on level
        if (level === 'micro') {
            return baseSteps.map(step => {
                if (step.id === 3) return { ...step, name: 'Weekly Structure', icon: '📋' };
                if (step.id === 3.7) return { ...step, name: 'Week View', icon: '📅' };
                return step;
            });
        } else if (level === 'meso') {
            return baseSteps.map(step => {
                if (step.id === 3) return { ...step, name: 'Block Structure', icon: '📊' };
                if (step.id === 3.7) return { ...step, name: 'Block Timeline', icon: '📊' };
                return step;
            });
        }
        return baseSteps; // Default for macro
    };

    const steps = getStepsForLevel(selectedLevel);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                // Wrap in try-catch to prevent component errors
                try {
                    return <ProgramDetails />;
                } catch (error) {
                    console.error('ProgramDetails error:', error);
                    return <SimpleProgramDetailsForm selectedLevel={selectedLevel} onBack={onBack} />;
                }
            case 2:
                try {
                    return <TemplateSelection />;
                } catch (error) {
                    console.error('TemplateSelection error:', error);
                    return <div className="text-white">Template Selection (coming soon)</div>;
                }
            case 3:
                try {
                    return <TimelineBlocks />;
                } catch (error) {
                    console.error('TimelineBlocks error:', error);
                    return <div className="text-white">Timeline Blocks (coming soon)</div>;
                }
            case 3.5:
                try {
                    return <VolumeDistribution />;
                } catch (error) {
                    console.error('VolumeDistribution error:', error);
                    return <div className="text-white">Volume Distribution (coming soon)</div>;
                }
            case 3.7:
                return <TimelineStep selectedLevel={selectedLevel} />;
            case 4:
                try {
                    return <ReviewGenerate />;
                } catch (error) {
                    console.error('ReviewGenerate error:', error);
                    return <div className="text-white">Review & Generate (coming soon)</div>;
                }
            default:
                return <SimpleProgramDetailsForm selectedLevel={selectedLevel} onBack={onBack} />;
        }
    };

    const getLevelDisplayInfo = (level) => {
        const levelInfo = {
            macro: { title: 'Macrocycle Builder', subtitle: 'Complete Training Program (12+ weeks)', icon: '🎯' },
            meso: { title: 'Mesocycle Builder', subtitle: 'Training Block (4-6 weeks)', icon: '📊' },
            micro: { title: 'Microcycle Builder', subtitle: 'Weekly Structure (1-2 weeks)', icon: '📋' }
        };
        return levelInfo[level] || levelInfo.macro;
    };

    const levelInfo = getLevelDisplayInfo(selectedLevel);

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
                <div className="text-gray-400 text-sm flex items-center space-x-2">
                    <span>{levelInfo.icon}</span>
                    <span>{levelInfo.title}</span>
                </div>
            </div>

            {/* Level-specific banner */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="text-2xl">{levelInfo.icon}</div>
                    <div>
                        <h3 className="text-white font-semibold">{levelInfo.title}</h3>
                        <p className="text-blue-200 text-sm">{levelInfo.subtitle}</p>
                    </div>
                    <div className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                        {selectedLevel.toUpperCase()} MODE
                    </div>
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

// Level Selection Step Component - Enhanced to match the Overview cards style  
const LevelSelectionStep = ({ onBack, onStartMacrocycle, onStartMesocycle, onStartMicrocycle, setActiveTab, setSelectedLevel }) => {
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
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Planning Level</h2>
                <p className="text-gray-400">Select the type of program you want to design</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        id: 'macro',
                        title: 'MACROCYCLE',
                        subtitle: '3-12 months',
                        description: 'Long-term periodization with RP + NEW Timeline View! 📅✨',
                        icon: '📅',
                        handler: onStartMacrocycle
                    },
                    {
                        id: 'meso',
                        title: 'MESOCYCLE',
                        subtitle: '4-6 weeks',
                        description: 'Training blocks and phases',
                        icon: '📊',
                        handler: onStartMesocycle
                    },
                    {
                        id: 'micro',
                        title: 'MICROCYCLE',
                        subtitle: '1 week',
                        description: 'Daily workout planning',
                        icon: '📋',
                        handler: onStartMicrocycle
                    }
                ].map((level) => (
                    <div
                        key={level.id}
                        className="bg-gray-800 rounded-lg p-6 border-2 border-gray-600 hover:border-gray-500 cursor-pointer transition-all"
                        onClick={() => setSelectedLevel && setSelectedLevel(level.id)}
                    >
                        <div className="text-3xl mb-3">{level.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-1">{level.title}</h3>
                        <p className="text-red-400 text-sm mb-2">{level.subtitle}</p>
                        <p className="text-gray-300 text-sm mb-4">{level.description}</p>
                        <div className="space-y-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLevel && setSelectedLevel(level.id);
                                    level.handler && level.handler();
                                }}
                                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                START NEW
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab && setActiveTab('templates');
                                }}
                                className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                            >
                                TEMPLATES
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <p className="text-gray-500 text-sm">
                    Not sure which to choose? Start with <strong className="text-red-400">Macrocycle</strong> for complete program design.
                </p>
            </div>
        </div>
    );
};

// Context-Aware Builder Component - Now unified for all levels
const ContextAwareBuilder = ({
    context,
    onBack,
    programData,
    setProgramData,
    selectedLevel,
    setSelectedLevel,
    error,
    setError,
    isLoading,
    saveProgram,
    setActiveTab,
    onStartMacrocycle,
    onStartMesocycle,
    onStartMicrocycle
}) => {
    // Add error boundary and loading check
    if (!selectedLevel && !context) {
        return <LevelSelectionStep
            onBack={onBack}
            setSelectedLevel={setSelectedLevel}
            setActiveTab={setActiveTab}
            onStartMacrocycle={onStartMacrocycle}
            onStartMesocycle={onStartMesocycle}
            onStartMicrocycle={onStartMicrocycle}
        />;
    }

    const currentLevel = selectedLevel || context;    // Try advanced builder first, fallback to simple if it fails
    return (
        <ErrorBoundary onBack={onBack}>
            {(() => {
                try {
                    return (
                        <MacrocycleBuilderProvider>
                            <UnifiedAdvancedBuilder
                                onBack={onBack}
                                selectedLevel={currentLevel}
                                programData={programData}
                                setProgramData={setProgramData}
                            />
                        </MacrocycleBuilderProvider>
                    );
                } catch (error) {
                    console.error('Advanced builder failed, using simple fallback:', error);

                    // Fallback to simple builder
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
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-400">ℹ️</span>
                                    <span className="text-blue-300 font-medium">Simple Builder Mode</span>
                                </div>
                                <p className="text-blue-200 text-sm mt-1">
                                    Using simplified interface. Advanced features will be available soon.
                                </p>
                            </div>

                            <SimpleProgramDetailsForm selectedLevel={currentLevel} onBack={onBack} />
                        </div>
                    );
                }
            })()}
        </ErrorBoundary>
    );
};

// Sample blocks palette for macro level (kept for reference)
const blocksPalette = [
    {
        id: 'accumulation',
        name: 'Accumulation',
        type: 'hypertrophy',
        color: 'blue',
        load: '55-70%',
        methods: 'Volume accumulation, MEV→MRV progression'
    },
    {
        id: 'intensification',
        name: 'Intensification',
        type: 'strength',
        color: 'orange',
        load: '70-85%',
        methods: 'Intensity focus, strength building'
    },
    {
        id: 'realization',
        name: 'Realization',
        type: 'power',
        color: 'red',
        load: '85-95%',
        methods: 'Peak performance, skill refinement'
    },
    {
        id: 'deload',
        name: 'Deload',
        type: 'recovery',
        color: 'green',
        load: '40-60%',
        methods: 'Recovery, mobility, restoration'
    }
];

// DraggableBlock Component
const DraggableBlock = memo(({ block, isSelected, onSelect }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'block',
        item: block,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const colorClasses = {
        blue: 'border-blue-500 bg-blue-900/20 text-blue-200',
        orange: 'border-orange-500 bg-orange-900/20 text-orange-200',
        red: 'border-red-500 bg-red-900/20 text-red-200',
        green: 'border-green-500 bg-green-900/20 text-green-200'
    };

    return (
        <div
            ref={drag}
            onClick={() => onSelect(block)}
            className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected
                    ? colorClasses[block.color] || 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }
                ${isDragging ? 'opacity-50 shadow-lg z-50' : ''}
            `}
        >
            <div className={`w-4 h-4 rounded-full bg-${block.color}-500 mb-2`}></div>
            <h4 className="text-white font-medium">{block.name}</h4>
            <p className="text-gray-400 text-sm">{block.type}</p>
            <p className="text-gray-500 text-xs mt-1">{block.load}</p>
        </div>
    );
});

// Custom Calendar Component with Drop Zone
const CustomCalendar = ({ events, onEventDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'block',
        drop: (item, monitor) => {
            const offset = monitor.getDropResult();
            onEventDrop(item, offset);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const eventStyleGetter = (event) => {
        const colorMap = {
            blue: { backgroundColor: '#3b82f6', borderColor: '#1d4ed8' },
            orange: { backgroundColor: '#f97316', borderColor: '#ea580c' },
            red: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
            green: { backgroundColor: '#10b981', borderColor: '#059669' }
        };

        return {
            style: {
                ...colorMap[event.color] || colorMap.blue,
                border: `2px solid ${colorMap[event.color]?.borderColor || '#1d4ed8'}`,
                borderRadius: '6px',
                color: 'white',
                fontWeight: '500'
            }
        };
    };

    return (
        <div
            ref={drop}
            className={`
                h-[500px] lg:h-[600px] rounded-lg border-2 p-4 transition-colors
                ${isOver ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600 bg-gray-800'}
            `}
        >
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                view="month"
                onView={() => { }}
                style={{ height: '100%' }}
                className="custom-calendar"
            />
        </div>
    );
};

// Timeline Step Component - Enhanced for macro cycle planning with methodology-based blocks
const TimelineStep = ({ selectedLevel = 'macro' }) => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [localEvents, setLocalEvents] = useState([]);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
    const [methodology, setMethodology] = useState('Triphasic'); // Mock context, replace with useContext

    // Methodology-based block definitions with auto-fill parameters
    const methodologyDefaults = {
        Triphasic: {
            Eccentric: {
                load: '80-90%',
                time: '4 weeks',
                methods: 'Slow eccentrics + French Contrast',
                color: 'blue'
            },
            Isometric: {
                load: '75-85%',
                time: '4 weeks',
                methods: 'Isometric holds + Cluster sets',
                color: 'green'
            },
            Concentric: {
                load: '70-80%',
                time: '4 weeks',
                methods: 'Speed work + Plyometrics',
                color: 'orange'
            },
            Accumulation: {
                load: '55-80%',
                time: '6 weeks',
                methods: 'Volume accumulation + MEV progression',
                color: 'purple'
            },
            Intensification: {
                load: '75-90%',
                time: '3 weeks',
                methods: 'Intensity focus + Strength building',
                color: 'red'
            }
        },
        Block: {
            Accumulation: {
                load: '55-70%',
                time: '4 weeks',
                methods: 'Volume accumulation, MEV→MRV progression',
                color: 'blue'
            },
            Intensification: {
                load: '70-85%',
                time: '4 weeks',
                methods: 'Intensity focus, strength building',
                color: 'orange'
            },
            Realization: {
                load: '85-95%',
                time: '4 weeks',
                methods: 'Peak performance, skill refinement',
                color: 'red'
            },
            Deload: {
                load: '40-60%',
                time: '1 week',
                methods: 'Recovery, mobility, restoration',
                color: 'green'
            }
        }
    };

    // Get blocks based on current methodology
    const getMethodologyBlocks = (methodologyType) => {
        const defaults = methodologyDefaults[methodologyType] || methodologyDefaults.Triphasic;
        return Object.entries(defaults).map(([key, value]) => ({
            id: key.toLowerCase(),
            name: key,
            type: key.toLowerCase(),
            ...value
        }));
    };

    const currentBlocks = getMethodologyBlocks(methodology);

    // Handle drag and drop from sidebar to calendar
    const handleBlockDrop = useCallback((block, dropInfo = {}) => {
        const startDate = dropInfo.start || new Date();
        const endDate = new Date(startDate);

        // Default 4-week span for macrocycle blocks
        endDate.setDate(startDate.getDate() + 28);

        const newEvent = {
            id: `${block.id}-${Date.now()}`,
            title: block.name,
            start: startDate,
            end: endDate,
            resource: {
                load: block.load,
                time: block.time,
                methods: block.methods
            },
            bgColor: block.color
        };

        setLocalEvents(prev => [...prev, newEvent]);
        setCalendarEvents(prev => [...prev, newEvent]);
        toast.success(`${block.name} block added to timeline!`);
    }, []);

    // Handle event resize/move on calendar
    const handleEventChange = useCallback(({ event, start, end }) => {
        const updatedEvents = localEvents.map(evt =>
            evt.id === event.id
                ? { ...evt, start, end }
                : evt
        );
        setLocalEvents(updatedEvents);
        setCalendarEvents(updatedEvents);
    }, [localEvents]);

    // Remove event from calendar
    const removeEvent = useCallback((eventId) => {
        setLocalEvents(prev => prev.filter(event => event.id !== eventId));
        setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
        toast.info('Block removed from timeline');
    }, []);

    // Enhanced Table View Component
    const TableView = () => (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Block</th>
                            <th className="px-6 py-3">Load</th>
                            <th className="px-6 py-3">Time/Weeks</th>
                            <th className="px-6 py-3">Methods</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localEvents.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No blocks scheduled yet. Drag blocks from the palette to the calendar.
                                </td>
                            </tr>
                        ) : (
                            localEvents
                                .sort((a, b) => new Date(a.start) - new Date(b.start))
                                .map((event) => (
                                    <tr key={event.id} className="bg-gray-800 border-b border-gray-700">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full bg-${event.bgColor}-500`}></div>
                                                <span className="text-white font-medium">{event.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{event.resource?.load}</td>
                                        <td className="px-6 py-4 text-gray-300">{event.resource?.time}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                                            {event.resource?.methods}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => removeEvent(event.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Enhanced Calendar with DndKit integration
    const EnhancedCalendar = () => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: 'methodology-block',
            drop: (item, monitor) => {
                const clientOffset = monitor.getClientOffset();
                // Get approximate date from drop position (simplified)
                const dropDate = new Date(); // In real implementation, calculate from clientOffset
                handleBlockDrop(item, { start: dropDate });
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        const eventStyleGetter = (event) => {
            const colorMap = {
                blue: { backgroundColor: '#3b82f6', borderColor: '#1d4ed8' },
                orange: { backgroundColor: '#f97316', borderColor: '#ea580c' },
                red: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
                green: { backgroundColor: '#10b981', borderColor: '#059669' },
                purple: { backgroundColor: '#8b5cf6', borderColor: '#7c3aed' }
            };

            return {
                style: {
                    ...colorMap[event.bgColor] || colorMap.blue,
                    border: `2px solid ${colorMap[event.bgColor]?.borderColor || '#1d4ed8'}`,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: '500'
                }
            };
        };

        return (
            <div
                ref={drop}
                className={`
                    h-[600px] rounded-lg border-2 p-4 transition-colors
                    ${isOver ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600 bg-gray-800'}
                `}
            >
                <DnDCalendar
                    localizer={localizer}
                    events={localEvents}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    onEventDrop={handleEventChange}
                    onEventResize={handleEventChange}
                    resizable
                    view="month"
                    style={{ height: '100%' }}
                    className="custom-calendar text-white"
                />
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <DndContext>
                <div className="space-y-6">
                    {/* Header with methodology selector and view toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Macrocycle Timeline Planning</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <label className="text-gray-400 text-sm">Methodology:</label>
                                <select
                                    value={methodology}
                                    onChange={(e) => setMethodology(e.target.value)}
                                    className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                                >
                                    <option value="Triphasic">Triphasic</option>
                                    <option value="Block">Block Periodization</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'calendar'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                                <span>Calendar</span>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'table'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <Table className="w-4 h-4" />
                                <span>Table</span>
                            </button>
                        </div>
                    </div>

                    {/* Main layout with sidebar and calendar/table */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Sidebar palette (20% width on desktop) */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-4">
                                <h4 className="text-white font-medium mb-4">Training Blocks</h4>
                                <div className="space-y-3">
                                    {currentBlocks.map((block) => (
                                        <DraggableMethodologyBlock
                                            key={block.id}
                                            block={block}
                                            onSelect={() => handleBlockDrop(block)}
                                        />
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-300 text-xs">
                                        💡 Drag blocks to the calendar to build your annual training sequence
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main content area (80% width on desktop) */}
                        <div className="lg:col-span-4">
                            {viewMode === 'calendar' ? <EnhancedCalendar /> : <TableView />}
                        </div>
                    </div>

                    {/* Timeline Summary */}
                    {localEvents.length > 0 && (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h4 className="text-white font-medium mb-3">Timeline Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                                {currentBlocks.map(blockType => {
                                    const count = localEvents.filter(event =>
                                        event.title.toLowerCase() === blockType.name.toLowerCase()
                                    ).length;
                                    return (
                                        <div key={blockType.id} className="bg-gray-700 rounded-lg p-3">
                                            <div className={`w-6 h-6 rounded-full bg-${blockType.color}-500 mx-auto mb-2`}></div>
                                            <div className="text-white font-medium">{count}</div>
                                            <div className="text-gray-400 text-xs">{blockType.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </DndContext>
        </DndProvider>
    );
};

// Enhanced DraggableBlock Component for methodology-based blocks
const DraggableMethodologyBlock = memo(({ block, onSelect }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'methodology-block',
        item: block,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const colorClasses = {
        blue: 'border-blue-500 bg-blue-900/20 text-blue-200',
        orange: 'border-orange-500 bg-orange-900/20 text-orange-200',
        red: 'border-red-500 bg-red-900/20 text-red-200',
        green: 'border-green-500 bg-green-900/20 text-green-200',
        purple: 'border-purple-500 bg-purple-900/20 text-purple-200'
    };

    return (
        <div
            ref={drag}
            onClick={onSelect}
            className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${colorClasses[block.color] || 'border-blue-500 bg-blue-900/20'}
                ${isDragging ? 'opacity-50 shadow-lg z-50' : ''}
                hover:scale-105
            `}
        >
            <div className={`w-4 h-4 rounded-full bg-${block.color}-500 mb-2`}></div>
            <h4 className="text-white font-medium text-sm">{block.name}</h4>
            <p className="text-gray-400 text-xs">{block.load}</p>
            <p className="text-gray-500 text-xs mt-1">{block.time}</p>
        </div>
    );
});

export default ContextAwareBuilder;
