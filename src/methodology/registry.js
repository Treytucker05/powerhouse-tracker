// NASM Methodology Registry
// Phase 1: NASM-specific implementation for methodology-first workflow

export const NASM_METHODOLOGY = {
    id: 'nasm',
    name: 'NASM OPT Model',
    description: 'Evidence-based training using NASM\'s Optimum Performance Training model with comprehensive movement assessment',
    icon: '🎯',
    color: '#2563eb',
    category: 'corrective-fitness',

    // Target Audience
    targetAudience: [
        'general-population',
        'corrective-exercise',
        'beginner-intermediate',
        'movement-dysfunction',
        'injury-prevention'
    ],

    // Core Capabilities
    capabilities: [
        'movement-assessment',
        'corrective-exercise',
        'opt-model-periodization',
        'injury-prevention',
        'motor-control',
        'postural-analysis',
        'muscle-imbalance-correction'
    ],

    // Available Goals (NASM-specific)
    availableGoals: [
        {
            id: 'corrective-exercise',
            name: 'Corrective Exercise',
            description: 'Address movement dysfunctions and muscle imbalances',
            phases: [1, 2],
            focus: 'movement-quality',
            priority: 'high'
        },
        {
            id: 'general-fitness',
            name: 'General Fitness',
            description: 'Improve overall health and functional capacity',
            phases: [1, 2, 3],
            focus: 'general-fitness',
            priority: 'medium'
        },
        {
            id: 'weight-loss',
            name: 'Weight Loss',
            description: 'Body composition improvement with movement quality focus',
            phases: [1, 2, 3],
            focus: 'body-composition',
            priority: 'medium'
        },
        {
            id: 'movement-quality',
            name: 'Movement Quality',
            description: 'Enhance movement patterns and motor control',
            phases: [1, 2],
            focus: 'movement-quality',
            priority: 'high'
        },
        {
            id: 'injury-rehabilitation',
            name: 'Injury Rehabilitation',
            description: 'Return to function following injury with movement focus',
            phases: [1],
            focus: 'corrective',
            priority: 'high'
        },
        {
            id: 'performance-fitness',
            name: 'Performance Fitness',
            description: 'Athletic performance with movement foundation',
            phases: [3, 4, 5],
            focus: 'performance',
            priority: 'medium'
        }
    ],

    // Assessment Types
    assessmentTypes: [
        {
            id: 'movement-screen',
            name: 'NASM Movement Screen',
            description: 'Comprehensive movement assessment including Overhead Squat, Single-Leg Squat, and Push/Pull',
            required: true,
            component: 'NASMMovementScreen'
        },
        {
            id: 'postural-analysis',
            name: 'Postural Analysis',
            description: 'Static postural assessment to identify muscle imbalances',
            required: false,
            component: 'PosturalAnalysis'
        },
        {
            id: 'opt-questionnaire',
            name: 'OPT Model Questionnaire',
            description: 'NASM-specific client consultation and goal assessment',
            required: true,
            component: 'OPTQuestionnaire'
        },
        {
            id: 'client-consultation',
            name: 'Client Consultation',
            description: 'Comprehensive intake including health history and goals',
            required: true,
            component: 'ClientConsultation'
        }
    ],

    // OPT Model Phases
    optPhases: {
        phase1: {
            id: 1,
            name: 'Stabilization Endurance',
            focus: 'stability',
            description: 'Develop muscular endurance and core stability while improving neuromuscular efficiency',
            duration: '4-6 weeks',
            goals: ['movement-quality', 'corrective-exercise', 'injury-rehabilitation'],
            assessmentRequirements: ['movement-screen', 'opt-questionnaire'],
            trainingComponents: {
                flexibility: 'corrective-flexibility',
                cardio: 'stage-1',
                core: 'stabilization',
                balance: 'stabilization',
                reactive: 'stabilization',
                resistance: 'stabilization-endurance'
            }
        },
        phase2: {
            id: 2,
            name: 'Strength Endurance',
            focus: 'strength-endurance',
            description: 'Develop stabilization strength and muscular endurance',
            duration: '4-6 weeks',
            goals: ['general-fitness', 'weight-loss', 'corrective-exercise'],
            assessmentRequirements: ['movement-screen'],
            trainingComponents: {
                flexibility: 'active-flexibility',
                cardio: 'stage-2',
                core: 'strength',
                balance: 'strength',
                reactive: 'strength',
                resistance: 'strength-endurance'
            }
        },
        phase3: {
            id: 3,
            name: 'Muscular Development',
            focus: 'hypertrophy',
            description: 'Develop muscular hypertrophy and maximal strength',
            duration: '4-6 weeks',
            goals: ['general-fitness', 'weight-loss', 'performance-fitness'],
            assessmentRequirements: ['movement-screen'],
            trainingComponents: {
                flexibility: 'active-flexibility',
                cardio: 'stage-2-3',
                core: 'strength',
                balance: 'strength',
                reactive: 'strength',
                resistance: 'hypertrophy'
            }
        },
        phase4: {
            id: 4,
            name: 'Maximal Strength',
            focus: 'max-strength',
            description: 'Develop maximal neuromuscular force production',
            duration: '4-6 weeks',
            goals: ['performance-fitness'],
            assessmentRequirements: ['movement-screen'],
            trainingComponents: {
                flexibility: 'active-flexibility',
                cardio: 'stage-2-3',
                core: 'power',
                balance: 'power',
                reactive: 'power',
                resistance: 'maximal-strength'
            }
        },
        phase5: {
            id: 5,
            name: 'Power',
            focus: 'power',
            description: 'Develop speed, agility, quickness and power',
            duration: '4-6 weeks',
            goals: ['performance-fitness'],
            assessmentRequirements: ['movement-screen'],
            trainingComponents: {
                flexibility: 'dynamic-flexibility',
                cardio: 'stage-3',
                core: 'power',
                balance: 'power',
                reactive: 'power',
                resistance: 'power'
            }
        }
    },

    // Periodization Model
    periodizationModel: {
        type: 'opt-phases',
        description: 'NASM OPT Model progressive phase system',
        progressionRules: {
            phase1Required: true,
            minimumPhase1Duration: 4,
            assessmentBasedProgression: true,
            compensationThreshold: 3
        }
    },

    // Component Mapping
    components: {
        workflow: 'NASMMethodologyWorkflow',
        assessment: 'CompleteNASMAssessment',
        periodization: 'NASMOptModelPeriodization',
        programDesign: 'NASMProgramDesign',
        goalSelection: 'NASMGoalSelection',
        clientConsultation: 'NASMClientConsultation'
    },

    // Integration with existing NASM assessment system
    existingIntegration: {
        assessmentComponents: [
            'NASMAssessmentDashboard',
            'OverheadSquatAssessment',
            'SingleLegSquatAssessment',
            'PushPullAssessment',
            'AssessmentResults'
        ],
        analysisFunction: 'analyzeCompleteNASMAssessment',
        muscleLookup: 'nasmMuscleLookup'
    }
};

// Export for use in methodology-first workflow
export const METHODOLOGIES = {
    nasm: NASM_METHODOLOGY
};

export default NASM_METHODOLOGY;
