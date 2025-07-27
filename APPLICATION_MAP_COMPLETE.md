# Complete Application Map

Generated: 2025-07-24T17:09:32.790Z

## Summary
- **Total Files:** 60
- **Pages:** 2
- **Components:** 58
- **Routes:** 36
- **Unused Files:** 32
- **Entry Points:** 2
- **Average Complexity:** 16.02

## Entry Points

### src/main.jsx
- **Type:** main
- **Imports:** 7
- **Routes:** 0

### src/App.jsx
- **Type:** app
- **Imports:** 5
- **Routes:** 3


## Routes

### archive\macrocycle-legacy-20250703\Macrocycle7.1.25.fixed.jsx
- **Type:** unknown
- **Routes:** 2
  - /program → N/A
  - /program → N/A

### src\App.jsx
- **Type:** unknown
- **Routes:** 3
  - / → N/A
  - /assessment → N/A
  - /program → N/A

### src\components\assessment\StepWizard.jsx
- **Type:** unknown
- **Routes:** 1
  - / → N/A

### src\components\Assessment.jsx
- **Type:** unknown
- **Routes:** 1
  - / → N/A

### tracker-ui-good\tracker-ui\src\App.jsx
- **Type:** react-router-dom
- **Routes:** 15
  - /auth → N/A
  - / → N/A
  - program → N/A
  - assessment → N/A
  - tracking → N/A
  - analytics → N/A
  - exercises → N/A
  - profile → N/A
  - resources → N/A
  - mesocycle → N/A
  - microcycle → N/A
  - macrocycle → N/A
  - macrocycle/:id → N/A
  - builder → N/A
  - program-design → N/A

### tracker-ui-good\tracker-ui\src\components\assessment\StepWizard.jsx
- **Type:** unknown
- **Routes:** 3
  - /program → N/A
  - /program → N/A
  - /program → N/A

### tracker-ui-good\tracker-ui\src\components\NavBar.jsx
- **Type:** unknown
- **Routes:** 1
  - /auth → N/A

### tracker-ui-good\tracker-ui\src\layout\AppShell.jsx
- **Type:** unknown
- **Routes:** 3
  - /auth → N/A
  - /auth → N/A
  - / → N/A

### tracker-ui-good\tracker-ui\src\pages\Assessment.jsx
- **Type:** unknown
- **Routes:** 1
  - /program → N/A

### tracker-ui-good\tracker-ui\src\pages\AuthPage.jsx
- **Type:** unknown
- **Routes:** 3
  - / → N/A
  - / → N/A
  - / → N/A

### tracker-ui-good\tracker-ui\src\pages\Macrocycle.jsx
- **Type:** unknown
- **Routes:** 3
  - /macrocycle → N/A
  - /program → N/A
  - /program → N/A


## Pages

### src\pages\design\Mesocycle.jsx
- **Name:** function
- **Size:** 708 bytes
- **Complexity:** 2
- **Navigation:** false
- **Tabs:** None
- **Components Used:** MesocycleWizard
- **Hooks:** useTrainingState

### src\pages\Program.jsx
- **Name:** Program
- **Size:** 7353 bytes
- **Complexity:** 6
- **Navigation:** true
- **Tabs:** Overview, Block Sequencing, Loading Parameters, Training Methods, Program Preview
- **Components Used:** ProgramProvider, Tabs, TabsList, TabsTrigger, TabsContent
- **Hooks:** useApp, useState


## Components by Type

### assessment (6)
- **index** (src\components\assessment\index.js) - Size: 331, Complexity: 0
- **PersonalInfoStep** (src\components\assessment\PersonalInfoStep.jsx) - Size: 1433, Complexity: 0
- **RecommendationStep** (src\components\assessment\RecommendationStep.jsx) - Size: 2363, Complexity: 0
- **StepWizard** (src\components\assessment\StepWizard.jsx) - Size: 8357, Complexity: 20
- **React** (src\components\assessment\TimelineStep.jsx) - Size: 13084, Complexity: 6
- **TrainingExperienceStep** (src\components\assessment\TrainingExperienceStep.jsx) - Size: 1461, Complexity: 0

### unknown (6)
- **Assessment** (src\components\Assessment.jsx) - Size: 5090, Complexity: 1
- **BryantConfig** (src\components\bryant\index.js) - Size: 1618, Complexity: 0
- **MacrocycleStructure** (src\components\program\tabs\MacrocycleStructure.jsx) - Size: 590, Complexity: 0
- **MacrocycleStructure** (src\components\program\tabs\MacrocycleStructure_NEW.jsx) - Size: 622, Complexity: 0
- **AppContainer** (src\components\ui\DesignSystem.jsx) - Size: 7186, Complexity: 0
- **TabsContext** (src\components\ui\tabs.jsx) - Size: 1862, Complexity: 1

### stateful-component (38)
- **BryantClusterInterface** (src\components\bryant\BryantClusterInterface.jsx) - Size: 21292, Complexity: 29
- **BryantPeriodizationDashboard** (src\components\bryant\BryantPeriodizationDashboard.jsx) - Size: 26169, Complexity: 19
- **BryantStrongmanInterface** (src\components\bryant\BryantStrongmanInterface.jsx) - Size: 31258, Complexity: 35
- **BryantTacticalInterface** (src\components\bryant\BryantTacticalInterface.jsx) - Size: 30179, Complexity: 23
- **EnhancedMacrocyclePlanner** (src\components\macrocycle\EnhancedMacrocyclePlanner.jsx) - Size: 34788, Complexity: 22
- **GoalSelector** (src\components\macrocycle\GoalSelector.jsx) - Size: 16201, Complexity: 11
- **MacrocycleCalendar** (src\components\macrocycle\MacrocycleCalendar.jsx) - Size: 17450, Complexity: 15
- **SortableMesocycleCard** (src\components\macrocycle\SortableMesocycleCard.jsx) - Size: 17766, Complexity: 9
- **UnifiedMacrocyclePlanner** (src\components\macrocycle\UnifiedMacrocyclePlanner.jsx) - Size: 44613, Complexity: 29
- **function** (src\components\mesocycle\MesocycleWizard.jsx) - Size: 1472, Complexity: 9
- **ClusterSetComponent** (src\components\program\ClusterSetComponent.jsx) - Size: 11991, Complexity: 12
- **BlockSequencing** (src\components\program\tabs\BlockSequencing.jsx) - Size: 14562, Complexity: 9
- **AssessmentGoals** (src\components\program\tabs\consolidated\AssessmentGoals.jsx) - Size: 23134, Complexity: 24
- **ConsolidatedFramework** (src\components\program\tabs\consolidated\ConsolidatedFramework.jsx) - Size: 16054, Complexity: 28
- **ExerciseSelectionProgression** (src\components\program\tabs\consolidated\ExerciseSelectionProgression.jsx) - Size: 40594, Complexity: 40
- **ImplementationTracking** (src\components\program\tabs\consolidated\ImplementationTracking.jsx) - Size: 33179, Complexity: 30
- **PeriodizationPlanning** (src\components\program\tabs\consolidated\PeriodizationPlanning.jsx) - Size: 31866, Complexity: 40
- **VolumeRecoveryManagement** (src\components\program\tabs\consolidated\VolumeRecoveryManagement.jsx) - Size: 39903, Complexity: 46
- **EnhancedAssessmentGoals** (src\components\program\tabs\EnhancedAssessmentGoals.jsx) - Size: 11192, Complexity: 9
- **EnhancedImplementation** (src\components\program\tabs\EnhancedImplementation.jsx) - Size: 11171, Complexity: 9
- **EnhancedSessionStructure** (src\components\program\tabs\EnhancedSessionStructure.jsx) - Size: 15026, Complexity: 11
- **GoalsAndNeeds** (src\components\program\tabs\GoalsAndNeeds.jsx) - Size: 35824, Complexity: 14
- **GoalsAndNeedsWithDesignSystem** (src\components\program\tabs\GoalsAndNeedsWithDesignSystem.jsx) - Size: 9135, Complexity: 4
- **Implementation** (src\components\program\tabs\Implementation.jsx) - Size: 40724, Complexity: 41
- **LoadingParameters** (src\components\program\tabs\LoadingParameters.jsx) - Size: 20284, Complexity: 7
- **MesocyclePlanning** (src\components\program\tabs\MesocyclePlanning.jsx) - Size: 24738, Complexity: 30
- **MicrocycleDesign** (src\components\program\tabs\MicrocycleDesign.jsx) - Size: 23621, Complexity: 10
- **OPEXNutrition** (src\components\program\tabs\OPEXNutrition.jsx) - Size: 40651, Complexity: 32
- **PhaseDesign** (src\components\program\tabs\PhaseDesign.jsx) - Size: 25850, Complexity: 4
- **ProgramOverview** (src\components\program\tabs\ProgramOverview.jsx) - Size: 13275, Complexity: 8
- **ProgramPreview** (src\components\program\tabs\ProgramPreview.jsx) - Size: 19607, Complexity: 13
- **SessionMonitoring** (src\components\program\tabs\SessionMonitoring.jsx) - Size: 21278, Complexity: 8
- **Specialty** (src\components\program\tabs\Specialty.jsx) - Size: 4868, Complexity: 4
- **TrainingBlocks** (src\components\program\tabs\TrainingBlocks.jsx) - Size: 17120, Complexity: 15
- **TrainingMethods** (src\components\program\tabs\TrainingMethods.jsx) - Size: 20056, Complexity: 9
- **VariableManipulation** (src\components\program\tabs\VariableManipulation.jsx) - Size: 3504, Complexity: 4
- **VolumeLandmarks** (src\components\program\tabs\VolumeLandmarks.jsx) - Size: 4493, Complexity: 4
- **StrongmanEventComponent** (src\components\StrongmanEventComponent.jsx) - Size: 19434, Complexity: 20

### context (1)
- **ProgramProvider** (src\contexts\ProgramContext.jsx) - Size: 7956, Complexity: 5

### hook (3)
- **useAssessment** (src\hooks\useAssessment.js) - Size: 34980, Complexity: 54
- **useDesignSystem** (src\hooks\useDesignSystem.js) - Size: 3323, Complexity: 6
- **useProgram** (src\hooks\useProgram.js) - Size: 11980, Complexity: 18

### utility (4)
- **CoreUtilities** (src\utils\coreUtilities.js) - Size: 11169, Complexity: 19
- **migrateFromSrc** (src\utils\migrationUtils.js) - Size: 16812, Complexity: 27
- **performPHAScreening** (src\utils\phaScreening.js) - Size: 22805, Complexity: 69
- **calculateVolumeProgression** (src\utils\programLogic.js) - Size: 22749, Complexity: 41


## Unused Files (Candidates for Removal)

- **src\pages\design\Mesocycle.jsx** - No imports found (708 bytes)

- **src\components\assessment\index.js** - No imports found (331 bytes)

- **src\components\assessment\TimelineStep.jsx** - No imports found (13084 bytes)

- **src\components\bryant\BryantPeriodizationDashboard.jsx** - No imports found (26169 bytes)

- **src\components\bryant\index.js** - No imports found (1618 bytes)

- **src\components\mesocycle\MesocycleWizard.jsx** - No imports found (1472 bytes)

- **src\components\program\ClusterSetComponent.jsx** - No imports found (11991 bytes)

- **src\components\program\tabs\consolidated\ConsolidatedFramework.jsx** - No imports found (16054 bytes)

- **src\components\program\tabs\EnhancedAssessmentGoals.jsx** - No imports found (11192 bytes)

- **src\components\program\tabs\EnhancedImplementation.jsx** - No imports found (11171 bytes)

- **src\components\program\tabs\EnhancedSessionStructure.jsx** - No imports found (15026 bytes)

- **src\components\program\tabs\GoalsAndNeedsWithDesignSystem.jsx** - No imports found (9135 bytes)

- **src\components\program\tabs\MacrocycleStructure.jsx** - No imports found (590 bytes)

- **src\components\program\tabs\MacrocycleStructure_NEW.jsx** - No imports found (622 bytes)

- **src\components\program\tabs\MesocyclePlanning.jsx** - No imports found (24738 bytes)

- **src\components\program\tabs\OPEXNutrition.jsx** - No imports found (40651 bytes)

- **src\components\program\tabs\PhaseDesign.jsx** - No imports found (25850 bytes)

- **src\components\program\tabs\SessionMonitoring.jsx** - No imports found (21278 bytes)

- **src\components\program\tabs\Specialty.jsx** - No imports found (4868 bytes)

- **src\components\program\tabs\TrainingBlocks.jsx** - No imports found (17120 bytes)

- **src\components\program\tabs\VariableManipulation.jsx** - No imports found (3504 bytes)

- **src\components\program\tabs\VolumeLandmarks.jsx** - No imports found (4493 bytes)

- **src\components\StrongmanEventComponent.jsx** - No imports found (19434 bytes)

- **src\components\ui\DesignSystem.jsx** - No imports found (7186 bytes)

- **src\components\ui\tabs.jsx** - No imports found (1862 bytes)

- **src\contexts\ProgramContext.jsx** - No imports found (7956 bytes)

- **src\hooks\useDesignSystem.js** - No imports found (3323 bytes)

- **src\hooks\useProgram.js** - No imports found (11980 bytes)

- **src\utils\coreUtilities.js** - No imports found (11169 bytes)

- **src\utils\migrationUtils.js** - No imports found (16812 bytes)

- **src\utils\phaScreening.js** - No imports found (22805 bytes)

- **src\utils\programLogic.js** - No imports found (22749 bytes)


## Dependencies Analysis

### src\pages\design\Mesocycle.jsx
- **Dependencies:** 2
- **Dependents:** 0
- **Used:** false

### src\pages\Program.jsx
- **Dependencies:** 8
- **Dependents:** 10
- **Used:** true

### src\components\assessment\index.js
- **Dependencies:** 0
- **Dependents:** 0
- **Used:** false

### src\components\assessment\PersonalInfoStep.jsx
- **Dependencies:** 0
- **Dependents:** 1
- **Used:** true

### src\components\assessment\RecommendationStep.jsx
- **Dependencies:** 0
- **Dependents:** 1
- **Used:** true

### src\components\assessment\StepWizard.jsx
- **Dependencies:** 5
- **Dependents:** 1
- **Used:** true

### src\components\assessment\TimelineStep.jsx
- **Dependencies:** 0
- **Dependents:** 0
- **Used:** false

### src\components\assessment\TrainingExperienceStep.jsx
- **Dependencies:** 0
- **Dependents:** 1
- **Used:** true

### src\components\Assessment.jsx
- **Dependencies:** 2
- **Dependents:** 4
- **Used:** true

### src\components\bryant\BryantClusterInterface.jsx
- **Dependencies:** 0
- **Dependents:** 1
- **Used:** true


## Recommendations
- Remove 32 unused files to reduce bundle size
- Refactor 18 high-complexity files
- Consolidate 3 duplicate routes
