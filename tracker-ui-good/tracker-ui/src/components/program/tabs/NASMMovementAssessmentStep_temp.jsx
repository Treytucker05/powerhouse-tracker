import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import '../../../styles/NASMMovementAssessment.css';

/**
 * NASMMovementAssessmentStep - Step 4: Dynamic Movement Screens (OHSA)
 * 
 * Complete NASM OHSA Protocol Implementation:
 * - Overhead Squat Assessment with systematic compensation analysis
 * - Testing modifications for root cause determination
 * - 4-Phase corrective exercise prescription
 * - Starting OPT phase recommendation algorithm
 * - Real-time analysis and corrective strategy
 */

// NASM OHSA Compensation Definitions
const compensationData = {
    anterior: {
        feetTurnOut: {
            name: "Feet Turn Out",
            description: "Feet turn outward during squat",
            possibleCauses: ["Overactive: Soleus, Lateral Gastrocnemius, Biceps Femoris"],
            correctiveActions: ["Strengthen: Medial Gastrocnemius, Gracilis, Sartorius"]
        },
        feetFlatten: {
            name: "Feet Flatten/Pronate",
            description: "Arch collapses, feet roll inward",
            possibleCauses: ["Overactive: Peroneals, Lateral Gastrocnemius"],
            correctiveActions: ["Strengthen: Anterior Tibialis, Posterior Tibialis"]
        },
        kneeValgus: {
            name: "Knee Valgus (Knock Knees)",
            description: "Knees cave inward toward midline",
            possibleCauses: ["Overactive: Adductor Complex, IT Band, TFL"],
            correctiveActions: ["Strengthen: Gluteus Medius/Maximus, VMO"]
        },
        kneeVarus: {
            name: "Knee Varus (Bow Legs)",
            description: "Knees bow outward away from midline",
            possibleCauses: ["Overactive: Lateral Gastrocnemius, Biceps Femoris"],
            correctiveActions: ["Strengthen: Adductor Complex, Gracilis"]
        },
        asymmetricalShift: {
            name: "Asymmetrical Weight Shift",
            description: "Weight shifts to one side during squat",
            possibleCauses: ["Ankle/Hip mobility restrictions", "Unilateral strength imbalances"],
            correctiveActions: ["Address mobility restrictions", "Unilateral strengthening"]
        }
    },
    lateral: {
        forwardLean: {
            name: "Excessive Forward Lean",
            description: "Torso leans too far forward",
            possibleCauses: ["Overactive: Soleus, Gastrocnemius, Hip Flexor Complex"],
            correctiveActions: ["Strengthen: Anterior Tibialis, Gluteus Maximus"]
        },
        lowBackArch: {
            name: "Low Back Arches",
            description: "Excessive lumbar extension",
            possibleCauses: ["Overactive: Hip Flexor Complex, Erector Spinae, Latissimus Dorsi"],
            correctiveActions: ["Strengthen: Gluteus Maximus, Hamstrings, Intrinsic Core"]
        },
        armsFallForward: {
            name: "Arms Fall Forward",
            description: "Unable to maintain overhead arm position",
            possibleCauses: ["Overactive: Latissimus Dorsi, Teres Major, Pectorals"],
            correctiveActions: ["Strengthen: Mid/Lower Trapezius, Rhomboids, Posterior Deltoid"]
        },
        shoulderElevation: {
            name: "Shoulder Elevation",
            description: "Shoulders rise toward ears",
            possibleCauses: ["Overactive: Upper Trapezius, Sternocleidomastoid, Levator Scapulae"],
            correctiveActions: ["Strengthen: Mid/Lower Trapezius"]
        },
        forwardHead: {
            name: "Forward Head",
            description: "Head protrudes forward from neutral",
            possibleCauses: ["Overactive: Sternocleidomastoid, Scalenes, Suboccipitals"],
            correctiveActions: ["Strengthen: Deep Cervical Flexors"]
        }
    },
    posterior: {
        heelRise: {
            name: "Heel Rise",
            description: "Heels lift off ground during squat",
            possibleCauses: ["Overactive: Soleus, Gastrocnemius"],
            correctiveActions: ["Strengthen: Anterior Tibialis", "Improve ankle dorsiflexion"]
        },
        calfBulging: {
            name: "Calf Bulging",
            description: "Excessive calf muscle activation",
            possibleCauses: ["Overactive: Gastrocnemius, Soleus"],
            correctiveActions: ["Improve ankle mobility", "Strengthen anterior tibialis"]
        },
        shoulderElevation: {
            name: "Shoulder Elevation",
            description: "Shoulders rise toward ears",
            possibleCauses: ["Overactive: Upper Trapezius, Levator Scapulae"],
            correctiveActions: ["Strengthen: Mid/Lower Trapezius"]
        },
        shoulderProtraction: {
            name: "Shoulder Protraction",
            description: "Shoulders round forward",
            possibleCauses: ["Overactive: Pectorals, Anterior Deltoid"],
            correctiveActions: ["Strengthen: Rhomboids, Middle Trapezius"]
        },
        headTilt: {
            name: "Head Tilt",
            description: "Head tilts to one side",
            possibleCauses: ["Unilateral neck muscle tightness"],
            correctiveActions: ["Address cervical imbalances"]
        },
        spinalCurvature: {
            name: "Spinal Curvature",
            description: "Lateral spine deviation",
            possibleCauses: ["Structural or functional scoliosis"],
            correctiveActions: ["Professional assessment required"]
        }
    }
};

const NASMMovementAssessmentStep = () => {
    const { state, actions } = useProgramContext();

    // NEW: View State Management
    const [currentView, setCurrentView] = useState('selection'); // 'selection' or 'assessment'
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    const [currentAssessment, setCurrentAssessment] = useState('overhead-squat'); // 'overhead-squat', 'single-leg', 'pushing', 'pulling'
    const [currentTab, setCurrentTab] = useState('setup'); // 'setup', 'assessment', 'modifications', 'analysis'
    const [completedAssessments, setCompletedAssessments] = useState([]);
    const [selectedQuickTags, setSelectedQuickTags] = useState([]);
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Assessment side selector state
    const [activeSide, setActiveSide] = useState('right'); // 'right' or 'left'

    // Enhanced Assessment configuration with type property
    const assessmentConfig = [
        { id: 'overhead-squat', name: 'Overhead Squat', type: 'Transitional', required: true, icon: '🏋️‍♂️', description: 'Primary transitional movement screen' },
        { id: 'single-leg', name: 'Single-Leg Squat', type: 'Transitional', required: true, icon: '🦵', description: 'Unilateral movement assessment' },
        { id: 'pushing', name: 'Pushing Assessment', type: 'Transitional', required: true, icon: '👐', description: 'Upper body pushing pattern' },
        { id: 'pulling', name: 'Pulling Assessment', type: 'Transitional', required: true, icon: '🪄', description: 'Upper body pulling pattern' },
        { id: 'overhead-press', name: 'Overhead Press', type: 'Transitional', required: false, icon: '🙌', description: 'Overhead movement pattern' },
        { id: 'star-balance', name: 'Star Balance Test', type: 'Balance', required: false, icon: '⭐', description: 'Multi-directional balance' },
        { id: 'gait-analysis', name: 'Gait Analysis', type: 'Dynamic', required: false, icon: '🚶‍♂️', description: 'Walking/running assessment' }
    ];

    const requiredAssessments = assessmentConfig.filter(a => a.required).map(a => a.id);
    const optionalAssessments = assessmentConfig.filter(a => !a.required).map(a => a.id);
    const canProceed = requiredAssessments.every(id => completedAssessments.includes(id));
    const completedRequired = completedAssessments.filter(id => requiredAssessments.includes(id)).length;
    const completedOptional = completedAssessments.filter(id => optionalAssessments.includes(id)).length;
    const totalRequired = requiredAssessments.length;
    const remaining = totalRequired - completedRequired;

    // Navigation Functions
    const startAssessment = (assessmentId) => {
        setSelectedAssessment(assessmentId);
        setCurrentAssessment(assessmentId);
        setCurrentView('assessment');
    };

    const backToSelection = () => {
        setCurrentView('selection');
        setSelectedAssessment(null);
    };

    const completeCurrentAssessment = (data) => {
        // Save assessment data
        saveAssessmentData(selectedAssessment, data);

        // Mark as completed if not already
        if (!completedAssessments.includes(selectedAssessment)) {
            setCompletedAssessments(prev => [...prev, selectedAssessment]);
            showSuccessToast(`${assessmentConfig.find(a => a.id === selectedAssessment)?.name} Completed!`);
        }

        // Return to selection screen
        backToSelection();
    };

    const saveAssessmentData = (assessmentId, data) => {
        // This would save the assessment data to the context or state
        console.log(`Saving data for ${assessmentId}:`, data);
    };

    const proceedToNextStep = () => {
        if (!canProceed) {
            showWarning(`Please complete all required assessments. ${completedRequired}/${totalRequired} completed.`);
            return;
        }
        actions.setCurrentStep(5);
    };

    const [assessmentData, setAssessmentData] = useState({
        // Overhead Squat Assessment
        overheadSquat: {
            setupComplete: false,
            currentView: 'anterior',
            currentRep: 1,
            totalReps: 5,
            anteriorCompensations: {
                feetTurnOut: { present: false, severity: '', side: '', notes: '' },
                feetFlatten: { present: false, severity: '', side: '', notes: '' },
                kneeValgus: { present: false, severity: '', side: '', notes: '' },
                kneeVarus: { present: false, severity: '', side: '', notes: '' },
                asymmetricalShift: { present: false, severity: '', side: '', notes: '' }
            },
            lateralCompensations: {
                forwardLean: { present: false, severity: '', notes: '' },
                lowBackArch: { present: false, severity: '', notes: '' },
                armsFallForward: { present: false, severity: '', notes: '' },
                shoulderElevation: { present: false, severity: '', notes: '' },
                forwardHead: { present: false, severity: '', notes: '' }
            },
            posteriorCompensations: {
                heelRise: { present: false, severity: '', side: '', notes: '' },
                calfBulging: { present: false, severity: '', side: '', notes: '' },
                shoulderElevation: { present: false, severity: '', side: '', notes: '' },
                shoulderProtraction: { present: false, severity: '', side: '', notes: '' },
                headTilt: { present: false, severity: '', side: '', notes: '' },
                spinalCurvature: { present: false, severity: '', notes: '' }
            },
            modificationsPerformed: {
                heelElevation: { performed: false, results: '', improvement: '' },
                armsDown: { performed: false, results: '', improvement: '' }
            }
        },

        // Single-Leg Squat Assessment
        singleLegSquat: {
            setupComplete: false,
            rightLeg: {
                kneeValgus: { present: false, severity: '', notes: '' },
                excessiveForwardLean: { present: false, severity: '', notes: '' },
                hipHike: { present: false, severity: '', notes: '' }
            },
            leftLeg: {
                kneeValgus: { present: false, severity: '', notes: '' },
                excessiveForwardLean: { present: false, severity: '', notes: '' },
                hipHike: { present: false, severity: '', notes: '' }
            },
            balanceModification: { used: false, reason: '', notes: '' }
        },

        // Pushing Assessment
        pushingAssessment: {
            setupComplete: false,
            compensations: {
                lowBackArch: { present: false, severity: '', notes: '' },
                shoulderElevation: { present: false, severity: '', notes: '' },
                headForward: { present: false, severity: '', notes: '' }
            },
            repsCompleted: 0,
            targetReps: 20
        },

        // Pulling Assessment
        pullingAssessment: {
            setupComplete: false,
            compensations: {
                lowBackArch: { present: false, severity: '', notes: '' },
                shoulderElevation: { present: false, severity: '', notes: '' },
                headForward: { present: false, severity: '', notes: '' }
            },
            repsCompleted: 0,
            targetReps: 20
        },

        // Overall analysis
        compensationCount: 0,
        severityScore: 0,
        primaryCauses: [],
        correctiveStrategy: null,
        startingPhaseRecommendation: null
    });

    // OHSA Protocol Specifications
    const OHSAProtocol = {
        equipment: {
            required: ['PVC pipe or dowel', 'Open space 6x6 feet'],
            optional: ['Chair for depth reference', 'Video recording device'],
            alternative: 'Arms overhead if no equipment available'
        },

        clientPreparation: {
            clothing: 'Shorts and short-sleeve shirt',
            footwear: 'Barefoot required',
            position: 'Feet shoulder-width apart',
            toeDirection: 'Pointing straight ahead',
            armPosition: 'Overhead, shoulder-width apart'
        },

        executionProtocol: {
            repetitions: 5,
            tempo: 'Natural pace, 2-3 seconds down',
            depth: 'Height of chair seat or comfortable depth',
            cueing: 'Minimal initial cueing only',
            observation: ['Anterior view', 'Lateral view'],
            duration: '5 minutes total assessment'
        }
    };

    // Compensation Analysis Data
    const compensationData = {
        anterior: {
            feetTurnOut: {
                name: 'Feet Turn Out',
                description: 'Feet externally rotate during squat',
                overactive: ['Gastrocnemius', 'Soleus', 'Biceps femoris (short head)'],
                underactive-text: ['Medial gastrocnemius', 'Medial hamstrings', 'Gracilis', 'Sartorius'],
                correctives: {
                    inhibit: ['Calf SMR', 'Biceps femoris SMR'],
                    lengthen: ['Calf stretch', 'Biceps femoris stretch'],
                    activate: ['Medial gastrocnemius activation', 'Medial hamstring activation'],
                    integrate: ['Squat to calf raise', 'Single-leg balance']
                }
            },
            feetFlatten: {
                name: 'Feet Flatten/Pronate',
                description: 'Excessive pronation, arch collapse',
                overactive: ['Peroneals', 'Gastrocnemius', 'Soleus'],
                underactive-text: ['Posterior tibialis', 'Anterior tibialis', 'Flexor hallucis longus'],
                correctives: {
                    inhibit: ['Peroneal SMR', 'Calf SMR'],
                    lengthen: ['Calf stretch', 'Peroneal stretch'],
                    activate: ['Posterior tibialis activation', 'Intrinsic foot strengthening'],
                    integrate: ['Single-leg balance', 'Barefoot training']
                }
            },
            kneeValgus: {
                name: 'Knee Valgus (Cave Inward)',
                description: 'Knees cave inward - most common compensation',
                overactive: ['Adductor complex', 'Tensor fascia latae', 'Biceps femoris (short head)', 'Vastus lateralis'],
                underactive-text: ['Gluteus medius', 'Gluteus maximus', 'Vastus medialis oblique'],
                correctives: {
                    inhibit: ['Adductor SMR', 'TFL/ITB SMR'],
                    lengthen: ['Standing adductor stretch', 'Supine TFL stretch'],
                    activate: ['Glute med clams', 'Lateral tube walking', 'Glute bridges'],
                    integrate: ['Ball squats', 'Lateral lunges', 'Step-ups with band']
                },
                testingModification: 'Heels on 2x4 board or plates'
            },
            kneeVarus: {
                name: 'Knee Varus (Bow Outward)',
                description: 'Knees bow outward - less common',
                overactive: ['Tensor fascia latae', 'Vastus lateralis', 'Biceps femoris (short head)'],
                underactive-text: ['Adductor complex', 'Medial hamstrings', 'Gluteus maximus'],
                correctives: {
                    inhibit: ['TFL/ITB SMR', 'Vastus lateralis SMR'],
                    lengthen: ['TFL stretch', 'Quad stretch'],
                    activate: ['Adductor activation', 'Glute max activation'],
                    integrate: ['Adductor lunges', 'Sumo squats']
                }
            }
        },

        lateral: {
            forwardLean: {
                name: 'Forward Lean',
                description: 'Excessive torso lean forward',
                overactive: ['Gastrocnemius', 'Soleus', 'Hip flexor complex', 'Abdominal complex'],
                underactive-text: ['Anterior tibialis', 'Gluteus maximus', 'Erector spinae'],
                correctives: {
                    inhibit: ['Calf SMR', 'Hip flexor SMR'],
                    lengthen: ['Calf stretch wall lean', 'Kneeling hip flexor stretch'],
                    activate: ['Anterior tibialis raises', 'Glute bridges', 'Prone cobra'],
                    integrate: ['Wall squats', 'Heel-elevated squats']
                }
            },
            lowBackArch: {
                name: 'Low Back Arch',
                description: 'Excessive lumbar lordosis',
                overactive: ['Hip flexor complex', 'Erector spinae', 'Latissimus dorsi'],
                underactive-text: ['Gluteus maximus', 'Hamstring complex', 'Intrinsic core stabilizers'],
                correctives: {
                    inhibit: ['Hip flexor SMR', 'Lat SMR', 'Erector spinae SMR'],
                    lengthen: ['Kneeling hip flexor stretch', 'Lat stretch on ball'],
                    activate: ['Dead bug', 'Posterior pelvic tilts', 'Glute bridges', 'Bird dog'],
                    integrate: ['Wall squat with pelvic tilt', 'Overhead squats progressed']
                },
                testingModification: 'Hands on hips modification'
            },
            armsFallForward: {
                name: 'Arms Fall Forward',
                description: 'Arms drift forward during squat',
                overactive: ['Latissimus dorsi', 'Teres major', 'Pectoralis major', 'Pectoralis minor'],
                underactive-text: ['Mid trapezius', 'Lower trapezius', 'Rhomboids', 'Rotator cuff'],
                correctives: {
                    inhibit: ['Lat SMR', 'Pec SMR'],
                    lengthen: ['Doorway pec stretch', 'Lat stretch on ball'],
                    activate: ['Prone cobra', 'Wall angels', 'Scapular retractions', 'External rotation band'],
                    integrate: ['Wall slides', 'Overhead reach squats', 'Band pull-aparts overhead']
                }
            },
            shoulderElevation: {
                name: 'Shoulder Elevation',
                description: 'Shoulders rise toward ears',
                overactive: ['Upper trapezius', 'Sternocleidomastoid', 'Levator scapulae'],
                underactive-text: ['Lower trapezius', 'Serratus anterior'],
                correctives: {
                    inhibit: ['Upper trap SMR', 'Levator scapulae SMR'],
                    lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                    activate: ['Lower trap strengthening', 'Serratus anterior wall slides'],
                    integrate: ['Overhead movements with proper scapular positioning']
                }
            },
            forwardHead: {
                name: 'Forward Head',
                description: 'Head juts forward',
                overactive: ['Sternocleidomastoid', 'Scalenes', 'Upper trapezius'],
                underactive-text: ['Deep cervical flexors', 'Mid/lower trapezius'],
                correctives: {
                    inhibit: ['SCM SMR', 'Upper trap SMR'],
                    lengthen: ['SCM stretch', 'Upper trap stretch'],
                    activate: ['Deep cervical flexor strengthening', 'Chin tucks'],
                    integrate: ['Postural awareness exercises']
                }
            }
        },

        posterior: {
            heelRise: {
                name: 'Heel Rise/Early Heel Off',
                description: 'Heels lift off ground during squat descent',
                overactive: ['Gastrocnemius', 'Soleus', 'Hip flexor complex'],
                underactive-text: ['Anterior tibialis', 'Gluteus maximus'],
                correctives: {
                    inhibit: ['Calf SMR', 'Hip flexor SMR'],
                    lengthen: ['Calf stretch', 'Hip flexor stretch'],
                    activate: ['Anterior tibialis strengthening', 'Glute activation'],
                    integrate: ['Heel-down squats', 'Wall slides']
                }
            },
            calfBulging: {
                name: 'Calf Bulging/Asymmetry',
                description: 'Unilateral calf muscle prominence or asymmetry',
                overactive: ['Gastrocnemius (affected side)', 'Soleus (affected side)'],
                underactive-text: ['Anterior tibialis', 'Peroneals (opposite side)'],
                correctives: {
                    inhibit: ['Unilateral calf SMR'],
                    lengthen: ['Unilateral calf stretching'],
                    activate: ['Ankle mobility drills', 'Single-leg balance'],
                    integrate: ['Unilateral balance training', 'Single-leg squats']
                }
            },
            shoulderElevation: {
                name: 'Shoulder Elevation (Posterior View)',
                description: 'One or both shoulders elevated relative to the other',
                overactive: ['Upper trapezius', 'Levator scapulae', 'Rhomboids'],
                underactive-text: ['Lower trapezius', 'Serratus anterior', 'Latissimus dorsi'],
                correctives: {
                    inhibit: ['Upper trap SMR', 'Levator scapulae SMR'],
                    lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                    activate: ['Lower trap strengthening', 'Serratus anterior activation'],
                    integrate: ['Scapular stability exercises', 'Overhead reaching patterns']
                }
            },
            shoulderProtraction: {
                name: 'Shoulder Protraction/Forward Shoulders',
                description: 'Shoulders appear rounded forward from posterior view',
                overactive: ['Pectoralis major/minor', 'Anterior deltoid', 'Latissimus dorsi'],
                underactive-text: ['Mid trapezius', 'Rhomboids', 'Posterior deltoid'],
                correctives: {
                    inhibit: ['Pec SMR', 'Lat SMR'],
                    lengthen: ['Doorway pec stretch', 'Cross-body lat stretch'],
                    activate: ['Prone cobra', 'Scapular retractions', 'External rotations'],
                    integrate: ['Wall angels', 'Band pull-aparts', 'Prone Y-T-W']
                }
            },
            headTilt: {
                name: 'Lateral Head Tilt',
                description: 'Head tilted to one side during movement',
                overactive: ['Sternocleidomastoid (opposite side)', 'Upper trap (same side)', 'Scalenes'],
                underactive-text: ['Deep cervical flexors', 'Sternocleidomastoid (same side)'],
                correctives: {
                    inhibit: ['SCM SMR (opposite side)', 'Upper trap SMR'],
                    lengthen: ['Lateral neck stretch', 'Upper trap stretch'],
                    activate: ['Deep cervical flexor strengthening', 'Chin tucks'],
                    integrate: ['Postural awareness training', 'Cervical stability exercises']
                }
            },
            spinalCurvature: {
                name: 'Lateral Spinal Curvature/Scoliosis',
                description: 'Visible lateral curvature of the spine',
                overactive: ['Quadratus lumborum', 'Erector spinae (concave side)', 'Latissimus dorsi'],
                underactive-text: ['Quadratus lumborum (convex side)', 'Core stabilizers', 'Gluteus medius'],
                correctives: {
                    inhibit: ['QL SMR', 'Lat SMR', 'Erector spinae SMR'],
                    lengthen: ['Side bending stretches', 'Lat stretches'],
                    activate: ['Core stabilization', 'Unilateral glute strengthening'],
                    integrate: ['Functional movement patterns', 'Asymmetrical loading exercises']
                }
            }
        }
    };

    // Single-Leg Squat Assessment Data (NASM Table 6-13)
    const singleLegCompensations = {
        kneeValgus: {
            name: 'Knee Moves Inward (Valgus)',
            description: 'Knee adducts and internally rotates during single-leg squat',
            likelyOveractive: ['Adductor complex', 'Biceps femoris (short head)', 'TFL', 'Vastus lateralis'],
            likelyunderactive-text: ['Gluteus medius/maximus', 'Vastus medialis oblique (VMO)'],
            correctives: {
                inhibit: ['Adductor SMR', 'TFL/ITB SMR'],
                lengthen: ['Standing adductor stretch', 'Supine TFL stretch'],
                activate: ['Glute med clams', 'Lateral tube walking', 'Single-leg glute bridges'],
                integrate: ['Single-leg balance', 'Lateral lunges', 'Step-ups with proper alignment']
            }
        }
    };

    // Pushing Assessment Data (NASM Table 6-14)
    const pushingCompensations = {
        lowBackArch: {
            name: 'Low-Back Arches',
            description: 'Excessive lumbar extension during pushing movement',
            likelyOveractive: ['Hip flexors', 'Erector spinae'],
            likelyunderactive-text: ['Intrinsic core stabilizers'],
            correctives: {
                inhibit: ['Hip flexor SMR', 'Erector spinae SMR'],
                lengthen: ['Kneeling hip flexor stretch', 'Standing hip flexor stretch'],
                activate: ['Drawing-in maneuver', 'Marching', 'Dead bug'],
                integrate: ['Ball squats', 'Push-ups with proper alignment']
            }
        },
        shoulderElevation: {
            name: 'Shoulder Elevation',
            description: 'Shoulders elevate during pushing movement',
            likelyOveractive: ['Upper trapezius', 'Sternocleidomastoid', 'Levator scapulae'],
            likelyunderactive-text: ['Mid/Lower trapezius'],
            correctives: {
                inhibit: ['Upper trap SMR', 'Levator scapulae SMR'],
                lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                activate: ['Lower trap strengthening', 'Cobra'],
                integrate: ['Wall slides', 'Overhead reach squats', 'Band pull-aparts overhead']
            }
        },
        headForward: {
            name: 'Head Migrates Forward',
            description: 'Forward head posture during pushing movement',
            likelyOveractive: ['Upper trapezius', 'Sternocleidomastoid', 'Levator scapulae'],
            likelyunderactive-text: ['Deep cervical flexors'],
            correctives: {
                inhibit: ['Upper trap SMR', 'SCM SMR'],
                lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                activate: ['Chin tucks', 'Deep cervical flexor strengthening'],
                integrate: ['Wall angels', 'Band pull-aparts', 'Prone Y-T-W']
            }
        }
    };

    // Pulling Assessment Data (NASM Table 6-15)
    const pullingCompensations = {
        lowBackArch: {
            name: 'Low-Back Arches',
            description: 'Excessive lumbar extension during pulling movement',
            likelyOveractive: ['Hip flexors', 'Erector spinae'],
            likelyunderactive-text: ['Intrinsic core stabilizers'],
            correctives: {
                inhibit: ['Hip flexor SMR', 'Erector spinae SMR'],
                lengthen: ['Kneeling hip flexor stretch', 'Standing hip flexor stretch'],
                activate: ['Drawing-in maneuver', 'Marching', 'Dead bug'],
                integrate: ['Ball squats', 'Rows with proper alignment']
            }
        },
        shoulderElevation: {
            name: 'Shoulder Elevation',
            description: 'Shoulders elevate during pulling movement',
            likelyOveractive: ['Upper trapezius', 'Sternocleidomastoid', 'Levator scapulae'],
            likelyunderactive-text: ['Mid/Lower trapezius'],
            correctives: {
                inhibit: ['Upper trap SMR', 'Levator scapulae SMR'],
                lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                activate: ['Lower trap strengthening', 'Cobra'],
                integrate: ['Wall slides', 'Overhead reach squats', 'Band pull-aparts overhead']
            }
        },
        headProtrudes: {
            name: 'Head Protrudes Forward',
            description: 'Forward head posture during pulling movement',
            likelyOveractive: ['Upper trapezius', 'Sternocleidomastoid', 'Levator scapulae'],
            likelyunderactive-text: ['Deep cervical flexors'],
            correctives: {
                inhibit: ['Upper trap SMR', 'SCM SMR'],
                lengthen: ['Upper trap stretch', 'Levator scapulae stretch'],
                activate: ['Chin tucks', 'Deep cervical flexor strengthening'],
                integrate: ['Wall angels', 'Band pull-aparts', 'Prone Y-T-W']
            }
        }
    };

    // Helper Functions
    const markAssessmentComplete = (assessmentId) => {
        if (!completedAssessments.includes(assessmentId)) {
            setCompletedAssessments(prev => [...prev, assessmentId]);
            showSuccessToast(`${assessmentConfig.find(a => a.id === assessmentId)?.name} Completed!`);
        }
    };

    const showSuccessToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = `✅ ${message}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const showWarning = (message) => {
        const toast = document.createElement('div');
        toast.className = 'warning-toast';
        toast.textContent = `⚠️ ${message}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f59e0b;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const toggleQuickTag = (tag) => {
        setSelectedQuickTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleCompensationChange = (assessment, section, compensation, field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            [assessment]: {
                ...prev[assessment],
                [section]: {
                    ...prev[assessment][section],
                    [compensation]: {
                        ...prev[assessment][section][compensation],
                        [field]: value
                    }
                }
            }
        }));

        // Recalculate analysis when compensations change
        if (field === 'severity' || field === 'present') {
            calculateAnalysis();
        }
    };

    const calculateSeverityScore = () => {
        let score = 0;

        // Overhead Squat compensations
        const ohsCompensations = {
            ...assessmentData.overheadSquat.anteriorCompensations,
            ...assessmentData.overheadSquat.lateralCompensations,
            ...assessmentData.overheadSquat.posteriorCompensations
        };

        Object.values(ohsCompensations).forEach(comp => {
            if (comp.severity && comp.severity !== 'none') {
                score += comp.severity === 'severe' ? 3 : comp.severity === 'moderate' ? 2 : 1;
            }
        });

        // Single-leg compensations
        Object.values(assessmentData.singleLegSquat.rightLeg).forEach(comp => {
            if (comp.severity && comp.severity !== 'none') {
                score += comp.severity === 'severe' ? 3 : comp.severity === 'moderate' ? 2 : 1;
            }
        });
        Object.values(assessmentData.singleLegSquat.leftLeg).forEach(comp => {
            if (comp.severity && comp.severity !== 'none') {
                score += comp.severity === 'severe' ? 3 : comp.severity === 'moderate' ? 2 : 1;
            }
        });

        // Push/Pull compensations
        Object.values(assessmentData.pushingAssessment.compensations).forEach(comp => {
            if (comp.severity && comp.severity !== 'none') {
                score += comp.severity === 'severe' ? 3 : comp.severity === 'moderate' ? 2 : 1;
            }
        });
        Object.values(assessmentData.pullingAssessment.compensations).forEach(comp => {
            if (comp.severity && comp.severity !== 'none') {
                score += comp.severity === 'severe' ? 3 : comp.severity === 'moderate' ? 2 : 1;
            }
        });

        return score;
    };

    const calculateAnalysis = () => {
        // Count compensations across all assessments
        const ohsCount = (
            Object.values(assessmentData.overheadSquat.anteriorCompensations).filter(c => c.severity && c.severity !== 'none').length +
            Object.values(assessmentData.overheadSquat.lateralCompensations).filter(c => c.severity && c.severity !== 'none').length +
            Object.values(assessmentData.overheadSquat.posteriorCompensations).filter(c => c.severity && c.severity !== 'none').length
        );

        const slsCount = (
            Object.values(assessmentData.singleLegSquat.rightLeg).filter(c => c.severity && c.severity !== 'none').length +
            Object.values(assessmentData.singleLegSquat.leftLeg).filter(c => c.severity && c.severity !== 'none').length
        );

        const pushCount = Object.values(assessmentData.pushingAssessment.compensations).filter(c => c.severity && c.severity !== 'none').length;
        const pullCount = Object.values(assessmentData.pullingAssessment.compensations).filter(c => c.severity && c.severity !== 'none').length;

        const totalCount = ohsCount + slsCount + pushCount + pullCount;
        const severityScore = calculateSeverityScore();

        setAssessmentData(prev => ({
            ...prev,
            compensationCount: totalCount,
            severityScore: severityScore
        }));
    };

    const determineStartingPhase = () => {
        const { compensationCount, severityScore } = assessmentData;
        const clientExperience = state.experienceLevel || 'beginner';

        // Severe compensations or multiple issues
        if (compensationCount >= 3 || severityScore >= 8) {
            return {
                phase: 'Phase 1 Extended',
                duration: '6-8 weeks',
                focus: 'Extensive corrective emphasis',
                correctiveVolume: 'High',
                reasoning: 'Multiple significant compensations require extended stabilization'
            };
        }

        // Moderate compensations
        if (compensationCount >= 2 || severityScore >= 5) {
            return {
                phase: 'Phase 1 Standard',
                duration: '4-6 weeks',
                focus: 'Standard stabilization with correctives',
                correctiveVolume: 'Moderate',
                reasoning: 'Some compensations present, standard Phase 1 with corrective emphasis'
            };
        }

        // Minor compensations, experienced client
        if (clientExperience === 'advanced' && compensationCount <= 1 && severityScore <= 3) {
            return {
                phase: 'Phase 1 Accelerated',
                duration: '2-4 weeks',
                focus: 'Movement validation and preparation',
                correctiveVolume: 'Low',
                reasoning: 'Minor issues with experienced client'
            };
        }

        // Default recommendation
        return {
            phase: 'Phase 1 Standard',
            duration: '4 weeks',
            focus: 'Foundation building',
            correctiveVolume: 'Moderate',
            reasoning: 'Standard NASM entry point'
        };
    };

    // Assessment Selection Screen Component
    const AssessmentSelectionScreen = () => (
        <div className="assessment-selection-screen">
            {/* Top Progress Summary */}
            <div className="step-progress-summary">
                <div className="progress-overview">
                    <div className="progress-stat">
                        <span className="stat-label">Required</span>
                        <span className="stat-value">{completedRequired}/{totalRequired}</span>
                    </div>
                    <div className="progress-stat">
                        <span className="stat-label">Optional</span>
                        <span className="stat-value">{completedOptional}/{optionalAssessments.length}</span>
                    </div>
                    <div className="progress-stat">
                        <span className="stat-label">Total Time</span>
                        <span className="stat-value">~15 min</span>
                    </div>
                </div>

                <button
                    className="proceed-main-btn"
                    disabled={completedRequired < totalRequired}
                    onClick={proceedToNextStep}
                >
                    {completedRequired >= totalRequired ? 'Continue to Step 5' : `Complete ${totalRequired - completedRequired} more`}
                </button>
            </div>

            <div className="assessment-container">
                {/* Required Section */}
                <div className="section-container">
                    <div className="section-header">
                        <h3>🎯 Required Assessments</h3>
                        <span className="progress-badge">{completedRequired}/{totalRequired} Complete</span>
                    </div>

                    <div className="assessment-grid">
                        {assessmentConfig.filter(a => a.required).map(assessment => (
                            <div
                                key={assessment.id}
                                className={`assessment-card ${completedAssessments.includes(assessment.id) ? 'completed' : ''}`}
                                onClick={() => startAssessment(assessment.id)}
                            >
                                <div className="card-status">
                                    {completedAssessments.includes(assessment.id) ? '✅' : '⭕'}
                                </div>

                                <div className="card-content">
                                    <h4>{assessment.name}</h4>
                                    <p className="card-type">{assessment.type}</p>
                                    <p className="card-description">{assessment.description}</p>

                                    <div className="card-details">
                                        <span className="detail-chip">📊 5 reps</span>
                                        <span className="detail-chip">👁️ 3 views</span>
                                        <span className="detail-chip">⏱️ 3-4 min</span>
                                    </div>
                                </div>

                                <button className={`card-action ${completedAssessments.includes(assessment.id) ? 'review' : 'start'}`}>
                                    {completedAssessments.includes(assessment.id) ? 'Review' : 'Start'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optional Section */}
                <div className="section-container">
                    <div className="section-header">
                        <h3>➕ Optional Assessments</h3>
                        <span className="info-text">Recommended for comprehensive evaluation</span>
                    </div>

                    <div className="assessment-grid optional">
                        {assessmentConfig.filter(a => !a.required).map(assessment => (
                            <div
                                key={assessment.id}
                                className={`assessment-card ${completedAssessments.includes(assessment.id) ? 'completed' : ''}`}
                                onClick={() => startAssessment(assessment.id)}
                            >
                                <div className="card-status">
                                    {completedAssessments.includes(assessment.id) ? '✅' : '🔄'}
                                </div>

                                <div className="card-content">
                                    <h4>{assessment.name}</h4>
                                    <p className="card-type">{assessment.type}</p>
                                    <p className="card-description">{assessment.description}</p>

                                    <div className="card-details">
                                        {assessment.id === 'star-balance' && (
                                            <>
                                                <span className="detail-chip">📊 8 directions</span>
                                                <span className="detail-chip">👁️ Single view</span>
                                                <span className="detail-chip">⏱️ 2-3 min</span>
                                            </>
                                        )}
                                        {assessment.id === 'gait-analysis' && (
                                            <>
                                                <span className="detail-chip">📊 Walking</span>
                                                <span className="detail-chip">👁️ Multiple angles</span>
                                                <span className="detail-chip">⏱️ 4-5 min</span>
                                            </>
                                        )}
                                        {assessment.id === 'overhead-press' && (
                                            <>
                                                <span className="detail-chip">📊 10 reps</span>
                                                <span className="detail-chip">👁️ 2 views</span>
                                                <span className="detail-chip">⏱️ 3 min</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button className={`card-action ${completedAssessments.includes(assessment.id) ? 'review' : 'start'}`}>
                                    {completedAssessments.includes(assessment.id) ? 'Review' : 'Start Optional'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Render Functions
    const renderSetupTab = () => (
        <div className="setup-section">
            <div className="protocol-header">
                <h3>🏃‍♂️ OHSA Setup Protocol</h3>
                <p>Ensure proper setup for accurate assessment results</p>
            </div>

            <div className="setup-checklist">
                <h4>Pre-Assessment Checklist</h4>
                <div className="checklist-grid">
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Client barefoot (shoes and socks removed)</span>
                    </label>
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Feet shoulder-width apart</span>
                    </label>
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Toes pointing straight ahead</span>
                    </label>
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Arms overhead position ready</span>
                    </label>
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Clear anterior and lateral view</span>
                    </label>
                    <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Space cleared (6x6 feet minimum)</span>
                    </label>
                </div>
            </div>

            <div className="equipment-section">
                <h4>Equipment</h4>
                <div className="equipment-list">
                    <div className="equipment-category">
                        <h5>Required:</h5>
                        <ul>
                            <li>PVC pipe or dowel (or bodyweight only)</li>
                            <li>Open space (6x6 feet)</li>
                        </ul>
                    </div>
                    <div className="equipment-category">
                        <h5>Optional:</h5>
                        <ul>
                            <li>Chair for depth reference</li>
                            <li>Video recording device</li>
                            <li>2x4 board for modifications</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="instruction-sequence">
                <h4>Assessment Instructions</h4>
                <ol>
                    <li>Remove shoes and socks for accurate assessment</li>
                    <li>Stand with feet shoulder-width apart, toes pointing forward</li>
                    <li>Hold arms overhead in a narrow Y position</li>
                    <li>Squat as if sitting back into a chair to comfortable depth</li>
                    <li>Return to starting position with control</li>
                    <li>Repeat 5 times at natural pace (2-3 seconds down)</li>
                    <li>Focus straight ahead, maintain arm position throughout</li>
                </ol>
            </div>
        </div>
    );

    const renderAssessmentTab = () => (
        <div className="assessment-section">
            <div className="assessment-header">
                <h3>🎯 Movement Assessment</h3>
                <div className="rep-counter">
                    <span>Repetition: {assessmentData.currentRep} / {assessmentData.totalReps}</span>
                    <div className="view-selector">
                        <button
                            className={`view-btn ${assessmentData.overheadSquat.currentView === 'anterior' ? 'active' : ''}`}
                            onClick={() => setAssessmentData(prev => ({
                                ...prev,
                                overheadSquat: { ...prev.overheadSquat, currentView: 'anterior' }
                            }))}
                        >
                            Anterior View
                        </button>
                        <button
                            className={`view-btn ${assessmentData.overheadSquat.currentView === 'lateral' ? 'active' : ''}`}
                            onClick={() => setAssessmentData(prev => ({
                                ...prev,
                                overheadSquat: { ...prev.overheadSquat, currentView: 'lateral' }
                            }))}
                        >
                            Lateral View
                        </button>
                        <button
                            className={`view-btn ${assessmentData.overheadSquat.currentView === 'posterior' ? 'active' : ''}`}
                            onClick={() => setAssessmentData(prev => ({
                                ...prev,
                                overheadSquat: { ...prev.overheadSquat, currentView: 'posterior' }
                            }))}
                        >
                            Posterior View
                        </button>
                    </div>
                </div>
            </div>

            {assessmentData.overheadSquat.currentView === 'anterior' && (
                <div className="compensation-checkpoints">
                    <h4>Anterior View Checkpoints</h4>
                    {Object.entries(compensationData.anterior).map(([key, comp]) => (
                        <div key={key} className="compensation-item">
                            <div className="compensation-header">
                                <label className="compensation-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={assessmentData.overheadSquat.anteriorCompensations[key]?.present || false}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'anteriorCompensations', key, 'present', e.target.checked)}
                                    />
                                    <strong>{comp.name}</strong>
                                </label>

                                {assessmentData.overheadSquat.anteriorCompensations[key]?.present && (
                                    <select
                                        value={assessmentData.overheadSquat.anteriorCompensations[key]?.severity || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'anteriorCompensations', key, 'severity', e.target.value)}
                                        className="severity-select"
                                    >
                                        <option value="">Select Severity</option>
                                        <option value="Mild">Mild</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Severe">Severe</option>
                                    </select>
                                )}
                            </div>

                            <p className="compensation-description">{comp.description}</p>

                            {assessmentData.overheadSquat.anteriorCompensations[key]?.present && (
                                <div className="compensation-details">
                                    <div className="muscle-analysis">
                                        <div className="possible-causes">
                                            <strong>Possible Causes:</strong> {comp.possibleCauses.join(', ')}
                                        </div>
                                        <div className="corrective-actions">
                                            <strong>Corrective Actions:</strong> {comp.correctiveActions.join(', ')}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Additional notes..."
                                        value={assessmentData.overheadSquat.anteriorCompensations[key]?.notes || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'anteriorCompensations', key, 'notes', e.target.value)}
                                        className="notes-textarea"
                                        rows="2"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {assessmentData.overheadSquat.currentView === 'lateral' && (
                <div className="compensation-checkpoints">
                    <h4>Lateral View Checkpoints</h4>
                    {Object.entries(compensationData.lateral).map(([key, comp]) => (
                        <div key={key} className="compensation-item">
                            <div className="compensation-header">
                                <label className="compensation-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={assessmentData.overheadSquat.lateralCompensations[key]?.present || false}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'lateralCompensations', key, 'present', e.target.checked)}
                                    />
                                    <strong>{comp.name}</strong>
                                </label>

                                {assessmentData.overheadSquat.lateralCompensations[key]?.present && (
                                    <select
                                        value={assessmentData.overheadSquat.lateralCompensations[key]?.severity || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'lateralCompensations', key, 'severity', e.target.value)}
                                        className="severity-select"
                                    >
                                        <option value="">Select Severity</option>
                                        <option value="Mild">Mild</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Severe">Severe</option>
                                    </select>
                                )}
                            </div>

                            <p className="compensation-description">{comp.description}</p>

                            {assessmentData.overheadSquat.lateralCompensations[key]?.present && (
                                <div className="compensation-details">
                                    <div className="muscle-analysis">
                                        <div className="possible-causes">
                                            <strong>Possible Causes:</strong> {comp.possibleCauses.join(', ')}
                                        </div>
                                        <div className="corrective-actions">
                                            <strong>Corrective Actions:</strong> {comp.correctiveActions.join(', ')}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Additional notes..."
                                        value={assessmentData.overheadSquat.lateralCompensations[key]?.notes || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'lateralCompensations', key, 'notes', e.target.value)}
                                        className="notes-textarea"
                                        rows="2"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {assessmentData.overheadSquat.currentView === 'posterior' && (
                <div className="compensation-checkpoints">
                    <h4>Posterior View Checkpoints</h4>
                    {Object.entries(compensationData.posterior).map(([key, comp]) => (
                        <div key={key} className="compensation-item">
                            <div className="compensation-header">
                                <label className="compensation-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={assessmentData.overheadSquat.posteriorCompensations[key]?.present || false}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'posteriorCompensations', key, 'present', e.target.checked)}
                                    />
                                    <strong>{comp.name}</strong>
                                </label>

                                {assessmentData.overheadSquat.posteriorCompensations[key]?.present && (
                                    <select
                                        value={assessmentData.overheadSquat.posteriorCompensations[key]?.severity || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'posteriorCompensations', key, 'severity', e.target.value)}
                                        className="severity-select"
                                    >
                                        <option value="">Select Severity</option>
                                        <option value="Mild">Mild</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Severe">Severe</option>
                                    </select>
                                )}
                            </div>

                            <p className="compensation-description">{comp.description}</p>

                            {assessmentData.overheadSquat.posteriorCompensations[key]?.present && (
                                <div className="compensation-details">
                                    <div className="muscle-analysis">
                                        <div className="possible-causes">
                                            <strong>Possible Causes:</strong> {comp.possibleCauses.join(', ')}
                                        </div>
                                        <div className="corrective-actions">
                                            <strong>Corrective Actions:</strong> {comp.correctiveActions.join(', ')}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Additional notes..."
                                        value={assessmentData.overheadSquat.posteriorCompensations[key]?.notes || ''}
                                        onChange={(e) => handleCompensationChange('overheadSquat', 'posteriorCompensations', key, 'notes', e.target.value)}
                                        className="notes-textarea"
                                        rows="2"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderModificationsTab = () => (
        <div className="modifications-section">
            <div className="modifications-header">
                <h3>🔍 Testing Modifications</h3>
                <p>Use these modifications to determine root causes of compensations</p>
            </div>

            <div className="modification-tests">
                <div className="modification-card">
                    <h4>Heel Elevation Test</h4>
                    <p><strong>Purpose:</strong> Differentiate ankle mobility vs hip weakness in knee valgus</p>
                    <p><strong>Method:</strong> Place heels on 2-4 inch elevation, repeat assessment</p>

                    <label className="modification-checkbox">
                        <input
                            type="checkbox"
                            checked={assessmentData.overheadSquat.modificationsPerformed.heelElevation.performed}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                overheadSquat: {
                                    ...prev.overheadSquat,
                                    modificationsPerformed: {
                                        ...prev.overheadSquat.modificationsPerformed,
                                        heelElevation: { ...prev.overheadSquat.modificationsPerformed.heelElevation, performed: e.target.checked }
                                    }
                                }
                            }))}
                        />
                        Performed heel elevation test
                    </label>

                    {assessmentData.overheadSquat.modificationsPerformed.heelElevation.performed && (
                        <div className="modification-results">
                            <label>
                                Results:
                                <select
                                    value={assessmentData.overheadSquat.modificationsPerformed.heelElevation.results}
                                    onChange={(e) => setAssessmentData(prev => ({
                                        ...prev,
                                        overheadSquat: {
                                            ...prev.overheadSquat,
                                            modificationsPerformed: {
                                                ...prev.overheadSquat.modificationsPerformed,
                                                heelElevation: { ...prev.overheadSquat.modificationsPerformed.heelElevation, results: e.target.value }
                                            }
                                        }
                                    }))}
                                >
                                    <option value="">Select Result</option>
                                    <option value="significant_improvement">Significant Improvement</option>
                                    <option value="slight_improvement">Slight Improvement</option>
                                    <option value="no_improvement">No Improvement</option>
                                </select>
                            </label>

                            <div className="interpretation">
                                {assessmentData.overheadSquat.modificationsPerformed.heelElevation.results === 'significant_improvement' && (
                                    <div className="result-interpretation">
                                        <strong>Primary Cause:</strong> Ankle mobility restriction<br />
                                        <strong>Focus:</strong> Calf flexibility and ankle mobility
                                    </div>
                                )}
                                {assessmentData.overheadSquat.modificationsPerformed.heelElevation.results === 'no_improvement' && (
                                    <div className="result-interpretation">
                                        <strong>Primary Cause:</strong> Hip abductor weakness<br />
                                        <strong>Focus:</strong> Glute strengthening and activation
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modification-card">
                    <h4>Arms Down Test</h4>
                    <p><strong>Purpose:</strong> Differentiate lat tightness vs core weakness in low back arch</p>
                    <p><strong>Method:</strong> Remove overhead arm position, hands on hips, repeat assessment</p>

                    <label className="modification-checkbox">
                        <input
                            type="checkbox"
                            checked={assessmentData.overheadSquat.modificationsPerformed.armsDown.performed}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                overheadSquat: {
                                    ...prev.overheadSquat,
                                    modificationsPerformed: {
                                        ...prev.overheadSquat.modificationsPerformed,
                                        armsDown: { ...prev.overheadSquat.modificationsPerformed.armsDown, performed: e.target.checked }
                                    }
                                }
                            }))}
                        />
                        Performed arms down test
                    </label>

                    {assessmentData.overheadSquat.modificationsPerformed.armsDown.performed && (
                        <div className="modification-results">
                            <label>
                                Results:
                                <select
                                    value={assessmentData.overheadSquat.modificationsPerformed.armsDown.results}
                                    onChange={(e) => setAssessmentData(prev => ({
                                        ...prev,
                                        overheadSquat: {
                                            ...prev.overheadSquat,
                                            modificationsPerformed: {
                                                ...prev.overheadSquat.modificationsPerformed,
                                                armsDown: { ...prev.overheadSquat.modificationsPerformed.armsDown, results: e.target.value }
                                            }
                                        }
                                    }))}
                                >
                                    <option value="">Select Result</option>
                                    <option value="arch_disappears">Low Back Arch Disappears</option>
                                    <option value="partial_improvement">Partial Improvement</option>
                                    <option value="still_arches">Still Arches</option>
                                </select>
                            </label>

                            <div className="interpretation">
                                {assessmentData.overheadSquat.modificationsPerformed.armsDown.results === 'arch_disappears' && (
                                    <div className="result-interpretation">
                                        <strong>Primary Cause:</strong> Latissimus dorsi tightness<br />
                                        <strong>Focus:</strong> Lat flexibility and shoulder mobility
                                    </div>
                                )}
                                {assessmentData.overheadSquat.modificationsPerformed.armsDown.results === 'still_arches' && (
                                    <div className="result-interpretation">
                                        <strong>Primary Cause:</strong> Core weakness and hip flexor tightness<br />
                                        <strong>Focus:</strong> Core strengthening and hip flexor mobility
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAnalysisTab = () => {
        const presentCompensations = [
            ...Object.entries(assessmentData.overheadSquat.anteriorCompensations).filter(([_, comp]) => comp.severity && comp.severity !== 'none'),
            ...Object.entries(assessmentData.overheadSquat.lateralCompensations).filter(([_, comp]) => comp.severity && comp.severity !== 'none'),
            ...Object.entries(assessmentData.overheadSquat.posteriorCompensations).filter(([_, comp]) => comp.severity && comp.severity !== 'none')
        ];

        const phaseRecommendation = determineStartingPhase();

        return (
            <div className="analysis-section">
                <div className="analysis-header">
                    <h3>📊 Assessment Analysis & Recommendations</h3>
                </div>

                <div className="compensation-summary">
                    <h4>Compensation Summary</h4>
                    <div className="summary-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Compensations:</span>
                            <span className="stat-value">{assessmentData.compensationCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Severity Score:</span>
                            <span className="stat-value">{assessmentData.severityScore}</span>
                        </div>
                    </div>
                </div>

                {presentCompensations.length > 0 && (
                    <div className="corrective-prescriptions">
                        <h4>4-Phase Corrective Exercise Prescription</h4>
                        {presentCompensations.map(([key, compensation]) => {
                            const compData = anteriorCompensations[key] || lateralCompensations[key] || posteriorCompensations[key];
                            if (!compData) return null;

                            return (
                                <div key={key} className="corrective-card">
                                    <h5>{compData.name}</h5>
                                    <div className="corrective-phases">
                                        <div className="phase-section">
                                            <strong>1. INHIBIT (SMR):</strong>
                                            <ul>
                                                {compData.correctives.inhibit.map(exercise => (
                                                    <li key={exercise}>{exercise}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="phase-section">
                                            <strong>2. LENGTHEN (Static Stretch):</strong>
                                            <ul>
                                                {compData.correctives.lengthen.map(exercise => (
                                                    <li key={exercise}>{exercise}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="phase-section">
                                            <strong>3. ACTIVATE (Isolated Strengthening):</strong>
                                            <ul>
                                                {compData.correctives.activate.map(exercise => (
                                                    <li key={exercise}>{exercise}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="phase-section">
                                            <strong>4. INTEGRATE (Functional Movement):</strong>
                                            <ul>
                                                {compData.correctives.integrate.map(exercise => (
                                                    <li key={exercise}>{exercise}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="phase-recommendation">
                    <h4>Starting OPT Phase Recommendation</h4>
                    <div className="recommendation-card">
                        <div className="phase-header">
                            <h5>{phaseRecommendation.phase}</h5>
                            <span className="duration">{phaseRecommendation.duration}</span>
                        </div>
                        <div className="recommendation-details">
                            <p><strong>Focus:</strong> {phaseRecommendation.focus}</p>
                            <p><strong>Corrective Volume:</strong> {phaseRecommendation.correctiveVolume}</p>
                            <p><strong>Reasoning:</strong> {phaseRecommendation.reasoning}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Single-Leg Squat Assessment
    const renderSingleLegAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'single-leg');
        const compensations = [
            {
                id: 'kneeValgus',
                name: 'Knee Moves Inward (Valgus)',
                description: 'Knee adducts and internally rotates during squat',
                overactive: 'Adductor complex, TFL, Vastus lateralis',
                underactive-text: 'Gluteus medius/maximus, VMO',
                selected: assessmentData.singleLegSquat[`${activeSide}Leg`].kneeValgus.present
            },
            {
                id: 'excessiveForwardLean',
                name: 'Excessive Forward Lean',
                description: 'Torso leans forward excessively during movement',
                overactive: 'Hip flexors, Gastrocnemius/Soleus',
                underactive-text: 'Gluteus maximus, Anterior tibialis',
                selected: assessmentData.singleLegSquat[`${activeSide}Leg`].excessiveForwardLean.present
            },
            {
                id: 'hipHike',
                name: 'Hip Hike',
                description: 'Hip elevation on non-stance side',
                overactive: 'Quadratus lumborum, TFL',
                underactive-text: 'Gluteus medius (stance side)',
                selected: assessmentData.singleLegSquat[`${activeSide}Leg`].hipHike.present
            }
        ];

        const toggleCompensation = (compId) => {
            const currentValue = assessmentData.singleLegSquat[`${activeSide}Leg`][compId].present;
            handleCompensationChange('singleLegSquat', `${activeSide}Leg`, compId, 'present', !currentValue);
        };

        const hasCompensations = compensations.some(comp => comp.selected);

        const saveAndContinue = () => {
            saveAssessmentData(selectedAssessment, assessmentData.singleLegSquat);
            completeCurrentAssessment(assessmentData.singleLegSquat);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const clearAssessment = () => {
            setAssessmentData(prev => ({
                ...prev,
                singleLegSquat: {
                    ...prev.singleLegSquat,
                    rightLeg: {
                        kneeValgus: { present: false, severity: '', notes: '' },
                        excessiveForwardLean: { present: false, severity: '', notes: '' },
                        hipHike: { present: false, severity: '', notes: '' }
                    },
                    leftLeg: {
                        kneeValgus: { present: false, severity: '', notes: '' },
                        excessiveForwardLean: { present: false, severity: '', notes: '' },
                        hipHike: { present: false, severity: '', notes: '' }
                    }
                }
            }));
        };

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">🦵</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge">{assessmentInfo?.type}</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Reps</span>
                            <span className="stat-value">5 per side</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Views</span>
                            <span className="stat-value">Anterior</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~3-4 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Hands on hips, eyes forward, stance foot pointing straight ahead</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">Single-leg squat to comfortable depth, up to 5 reps per side at natural pace</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Knee tracking should align with 2nd-3rd toes. Watch for compensation patterns</p>
                        </div>
                    </div>
                </div>

                <div className="compensation-section">
                    <h3>Movement Compensations</h3>

                    <div className="side-selector">
                        <button
                            className={`side-btn ${activeSide === 'right' ? 'active' : ''}`}
                            onClick={() => setActiveSide('right')}
                        >
                            Right Side
                        </button>
                        <button
                            className={`side-btn ${activeSide === 'left' ? 'active' : ''}`}
                            onClick={() => setActiveSide('left')}
                        >
                            Left Side
                        </button>
                    </div>

                    <div className="compensation-grid">
                        {compensations.map(comp => (
                            <div
                                key={comp.id}
                                className={`compensation-card ${comp.selected ? 'selected' : ''}`}
                                onClick={() => toggleCompensation(comp.id)}
                            >
                                <div className="comp-checkbox">
                                    {comp.selected ? '✅' : '⬜'}
                                </div>
                                <div className="comp-content">
                                    <h4>{comp.name}</h4>
                                    <p className="comp-description">{comp.description}</p>
                                    <div className="comp-muscles">
                                        <span className="overactive">Overactive: {comp.overactive}</span>
                                        <span className="underactive-text">underactive-text: {comp.underactive-text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={clearAssessment}
                    >
                        Clear All
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={saveAndContinue}
                    >
                        {hasCompensations ? 'Save & Continue' : 'Save & Continue'}
                    </button>
                </div>
            </div>
        );
    };

    // Pushing Assessment
    const renderPushingAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'pushing');
        const compensations = [
            {
                id: 'lowBackArch',
                name: 'Low-Back Arches',
                description: 'Excessive lumbar extension during pushing movement',
                overactive: 'Hip flexors, Erector spinae',
                underactive-text: 'Intrinsic core stabilizers',
                selected: assessmentData.pushingAssessment.compensations.lowBackArch.present
            },
            {
                id: 'shoulderElevation',
                name: 'Shoulder Elevation',
                description: 'Shoulders elevate during pushing movement',
                overactive: 'Upper trapezius, Levator scapulae',
                underactive-text: 'Mid/Lower trapezius',
                selected: assessmentData.pushingAssessment.compensations.shoulderElevation.present
            },
            {
                id: 'headForward',
                name: 'Head Migrates Forward',
                description: 'Forward head posture during pushing movement',
                overactive: 'Upper trapezius, SCM, Levator scapulae',
                underactive-text: 'Deep cervical flexors',
                selected: assessmentData.pushingAssessment.compensations.headForward.present
            }
        ];

        const toggleCompensation = (compId) => {
            const currentValue = assessmentData.pushingAssessment.compensations[compId].present;
            handleCompensationChange('pushingAssessment', 'compensations', compId, 'present', !currentValue);
        };

        const hasCompensations = compensations.some(comp => comp.selected);

        const saveAndContinue = () => {
            saveAssessmentData(selectedAssessment, assessmentData.pushingAssessment);
            completeCurrentAssessment(assessmentData.pushingAssessment);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const clearAssessment = () => {
            setAssessmentData(prev => ({
                ...prev,
                pushingAssessment: {
                    ...prev.pushingAssessment,
                    compensations: {
                        lowBackArch: { present: false, severity: '', notes: '' },
                        shoulderElevation: { present: false, severity: '', notes: '' },
                        headForward: { present: false, severity: '', notes: '' }
                    }
                }
            }));
        };

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">👐</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge">{assessmentInfo?.type}</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Reps</span>
                            <span className="stat-value">20</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Views</span>
                            <span className="stat-value">Lateral</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~3-4 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Split-stance, core braced, cable/band at shoulder height</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">20 controlled reps, press handles forward and return to start position</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Watch LPHC stability, shoulder complex position, and head alignment</p>
                        </div>
                    </div>
                </div>

                <div className="compensation-section">
                    <h3>Movement Compensations</h3>

                    <div className="compensation-grid">
                        {compensations.map(comp => (
                            <div
                                key={comp.id}
                                className={`compensation-card ${comp.selected ? 'selected' : ''}`}
                                onClick={() => toggleCompensation(comp.id)}
                            >
                                <div className="comp-checkbox">
                                    {comp.selected ? '✅' : '⬜'}
                                </div>
                                <div className="comp-content">
                                    <h4>{comp.name}</h4>
                                    <p className="comp-description">{comp.description}</p>
                                    <div className="comp-muscles">
                                        <span className="overactive">Overactive: {comp.overactive}</span>
                                        <span className="underactive-text">underactive-text: {comp.underactive-text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={clearAssessment}
                    >
                        Clear All
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={saveAndContinue}
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        );
    };

    // Pulling Assessment
    const renderPullingAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'pulling');
        const compensations = [
            {
                id: 'lowBackArch',
                name: 'Low-Back Arches',
                description: 'Excessive lumbar extension during pulling movement',
                overactive: 'Hip flexors, Erector spinae',
                underactive-text: 'Intrinsic core stabilizers',
                selected: assessmentData.pullingAssessment.compensations.lowBackArch.present
            },
            {
                id: 'shoulderElevation',
                name: 'Shoulder Elevation',
                description: 'Shoulders elevate during pulling movement',
                overactive: 'Upper trapezius, Levator scapulae',
                underactive-text: 'Mid/Lower trapezius',
                selected: assessmentData.pullingAssessment.compensations.shoulderElevation.present
            },
            {
                id: 'headForward',
                name: 'Head Protrudes Forward',
                description: 'Forward head posture during pulling movement',
                overactive: 'Upper trapezius, SCM, Levator scapulae',
                underactive-text: 'Deep cervical flexors',
                selected: assessmentData.pullingAssessment.compensations.headForward.present
            }
        ];

        const toggleCompensation = (compId) => {
            const currentValue = assessmentData.pullingAssessment.compensations[compId].present;
            handleCompensationChange('pullingAssessment', 'compensations', compId, 'present', !currentValue);
        };

        const hasCompensations = compensations.some(comp => comp.selected);

        const saveAndContinue = () => {
            saveAssessmentData(selectedAssessment, assessmentData.pullingAssessment);
            completeCurrentAssessment(assessmentData.pullingAssessment);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const clearAssessment = () => {
            setAssessmentData(prev => ({
                ...prev,
                pullingAssessment: {
                    ...prev.pullingAssessment,
                    compensations: {
                        lowBackArch: { present: false, severity: '', notes: '' },
                        shoulderElevation: { present: false, severity: '', notes: '' },
                        headForward: { present: false, severity: '', notes: '' }
                    }
                }
            }));
        };

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">🪄</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge">{assessmentInfo?.type}</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Reps</span>
                            <span className="stat-value">20</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Views</span>
                            <span className="stat-value">Lateral</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~3-4 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Feet shoulder-width apart, core braced, cable/band at shoulder height</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">Pull handles to torso, 20 controlled reps with controlled return</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Watch LPHC stability, shoulder complex retraction, and head alignment</p>
                        </div>
                    </div>
                </div>

                <div className="compensation-section">
                    <h3>Movement Compensations</h3>

                    <div className="compensation-grid">
                        {compensations.map(comp => (
                            <div
                                key={comp.id}
                                className={`compensation-card ${comp.selected ? 'selected' : ''}`}
                                onClick={() => toggleCompensation(comp.id)}
                            >
                                <div className="comp-checkbox">
                                    {comp.selected ? '✅' : '⬜'}
                                </div>
                                <div className="comp-content">
                                    <h4>{comp.name}</h4>
                                    <p className="comp-description">{comp.description}</p>
                                    <div className="comp-muscles">
                                        <span className="overactive">Overactive: {comp.overactive}</span>
                                        <span className="underactive-text">underactive-text: {comp.underactive-text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={clearAssessment}
                    >
                        Clear All
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={saveAndContinue}
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        );
    };

    // Optional Assessment Components
    const renderOverheadPressAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'overhead-press');

        const markComplete = () => {
            const completionData = {
                completed: true,
                completedAt: new Date().toISOString(),
                notes: 'Basic overhead movement pattern assessment completed'
            };
            saveAssessmentData(selectedAssessment, completionData);
            completeCurrentAssessment(completionData);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const isCompleted = completedAssessments.includes('overhead-press');

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">🙌</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge optional">Optional</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Reps</span>
                            <span className="stat-value">10-15</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Views</span>
                            <span className="stat-value">All Planes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~2-3 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Seated or standing position, dumbbells or bodyweight resistance</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">Press overhead with controlled tempo, 10-15 repetitions</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Monitor shoulder elevation, forward head posture, and low back arch</p>
                        </div>
                    </div>
                </div>

                <div className="optional-info-card">
                    <h3>Assessment Focus Areas</h3>
                    <div className="focus-grid">
                        <div className="focus-item">
                            <span className="focus-icon">🏋️</span>
                            <span className="focus-text">Shoulder Stability</span>
                        </div>
                        <div className="focus-item">
                            <span className="focus-icon">📐</span>
                            <span className="focus-text">Overhead Range</span>
                        </div>
                        <div className="focus-item">
                            <span className="focus-icon">🔄</span>
                            <span className="focus-text">Movement Quality</span>
                        </div>
                        <div className="focus-item">
                            <span className="focus-icon">⚖️</span>
                            <span className="focus-text">Postural Control</span>
                        </div>
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={markComplete}
                        disabled={isCompleted}
                    >
                        {isCompleted ? '✅ Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        );
    };

    const renderStarBalanceAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'star-balance');

        const markComplete = () => {
            const completionData = {
                completed: true,
                completedAt: new Date().toISOString(),
                notes: 'Multi-directional balance assessment completed'
            };
            saveAssessmentData(selectedAssessment, completionData);
            completeCurrentAssessment(completionData);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const isCompleted = completedAssessments.includes('star-balance');

        const directions = [
            { name: 'Forward', icon: '⬆️' },
            { name: 'Forward-Right', icon: '↗️' },
            { name: 'Right', icon: '➡️' },
            { name: 'Back-Right', icon: '↘️' },
            { name: 'Backward', icon: '⬇️' },
            { name: 'Back-Left', icon: '↙️' },
            { name: 'Left', icon: '⬅️' },
            { name: 'Forward-Left', icon: '↖️' }
        ];

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">⭐</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge optional">Optional</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Directions</span>
                            <span className="stat-value">8 Ways</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Each Leg</span>
                            <span className="stat-value">3 Trials</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~5-6 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Single-leg stance, hands on hips, establish balance</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">Reach opposite leg in 8 directions, return to center</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Balance maintenance, compensation patterns, reach distance</p>
                        </div>
                    </div>
                </div>

                <div className="directions-card">
                    <h3>Movement Directions</h3>
                    <div className="directions-grid">
                        {directions.map((direction, index) => (
                            <div key={index} className="direction-item">
                                <span className="direction-icon">{direction.icon}</span>
                                <span className="direction-name">{direction.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={markComplete}
                        disabled={isCompleted}
                    >
                        {isCompleted ? '✅ Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        );
    };

    const renderGaitAnalysisAssessment = () => {
        const assessmentInfo = assessmentConfig.find(a => a.id === 'gait-analysis');

        const markComplete = () => {
            const completionData = {
                completed: true,
                completedAt: new Date().toISOString(),
                notes: 'Gait pattern analysis completed'
            };
            saveAssessmentData(selectedAssessment, completionData);
            completeCurrentAssessment(completionData);
        };

        const skipAssessment = () => {
            completeCurrentAssessment({});
        };

        const isCompleted = completedAssessments.includes('gait-analysis');

        const gaitPhases = [
            { phase: 'Initial Contact', description: 'Heel strike, foot position', icon: '👠' },
            { phase: 'Loading Response', description: 'Weight acceptance, knee flexion', icon: '⚖️' },
            { phase: 'Mid Stance', description: 'Single leg support, hip stability', icon: '🏃' },
            { phase: 'Terminal Stance', description: 'Heel off, push-off preparation', icon: '🦵' },
            { phase: 'Pre-swing', description: 'Toe off, hip flexion initiation', icon: '🔄' },
            { phase: 'Swing Phase', description: 'Leg advancement, clearance', icon: '🌊' }
        ];

        return (
            <div className="assessment-page">
                <button className="back-button" onClick={backToSelection}>
                    ← Back to Assessment Selection
                </button>

                <div className="assessment-header">
                    <div className="header-content">
                        <h1 className="assessment-title">
                            <span className="icon">🚶‍♂️</span>
                            {assessmentInfo?.name}
                        </h1>
                        <span className="assessment-badge optional">Optional</span>
                    </div>

                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Distance</span>
                            <span className="stat-value">10-20 steps</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Speeds</span>
                            <span className="stat-value">Walk & Jog</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className="stat-value">~4-5 min</span>
                        </div>
                    </div>
                </div>

                <div className="protocol-card">
                    <h3>Assessment Protocol</h3>

                    <div className="protocol-grid">
                        <div className="protocol-item">
                            <span className="protocol-label">Setup</span>
                            <p className="protocol-text">Clear pathway, comfortable footwear, natural pace</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Movement</span>
                            <p className="protocol-text">Walk and jog naturally, multiple passes for observation</p>
                        </div>

                        <div className="protocol-item">
                            <span className="protocol-label">Observation</span>
                            <p className="protocol-text">Foot strike pattern, knee tracking, hip stability, arm swing</p>
                        </div>
                    </div>
                </div>

                <div className="gait-phases-card">
                    <h3>Gait Cycle Analysis</h3>
                    <div className="gait-phases-grid">
                        {gaitPhases.map((item, index) => (
                            <div key={index} className="gait-phase-item">
                                <span className="phase-icon">{item.icon}</span>
                                <div className="phase-content">
                                    <h4>{item.phase}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="assessment-actions">
                    <button
                        className="action-btn secondary"
                        onClick={skipAssessment}
                    >
                        Skip This Assessment
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={markComplete}
                        disabled={isCompleted}
                    >
                        {isCompleted ? '✅ Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        );
    };

    // Render Selected Assessment Function
    const renderSelectedAssessment = () => {
        if (!selectedAssessment) return null;

        switch (selectedAssessment) {
            case 'overhead-squat':
                return (
                    <div className="selected-assessment-container">
                        <div className="assessment-header">
                            <h3>🏋️‍♂️ Overhead Squat Assessment</h3>
                            <p>NASM primary transitional movement screen</p>
                        </div>

                        {/* Assessment Navigation Tabs */}
                        <div className="assessment-tabs">
                            <button
                                className={`assessment-tab ${currentTab === 'setup' ? 'active' : ''}`}
                                onClick={() => setCurrentTab('setup')}
                            >
                                <span className="tab-icon">⚙️</span>
                                <span className="tab-name">Setup</span>
                            </button>
                            <button
                                className={`assessment-tab ${currentTab === 'assessment' ? 'active' : ''}`}
                                onClick={() => setCurrentTab('assessment')}
                            >
                                <span className="tab-icon">🏃‍♂️</span>
                                <span className="tab-name">Assessment</span>
                            </button>
                            <button
                                className={`assessment-tab ${currentTab === 'modifications' ? 'active' : ''}`}
                                onClick={() => setCurrentTab('modifications')}
                            >
                                <span className="tab-icon">🔍</span>
                                <span className="tab-name">Modifications</span>
                            </button>
                            <button
                                className={`assessment-tab ${currentTab === 'analysis' ? 'active' : ''}`}
                                onClick={() => setCurrentTab('analysis')}
                            >
                                <span className="tab-icon">📊</span>
                                <span className="tab-name">Analysis</span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {currentTab === 'setup' && renderSetupTab()}
                            {currentTab === 'assessment' && renderAssessmentTab()}
                            {currentTab === 'modifications' && renderModificationsTab()}
                            {currentTab === 'analysis' && renderAnalysisTab()}
                        </div>

                        {/* Assessment Actions */}
                        <div className="assessment-actions">
                            <button
                                className="btn-complete-assessment"
                                onClick={() => completeCurrentAssessment(assessmentData)}
                            >
                                {completedAssessments.includes(selectedAssessment) ? 'Update & Return' : 'Complete Assessment'}
                            </button>
                        </div>
                    </div>
                );
            case 'single-leg':
                return renderSingleLegAssessment();
            case 'pushing':
                return renderPushingAssessment();
            case 'pulling':
                return renderPullingAssessment();
            case 'overhead-press':
                return renderOverheadPressAssessment();
            case 'star-balance':
                return renderStarBalanceAssessment();
            case 'gait-analysis':
                return renderGaitAnalysisAssessment();
            default:
                return <div className="assessment-placeholder">Assessment not found</div>;
        }
    };

    // Handle assessment completion
    const handleAssessmentComplete = () => {
        if (!canProceed) {
            showWarning(`Please complete all required assessments. ${completedRequired}/${requiredAssessments.length} completed.`);
            return;
        }

        const finalResults = {
            compensations: assessmentData,
            phaseRecommendation: determineStartingPhase(),
            methodology: 'NASM_OHSA',
            timestamp: new Date().toISOString(),
            compensationCount: assessmentData.compensationCount,
            severityScore: assessmentData.severityScore,
            completedAssessments,
            selectedQuickTags,
            additionalNotes,
            summary: {
                totalAssessments: assessmentConfig.length,
                completedAssessments: completedAssessments.length,
                requiredCompleted: completedRequired,
                requiredTotal: requiredAssessments.length,
                canProceed
            }
        };

        // Save assessment results to context
        actions.setAssessmentData({
            ...state.assessmentData,
            step: 4,
            movementAssessment: finalResults,
            timestamp: new Date().toISOString()
        });

        // Move to next step
        actions.setCurrentStep(5);
    };

    const renderOverheadSquatAssessment = () => {
        const assessment = nasmMovementAssessments.overhead_squat;

        return (
            <div className="nasm-assessment-section">
                <h3>{assessment.name}</h3>
                <p className="assessment-purpose">{assessment.purpose}</p>

                <div className="assessment-procedure">
                    <h4>Setup & Procedure:</h4>
                    <ul>
                        <li>Setup: {assessment.procedure.setup}</li>
                        <li>Position: {assessment.procedure.position}</li>
                        <li>Movement: {assessment.procedure.movement}</li>
                        <li>Views: {assessment.procedure.views.join(', ')}</li>
                    </ul>
                </div>

                <div className="compensations-checklist">
                    <h4>Compensation Checklist:</h4>
                    {Object.entries(assessment.compensations).map(([key, compensation]) => (
                        <div key={key} className="compensation-item">
                            <label className="compensation-label">
                                <input
                                    type="checkbox"
                                    checked={assessmentResults.overheadSquat[key] || false}
                                    onChange={(e) => handleCompensationSelect('overheadSquat', key, e.target.checked)}
                                />
                                <span className="compensation-name">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </label>

                            {assessmentResults.overheadSquat[key] && (
                                <div className="correction-strategy">
                                    <h5>Corrective Strategy:</h5>
                                    <div className="corrections">
                                        <div className="smr">
                                            <strong>SMR:</strong> {compensation.corrections.smr.join(', ')}
                                        </div>
                                        <div className="stretch">
                                            <strong>Stretch:</strong> {compensation.corrections.stretch.join(', ')}
                                        </div>
                                        <div className="activation">
                                            <strong>Activation:</strong> {compensation.corrections.activation.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSingleLegSquatAssessment = () => {
        const assessment = nasmMovementAssessments.single_leg_squat;

        return (
            <div className="nasm-assessment-section">
                <h3>{assessment.name}</h3>
                <p className="assessment-purpose">{assessment.purpose}</p>

                <div className="assessment-procedure">
                    <h4>Setup & Procedure:</h4>
                    <ul>
                        <li>Setup: {assessment.procedure.setup}</li>
                        <li>Movement: {assessment.procedure.movement}</li>
                        <li>Observation: {assessment.procedure.observation}</li>
                    </ul>
                </div>

                <div className="compensations-checklist">
                    <h4>Primary Compensation:</h4>
                    {Object.entries(assessment.compensations).map(([key, compensation]) => (
                        <div key={key} className="compensation-item">
                            <label className="compensation-label">
                                <input
                                    type="checkbox"
                                    checked={assessmentResults.singleLegSquat[key] || false}
                                    onChange={(e) => handleCompensationSelect('singleLegSquat', key, e.target.checked)}
                                />
                                <span className="compensation-name">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </label>

                            {assessmentResults.singleLegSquat[key] && (
                                <div className="correction-strategy">
                                    <h5>Corrective Strategy:</h5>
                                    <div className="corrections">
                                        <div className="smr">
                                            <strong>SMR:</strong> {compensation.corrections.smr.join(', ')}
                                        </div>
                                        <div className="stretch">
                                            <strong>Stretch:</strong> {compensation.corrections.stretch.join(', ')}
                                        </div>
                                        <div className="activation">
                                            <strong>Activation:</strong> {compensation.corrections.activation.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAssessmentTabs = () => {
        const tabs = [
            { id: 'overhead_squat', name: 'Overhead Squat', icon: '🏃' },
            { id: 'single_leg_squat', name: 'Single-Leg Squat', icon: '🦵' },
            { id: 'pushing', name: 'Pushing Assessment', icon: '💪' },
            { id: 'pulling', name: 'Pulling Assessment', icon: '🤝' }
        ];

        return (
            <div className="assessment-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`assessment-tab ${currentAssessment === tab.id ? 'active' : ''}`}
                        onClick={() => setCurrentAssessment(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-name">{tab.name}</span>
                    </button>
                ))}
            </div>
        );
    };

    const renderCurrentAssessment = () => {
        switch (currentAssessment) {
            case 'overhead_squat':
                return renderOverheadSquatAssessment();
            case 'single_leg_squat':
                return renderSingleLegSquatAssessment();
            case 'pushing':
                return <div className="assessment-placeholder">Pushing Assessment - Coming Soon</div>;
            case 'pulling':
                return <div className="assessment-placeholder">Pulling Assessment - Coming Soon</div>;
            default:
                return renderOverheadSquatAssessment();
        }
    };

    return (
        <div className="nasm-movement-assessment-step">
            {/* Main Content - Switch between Selection and Assessment Views */}
            {currentView === 'selection' ? (
                <AssessmentSelectionScreen />
            ) : (
                <div className="individual-assessment-view">
                    {/* Back Navigation */}
                    <div className="assessment-back-nav">
                        <button
                            className="btn-back-to-selection"
                            onClick={backToSelection}
                        >
                            ← Back to Assessment Selection
                        </button>
                    </div>

                    {/* Individual Assessment Content */}
                    {renderSelectedAssessment()}
                </div>
            )}

            {/* Global Navigation */}
            <div className="navigation-section">
                <div className="nav-buttons">
                    <button
                        onClick={() => actions.setCurrentStep(3)}
                        className="btn-secondary"
                    >
                        ← Step 3: Static Posture
                    </button>

                    <button
                        onClick={handleAssessmentComplete}
                        className="btn-primary"
                        disabled={!canProceed}
                    >
                        Complete Movement Assessment → Step 5
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NASMMovementAssessmentStep;
