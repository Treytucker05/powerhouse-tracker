import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const Implementation = ({ onPrevious, canGoPrevious }) => {
    const [implementationPhase, setImplementationPhase] = useState('planning');
    const [programData, setProgramData] = useState({
        name: 'Periodized Training Program',
        duration: 16,
        currentWeek: 1,
        totalSessions: 64,
        completedSessions: 0
    });

    const [tapering, setTapering] = useState({
        enabled: true,
        startWeek: 14,
        volumeReduction: 50,
        intensityMaintenance: 90
    });

    const [evaluationMetrics, setEvaluationMetrics] = useState([
        { metric: '1RM Squat', baseline: 315, current: 315, target: 350, unit: 'lbs' },
        { metric: '1RM Bench Press', baseline: 225, current: 225, target: 250, unit: 'lbs' },
        { metric: '1RM Deadlift', baseline: 405, current: 405, target: 450, unit: 'lbs' },
        { metric: 'Body Weight', baseline: 180, current: 180, target: 185, unit: 'lbs' }
    ]);

    const implementationPhases = [
        {
            phase: 'planning',
            name: 'Final Planning',
            description: 'Review and finalize program details',
            tasks: [
                'Review all program phases',
                'Confirm exercise selections',
                'Schedule testing dates',
                'Prepare monitoring tools'
            ]
        },
        {
            phase: 'execution',
            name: 'Program Execution',
            description: 'Active training phase',
            tasks: [
                'Follow prescribed training',
                'Monitor daily readiness',
                'Track performance metrics',
                'Adjust loads as needed'
            ]
        },
        {
            phase: 'evaluation',
            name: 'Evaluation & Refinement',
            description: 'Assess results and plan next cycle',
            tasks: [
                'Conduct final testing',
                'Analyze performance gains',
                'Identify areas for improvement',
                'Plan next macrocycle'
            ]
        }
    ];

    const progressTracking = {
        volumeLoad: [
            { week: 1, load: 12500 },
            { week: 2, load: 13000 },
            { week: 3, load: 13500 },
            { week: 4, load: 10000 }, // Deload
            { week: 5, load: 14000 },
            { week: 6, load: 14500 },
            { week: 7, load: 15000 },
            { week: 8, load: 11000 }  // Deload
        ],
        rpeAverage: [
            { week: 1, rpe: 7.2 },
            { week: 2, rpe: 7.8 },
            { week: 3, rpe: 8.1 },
            { week: 4, rpe: 6.5 },
            { week: 5, rpe: 7.9 },
            { week: 6, rpe: 8.3 },
            { week: 7, rpe: 8.6 },
            { week: 8, rpe: 6.8 }
        ]
    };

    const adjustmentGuidelines = [
        {
            scenario: 'Performance Decline',
            indicators: ['Decreased velocity', 'Higher RPE for same loads', 'Poor recovery'],
            action: 'Reduce volume 20-30%, maintain intensity, add recovery day'
        },
        {
            scenario: 'Excessive Fatigue',
            indicators: ['Elevated RHR', 'Poor sleep', 'Low motivation'],
            action: 'Implement deload week, focus on sleep/nutrition'
        },
        {
            scenario: 'Plateau in Progress',
            indicators: ['No strength gains 2+ weeks', 'Same velocity/RPE'],
            action: 'Increase intensity 2.5-5%, vary exercises, check technique'
        },
        {
            scenario: 'Injury/Pain',
            indicators: ['Joint pain', 'Movement dysfunction', 'Compensation patterns'],
            action: 'Modify exercises, reduce ROM, seek professional assessment'
        }
    ];

    const exportProgram = () => {
        const programSummary = {
            name: programData.name,
            duration: programData.duration,
            phases: implementationPhases,
            tapering: tapering,
            metrics: evaluationMetrics,
            created: new Date().toISOString()
        };

        const dataStr = JSON.stringify(programSummary, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `${programData.name.replace(/\s+/g, '_')}_Program.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const getProgressPercentage = () => {
        return ((programData.completedSessions / programData.totalSessions) * 100).toFixed(1);
    };

    const getCurrentPhaseColor = (phase) => {
        switch (phase) {
            case 'planning': return 'blue';
            case 'execution': return 'green';
            case 'evaluation': return 'purple';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            {/* Implementation Status */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Play className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Implementation Status</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {implementationPhases.map((phase) => (
                        <div
                            key={phase.phase}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${implementationPhase === phase.phase
                                    ? `border-${getCurrentPhaseColor(phase.phase)}-500 bg-${getCurrentPhaseColor(phase.phase)}-900/30`
                                    : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setImplementationPhase(phase.phase)}
                        >
                            <h4 className="font-semibold text-white mb-2">{phase.name}</h4>
                            <p className="text-sm text-gray-300 mb-3">{phase.description}</p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                {phase.tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Overview */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Program Overview</h3>
                    </div>
                    <button
                        onClick={exportProgram}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export Program
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Program Name</h4>
                        <p className="text-lg font-semibold text-white">{programData.name}</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Duration</h4>
                        <p className="text-lg font-semibold text-white">{programData.duration} weeks</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Current Week</h4>
                        <p className="text-lg font-semibold text-white">{programData.currentWeek} of {programData.duration}</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Progress</h4>
                        <p className="text-lg font-semibold text-white">{getProgressPercentage()}%</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Program Progress</span>
                        <span className="text-sm text-gray-400">
                            {programData.completedSessions} / {programData.totalSessions} sessions
                        </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Performance Tracking */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Performance Tracking</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Evaluation Metrics */}
                    <div>
                        <h4 className="font-semibold text-white mb-3">Key Performance Indicators</h4>
                        <div className="space-y-3">
                            {evaluationMetrics.map((metric, index) => {
                                const progress = ((metric.current - metric.baseline) / (metric.target - metric.baseline)) * 100;
                                const progressClamped = Math.max(0, Math.min(100, progress));

                                return (
                                    <div key={index} className="bg-gray-600 p-3 rounded border border-gray-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-sm font-medium text-white">{metric.metric}</h5>
                                            <span className="text-sm text-gray-300">
                                                {metric.current} / {metric.target} {metric.unit}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${progressClamped >= 100 ? 'bg-green-500' :
                                                        progressClamped >= 75 ? 'bg-blue-500' :
                                                            progressClamped >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${progressClamped}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Baseline: {metric.baseline} {metric.unit}</span>
                                            <span>{progressClamped.toFixed(1)}% to goal</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly Trends */}
                    <div>
                        <h4 className="font-semibold text-white mb-3">Weekly Trends</h4>
                        <div className="space-y-4">
                            <div className="bg-gray-600 p-3 rounded border border-gray-500">
                                <h5 className="text-sm font-medium text-white mb-2">Volume Load Trend</h5>
                                <div className="text-xs text-gray-300">
                                    Last 4 weeks: {progressTracking.volumeLoad.slice(-4).map(w => w.load).join(' → ')} kg
                                </div>
                            </div>

                            <div className="bg-gray-600 p-3 rounded border border-gray-500">
                                <h5 className="text-sm font-medium text-white mb-2">Average RPE Trend</h5>
                                <div className="text-xs text-gray-300">
                                    Last 4 weeks: {progressTracking.rpeAverage.slice(-4).map(w => w.rpe).join(' → ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tapering Protocol */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Tapering Protocol</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-white mb-2">
                            <input
                                type="checkbox"
                                checked={tapering.enabled}
                                onChange={(e) => setTapering(prev => ({ ...prev, enabled: e.target.checked }))}
                                className="rounded"
                            />
                            Enable Tapering
                        </label>
                    </div>

                    {tapering.enabled && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Start Week</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={programData.duration}
                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.startWeek}
                                    onChange={(e) => setTapering(prev => ({ ...prev, startWeek: parseInt(e.target.value) }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Volume Reduction (%)</label>
                                <input
                                    type="number"
                                    min="20"
                                    max="80"
                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.volumeReduction}
                                    onChange={(e) => setTapering(prev => ({ ...prev, volumeReduction: parseInt(e.target.value) }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Intensity Maintenance (%)</label>
                                <input
                                    type="number"
                                    min="70"
                                    max="100"
                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.intensityMaintenance}
                                    onChange={(e) => setTapering(prev => ({ ...prev, intensityMaintenance: parseInt(e.target.value) }))}
                                />
                            </div>
                        </>
                    )}
                </div>

                {tapering.enabled && (
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500 rounded">
                        <p className="text-yellow-200 text-sm">
                            <strong>Tapering Guidelines:</strong> Starting week {tapering.startWeek}, reduce training volume by {tapering.volumeReduction}%
                            while maintaining intensity at {tapering.intensityMaintenance}% to peak for competition.
                        </p>
                    </div>
                )}
            </div>

            {/* Adjustment Guidelines */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Program Adjustments</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {adjustmentGuidelines.map((guideline, index) => (
                        <div key={index} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <h4 className="font-semibold text-white mb-2">{guideline.scenario}</h4>

                            <div className="mb-3">
                                <h5 className="text-sm text-orange-400 mb-1">Indicators:</h5>
                                <ul className="text-xs text-gray-300 space-y-0.5">
                                    {guideline.indicators.map((indicator, i) => (
                                        <li key={i}>• {indicator}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-sm text-green-400 mb-1">Recommended Action:</h5>
                                <p className="text-xs text-gray-300">{guideline.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Summary */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Implementation Checklist</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-green-400 mb-2">Before Starting</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>✓ Assessment completed</li>
                            <li>✓ Goals established</li>
                            <li>✓ Macrocycle planned</li>
                            <li>✓ Phases designed</li>
                            <li>✓ Mesocycles sequenced</li>
                            <li>✓ Microcycles structured</li>
                            <li>✓ Monitoring protocols set</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-blue-400 mb-2">During Execution</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Track daily readiness</li>
                            <li>• Monitor performance markers</li>
                            <li>• Adjust loads based on RPE/velocity</li>
                            <li>• Implement deloads as planned</li>
                            <li>• Address issues early</li>
                            <li>• Stay consistent with basics</li>
                            <li>• Prepare for competition taper</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Step 7 of 7: Implementation Complete
                    </div>

                    <button
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => alert('Program design complete! Ready for implementation.')}
                    >
                        Start Program
                        <Play className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Implementation;
