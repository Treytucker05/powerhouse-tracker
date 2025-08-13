/**
 * NASM Movement Assessment Analysis Functions
 * Based on NASM-CPT 7th Edition, Chapter 6, Tables 6-12 through 6-15
 * Provides muscle imbalance analysis for movement compensations
 */

/**
 * NASM Table 6-12: Overhead Squat Assessment
 * Analyzes compensations during overhead squat movement
 */
export const overheadSquatCompensations = {
    // Front View Compensations
    feetTurnOut: {
        overactive: [
            { muscle: 'Soleus', reason: 'Limited ankle dorsiflexion' },
            { muscle: 'Lateral Gastrocnemius', reason: 'Compensates for ankle mobility' },
            { muscle: 'Biceps Femoris (short head)', reason: 'Hip external rotation dominance' }
        ],
        underactive: [
            { muscle: 'Medial Gastrocnemius', reason: 'Weakness in ankle stabilization' },
            { muscle: 'Medial Hamstring Complex', reason: 'Poor posterior chain activation' },
            { muscle: 'Gracilis', reason: 'Adduction weakness' },
            { muscle: 'Sartorius', reason: 'Hip flexion and internal rotation deficit' },
            { muscle: 'Popliteus', reason: 'Knee stability compromise' }
        ]
    },

    kneesMoveinward: {
        overactive: [
            { muscle: 'Adductor Complex', reason: 'Excessive hip adduction' },
            { muscle: 'Biceps Femoris (short head)', reason: 'External rotation dominance' },
            { muscle: 'TFL (Tensor Fasciae Latae)', reason: 'Compensatory hip stabilization' },
            { muscle: 'Vastus Lateralis', reason: 'Lateral knee tracking' }
        ],
        underactive: [
            { muscle: 'Gluteus Medius', reason: 'Hip abduction weakness' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension deficit' },
            { muscle: 'Vastus Medialis Oblique', reason: 'Medial knee stability loss' }
        ]
    },

    // Side View Compensations
    excessiveForwardLean: {
        overactive: [
            { muscle: 'Soleus', reason: 'Ankle dorsiflexion restriction' },
            { muscle: 'Gastrocnemius', reason: 'Posterior ankle tightness' },
            { muscle: 'Hip Flexor Complex', reason: 'Anterior hip tightness' },
            { muscle: 'Abdominal Complex', reason: 'Excessive anterior pull' }
        ],
        underactive: [
            { muscle: 'Anterior Tibialis', reason: 'Dorsiflexion weakness' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension deficit' },
            { muscle: 'Erector Spinae', reason: 'Posterior chain weakness' }
        ]
    },

    lowBackArches: {
        overactive: [
            { muscle: 'Hip Flexor Complex', reason: 'Anterior pelvic tilt' },
            { muscle: 'Erector Spinae', reason: 'Lumbar hyperextension compensation' },
            { muscle: 'Latissimus Dorsi', reason: 'Shoulder extension restriction' }
        ],
        underactive: [
            { muscle: 'Gluteus Maximus', reason: 'Hip extension weakness' },
            { muscle: 'Hamstring Complex', reason: 'Posterior pelvic tilt deficit' },
            { muscle: 'Intrinsic Core Stabilizers', reason: 'Core stability compromise' }
        ]
    },

    armsFallForward: {
        overactive: [
            { muscle: 'Latissimus Dorsi', reason: 'Shoulder extension/adduction restriction' },
            { muscle: 'Teres Major', reason: 'Posterior shoulder tightness' },
            { muscle: 'Pectoralis Major/Minor', reason: 'Anterior shoulder restriction' }
        ],
        underactive: [
            { muscle: 'Mid/Lower Trapezius', reason: 'Scapular retraction weakness' },
            { muscle: 'Rhomboids', reason: 'Scapular stabilization deficit' },
            { muscle: 'Posterior Deltoid', reason: 'Posterior shoulder weakness' }
        ]
    }
};

/**
 * NASM Table 6-13: Single-Leg Squat Assessment
 * Analyzes knee valgus during single-leg movement
 */
export const singleLegSquatCompensations = {
    kneeValgus: {
        overactive: [
            { muscle: 'Adductor Complex', reason: 'Excessive hip adduction' },
            { muscle: 'Biceps Femoris (short head)', reason: 'External rotation dominance' },
            { muscle: 'TFL', reason: 'Compensatory hip stabilization' },
            { muscle: 'Vastus Lateralis', reason: 'Lateral knee tracking' }
        ],
        underactive: [
            { muscle: 'Gluteus Medius', reason: 'Hip abduction and stabilization weakness' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension and external rotation deficit' },
            { muscle: 'Vastus Medialis Oblique', reason: 'Medial knee stability loss' }
        ]
    },

    // NEW: Enhanced compensation patterns based on research
    hipHike: {
        overactive: [
            { muscle: 'Quadratus Lumborum', reason: 'Compensatory hip elevation' },
            { muscle: 'TFL (Tensor Fasciae Latae)', reason: 'Hip flexor compensation' },
            { muscle: 'Latissimus Dorsi', reason: 'Lateral trunk pull' }
        ],
        underactive: [
            { muscle: 'Gluteus Medius', reason: 'Hip stabilization weakness' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension deficit' },
            { muscle: 'Intrinsic Core Stabilizers', reason: 'Core stability compromise' }
        ]
    },

    hipDrop: {
        overactive: [
            { muscle: 'Adductor Complex', reason: 'Compensatory hip adduction' },
            { muscle: 'Psoas', reason: 'Hip flexor dominance' },
            { muscle: 'Piriformis', reason: 'Deep hip rotator compensation' }
        ],
        underactive: [
            { muscle: 'Gluteus Medius', reason: 'Hip abduction weakness (primary cause)' },
            { muscle: 'Gluteus Maximus', reason: 'Hip stabilization deficit' },
            { muscle: 'Intrinsic Core Stabilizers', reason: 'Core instability' }
        ]
    }
};

/**
 * NASM Table 6-14: Pushing Assessment
 * Analyzes compensations during pushing movements
 */
export const pushingCompensations = {
    lowBackArches: {
        overactive: [
            { muscle: 'Hip Flexors', reason: 'Anterior pelvic tilt during push' },
            { muscle: 'Erector Spinae', reason: 'Lumbar hyperextension compensation' }
        ],
        underactive: [
            { muscle: 'Intrinsic Core Stabilizers', reason: 'Core stability during pushing' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension stability' }
        ]
    },

    shoulderElevation: {
        overactive: [
            { muscle: 'Upper Trapezius', reason: 'Compensatory shoulder elevation' },
            { muscle: 'Sternocleidomastoid', reason: 'Neck tension during effort' },
            { muscle: 'Levator Scapulae', reason: 'Scapular elevation pattern' }
        ],
        underactive: [
            { muscle: 'Lower Trapezius', reason: 'Scapular depression weakness' },
            { muscle: 'Serratus Anterior', reason: 'Scapular protraction deficit' },
            { muscle: 'Latissimus Dorsi', reason: 'Scapular stabilization compromise' }
        ]
    },

    headMigratesForward: {
        overactive: [
            { muscle: 'Upper Trapezius', reason: 'Forward head posture' },
            { muscle: 'Sternocleidomastoid', reason: 'Cervical flexion compensation' },
            { muscle: 'Levator Scapulae', reason: 'Cervical extension restriction' }
        ],
        underactive: [
            { muscle: 'Deep Cervical Flexors', reason: 'Cervical stabilization weakness' },
            { muscle: 'Lower Trapezius', reason: 'Scapular depression deficit' },
            { muscle: 'Serratus Anterior', reason: 'Forward head compensation' }
        ]
    },

    // NEW: Enhanced compensation pattern based on research
    scapularWinging: {
        overactive: [
            { muscle: 'Pectoralis Major/Minor', reason: 'Anterior shoulder tightness pulling scapula' },
            { muscle: 'Upper Trapezius', reason: 'Compensatory upper trap dominance' },
            { muscle: 'Latissimus Dorsi', reason: 'Scapular depression restriction' }
        ],
        underactive: [
            { muscle: 'Serratus Anterior', reason: 'Primary scapular protraction weakness' },
            { muscle: 'Rhomboids', reason: 'Scapular retraction deficit' },
            { muscle: 'Mid/Lower Trapezius', reason: 'Scapular stabilization weakness' }
        ]
    }
};

/**
 * NASM Table 6-15: Pulling Assessment
 * Analyzes compensations during pulling movements
 */
export const pullingCompensations = {
    lowBackArches: {
        overactive: [
            { muscle: 'Hip Flexors', reason: 'Anterior pelvic tilt during pull' },
            { muscle: 'Erector Spinae', reason: 'Lumbar hyperextension compensation' }
        ],
        underactive: [
            { muscle: 'Intrinsic Core Stabilizers', reason: 'Core stability during pulling' },
            { muscle: 'Gluteus Maximus', reason: 'Hip extension stability' }
        ]
    },

    shoulderElevation: {
        overactive: [
            { muscle: 'Upper Trapezius', reason: 'Compensatory shoulder elevation' },
            { muscle: 'Sternocleidomastoid', reason: 'Neck tension during effort' },
            { muscle: 'Levator Scapulae', reason: 'Scapular elevation pattern' }
        ],
        underactive: [
            { muscle: 'Lower Trapezius', reason: 'Scapular depression weakness' },
            { muscle: 'Serratus Anterior', reason: 'Scapular protraction deficit' },
            { muscle: 'Latissimus Dorsi', reason: 'Scapular stabilization compromise' }
        ]
    },

    headProtrudesForward: {
        overactive: [
            { muscle: 'Upper Trapezius', reason: 'Forward head posture' },
            { muscle: 'Sternocleidomastoid', reason: 'Cervical flexion compensation' },
            { muscle: 'Levator Scapulae', reason: 'Cervical extension restriction' }
        ],
        underactive: [
            { muscle: 'Deep Cervical Flexors', reason: 'Cervical stabilization weakness' },
            { muscle: 'Lower Trapezius', reason: 'Scapular depression deficit' },
            { muscle: 'Serratus Anterior', reason: 'Forward head compensation' }
        ]
    }
};

/**
 * Comprehensive analysis function for complete NASM assessment
 * Integrates all four assessment components for holistic muscle imbalance identification
 */
export const analyzeCompleteNASMAssessment = (assessmentData) => {
    const overactiveMusles = [];
    const underactiveMusles = [];
    const priorityAreas = [];

    // Analyze Overhead Squat
    if (assessmentData.overheadSquat?.frontView) {
        const frontView = assessmentData.overheadSquat.frontView;

        if (frontView.feet?.feetTurnOut) {
            overactiveMusles.push(...overheadSquatCompensations.feetTurnOut.overactive);
            underactiveMusles.push(...overheadSquatCompensations.feetTurnOut.underactive);
            priorityAreas.push({
                area: 'Ankle Mobility & Stability',
                issue: 'Feet turn out during squat',
                action: 'Focus on ankle dorsiflexion mobility and intrinsic foot strengthening'
            });
        }

        if (frontView.knees?.kneesMoveinward) {
            overactiveMusles.push(...overheadSquatCompensations.kneesMoveinward.overactive);
            underactiveMusles.push(...overheadSquatCompensations.kneesMoveinward.underactive);
            priorityAreas.push({
                area: 'Hip Stability & Glute Activation',
                issue: 'Knees move inward during squat',
                action: 'Emphasize glute strengthening and hip stabilization exercises'
            });
        }
    }

    if (assessmentData.overheadSquat?.sideView) {
        const sideView = assessmentData.overheadSquat.sideView;

        if (sideView.lphc?.excessiveForwardLean) {
            overactiveMusles.push(...overheadSquatCompensations.excessiveForwardLean.overactive);
            underactiveMusles.push(...overheadSquatCompensations.excessiveForwardLean.underactive);
            priorityAreas.push({
                area: 'Ankle Mobility & Posterior Chain',
                issue: 'Excessive forward lean',
                action: 'Address ankle dorsiflexion restriction and strengthen posterior chain'
            });
        }

        if (sideView.lphc?.lowBackArches) {
            overactiveMusles.push(...overheadSquatCompensations.lowBackArches.overactive);
            underactiveMusles.push(...overheadSquatCompensations.lowBackArches.underactive);
            priorityAreas.push({
                area: 'Core Stability & Hip Extension',
                issue: 'Low back arches excessively',
                action: 'Strengthen core stabilizers and address hip flexor tightness'
            });
        }

        if (sideView.upperBody?.armsFallForward) {
            overactiveMusles.push(...overheadSquatCompensations.armsFallForward.overactive);
            underactiveMusles.push(...overheadSquatCompensations.armsFallForward.underactive);
            priorityAreas.push({
                area: 'Shoulder Mobility & Thoracic Spine',
                issue: 'Arms fall forward',
                action: 'Improve shoulder flexion mobility and strengthen posterior shoulder muscles'
            });
        }
    }

    // Analyze Single-Leg Squat
    if (assessmentData.singleLegSquat?.rightLeg?.kneeValgus || assessmentData.singleLegSquat?.leftLeg?.kneeValgus) {
        overactiveMusles.push(...singleLegSquatCompensations.kneeValgus.overactive);
        underactiveMusles.push(...singleLegSquatCompensations.kneeValgus.underactive);
        priorityAreas.push({
            area: 'Unilateral Hip Stability',
            issue: 'Knee valgus during single-leg movement',
            action: 'Single-leg strengthening focusing on glute medius and VMO activation'
        });
    }

    // NEW: Enhanced single-leg squat compensation detection
    if (assessmentData.singleLegSquat?.rightLeg?.hipHike || assessmentData.singleLegSquat?.leftLeg?.hipHike) {
        overactiveMusles.push(...singleLegSquatCompensations.hipHike.overactive);
        underactiveMusles.push(...singleLegSquatCompensations.hipHike.underactive);
        priorityAreas.push({
            area: 'Unilateral Hip Control',
            issue: 'Hip hike during single-leg stance',
            action: 'Side-lying leg lifts, clamshells, and QL stretching'
        });
    }

    if (assessmentData.singleLegSquat?.rightLeg?.hipDrop || assessmentData.singleLegSquat?.leftLeg?.hipDrop) {
        overactiveMusles.push(...singleLegSquatCompensations.hipDrop.overactive);
        underactiveMusles.push(...singleLegSquatCompensations.hipDrop.underactive);
        priorityAreas.push({
            area: 'Hip Abduction Strength',
            issue: 'Contralateral hip drop during single-leg stance',
            action: 'Single-leg bridges, lateral band walks, and glute medius strengthening'
        });
    }

    // Analyze Push/Pull Assessments
    if (assessmentData.pushPull) {
        // Pushing compensations
        if (assessmentData.pushPull.pushing) {
            const pushing = assessmentData.pushPull.pushing;

            if (pushing.lphc?.lowBackArches) {
                overactiveMusles.push(...pushingCompensations.lowBackArches.overactive);
                underactiveMusles.push(...pushingCompensations.lowBackArches.underactive);
                priorityAreas.push({
                    area: 'Core Stability During Pushing',
                    issue: 'Low back arches during pushing movements',
                    action: 'Core stabilization training and hip flexor mobility'
                });
            }

            if (pushing.shoulders?.shoulderElevation) {
                overactiveMusles.push(...pushingCompensations.shoulderElevation.overactive);
                underactiveMusles.push(...pushingCompensations.shoulderElevation.underactive);
                priorityAreas.push({
                    area: 'Shoulder Mechanics',
                    issue: 'Shoulder elevation during pushing',
                    action: 'Lower trap strengthening and upper trap inhibition'
                });
            }

            if (pushing.head?.headMigratesForward) {
                overactiveMusles.push(...pushingCompensations.headMigratesForward.overactive);
                underactiveMusles.push(...pushingCompensations.headMigratesForward.underactive);
                priorityAreas.push({
                    area: 'Cervical Posture',
                    issue: 'Head migrates forward during pushing',
                    action: 'Deep cervical flexor strengthening and postural correction'
                });
            }

            // NEW: Enhanced pushing compensation detection
            if (pushing.shoulders?.scapularWinging) {
                overactiveMusles.push(...pushingCompensations.scapularWinging.overactive);
                underactiveMusles.push(...pushingCompensations.scapularWinging.underactive);
                priorityAreas.push({
                    area: 'Scapular Stability',
                    issue: 'Scapular winging during pushing movements',
                    action: 'Scapular wall slides, serratus punches, and pec stretching'
                });
            }
        }

        // Pulling compensations
        if (assessmentData.pushPull.pulling) {
            const pulling = assessmentData.pushPull.pulling;

            if (pulling.lphc?.lowBackArches) {
                overactiveMusles.push(...pullingCompensations.lowBackArches.overactive);
                underactiveMusles.push(...pullingCompensations.lowBackArches.underactive);
                priorityAreas.push({
                    area: 'Core Stability During Pulling',
                    issue: 'Low back arches during pulling movements',
                    action: 'Core stabilization training and hip flexor mobility'
                });
            }

            if (pulling.shoulders?.shoulderElevation) {
                overactiveMusles.push(...pullingCompensations.shoulderElevation.overactive);
                underactiveMusles.push(...pullingCompensations.shoulderElevation.underactive);
                priorityAreas.push({
                    area: 'Scapular Control',
                    issue: 'Shoulder elevation during pulling',
                    action: 'Scapular stabilization and lower trap activation'
                });
            }

            if (pulling.head?.headProtrudesForward) {
                overactiveMusles.push(...pullingCompensations.headProtrudesForward.overactive);
                underactiveMusles.push(...pullingCompensations.headProtrudesForward.underactive);
                priorityAreas.push({
                    area: 'Cervical Alignment',
                    issue: 'Head protrudes forward during pulling',
                    action: 'Cervical stabilization and postural awareness training'
                });
            }
        }
    }

    // Remove duplicates and consolidate
    const uniqueOveractive = Array.from(
        new Map(overactiveMusles.map(item => [item.muscle, item])).values()
    );

    const uniqueUnderactive = Array.from(
        new Map(underactiveMusles.map(item => [item.muscle, item])).values()
    );

    return {
        overactive: uniqueOveractive,
        underactive: uniqueUnderactive,
        priority: priorityAreas,
        totalCompensations: priorityAreas.length,
        assessmentComplete: true
    };
};

export default {
    overheadSquatCompensations,
    singleLegSquatCompensations,
    pushingCompensations,
    pullingCompensations,
    analyzeCompleteNASMAssessment
};
