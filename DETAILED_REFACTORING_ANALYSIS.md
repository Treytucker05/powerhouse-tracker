# POWERHOUSE TRACKER: METHODOLOGY-FIRST REFACTORING ANALYSIS

## 1. CURRENT COMPONENT HIERARCHY ANALYSIS

### **Current StreamlinedProgram.jsx Structure**

```
📁 Current Workflow (Goal-First)
├── 🎯 Step 1: PrimaryGoalStep.jsx
├── 📈 Step 2: ExperienceLevelStep.jsx  
├── ⏱️ Step 3: TimelineStep.jsx
├── 🏥 Step 4: InjuryScreeningStep.jsx
├── 🤖 Step 5: SystemRecommendationStep.jsx (includes NASM assessment)
├── 📋 Step 5a: Methodology-Specific Assessment (Dynamic)
│   ├── Josh Bryant: PHAHealthScreenStep.jsx + GainerTypeStep.jsx
│   ├── RP: VolumeLandmarksTab.jsx
│   ├── 5/3/1: TrainingMaxStep.jsx  
│   └── Linear: MovementAssessmentStep.jsx
├── 📅 Step 6: PeriodizationStep.jsx
├── ⚙️ Step 7: ProgramDesignStep.jsx
└── 📊 Step 8: ImplementationStep.jsx
```

### **Current State Management (ProgramContext.jsx)**

```javascript
// Current State Structure
{
    // UI State
    activeTab: 'primary-goal',
    currentStep: 1,
    selectedLevel: null,
    
    // Workflow State (Goal-First)
    primaryGoal: '',           // Step 1
    selectedSystem: '',        // Step 5 (late in process)
    timeline: null,            // Step 3
    injuryScreen: null,        // Step 4
    
    // Assessment Data
    assessmentData: null,      // NASM embedded in Step 5
    
    // Methodology-Specific (Step 5a - scattered)
    // Josh Bryant data scattered in various places
    // RP data in separate context
    // 5/3/1 data in isolated component
    // Linear data in movement assessment
    
    // Architecture (Steps 6-8)
    blockSequence: [...],
    blockParameters: {...},
    // ... extensive legacy state
}
```

### **Current Component Dependencies**

```
📁 Components Directory Structure
├── 📁 program/
│   ├── 📁 tabs/ (30+ components)
│   │   ├── PrimaryGoalStep.jsx ✅ Universal
│   │   ├── ExperienceLevelStep.jsx ✅ Universal  
│   │   ├── TimelineStep.jsx ✅ Universal
│   │   ├── InjuryScreeningStep.jsx ⚠️ Could be methodology-aware
│   │   ├── SystemRecommendationStep.jsx ❌ Becomes methodology selection
│   │   ├── PHAHealthScreenStep.jsx ❌ Bryant-specific
│   │   ├── GainerTypeStep.jsx ❌ Bryant-specific
│   │   ├── VolumeLandmarksTab.jsx ❌ RP-specific
│   │   ├── TrainingMaxStep.jsx ❌ 5/3/1-specific
│   │   ├── MovementAssessmentStep.jsx ❌ Linear-specific
│   │   ├── PeriodizationStep.jsx ⚠️ Could be methodology-aware
│   │   ├── ProgramDesignStep.jsx ⚠️ Could be methodology-aware
│   │   └── ImplementationStep.jsx ✅ Universal
│   └── ... (other shared components)
├── 📁 assessment/
│   └── 📁 nasm/ ✅ Already well-structured for methodology approach
│       ├── NASMAssessmentDashboard.jsx
│       ├── assessments/ (OverheadSquat, SingleLeg, PushPull)
│       ├── results/ (AssessmentResults.jsx)
│       └── shared/ (nasmMuscleLookup.js)
└── 📁 contexts/
    └── ProgramContext.jsx ❌ Needs methodology-first restructure
```

## 2. PROPOSED NEW COMPONENT HIERARCHY (Methodology-First)

### **New Workflow Structure**

```
📁 New Workflow (Methodology-First)
├── 🏛️ Step 1: MethodologySelectionStep.jsx (NEW)
├── 🎯 Step 2: MethodologyAwarePrimaryGoalStep.jsx (Enhanced)
├── 📈 Step 3: ExperienceLevelStep.jsx (Reused)
├── ⏱️ Step 4: TimelineStep.jsx (Reused)
├── 🔬 Step 5: MethodologySpecificAssessmentStep.jsx (Router)
│   ├── NASM: CompleteNASMAssessment.jsx (Movement + OPT)
│   ├── RP: ComprehensiveRPAssessment.jsx (Volume + Body Comp)
│   ├── 5/3/1: PowerliftingAssessment.jsx (Maxes + Competition Goals)
│   ├── Linear: MovementQualityAssessment.jsx (Enhanced)
│   └── Bryant: TacticalAssessment.jsx (PHA + Gainer + Specificity)
├── 🏥 Step 6: MethodologyAwareInjuryScreening.jsx (Enhanced)
├── 📅 Step 7: MethodologySpecificPeriodization.jsx (Router)
│   ├── NASM: NASMOptModelPeriodization.jsx
│   ├── RP: RPPeriodization.jsx
│   ├── 5/3/1: PowerliftingPeriodization.jsx
│   ├── Linear: LinearPeriodization.jsx
│   └── Bryant: TacticalPeriodization.jsx
└── 📊 Step 8: ImplementationStep.jsx (Enhanced/Universal)
```

### **New Directory Structure**

```
📁 src/components/
├── 📁 methodology/ (NEW)
│   ├── 📁 selection/
│   │   ├── MethodologySelectionStep.jsx
│   │   ├── MethodologyCard.jsx
│   │   ├── MethodologyComparison.jsx
│   │   └── MethodologyDetails.jsx
│   ├── 📁 shared/ (Universal components)
│   │   ├── MethodologyAwarePrimaryGoalStep.jsx
│   │   ├── ExperienceLevelStep.jsx (moved)
│   │   ├── TimelineStep.jsx (moved)
│   │   ├── MethodologyAwareInjuryScreening.jsx
│   │   └── ImplementationStep.jsx (moved)
│   ├── 📁 assessments/ (Step 5 Router + Methodology-specific)
│   │   ├── MethodologySpecificAssessmentStep.jsx (Router)
│   │   ├── 📁 nasm/
│   │   │   ├── CompleteNASMAssessment.jsx
│   │   │   ├── NASMMovementScreen.jsx (existing)
│   │   │   ├── NASMOptModelAssessment.jsx (NEW)
│   │   │   └── NASMClientConsultation.jsx (NEW)
│   │   ├── 📁 rp/
│   │   │   ├── ComprehensiveRPAssessment.jsx
│   │   │   ├── RPVolumeLandmarks.jsx (enhanced)
│   │   │   ├── RPBodyComposition.jsx (NEW)
│   │   │   └── RPGoalSpecificAssessment.jsx (NEW)
│   │   ├── 📁 powerlifting/
│   │   │   ├── PowerliftingAssessment.jsx
│   │   │   ├── MaxTestingProtocol.jsx (enhanced)
│   │   │   ├── CompetitionGoals.jsx (NEW)
│   │   │   └── TechnicalAssessment.jsx (NEW)
│   │   ├── 📁 linear/
│   │   │   ├── MovementQualityAssessment.jsx (enhanced)
│   │   │   ├── MotorControlScreen.jsx (NEW)
│   │   │   └── ProgressionReadiness.jsx (NEW)
│   │   └── 📁 bryant/
│   │       ├── TacticalAssessment.jsx
│   │       ├── PHAHealthScreen.jsx (moved)
│   │       ├── GainerTypeAssessment.jsx (moved)
│   │       ├── TacticalSpecificity.jsx (NEW)
│   │       └── PerformanceGoals.jsx (NEW)
│   ├── 📁 periodization/ (Step 7 Router + Methodology-specific)
│   │   ├── MethodologySpecificPeriodization.jsx (Router)
│   │   ├── 📁 nasm/
│   │   │   ├── NASMOptModelPeriodization.jsx
│   │   │   ├── NASMPhaseDesign.jsx
│   │   │   └── NASMProgressionPlan.jsx
│   │   ├── 📁 rp/
│   │   │   ├── RPPeriodization.jsx
│   │   │   ├── RPVolumeCycles.jsx
│   │   │   └── RPDeloadProtocols.jsx
│   │   ├── 📁 powerlifting/
│   │   │   ├── PowerliftingPeriodization.jsx
│   │   │   ├── CompetitionPeaking.jsx
│   │   │   └── OffSeasonPlanning.jsx
│   │   ├── 📁 linear/
│   │   │   ├── LinearPeriodization.jsx
│   │   │   ├── ProgressionWaves.jsx
│   │   │   └── AdaptationCycles.jsx
│   │   └── 📁 bryant/
│   │       ├── TacticalPeriodization.jsx
│   │       ├── MissionSpecificCycles.jsx
│   │       └── PerformancePhases.jsx
│   └── 📁 workflows/
│       ├── MethodologyWorkflow.jsx (Main orchestrator)
│       ├── MethodologyRouter.jsx (Dynamic routing)
│       └── WorkflowProgress.jsx (Progress tracking)
├── 📁 program/ (Legacy preserved)
│   ├── 📁 legacy/ (Current components moved here)
│   │   └── 📁 tabs/ (All current tab components)
│   └── 📁 shared/ (Still needed utilities)
└── 📁 contexts/
    ├── MethodologyContext.jsx (NEW)
    ├── ProgramContext.jsx (Enhanced)
    └── LegacyProgramContext.jsx (Preserved)
```

## 3. STEP-BY-STEP MIGRATION PLAN

### **Phase 1: Backup & Preparation (Day 1)**

#### 3.1 Create Safety Structure
```bash
# Create backup directories
mkdir -p src/components/program/legacy/tabs
mkdir -p src/components/methodology
mkdir -p src/contexts/backup

# Backup current components
cp -r src/components/program/tabs/* src/components/program/legacy/tabs/
cp src/contexts/ProgramContext.jsx src/contexts/backup/
cp src/pages/StreamlinedProgram.jsx src/pages/backup/
```

#### 3.2 Create Methodology Registry
```javascript
// src/methodology/registry.js
export const METHODOLOGIES = {
    nasm: {
        id: 'nasm',
        name: 'NASM OPT Model',
        description: 'Evidence-based training using NASM\'s Optimum Performance Training model with comprehensive movement assessment',
        icon: '🎯',
        color: '#2563eb',
        category: 'corrective-fitness',
        targetAudience: ['general-population', 'corrective-exercise', 'beginner-intermediate'],
        capabilities: [
            'movement-assessment',
            'corrective-exercise', 
            'opt-model-periodization',
            'injury-prevention',
            'motor-control'
        ],
        goals: [
            'corrective-exercise',
            'general-fitness', 
            'weight-loss',
            'movement-quality',
            'injury-rehabilitation'
        ],
        assessmentTypes: ['movement-screen', 'postural-analysis', 'opt-questionnaire'],
        periodizationModel: 'opt-phases',
        assessmentComponent: 'CompleteNASMAssessment',
        periodizationComponent: 'NASMOptModelPeriodization',
        programDesignComponent: 'NASMProgramDesign'
    },
    rp: {
        id: 'rp',
        name: 'Renaissance Periodization',
        description: 'Scientific volume-based training for hypertrophy and body composition with auto-regulation',
        icon: '📊',
        color: '#059669',
        category: 'hypertrophy-bodybuilding',
        targetAudience: ['intermediate-advanced', 'bodybuilding', 'physique'],
        capabilities: [
            'volume-landmarks',
            'auto-regulation',
            'mev-mav-mrv',
            'body-composition',
            'hypertrophy-focus'
        ],
        goals: [
            'hypertrophy',
            'body-composition',
            'muscle-gain',
            'physique-development'
        ],
        assessmentTypes: ['volume-history', 'recovery-capacity', 'body-composition'],
        periodizationModel: 'volume-progression',
        assessmentComponent: 'ComprehensiveRPAssessment',
        periodizationComponent: 'RPPeriodization',
        programDesignComponent: 'RPProgramDesign'
    },
    powerlifting: {
        id: 'powerlifting',
        name: '5/3/1 Powerlifting',
        description: 'Strength-focused training with competition preparation and max strength development',
        icon: '💪',
        color: '#dc2626',
        category: 'strength-powerlifting',
        targetAudience: ['intermediate-advanced', 'powerlifting', 'strength-athletes'],
        capabilities: [
            'max-testing',
            'competition-prep',
            '531-methodology',
            'strength-development',
            'peaking-protocols'
        ],
        goals: [
            'max-strength',
            'powerlifting-competition',
            'strength-development',
            'pr-achievement'
        ],
        assessmentTypes: ['1rm-testing', 'competition-goals', 'technical-analysis'],
        periodizationModel: '531-waves',
        assessmentComponent: 'PowerliftingAssessment',
        periodizationComponent: 'PowerliftingPeriodization',
        programDesignComponent: 'PowerliftingProgramDesign'
    },
    linear: {
        id: 'linear',
        name: 'Linear Periodization',
        description: 'Progressive overload with motor control focus for general fitness and strength development',
        icon: '📈',
        color: '#7c3aed',
        category: 'general-strength',
        targetAudience: ['beginner-intermediate', 'general-fitness', 'motor-control'],
        capabilities: [
            'linear-progression',
            'motor-control',
            'movement-quality',
            'basic-strength',
            'beginner-friendly'
        ],
        goals: [
            'general-fitness',
            'basic-strength',
            'motor-control',
            'movement-learning',
            'foundational-training'
        ],
        assessmentTypes: ['movement-quality', 'motor-control', 'basic-fitness'],
        periodizationModel: 'linear-progression',
        assessmentComponent: 'MovementQualityAssessment',
        periodizationComponent: 'LinearPeriodization',
        programDesignComponent: 'LinearProgramDesign'
    },
    bryant: {
        id: 'bryant',
        name: 'Josh Bryant Method',
        description: 'Tactical and strongman training with specificity for performance and occupational demands',
        icon: '🪖',
        color: '#059669',
        category: 'tactical-performance',
        targetAudience: ['tactical-athletes', 'strongman', 'performance'],
        capabilities: [
            'tactical-specificity',
            'strongman-training',
            'pha-protocols',
            'gainer-type-analysis',
            'performance-optimization'
        ],
        goals: [
            'tactical-performance',
            'strongman-competition',
            'occupational-fitness',
            'performance-enhancement'
        ],
        assessmentTypes: ['pha-screen', 'gainer-type', 'tactical-specificity'],
        periodizationModel: 'block-periodization',
        assessmentComponent: 'TacticalAssessment',
        periodizationComponent: 'TacticalPeriodization',
        programDesignComponent: 'TacticalProgramDesign'
    }
};
```

### **Phase 2: Context Enhancement (Day 2)**

#### 3.3 Create Enhanced MethodologyContext
```javascript
// src/contexts/MethodologyContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { METHODOLOGIES } from '../methodology/registry';

const MethodologyContext = createContext();

const initialState = {
    // Step 1: Methodology Selection
    selectedMethodology: null,        // methodology ID
    methodologyConfig: null,          // methodology object from registry
    methodologyCapabilities: [],     // derived from methodology
    
    // Step 2: Methodology-Aware Goals  
    primaryGoal: '',
    goalFramework: null,              // methodology-specific goal structure
    availableGoals: [],               // filtered by methodology
    
    // Steps 3-4: Universal (preserved)
    experienceLevel: null,
    timeline: null,
    
    // Step 5: Methodology-Specific Assessment
    assessmentData: {
        nasm: null,                   // Complete NASM assessment
        rp: null,                     // RP volume + body comp
        powerlifting: null,           // Max testing + competition
        linear: null,                 // Movement quality + motor control  
        bryant: null                  // PHA + gainer + tactical
    },
    assessmentCompleted: false,
    assessmentResults: null,
    
    // Step 6: Methodology-Aware Injury Screening
    injuryScreen: null,
    methodologySpecificModifications: null,
    
    // Step 7: Methodology-Specific Periodization
    periodizationModel: null,         // methodology's periodization approach
    periodizationData: null,          // methodology-specific structure
    
    // Step 8: Implementation (universal but methodology-aware)
    implementation: null,
    
    // Workflow State
    currentStep: 1,
    workflowPhase: 'methodology-selection', // 'methodology-selection', 'goal-setting', 'assessment', 'periodization', 'implementation'
    stepHistory: [],                  // breadcrumb trail
    
    // Backward Compatibility
    legacy: null                      // preserve current ProgramContext state
};

export const useMethodology = () => {
    const context = useContext(MethodologyContext);
    if (!context) {
        throw new Error('useMethodology must be used within MethodologyProvider');
    }
    return context;
};
```

#### 3.4 Enhance ProgramContext for Dual Support
```javascript
// src/contexts/ProgramContext.jsx (Enhanced)
export const ProgramProvider = ({ children, workflowType = 'current' }) => {
    const [state, dispatch] = useReducer(programReducer, {
        ...initialState,
        workflowType,
        methodology: workflowType === 'methodology-first' ? methodologyInitialState : null
    });
    
    const actions = {
        // Current workflow actions (preserved)
        ...currentActions,
        
        // New methodology-first actions
        setSelectedMethodology: (methodology) => dispatch({
            type: 'SET_SELECTED_METHODOLOGY',
            payload: methodology
        }),
        setMethodologyAssessment: (methodologyId, assessmentData) => dispatch({
            type: 'SET_METHODOLOGY_ASSESSMENT',
            payload: { methodologyId, assessmentData }
        }),
        
        // Migration utilities
        migrateToMethodologyFirst: () => dispatch({
            type: 'MIGRATE_TO_METHODOLOGY_FIRST'
        }),
        migrateToLegacy: () => dispatch({
            type: 'MIGRATE_TO_LEGACY'  
        })
    };
    
    return (
        <ProgramContext.Provider value={{ state, actions, dispatch }}>
            {workflowType === 'methodology-first' ? (
                <MethodologyProvider>
                    {children}
                </MethodologyProvider>
            ) : (
                children
            )}
        </ProgramContext.Provider>
    );
};
```

### **Phase 3: Component Creation (Days 3-4)**

#### 3.5 Create Core Methodology Components

**Step 1: Methodology Selection**
```jsx
// src/components/methodology/selection/MethodologySelectionStep.jsx
import React from 'react';
import { METHODOLOGIES } from '../../../methodology/registry';
import MethodologyCard from './MethodologyCard';

const MethodologySelectionStep = () => {
    const { state, actions } = useMethodology();
    
    const handleMethodologySelect = (methodologyId) => {
        const methodology = METHODOLOGIES[methodologyId];
        actions.setSelectedMethodology(methodology);
        actions.setCurrentStep(2); // Go to methodology-aware goals
    };
    
    return (
        <div className="methodology-selection">
            <div className="selection-header">
                <h2>🏛️ Choose Your Training Methodology</h2>
                <p>Select the training approach that best matches your goals and experience</p>
            </div>
            
            <div className="methodology-grid">
                {Object.values(METHODOLOGIES).map(methodology => (
                    <MethodologyCard
                        key={methodology.id}
                        methodology={methodology}
                        isSelected={state.selectedMethodology?.id === methodology.id}
                        onSelect={() => handleMethodologySelect(methodology.id)}
                    />
                ))}
            </div>
            
            <div className="selection-comparison">
                <MethodologyComparison methodologies={Object.values(METHODOLOGIES)} />
            </div>
        </div>
    );
};
```

**Step 5: Assessment Router**
```jsx
// src/components/methodology/assessments/MethodologySpecificAssessmentStep.jsx
import React, { Suspense, lazy } from 'react';
import { useMethodology } from '../../../contexts/MethodologyContext';

const assessmentComponents = {
    nasm: lazy(() => import('./nasm/CompleteNASMAssessment')),
    rp: lazy(() => import('./rp/ComprehensiveRPAssessment')),
    powerlifting: lazy(() => import('./powerlifting/PowerliftingAssessment')),
    linear: lazy(() => import('./linear/MovementQualityAssessment')),
    bryant: lazy(() => import('./bryant/TacticalAssessment'))
};

const MethodologySpecificAssessmentStep = () => {
    const { state } = useMethodology();
    const { selectedMethodology } = state;
    
    if (!selectedMethodology) {
        return <div>No methodology selected</div>;
    }
    
    const AssessmentComponent = assessmentComponents[selectedMethodology.id];
    
    return (
        <div className="methodology-assessment">
            <div className="assessment-header">
                <h2>🔬 {selectedMethodology.name} Assessment</h2>
                <p>{selectedMethodology.description}</p>
            </div>
            
            <Suspense fallback={<div>Loading assessment...</div>}>
                <AssessmentComponent />
            </Suspense>
        </div>
    );
};
```

### **Phase 4: Migration & Testing (Days 5-6)**

#### 3.6 Create Feature Flag System
```javascript
// src/config/features.js
export const FEATURE_FLAGS = {
    METHODOLOGY_FIRST_WORKFLOW: process.env.REACT_APP_METHODOLOGY_FIRST === 'true',
    DUAL_WORKFLOW_SUPPORT: true,
    LEGACY_FALLBACK: true,
    A_B_TEST_WORKFLOWS: process.env.NODE_ENV === 'development'
};

// src/utils/workflowDetection.js
export const determineWorkflow = (user, featureFlags) => {
    // Feature flag override
    if (featureFlags.METHODOLOGY_FIRST_WORKFLOW) {
        return 'methodology-first';
    }
    
    // User preference
    if (user?.preferences?.workflow === 'methodology-first') {
        return 'methodology-first';
    }
    
    // A/B testing logic
    if (featureFlags.A_B_TEST_WORKFLOWS) {
        return Math.random() > 0.5 ? 'methodology-first' : 'current';
    }
    
    return 'current';
};
```

#### 3.7 Create Dual Workflow Router
```jsx
// src/pages/ProgramDesign.jsx (New wrapper)
import React from 'react';
import { useApp } from '../context/AppContext';
import { FEATURE_FLAGS } from '../config/features';
import { determineWorkflow } from '../utils/workflowDetection';
import StreamlinedProgram from './StreamlinedProgram'; // Current workflow
import MethodologyFirstProgram from './MethodologyFirstProgram'; // New workflow

const ProgramDesign = () => {
    const { user } = useApp();
    const workflowType = determineWorkflow(user, FEATURE_FLAGS);
    
    // Analytics tracking
    useEffect(() => {
        analytics.track('workflow_assigned', {
            workflowType,
            userId: user?.id,
            timestamp: new Date().toISOString()
        });
    }, [workflowType, user]);
    
    if (workflowType === 'methodology-first') {
        return <MethodologyFirstProgram />;
    }
    
    return <StreamlinedProgram />;
};
```

## 4. WHAT TO BACKUP/PRESERVE DURING REORGANIZATION

### **Critical Components to Preserve**

#### 4.1 Assessment Logic & Algorithms
```
✅ PRESERVE COMPLETELY:
├── 📁 assessment/nasm/ (entire directory)
│   ├── All NASM assessment components ✅
│   ├── nasmMuscleLookup.js ✅ (Critical algorithms)
│   ├── All assessment validation ✅
│   └── All result calculation logic ✅
├── 📁 program/tabs/ → program/legacy/tabs/
│   ├── InjuryScreeningStep.jsx ✅ (10 structured questions)
│   ├── All methodology assessment components ✅
│   ├── All validation rules ✅
│   └── All calculation algorithms ✅
└── All Context API state management ✅
```

#### 4.2 Data Structures & State
```javascript
// Preserve these exact data structures
✅ PRESERVE:
- All assessment data formats
- All validation schemas  
- All calculation functions
- All state management flows
- All component prop interfaces
- All event handling logic
```

#### 4.3 User Experience Elements
```
✅ PRESERVE:
- All form validation messages
- All progress indicators
- All error handling
- All loading states
- All success confirmations
- All navigation patterns
```

### **Safe Migration Strategy**

#### 4.4 Parallel Development Approach
```
📁 Migration Structure:
├── 📁 current/ (existing components - untouched)
├── 📁 methodology/ (new components)
├── 📁 shared/ (components used by both)
└── 📁 utils/
    ├── migration.js (state conversion)
    ├── validation.js (ensure compatibility)
    └── rollback.js (emergency procedures)
```

## 5. CONTEXT API UPDATES FOR NEW WORKFLOW

### **5.1 Enhanced State Structure**

```javascript
// New MethodologyContext State
const methodologyFirstState = {
    // Step 1: Methodology Selection
    selectedMethodology: {
        id: 'nasm',
        name: 'NASM OPT Model',
        capabilities: ['movement-assessment', 'corrective-exercise'],
        goals: ['corrective-exercise', 'general-fitness'],
        // ... full methodology object
    },
    
    // Step 2: Methodology-Aware Goals
    primaryGoal: 'corrective-exercise', // filtered by methodology
    goalFramework: {
        // NASM-specific goal structure
        corrective: { focus: 'movement-quality', phases: [1,2] },
        fitness: { focus: 'general-fitness', phases: [1,2,3] },
        performance: { focus: 'performance', phases: [3,4,5] }
    },
    
    // Steps 3-4: Universal (preserved exactly)
    experienceLevel: {
        level: 'intermediate',
        trainingAge: 2,
        recoveryCapacity: 'moderate'
    },
    timeline: {
        duration: 12,
        category: 'mesocycle',
        deloadFrequency: 4
    },
    
    // Step 5: Methodology-Specific Assessment
    assessmentData: {
        nasm: {
            movementScreen: { /* existing NASM data */ },
            optQuestionnaire: { /* NEW */ },
            clientConsultation: { /* NEW */ }
        },
        // Other methodologies null when not selected
        rp: null,
        powerlifting: null,
        linear: null,
        bryant: null
    },
    
    // Step 6: Methodology-Aware Injury Screening
    injuryScreen: {
        universalQuestions: { /* existing 10 questions */ },
        methodologySpecific: {
            nasm: {
                movementLimitations: [],
                correctiveExerciseNeeds: [],
                contraindicatedMovements: []
            }
        }
    },
    
    // Step 7: Methodology-Specific Periodization
    periodizationData: {
        model: 'opt-phases', // NASM-specific
        currentPhase: 1,
        phaseProgression: {
            phase1: { focus: 'stability', duration: 4 },
            phase2: { focus: 'strength', duration: 4 },
            phase3: { focus: 'power', duration: 4 }
        }
    },
    
    // Workflow Management
    currentStep: 1,
    stepHistory: [],
    workflowPhase: 'methodology-selection',
    
    // Backward Compatibility Bridge
    legacy: {
        // Exact copy of current ProgramContext state
        // Allows seamless migration both directions
    }
};
```

### **5.2 State Management Actions**

```javascript
// Enhanced Actions for Methodology-First Workflow
const methodologyActions = {
    // Step 1: Methodology Selection
    setSelectedMethodology: (methodology) => ({
        type: 'SET_SELECTED_METHODOLOGY',
        payload: methodology
    }),
    
    // Step 2: Methodology-Aware Goals
    setMethodologyGoal: (goal, framework) => ({
        type: 'SET_METHODOLOGY_GOAL',
        payload: { goal, framework }
    }),
    
    // Step 5: Assessment Management
    setMethodologyAssessment: (methodologyId, assessmentType, data) => ({
        type: 'SET_METHODOLOGY_ASSESSMENT',
        payload: { methodologyId, assessmentType, data }
    }),
    
    completeMethodologyAssessment: (methodologyId, results) => ({
        type: 'COMPLETE_METHODOLOGY_ASSESSMENT',
        payload: { methodologyId, results }
    }),
    
    // Step 6: Enhanced Injury Screening
    setMethodologySpecificInjuryData: (methodologyId, data) => ({
        type: 'SET_METHODOLOGY_INJURY_DATA',
        payload: { methodologyId, data }
    }),
    
    // Step 7: Periodization
    setMethodologyPeriodization: (methodologyId, periodizationData) => ({
        type: 'SET_METHODOLOGY_PERIODIZATION',
        payload: { methodologyId, periodizationData }
    }),
    
    // Migration & Compatibility
    migrateFromLegacy: (legacyState) => ({
        type: 'MIGRATE_FROM_LEGACY',
        payload: legacyState
    }),
    
    migrateToLegacy: () => ({
        type: 'MIGRATE_TO_LEGACY'
    }),
    
    // Workflow Navigation
    setWorkflowStep: (step, phase) => ({
        type: 'SET_WORKFLOW_STEP',
        payload: { step, phase }
    }),
    
    addToStepHistory: (step) => ({
        type: 'ADD_TO_STEP_HISTORY',
        payload: step
    })
};
```

### **5.3 Data Migration Utilities**

```javascript
// src/utils/stateMigration.js
export const migrateToMethodologyFirst = (currentState) => {
    // Infer methodology from current system selection
    const methodologyMapping = {
        'NASM': 'nasm',
        'RP': 'rp',
        '5/3/1': 'powerlifting',
        'linear': 'linear',
        'josh-bryant': 'bryant'
    };
    
    const inferredMethodology = methodologyMapping[currentState.selectedSystem] || null;
    
    return {
        selectedMethodology: inferredMethodology ? METHODOLOGIES[inferredMethodology] : null,
        primaryGoal: currentState.primaryGoal,
        experienceLevel: currentState.experienceLevel,
        timeline: currentState.timeline,
        assessmentData: {
            [inferredMethodology]: extractMethodologyAssessment(currentState),
            // All others null
        },
        injuryScreen: migrateInjuryScreen(currentState.injuryScreen),
        currentStep: inferCurrentStep(currentState),
        legacy: currentState // Preserve everything
    };
};

export const migrateToLegacy = (methodologyFirstState) => {
    return {
        ...methodologyFirstState.legacy,
        // Update with methodology-first changes
        primaryGoal: methodologyFirstState.primaryGoal,
        selectedSystem: mapMethodologyToSystem(methodologyFirstState.selectedMethodology),
        assessmentData: methodologyFirstState.assessmentData[methodologyFirstState.selectedMethodology?.id]
    };
};
```

## 6. POTENTIAL RISKS AND MITIGATION STRATEGIES

### **6.1 Data Loss Risks**

#### Risk: Assessment Data Corruption
```
🚨 RISK: Complex assessment data structures could be corrupted during migration
✅ MITIGATION:
- Complete backup of all assessment components before changes
- Validation functions to verify data integrity
- Rollback mechanism to restore previous state
- Comprehensive test suite for all assessment logic
```

#### Risk: State Management Conflicts
```
🚨 RISK: Context API conflicts between current and new workflow
✅ MITIGATION:
- Separate contexts with clear boundaries
- Migration utilities with validation
- Feature flags for safe testing
- Legacy fallback always available
```

### **6.2 User Experience Risks**

#### Risk: Workflow Disruption
```
🚨 RISK: Users confused by sudden workflow changes
✅ MITIGATION:
- Gradual rollout with A/B testing
- User preference system for workflow choice
- Clear migration guides and tutorials
- Support for both workflows during transition
```

#### Risk: Performance Degradation
```
🚨 RISK: Dynamic component loading could slow down the app
✅ MITIGATION:
- Lazy loading with proper preloading
- Bundle optimization for methodology components
- Performance monitoring and alerts
- Caching strategy for methodology data
```

### **6.3 Development Risks**

#### Risk: Component Dependencies
```
🚨 RISK: Breaking existing component relationships
✅ MITIGATION:
- Preserve all current components in legacy folder
- Shared utilities for common functionality
- Comprehensive component testing
- Clear dependency mapping
```

#### Risk: Context API Complexity
```
🚨 RISK: Over-complex state management with multiple contexts
✅ MITIGATION:
- Clear separation of concerns
- Simple, predictable state structure
- Comprehensive documentation
- Migration utilities for state conversion
```

### **6.4 Business Continuity Risks**

#### Risk: Feature Regression
```
🚨 RISK: Losing existing functionality during refactor
✅ MITIGATION:
- Comprehensive feature inventory before changes
- Automated testing for all critical paths
- Manual QA for user workflows
- Staged rollout with feature validation
```

#### Risk: Support Complexity
```
🚨 RISK: Supporting two different workflows increases complexity
✅ MITIGATION:
- Clear documentation for both workflows
- Training for support team
- User preference tracking
- Automated workflow detection
```

## 7. SUCCESS METRICS & VALIDATION

### **7.1 Technical Validation**
- [ ] All existing assessment algorithms preserved and working
- [ ] All methodology-specific components loading correctly
- [ ] State migration working in both directions
- [ ] Performance maintained or improved
- [ ] All tests passing

### **7.2 User Experience Validation**
- [ ] Users can complete entire workflow without errors
- [ ] Assessment data flows correctly to program generation
- [ ] Methodology selection provides clear value
- [ ] User preference system working
- [ ] Legacy workflow still accessible

### **7.3 Business Validation**
- [ ] No regression in user completion rates
- [ ] New workflow shows improved engagement
- [ ] Support ticket volume not increased
- [ ] Assessment quality maintained or improved

This refactoring plan preserves all your existing NASM assessment work while creating a methodology-first structure that enhances the user experience and makes the system more extensible for future methodologies.
