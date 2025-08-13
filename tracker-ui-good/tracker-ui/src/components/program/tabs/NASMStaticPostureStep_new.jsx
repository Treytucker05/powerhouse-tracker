import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../context/ProgramContext';

/**
 * NASMStaticPostureStep - Step 3: NASM Static Postural Assessment
 * 
 * Comprehensive NASM CPT-compliant static postural analysis with:
 * - Tabbed interface (Anterior, Lateral, Posterior, Summary)
 * - Enhanced checkbox layout with side selection
 * - Real-time deviation counting and progress tracking
 * - Muscle imbalance predictions
 * - Postural syndrome detection
 */

const NASMStaticPostureStep = () => {
    const { state, actions } = useProgramContext();

    const [activeView, setActiveView] = useState('anterior');
    const [completedSections, setCompletedSections] = useState(new Set());
    const [postureData, setPostureData] = useState({
        // Enhanced state structure with severity and quick tags
        anterior: {
            footAnkle: {
                'feet-turned-out-L': false,
                'feet-turned-out-R': false,
                'feet-turned-out-both': false,
                'feet-flattened-L': false,
                'feet-flattened-R': false,
                'feet-flattened-both': false,
                'feet-not-parallel': false
            },
            knees: {
                'knee-valgus-L': false,
                'knee-valgus-R': false,
                'knee-valgus-both': false,
                'knee-varus-L': false,
                'knee-varus-R': false,
                'knee-varus-both': false,
                'knees-not-aligned-toes': false
            },
            lphc: {
                'pelvis-not-level-L-higher': false,
                'pelvis-not-level-R-higher': false,
                'asis-not-same-plane': false,
                'excessive-anterior-pelvic-tilt': false
            },
            shoulders: {
                'elevated-L': false,
                'elevated-R': false,
                'elevated-both': false,
                'rounded-forward-L': false,
                'rounded-forward-R': false,
                'rounded-forward-both': false,
                'not-level-L-higher': false,
                'not-level-R-higher': false
            },
            headCervical: {
                'head-tilt-L': false,
                'head-tilt-R': false,
                'head-rotation-L': false,
                'head-rotation-R': false,
                'forward-head-position': false
            }
        },
        lateral: {
            footAnkle: {
                'not-90-degrees': false,
                'excessive-pronation': false,
                'excessive-supination': false
            },
            knees: {
                'hyperextended': false,
                'flexed': false
            },
            lphc: {
                'anterior-pelvic-tilt': false,
                'posterior-pelvic-tilt': false,
                'not-neutral': false
            },
            shoulders: {
                'excessively-rounded': false,
                'forward-shoulder-position': false
            },
            head: {
                'forward-head-posture': false,
                'excessive-cervical-extension': false
            }
        },
        posterior: {
            footAnkle: {
                'heels-not-parallel': false,
                'overly-pronated-L': false,
                'overly-pronated-R': false,
                'overly-pronated-both': false,
                'calcaneal-valgus-varus': false
            },
            knees: {
                'adducted-L': false,
                'adducted-R': false,
                'adducted-both': false,
                'abducted-L': false,
                'abducted-R': false,
                'abducted-both': false
            },
            lphc: {
                'pelvis-not-level-psis': false,
                'lateral-pelvic-shift-L': false,
                'lateral-pelvic-shift-R': false
            },
            shouldersScapulae: {
                'elevated-L': false,
                'elevated-R': false,
                'elevated-both': false,
                'protracted-4-inches': false,
                'winging-L': false,
                'winging-R': false,
                'winging-both': false,
                'not-level': false
            },
            head: {
                'tilted-L': false,
                'tilted-R': false,
                'rotated-L': false,
                'rotated-R': false
            }
        },
        // Enhanced tracking
        severity: {
            anterior: {},
            lateral: {},
            posterior: {}
        },
        quickTags: {
            anterior: {},
            lateral: {},
            posterior: {}
        },
        notes: {
            anterior: {},
            lateral: {},
            posterior: {}
        },
        assessmentMethod: ''
    });

    const [suspectedDistortions, setSuspectedDistortions] = useState([]);

    // Muscle imbalance predictor data
    const muscleImbalancePredictor = {
        'feet-turned-out': {
            likely_tight: ['Lateral gastrocnemius', 'Soleus', 'Biceps femoris'],
            likely_weak: ['Medial gastrocnemius', 'Medial hamstrings', 'Gracilis']
        },
        'feet-flattened': {
            likely_tight: ['Peroneals', 'Lateral gastrocnemius'],
            likely_weak: ['Posterior tibialis', 'Anterior tibialis']
        },
        'knee-valgus': {
            likely_tight: ['Adductor complex', 'IT band', 'TFL'],
            likely_weak: ['Gluteus medius', 'Gluteus maximus', 'VMO']
        },
        'forward-head-position': {
            likely_tight: ['Upper trapezius', 'Sternocleidomastoid', 'Suboccipitals'],
            likely_weak: ['Deep cervical flexors', 'Lower trapezius']
        },
        'anterior-pelvic-tilt': {
            likely_tight: ['Hip flexors', 'Erector spinae', 'Latissimus dorsi'],
            likely_weak: ['Gluteus maximus', 'Hamstrings', 'Abdominals']
        },
        'rounded-shoulders': {
            likely_tight: ['Pectorals', 'Latissimus dorsi', 'Teres major'],
            likely_weak: ['Mid/lower trapezius', 'Rhomboids', 'Posterior deltoid']
        }
    };

    // Helper functions
    const countDeviationsInSection = (view, section) => {
        const sectionData = postureData[view][section];
        return Object.entries(sectionData).filter(([key, value]) =>
            key !== 'notes' && key !== 'severity' && key !== 'quickTags' && value === true
        ).length;
    };

    const countDeviationsInView = (view) => {
        const viewData = postureData[view];
        return Object.keys(viewData).reduce((total, section) =>
            total + countDeviationsInSection(view, section), 0
        );
    };

    const getTotalDeviations = () => {
        return ['anterior', 'lateral', 'posterior'].reduce((total, view) =>
            total + countDeviationsInView(view), 0
        );
    };

    // Get section configuration for each view
    const getSectionConfig = (view) => {
        const configs = {
            anterior: {
                footAnkle: {
                    name: 'Foot & Ankle',
                    icon: '🦶',
                    deviations: {
                        'feet-turned-out-L': 'Feet Turned Out - Left',
                        'feet-turned-out-R': 'Feet Turned Out - Right',
                        'feet-turned-out-both': 'Feet Turned Out - Both',
                        'feet-flattened-L': 'Feet Flattened - Left',
                        'feet-flattened-R': 'Feet Flattened - Right',
                        'feet-flattened-both': 'Feet Flattened - Both',
                        'feet-not-parallel': 'Feet Not Parallel'
                    }
                },
                knees: {
                    name: 'Knees',
                    icon: '🦵',
                    deviations: {
                        'knee-valgus-L': 'Knee Valgus - Left',
                        'knee-valgus-R': 'Knee Valgus - Right',
                        'knee-valgus-both': 'Knee Valgus - Both',
                        'knee-varus-L': 'Knee Varus - Left',
                        'knee-varus-R': 'Knee Varus - Right',
                        'knee-varus-both': 'Knee Varus - Both',
                        'knees-not-aligned-toes': 'Knees Not Aligned with Toes'
                    }
                },
                lphc: {
                    name: 'LPHC (Pelvis)',
                    icon: '🔄',
                    deviations: {
                        'pelvis-not-level-L-higher': 'Pelvis Not Level - Left Higher',
                        'pelvis-not-level-R-higher': 'Pelvis Not Level - Right Higher',
                        'asis-not-same-plane': 'ASIS Not Same Plane',
                        'excessive-anterior-pelvic-tilt': 'Excessive Anterior Pelvic Tilt'
                    }
                },
                shoulders: {
                    name: 'Shoulders',
                    icon: '💪',
                    deviations: {
                        'elevated-L': 'Elevated - Left',
                        'elevated-R': 'Elevated - Right',
                        'elevated-both': 'Elevated - Both',
                        'rounded-forward-L': 'Rounded Forward - Left',
                        'rounded-forward-R': 'Rounded Forward - Right',
                        'rounded-forward-both': 'Rounded Forward - Both',
                        'not-level-L-higher': 'Not Level - Left Higher',
                        'not-level-R-higher': 'Not Level - Right Higher'
                    }
                },
                headCervical: {
                    name: 'Head & Cervical',
                    icon: '🧠',
                    deviations: {
                        'head-tilt-L': 'Head Tilt - Left',
                        'head-tilt-R': 'Head Tilt - Right',
                        'head-rotation-L': 'Head Rotation - Left',
                        'head-rotation-R': 'Head Rotation - Right',
                        'forward-head-position': 'Forward Head Position'
                    }
                }
            },
            lateral: {
                footAnkle: {
                    name: 'Foot & Ankle',
                    icon: '🦶',
                    deviations: {
                        'not-90-degrees': 'Not 90 Degrees',
                        'excessive-pronation': 'Excessive Pronation',
                        'excessive-supination': 'Excessive Supination'
                    }
                },
                knees: {
                    name: 'Knees',
                    icon: '🦵',
                    deviations: {
                        'hyperextended': 'Hyperextended',
                        'flexed': 'Flexed'
                    }
                },
                lphc: {
                    name: 'LPHC (Pelvis)',
                    icon: '🔄',
                    deviations: {
                        'anterior-pelvic-tilt': 'Anterior Pelvic Tilt',
                        'posterior-pelvic-tilt': 'Posterior Pelvic Tilt',
                        'not-neutral': 'Not Neutral'
                    }
                },
                shoulders: {
                    name: 'Shoulders',
                    icon: '💪',
                    deviations: {
                        'excessively-rounded': 'Excessively Rounded',
                        'forward-shoulder-position': 'Forward Shoulder Position'
                    }
                },
                head: {
                    name: 'Head & Cervical',
                    icon: '🧠',
                    deviations: {
                        'forward-head-posture': 'Forward Head Posture',
                        'excessive-cervical-extension': 'Excessive Cervical Extension'
                    }
                }
            },
            posterior: {
                footAnkle: {
                    name: 'Foot & Ankle',
                    icon: '🦶',
                    deviations: {
                        'heels-not-parallel': 'Heels Not Parallel',
                        'overly-pronated-L': 'Overly Pronated - Left',
                        'overly-pronated-R': 'Overly Pronated - Right',
                        'overly-pronated-both': 'Overly Pronated - Both',
                        'calcaneal-valgus-varus': 'Calcaneal Valgus/Varus'
                    }
                },
                knees: {
                    name: 'Knees',
                    icon: '🦵',
                    deviations: {
                        'adducted-L': 'Adducted - Left',
                        'adducted-R': 'Adducted - Right',
                        'adducted-both': 'Adducted - Both',
                        'abducted-L': 'Abducted - Left',
                        'abducted-R': 'Abducted - Right',
                        'abducted-both': 'Abducted - Both'
                    }
                },
                lphc: {
                    name: 'LPHC (Pelvis)',
                    icon: '🔄',
                    deviations: {
                        'pelvis-not-level-psis': 'Pelvis Not Level - PSIS',
                        'lateral-pelvic-shift-L': 'Lateral Pelvic Shift - Left',
                        'lateral-pelvic-shift-R': 'Lateral Pelvic Shift - Right'
                    }
                },
                shouldersScapulae: {
                    name: 'Shoulders & Scapulae',
                    icon: '💪',
                    deviations: {
                        'elevated-L': 'Elevated - Left',
                        'elevated-R': 'Elevated - Right',
                        'elevated-both': 'Elevated - Both',
                        'protracted-4-inches': 'Protracted >4 inches',
                        'winging-L': 'Winging - Left',
                        'winging-R': 'Winging - Right',
                        'winging-both': 'Winging - Both',
                        'not-level': 'Not Level'
                    }
                },
                head: {
                    name: 'Head & Cervical',
                    icon: '🧠',
                    deviations: {
                        'tilted-L': 'Tilted - Left',
                        'tilted-R': 'Tilted - Right',
                        'rotated-L': 'Rotated - Left',
                        'rotated-R': 'Rotated - Right'
                    }
                }
            }
        };
        return configs[view] || {};
    };

    // Handle deviation changes
    const handleDeviationChange = (view, section, deviation, checked) => {
        setPostureData(prev => ({
            ...prev,
            [view]: {
                ...prev[view],
                [section]: {
                    ...prev[view][section],
                    [deviation]: checked
                }
            }
        }));
    };

    // Count asymmetries
    const countAsymmetries = () => {
        let count = 0;
        ['anterior', 'lateral', 'posterior'].forEach(view => {
            Object.values(postureData[view]).forEach(section => {
                Object.entries(section).forEach(([key, value]) => {
                    if (value === true && (key.includes('-L') || key.includes('-R'))) {
                        const opposite = key.includes('-L') ? key.replace('-L', '-R') : key.replace('-R', '-L');
                        if (section[opposite] !== value) {
                            count++;
                        }
                    }
                });
            });
        });
        return Math.floor(count / 2);
    };

    // Get predicted muscle imbalances
    const getPredictedImbalances = () => {
        const tight = [];
        const weak = [];

        ['anterior', 'lateral', 'posterior'].forEach(view => {
            Object.entries(postureData[view]).forEach(([section, sectionData]) => {
                Object.entries(sectionData).forEach(([deviation, isPresent]) => {
                    if (isPresent && muscleImbalancePredictor[deviation]) {
                        tight.push(...muscleImbalancePredictor[deviation].likely_tight);
                        weak.push(...muscleImbalancePredictor[deviation].likely_weak);
                    }
                });
            });
        });

        return {
            tight: [...new Set(tight)],
            weak: [...new Set(weak)]
        };
    };

    // Detect postural syndromes
    const detectPosturalSyndromes = () => {
        const syndromes = [];
        const deviations = postureData;

        // Upper Crossed Syndrome
        const upperCrossedIndicators = [
            deviations.anterior.headCervical['forward-head-position'],
            deviations.lateral.head['forward-head-posture'],
            deviations.anterior.shoulders['rounded-forward-both'],
            deviations.lateral.shoulders['excessively-rounded']
        ];

        if (upperCrossedIndicators.filter(Boolean).length >= 2) {
            syndromes.push('Upper Crossed Syndrome');
        }

        // Lower Crossed Syndrome
        const lowerCrossedIndicators = [
            deviations.anterior.lphc['excessive-anterior-pelvic-tilt'],
            deviations.lateral.lphc['anterior-pelvic-tilt'],
            deviations.lateral.knees['hyperextended']
        ];

        if (lowerCrossedIndicators.filter(Boolean).length >= 2) {
            syndromes.push('Lower Crossed Syndrome');
        }

        // Pronation Distortion Syndrome
        const pronationIndicators = [
            deviations.anterior.footAnkle['feet-flattened-both'],
            deviations.anterior.knees['knee-valgus-both'],
            deviations.lateral.footAnkle['excessive-pronation']
        ];

        if (pronationIndicators.filter(Boolean).length >= 2) {
            syndromes.push('Pronation Distortion Syndrome');
        }

        return syndromes;
    };

    // Get suggested focus areas
    const getSuggestedFocusAreas = () => {
        const areas = [];
        const totalDeviations = getTotalDeviations();

        if (totalDeviations === 0) {
            areas.push('Excellent postural alignment - continue current practices');
            return areas;
        }

        // Check for upper body issues
        const upperIssues = countDeviationsInSection('anterior', 'shoulders') +
            countDeviationsInSection('anterior', 'headCervical') +
            countDeviationsInSection('lateral', 'shoulders') +
            countDeviationsInSection('lateral', 'head');

        if (upperIssues > 0) {
            areas.push('Upper body postural correction and strengthening');
        }

        // Check for lower body issues
        const lowerIssues = countDeviationsInSection('anterior', 'lphc') +
            countDeviationsInSection('lateral', 'lphc');

        if (lowerIssues > 0) {
            areas.push('Core stability and hip mobility work');
        }

        // Check for foot/ankle issues
        const footIssues = countDeviationsInSection('anterior', 'footAnkle') +
            countDeviationsInSection('lateral', 'footAnkle') +
            countDeviationsInSection('posterior', 'footAnkle');

        if (footIssues > 0) {
            areas.push('Foot and ankle stability training');
        }

        if (countAsymmetries() > 2) {
            areas.push('Bilateral movement patterns and unilateral strengthening');
        }

        return areas.length > 0 ? areas : ['General postural awareness and movement quality'];
    };

    // Auto-analyze when data changes
    useEffect(() => {
        const detectedSyndromes = detectPosturalSyndromes();
        setSuspectedDistortions(detectedSyndromes);
    }, [postureData]);

    // Handle form completion
    const isFormComplete = () => {
        return postureData.assessmentMethod && getTotalDeviations() >= 0;
    };

    const handleSubmit = () => {
        const posturalAssessment = {
            deviations: postureData,
            syndromes: suspectedDistortions,
            predictedImbalances: getPredictedImbalances(),
            asymmetries: countAsymmetries(),
            summary: {
                anteriorDeviations: countDeviationsInView('anterior'),
                lateralDeviations: countDeviationsInView('lateral'),
                posteriorDeviations: countDeviationsInView('posterior'),
                totalDeviations: getTotalDeviations()
            },
            timestamp: new Date().toISOString()
        };

        actions.setAssessmentData({
            ...state.assessmentData,
            step: 3,
            posturalAssessment,
            timestamp: new Date().toISOString()
        });

        actions.setCurrentStep(4);
    };

    return (
        <div className="assessment-container">
            <div className="step-header">
                <h2 className="step-title">Step 3: Static Postural Assessment</h2>
                <p className="step-description">
                    NASM kinetic chain checkpoint assessment - observe alignment from multiple views
                </p>
            </div>

            {/* Assessment Method Selection */}
            <div className="assessment-method-section">
                <label className="method-label">Assessment Method:</label>
                <div className="method-options">
                    <button
                        className={`method-btn ${postureData.assessmentMethod === 'plumb-line' ? 'active' : ''}`}
                        onClick={() => setPostureData(prev => ({ ...prev, assessmentMethod: 'plumb-line' }))}
                    >
                        📏 Plumb Line Grid
                    </button>
                    <button
                        className={`method-btn ${postureData.assessmentMethod === 'visual' ? 'active' : ''}`}
                        onClick={() => setPostureData(prev => ({ ...prev, assessmentMethod: 'visual' }))}
                    >
                        👁️ Visual Observation
                    </button>
                </div>
            </div>

            {/* Main Assessment Interface with Tabs */}
            <div className="assessment-main">
                {/* Tab Navigation */}
                <div className="assessment-tabs">
                    <button
                        className={`tab-btn ${activeView === 'anterior' ? 'active' : ''}`}
                        onClick={() => setActiveView('anterior')}
                    >
                        Anterior View
                        {countDeviationsInView('anterior') > 0 && (
                            <span className="deviation-badge">({countDeviationsInView('anterior')})</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeView === 'lateral' ? 'active' : ''}`}
                        onClick={() => setActiveView('lateral')}
                    >
                        Lateral View
                        {countDeviationsInView('lateral') > 0 && (
                            <span className="deviation-badge">({countDeviationsInView('lateral')})</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeView === 'posterior' ? 'active' : ''}`}
                        onClick={() => setActiveView('posterior')}
                    >
                        Posterior View
                        {countDeviationsInView('posterior') > 0 && (
                            <span className="deviation-badge">({countDeviationsInView('posterior')})</span>
                        )}
                    </button>
                    <button
                        className={`tab-btn summary-tab ${activeView === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveView('summary')}
                    >
                        Summary
                        {getTotalDeviations() > 0 && (
                            <span className="deviation-badge total">({getTotalDeviations()})</span>
                        )}
                    </button>
                </div>

                {/* Assessment Content */}
                <div className="assessment-content">
                    {activeView !== 'summary' ? (
                        <div className="assessment-view">
                            {/* Assessment Sections */}
                            <div className="assessment-sections">
                                {Object.entries(getSectionConfig(activeView)).map(([sectionKey, sectionData]) => (
                                    <div key={sectionKey} className="assessment-section">
                                        {/* Section Header with Completion Indicator */}
                                        <div className="section-header">
                                            <div className="section-title">
                                                <span className="section-icon">{sectionData.icon}</span>
                                                <span className="section-name">{sectionData.name}</span>
                                                <span className="completion-indicator">
                                                    {countDeviationsInSection(activeView, sectionKey) === 0 ? '✅' : '⚠️'}
                                                </span>
                                                <span className="deviation-count">
                                                    {countDeviationsInSection(activeView, sectionKey)} deviations
                                                </span>
                                            </div>
                                        </div>

                                        {/* Improved Deviation Layout */}
                                        <div className="deviation-grid">
                                            {Object.entries(sectionData.deviations).map(([deviationKey, deviationName]) => {
                                                // Determine if this is a bilateral deviation or unilateral
                                                const isBilateral = deviationKey.includes('both') ||
                                                    !deviationKey.includes('-L') && !deviationKey.includes('-R');

                                                const baseKey = deviationKey.replace(/-L|-R|-both/, '');
                                                const leftKey = `${baseKey}-L`;
                                                const rightKey = `${baseKey}-R`;
                                                const bothKey = `${baseKey}-both`;

                                                return (
                                                    <div key={deviationKey} className="deviation-row">
                                                        <span className="deviation-label">
                                                            {deviationName.replace(/ - (Left|Right|Both)$/, '')}
                                                        </span>

                                                        <div className="side-options">
                                                            {isBilateral ? (
                                                                <label className="checkbox-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={postureData[activeView][sectionKey][deviationKey] || false}
                                                                        onChange={(e) => handleDeviationChange(activeView, sectionKey, deviationKey, e.target.checked)}
                                                                    />
                                                                    Present
                                                                </label>
                                                            ) : (
                                                                <>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][leftKey] || false}
                                                                            onChange={(e) => handleDeviationChange(activeView, sectionKey, leftKey, e.target.checked)}
                                                                        />
                                                                        Left
                                                                    </label>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][rightKey] || false}
                                                                            onChange={(e) => handleDeviationChange(activeView, sectionKey, rightKey, e.target.checked)}
                                                                        />
                                                                        Right
                                                                    </label>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][bothKey] || false}
                                                                            onChange={(e) => handleDeviationChange(activeView, sectionKey, bothKey, e.target.checked)}
                                                                        />
                                                                        Both
                                                                    </label>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Summary View */
                        <div className="summary-view">
                            <div className="summary-grid">
                                {/* Overall Statistics */}
                                <div className="summary-card stats">
                                    <h3>📊 Assessment Statistics</h3>
                                    <div className="stat-items">
                                        <div className="stat-item">
                                            <span className="stat-label">Total Deviations:</span>
                                            <span className="stat-value">{getTotalDeviations()}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Anterior View:</span>
                                            <span className="stat-value">{countDeviationsInView('anterior')}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Lateral View:</span>
                                            <span className="stat-value">{countDeviationsInView('lateral')}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Posterior View:</span>
                                            <span className="stat-value">{countDeviationsInView('posterior')}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Asymmetries:</span>
                                            <span className="stat-value">{countAsymmetries()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Suspected Distortion Patterns */}
                                <div className="summary-card distortions">
                                    <h3>🎯 Suspected Distortion Patterns</h3>
                                    {suspectedDistortions.length > 0 ? (
                                        <div className="distortion-list">
                                            {suspectedDistortions.map((distortion, index) => (
                                                <div key={index} className="distortion-item">
                                                    <span className="distortion-icon">⚠️</span>
                                                    <span className="distortion-name">{distortion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-distortions">No major distortion patterns detected</p>
                                    )}
                                </div>

                                {/* Muscle Imbalance Predictor */}
                                <div className="summary-card muscle-predictor">
                                    <h3>💪 Predicted Muscle Imbalances</h3>
                                    {getPredictedImbalances().tight.length > 0 || getPredictedImbalances().weak.length > 0 ? (
                                        <div className="imbalance-predictions">
                                            {getPredictedImbalances().tight.length > 0 && (
                                                <div className="imbalance-group tight">
                                                    <h4>🔴 Likely Tight/Overactive:</h4>
                                                    <ul>
                                                        {getPredictedImbalances().tight.map((muscle, index) => (
                                                            <li key={index}>{muscle}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {getPredictedImbalances().weak.length > 0 && (
                                                <div className="imbalance-group weak">
                                                    <h4>🟡 Likely Weak/Underactive:</h4>
                                                    <ul>
                                                        {getPredictedImbalances().weak.map((muscle, index) => (
                                                            <li key={index}>{muscle}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="no-predictions">Complete assessment for muscle imbalance predictions</p>
                                    )}
                                </div>

                                {/* Focus Areas */}
                                <div className="summary-card focus-areas">
                                    <h3>🎯 Suggested Focus Areas</h3>
                                    <div className="focus-list">
                                        {getSuggestedFocusAreas().map((area, index) => (
                                            <div key={index} className="focus-item">
                                                <span className="focus-icon">📍</span>
                                                <span className="focus-text">{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="step-navigation">
                <button
                    className="back-button"
                    onClick={() => actions.setCurrentStep(2)}
                >
                    ← Back to Vitals
                </button>

                <button
                    className="next-button"
                    onClick={handleSubmit}
                    disabled={!isFormComplete()}
                >
                    Complete Posture → Step 4: Dynamic Movement
                </button>
            </div>

            <style jsx>{`
                .assessment-container {
                    padding: 30px;
                    max-width: 1400px;
                    margin: 0 auto;
                    background: #111827;
                    min-height: 100vh;
                    color: #d1d5db;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .step-header {
                    text-align: center;
                    margin-bottom: 30px;
                    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    border: 1px solid #374151;
                }

                .step-title {
                    color: #dc2626;
                    margin-bottom: 10px;
                    font-size: 2.2em;
                    font-weight: 700;
                }

                .step-description {
                    color: #9ca3af;
                    font-size: 16px;
                    margin: 0;
                }

                .assessment-method-section {
                    background: #1f2937;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border: 1px solid #374151;
                }

                .method-label {
                    display: block;
                    margin-bottom: 15px;
                    font-weight: 600;
                    color: #f3f4f6;
                    font-size: 16px;
                }

                .method-options {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .method-btn {
                    padding: 12px 24px;
                    background: #374151;
                    border: 2px solid #4b5563;
                    border-radius: 8px;
                    color: #d1d5db;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .method-btn:hover {
                    background: #4b5563;
                    border-color: #6b7280;
                }

                .method-btn.active {
                    background: #dc2626;
                    border-color: #dc2626;
                    color: white;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
                }

                .assessment-main {
                    background: #1f2937;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    border: 1px solid #374151;
                }

                .assessment-tabs {
                    display: flex;
                    background: #374151;
                    border-bottom: 1px solid #4b5563;
                }

                .tab-btn {
                    flex: 1;
                    padding: 16px 20px;
                    background: transparent;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    position: relative;
                    border-right: 1px solid #4b5563;
                    border-bottom: 3px solid transparent;
                }

                .tab-btn:last-child {
                    border-right: none;
                }

                .tab-btn:hover {
                    background: #4b5563;
                    color: #d1d5db;
                }

                .tab-btn.active {
                    background: #4b5563;
                    color: #dc2626;
                    border-bottom-color: #dc2626;
                    font-weight: 600;
                }

                .tab-btn.summary-tab.active {
                    color: #059669;
                    border-bottom-color: #059669;
                }

                .deviation-badge {
                    background: #dc2626;
                    color: white;
                    border-radius: 12px;
                    padding: 2px 8px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-left: 6px;
                }

                .deviation-badge.total {
                    background: #059669;
                }

                .assessment-content {
                    padding: 30px;
                    min-height: 500px;
                }

                .assessment-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .assessment-section {
                    background: #374151;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #4b5563;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #4b5563;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }

                .section-icon {
                    font-size: 20px;
                }

                .section-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #f3f4f6;
                }

                .completion-indicator {
                    font-size: 14px;
                    margin-left: 8px;
                }

                .deviation-count {
                    font-size: 12px;
                    color: #9ca3af;
                    background: #4b5563;
                    padding: 2px 8px;
                    border-radius: 8px;
                    margin-left: 8px;
                }

                .deviation-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .deviation-row {
                    padding: 12px;
                    margin: 8px 0;
                    border-left: 3px solid transparent;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #4b5563;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .deviation-row:hover {
                    background: rgba(220, 38, 38, 0.1);
                    border-left-color: #dc2626;
                }

                .deviation-label {
                    font-weight: 500;
                    color: #e5e7eb;
                    flex: 1;
                }

                .side-options {
                    display: flex;
                    gap: 20px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: #d1d5db;
                    font-size: 14px;
                }

                .checkbox-label input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    accent-color: #dc2626;
                    cursor: pointer;
                }

                .summary-view {
                    padding: 20px 0;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 25px;
                }

                .summary-card {
                    background: #374151;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #4b5563;
                }

                .summary-card h3 {
                    color: #f3f4f6;
                    margin-bottom: 15px;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .stat-items {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background: #4b5563;
                    border-radius: 4px;
                }

                .stat-label {
                    color: #d1d5db;
                    font-weight: 500;
                }

                .stat-value {
                    color: #dc2626;
                    font-weight: 600;
                    font-size: 16px;
                }

                .distortion-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .distortion-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                    background: #4b5563;
                    border-radius: 6px;
                    border-left: 4px solid #ef4444;
                }

                .distortion-name {
                    font-weight: 500;
                    color: #f3f4f6;
                }

                .no-distortions, .no-predictions {
                    color: #9ca3af;
                    font-style: italic;
                    text-align: center;
                    padding: 15px;
                }

                .imbalance-predictions {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .imbalance-group h4 {
                    color: #f3f4f6;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .imbalance-group ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .imbalance-group li {
                    padding: 4px 8px;
                    background: #4b5563;
                    border-radius: 4px;
                    margin-bottom: 3px;
                    font-size: 13px;
                    color: #d1d5db;
                }

                .imbalance-group.tight li {
                    border-left: 3px solid #ef4444;
                }

                .imbalance-group.weak li {
                    border-left: 3px solid #f59e0b;
                }

                .focus-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .focus-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    background: #4b5563;
                    border-radius: 4px;
                }

                .focus-text {
                    color: #d1d5db;
                    font-size: 14px;
                }

                .step-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                    padding: 20px 0;
                    border-top: 1px solid #374151;
                }

                .back-button, .next-button {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    font-size: 16px;
                }

                .back-button {
                    background: #4b5563;
                    color: #d1d5db;
                    border: 1px solid #6b7280;
                }

                .back-button:hover {
                    background: #6b7280;
                }

                .next-button {
                    background: #dc2626;
                    color: white;
                    border: 1px solid #dc2626;
                }

                .next-button:hover:not(:disabled) {
                    background: #b91c1c;
                }

                .next-button:disabled {
                    background: #6b7280;
                    cursor: not-allowed;
                    opacity: 0.5;
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .assessment-container {
                        padding: 20px 15px;
                    }
                    
                    .assessment-tabs {
                        flex-direction: column;
                    }
                    
                    .tab-btn {
                        border-right: none;
                        border-bottom: 1px solid #4b5563;
                    }
                    
                    .deviation-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    
                    .side-options {
                        align-self: flex-end;
                    }
                    
                    .summary-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .step-navigation {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .back-button, .next-button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default NASMStaticPostureStep;
