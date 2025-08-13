/**
 * NASM OPT Program Design - 17-Step Workflow Configuration
 * 
 * Complete step-by-step implementation of NASM's OPT Model
 * Following the exact 17-step process for program design
 */

export const nasmStepConfig = [
    {
        id: 1,
        name: "Intake & Readiness",
        component: "NASMIntakeStep",
        phase: "Foundation",
        icon: "📋",
        description: "Goals, timeline, training history, injuries/meds, session availability, equipment access, constraints",
        requires: [
            "goals (primary/secondary)",
            "timeline",
            "training history",
            "injuries/medications",
            "session availability",
            "equipment access",
            "preference constraints"
        ],
        outputs: [
            "goal hierarchy",
            "constraints",
            "clearance status",
            "baseline schedule"
        ]
    },
    {
        id: 2,
        name: "Baseline Vitals & Body Measures",
        component: "NASMVitalsStep",
        phase: "Foundation",
        icon: "🩺",
        description: "Resting HR, BP, height, weight, BMI, girths, optional body fat",
        requires: [
            "resting HR",
            "BP (if available)",
            "height, weight, BMI",
            "girths",
            "optional body fat"
        ],
        outputs: [
            "risk flags",
            "tracking baselines"
        ]
    },
    {
        id: 3,
        name: "Static Posture (Kinetic-Chain Checkpoints)",
        component: "NASMStaticPostureStep",
        phase: "Assessment",
        icon: "🧍",
        description: "Front/side/back photos or coach view; foot/ankle, knee, LPHC, shoulder, head alignment",
        requires: [
            "front/side/back photos or coach view",
            "foot/ankle alignment notes",
            "knee alignment",
            "LPHC (Lower Portion of Hip Complex)",
            "shoulder alignment",
            "head alignment"
        ],
        outputs: [
            "suspected distortion patterns to verify dynamically"
        ]
    },
    {
        id: 4,
        name: "Dynamic Movement Screens",
        component: "NASMMovementAssessmentStep",
        phase: "Assessment",
        icon: "🏃",
        description: "OHSA, Single-Leg Squat, Push/Pull assessments with compensation analysis",
        requires: [
            "OHSA: 5 reps front/side; note feet flatten/out, knees valgus, forward lean, LB arch, arms fall",
            "Single-Leg Squat: ≤5 reps/side; knee valgus",
            "Push/Pull: up to 20 reps; LB arch, shoulder elevation, forward head"
        ],
        outputs: [
            "list of compensations per checkpoint"
        ]
    },
    {
        id: 5,
        name: "Map Compensations → Muscle Strategy",
        component: "NASMCompensationMappingStep",
        phase: "Assessment",
        icon: "🎯",
        description: "Lookup tables for overactive/underactive muscles and corrective plan targets",
        requires: [
            "lookup tables (overactive/underactive for each compensation)"
        ],
        outputs: [
            "corrective plan targets (SMR/static/active/dynamic + activation exercises)"
        ]
    },
    {
        id: 6,
        name: "Performance & Capacity",
        component: "NASMPerformanceTestsStep",
        phase: "Assessment",
        icon: "💪",
        description: "Push-up test, Davies test, Shark skill, est. 1RM bench/squat, talk test/HR zones",
        requires: [
            "push-up test",
            "Davies test",
            "Shark skill",
            "est. 1RM bench/squat",
            "talk test/HR zones"
        ],
        outputs: [
            "baseline endurance/strength/coordination and cardio zones"
        ]
    },
    {
        id: 7,
        name: "Choose Starting OPT Phase",
        component: "NASMOPTPhaseSelectionStep",
        phase: "Programming",
        icon: "📊",
        description: "Determine starting OPT phase based on assessment findings and goals",
        requires: [
            "Step 3-6 findings + goals",
            "Movement issues → Phase 1",
            "General fitness/toning → Phase 2",
            "Size → Phase 3",
            "Max strength → Phase 4",
            "Power/speed → Phase 5"
        ],
        outputs: [
            "initial phase + entry criteria"
        ]
    },
    {
        id: 8,
        name: "Corrective Warm-up Block",
        component: "NASMCorrectiveWarmupStep",
        phase: "Programming",
        icon: "🔥",
        description: "SMR targets, stretch type by phase (P1: SMR+static; P2-4: SMR+active; P5: SMR+dynamic)",
        requires: [
            "from Step 5: SMR targets",
            "stretch type by phase (P1: SMR+static; P2–4: SMR+active; P5: SMR+dynamic)"
        ],
        outputs: [
            "5–10-min, exercise list + doses"
        ]
    },
    {
        id: 9,
        name: "Core / Balance / Plyometric Block",
        component: "NASMCoreBalancePlyoStep",
        phase: "Programming",
        icon: "⚖️",
        description: "Phase-matched selection + acute variables (stabilization → strength → power progressions)",
        requires: [
            "phase-matched selection + acute variables",
            "stabilization → strength → power progressions"
        ],
        outputs: [
            "exercise(s), sets, reps, tempo, rest"
        ]
    },
    {
        id: 10,
        name: "SAQ (if used)",
        component: "NASMSAQStep",
        phase: "Programming",
        icon: "⚡",
        description: "Client goal/phase; drill count, work:rest per phase",
        requires: [
            "client goal/phase",
            "drill count",
            "work:rest per phase"
        ],
        outputs: [
            "drill list + volumes"
        ]
    },
    {
        id: 11,
        name: "Resistance Training Block",
        component: "NASMResistanceTrainingStep",
        phase: "Programming",
        icon: "🏋️",
        description: "Goal/phase → sets, reps, intensity, tempo, rest; system; exercise order",
        requires: [
            "goal/phase → sets, reps, intensity, tempo, rest",
            "system (vertical/horizontal, supersets, etc.)",
            "exercise order (total → uni; multi-joint → single-joint)"
        ],
        outputs: [
            "exercise lineup with acute variables"
        ]
    },
    {
        id: 12,
        name: "Cardiorespiratory Plan (FITTE)",
        component: "NASMCardioStep",
        phase: "Programming",
        icon: "❤️",
        description: "HRmax, zones/talk-test, frequency, duration, modes",
        requires: [
            "HRmax (208 − 0.7×age or measured)",
            "zones/talk-test",
            "frequency, duration, modes"
        ],
        outputs: [
            "weekly cardio prescription by day with zones and minutes"
        ]
    },
    {
        id: 13,
        name: "Session Template & Weekly Split",
        component: "NASMSessionTemplateStep",
        phase: "Implementation",
        icon: "📅",
        description: "Number of days/week, split, per-day warm-up → blocks → cooldown",
        requires: [
            "number of days/week",
            "split (total-body vs push/pull/legs etc.)",
            "per-day warm-up → blocks → cooldown"
        ],
        outputs: [
            "microcycle (week plan)"
        ]
    },
    {
        id: 14,
        name: "Monthly Progression Rules (Mesocycle)",
        component: "NASMMesocycleStep",
        phase: "Implementation",
        icon: "📈",
        description: "Target adaptation; progression knobs (load, volume, density, complexity, ROM, surface)",
        requires: [
            "target adaptation",
            "progression knobs (load, volume, density, complexity, ROM, surface)"
        ],
        outputs: [
            "4-week plan, deload logic, phase-exit criteria"
        ]
    },
    {
        id: 15,
        name: "Annual Plan (Macrocycle)",
        component: "NASMMacrocycleStep",
        phase: "Implementation",
        icon: "🗓️",
        description: "Yearly goals/peaks, seasonality, travel",
        requires: [
            "yearly goals/peaks",
            "seasonality",
            "travel"
        ],
        outputs: [
            "stabilization → strength → power blocks; reassessment points"
        ]
    },
    {
        id: 16,
        name: "Special Population/Constraint Mods",
        component: "NASMSpecialPopulationsStep",
        phase: "Implementation",
        icon: "🎯",
        description: "Pregnancy/obesity/LBP/shoulder/knee notes from intake; equipment limits",
        requires: [
            "pregnancy/obesity/LBP/shoulder/knee notes from intake",
            "equipment limits"
        ],
        outputs: [
            "substitutions, depth limits, test swaps, cueing notes"
        ]
    },
    {
        id: 17,
        name: "Monitoring & Reassessment",
        component: "NASMMonitoringStep",
        phase: "Implementation",
        icon: "📊",
        description: "KPIs, reassess cadence (4–6 weeks)",
        requires: [
            "KPIs (compensations, loads, volumes, HR zones, RPE, adherence)",
            "reassess cadence (4–6 weeks)"
        ],
        outputs: [
            "go/no-go phase changes; updated corrective list"
        ]
    }
];

// Phase groupings for UI organization
export const nasmPhases = {
    "Foundation": {
        name: "Foundation",
        description: "Initial client consultation and baseline establishment",
        steps: [1, 2],
        color: "#dc2626"
    },
    "Assessment": {
        name: "Assessment",
        description: "Comprehensive movement and performance evaluation",
        steps: [3, 4, 5, 6],
        color: "#b91c1c"
    },
    "Programming": {
        name: "Programming",
        description: "OPT phase selection and exercise prescription",
        steps: [7, 8, 9, 10, 11, 12],
        color: "#991b1b"
    },
    "Implementation": {
        name: "Implementation",
        description: "Program structure, progression, and monitoring",
        steps: [13, 14, 15, 16, 17],
        color: "#7f1d1d"
    }
};

// Get step by ID
export const getNASMStep = (stepId) => {
    return nasmStepConfig.find(step => step.id === stepId);
};

// Get steps by phase
export const getNASMStepsByPhase = (phase) => {
    return nasmStepConfig.filter(step => step.phase === phase);
};

// Get next step
export const getNextNASMStep = (currentStepId) => {
    const currentIndex = nasmStepConfig.findIndex(step => step.id === currentStepId);
    return currentIndex < nasmStepConfig.length - 1 ? nasmStepConfig[currentIndex + 1] : null;
};

// Get previous step  
export const getPreviousNASMStep = (currentStepId) => {
    const currentIndex = nasmStepConfig.findIndex(step => step.id === currentStepId);
    return currentIndex > 0 ? nasmStepConfig[currentIndex - 1] : null;
};
