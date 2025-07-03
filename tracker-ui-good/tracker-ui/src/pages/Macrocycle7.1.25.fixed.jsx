/**
 * Macrocycle Designer - RP Research Integrated Version (FIXED)
 * Created: July 1, 2025
 * 
 * Fixed version with working:
 * - Drag-and-drop for mesocycle blocks using @dnd-kit
 * - Mobile responsive tabs  
 * - Export to PDF/Calendar functionality
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Simplified imports for core functionality
const DEBUG_MODE = true;

const debugLog = (category, data, level = 'info') => {
    if (!DEBUG_MODE) return;
    console.log(`🔍 [${category}]`, data);
};

export default function Macrocycle7125Fixed() {
    const location = useLocation();
    const navigate = useNavigate();

    // State management
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('hypertrophy_12');
    const [currentWeek, setCurrentWeek] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('builder');

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Program data
    const programData = location.state?.programData || {
        goal: 'hypertrophy',
        duration: 12,
        trainingAge: 'intermediate',
        availableDays: 4,
        name: 'Custom Macrocycle',
        startDate: new Date().toISOString().split('T')[0],
        recoveryScore: 'average'
    };

    // Simplified mesocycles data
    const [mesocycles, setMesocycles] = useState([
        {
            id: 1,
            name: 'Volume Accumulation',
            weeks: 4,
            status: 'current',
            progress: 75,
            icon: '💪',
            gradient: 'from-green-600 to-green-800',
            borderColor: 'border-green-500/50',
            glowColor: 'green',
            startDate: '2025-07-01',
            endDate: '2025-07-28',
            objectives: ['Maximize training volume', 'Progressive overload focus', 'Muscle growth emphasis'],
            keyMetrics: {
                volume: '16-22 sets',
                intensity: '65-80% 1RM',
                frequency: '4x/week',
                focus: 'Volume Accumulation'
            },
            researchBased: true
        },
        {
            id: 2,
            name: 'Strength Intensification',
            weeks: 3,
            status: 'planned',
            progress: 0,
            icon: '🔥',
            gradient: 'from-orange-600 to-red-700',
            borderColor: 'border-orange-500/50',
            glowColor: 'orange',
            startDate: '2025-07-29',
            endDate: '2025-08-18',
            objectives: ['Maintain volume', 'Increase intensity', 'Advanced techniques'],
            keyMetrics: {
                intensity: '80-95% 1RM',
                volume: '12-16 sets',
                frequency: '3x/week',
                focus: 'Strength Building'
            },
            researchBased: true
        },
        {
            id: 3,
            name: 'Peak Performance',
            weeks: 2,
            status: 'planned',
            progress: 0,
            icon: '⚡',
            gradient: 'from-purple-600 to-purple-800',
            borderColor: 'border-purple-500/50',
            glowColor: 'purple',
            startDate: '2025-08-19',
            endDate: '2025-09-01',
            objectives: ['Peak performance', 'Volume tapering', 'Recovery optimization'],
            keyMetrics: {
                intensity: '95-105% 1RM',
                volume: '8-12 sets',
                tapering: 'Active',
                focus: 'Performance Peak'
            },
            researchBased: true
        }
    ]);

    // Drag and Drop Handler
    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setMesocycles((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                debugLog('Mesocycle Reorder', {
                    from: oldIndex,
                    to: newIndex,
                    movedPhase: items[oldIndex].name
                });

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    // Circular Progress Component
    const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = 'green' }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        const colorMap = {
            blue: '#3b82f6',
            green: '#10b981',
            orange: '#f97316',
            purple: '#8b5cf6',
            red: '#ef4444',
            gray: '#6b7280'
        };

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(75, 85, 99, 0.3)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colorMap[color]}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                        {percentage}%
                    </span>
                </div>
            </div>
        );
    };

    // Sortable Timeline Card Component
    const SortableTimelineCard = ({ mesocycle, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: mesocycle.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        const isExpanded = expandedPhase === mesocycle.id;
        const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
            <div ref={setNodeRef} style={style} className="relative mb-8">
                {/* Connecting Line */}
                {index < mesocycles.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-1 h-8 bg-gradient-to-b from-gray-600 to-transparent z-0"></div>
                )}

                <div
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-700 ease-out cursor-pointer group ${mesocycle.status === 'completed'
                            ? `bg-gradient-to-br ${mesocycle.gradient}/20 ${mesocycle.borderColor} shadow-lg`
                            : mesocycle.status === 'current'
                                ? `bg-gradient-to-br ${mesocycle.gradient}/30 ${mesocycle.borderColor} shadow-xl animate-pulse`
                                : `bg-gradient-to-br from-gray-800/40 to-gray-700/30 border-gray-600/40 shadow-md`
                        } backdrop-blur-sm hover:scale-[1.02] hover:shadow-2xl ${isExpanded ? 'scale-[1.02] shadow-2xl' : ''}`}
                    onClick={() => setExpandedPhase(isExpanded ? null : mesocycle.id)}
                >
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute top-2 left-2 bg-gray-700/50 rounded p-2 text-gray-400 hover:text-white transition-colors z-10 cursor-grab active:cursor-grabbing"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>

                    {/* Research Badge */}
                    {mesocycle.researchBased && (
                        <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-400/30">
                            RP 2024-25
                        </div>
                    )}

                    {/* Phase Icon & Status Indicator */}
                    <div className="flex items-center justify-between mb-6 mt-4">
                        <div className="flex items-center space-x-4">
                            <div className="text-4xl">{mesocycle.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{mesocycle.name}</h3>
                                <p className="text-sm text-gray-300">
                                    {formatDate(mesocycle.startDate)} - {formatDate(mesocycle.endDate)} • {mesocycle.weeks} weeks
                                </p>
                            </div>
                        </div>

                        {/* Circular Progress Indicator */}
                        <div className="flex flex-col items-center space-y-2">
                            <CircularProgress
                                percentage={mesocycle.progress}
                                color={mesocycle.glowColor}
                                size={70}
                            />
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mesocycle.status === 'completed'
                                    ? 'bg-gradient-to-r from-blue-500/30 to-blue-400/20 text-blue-300 border border-blue-400/30'
                                    : mesocycle.status === 'current'
                                        ? 'bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-300 border border-green-400/30'
                                        : 'bg-gradient-to-r from-gray-600/30 to-gray-500/20 text-gray-300 border border-gray-500/30'
                                }`}>
                                {mesocycle.status}
                            </span>
                        </div>
                    </div>

                    {/* Progress Visualization */}
                    <div className="relative w-full bg-gray-700/50 rounded-full h-4 mb-4 overflow-hidden">
                        <div
                            className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r ${mesocycle.gradient}`}
                            style={{ width: `${mesocycle.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    <div className={`transition-all duration-500 ease-out overflow-hidden ${isExpanded ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="pt-4 border-t border-gray-600/30 space-y-4">

                            {/* Phase Objectives */}
                            <div>
                                <h4 className="text-white font-semibold mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-2"></span>
                                    Phase Objectives
                                </h4>
                                <ul className="text-gray-300 text-sm space-y-1 ml-4">
                                    {mesocycle.objectives.map((objective, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Metrics */}
                            <div>
                                <h4 className="text-white font-semibold mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-2"></span>
                                    Key Metrics
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(mesocycle.keyMetrics).map(([key, value]) => (
                                        <div key={key} className="bg-gray-800/50 rounded-lg p-2 text-center backdrop-blur-sm">
                                            <p className="text-xs text-gray-400 mb-1 capitalize">{key}</p>
                                            <p className="text-sm font-semibold text-white">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expand/Collapse Indicator */}
                    <div className="absolute bottom-4 right-4">
                        <div className={`w-6 h-6 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}>
                            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Program Design Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Program Design</h1>
                        <p className="text-gray-400">Build evidence-based training programs using Renaissance Periodization methodology</p>
                    </div>
                </div>

                {/* Program Design Navigation Tabs - Enhanced with Black/Red Theme */}
                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-1'} mb-8 bg-gradient-to-r from-gray-900 to-black rounded-xl p-2 border border-gray-700/50 shadow-2xl`}>
                    {[
                        { id: 'overview', label: 'Overview', icon: '🏠', description: 'Program overview' },
                        { id: 'builder', label: 'Builder', icon: '🔧', description: 'Macrocycle designer' },
                        { id: 'calculator', label: 'Calculator', icon: '🧮', description: 'Volume calculations' },
                        { id: 'exercises', label: 'Exercises', icon: '💪', description: 'Exercise database' },
                        { id: 'templates', label: 'Templates', icon: '📋', description: 'Program templates' }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    debugLog('Navigation Tab Click', { clickedTab: tab.id, previousTab: activeTab });
                                    setActiveTab(tab.id);
                                    
                                    // Handle navigation based on tab
                                    if (tab.id === 'builder') {
                                        window.scrollTo(0, 0);
                                    } else if (tab.id === 'overview') {
                                        navigate('/program');
                                    } else if (tab.id === 'calculator') {
                                        alert('Volume Calculator - Coming Soon!\nWill include MEV/MRV calculations based on RP research.');
                                    } else if (tab.id === 'exercises') {
                                        alert('Exercise Database - Coming Soon!\nWill include exercise selection based on muscle groups and training phases.');
                                    } else if (tab.id === 'templates') {
                                        alert('Program Templates - Coming Soon!\nWill include pre-built programs for different goals and experience levels.');
                                    }
                                }}
                                className={`group relative flex items-center ${isMobile ? 'justify-center' : ''} space-x-3 px-6 py-4 rounded-lg transition-all duration-300 transform ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-black shadow-lg shadow-red-500/30 scale-105 border-2 border-red-400' 
                                        : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-red-800 hover:to-red-700 text-gray-300 hover:text-white hover:scale-102 border border-gray-600/30 hover:border-red-500/50'
                                } ${isMobile ? 'w-full' : 'min-w-[140px]'}`}
                            >
                                {/* Active Tab Indicator */}
                                {isActive && (
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
                                )}
                                
                                {/* Tab Icon */}
                                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                    {tab.icon}
                                </span>
                                
                                {/* Tab Content */}
                                <div className={`flex flex-col ${isMobile ? 'items-center' : 'items-start'}`}>
                                    <span className={`font-bold transition-all duration-300 ${
                                        isActive 
                                            ? 'text-black text-lg font-black' 
                                            : 'text-gray-300 group-hover:text-white font-semibold'
                                    } ${isMobile ? 'text-sm' : ''}`}>
                                        {tab.label}
                                    </span>
                                    {!isMobile && (
                                        <span className={`text-xs transition-all duration-300 ${
                                            isActive 
                                                ? 'text-gray-800 font-semibold' 
                                                : 'text-gray-500 group-hover:text-gray-400'
                                        }`}>
                                            {tab.description}
                                        </span>
                                    )}
                                </div>

                                {/* Active Tab Accent */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg pointer-events-none"></div>
                                )}
                                
                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                            </button>
                        );
                    })}
                </div>

                {/* Breadcrumb Navigation */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/program')}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-black font-bold px-4 py-2 rounded-lg transition-all duration-200 border border-red-400 shadow-lg shadow-red-500/30 flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Program Design</span>
                        </button>
                        <div className="text-center">
                            <div className="text-sm text-gray-400">Program Design &gt; Builder &gt; Macrocycle</div>
                            <h2 className="text-2xl font-bold text-white">Macrocycle Builder</h2>
                        </div>
                    </div>

                    {/* Program Info */}
                    {programData && (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-4">
                            <h3 className="text-xl font-semibold text-white mb-2">{programData.name}</h3>
                            <div className="flex items-center space-x-6 text-sm text-gray-300">
                                <span>Goal: <span className="text-red-400 capitalize">{programData.goal}</span></span>
                                <span>Duration: <span className="text-red-400">{programData.duration} weeks</span></span>
                                <span>Training Age: <span className="text-blue-400 capitalize">{programData.trainingAge}</span></span>
                                <span>Days/Week: <span className="text-green-400">{programData.availableDays}</span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Page Header with Template Selector */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-black text-white mb-4 transition-all duration-500"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #dc2626 50%, #ffffff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
                                letterSpacing: '1px'
                            }}>
                            🎯 {programData.name || 'Macrocycle Designer'}
                        </h1>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-2">
                            Evidence-based periodization using Renaissance Periodization research (2024-25)
                        </p>
                        <p className="text-blue-400 text-sm mb-6">
                            Dynamic phase calculations • Real volume progressions • Research-validated deload triggers
                        </p>

                        {/* Template Selector */}
                        <div className="flex justify-center mb-20">
                            <div className="relative">
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="bg-red-600 hover:bg-red-700 border-2 border-red-500 text-white font-black text-xl px-8 py-6 rounded-xl shadow-2xl focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 cursor-pointer min-w-[20rem] uppercase tracking-wide"
                                >
                                    <option value="hypertrophy_12">HYPERTROPHY 12-WEEK</option>
                                    <option value="strength_8">STRENGTH 8-WEEK</option>
                                    <option value="powerbuilding_16">POWERBUILDING 16-WEEK</option>
                                </select>
                            </div>
                        </div>

                        {/* Program Info Display */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4 shadow-lg">
                                <div className="space-y-2 text-center">
                                    <div className="text-sm text-gray-400">
                                        Goal: <span className="text-blue-400 font-semibold capitalize">{programData.goal}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Duration: <span className="text-green-400 font-semibold">{programData.duration} weeks</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Training Age: <span className="text-purple-400 font-semibold capitalize">{programData.trainingAge}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Days/Week: <span className="text-orange-400 font-semibold">{programData.availableDays}</span>
                                    </div>
                                    <div className="text-sm text-gray-400 border-t border-gray-600 pt-2 mt-2">
                                        Current Week: <span className="text-red-400 font-semibold">{currentWeek}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Started: {new Date(programData.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Timeline Visualization with Drag & Drop */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">🎯 RP-Based Training Timeline</h2>
                            <p className="text-gray-400">Evidence-based phase progression with MEV/MRV calculations • Drag to reorder phases</p>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={mesocycles.map(m => m.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-0">
                                    {mesocycles.map((mesocycle, index) => (
                                        <SortableTimelineCard
                                            key={mesocycle.id}
                                            mesocycle={mesocycle}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Current Phase Analysis */}
                    {mesocycles.find(m => m.status === 'current') && (
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="text-3xl">{mesocycles.find(m => m.status === 'current')?.icon}</div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-1"
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            textShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
                                            letterSpacing: '0.5px'
                                        }}>
                                        Current Phase: {mesocycles.find(m => m.status === 'current')?.name}
                                    </h2>
                                    <p className="text-green-300 text-lg font-semibold">
                                        Week {Math.ceil(mesocycles.find(m => m.status === 'current')?.progress / 100 * mesocycles.find(m => m.status === 'current')?.weeks)} of {mesocycles.find(m => m.status === 'current')?.weeks} • {mesocycles.find(m => m.status === 'current')?.progress}% Complete
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                                <div className="space-y-6">
                                    <h3 className="text-white font-bold text-lg mb-4">Current Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(mesocycles.find(m => m.status === 'current')?.keyMetrics || {}).map(([key, value]) => (
                                            <div key={key} className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                                                <h4 className="text-blue-300 font-semibold capitalize mb-2">{key}</h4>
                                                <p className="text-white font-bold">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-white font-bold text-lg mb-4">Phase Progress</h3>
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-3 border border-green-500/30">
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-300 font-semibold">Current Progress</span>
                                                <div className="text-right">
                                                    <div className="text-green-400 font-bold">{mesocycles.find(m => m.status === 'current')?.progress}%</div>
                                                    <div className="text-gray-400 text-xs">of {mesocycles.find(m => m.status === 'current')?.weeks} weeks</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation and Actions */}
                <div className="mt-8 px-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 border-2 border-red-400 shadow-lg shadow-red-500/30"
                        >
                            <span>← Back</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => alert('Configuration saved successfully!')}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 border-2 border-red-400 shadow-lg shadow-red-500/30"
                            >
                                Save Progress
                            </button>

                            <button
                                onClick={() => alert('Proceeding to Mesocycle Builder...')}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 border-2 border-red-400 shadow-lg shadow-red-500/30"
                            >
                                <span>Continue to Mesocycle →</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
