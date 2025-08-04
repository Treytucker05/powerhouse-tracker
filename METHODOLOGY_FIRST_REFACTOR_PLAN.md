# METHODOLOGY-FIRST WORKFLOW REFACTORING PLAN

## PHASE 1: BACKUP & PREPARATION (Days 1-2)

### 1.1 Create Backup Archive
```bash
# Create backup directory
mkdir -p backup/current-workflow-$(date +%Y%m%d)

# Backup current components
cp -r src/components/program/ backup/current-workflow-$(date +%Y%m%d)/components/
cp -r src/contexts/ backup/current-workflow-$(date +%Y%m%d)/contexts/
cp -r src/pages/ backup/current-workflow-$(date +%Y%m%d)/pages/
```

### 1.2 Document Current State
- [ ] Map all 8 current workflow steps and their components
- [ ] Document all state management flows in ProgramContext
- [ ] Inventory all assessment algorithms and validation rules
- [ ] List all methodology-specific implementations (RP, 5/3/1, Linear, Josh Bryant)
- [ ] Document all data structures and their relationships

### 1.3 Create Legacy Support Structure
```
src/
├── components/
│   ├── program/
│   │   ├── legacy/          ← Archive current workflow
│   │   │   ├── tabs/        ← Current components moved here
│   │   │   └── workflows/   ← Current workflow logic
│   │   ├── methodology/     ← NEW: Methodology-first components
│   │   └── shared/          ← Shared utilities
│   └── assessment/
└── contexts/
    ├── ProgramContext.jsx   ← Enhanced with methodology-first state
    └── LegacyContext.jsx    ← Preserve current state structure
```

## PHASE 2: ANALYSIS & COMPONENT MAPPING (Days 3-4)

### 2.1 Current Component Inventory
**Step 1: Primary Goal → NEW Step 2**
- `PrimaryGoalStep.jsx` → Move to methodology wrapper

**Step 2: Experience Level → NEW Step 3**  
- `ExperienceLevelStep.jsx` → Universal component

**Step 3: Timeline → NEW Step 4**
- `TimelineStep.jsx` → Universal component

**Step 4: Injury Screening → NEW Step 6**
- `InjuryScreeningStep.jsx` → Universal component (might need methodology adaptation)

**Step 5: System Recommendation → BECOMES Step 1**
- `SystemRecommendationStep.jsx` → Transform to methodology selection

**Step 6: Methodology Assessments → NEW Step 5**
- `MovementAssessmentStep.jsx` (Linear)
- `VolumeLandmarksTab.jsx` (RP)
- `TrainingMaxStep.jsx` (5/3/1)
- `PHAHealthScreenStep.jsx` + `GainerTypeStep.jsx` (Josh Bryant)
- NASM Assessment → Integrated methodology option

**Steps 7-8: Architecture → NEW Steps 7-8**
- `PeriodizationStep.jsx` → Methodology-aware
- `ProgramDesignStep.jsx` → Methodology-specific
- `ImplementationStep.jsx` → Methodology-specific

### 2.2 New Component Structure Design
```
methodology/
├── selection/
│   ├── MethodologySelectionStep.jsx     ← NEW Step 1
│   └── MethodologyCard.jsx              ← Individual methodology cards
├── shared/
│   ├── PrimaryGoalStep.jsx              ← Step 2 (methodology-aware)
│   ├── ExperienceLevelStep.jsx          ← Step 3 (universal)
│   ├── TimelineStep.jsx                 ← Step 4 (universal)
│   └── InjuryScreeningStep.jsx          ← Step 6 (methodology-aware)
├── assessments/
│   ├── nasm/
│   │   └── NASMMovementScreen.jsx       ← Step 5 for NASM
│   ├── rp/
│   │   └── RPVolumeAssessment.jsx       ← Step 5 for RP
│   ├── powerlifting/
│   │   └── MaxTestingProtocol.jsx       ← Step 5 for 5/3/1
│   ├── linear/
│   │   └── MovementQualityScreen.jsx    ← Step 5 for Linear
│   └── bryant/
│       └── TacticalAssessment.jsx       ← Step 5 for Josh Bryant
├── architecture/
│   ├── nasm/
│   │   ├── NASMPeriodization.jsx        ← Step 7 for NASM
│   │   └── NASMProgramDesign.jsx        ← Step 8 for NASM
│   ├── rp/
│   │   ├── RPPeriodization.jsx          ← Step 7 for RP
│   │   └── RPProgramDesign.jsx          ← Step 8 for RP
│   └── shared/
│       └── ImplementationStep.jsx       ← Universal final step
└── workflows/
    ├── MethodologyWorkflow.jsx          ← Main workflow orchestrator
    └── MethodologyRouter.jsx            ← Routes to methodology-specific flows
```

## PHASE 3: STATE MANAGEMENT ENHANCEMENT (Days 5-6)

### 3.1 Enhance ProgramContext for Methodology-First
```javascript
// NEW state structure
const methodologyFirstState = {
    // NEW: Methodology Selection (Step 1)
    selectedMethodology: null, // 'nasm', 'rp', '531', 'linear', 'bryant'
    methodologyConfig: null,   // Methodology-specific configuration
    
    // Enhanced workflow state
    currentStep: 1,            // Now starts with methodology selection
    workflowPhase: 'selection', // 'selection', 'assessment', 'architecture'
    
    // Methodology-aware goal setting (Step 2)
    primaryGoal: '',
    goalFramework: null,       // Methodology-specific goal framework
    
    // Universal steps (Steps 3-4, 6)
    experienceLevel: null,
    timeline: null,
    injuryScreen: null,
    
    // Methodology-specific assessment (Step 5)
    methodologyAssessment: {
        nasm: null,    // NASM movement screen results
        rp: null,      // RP volume landmarks
        531: null,     // 5/3/1 max testing
        linear: null,  // Linear movement quality
        bryant: null   // Bryant tactical assessment
    },
    
    // Methodology-specific architecture (Steps 7-8)
    periodization: null,       // Methodology-specific periodization
    programDesign: null,       // Methodology-specific program design
    implementation: null,      // Universal implementation
    
    // Backward compatibility
    legacy: {
        // Preserve all current state structure for gradual migration
        ...currentState
    }
};
```

### 3.2 Create Methodology Abstractions
```javascript
// Methodology interface for consistent API
class MethodologyInterface {
    constructor(config) {
        this.name = config.name;
        this.version = config.version;
        this.capabilities = config.capabilities;
    }
    
    // Standard methodology methods
    getGoalFramework() { /* methodology-specific goals */ }
    getAssessmentComponent() { /* methodology-specific assessment */ }
    getPeriodizationComponent() { /* methodology-specific periodization */ }
    getProgramDesignComponent() { /* methodology-specific program design */ }
    validateAssessment(data) { /* methodology-specific validation */ }
    generateProgram(data) { /* methodology-specific program generation */ }
}
```

## PHASE 4: METHODOLOGY REGISTRATION SYSTEM (Days 7-8)

### 4.1 Create Methodology Registry
```javascript
// src/methodologies/registry.js
export const methodologyRegistry = {
    nasm: {
        name: 'NASM OPT Model',
        description: 'Evidence-based training using NASM\'s Optimum Performance Training model',
        icon: '🎯',
        color: '#2563eb',
        capabilities: ['movement-assessment', 'corrective-exercise', 'periodization'],
        goals: ['corrective', 'fitness', 'performance', 'weight-loss'],
        experience: ['beginner', 'intermediate', 'advanced'],
        assessmentComponent: 'NASMMovementScreen',
        periodizationComponent: 'NASMPeriodization',
        programDesignComponent: 'NASMProgramDesign'
    },
    rp: {
        name: 'Renaissance Periodization',
        description: 'Scientific volume-based training for hypertrophy and body composition',
        icon: '📊',
        color: '#059669',
        capabilities: ['volume-landmarks', 'auto-regulation', 'periodization'],
        goals: ['hypertrophy', 'weight-loss', 'body-composition'],
        experience: ['intermediate', 'advanced'],
        assessmentComponent: 'RPVolumeAssessment',
        periodizationComponent: 'RPPeriodization',
        programDesignComponent: 'RPProgramDesign'
    },
    // ... other methodologies
};
```

### 4.2 Create Dynamic Component Loading
```javascript
// src/components/methodology/MethodologyLoader.jsx
const MethodologyLoader = ({ methodology, step, ...props }) => {
    const methodologyConfig = methodologyRegistry[methodology];
    
    const componentMap = {
        assessment: methodologyConfig.assessmentComponent,
        periodization: methodologyConfig.periodizationComponent,
        programDesign: methodologyConfig.programDesignComponent
    };
    
    const ComponentToRender = lazy(() => 
        import(`../assessments/${methodology}/${componentMap[step]}`)
    );
    
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ComponentToRender {...props} />
        </Suspense>
    );
};
```

## PHASE 5: SAFE MIGRATION STRATEGY (Days 9-10)

### 5.1 Feature Flag Implementation
```javascript
// src/config/features.js
export const featureFlags = {
    METHODOLOGY_FIRST_WORKFLOW: process.env.REACT_APP_METHODOLOGY_FIRST || false,
    PRESERVE_LEGACY_WORKFLOW: true, // Always keep legacy available
    GRADUAL_MIGRATION: true,
    A_B_TEST_WORKFLOWS: true
};
```

### 5.2 Dual Workflow Support
```javascript
// src/pages/ProgramDesign.jsx
const ProgramDesign = () => {
    const { user } = useApp();
    const useMethodologyFirst = featureFlags.METHODOLOGY_FIRST_WORKFLOW;
    
    // Allow user preference override
    const workflowPreference = user?.preferences?.workflow || 'current';
    
    if (useMethodologyFirst && workflowPreference === 'methodology-first') {
        return <MethodologyFirstWorkflow />;
    }
    
    return <StreamlinedProgram />; // Current workflow
};
```

### 5.3 Data Migration Layer
```javascript
// src/utils/workflowMigration.js
export const migrateToMethodologyFirst = (currentState) => {
    return {
        // Map current state to new structure
        selectedMethodology: inferMethodologyFromCurrentState(currentState),
        primaryGoal: currentState.primaryGoal,
        experienceLevel: currentState.experienceLevel,
        timeline: currentState.timeline,
        injuryScreen: currentState.injuryScreen,
        methodologyAssessment: extractMethodologyAssessment(currentState),
        legacy: currentState // Preserve original data
    };
};

export const migrateToLegacy = (methodologyFirstState) => {
    // Convert methodology-first state back to current structure
    return {
        ...methodologyFirstState.legacy,
        // Update with any changes from methodology-first workflow
    };
};
```

## PHASE 6: IMPLEMENTATION ROLLOUT (Days 11-15)

### 6.1 Day 11-12: Core Infrastructure
- [ ] Implement methodology registry system
- [ ] Create base methodology interface classes
- [ ] Build dynamic component loading system
- [ ] Set up feature flags and dual workflow support

### 6.2 Day 13: Methodology Selection Step
- [ ] Create MethodologySelectionStep component
- [ ] Implement methodology cards with full descriptions
- [ ] Add methodology comparison features
- [ ] Integrate with enhanced ProgramContext

### 6.3 Day 14: Assessment Migration
- [ ] Move existing NASM assessment to methodology structure
- [ ] Adapt other assessments (RP, 5/3/1, Linear, Bryant)
- [ ] Ensure all assessment data flows correctly
- [ ] Preserve all existing assessment algorithms

### 6.4 Day 15: Architecture Adaptation
- [ ] Make periodization components methodology-aware
- [ ] Adapt program design for each methodology
- [ ] Ensure implementation step works for all methodologies
- [ ] Test complete workflow end-to-end

## PHASE 7: TESTING & VALIDATION (Days 16-20)

### 7.1 Comprehensive Testing Strategy
- [ ] Unit tests for all new components
- [ ] Integration tests for complete workflows
- [ ] Data migration testing (both directions)
- [ ] Performance testing with dynamic loading
- [ ] User experience testing with both workflows

### 7.2 Validation Checklist
- [ ] All current functionality preserved
- [ ] All assessment algorithms working
- [ ] All methodology implementations functional
- [ ] All state management flows correct
- [ ] All validation rules maintained
- [ ] Performance equivalent or better

## PHASE 8: GRADUAL ROLLOUT (Days 21-30)

### 8.1 Rollout Strategy
1. **Internal Testing** (Days 21-23)
   - Enable methodology-first for development team
   - Fix any issues found during internal use
   
2. **Beta Testing** (Days 24-26)
   - Enable for select users with feature flag
   - Collect feedback and usage analytics
   
3. **A/B Testing** (Days 27-29)
   - Split traffic between both workflows
   - Compare user engagement and completion rates
   
4. **Full Rollout** (Day 30)
   - Make methodology-first the default
   - Keep legacy workflow available as option

## RISK MITIGATION STRATEGIES

### Data Safety
- All original functionality preserved in legacy structure
- Dual workflow support ensures no user disruption
- Complete data migration layer with rollback capability
- Comprehensive backup strategy

### Functionality Preservation
- All assessment algorithms moved, not rewritten
- All methodology implementations preserved
- All validation rules maintained
- All state management flows preserved

### User Experience
- Gradual rollout minimizes impact
- User preference system allows choice
- Legacy workflow remains available
- Clear migration path for power users

### Development Safety
- Feature flags allow safe testing
- Component isolation prevents breaking changes
- Comprehensive testing at each phase
- Rollback plan at every stage

## SUCCESS METRICS

### Technical Metrics
- [ ] Zero functionality regression
- [ ] All tests passing
- [ ] Performance maintained or improved
- [ ] Code coverage maintained

### User Metrics
- [ ] User completion rates maintained or improved
- [ ] User satisfaction scores maintained
- [ ] Support ticket volume not increased
- [ ] Feature adoption tracking

### Business Metrics
- [ ] No disruption to existing users
- [ ] New methodology-first users show engagement
- [ ] Assessment quality scores maintained
- [ ] Program generation success rates maintained

## CONTINGENCY PLANS

### If Issues Found
1. **Minor Issues**: Fix in place with hotfixes
2. **Major Issues**: Rollback to legacy workflow as default
3. **Critical Issues**: Disable methodology-first completely
4. **Data Issues**: Activate data recovery procedures

### Rollback Procedures
1. **Feature Flag Rollback**: Instant via configuration
2. **Code Rollback**: Git revert to stable version
3. **Data Rollback**: Use migration layer to restore legacy state
4. **User Communication**: Clear messaging about temporary changes

This plan ensures a safe, gradual transition to methodology-first workflow while preserving all existing functionality and providing multiple safety nets.
