import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';

const NASMStaticPostureStep = () => {
    const { state, dispatch } = useProgramContext();

    // Active tab state
    const [activeTab, setActiveTab] = useState('anterior');

    // Assessment data state
    const [assessmentData, setAssessmentData] = useState({
        anterior: {
            headPosition: { left: false, right: false, both: false },
            shoulderPosition: { left: false, right: false, both: false },
            armPosition: { left: false, right: false, both: false },
            hipPosition: { left: false, right: false, both: false },
            kneePosition: { left: false, right: false, both: false },
            footPosition: { left: false, right: false, both: false }
        },
        lateral: {
            headPosition: { left: false, right: false, both: false },
            shoulderPosition: { left: false, right: false, both: false },
            spinalCurvature: { left: false, right: false, both: false },
            hipPosition: { left: false, right: false, both: false },
            kneePosition: { left: false, right: false, both: false },
            anklePosition: { left: false, right: false, both: false }
        },
        posterior: {
            headPosition: { left: false, right: false, both: false },
            shoulderPosition: { left: false, right: false, both: false },
            shoulderBladePosition: { left: false, right: false, both: false },
            hipPosition: { left: false, right: false, both: false },
            calfPosition: { left: false, right: false, both: false },
            footPosition: { left: false, right: false, both: false }
        }
    });

    // Tab configuration
    const tabs = [
        { id: 'anterior', label: 'Anterior View', icon: '👤' },
        { id: 'lateral', label: 'Lateral View', icon: '🔄' },
        { id: 'posterior', label: 'Posterior View', icon: '🔄' },
        { id: 'summary', label: 'Summary', icon: '📊' }
    ];

    // Section configurations for each view
    const sectionConfigs = {
        anterior: [
            {
                title: 'Head Position',
                key: 'headPosition',
                deviations: ['Forward head posture', 'Head tilt', 'Head rotation']
            },
            {
                title: 'Shoulder Position',
                key: 'shoulderPosition',
                deviations: ['Elevated shoulders', 'Protracted shoulders', 'Depressed shoulders']
            },
            {
                title: 'Arm Position',
                key: 'armPosition',
                deviations: ['Arms crossed', 'Asymmetrical arm position', 'Internal rotation']
            },
            {
                title: 'Hip Position',
                key: 'hipPosition',
                deviations: ['Hip adduction', 'Hip hiking', 'Lateral hip shift']
            },
            {
                title: 'Knee Position',
                key: 'kneePosition',
                deviations: ['Knee valgus', 'Knee varus', 'Knee rotation']
            },
            {
                title: 'Foot Position',
                key: 'footPosition',
                deviations: ['Foot turn out', 'Foot turn in', 'Uneven foot position']
            }
        ],
        lateral: [
            {
                title: 'Head Position',
                key: 'headPosition',
                deviations: ['Forward head posture', 'Cervical extension', 'Cervical flexion']
            },
            {
                title: 'Shoulder Position',
                key: 'shoulderPosition',
                deviations: ['Protracted shoulders', 'Elevated shoulders', 'Forward shoulders']
            },
            {
                title: 'Spinal Curvature',
                key: 'spinalCurvature',
                deviations: ['Excessive lordosis', 'Excessive kyphosis', 'Flat back']
            },
            {
                title: 'Hip Position',
                key: 'hipPosition',
                deviations: ['Anterior pelvic tilt', 'Posterior pelvic tilt', 'Hip flexion']
            },
            {
                title: 'Knee Position',
                key: 'kneePosition',
                deviations: ['Knee hyperextension', 'Knee flexion', 'Knee instability']
            },
            {
                title: 'Ankle Position',
                key: 'anklePosition',
                deviations: ['Plantar flexion', 'Dorsiflexion', 'Ankle instability']
            }
        ],
        posterior: [
            {
                title: 'Head Position',
                key: 'headPosition',
                deviations: ['Head tilt', 'Head rotation', 'Asymmetrical head position']
            },
            {
                title: 'Shoulder Position',
                key: 'shoulderPosition',
                deviations: ['Elevated shoulders', 'Protracted shoulders', 'Asymmetrical shoulders']
            },
            {
                title: 'Shoulder Blade Position',
                key: 'shoulderBladePosition',
                deviations: ['Winged scapula', 'Elevated scapula', 'Protracted scapula']
            },
            {
                title: 'Hip Position',
                key: 'hipPosition',
                deviations: ['Hip hiking', 'Posterior pelvic tilt', 'Hip asymmetry']
            },
            {
                title: 'Calf Position',
                key: 'calfPosition',
                deviations: ['Asymmetrical calves', 'Calf prominence', 'Calf atrophy']
            },
            {
                title: 'Foot Position',
                key: 'footPosition',
                deviations: ['Foot pronation', 'Foot supination', 'Asymmetrical feet']
            }
        ]
    };

    // Handle checkbox changes
    const handleCheckboxChange = (view, section, side) => {
        setAssessmentData(prev => ({
            ...prev,
            [view]: {
                ...prev[view],
                [section]: {
                    ...prev[view][section],
                    [side]: !prev[view][section][side]
                }
            }
        }));
    };

    // Calculate completion for each view
    const getViewCompletion = (view) => {
        const sections = sectionConfigs[view] || [];
        const completedSections = sections.filter(section => {
            const sectionData = assessmentData[view][section.key];
            return sectionData.left || sectionData.right || sectionData.both;
        });
        return { completed: completedSections.length, total: sections.length };
    };

    // Get total deviations count
    const getTotalDeviations = () => {
        let total = 0;
        Object.keys(assessmentData).forEach(view => {
            Object.keys(assessmentData[view]).forEach(section => {
                const sectionData = assessmentData[view][section];
                if (sectionData.left) total++;
                if (sectionData.right) total++;
                if (sectionData.both) total++;
            });
        });
        return total;
    };

    // Get postural syndrome predictions
    const getPosturalSyndromes = () => {
        const syndromes = [];

        // Upper Crossed Syndrome indicators
        const ucsIndicators = [
            assessmentData.anterior.headPosition.both || assessmentData.anterior.headPosition.left || assessmentData.anterior.headPosition.right,
            assessmentData.anterior.shoulderPosition.both || assessmentData.anterior.shoulderPosition.left || assessmentData.anterior.shoulderPosition.right,
            assessmentData.lateral.headPosition.both || assessmentData.lateral.headPosition.left || assessmentData.lateral.headPosition.right,
            assessmentData.lateral.shoulderPosition.both || assessmentData.lateral.shoulderPosition.left || assessmentData.lateral.shoulderPosition.right,
            assessmentData.lateral.spinalCurvature.both || assessmentData.lateral.spinalCurvature.left || assessmentData.lateral.spinalCurvature.right
        ];

        if (ucsIndicators.filter(Boolean).length >= 3) {
            syndromes.push('Upper Crossed Syndrome');
        }

        // Lower Crossed Syndrome indicators
        const lcsIndicators = [
            assessmentData.lateral.hipPosition.both || assessmentData.lateral.hipPosition.left || assessmentData.lateral.hipPosition.right,
            assessmentData.lateral.spinalCurvature.both || assessmentData.lateral.spinalCurvature.left || assessmentData.lateral.spinalCurvature.right,
            assessmentData.anterior.hipPosition.both || assessmentData.anterior.hipPosition.left || assessmentData.anterior.hipPosition.right
        ];

        if (lcsIndicators.filter(Boolean).length >= 2) {
            syndromes.push('Lower Crossed Syndrome');
        }

        return syndromes;
    };

    // Clear all assessments
    const clearAll = () => {
        const clearedData = {};
        Object.keys(assessmentData).forEach(view => {
            clearedData[view] = {};
            Object.keys(assessmentData[view]).forEach(section => {
                clearedData[view][section] = { left: false, right: false, both: false };
            });
        });
        setAssessmentData(clearedData);
    };

    // Tab Navigation Component
    const TabNavigation = () => (
        <div className="flex border-b border-gray-600 mb-6 bg-gray-800 rounded-t-lg overflow-hidden">
            {tabs.map(tab => {
                const completion = tab.id !== 'summary' ? getViewCompletion(tab.id) : null;
                const isComplete = completion && completion.completed === completion.total && completion.total > 0;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-700 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {completion && (
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${isComplete ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'
                                    }`}>
                                    {completion.completed}/{completion.total}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );

    // Section Header Component
    const SectionHeader = ({ title, isComplete }) => (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${isComplete ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                }`}>
                <span>{isComplete ? '✅' : '⚠️'}</span>
                <span>{isComplete ? 'Complete' : 'Incomplete'}</span>
            </div>
        </div>
    );

    // Checkbox Group Component
    const CheckboxGroup = ({ view, section, title, deviations }) => {
        const sectionData = assessmentData[view][section.key];
        const isComplete = sectionData.left || sectionData.right || sectionData.both;

        return (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                <SectionHeader title={title} isComplete={isComplete} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['left', 'right', 'both'].map(side => (
                        <div key={side} className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide border-b border-gray-600 pb-1">
                                {side === 'both' ? 'Both Sides' : `${side.charAt(0).toUpperCase() + side.slice(1)} Side`}
                            </h4>
                            <label className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700 ${sectionData[side] ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={sectionData[side]}
                                    onChange={() => handleCheckboxChange(view, section.key, side)}
                                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">
                                    {side === 'both' ? 'Bilateral deviation' : 'Deviation present'}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-xs text-gray-400">
                    <strong>Common deviations:</strong> {deviations.join(', ')}
                </div>
            </div>
        );
    };

    // Assessment View Component
    const AssessmentView = ({ view }) => {
        const sections = sectionConfigs[view] || [];
        const completion = getViewCompletion(view);

        return (
            <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <h2 className="text-xl font-bold text-white mb-2">
                        {view.charAt(0).toUpperCase() + view.slice(1)} View Assessment
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Assess the client from the {view} view and identify any postural deviations.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">Progress:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completion.total > 0 ? (completion.completed / completion.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <span className="text-white font-medium">{completion.completed}/{completion.total}</span>
                    </div>
                </div>

                {sections.map(section => (
                    <CheckboxGroup
                        key={section.key}
                        view={view}
                        section={section}
                        title={section.title}
                        deviations={section.deviations}
                    />
                ))}
            </div>
        );
    };

    // Summary View Component
    const SummaryView = () => {
        const totalDeviations = getTotalDeviations();
        const syndromes = getPosturalSyndromes();

        return (
            <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                    <h2 className="text-2xl font-bold text-white mb-4">Assessment Summary</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-blue-600 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-white">{totalDeviations}</div>
                            <div className="text-blue-200 text-sm">Total Deviations</div>
                        </div>

                        <div className="bg-green-600 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-white">
                                {Object.keys(sectionConfigs).reduce((acc, view) => {
                                    const completion = getViewCompletion(view);
                                    return acc + completion.completed;
                                }, 0)}
                            </div>
                            <div className="text-green-200 text-sm">Sections Completed</div>
                        </div>

                        <div className="bg-purple-600 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-white">{syndromes.length}</div>
                            <div className="text-purple-200 text-sm">Potential Syndromes</div>
                        </div>
                    </div>

                    {syndromes.length > 0 && (
                        <div className="bg-yellow-600 p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold text-white mb-2">⚠️ Potential Postural Syndromes</h3>
                            <ul className="list-disc list-inside text-yellow-100">
                                {syndromes.map((syndrome, index) => (
                                    <li key={index}>{syndrome}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            onClick={clearAll}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Clear All
                        </button>

                        <button
                            onClick={() => console.log('Assessment data:', assessmentData)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Detailed breakdown by view */}
                <div className="space-y-4">
                    {Object.keys(sectionConfigs).map(view => {
                        const completion = getViewCompletion(view);
                        const viewDeviations = Object.keys(assessmentData[view]).filter(section => {
                            const sectionData = assessmentData[view][section];
                            return sectionData.left || sectionData.right || sectionData.both;
                        });

                        return (
                            <div key={view} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-white capitalize">{view} View</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${completion.completed === completion.total && completion.total > 0
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 text-gray-200'
                                        }`}>
                                        {completion.completed}/{completion.total} sections
                                    </span>
                                </div>

                                {viewDeviations.length > 0 && (
                                    <div className="text-sm text-gray-300">
                                        <strong>Deviations found in:</strong> {viewDeviations.join(', ')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">NASM Static Postural Assessment</h1>
                <p className="text-gray-300">
                    Comprehensive static postural assessment following NASM CPT methodology.
                    Assess the client from three views and identify postural deviations.
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                <TabNavigation />

                <div className="p-6">
                    {activeTab === 'summary' ? (
                        <SummaryView />
                    ) : (
                        <AssessmentView view={activeTab} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NASMStaticPostureStep;
