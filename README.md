# PowerHouse Tracker - Renaissance Periodization Toolkit v0.9.0-beta

A comprehensive evidence-based training toolkit implementing Renaissance Periodization methodology with **automated volume progression**, **intelligent deload analysis**, and **data management**.

## 🎯 Latest Features (v0.9.0-beta)

### ✅ **Complete Handler Coverage (0 Missing)**
All 35 button handlers are now implemented across 7 training phases:
- ✅ **Phase 1:** Foundation Setup (4 handlers)
- ✅ **Phase 2:** Mesocycle Planning (6 handlers) 
- ✅ **Phase 3:** Weekly Programming (3 handlers)
- ✅ **Phase 4:** Daily Execution (5 handlers)
- ✅ **Phase 5:** Deload Analysis (2 handlers)
- ✅ **Phase 6:** Advanced Intelligence (3 handlers)
- ✅ **Phase 7:** Data Management (6 handlers)

### 🧠 **Intelligence Layer (Phase 6)**
- **`initIntelligence()`** - Initializes adaptive learning system
- **`optimizeVolumeLandmarks()`** - ML-based landmark optimization
- **`adaptiveRIRRecommendations()`** - Context-aware RIR suggestions

### 💾 **Data Management (Phase 7)**
- **`exportAllData()`** - Complete training data export (JSON)
- **`exportChart()`** - Progress visualization export (SVG/PNG)
- **`createBackup()`** - Compressed backup with integrity checks
- **`autoBackup()`** - Automatic scheduled backups
- **`importData()`** - Smart data import with validation
- **`exportFeedback()`** - Session feedback analysis (CSV)

### 🔬 **Deload Analysis (Phase 5)**
- **`analyzeDeloadNeed()`** - Fatigue assessment with confidence scoring
- **`initializeAtMEV()`** - Smart volume reset to MEV levels

## 🚀 Quick Start

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run handler audit
npm run audit

# Full CI pipeline
npm run ci
```

### React/Vite Frontend
```bash
cd tracker-ui
npm install
npm run dev  # Runs on http://localhost:5173
```

## 🎯 Core Features

### 🤖 **Auto-Volume Progression System**
- **🎯 MEV Start:** All muscles begin at Minimum Effective Volume
- **📈 Smart Progression:** +1-2 sets per week based on recovery feedback
- **🛑 Auto-Deload:** Triggers when most muscles hit MRV
- **🧠 Adaptive Logic:** Volume-dependent feedback simulation

### ✅ **Complete Renaissance Periodization Implementation**

1. **📁 Modular Architecture**
   - `/js/core/trainingState.js` - Central training state singleton
   - `/js/algorithms/volume.js` - RP volume management algorithms
   - `/js/algorithms/effort.js` - RIR progression and effort management
   - `/js/algorithms/fatigue.js` - Recovery and frequency optimization
   - `/js/algorithms/deload.js` - Deload analysis and MEV reset
   - `/js/algorithms/intelligence.js` - Adaptive learning algorithms
   - `/js/algorithms/dataExport.js` - Data management and export
   - `/js/ui/` - Modular UI components

2. **🔢 RP "MEV Stimulus Estimator" (Table 2.2)**
   - `scoreStimulus({mmc, pump, disruption})` → 0-9 score
   - Automatic advice: 0-3 = "Add 2 sets", 4-6 = "Keep sets", 7-9 = "Remove sets"

3. **📈 RP "Set Progression Algorithm" (Table 2.3)**
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

| MMC + Pump + Disruption | Score        | Action          |
| ----------------------- | ------------ | --------------- |
| 0-3                     | Low stimulus | Add 2 sets      |
| 4-6                     | Adequate     | Maintain        |
| 7-9                     | Excessive    | Remove 1-2 sets |

### RP Table 2.3: Set Progression Matrix

| Soreness     | Performance | Action           |
| ------------ | ----------- | ---------------- |
| 0 (None)     | 2+ (Better) | Add 2-3 sets     |
| 1 (Mild)     | 1 (Same)    | Add 1 set        |
| 2 (Moderate) | 0-1         | Hold/Recovery    |
| 3 (High)     | Any         | Recovery session |

### RIR Progression Formula

```javascript
targetRIR = 4.5 - (4.0 / (mesoLength - 1)) * (week - 1);
// Week 1: ~4.5 RIR, Final week: ~0.5 RIR
```

## 🚀 Getting Started

1. **Install dependencies**
   ```
   npm install
   ```
2. **Create a `.env` file** from `.env.example` and add your Supabase credentials.
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx
   # Optional: customize the PORT the server listens on
   PORT=3000
   ```
3. **Build the project** so Parcel injects your credentials.
   ```
   npm run build
   ```
4. **Start the local server**
   ```
   node server.cjs
   ```
5. **Set Volume Landmarks**: Configure MV/MEV/MAV/MRV for each muscle
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

## Troubleshooting

- **Build fails**: Ensure `.env` variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
- **Charts not loading**: Verify the Chart.js bundle exists inside the `dist/` folder after running `npm run build`.
- **Tests failing**: Run `npm test -- --verbose` to see detailed errors.

## 🛠 Development Workflow

### Button Handler Management

**Architecture:** Button handlers are defined in `js/ui/buttonHandlers.js` and exposed globally for both ES6 imports and legacy inline `onclick` handlers.

**Key Files:**
- `js/ui/buttonHandlers.js` - New handler implementations
- `js/ui/globals.js` - Legacy handler mappings and imports
- `js/ui/additionalHandlers.js` - Additional system handlers
- `main.js` - Entry point with side-effect imports

**Audit System:**
```bash
npm run audit  # Runs full button/handler audit pipeline
```

**Handler Requirements:**
1. Must be exposed on `window` object as `window.btnButtonId`
2. Function source must not contain "TODO" or "stub" text
3. Must have descriptive function name for debugging

**Troubleshooting Missing Handlers:**
1. Ensure function is exported from `buttonHandlers.js`
2. Add to imports in `globals.js` 
3. Verify no conflicting stubs in `additionalHandlers.js`
4. Run `node scripts/debug-handlers.js` to inspect browser state
5. Check order of imports in `main.js` (buttonHandlers should load early)

### Testing

```bash
npm test                    # Run all Jest tests
npm test handlers.test.js   # Test button handler exposure
```
