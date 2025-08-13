# NASM Movement Assessment - Technical Implementation Plan
*Created: August 3, 2025*
*Purpose: Detailed technical guide for implementing NASM assessments with VS Code Copilot*

## 🎯 **IMPLEMENTATION OVERVIEW**

### **Goal:** Integrate NASM Chapter 6 movement assessments into PowerHouse Tracker
### **Approach:** Evidence-based assessment system with automatic muscle imbalance analysis
### **Integration:** Enhance existing injury screening (Step 4 of PowerHouse workflow)

---

## 🏗️ **REACT COMPONENT ARCHITECTURE**

### **Component Hierarchy:**
```
src/components/assessment/
├── NASMAssessmentDashboard.jsx          # Main container
├── assessments/
│   ├── OverheadSquatAssessment.jsx      # OHS protocol
│   ├── SingleLegSquatAssessment.jsx     # Single-leg protocol
│   ├── PushPullAssessment.jsx           # Combined push/pull
│   └── AssessmentInstructions.jsx       # NASM protocol guidance
├── results/
│   ├── AssessmentResults.jsx            # Results summary
│   ├── CompensationAnalysis.jsx         # Muscle imbalance analysis
│   └── CorrectiveRecommendations.jsx    # Exercise suggestions
└── shared/
    ├── CheckpointCheckbox.jsx           # Reusable checkpoint UI
    ├── MuscleLookup.js                  # NASM table integration
    └── AssessmentProgress.jsx           # Progress tracking
```

---

## 📊 **DATABASE SCHEMA IMPLEMENTATION**

### **MongoDB Schema (Complete):**
```javascript
// src/models/NASMAssessment.js
const nasmAssessmentSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  assessmentDate: { 
    type: Date, 
    default: Date.now 
  },
  trainer: { 
    type: String, 
    required: true 
  },
  
  // NASM Overhead Squat Assessment (Table 6-12)
  overheadSquat: {
    frontView: {
      feet: {
        feetTurnOut: { type: Boolean, default: false },
        notes: String
      },
      knees: {
        kneesMoveinward: { type: Boolean, default: false },
        notes: String
      }
    },
    sideView: {
      lphc: {
        excessiveForwardLean: { type: Boolean, default: false },
        lowBackArches: { type: Boolean, default: false },
        notes: String
      },
      upperBody: {
        armsFallForward: { type: Boolean, default: false },
        notes: String
      }
    },
    totalCompensations: { type: Number, default: 0 },
    overactiveMusces: [String],
    underactiveMusces: [String]
  },

  // NASM Single-Leg Squat Assessment (Table 6-13)
  singleLegSquat: {
    rightLeg: {
      kneeValgus: { type: Boolean, default: false },
      notes: String
    },
    leftLeg: {
      kneeValgus: { type: Boolean, default: false },
      notes: String
    }
  },

  // NASM Pushing Assessment (Table 6-14)
  pushingAssessment: {
    lphc: {
      lowBackArches: { type: Boolean, default: false },
      notes: String
    },
    shoulders: {
      shoulderElevation: { type: Boolean, default: false },
      notes: String
    },
    head: {
      headMigratesForward: { type: Boolean, default: false },
      notes: String
    }
  },

  // NASM Pulling Assessment (Table 6-15)
  pullingAssessment: {
    lphc: {
      lowBackArches: { type: Boolean, default: false },
      notes: String
    },
    shoulders: {
      shoulderElevation: { type: Boolean, default: false },
      notes: String
    },
    head: {
      headProtrudesForward: { type: Boolean, default: false },
      notes: String
    }
  },

  // Assessment Summary
  assessmentSummary: {
    totalCompensations: { type: Number, default: 0 },
    primaryDysfunctions: [String],
    priorityCorrections: [String],
    reassessmentDate: Date,
    trainerNotes: String,
    riskLevel: { 
      type: String, 
      enum: ['Low', 'Moderate', 'High'], 
      default: 'Low' 
    }
  }
});

module.exports = mongoose.model('NASMAssessment', nasmAssessmentSchema);
```

---

## 🎯 **NASM REFERENCE TABLES INTEGRATION**

### **Muscle Lookup Service:**
```javascript
// src/services/nasmMuscleLookup.js
// NASM Table 6-12: Overhead Squat Assessment
const overheadSquatCompensations = {
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
const singleLegSquatCompensations = {
  kneeValgus: {
    overactive: ["Adductor complex", "Biceps femoris (short)", "TFL", "Vastus lateralis"],
    underactive: ["Gluteus medius/maximus", "VMO"]
  }
};

// NASM Table 6-14: Pushing Assessment
const pushingCompensations = {
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
const pullingCompensations = {
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

// Analysis Functions
export const analyzeOverheadSquat = (assessmentData) => {
  let overactive = [];
  let underactive = [];
  let compensations = 0;

  // Analyze each checkpoint
  if (assessmentData.frontView.feet.feetTurnOut) {
    overactive.push(...overheadSquatCompensations.feetTurnOut.overactive);
    underactive.push(...overheadSquatCompensations.feetTurnOut.underactive);
    compensations++;
  }

  if (assessmentData.frontView.knees.kneesMoveinward) {
    overactive.push(...overheadSquatCompensations.kneesMoveinward.overactive);
    underactive.push(...overheadSquatCompensations.kneesMoveinward.underactive);
    compensations++;
  }

  // Continue for all checkpoints...

  return {
    totalCompensations: compensations,
    overactiveMusces: [...new Set(overactive)], // Remove duplicates
    underactiveMusces: [...new Set(underactive)],
    riskLevel: compensations === 0 ? 'Low' : compensations <= 2 ? 'Moderate' : 'High'
  };
};

// Similar functions for other assessments...
export { analyzeOverheadSquat, analyzeSingleLegSquat, analyzePushing, analyzePulling };
```

---

## 🎨 **USER INTERFACE DESIGN**

### **Assessment Dashboard Component:**
```javascript
// src/components/assessment/NASMAssessmentDashboard.jsx
import React, { useState, useContext } from 'react';
import { ClientContext } from '../../context/ClientContext';
import OverheadSquatAssessment from './assessments/OverheadSquatAssessment';
import SingleLegSquatAssessment from './assessments/SingleLegSquatAssessment';
import PushPullAssessment from './assessments/PushPullAssessment';
import AssessmentResults from './results/AssessmentResults';

const NASMAssessmentDashboard = () => {
  const { currentClient } = useContext(ClientContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    overheadSquat: {},
    singleLegSquat: {},
    pushing: {},
    pulling: {}
  });

  const assessmentSteps = [
    { id: 1, name: 'Overhead Squat', component: OverheadSquatAssessment },
    { id: 2, name: 'Single-Leg Squat', component: SingleLegSquatAssessment },
    { id: 3, name: 'Push/Pull', component: PushPullAssessment },
    { id: 4, name: 'Results', component: AssessmentResults }
  ];

  const handleStepComplete = (stepData) => {
    setAssessmentData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="nasm-assessment-dashboard">
      <div className="assessment-header">
        <h2>NASM Movement Assessment - {currentClient?.name}</h2>
        <div className="progress-indicator">
          Step {currentStep} of {assessmentSteps.length}
        </div>
      </div>

      <div className="assessment-content">
        {assessmentSteps.map(step => (
          step.id === currentStep && (
            <step.component
              key={step.id}
              onComplete={handleStepComplete}
              data={assessmentData}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default NASMAssessmentDashboard;
```

---

## 🔧 **INTEGRATION WITH POWERHOUSE WORKFLOW**

### **Enhanced Injury Screening Integration:**
```javascript
// src/components/workflow/InjuryScreeningStep.jsx
import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import NASMAssessmentDashboard from '../assessment/NASMAssessmentDashboard';

const InjuryScreeningStep = () => {
  const { workflowData, updateWorkflowData, nextStep } = useWorkflow();
  const [showNASMAssessment, setShowNASMAssessment] = useState(false);

  const handleNASMAssessmentComplete = (assessmentResults) => {
    updateWorkflowData({
      injuryScreening: {
        ...workflowData.injuryScreening,
        nasmAssessment: assessmentResults,
        riskLevel: assessmentResults.riskLevel,
        requiresCorrectivePhase: assessmentResults.totalCompensations > 2
      }
    });
    setShowNASMAssessment(false);
  };

  const proceedToNextStep = () => {
    // Factor NASM results into training system selection
    if (workflowData.injuryScreening.nasmAssessment?.requiresCorrectivePhase) {
      updateWorkflowData({
        recommendedSystem: 'corrective-phase',
        systemModifications: workflowData.injuryScreening.nasmAssessment.priorityCorrections
      });
    }
    nextStep();
  };

  return (
    <div className="injury-screening-step">
      <h3>Injury Screening & Movement Assessment</h3>
      
      {/* Existing injury screening questions */}
      {/* ... */}

      {/* NASM Movement Assessment Integration */}
      <div className="nasm-assessment-section">
        <h4>Movement Quality Assessment</h4>
        <p>Enhance injury screening with NASM movement assessment protocols</p>
        
        {!showNASMAssessment ? (
          <button 
            onClick={() => setShowNASMAssessment(true)}
            className="btn-primary"
          >
            Start NASM Movement Assessment
          </button>
        ) : (
          <NASMAssessmentDashboard 
            onComplete={handleNASMAssessmentComplete}
          />
        )}

        {workflowData.injuryScreening.nasmAssessment && (
          <div className="assessment-summary">
            <h5>Assessment Results:</h5>
            <p>Risk Level: {workflowData.injuryScreening.nasmAssessment.riskLevel}</p>
            <p>Total Compensations: {workflowData.injuryScreening.nasmAssessment.totalCompensations}</p>
          </div>
        )}
      </div>

      <button onClick={proceedToNextStep} className="btn-next">
        Continue to Training System Selection
      </button>
    </div>
  );
};

export default InjuryScreeningStep;
```

---

## 🚀 **IMPLEMENTATION SEQUENCE**

### **Day 1: Core Assessment Interface**
1. **Setup Project Structure**
   ```bash
   # Create component folders
   mkdir -p src/components/assessment/{assessments,results,shared}
   mkdir -p src/services
   mkdir -p src/models
   ```

2. **Implement Database Schema**
   - Create `NASMAssessment.js` model
   - Add to existing MongoDB setup

3. **Build Overhead Squat Component**
   - Create `OverheadSquatAssessment.jsx`
   - Implement NASM Table 6-12 integration
   - Add checkbox interface for compensations

### **Day 2: Complete Assessment Battery**
1. **Implement Remaining Assessments**
   - `SingleLegSquatAssessment.jsx`
   - `PushPullAssessment.jsx`

2. **Build Results Analysis**
   - `AssessmentResults.jsx`
   - `CompensationAnalysis.jsx`
   - Muscle lookup service integration

3. **Integrate with PowerHouse Workflow**
   - Enhance `InjuryScreeningStep.jsx`
   - Add NASM results to workflow context

### **Day 3: Testing & Refinement**
1. **Testing**
   - Unit tests for muscle lookup functions
   - Integration tests with workflow
   - Manual testing with NASM protocols

2. **Documentation**
   - User guide updates
   - Technical documentation
   - Trainer workflow instructions

---

## 💡 **VS CODE COPILOT OPTIMIZATION**

### **Context Files to Keep Open:**
1. `Ch6_complete_assessment_protocols.md` - NASM protocols
2. `Ch6_reference_tables_complete.md` - Muscle analysis tables
3. `InjuryScreeningStep.jsx` - Integration target
4. `ClientContext.js` - Data structure context

### **Copilot Prompt Examples:**
```javascript
// NASM Overhead Squat Assessment Component
// Implement checkboxes for each compensation pattern from NASM Table 6-12
// Include automatic muscle analysis when compensations are selected
// Follow NASM protocol: 5 reps from front and side view
// Integrate with PowerHouse workflow data structure

// NASM Single-Leg Squat Component  
// Implement bilateral assessment with knee valgus detection
// Use NASM Table 6-13 for muscle imbalance analysis
// Support population modifications (elderly = balance test instead)
```

---

**🎯 Ready to implement! This plan provides everything needed to build the NASM assessment system with VS Code Copilot assistance.**
