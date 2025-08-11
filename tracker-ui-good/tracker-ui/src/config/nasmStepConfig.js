/**
 * NASM OPT Program Design Step Configuration
 * 
 * This file defines the complete 17-step NASM OPT methodology
 * including step metadata, phase groupings, and navigation utilities.
 */

// Define NASM phases with colors and metadata
export const nasmPhases = {
    Foundation: {
        color: '#3b82f6', // Blue
        description: 'Client foundation and initial assessments',
        steps: [1, 2, 3, 4]
    },
    Assessment: {
        color: '#eab308', // Yellow
        description: 'Movement analysis and performance testing',
        steps: [5, 6, 7]
    },
    Programming: {
        color: '#22c55e', // Green
        description: 'Exercise prescription and program design',
        steps: [8, 9, 10, 11, 12, 13]
    },
    Implementation: {
        color: '#dc2626', // Red
        description: 'Periodization and monitoring strategies',
        steps: [14, 15, 16, 17]
    }
};

// Complete 17-step NASM OPT configuration
export const nasmStepConfig = [
    {
        id: 1,
        name: 'Client Intake & PAR-Q',
        phase: 'Foundation',
        description: 'Initial client consultation, health history, and readiness assessment',
        component: 'NASMIntakeStep',
        isImplemented: true,
        requires: ['None - Starting point'],
        outputs: ['Health history', 'PAR-Q clearance', 'Exercise readiness status']
    },
    {
        id: 2,
        name: 'Vitals & Basic Measurements',
        phase: 'Foundation',
        description: 'Height, weight, body composition, resting heart rate, blood pressure',
        component: 'NASMVitalsStep',
        isImplemented: true,
        requires: ['Completed PAR-Q'],
        outputs: ['Height/weight', 'Body composition', 'Resting vitals', 'BMI calculations']
    },
    {
        id: 3,
        name: 'Static Posture Assessment',
        phase: 'Foundation',
        description: 'Anterior, lateral, and posterior postural analysis',
        component: 'NASMStaticPostureStep',
        isImplemented: true,
        requires: ['Basic measurements completed'],
        outputs: ['Postural deviations', 'Muscle imbalance indicators', 'Visual assessment notes']
    },
    {
        id: 4,
        name: 'Movement Assessments',
        phase: 'Foundation',
        description: 'Overhead squat, single-leg squat, pushing/pulling assessments',
        component: 'NASMMovementAssessmentStep',
        isImplemented: true,
        requires: ['Postural assessment completed'],
        outputs: ['Movement compensations', 'Mobility/stability issues', 'Exercise contraindications']
    },
    {
        id: 5,
        name: 'Compensation Mapping',
        phase: 'Assessment',
        description: 'Muscle imbalance analysis and corrective strategy development',
        component: 'NASMCompensationStep',
        isImplemented: false,
        requires: ['Movement assessments completed'],
        outputs: ['Corrective exercise priorities', 'Muscle activation strategies']
    },
    {
        id: 6,
        name: 'Performance & Capacity Tests',
        phase: 'Assessment',
        description: 'Push-up test, Davies test, Shark skill, 1RM estimation',
        component: 'NASMPerformanceTestStep',
        isImplemented: false,
        requires: ['Movement compensations identified'],
        outputs: ['Strength baselines', 'Power assessments', 'Endurance capacity']
    },
    {
        id: 7,
        name: 'Choose Starting OPT Phase',
        phase: 'Assessment',
        description: 'Phase 1-5 selection based on assessment findings',
        component: 'NASMOPTPhaseSelectionStep',
        isImplemented: false,
        requires: ['All assessments completed'],
        outputs: ['OPT Phase selection', 'Training readiness level']
    },
    {
        id: 8,
        name: 'Corrective Warm-up Block',
        phase: 'Programming',
        description: 'SMR and stretching prescription by phase',
        component: 'NASMWarmupStep',
        isImplemented: false,
        requires: ['OPT Phase selected'],
        outputs: ['Warm-up protocol', 'SMR routine', 'Flexibility program']
    },
    {
        id: 9,
        name: 'Core/Balance/Plyometric Block',
        phase: 'Programming',
        description: 'Phase-appropriate core, balance, and reactive training',
        component: 'NASMOPTPhaseStep',
        isImplemented: true,
        requires: ['Corrective warm-up designed'],
        outputs: ['Core training plan', 'Balance progressions', 'Plyometric protocols']
    },
    {
        id: 10,
        name: 'SAQ (Speed, Agility, Quickness)',
        phase: 'Programming',
        description: 'Sport-specific drill programming',
        component: 'NASMSAQStep',
        isImplemented: false,
        requires: ['Core/balance protocols established'],
        outputs: ['SAQ drill selection', 'Speed progressions', 'Agility patterns']
    },
    {
        id: 11,
        name: 'Resistance Training Block',
        phase: 'Programming',
        description: 'Exercise selection, sets, reps, tempo, rest periods',
        component: 'NASMResistanceStep',
        isImplemented: false,
        requires: ['SAQ protocols designed'],
        outputs: ['Exercise selection', 'Training variables', 'Progressive overload plan']
    },
    {
        id: 12,
        name: 'Cardiorespiratory Plan (FITTE)',
        phase: 'Programming',
        description: 'Heart rate zones and cardio prescription',
        component: 'NASMCardioStep',
        isImplemented: false,
        requires: ['Resistance training planned'],
        outputs: ['Cardio prescription', 'Heart rate zones', 'FITTE parameters']
    },
    {
        id: 13,
        name: 'Session Template & Weekly Split',
        phase: 'Programming',
        description: 'Microcycle design and session structure',
        component: 'NASMSessionTemplateStep',
        isImplemented: false,
        requires: ['All training blocks designed'],
        outputs: ['Session templates', 'Weekly split', 'Microcycle structure']
    },
    {
        id: 14,
        name: 'Monthly Progression Rules (Mesocycle)',
        phase: 'Implementation',
        description: '4-week progression and deload planning',
        component: 'NASMMesocycleStep',
        isImplemented: false,
        requires: ['Session templates created'],
        outputs: ['Progression rules', 'Deload protocols', 'Mesocycle plan']
    },
    {
        id: 15,
        name: 'Annual Plan (Macrocycle)',
        phase: 'Implementation',
        description: 'Yearly periodization and phase transitions',
        component: 'NASMMacrocycleStep',
        isImplemented: false,
        requires: ['Mesocycle protocols established'],
        outputs: ['Annual periodization', 'Phase transitions', 'Long-term goals']
    },
    {
        id: 16,
        name: 'Special Population/Constraint Modifications',
        phase: 'Implementation',
        description: 'Population-specific adaptations and equipment constraints',
        component: 'NASMSpecialPopulationStep',
        isImplemented: false,
        requires: ['Base program designed'],
        outputs: ['Population adaptations', 'Equipment modifications', 'Safety protocols']
    },
    {
        id: 17,
        name: 'Monitoring & Reassessment',
        phase: 'Implementation',
        description: 'KPI tracking and reassessment protocols',
        component: 'NASMMonitoringStep',
        isImplemented: false,
        requires: ['Complete program designed'],
        outputs: ['Monitoring protocols', 'Reassessment schedule', 'Progress tracking']
    }
];

// Utility functions for step navigation
export const getNASMStep = (stepId) => {
    const step = nasmStepConfig.find(step => step.id === stepId);
    if (step) {
        return step;
    }
    // Fallback with safe defaults
    return {
        id: stepId || 1,
        name: 'Unknown Step',
        phase: 'Foundation',
        description: 'Step not found',
        component: 'DefaultStep',
        isImplemented: false,
        requires: [],
        outputs: []
    };
};

export const getNextNASMStep = (currentStepId) => {
    const currentIndex = nasmStepConfig.findIndex(step => step.id === currentStepId);
    if (currentIndex >= 0 && currentIndex < nasmStepConfig.length - 1) {
        return nasmStepConfig[currentIndex + 1];
    }
    return null; // No next step (at the end)
};

export const getPreviousNASMStep = (currentStepId) => {
    const currentIndex = nasmStepConfig.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
        return nasmStepConfig[currentIndex - 1];
    }
    return null; // No previous step (at the beginning)
};

// Get steps by phase
export const getStepsByPhase = (phase) => {
    return nasmStepConfig.filter(step => step.phase === phase);
};

// Get phase for a given step
export const getPhaseForStep = (stepId) => {
    const step = getNASMStep(stepId);
    return step ? step.phase : 'Foundation';
};

// Get all implemented steps
export const getImplementedSteps = () => {
    return nasmStepConfig.filter(step => step.isImplemented);
};

// Get step completion percentage
export const getCompletionPercentage = (currentStep) => {
    return Math.round((currentStep / nasmStepConfig.length) * 100);
};
