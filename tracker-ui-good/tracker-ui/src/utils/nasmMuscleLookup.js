// NASM Muscle Analysis Service - Based on Chapter 6 Tables 6-12 through 6-15
// Provides automatic muscle imbalance analysis for NASM movement assessments
// Source: NASM-CPT 7th Edition, Chapter 6 Reference Tables

// NASM Table 6-12: Overhead Squat Assessment
export const overheadSquatCompensations = {
    feetTurnOut: {
        overactive: ["Soleus", "Lateral gastrocnemius", "Biceps femoris (short)"],
        underactive: ["Medial gastrocnemius", "Medial hamstring complex", "Gracilis", "Sartorius", "Popliteus"]
    },
    kneesMoveinward: {
        overactive: ["Adductor complex", "Biceps femoris (short)", "TFL", "Vastus lateralis"],
        underactive: ["Gluteus medius/maximus", "Vastus medialis oblique (VMO)"]
    },
    excessiveForwardLean: {
        overactive: ["Soleus", "Gastrocnemius", "Hip-flexor complex", "Abdominal complex"],
        underactive: ["Anterior tibialis", "Gluteus maximus"]
    },
    lowBackArches: {
        overactive: ["Hip-flexor complex", "Erector spinae", "Latissimus dorsi"],
        underactive: ["Gluteus maximus", "Hamstring complex", "Intrinsic core stabilizers"]
    },
    armsFallForward: {
        overactive: ["Latissimus dorsi", "Teres major", "Pectoralis major/minor"],
        underactive: ["Mid/Lower trapezius", "Rhomboids", "Rotator cuff"]
    }
};

// NASM Table 6-13: Single-Leg Squat Assessment
export const singleLegSquatCompensations = {
    kneeValgus: {
        overactive: ["Adductor complex", "Biceps femoris (short)", "TFL", "Vastus lateralis"],
        underactive: ["Gluteus medius/maximus", "VMO"]
    }
};

// NASM Table 6-14: Pushing Assessment
export const pushingCompensations = {
    lowBackArches: {
        overactive: ["Hip flexors", "Erector spinae"],
        underactive: ["Intrinsic core stabilizers"]
    },
    shoulderElevation: {
        overactive: ["Upper trapezius", "Sternocleidomastoid", "Levator scapulae"],
        underactive: ["Mid/Lower trapezius"]
    },
    headMigratesForward: {
        overactive: ["Upper trapezius", "Sternocleidomastoid", "Levator scapulae"],
        underactive: ["Deep cervical flexors"]
    }
};

// NASM Table 6-15: Pulling Assessment
export const pullingCompensations = {
    lowBackArches: {
        overactive: ["Hip flexors", "Erector spinae"],
        underactive: ["Intrinsic core stabilizers"]
    },
    shoulderElevation: {
        overactive: ["Upper trapezius", "Sternocleidomastoid", "Levator scapulae"],
        underactive: ["Mid/Lower trapezius"]
    },
    headProtrudesForward: {
        overactive: ["Upper trapezius", "Sternocleidomastoid", "Levator scapulae"],
        underactive: ["Deep cervical flexors"]
    }
};

// Analysis Functions - Automatically generate muscle lists based on NASM compensations
export const analyzeOverheadSquat = (assessmentData) => {
    let overactive = [];
    let underactive = [];
    let compensations = 0;

    // Front view analysis
    if (assessmentData.frontView?.feet?.feetTurnOut) {
        overactive.push(...overheadSquatCompensations.feetTurnOut.overactive);
        underactive.push(...overheadSquatCompensations.feetTurnOut.underactive);
        compensations++;
    }

    if (assessmentData.frontView?.knees?.kneesMoveinward) {
        overactive.push(...overheadSquatCompensations.kneesMoveinward.overactive);
        underactive.push(...overheadSquatCompensations.kneesMoveinward.underactive);
        compensations++;
    }

    // Side view analysis
    if (assessmentData.sideView?.lphc?.excessiveForwardLean) {
        overactive.push(...overheadSquatCompensations.excessiveForwardLean.overactive);
        underactive.push(...overheadSquatCompensations.excessiveForwardLean.underactive);
        compensations++;
    }

    if (assessmentData.sideView?.lphc?.lowBackArches) {
        overactive.push(...overheadSquatCompensations.lowBackArches.overactive);
        underactive.push(...overheadSquatCompensations.lowBackArches.underactive);
        compensations++;
    }

    if (assessmentData.sideView?.upperBody?.armsFallForward) {
        overactive.push(...overheadSquatCompensations.armsFallForward.overactive);
        underactive.push(...overheadSquatCompensations.armsFallForward.underactive);
        compensations++;
    }

    return {
        totalCompensations: compensations,
        overactiveMusces: [...new Set(overactive)], // Remove duplicates
        underactiveMusces: [...new Set(underactive)],
        riskLevel: compensations === 0 ? 'Low' : compensations <= 2 ? 'Moderate' : 'High'
    };
};

export const analyzeSingleLegSquat = (assessmentData) => {
    let overactive = [];
    let underactive = [];
    let compensations = 0;

    // Check both legs for knee valgus
    if (assessmentData.rightLeg?.kneeValgus) {
        overactive.push(...singleLegSquatCompensations.kneeValgus.overactive);
        underactive.push(...singleLegSquatCompensations.kneeValgus.underactive);
        compensations++;
    }

    if (assessmentData.leftLeg?.kneeValgus) {
        overactive.push(...singleLegSquatCompensations.kneeValgus.overactive);
        underactive.push(...singleLegSquatCompensations.kneeValgus.underactive);
        compensations++;
    }

    return {
        totalCompensations: compensations,
        overactiveMusces: [...new Set(overactive)],
        underactiveMusces: [...new Set(underactive)],
        riskLevel: compensations === 0 ? 'Low' : compensations === 1 ? 'Moderate' : 'High'
    };
};

export const analyzePushing = (assessmentData) => {
    let overactive = [];
    let underactive = [];
    let compensations = 0;

    if (assessmentData.lphc?.lowBackArches) {
        overactive.push(...pushingCompensations.lowBackArches.overactive);
        underactive.push(...pushingCompensations.lowBackArches.underactive);
        compensations++;
    }

    if (assessmentData.shoulders?.shoulderElevation) {
        overactive.push(...pushingCompensations.shoulderElevation.overactive);
        underactive.push(...pushingCompensations.shoulderElevation.underactive);
        compensations++;
    }

    if (assessmentData.head?.headMigratesForward) {
        overactive.push(...pushingCompensations.headMigratesForward.overactive);
        underactive.push(...pushingCompensations.headMigratesForward.underactive);
        compensations++;
    }

    return {
        totalCompensations: compensations,
        overactiveMusces: [...new Set(overactive)],
        underactiveMusces: [...new Set(underactive)],
        riskLevel: compensations === 0 ? 'Low' : compensations <= 1 ? 'Moderate' : 'High'
    };
};

export const analyzePulling = (assessmentData) => {
    let overactive = [];
    let underactive = [];
    let compensations = 0;

    if (assessmentData.lphc?.lowBackArches) {
        overactive.push(...pullingCompensations.lowBackArches.overactive);
        underactive.push(...pullingCompensations.lowBackArches.underactive);
        compensations++;
    }

    if (assessmentData.shoulders?.shoulderElevation) {
        overactive.push(...pullingCompensations.shoulderElevation.overactive);
        underactive.push(...pullingCompensations.shoulderElevation.underactive);
        compensations++;
    }

    if (assessmentData.head?.headProtrudesForward) {
        overactive.push(...pullingCompensations.headProtrudesForward.overactive);
        underactive.push(...pullingCompensations.headProtrudesForward.underactive);
        compensations++;
    }

    return {
        totalCompensations: compensations,
        overactiveMusces: [...new Set(overactive)],
        underactiveMusces: [...new Set(underactive)],
        riskLevel: compensations === 0 ? 'Low' : compensations <= 1 ? 'Moderate' : 'High'
    };
};

// Complete NASM assessment analysis - combines all four assessments
export const analyzeCompleteNASMAssessment = (assessmentData) => {
    const ohsAnalysis = analyzeOverheadSquat(assessmentData.overheadSquat || {});
    const slsAnalysis = analyzeSingleLegSquat(assessmentData.singleLegSquat || {});
    const pushAnalysis = analyzePushing(assessmentData.pushing || {});
    const pullAnalysis = analyzePulling(assessmentData.pulling || {});

    const totalCompensations =
        ohsAnalysis.totalCompensations +
        slsAnalysis.totalCompensations +
        pushAnalysis.totalCompensations +
        pullAnalysis.totalCompensations;

    // Combine all muscle lists
    const allOveractive = [
        ...ohsAnalysis.overactiveMusces,
        ...slsAnalysis.overactiveMusces,
        ...pushAnalysis.overactiveMusces,
        ...pullAnalysis.overactiveMusces
    ];

    const allUnderactive = [
        ...ohsAnalysis.underactiveMusces,
        ...slsAnalysis.underactiveMusces,
        ...pushAnalysis.underactiveMusces,
        ...pullAnalysis.underactiveMusces
    ];

    // Determine overall risk level
    let overallRiskLevel = 'Low';
    if (totalCompensations >= 6) overallRiskLevel = 'High';
    else if (totalCompensations >= 3) overallRiskLevel = 'Moderate';

    return {
        overheadSquat: ohsAnalysis,
        singleLegSquat: slsAnalysis,
        pushing: pushAnalysis,
        pulling: pullAnalysis,
        overall: {
            totalCompensations,
            overactiveMusces: [...new Set(allOveractive)],
            underactiveMusces: [...new Set(allUnderactive)],
            riskLevel: overallRiskLevel,
            requiresCorrectivePhase: totalCompensations >= 4
        }
    };
};
