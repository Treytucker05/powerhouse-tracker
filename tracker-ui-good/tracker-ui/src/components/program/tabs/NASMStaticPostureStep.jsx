import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

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
    const [selectedTags, setSelectedTags] = useState([]);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [viewCompletionStatus, setViewCompletionStatus] = useState({
        anterior: false,
        lateral: false,
        posterior: false
    });
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

    // NEW: Quick Action Functions
    const markSectionNormal = (view, section) => {
        setPostureData(prev => {
            const clearedSection = {};
            Object.keys(prev[view][section]).forEach(key => {
                clearedSection[key] = false;
            });

            return {
                ...prev,
                [view]: {
                    ...prev[view],
                    [section]: clearedSection
                }
            };
        });
    };

    const clearSection = (view, section) => {
        setPostureData(prev => {
            const clearedSection = {};
            Object.keys(prev[view][section]).forEach(key => {
                clearedSection[key] = false;
            });

            return {
                ...prev,
                [view]: {
                    ...prev[view],
                    [section]: clearedSection
                }
            };
        });
    };

    const calculateMuscleImbalances = () => {
        const predictions = {
            overactive: [],
            underactive: []
        };

        ['anterior', 'lateral', 'posterior'].forEach(view => {
            Object.entries(postureData[view]).forEach(([section, sectionData]) => {
                Object.entries(sectionData).forEach(([deviation, isPresent]) => {
                    if (isPresent) {
                        // Map common deviations to muscle imbalances
                        const baseDeviation = deviation.replace(/-L|-R|-both/, '');

                        if (muscleImbalancePredictor[baseDeviation]) {
                            predictions.overactive.push(...muscleImbalancePredictor[baseDeviation].likely_tight);
                            predictions.underactive.push(...muscleImbalancePredictor[baseDeviation].likely_weak);
                        }
                    }
                });
            });
        });

        // Remove duplicates
        predictions.overactive = [...new Set(predictions.overactive)];
        predictions.underactive = [...new Set(predictions.underactive)];

        return predictions;
    };

    const getCompletedViews = () => {
        let completed = 0;
        ['anterior', 'lateral', 'posterior'].forEach(view => {
            if (countDeviationsInView(view) >= 0) { // Consider any interaction as "completed"
                completed++;
            }
        });
        return completed;
    };

    const getAsymmetries = () => {
        const asymmetries = [];
        ['anterior', 'lateral', 'posterior'].forEach(view => {
            Object.entries(postureData[view]).forEach(([section, sectionData]) => {
                Object.entries(sectionData).forEach(([key, value]) => {
                    if (value === true && key.includes('-L')) {
                        const rightKey = key.replace('-L', '-R');
                        if (!sectionData[rightKey]) {
                            asymmetries.push(`${view} ${section}: Left side deviation only`);
                        }
                    } else if (value === true && key.includes('-R')) {
                        const leftKey = key.replace('-R', '-L');
                        if (!sectionData[leftKey]) {
                            asymmetries.push(`${view} ${section}: Right side deviation only`);
                        }
                    }
                });
            });
        });
        return asymmetries;
    };

    // NEW: Enhanced helper functions for final improvements
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const canProceedToNextStep = () => {
        const completedViews = getCompletedViews();
        if (completedViews < 3) {
            showWarning(`Please complete all three views before proceeding. ${completedViews}/3 completed.`);
            return false;
        }
        return true;
    };

    const showWarning = (message) => {
        const toast = document.createElement('div');
        toast.className = 'warning-toast';
        toast.textContent = `⚠️ ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const showSuccessToast = (viewName) => {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = `✅ ${viewName} View Complete!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const getAllViewsComplete = () => {
        return getCompletedViews() === 3;
    };

    const handleProceed = () => {
        if (canProceedToNextStep()) {
            handleSubmit();
        }
    };

    // Enhanced deviation change handler with visual feedback
    const handleDeviationChangeEnhanced = (view, section, deviation, checked) => {
        handleDeviationChange(view, section, deviation, checked);

        // Add visual feedback for selected items
        if (checked) {
            const element = document.querySelector(`[data-deviation="${view}-${section}-${deviation}"]`);
            if (element) {
                element.classList.add('selected');
                setTimeout(() => element.classList.remove('selected'), 300);
            }
        }

        // Check if view is now complete and show toast
        setTimeout(() => {
            const currentViewComplete = countDeviationsInView(view) > 0 ||
                Object.values(postureData[view]).every(sectionData =>
                    Object.values(sectionData).some(val => val === true)
                );

            if (currentViewComplete && !viewCompletionStatus[view]) {
                setViewCompletionStatus(prev => ({ ...prev, [view]: true }));
                showSuccessToast(view.charAt(0).toUpperCase() + view.slice(1));
            }
        }, 100);
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
            predictedImbalances: calculateMuscleImbalances(),
            asymmetries: countAsymmetries(),
            selectedQuickTags: selectedTags,
            additionalNotes: additionalNotes,
            viewCompletionStatus: viewCompletionStatus,
            summary: {
                anteriorDeviations: countDeviationsInView('anterior'),
                lateralDeviations: countDeviationsInView('lateral'),
                posteriorDeviations: countDeviationsInView('posterior'),
                totalDeviations: getTotalDeviations(),
                completedViews: getCompletedViews(),
                allViewsComplete: getAllViewsComplete()
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
            {/* Progress Bar */}
            <div className="progress-bar">
                <div className="progress-text">
                    Step 3: Static Posture - {getCompletedViews()}/3 Views Complete
                </div>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${(getCompletedViews() / 3) * 100}%` }}
                    />
                </div>
            </div>

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
                            {/* Collapsible Reference Guide */}
                            <details className="reference-guide">
                                <summary>📐 Plumb Line Reference Guide (click to expand)</summary>
                                <div className="reference-content">
                                    {activeView === 'anterior' && (
                                        <div>
                                            <p><strong>Anterior View Reference:</strong></p>
                                            <p>Imaginary line from midpoint between heels through midline of pelvis, trunk, and skull.
                                                Client should be weight bearing equally on both feet, arms at sides.</p>
                                            <p><em>Look for:</em> Symmetry between left and right sides, proper alignment of body segments.</p>
                                        </div>
                                    )}
                                    {activeView === 'lateral' && (
                                        <div>
                                            <p><strong>Lateral View Reference:</strong></p>
                                            <p>Line through lateral malleolus, middle of femur, center of shoulder, middle of ear.
                                                Assess natural spinal curves and joint alignment.</p>
                                            <p><em>Look for:</em> Proper cervical/lumbar lordosis, thoracic kyphosis, joint positioning.</p>
                                        </div>
                                    )}
                                    {activeView === 'posterior' && (
                                        <div>
                                            <p><strong>Posterior View Reference:</strong></p>
                                            <p>Line from midpoint between heels through midline of pelvis, spine, and skull.
                                                Observe from behind for symmetry and alignment.</p>
                                            <p><em>Look for:</em> Spinal alignment, scapular positioning, hip levelness, foot positioning.</p>
                                        </div>
                                    )}
                                </div>
                            </details>

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

                                        {/* Quick Action Buttons */}
                                        <div className="section-actions">
                                            <button
                                                className="btn-small btn-normal"
                                                onClick={() => markSectionNormal(activeView, sectionKey)}
                                                title="Mark this section as normal (clear all deviations)"
                                            >
                                                ✓ Mark Normal
                                            </button>
                                            <button
                                                className="btn-small btn-clear"
                                                onClick={() => clearSection(activeView, sectionKey)}
                                                title="Clear all selections in this section"
                                            >
                                                Clear
                                            </button>
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
                                                    <div
                                                        key={deviationKey}
                                                        className="deviation-row"
                                                        data-deviation={`${activeView}-${sectionKey}-${deviationKey}`}
                                                    >
                                                        <span className="deviation-label">
                                                            {deviationName.replace(/ - (Left|Right|Both)$/, '')}
                                                        </span>

                                                        <div className="side-options">
                                                            {isBilateral ? (
                                                                <label className="checkbox-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={postureData[activeView][sectionKey][deviationKey] || false}
                                                                        onChange={(e) => handleDeviationChangeEnhanced(activeView, sectionKey, deviationKey, e.target.checked)}
                                                                    />
                                                                    Present
                                                                </label>
                                                            ) : (
                                                                <>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][leftKey] || false}
                                                                            onChange={(e) => handleDeviationChangeEnhanced(activeView, sectionKey, leftKey, e.target.checked)}
                                                                        />
                                                                        Left
                                                                    </label>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][rightKey] || false}
                                                                            onChange={(e) => handleDeviationChangeEnhanced(activeView, sectionKey, rightKey, e.target.checked)}
                                                                        />
                                                                        Right
                                                                    </label>
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={postureData[activeView][sectionKey][bothKey] || false}
                                                                            onChange={(e) => handleDeviationChangeEnhanced(activeView, sectionKey, bothKey, e.target.checked)}
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

                            {/* Enhanced Notes Section */}
                            <div className="notes-section">
                                <h4>🏷️ Quick Tags (click to add):</h4>
                                <div className="quick-tags">
                                    {['Forward Head', 'Rounded Shoulders', 'Anterior Pelvic Tilt', 'Flat Feet', 'Knee Valgus', 'Scoliosis', 'Winged Scapula', 'Hip Drop'].map(tag => (
                                        <button
                                            key={tag}
                                            className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className="notes-input">
                                    <label>Additional Observations:</label>
                                    <textarea
                                        placeholder="Record any additional postural observations, compensations, or clinical notes..."
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Summary View */
                        <div className="summary-view">
                            <div className="summary-grid">
                                {/* Enhanced Summary Card */}
                                <div className="summary-card enhanced-summary">
                                    <h3>📋 Assessment Summary</h3>
                                    <div className="summary-stats">
                                        <div className="stat-row">
                                            <span>Total Deviations:</span>
                                            <span className="stat-value">{getTotalDeviations()}</span>
                                        </div>
                                        <div className="stat-row">
                                            <span>Anterior View:</span>
                                            <span className="stat-value">{countDeviationsInView('anterior')} issues</span>
                                        </div>
                                        <div className="stat-row">
                                            <span>Lateral View:</span>
                                            <span className="stat-value">{countDeviationsInView('lateral')} issues</span>
                                        </div>
                                        <div className="stat-row">
                                            <span>Posterior View:</span>
                                            <span className="stat-value">{countDeviationsInView('posterior')} issues</span>
                                        </div>
                                    </div>

                                    <div className="asymmetries">
                                        <h4>🔄 Asymmetries Detected:</h4>
                                        {getAsymmetries().length > 0 ? (
                                            <ul className="asymmetry-list">
                                                {getAsymmetries().map((asymmetry, index) => (
                                                    <li key={index}>{asymmetry}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="no-asymmetries">No significant asymmetries detected</p>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Muscle Predictions */}
                                <div className="summary-card muscle-predictions">
                                    <h4>🎯 Predicted Muscle Imbalances:</h4>
                                    {(() => {
                                        const imbalances = calculateMuscleImbalances();
                                        return imbalances.overactive.length > 0 || imbalances.underactive.length > 0 ? (
                                            <div className="muscle-imbalance-grid">
                                                {imbalances.overactive.length > 0 && (
                                                    <div className="overactive">
                                                        <strong>🔴 Likely Overactive:</strong>
                                                        <ul>
                                                            {imbalances.overactive.map((muscle, index) => (
                                                                <li key={index}>{muscle}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {imbalances.underactive.length > 0 && (
                                                    <div className="underactive">
                                                        <strong>🟡 Likely Underactive:</strong>
                                                        <ul>
                                                            {imbalances.underactive.map((muscle, index) => (
                                                                <li key={index}>{muscle}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="no-predictions">Complete assessment for muscle imbalance predictions</p>
                                        );
                                    })()}
                                </div>

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

            {/* Floating Action Button */}
            <div className="floating-actions">
                <button
                    className={`btn-proceed ${getAllViewsComplete() ? 'complete' : 'incomplete'}`}
                    onClick={handleProceed}
                    disabled={!getAllViewsComplete()}
                >
                    {getAllViewsComplete()
                        ? 'Continue to Step 4 →'
                        : `Complete ${3 - getCompletedViews()} more view(s)`
                    }
                </button>
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

                /* Progress Bar Styles */
                .progress-bar {
                    background: #1f2937;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid #374151;
                }

                .progress-text {
                    color: #f3f4f6;
                    font-weight: 600;
                    margin-bottom: 10px;
                    text-align: center;
                }

                .progress-track {
                    width: 100%;
                    height: 8px;
                    background: #374151;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #dc2626, #ef4444);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                /* Quick Action Buttons */
                .section-actions {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 15px;
                    padding: 10px;
                    background: rgba(75, 85, 99, 0.3);
                    border-radius: 6px;
                    border-left: 3px solid #dc2626;
                }

                .btn-small {
                    padding: 4px 12px;
                    font-size: 12px;
                    margin-right: 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .btn-normal {
                    background: #22c55e;
                    color: white;
                }

                .btn-normal:hover {
                    background: #16a34a;
                    transform: translateY(-1px);
                }

                .btn-clear {
                    background: #6b7280;
                    color: white;
                }

                .btn-clear:hover {
                    background: #4b5563;
                    transform: translateY(-1px);
                }

                /* Enhanced Summary Styles */
                .enhanced-summary {
                    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                    border: 2px solid #4b5563;
                }

                .summary-stats {
                    margin-bottom: 20px;
                }

                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    margin: 4px 0;
                    background: rgba(75, 85, 99, 0.3);
                    border-radius: 4px;
                    border-left: 3px solid #dc2626;
                }

                .stat-row .stat-value {
                    font-weight: 600;
                    color: #ef4444;
                }

                .asymmetries {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #4b5563;
                }

                .asymmetries h4 {
                    color: #f3f4f6;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .asymmetry-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .asymmetry-list li {
                    padding: 6px 10px;
                    background: rgba(239, 68, 68, 0.1);
                    border-left: 3px solid #ef4444;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    font-size: 13px;
                    color: #fecaca;
                }

                .no-asymmetries {
                    color: #9ca3af;
                    font-style: italic;
                    text-align: center;
                    padding: 10px;
                    background: rgba(34, 197, 94, 0.1);
                    border-radius: 4px;
                    border-left: 3px solid #22c55e;
                }

                .muscle-predictions {
                    background: #374151;
                    border: 1px solid #4b5563;
                }

                .muscle-imbalance-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .overactive, .underactive {
                    padding: 10px;
                    border-radius: 6px;
                }

                .overactive {
                    background: rgba(239, 68, 68, 0.1);
                    border-left: 4px solid #ef4444;
                }

                .underactive {
                    background: rgba(245, 158, 11, 0.1);
                    border-left: 4px solid #f59e0b;
                }

                .overactive strong, .underactive strong {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 13px;
                }

                .overactive ul, .underactive ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .overactive li, .underactive li {
                    padding: 3px 8px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                    margin-bottom: 2px;
                    font-size: 12px;
                }

                /* NEW: Reference Guide Styles */
                .reference-guide {
                    background: rgba(220, 38, 38, 0.05);
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(220, 38, 38, 0.2);
                }

                .reference-guide summary {
                    cursor: pointer;
                    font-weight: 600;
                    color: #dc2626;
                    padding: 8px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }

                .reference-guide summary:hover {
                    background: rgba(220, 38, 38, 0.1);
                }

                .reference-content {
                    margin-top: 10px;
                    padding: 10px;
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 6px;
                    border-left: 3px solid #dc2626;
                }

                .reference-content p {
                    margin: 8px 0;
                    color: #d1d5db;
                    line-height: 1.5;
                }

                .reference-content strong {
                    color: #f3f4f6;
                }

                .reference-content em {
                    color: #fbbf24;
                    font-style: normal;
                }

                /* Visual Feedback Animations */
                .deviation-row.selected {
                    animation: pulse 0.3s ease;
                    background: rgba(220, 38, 38, 0.1);
                    border-left-color: #dc2626;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .deviation-badge {
                    transition: all 0.3s ease;
                }

                .tab-btn .deviation-badge {
                    animation: bounce 0.5s ease;
                }

                @keyframes bounce {
                    0%, 20%, 60%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-3px); }
                    80% { transform: translateY(-1px); }
                }

                /* Enhanced Notes Section */
                .notes-section {
                    background: #374151;
                    border-radius: 12px;
                    padding: 20px;
                    margin-top: 25px;
                    border: 1px solid #4b5563;
                }

                .notes-section h4 {
                    color: #f3f4f6;
                    margin-bottom: 15px;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .quick-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                }

                .tag {
                    padding: 6px 12px;
                    margin: 0;
                    border: 1px solid #dc2626;
                    background: transparent;
                    border-radius: 20px;
                    cursor: pointer;
                    color: #dc2626;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .tag:hover {
                    background: rgba(220, 38, 38, 0.1);
                    transform: translateY(-1px);
                }

                .tag.active {
                    background: #dc2626;
                    color: white;
                    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
                }

                .notes-input {
                    margin-top: 15px;
                }

                .notes-input label {
                    display: block;
                    color: #f3f4f6;
                    font-weight: 500;
                    margin-bottom: 8px;
                }

                .notes-input textarea {
                    width: 100%;
                    background: #4b5563;
                    border: 1px solid #6b7280;
                    border-radius: 6px;
                    padding: 12px;
                    color: #d1d5db;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 80px;
                }

                .notes-input textarea:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
                }

                .notes-input textarea::placeholder {
                    color: #9ca3af;
                }

                /* Floating Action Button */
                .floating-actions {
                    position: sticky;
                    bottom: 20px;
                    display: flex;
                    justify-content: flex-end;
                    padding: 20px;
                    background: linear-gradient(transparent, #111827 70%);
                    z-index: 10;
                }

                .btn-proceed {
                    padding: 14px 28px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    font-size: 16px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-proceed.complete {
                    background: linear-gradient(135deg, #059669, #10b981);
                    color: white;
                    animation: glow 2s ease-in-out infinite alternate;
                }

                .btn-proceed.incomplete {
                    background: #6b7280;
                    color: #d1d5db;
                    cursor: not-allowed;
                }

                .btn-proceed.complete:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
                }

                @keyframes glow {
                    from { box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3); }
                    to { box-shadow: 0 4px 25px rgba(5, 150, 105, 0.6); }
                }

                /* Toast Notifications */
                .success-toast, .warning-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 24px;
                    border-radius: 8px;
                    animation: slideIn 0.3s ease;
                    z-index: 1000;
                    font-weight: 500;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .success-toast {
                    background: #22c55e;
                    color: white;
                }

                .warning-toast {
                    background: #f59e0b;
                    color: white;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
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
                        flex-direction: column;
                        gap: 8px;
                        align-self: flex-end;
                        width: 100%;
                    }

                    .checkbox-label {
                        padding: 8px;
                        width: 100%;
                        justify-content: center;
                        background: rgba(75, 85, 99, 0.5);
                        border-radius: 4px;
                    }
                    
                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .muscle-imbalance-grid {
                        grid-template-columns: 1fr;
                    }

                    .section-actions {
                        flex-direction: column;
                        gap: 6px;
                    }

                    .btn-small {
                        width: 100%;
                        justify-content: center;
                        margin-right: 0;
                    }

                    .progress-bar {
                        padding: 15px;
                        margin-bottom: 15px;
                    }

                    .progress-text {
                        font-size: 14px;
                    }
                    
                    .step-navigation {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .back-button, .next-button {
                        width: 100%;
                    }

                    .step-title {
                        font-size: 1.8em;
                    }

                    .assessment-main {
                        margin-top: 15px;
                    }

                    .assessment-content {
                        padding: 20px;
                    }

                    .quick-tags {
                        justify-content: center;
                    }

                    .tag {
                        font-size: 11px;
                        padding: 5px 10px;
                    }

                    .floating-actions {
                        position: static;
                        background: none;
                        justify-content: center;
                        padding: 15px;
                    }

                    .btn-proceed {
                        width: 100%;
                        justify-content: center;
                        font-size: 14px;
                        padding: 12px 20px;
                    }

                    .reference-guide {
                        margin-bottom: 15px;
                        padding: 10px;
                    }

                    .reference-content {
                        padding: 8px;
                    }

                    .notes-section {
                        padding: 15px;
                        margin-top: 20px;
                    }

                    .notes-input textarea {
                        font-size: 14px;
                        padding: 10px;
                    }

                    .success-toast, .warning-toast {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        font-size: 14px;
                        padding: 10px 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default NASMStaticPostureStep;
