# PowerHouseATX Renaissance Periodization Toolkit

A comprehensive evidence-based training calculator implementing Renaissance Periodization methodology for optimal muscle building.

## 🎯 Features Implemented

### ✅ Complete Task List Implementation

1. **📁 Refactored Structure**
   - `/js/core/trainingState.js` - Central training state singleton
   - `/js/algorithms/volume.js` - RP volume management algorithms
   - `/js/algorithms/effort.js` - RIR progression and effort management
   - `/js/algorithms/fatigue.js` - Recovery and frequency optimization
   - `/js/algorithms/validation.js` - Load and input validation helpers
   - `/js/ui/` - Modular UI components

2. **🔢 RP "MEV Stimulus Estimator" (Table 2.2)**
   - `scoreStimulus({mmc, pump, disruption})` → 0-9 score
   - Automatic advice: 0-3 = "Add 2 sets", 4-6 = "Keep sets", 7-9 = "Remove sets"

3. **📈 RP "Set Progression Algorithm" (Table 2.3)**
   - Matrix lookup: [soreness 0-3] × [performance 0-3]
   - Replaces legacy `calcSets()` with evidence-based recommendations

4. **📊 Volume Landmarks System**
   - User-editable MV, MEV, MAV, MRV for all 12 muscle groups
   - Chart color coding: green (optimal), amber (high), red (maximum)
   - Sets seeded at MEV instead of arbitrary defaults

5. **🏋️‍♂️ Progressive Overload Engine**
   - Dynamic RIR targets: 4.5 → 0.5 over mesocycle
   - Real-time effort validation with ±1 RIR tolerance warnings
   - Autoregulation feedback system

6. **🛑 Deload & Resensitization**
   - Auto-deload triggers: end of meso OR 2 consecutive MRV weeks
   - Automatic 50% volume + load reduction protocols
   - Resensitization phases every 3-6 blocks

7. **💡 UI Improvements**
   - Inline editing for current sets (no override button)
   - `<output>` elements for all results
   - Real-time RIR validation with color coding

8. **📜 Validation Helpers**
   - `validateLoad(%)` - enforces 30-85% windows for hypertrophy
   - `validateSets()` - blocks entry outside MEV-MRV ranges
   - Comprehensive input validation system

9. **🗓 State Persistence**
   - Complete training state serialization to localStorage
   - Legacy data migration from old format
   - Week-based state management

## 🧬 Renaissance Periodization Implementation

### Volume Landmarks (Default Values)
```javascript
'Chest': { MV: 4, MEV: 8, MAV: 16, MRV: 22 }
'Back': { MV: 6, MEV: 10, MAV: 20, MRV: 25 }
'Quads': { MV: 6, MEV: 10, MAV: 20, MRV: 25 }
// ... all 12 muscle groups
```

### RP Table 2.2: Stimulus Quality Matrix
| MMC + Pump + Disruption | Score | Action |
|-------------------------|-------|---------|
| 0-3 | Low stimulus | Add 2 sets |
| 4-6 | Adequate | Maintain |
| 7-9 | Excessive | Remove 1-2 sets |

### RP Table 2.3: Set Progression Matrix
| Soreness | Performance | Action |
|----------|-------------|---------|
| 0 (None) | 2+ (Better) | Add 2-3 sets |
| 1 (Mild) | 1 (Same) | Add 1 set |
| 2 (Moderate) | 0-1 | Hold/Recovery |
| 3 (High) | Any | Recovery session |

### RIR Progression Formula
```javascript
targetRIR = 4.5 - ((4.0) / (mesoLength - 1)) * (week - 1)
// Week 1: ~4.5 RIR, Final week: ~0.5 RIR
```

## 🚀 Getting Started

1. **Open `index.html`** in a modern browser
2. **Set Volume Landmarks**: Configure MV/MEV/MAV/MRV for each muscle
3. **Daily Use**: Submit set feedback after each exercise
4. **Weekly Review**: Check deload need and frequency optimization
5. **Export Data**: Generate summaries for tracking progress

## 📱 User Interface

### Daily Training Section
- **Set Feedback**: RP algorithm-powered recommendations
- **Real-time RIR validation**: Color-coded effort tracking
- **Autoregulation**: Mid-workout adjustments

### Weekly Planning Section
- **Deload Analysis**: Multi-factor fatigue assessment
- **Frequency Optimization**: Recovery-based session timing

### Program Setup Section
- **Volume Landmarks**: Muscle-specific range configuration
- **Mesocycle Setup**: Block periodization management

## 🎨 Visual Features

- **Color-coded volume zones**: Instant status recognition
- **Interactive charts**: Click to edit, visual landmarks
- **Real-time validation**: Immediate feedback on inputs
- **Responsive design**: Works on all devices

## 🔧 Technical Architecture

### Core Modules
- **TrainingState**: Singleton pattern for state management
- **Volume Algorithms**: RP methodology implementations
- **Effort Management**: RIR progression and validation
- **Fatigue Analysis**: Recovery and frequency optimization

### Data Flow
1. User input → RP algorithms → State updates → UI refresh
2. All changes auto-saved to localStorage
3. Legacy data automatically migrated

## 📊 Export & Tracking

- **Weekly Summaries**: Printable progress reports
- **Chart Export**: Visual progress tracking
- **Data Persistence**: Never lose your training data

## 🔬 Evidence-Based Approach

This implementation follows the Renaissance Periodization methodology as outlined in:
- "The Renaissance Diet 2.0" 
- "Renaissance Periodization" training principles
- Dr. Mike Israetel's volume landmarks research

## 🎓 Training Phases

- **Accumulation**: Weeks 1-2, moderate intensity
- **Progression**: Weeks 2-4, increasing demands  
- **Intensification**: Weeks 4-5, high stress
- **Peak**: Final week, maximum effort
- **Deload**: Recovery and resensitization

---

**Built for PowerHouseATX** - Evidence-based muscle building through Renaissance Periodization methodology.
