# PowerHouseATX Renaissance Periodization Toolkit

A comprehensive evidence-based training calculator implementing Renaissance Periodization methodology with **automated volume progression**.

## 🤖 Auto-Volume Progression System

**🎉 NEW: Fully automated weekly volume progression** - No more manual "+ set" buttons!

- **🎯 MEV Start:** All muscles begin at Minimum Effective Volume
- **📈 Smart Progression:** +1-2 sets per week based on recovery feedback
- **🛑 Auto-Deload:** Triggers when most muscles hit MRV
- **🧠 Adaptive Logic:** Volume-dependent feedback simulation

### Quick Demo
1. Click **"🎯 Initialize at MEV"** → Sets all muscles to starting volumes
2. Click **"▶️ Run Weekly Auto-Progression"** → Simulates weekly progression
3. Click **"📅 Next Week"** → Advances training cycle
4. System auto-triggers deload when needed

## 🎯 Features Implemented

### ✅ Complete Renaissance Periodization Implementation

1. **🤖 Auto-Volume Progression System**
   - `autoSetIncrement()` - Determines weekly set increases (+0, +1, +2)
   - `processWeeklyVolumeProgression()` - Batch processes all muscles
   - Automatic deload triggering based on MRV accumulation
   - Volume-adaptive feedback generation for realistic progression

2. **📁 Refactored Structure**
   - `/js/core/trainingState.js` - Central training state singleton
   - `/js/algorithms/volume.js` - RP volume management algorithms
   - `/js/algorithms/effort.js` - RIR progression and effort management
   - `/js/algorithms/fatigue.js` - Recovery and frequency optimization
   - `/js/algorithms/validation.js` - Load and input validation helpers
   - `/js/ui/` - Modular UI components

3. **🔢 RP "MEV Stimulus Estimator" (Table 2.2)**
   - `scoreStimulus({mmc, pump, disruption})` → 0-9 score
   - Automatic advice: 0-3 = "Add 2 sets", 4-6 = "Keep sets", 7-9 = "Remove sets"

4. **📈 RP "Set Progression Algorithm" (Table 2.3)**
   - Matrix lookup: [soreness 0-3] × [performance 0-3]
   - Replaces legacy `calcSets()` with evidence-based recommendations

5. **📊 Volume Landmarks System**
   - User-editable MV, MEV, MAV, MRV for all 12 muscle groups
   - Chart color coding: green (optimal), amber (high), red (maximum)
   - Sets seeded at MEV instead of arbitrary defaults
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
2. **Create a `.env` file** based on `.env.example` and add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Run `npm run build`** so Parcel injects your Supabase credentials into the bundle.
4. **Set Volume Landmarks**: Configure MV/MEV/MAV/MRV for each muscle
5. **Daily Use**: Submit set feedback after each exercise
6. **Weekly Review**: Check deload need and frequency optimization
7. **Export Data**: Generate summaries for tracking progress

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
