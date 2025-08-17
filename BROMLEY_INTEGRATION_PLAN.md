# 🏗️ Bromley Base Strength Integration Plan

## 📋 **Bromley Framework → PowerHouse System Integration**

### **Core Bromley Concepts Added to Our System**

#### **1. SRN Framework Integration** 🔄
**Location**: `js/utils/goalBasedSelector.js` and `js/algorithms/`

```javascript
// Enhanced goal-system compatibility with SRN principles
const SRN_COMPATIBILITY = {
  Specificity: {
    strength: ['5/3/1', 'conjugate', 'linear'],
    hypertrophy: ['RP', 'bodybuilding', 'high-volume'],
    powerlifting: ['5/3/1', 'conjugate', 'bulgarian'],
    motor_control: ['linear', 'functional'],
    weight_loss: ['RP', 'circuit', 'hybrid']
  },
  Recovery: {
    novice: 'high_frequency_waves',    // 3x/week with wave deloads
    intermediate: 'weekly_waves',      // Weekly undulation
    advanced: 'block_waves'           // 3-6 week blocks
  },
  Novelty: {
    base_phase: 'exercise_variation',  // Non-specific exercises
    peak_phase: 'specificity_focus',  // Competition movements
    plateau: 'SRN_reset'              // Change all three variables
  }
}
```

#### **2. Base/Peak Phase Programming** 📈
**Location**: `js/algorithms/bromleyProgression.js` (NEW FILE)

```javascript
const BROMLEY_PHASES = {
  BASE_PHASE: {
    duration: '6-12 weeks',
    intensity: '55-80%',
    volume: 'high',
    exercises: 'non-specific_variations',
    rep_ranges: '8-12',
    sets: '3-5',
    progression: 'volumizing_waves',
    goal: 'mass_endurance_base'
  },
  PEAK_PHASE: {
    duration: '3-6 weeks', 
    intensity: '80-100%',
    volume: 'low',
    exercises: 'competition_specific',
    rep_ranges: '1-6',
    sets: '3-5',
    progression: 'intensifying_waves',
    goal: 'strength_neural_peak'
  }
}
```

#### **3. Wave Progression Algorithms** 🌊
**Location**: `js/algorithms/waveProgression.js` (NEW FILE)

```javascript
// Bromley Wave Progressions
class BromleyWaves {
  volumizingWave(startingSets, startingReps, startingPercent) {
    return [
      { week: 1, sets: startingSets, reps: startingReps, percent: startingPercent },
      { week: 2, sets: startingSets + 1, reps: startingReps - 2, percent: startingPercent + 2.5 },
      { week: 3, sets: startingSets + 2, reps: startingReps - 4, percent: startingPercent + 5 }
    ];
  }
  
  intensifyingWave(startingSets, startingReps, startingPercent) {
    return [
      { week: 1, sets: startingSets, reps: startingReps, percent: startingPercent },
      { week: 2, sets: startingSets, reps: startingReps - 1, percent: startingPercent + 5 },
      { week: 3, sets: startingSets, reps: startingReps - 2, percent: startingPercent + 10 }
    ];
  }
}
```

## 🎯 **Integration Points with Current System**

### **Phase 1: Enhance RP System with Bromley Concepts** ⚠️ **HIGH PRIORITY**

#### **RP Hypertrophy Customization** (Using Bromley Base Phase)
```javascript
// js/algorithms/volume.js ENHANCEMENT
const RP_HYPERTROPHY_BROMLEY = {
  phase_structure: 'base_focused',
  intensity_range: '65-75%',  // Bromley hypertrophy zone
  volume_progression: 'volumizing_waves',
  rep_ranges: '8-12',         // Bromley base phase
  exercise_selection: 'non_specific_variations',
  deload_frequency: 'every_3_weeks',  // Bromley wave structure
  progression_type: 'volume_first'
}
```

#### **RP Weight Loss Customization** (Using Bromley High-Frequency)
```javascript
const RP_WEIGHT_LOSS_BROMLEY = {
  phase_structure: 'base_with_metabolic_focus',
  intensity_range: '60-70%',  // Lower for higher frequency
  volume_progression: 'high_frequency_waves',
  rep_ranges: '10-15',        // Higher reps for metabolic stress
  frequency: '4-6x_per_week', // Bromley high-frequency approach
  circuit_integration: true,  // Density work
  deload_frequency: 'every_2_weeks'  // More recovery needed
}
```

### **Phase 2: Implement Linear Periodization with Bromley Waves** ❌ **MEDIUM PRIORITY**

#### **Motor Control Focus** (Using Bromley Progression)
```javascript
// js/algorithms/linearPeriodization.js (NEW)
const LINEAR_MOTOR_CONTROL = {
  progression_model: 'bromley_waves',
  phase_1: {
    name: 'movement_base',
    duration: '6_weeks',
    intensity: '55-65%',
    focus: 'coordination_endurance',
    wave_type: 'volumizing'
  },
  phase_2: {
    name: 'movement_strength',
    duration: '4_weeks', 
    intensity: '70-85%',
    focus: 'loaded_movement_quality',
    wave_type: 'intensifying'
  }
}
```

### **Phase 3: Assessment Enhancement** 📋

#### **Bromley-Based Readiness Assessment**
```javascript
// Integration with 12-step system
const BROMLEY_ASSESSMENTS = {
  baseline_testing: {
    method: 'AMRAP_at_65_75_percent',
    calculation: 'weight_x_coefficient',
    coefficients: {
      '10RM': 1.33,
      '8RM': 1.28,
      '6RM': 1.20
    }
  },
  readiness_monitoring: {
    RPE_range: '6-9',
    fatigue_indicators: ['stalled_waves', 'joint_strain', 'reduced_AMRAP'],
    recovery_markers: ['DOMS_status', 'wave_performance', 'SRA_position']
  }
}
```

## 📊 **Bromley Volume/Intensity Integration**

### **Volume Calculations** (Direct integration with `volume.js`)
```javascript
// Enhanced volume.js with Bromley tonnage calculations
function calculateBromleyTonnage(sets, reps, weight) {
  return sets * reps * weight;
}

function progressiveWaveTonnage(baseWeight, waveWeek) {
  const waveProgressions = {
    1: { sets: 3, reps: 12, percent: 65 },
    2: { sets: 4, reps: 10, percent: 67.5 },
    3: { sets: 5, reps: 8, percent: 70 }
  };
  
  const progression = waveProgressions[waveWeek];
  const weight = baseWeight * (progression.percent / 100);
  return calculateBromleyTonnage(progression.sets, progression.reps, weight);
}
```

### **Intensity Zones** (Maps to existing algorithms)
- **Base Phase**: 55-80% (Maps to RP MEV-MAV range)
- **Peak Phase**: 80-100% (Maps to 5/3/1 intensity work)
- **Wave Progression**: Auto-regulation via RPE 6-9

## 🚀 **Implementation Plan**

### **Immediate Actions (This Session)**
1. **Create Bromley Integration Files**:
   - `js/algorithms/bromleyProgression.js`
   - `js/algorithms/waveProgression.js` 
   - `js/algorithms/linearPeriodization.js`

2. **Enhance Goal Selector**:
   - Add SRN compatibility mapping
   - Integrate Base/Peak phase selection

3. **Update Volume.js**:
   - Add Bromley tonnage calculations
   - Integrate wave progression algorithms

### **Next Session Priority**
1. **RP System Enhancement**:
   - Customize for hypertrophy using Bromley base phase concepts
   - Customize for weight loss using high-frequency waves

2. **12-Step Integration**:
   - Add Bromley assessment methods to Steps 1-9
   - Integrate wave periodization into Steps 6-8

## 🎯 **Benefits of Bromley Integration**

### **Solves Current Gaps** ✅
- **RP Customization**: Base/Peak phases give clear hypertrophy vs strength protocols
- **Linear Periodization**: Wave progression provides sophisticated linear model
- **Assessment Methods**: AMRAP testing and RPE monitoring enhance current system
- **Volume Progression**: Clear volumizing/intensifying algorithms

### **Enhances Existing Systems** ⭐
- **5/3/1**: Add wave periodization for plateau breaking
- **Goal Selector**: SRN framework improves system recommendations
- **12-Step Workflow**: Bromley assessments enhance evaluation phases

This integration gives us **evidence-based progression models** that perfectly support our goal-first approach! 🏆
