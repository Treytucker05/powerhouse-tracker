# PowerHouse Tracker - Renaissance Periodization Toolkit v0.9.0-beta.4

![Vitest](https://img.shields.io/badge/tests-passing-brightgreen)

A comprehensive evidence-based training toolkit implementing Renaissance Periodization methodology with **automated volume progression**, **intelligent- **Build fails**: Ensure `.env` variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
- **Charts not loading**: Verify the Chart.js bundle exists inside the `dist/` folder after running `pnpm run build`.
- **Tests failing**: Run `pnpm test -- --verbose` to see detailed errors.load analysis**, and **data management**.

## 🎯 Latest Features (v0.9.0-beta.4)

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

### Prerequisites
This project uses **npm** as the package manager. 

### Installation & Development
```bash
# Clone the repository
git clone <repository-url>
cd tracker-ui-good

# Navigate to the React app
cd tracker-ui

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

### Troubleshooting npm
- **Permission errors**: Try clearing npm cache: `npm cache clean --force` 
- **Dependency conflicts**: Use `npm install --legacy-peer-deps`

# Install React app dependencies
npm install --legacy-peer-deps

# Start development server (opens on http://localhost:5174)
npm run dev
```

### Development Commands
```bash
# Available in tracker-ui/ directory

# Run tests only  
npm run test

# Run tests with coverage
npm test -- --coverage

# Build for production
pnpm run build

# Lint check (fails on warnings)
pnpm run lint:ci

# Run E2E tests
pnpm run test:e2e

# Start dev server
pnpm run dev

# Preview production build
pnpm run preview
```

### Package Manager Notes
- **pnpm workspaces** are configured for monorepo structure
- Use `pnpm install --frozen-lockfile` for deterministic installs
- The project is locked to `pnpm@9.15.0` via `packageManager` field
- CI/CD uses Corepack for consistent pnpm setup

## 🟢 Node.js Usage

### Auto-Bootstrap (Recommended)
```js
// Automatically sets up browser globals for Node.js
import { initIntelligence, calculateDeload } from 'powerhouse-rp-toolkit';

// Use toolkit functions normally
const result = await initIntelligence();
```

### Manual Bootstrap (CI, REPL, etc.)
```js
// Manual environment setup for special cases
import 'powerhouse-rp-toolkit/node-bootstrap';
const { calculateDeload, exportAllData } = await import('powerhouse-rp-toolkit');

// Toolkit is now ready to use in Node.js
const deloadAnalysis = calculateDeload(trainingData);
```

### Development Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test

# Run handler audit
pnpm run audit

# Full CI pipeline
pnpm run ci
```

### React/Vite Frontend
```bash
cd tracker-ui
pnpm install
pnpm run dev  # Runs on http://localhost:5173
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
   pnpm install
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

## 🔧 Troubleshooting

### pnpm Issues

#### pnpm command not found
```bash
# Solution: Install and enable via Corepack
npm install --global corepack@latest
corepack enable pnpm
corepack prepare pnpm@latest-10 --activate

# Verify installation
pnpm --version
```

#### Permission/Access Issues
```bash
# Windows: Run as Administrator
# macOS/Linux: Use proper Node.js permissions
sudo corepack enable pnpm

# Alternative: Use Node Version Manager (nvm)
nvm use 20
corepack enable pnpm
```

#### Cache/Install Issues
```bash
# Clear pnpm cache
pnpm store prune

# Force clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install --frozen-lockfile

# Check pnpm store path
pnpm store path
```

### Development Issues

#### Build Fails
- **Environment Variables**: Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Dependencies**: Run `pnpm install --frozen-lockfile` to sync dependencies
- **Node Version**: Use Node.js 20+ (`node --version`)

#### Charts Not Loading
- **Build Step**: Run `pnpm run build` to generate Chart.js bundle
- **Import Path**: Verify chart components import from correct paths
- **Browser Console**: Check for JavaScript errors in DevTools

#### Tests Failing
```bash
# Run with verbose output
pnpm test -- --verbose

# Run specific test file
pnpm test -- MacrocycleBuilder.test.jsx

# Check test coverage
pnpm run test:unit --coverage
```

#### TypeScript Errors
```bash
# Check TypeScript compilation
pnpm run build

# Lint TypeScript files
pnpm run lint

# Fix auto-fixable issues
pnpm run lint --fix
```

### CI/CD Issues

#### GitHub Actions Failing
- **Workflow**: Uses Corepack setup for consistent pnpm version
- **Cache**: pnpm store is cached using `pnpm-lock.yaml` hash
- **Node Version**: Locked to Node.js 20 in workflow

#### Package Manager Conflicts
- **Only use pnpm**: Don't mix with npm or yarn
- **Lock File**: Always commit `pnpm-lock.yaml`
- **Version**: Project uses `pnpm@9.15.0` (see `packageManager` in package.json)

---

## 🚀 Quick Start

```bash
pnpm install           # install dependencies
pnpm dev               # launch Vite dev server on http://localhost:5173
bash scripts/repo-audit.sh   # one-shot repo audit
npm run analyze        # update REPO_ANALYSIS_REPORT.json
npm run gameplan       # (re)generate GAMEPLAN.md timeline
pnpm test              # Vitest unit tests
pnpm test:e2e          # Playwright smoke tests
```

## 🗺️ High-Level App Architecture

```
/
├─ 🏠  Dashboard
├─ 🎯  /assessment         → Initial Assessment wizard
└─ 📅  /design
     ├─ macrocycle        → 5-step macro wizard
     ├─ mesocycle         → volume-ramp builder (MVP)
     └─ microcycle        → _coming soon_
/tracking                → Live workout logger & autoreg
/analytics               → Progress + AI insights
```

## 🛠️ Developer Workflow & Scripts

| Command / Script | Purpose |
|------------------|---------|
| `bash scripts/repo-audit.sh` | snapshot audit (also runs on pre-push hook) |
| `npm run analyze` | scans code for RP features → REPO_ANALYSIS_REPORT.json |
| `docs/progress-tracker.html` | visual dashboard of the JSON above |
| `npm run gameplan` | rebuilds GAMEPLAN.md from docs/gap-analysis.md |
| Husky post-commit hook | auto-updates timestamp in gap-analysis.md |
| `pnpm test`, `pnpm test:e2e` | Vitest unit & Playwright e2e suites |

## 📄 Documentation Index

- **docs/gap-analysis.md** – live feature gap + priority table
- **GAMEPLAN.md** – autogenerated development timeline  
- **docs/progress-tracker.html** – progress dashboard (open in browser)
