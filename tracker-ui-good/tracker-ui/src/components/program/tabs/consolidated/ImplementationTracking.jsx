import React, { useState, useEffect } from 'react';
import {
    PlayCircle,
    TrendingUp,
    CheckCircle,
    Clock,
    Activity,
    Target,
    BarChart3,
    Settings,
    AlertCircle,
    Download,
    Upload,
    Eye,
    Calendar,
    Zap,
    Heart,
    Trophy
} from 'lucide-react';

/**
 * ImplementationTracking.jsx - Enhanced Final Tab
 * 
 * Comprehensive implementation and tracking functionality:
 * - Program Generation & Export
 * - Session Tracking & Logging
 * - Progress Monitoring & Analytics
 * - Autoregulation & Adjustments
 * - Performance Analysis
 */

const ImplementationTracking = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    // State for program implementation
    const [implementation, setImplementation] = useState({
        programGenerated: false,
        currentWeek: 1,
        totalWeeks: 12,
        sessionData: [],
        progressMetrics: {
            volumeCompliance: 0,
            intensityAccuracy: 0,
            adherence: 0,
            progressRate: 0
        },
        autoregulation: {
            enabled: true,
            adjustments: [],
            triggers: {
                rpeThreshold: 8.5,
                volumeReduction: 0.8,
                intensityReduction: 0.9
            }
        }
    });

    const [activeSubTab, setActiveSubTab] = useState('generation');
    const [selectedWeek, setSelectedWeek] = useState(1);

    // Mock session data for demonstration
    const mockSessions = [
        {
            id: 1,
            week: 1,
            day: 1,
            date: new Date(),
            planned: {
                exercises: ['Squat', 'Bench Press', 'Row'],
                volume: 15,
                intensity: 75,
                duration: 60
            },
            completed: {
                exercises: ['Squat', 'Bench Press', 'Row'],
                volume: 14,
                intensity: 73,
                duration: 65,
                rpe: 7.5
            }
        }
    ];

    // Program generation templates
    const programTemplates = {
        'powerlifting': {
            name: 'Powerlifting Focus',
            description: 'Competition powerlifting program',
            structure: '4 days/week, competition lifts focus',
            expectedOutcomes: ['Increased 1RM', 'Competition preparation', 'Technical mastery']
        },
        'hypertrophy': {
            name: 'Hypertrophy Focus',
            description: 'Muscle building program',
            structure: '5-6 days/week, high volume',
            expectedOutcomes: ['Muscle mass gain', 'Improved physique', 'Metabolic adaptation']
        },
        'general-fitness': {
            name: 'General Fitness',
            description: 'Balanced fitness development',
            structure: '3-4 days/week, varied training',
            expectedOutcomes: ['Overall fitness', 'Health improvement', 'Movement quality']
        },
        'athletic-performance': {
            name: 'Athletic Performance',
            description: 'Sport-specific development',
            structure: '4-5 days/week, power/speed focus',
            expectedOutcomes: ['Power development', 'Speed improvement', 'Sport transfer']
        }
    };

    // Key performance indicators
    const kpis = [
        {
            key: 'adherence',
            name: 'Training Adherence',
            current: 85,
            target: 90,
            unit: '%',
            trend: 'up',
            description: 'Percentage of planned sessions completed'
        },
        {
            key: 'volume',
            name: 'Volume Compliance',
            current: 92,
            target: 95,
            unit: '%',
            trend: 'stable',
            description: 'Actual vs planned training volume'
        },
        {
            key: 'intensity',
            name: 'Intensity Accuracy',
            current: 88,
            target: 90,
            unit: '%',
            trend: 'up',
            description: 'Actual vs planned training intensity'
        },
        {
            key: 'progress',
            name: 'Progress Rate',
            current: 15,
            target: 12,
            unit: '%/month',
            trend: 'up',
            description: 'Rate of strength/performance improvement'
        }
    ];

    // Autoregulation rules
    const autoregulationRules = [
        {
            condition: 'RPE > 8.5 for 2+ consecutive sessions',
            action: 'Reduce volume by 20%',
            active: true
        },
        {
            condition: 'Sleep quality < 6 for 3+ days',
            action: 'Implement deload week',
            active: true
        },
        {
            condition: 'Missed 2+ sessions in week',
            action: 'Extend current phase by 1 week',
            active: false
        },
        {
            condition: 'Performance plateau for 2+ weeks',
            action: 'Switch exercise variations',
            active: true
        }
    ];

    useEffect(() => {
        // Initialize with mock data
        setImplementation(prev => ({
            ...prev,
            sessionData: mockSessions,
            progressMetrics: {
                volumeCompliance: 92,
                intensityAccuracy: 88,
                adherence: 85,
                progressRate: 15
            }
        }));
    }, []);

    const generateProgram = async (templateKey) => {
        // Simulate program generation
        setImplementation(prev => ({
            ...prev,
            programGenerated: true,
            programType: templateKey
        }));

        // Would integrate with all previous tab data to generate comprehensive program
        console.log('Generating program with template:', templateKey);
    };

    const exportProgram = (format) => {
        const programData = {
            template: implementation.programType,
            weeks: implementation.totalWeeks,
            generatedAt: new Date(),
            // Would include all configured data from previous tabs
        };

        console.log(`Exporting program as ${format}:`, programData);
        // Would trigger actual file download
    };

    const logSession = (sessionData) => {
        setImplementation(prev => ({
            ...prev,
            sessionData: [...prev.sessionData, sessionData]
        }));
    };

    const renderProgramGeneration = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Program Generation & Export
                </h3>

                {!implementation.programGenerated ? (
                    <div>
                        <div className="mb-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                            <h4 className="font-medium text-blue-300 mb-2">Ready to Generate Your Program</h4>
                            <p className="text-blue-200 text-sm">
                                Based on your configuration from previous tabs, we'll generate a complete, personalized training program.
                            </p>
                        </div>

                        {/* Template Selection */}
                        <div className="mb-6">
                            <h4 className="font-medium text-white mb-3">Select Program Template</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(programTemplates).map(([key, template]) => (
                                    <div
                                        key={key}
                                        className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                                        onClick={() => generateProgram(key)}
                                    >
                                        <h5 className="font-medium text-white mb-2">{template.name}</h5>
                                        <p className="text-sm text-gray-300 mb-2">{template.description}</p>
                                        <div className="text-xs text-gray-400 mb-2">{template.structure}</div>
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500">Expected Outcomes:</div>
                                            {template.expectedOutcomes.map((outcome, index) => (
                                                <div key={index} className="text-xs text-green-400">• {outcome}</div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                            Generate Program
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 bg-green-900/20 border border-green-500 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <h4 className="font-medium text-green-300">Program Generated Successfully!</h4>
                            </div>
                            <p className="text-green-200 text-sm">
                                Your personalized {programTemplates[implementation.programType]?.name} program is ready.
                            </p>
                        </div>

                        {/* Program Summary */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">{implementation.totalWeeks}</div>
                                <div className="text-sm text-gray-400">Total Weeks</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">4</div>
                                <div className="text-sm text-gray-400">Sessions/Week</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">48</div>
                                <div className="text-sm text-gray-400">Total Sessions</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">3</div>
                                <div className="text-sm text-gray-400">Phases</div>
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export Program
                            </h4>
                            <div className="grid md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => exportProgram('pdf')}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    PDF
                                </button>
                                <button
                                    onClick={() => exportProgram('excel')}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Excel
                                </button>
                                <button
                                    onClick={() => exportProgram('csv')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    CSV
                                </button>
                                <button
                                    onClick={() => exportProgram('json')}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    JSON
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSessionTracking = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Session Tracking & Logging
                </h3>

                {/* Week Selector */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">Training Week</h4>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                                disabled={selectedWeek === 1}
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-white font-medium">Week {selectedWeek} of {implementation.totalWeeks}</span>
                            <button
                                onClick={() => setSelectedWeek(Math.min(implementation.totalWeeks, selectedWeek + 1))}
                                disabled={selectedWeek === implementation.totalWeeks}
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Progress bar for week */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(selectedWeek / implementation.totalWeeks) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Session Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, index) => (
                        <div key={day} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">{day}</h5>
                                <span className={`w-3 h-3 rounded-full ${index < 2 ? 'bg-green-500' : // Completed
                                        index === 2 ? 'bg-yellow-500' : // Current
                                            'bg-gray-500' // Upcoming
                                    }`} />
                            </div>

                            <div className="text-sm text-gray-300 space-y-1">
                                <div>Upper Body Strength</div>
                                <div>60 min • 15 sets</div>
                                <div>75% intensity</div>
                            </div>

                            <button className="w-full mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                {index < 2 ? 'View Session' : index === 2 ? 'Start Session' : 'Preview'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Quick Log */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Quick Session Log</h4>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">RPE (1-10)</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.5"
                                placeholder="7.5"
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Duration (min)</label>
                            <input
                                type="number"
                                placeholder="60"
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Sets Completed</label>
                            <input
                                type="number"
                                placeholder="15"
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Avg Intensity (%)</label>
                            <input
                                type="number"
                                placeholder="75"
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                                Log Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProgressMonitoring = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Progress Monitoring & Analytics
                </h3>

                {/* KPI Dashboard */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {kpis.map((kpi) => (
                        <div key={kpi.key} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-300">{kpi.name}</div>
                                <div className={`text-xs px-1.5 py-0.5 rounded ${kpi.trend === 'up' ? 'bg-green-900 text-green-300' :
                                        kpi.trend === 'down' ? 'bg-red-900 text-red-300' :
                                            'bg-gray-600 text-gray-300'
                                    }`}>
                                    {kpi.trend}
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-1">
                                <div className="text-2xl font-bold text-white">{kpi.current}</div>
                                <div className="text-sm text-gray-400">{kpi.unit}</div>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">Target: {kpi.target}{kpi.unit}</div>
                            <div className="w-full bg-gray-600 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${kpi.current >= kpi.target ? 'bg-green-500' :
                                            kpi.current >= kpi.target * 0.8 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{kpi.description}</div>
                        </div>
                    ))}
                </div>

                {/* Progress Charts Placeholder */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Volume Progression</h4>
                        <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
                            <div className="text-gray-400 text-sm">Volume trend chart</div>
                        </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Strength Progression</h4>
                        <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
                            <div className="text-gray-400 text-sm">Strength trend chart</div>
                        </div>
                    </div>
                </div>

                {/* Weekly Summary */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">This Week's Summary</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-300 mb-1">Sessions Completed</div>
                            <div className="text-lg font-bold text-white">3 / 4</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-300 mb-1">Average RPE</div>
                            <div className="text-lg font-bold text-white">7.2</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-300 mb-1">Volume Compliance</div>
                            <div className="text-lg font-bold text-white">94%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAutoregulation = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Autoregulation & Smart Adjustments
                </h3>

                {/* Autoregulation Status */}
                <div className="mb-6 bg-green-900/20 border border-green-500 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="font-medium text-green-300">Autoregulation Active</h4>
                    </div>
                    <p className="text-green-200 text-sm">
                        The system is monitoring your training responses and will suggest adjustments when needed.
                    </p>
                </div>

                {/* Current Rules */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Active Autoregulation Rules</h4>
                    <div className="space-y-3">
                        {autoregulationRules.map((rule, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${rule.active ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-700 border-gray-600'
                                }`}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${rule.active ? 'text-blue-300' : 'text-gray-300'
                                        }`}>
                                        Rule {index + 1}
                                    </span>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={rule.active}
                                            onChange={() => {
                                                // Update rule active status
                                            }}
                                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-xs text-gray-400">Active</span>
                                    </label>
                                </div>
                                <div className="text-sm text-gray-300 mb-1">
                                    <strong>If:</strong> {rule.condition}
                                </div>
                                <div className="text-sm text-gray-300">
                                    <strong>Then:</strong> {rule.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Adjustments */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Recent Adjustments</h4>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-300 p-2 bg-yellow-900/20 border border-yellow-600 rounded">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-400" />
                                <span className="font-medium">2 days ago:</span>
                                Reduced volume by 15% due to elevated RPE
                            </div>
                        </div>
                        <div className="text-sm text-gray-300 p-2 bg-blue-900/20 border border-blue-600 rounded">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                                <span className="font-medium">1 week ago:</span>
                                Increased intensity by 5% based on progress rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Implementation & Tracking</h2>
                    <p className="text-gray-400">Generate your program and track progress with intelligent monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <div className="text-right">
                        <div className="text-sm font-medium text-white">Program Complete!</div>
                        <div className="text-xs text-gray-400">Ready for implementation</div>
                    </div>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                {[
                    { id: 'generation', label: 'Program Generation', icon: Settings },
                    { id: 'tracking', label: 'Session Tracking', icon: Activity },
                    { id: 'monitoring', label: 'Progress Analytics', icon: BarChart3 },
                    { id: 'autoregulation', label: 'Autoregulation', icon: Zap }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            {activeSubTab === 'generation' && renderProgramGeneration()}
            {activeSubTab === 'tracking' && renderSessionTracking()}
            {activeSubTab === 'monitoring' && renderProgressMonitoring()}
            {activeSubTab === 'autoregulation' && renderAutoregulation()}

            {/* Final Success Message */}
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                    <div>
                        <h3 className="text-xl font-bold text-green-300">Program Design Complete!</h3>
                        <p className="text-green-200">Your comprehensive training program is ready for implementation.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">5</div>
                        <div className="text-sm text-gray-300">Design Phases Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">100%</div>
                        <div className="text-sm text-gray-300">Configuration Complete</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">Ready</div>
                        <div className="text-sm text-gray-300">For Implementation</div>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        onClick={() => {
                            if (!implementation.programGenerated) {
                                setActiveSubTab('generation');
                            } else {
                                alert('Program implementation started! Begin with your first training session.');
                            }
                        }}
                    >
                        <PlayCircle className="h-5 w-5" />
                        {!implementation.programGenerated ? 'Generate Program' : 'Start Training Program'}
                    </button>
                </div>
            </div>

            {/* Navigation - Hide previous/next since this is the final step */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <Clock className="h-4 w-4" />
                            Previous: Periodization
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Program design journey complete! 🎉
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImplementationTracking;
