# 🌳 **PROGRAM DESIGN SYSTEM FLOW TREE**

## **🎯 VISUAL SYSTEM OVERVIEW**

```
                              PROGRAM DESIGN SYSTEM
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
            🎯 PRIMARY           🔄 LEGACY           🧪 FITNESS-TRACKER
     tracker-ui-good/          src/pages/          fitness-tracker/
     tracker-ui/src/           Program.jsx         src/pages/
     pages/Program.jsx                             Program.jsx
            │                        │                      │
            │                        │                      │
    ┌───────┴────────┐      ┌────────┴────────┐            │
    │                │      │                 │            │
5-COMPONENT     BRYANT  7-STEP         SPECIALIZED     ALTERNATIVE
FRAMEWORK    INTEGRATION  METHOD          TOOLS       IMPLEMENTATION
    │                │      │                 │            │
    │                │      │                 │            │
┌───┴───┐           │  ┌───┴───┐        ┌────┴────┐       │
│       │           │  │       │        │         │       │
TABS  STATE         │  TABS   LEGACY    MISSING   PARTIAL  EXPERIMENTAL
      MGMT          │        COMPONENTS  FILES    IMPL     FEATURES
```

## **ROOT ENTRY POINTS**

```
📁 Program Design System
├── 🎯 PRIMARY: tracker-ui-good/tracker-ui/src/pages/Program.jsx
├── 🔄 LEGACY: src/pages/Program.jsx  
└── 🧪 FITNESS-TRACKER: fitness-tracker/src/pages/Program.jsx
```

---

## **🎯 PRIMARY IMPLEMENTATION FLOW**
### **tracker-ui-good/tracker-ui/src/pages/Program.jsx**

```
                                Program.jsx
                                     │
                             ProgramProvider
                                     │
                              ProgramContent
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            🧠 STATE MGMT    📊 5-COMPONENT    🔧 SUPPORTING
            useProgramContext   FRAMEWORK        SYSTEMS
                    │                │                │
                    │                │                │
            ┌───────┴───────┐        │        ┌───────┴───────┐
            │               │        │        │               │
        ACTIONS         STATE        │    BRYANT METHODS   MIGRATION
        (13 total)      DATA         │    COMPONENT        UTILS
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                   TAB 1-2       TAB 3        TAB 4-5
               Assessment &   Periodization   Program Design
                Screening                    & Implementation
                        │            │            │
                        │            │            │
               ┌────────┴───┐   ┌────┴────┐  ┌────┴────┐
               │            │   │         │  │         │
          PROGRAM      ENHANCED MACRO   MESO  EXERCISE  SESSION
          OVERVIEW     ASSESSMENT CYCLE  CYCLE SELECTION TRACKING
                                 │         │       │         │
                                 │         │       │         │
                             RESEARCH  BLOCK   VOLUME   PROGRESS
                             INTEGRATION DESIGN  MGMT    MONITOR
```

---

## **🔄 LEGACY IMPLEMENTATION FLOW**
### **src/pages/Program.jsx**

```
                            Program.jsx (Legacy)
                                     │
                             ProgramProvider
                                     │
                          Enhanced Program Component
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                7-STEP METHOD    SPECIALIZED   RESEARCH
                (Sequential)       TOOLS      INTEGRATION
                        │            │            │
                        │            │            │
    ┌───┬───┬───┬───┬───┴───┬───┐    │     ┌─────┴─────┐
    │   │   │   │   │       │   │    │     │           │
   1️⃣  2️⃣  3️⃣  4️⃣  5️⃣      6️⃣  7️⃣   │   BRYANT    RP
  ASSESS GOALS PERIOD PHASE SESSION IMPL MONITOR │  PARTIAL  PARTIAL
                                         │
                                    ┌────┴────┐
                                    │         │
                                EXISTING   MISSING
                                8 TOOLS    8 TOOLS
                                    │         │
                          ┌─────────┴┐       │
                          │          │       │
                    PROGRAM      OPEX       [FILES
                    OVERVIEW   NUTRITION    NOT FOUND]
```

---

## **📊 STATE MANAGEMENT FLOW**

### **Context Architecture**
```
🧠 ProgramContext.jsx (Primary)
├── 📝 State Structure
│   ├── UI State
│   │   ├── activeTab: 'goals'
│   │   ├── selectedLevel: null
│   │   ├── usePeriodization: true
│   │   └── showPreview: false
│   │
│   ├── Program Data
│   │   ├── programData: {name, goal, duration, trainingDays}
│   │   ├── selectedTemplate: null
│   │   └── assessmentData: null
│   │
│   ├── Training Configuration
│   │   ├── selectedTrainingModel: ''
│   │   ├── blockSequence: [accumulation, intensification, realization, deload]
│   │   ├── blockParameters: {loading, movement, results}
│   │   └── methodSFR: ''
│   │
│   └── 🎯 Bryant Integration [NEW]
│       ├── bryantIntegrated: false
│       ├── bryantFeatures: []
│       ├── bryantValidation: null
│       ├── legacyMigrationStatus: null
│       └── migrationReport: null
│
├── 🔄 Actions (13 Actions)
│   ├── SET_ACTIVE_TAB
│   ├── SET_PROGRAM_DATA
│   ├── SET_TRAINING_MODEL
│   ├── SET_BLOCK_SEQUENCE
│   ├── UPDATE_BLOCK_PARAMETER
│   ├── SET_BRYANT_INTEGRATED [NEW]
│   └── SET_LEGACY_MIGRATION_STATUS [NEW]
│
└── 🎣 Hooks & Effects
    ├── Assessment Loading (useEffect)
    ├── AppContext Integration
    └── localStorage Fallback
```

---

## **🔬 RESEARCH INTEGRATION FLOW TREE**

```
                            RESEARCH SYSTEMS
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            🎯 BRYANT           📈 RP         🏋️ WESTSIDE
         (Pages 101-129)     (PARTIAL)      (MISSING)
                    │               │               │
                    │               │               │
        ┌───────────┼───────────┐   │               │
        │           │           │   │               │
    CONSTANTS   BACKEND     UI/DB   │               │
    ✅ DONE    ✅ DONE   ⚠️ PARTIAL │               │
        │           │           │   │               │
        │           │           │   │               │
    PHA_MAX:6   CLUSTER      MICRO  │          [NO FILES
    CLUSTER:15  STRONGMAN    CYCLE  │           FOUND]
    TIME:60     TACTICAL     UI     │
    RATIO:1.5   VOLUME              │
                CALCS               │
                                    │
                            ┌───────┴───────┐
                            │               │
                        TEST IMPL       UI MISSING
                        ✅ COMPLETE     ❌ MISSING
                            │               │
                            │               │
                        MEV/MRV         VOLUME
                        LANDMARKS       LANDMARKS
                        TESTING         TAB
```

---

## **🏗️ COMPONENT RELATIONSHIP TREE**

```
                           COMPONENT ECOSYSTEM
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
    🎣 HOOKS & UTILS        📋 UI COMPONENTS       🗄️ DATABASE
            │                       │                       │
            │                       │                       │
    ┌───────┴───────┐      ┌────────┴────────┐     ┌───────┴───────┐
    │               │      │                 │     │               │
useAssessment   programLogic  TABS        FORMS   TABLES      FUNCTIONS
    │               │      │                 │     │               │
    │               │      │                 │     │               │
┌───┴───┐      ┌────┴────┐ │            ┌────┴───┐ │          ┌────┴────┐
│       │      │         │ │            │        │ │          │         │
FIBER  GOAL   BRYANT   VOLUME │        INPUTS  BUTTONS │      EXISTING  MISSING
TYPE  ANALYSIS LOGIC   CALCS  │                       │         │         │
  │       │      │        │   │                       │         │         │
  ✅      ✅     ✅       ✅  │                       │         ✅        ❌
                             │                       │    get_volume   calculate_
                        ┌────┴────┐             ┌────┴───┐   calculate  strongman_
                        │         │             │        │   fatigue    volume
                    EXISTING   MISSING      EXISTING   GAPS
                       30+       15+          CORE    BRYANT
                      FILES     FILES        SCHEMA   VIEWS
```

---

## **🏗️ COMPONENT ARCHITECTURE FLOW**

### **Assessment System**
```
🔍 Assessment & Screening
├── 🎣 useAssessment.js (Hook)
│   ├── Fiber Type Testing
│   ├── Training Age Analysis  
│   ├── Goal Validation
│   ├── ❌ PHA Screening [MISSING]
│   └── Risk Scoring [PARTIAL]
│
├── 📋 Assessment Components
│   ├── GoalsAndNeeds.jsx (Legacy)
│   ├── EnhancedAssessmentGoals.jsx (Enhanced)
│   └── GoalsAndNeedsWithDesignSystem.jsx (Design System)
│
└── 🔗 Integration Points
    ├── AppContext connection
    ├── localStorage fallback
    └── Supabase sync [PLANNED]
```

### **Exercise Selection System**
```
🏋️ Exercise Selection Flow
├── 📊 Exercise Database (exerciseSelection.js)
│   ├── EXERCISE_DATABASE object
│   │   ├── Muscle Groups (chest, back, legs, etc.)
│   │   ├── Exercise Properties
│   │   │   ├── type: compound/isolation
│   │   │   ├── primaryMuscles: []
│   │   │   ├── equipment: []
│   │   │   ├── fatigueIndex: 1-10
│   │   │   └── ranges: {strength, hypertrophy, endurance}
│   │   │
│   │   └── 🎯 Bryant Extensions
│   │       ├── Cluster configurations
│   │       ├── Strongman events
│   │       └── Tactical applications
│   │
├── 🧮 Selection Algorithms
│   ├── addExerciseCategory() function
│   ├── Fatigue-based selection
│   ├── Equipment constraints
│   └── Goal-specific filtering
│
└── 🎛️ UI Components [MISSING/SCATTERED]
    ├── Exercise selection interface
    ├── Category filters
    └── Preview/validation
```

### **Periodization System**
```
📅 Periodization Flow
├── 🏗️ Macrocycle Level
│   ├── MacrocycleStructure.jsx
│   ├── MacrocycleStructure_NEW.jsx
│   ├── Program duration (4-6 weeks for Bryant)
│   └── Block sequencing
│
├── 📊 Mesocycle Level  
│   ├── MesocyclePlanning.jsx
│   ├── Phase types (accumulation, intensification, realization)
│   ├── Volume/intensity relationships
│   └── 🎯 Bryant phase caps
│
├── 📆 Microcycle Level
│   ├── MicrocycleDesign.jsx
│   │   ├── Weekly patterns
│   │   ├── Daily undulation
│   │   ├── 🎯 Bryant cluster patterns
│   │   └── 🎯 Bryant strongman integration
│   │
│   └── Session Structure
│       ├── SessionMonitoring.jsx
│       ├── EnhancedSessionStructure.jsx
│       └── Exercise ordering
│
└── 📈 Progression Models
    ├── Linear progression
    ├── Block periodization  
    ├── Conjugate method
    ├── Daily undulating
    └── 🎯 Bryant hybrid [NEW]
```

---

## **🗄️ DATABASE INTEGRATION FLOW**

### **Supabase Schema**
```
🗄️ Database Structure
├── 👤 Core Tables
│   ├── profiles (user data)
│   ├── programs (program definitions)
│   ├── exercises (exercise library)
│   └── workout_sessions (training logs)
│
├── 📊 Program Design Tables
│   ├── program_weeks
│   ├── planned_sessions  
│   ├── planned_exercises
│   └── workout_sets
│
├── 🎯 Bryant Extensions [IMPLEMENTED]
│   ├── strongman_metrics JSONB
│   ├── cluster_metrics JSONB
│   ├── bryant_integrated BOOLEAN
│   └── tactical_range INT[] [MISSING]
│
├── 🔧 Functions
│   ├── ✅ get_volume_tonnage()
│   ├── ✅ calculate_fatigue_score()
│   ├── ❌ calculate_strongman_volume() [MISSING]
│   └── 🔄 Migration functions [PARTIAL]
│
└── 📊 Views & Analytics
    ├── Performance tracking
    ├── Volume progression
    └── 🎯 Bryant compliance views
```

---

## **🚦 DATA FLOW & USER JOURNEY TREE**

```
                              USER JOURNEY
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
               ENTRY POINT    ASSESSMENT     CONFIGURATION
                    │              │              │
                    │              │              │
        ┌───────────┴───────────┐  │      ┌───────┴───────┐
        │                       │  │      │               │
   🎯 PRIMARY              🔄 LEGACY │   PERIODIZATION  EXERCISE
   tracker-ui-good        src/pages │   MODEL SELECT   SELECTION
        │                       │  │      │               │
        │                       │  │      │               │
    MIGRATION              DIRECT   │   ┌──┴──┐         ┌─┴─┐
    [MISSING]              ACCESS   │   │     │         │   │
                                   │  LINEAR BRYANT    DB  UI
                               ┌───┴───┐ │     │         │   │
                               │       │ │     │         ✅  ⚠️
                           PHA    GOAL  │ ✅    ✅
                         SCREEN  ANALYSIS ⚠️   ✅
                         [MISSING] ✅
```

```
                            STATE FLOW TREE
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              USER ACTION    CONTEXT UPDATE   DATABASE SYNC
                    │              │              │
                    │              │              │
        ┌───────────┴───────────┐  │      ┌───────┴───────┐
        │                       │  │      │               │
    UI INTERACTION         FORM   │   useReducer      SUPABASE
        │                 INPUT   │      │               │
        │                       │  │      │               │
    ┌───┴───┐            ┌─────┴─┐ │   ┌──┴──┐        ┌───┴───┐
    │       │            │       │ │   │     │        │       │
   CLICK   NAVIGATION   BRYANT   GOAL │ ACTION STATE   REAL   BATCH
           │            SELECT  SET  │ DISPATCH │     TIME    UPDATE
           │               │      │  │   │      │      │       │
           ✅              ✅     ✅ │   ✅     ✅     ❌      ⚠️
                                    │
                               ┌────┴────┐
                               │         │
                           RE-RENDER  VALIDATION
                               │         │
                               ✅        ⚠️
```

---

## **⚠️ CRITICAL GAPS VISUALIZATION**

```
                            SYSTEM HEALTH
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              🔴 CRITICAL    🟡 PARTIAL   ✅ COMPLETE
               MISSING        IMPL         SYSTEMS
                    │            │            │
                    │            │            │
        ┌───────────┴┐      ┌────┴────┐  ┌───┴───┐
        │            │      │         │  │       │
    CONSOLIDATED  MIGRATION │    UI   │  BACKEND RESEARCH
    FRAMEWORK     FUNCTIONS │  GAPS   │  LOGIC   INTEGRATION
        │            │      │         │  │       │
        ❌           ❌     │         │  ✅      ✅
     15+ FILES    3 FUNCS  │         │
                           │         │
                    ┌──────┴───┐  ┌──┴───┐
                    │          │  │      │
                PHA SCREEN  BRYANT UI RP UI
                    │          │  │      │
                    ❌         ⚠️ │      ❌
                             PARTIAL
```

---

## **⚠️ CRITICAL GAPS & MISSING CONNECTIONS**

### **🔴 High Priority Missing**
```
❌ Critical Missing Components
├── 📁 Consolidated Framework
│   ├── src/components/program/tabs/consolidated/ [ENTIRE FOLDER MISSING]
│   ├── AssessmentGoals.jsx [MISSING]
│   ├── PeriodizationPlanning.jsx [MISSING]
│   ├── ExerciseSelectionProgression.jsx [MISSING]
│   ├── VolumeRecoveryManagement.jsx [MISSING]
│   └── ImplementationTracking.jsx [MISSING]
│
├── 🔧 Core Functions
│   ├── migrateFromSrc() [MISSING]
│   ├── performPHAScreening() [MISSING]
│   ├── calculate_strongman_volume() SQL [MISSING]
│   └── Real-time validation [MISSING]
│
├── 📄 Configuration Files
│   ├── rpConstants.js [MISSING]
│   ├── SpecificityTab.jsx [MISSING]
│   ├── MonitoringTab.jsx [MISSING]
│   └── Multiple specialized tools [MISSING]
│
└── 🔗 Integration Points
    ├── Cross-version state sync [MISSING]
    ├── Database real-time updates [MISSING]
    ├── Bryant PHA UI integration [MISSING]
    └── RP volume calculation UI [MISSING]
```

### **🟡 Medium Priority Gaps**
```
⚠️ Partial Implementations
├── 📊 Assessment System
│   ├── PHA health screening (stub only)
│   ├── Risk scoring (incomplete)
│   └── Database integration (partial)
│
├── 🎯 Bryant Integration
│   ├── Backend logic (complete)
│   ├── UI components (partial)
│   └── Validation system (partial)
│
├── 📈 RP Integration  
│   ├── Test framework (complete)
│   ├── Volume landmarks (missing UI)
│   └── Progression algorithms (partial)
│
└── 🗄️ Database Schema
    ├── Core tables (complete)
    ├── Bryant extensions (partial)
    └── Migration tracking (incomplete)
```

---

## **🎯 IMPLEMENTATION PRIORITY TREE**

```
                        DEVELOPMENT ROADMAP
                               │
                ┌──────────────┼──────────────┐
                │              │              │
          PHASE 1          PHASE 2        PHASE 3
        FOUNDATION       INTEGRATION      POLISH
             │                │              │
             │                │              │
    ┌────────┴────────┐      │       ┌──────┴──────┐
    │                 │      │       │             │
CONSOLIDATED      MIGRATION   │   OPTIMIZATION  TESTING
FRAMEWORK         FUNCTIONS   │       │             │
    │                 │      │       │             │
    ❌                ❌     │       ⚠️            ⚠️
 CREATE 15+        IMPLEMENT │    PERFORMANCE    UNIT
 COMPONENTS        3 FUNCS   │     IMPROVE       TESTS
                            │
                    ┌───────┴───────┐
                    │               │
               BRYANT UI         RP UI
               INTEGRATION    INTEGRATION
                    │               │
                    ⚠️              ❌
              PARTIAL IMPL    CREATE FROM
              COMPLETE UI     SCRATCH
```

```
                        FILE CREATION ORDER
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   IMMEDIATE              MEDIUM TERM           LONG TERM
   (Week 1)               (Week 2-3)           (Month 2+)
        │                      │                      │
        │                      │                      │
┌───────┴───────┐      ┌───────┴───────┐      ┌───────┴───────┐
│               │      │               │      │               │
CONSOLIDATED   PHA    BRYANT UI      RP UI    AI FEATURES   MOBILE
COMPONENTS   SCREENING  COMPLETE    COMPLETE    │            OPTIMIZATION
    │           │         │           │         │                │
    │           │         │           │         │                │
   15          1         5           8        TBD              TBD
  FILES       FILE      FILES       FILES    FILES            FILES
```

---

**STATUS LEGEND:**
- ✅ **Complete**: Fully implemented and tested
- ⚠️ **Partial**: Started but needs completion  
- ❌ **Missing**: Not implemented yet
- 🔄 **Legacy**: Exists but needs migration
- 🎯 **Priority**: Critical path item

---

**QUICK REFERENCE:**
- **Total Files Mapped**: 50+ components
- **Critical Missing**: 15+ files
- **Partial Implementations**: 8+ systems
- **Research Integration**: Bryant ✅, RP ⚠️, Westside ❌
- **Database Health**: Core ✅, Extensions ⚠️
- **UI Systems**: Primary ⚠️, Legacy 🔄
