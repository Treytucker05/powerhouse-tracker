# PowerHouse Tracker - Renaissance Periodization Toolkit v1.0.0

![Vitest](https://img.shields.io/badge/tests-passing-brightgreen)
![React](https://img.shields.io/badge/React-18-b   - User-editable MV, MEV, MAV, MRV for all 12 muscle groups
   - Chart color coding: green (optimal), amber (high), red (maximum)
   - Sets seeded at MEV instead of arbitrary defaults
   - Real-time effort validation with ±1 RIR tolerance warnings
   - Autoregulation feedback system

7. **🛑 Deload & Resensitization**
   - Auto-deload triggers: end of meso OR 2 consecutive MRV weeks
   - Automatic 50% volume + load reduction protocols
   - Resensitization phases every 3-6 blocks

8. **💡 Modern UI Features**
   - Unified builder interface for all program levels
   - Drag-and-drop timeline scheduling with visual feedback
   - Real-time block distribution statistics
   - Context-aware navigation with auto-redirects
   - Mobile-responsive design with TailwindCSS
   - Toast notifications for user actions

9. **📜 Validation Helpers**://img.shields.io/badge/Vite-6-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

A comprehensive evidence-based training toolkit implementing Renaissance Periodization methodology with **unified program builders**, **intelligent timeline planning**, and **drag-and-drop training design**.

## 🎯 Latest Features (v1.0.0)

### ✅ **Unified Program Builder System**
Revolutionary single-builder interface that adapts to all training contexts:
- 🎯 **Macrocycle Builder**: 12+ week complete program design with timeline view
- 📊 **Mesocycle Builder**: 4-6 week block planning with phase progression  
- 📋 **Microcycle Builder**: Weekly session scheduling with daily structure
- 🗓️ **Advanced Timeline**: Drag-and-drop calendar with context-aware blocks
- 🔄 **Seamless Navigation**: All builder paths unified - no more disconnected flows

### 🗓️ **Interactive Timeline System**
- **📅 Calendar View**: Visual timeline with drag-and-drop block scheduling
- **📊 Table View**: Detailed phase planning with load progression
- **🎨 Context-Aware Blocks**: Different block types for each program level
  - *Macro*: Accumulation, Intensification, Realization, Deload phases
  - *Meso*: Preparation, Development, Intensification, Tapering blocks  
  - *Micro*: Heavy Day, Moderate Day, Light Day, Rest Day sessions
- **⏱️ Smart Duration**: Automatic time scaling (days→weeks→months)

### 🧠 **Intelligence Layer**
- **`initIntelligence()`** - Initializes adaptive learning system
- **`optimizeVolumeLandmarks()`** - ML-based landmark optimization
- **`adaptiveRIRRecommendations()`** - Context-aware RIR suggestions
- **Auto-context detection** - URL-based builder mode selection

### 🎨 **Enhanced User Experience**
- **Visual Level Indicators**: Clear banners showing current program level
- **Unified Progress Tracking**: Consistent step progression across all levels
- **Smart Redirects**: All legacy routes redirect to unified builder
- **Responsive Design**: Mobile-first interface with TailwindCSS

## 🚀 Quick Start

### React Frontend (Recommended)
```bash
# Navigate to the React app
cd tracker-ui-good/tracker-ui

# Install dependencies  
npm install --legacy-peer-deps

# Start development server (opens on http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### Legacy Backend Development
```bash
# Legacy backend development
pnpm install

# Verify everything works (build + tests + linting)
pnpm run verify

# Legacy server
pnpm run dev
```

## 🗺️ Application Architecture

### **Program Design Flow**
```
Dashboard → Program Design → Unified Builder
    ├─ 🎯 Macrocycle (12+ weeks)
    │   ├─ Program Details
    │   ├─ Template Selection  
    │   ├─ Timeline Blocks
    │   ├─ Volume Distribution
    │   ├─ 📅 Timeline View (Drag & Drop)
    │   └─ Review & Generate
    │
    ├─ 📊 Mesocycle (4-6 weeks)  
    │   ├─ Block Structure
    │   ├─ Phase Timeline
    │   └─ Progress Tracking
    │
    └─ 📋 Microcycle (1-2 weeks)
        ├─ Weekly Structure
        ├─ Session Planning
        └─ Day-by-day Timeline
```

### **Unified Navigation System**
All program builder routes redirect to the unified interface:
- `/program` - Main unified builder
- `/macrocycle` → redirects to `/program` (macro mode)
- `/mesocycle` → redirects to `/program` (meso mode)  
- `/microcycle` → redirects to `/program` (micro mode)
- `/builder` → redirects to `/program`
- `/program-design/*` → redirects to `/program`

### **Key Components**
- **ContextAwareBuilder**: Unified builder that adapts to all program levels
- **TimelineStep**: Interactive calendar with drag-and-drop functionality
- **Program.jsx**: Main program design interface with auto-context detection
- **MacrocycleBuilderProvider**: Context provider for builder state management

## 🎯 Core Features

### 🎨 **Unified Program Builder**
- **Single Interface**: One builder adapts to all program levels (macro/meso/micro)
- **Context-Aware UI**: Components automatically adjust based on selected level
- **Consistent Flow**: Same navigation and progress tracking across all levels
- **Visual Indicators**: Clear banners and icons showing current program context

### 🗓️ **Interactive Timeline Planning**
- **📅 Drag & Drop Calendar**: Visual scheduling with react-big-calendar
- **📊 Table View Toggle**: Switch between calendar and detailed table views
- **🎨 Smart Block Types**: Context-specific training blocks for each level
- **⏱️ Adaptive Duration**: Automatic time scaling (1 day → 1 week → 4 weeks)
- **📈 Summary Statistics**: Real-time block distribution analysis

### 🤖 **Auto-Volume Progression System**
- **🎯 MEV Start:** All muscles begin at Minimum Effective Volume
- **📈 Smart Progression:** +1-2 sets per week based on recovery feedback
- **🛑 Auto-Deload:** Triggers when most muscles hit MRV
- **🧠 Adaptive Logic:** Volume-dependent feedback simulation

### 🧠 **Advanced Intelligence Features**
- **Auto-Context Detection**: URL-based program level detection
- **Smart Redirects**: Legacy routes automatically redirect to unified builder
- **State Persistence**: Builder state saved across sessions
- **Responsive Adaptation**: Mobile-optimized interface

### ✅ **Complete Renaissance Periodization Implementation**

1. **📁 Modern React Architecture**
   - `/src/components/builder/ContextAwareBuilder.jsx` - Unified builder component
   - `/src/pages/Program.jsx` - Main program interface with auto-detection
   - `/src/contexts/MacrocycleBuilderContext.tsx` - Builder state management
   - `/src/components/builder/TimelineStep.jsx` - Interactive timeline component
   - Drag-and-drop integration with react-dnd and HTML5Backend
   - Calendar integration with react-big-calendar and moment.js

2. **🎨 Timeline Block System**
   
   **Macrocycle Blocks (12+ weeks):**
   - 🔵 **Accumulation**: Volume focus, 55-70% load, MEV→MRV progression  
   - 🟠 **Intensification**: Strength building, 70-85% load, moderate volume
   - 🔴 **Realization**: Peak performance, 85-95% load, skill refinement
   - 🟢 **Deload**: Recovery phase, 40-60% load, restoration focus
   
   **Mesocycle Blocks (4-6 weeks):**
   - 🔵 **Preparation**: Work capacity, 60-75% load, movement quality
   - 🟠 **Development**: Progressive overload, 70-85% load, skill acquisition
   - 🔴 **Intensification**: High intensity, 80-90% load, reduced volume
   - 🟣 **Tapering**: Peak preparation, 70-95% load, reduced fatigue
   
   **Microcycle Sessions (1-2 weeks):**
   - 🔴 **Heavy Day**: Strength focus, 85-95% load, low volume
   - 🔵 **Moderate Day**: Balanced work, 70-80% load, moderate volume
   - 🟢 **Light Day**: Volume focus, 60-70% load, technique work
   - ⚪ **Rest Day**: Complete rest, 0% load, mobility/recovery

3. **🔢 RP "MEV Stimulus Estimator" (Table 2.2)**
   - `scoreStimulus({mmc, pump, disruption})` → 0-9 score
   - Automatic advice: 0-3 = "Add 2 sets", 4-6 = "Keep sets", 7-9 = "Remove sets"

4. **📈 RP "Set Progression Algorithm" (Table 2.3)**
   - Matrix lookup: [soreness 0-3] × [performance 0-3]
   - Replaces legacy `calcSets()` with evidence-based recommendations

5. **🗓️ Interactive Timeline Features**
   - **Drag & Drop**: Move training blocks to specific dates
   - **Calendar View**: Visual month/week views with color-coded blocks  
   - **Table View**: Detailed block information with load progressions
   - **Context Adaptation**: Block types automatically adjust to program level
   - **Duration Scaling**: Smart time periods (days for micro, weeks for macro)

6. **📊 Volume Landmarks System**

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

10. **🗓 State Persistence**
    - Complete training state serialization to localStorage
    - Builder state saved across sessions
    - Auto-context detection from URL patterns
    - Legacy data migration support

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm** for React frontend
- **Modern browser** with ES6+ support
- **Supabase account** (optional, for data persistence)

### React Frontend Setup (Recommended)

1. **Navigate to React app**
   ```bash
   cd tracker-ui-good/tracker-ui
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment setup** (optional)
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your Supabase credentials (optional)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Start development server**
   ```bash
   npm run dev
   # Opens on http://localhost:5173
   ```

5. **Start building programs**
   - Navigate to **Program Design** from dashboard
   - Choose your program level (Macrocycle/Mesocycle/Microcycle)  
   - Use the unified builder with interactive timeline
   - Drag training blocks to schedule phases
   - Export your completed program

### Program Design Workflow

1. **Program Details**: Set up basic program information
2. **Template Selection**: Choose from pre-built program templates
3. **Timeline Blocks**: Configure training phases/blocks
4. **Volume Distribution**: Set up load and volume progressions
5. **📅 Timeline View**: Visual scheduling with drag-and-drop calendar
6. **Review & Generate**: Finalize and export your program

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

### Timeline Block Characteristics

**Macrocycle Blocks (Drag-and-drop scheduling)**
- **Accumulation** → 4 weeks, 55-70% load, volume emphasis
- **Intensification** → 3 weeks, 70-85% load, strength focus  
- **Realization** → 2 weeks, 85-95% load, peak performance
- **Deload** → 1 week, 40-60% load, recovery protocols

**Mesocycle Blocks (Phase planning)**
- **Preparation** → 1-2 weeks, movement quality, base building
- **Development** → 2-3 weeks, progressive overload
- **Intensification** → 1-2 weeks, high intensity work
- **Tapering** → 1 week, reduced fatigue, peak preparation

**Microcycle Sessions (Daily scheduling)**  
- **Heavy Day** → 1 day, 85-95% load, strength emphasis
- **Moderate Day** → 1 day, 70-80% load, balanced work
- **Light Day** → 1 day, 60-70% load, volume/technique
- **Rest Day** → 1 day, complete rest or mobility

## 📱 User Interface

### � **Dashboard Home**
- **Weekly Volume Charts**: Bar charts with fatigue status indicators
- **Quick Actions**: Start workout, view progress, access builders
- **Training State**: Current program status and recommendations

### 🎯 **Unified Program Builder**
- **Context-Aware Interface**: Single builder adapts to macro/meso/micro levels
- **Step-by-Step Wizard**: Guided program creation with progress tracking
- **Visual Timeline**: Drag-and-drop calendar with context-specific blocks
- **Real-time Validation**: Instant feedback on program structure

### 📅 **Interactive Timeline Features**
- **Calendar View**: Visual month/week views with color-coded training blocks
- **Table View**: Detailed phase information with load progressions
- **Drag & Drop**: Move training blocks to specific dates
- **Block Palette**: Context-aware training elements for each program level
- **Summary Statistics**: Real-time distribution analysis

### 📊 **Program Overview**
- **Multi-Level Navigation**: Choose between macro, meso, and micro builders
- **Template Library**: Pre-built programs for different goals
- **Assessment Integration**: AI-powered training recommendations

### 🔬 **Analysis Tools**
- **Deload Analysis**: Multi-factor fatigue assessment
- **Volume Landmarks**: Muscle-specific range configuration  
- **Intelligence Dashboard**: Adaptive recommendations and insights
## 🎨 Visual Features

- **🎯 Context-Aware Colors**: Each program level has distinct block colors
  - Macro: Blue (accumulation), Orange (intensification), Red (realization), Green (deload)
  - Meso: Blue (preparation), Orange (development), Red (intensification), Purple (tapering)  
  - Micro: Red (heavy), Blue (moderate), Green (light), Gray (rest)
- **📊 Interactive Charts**: Drag-and-drop timeline with visual feedback
- **🔄 Seamless Navigation**: Auto-redirects and unified flow indicators
- **📱 Responsive Design**: Mobile-optimized interface with TailwindCSS
- **⚡ Real-time Updates**: Toast notifications and instant UI feedback
- **🎨 Modern UI**: Dark theme with gradient accents and smooth animations

## 🔧 Technical Architecture

### **React Frontend Architecture**
- **React 18**: Modern functional components with hooks
- **TypeScript**: Type-safe development with strict checking
- **Vite**: Fast build tool with hot module replacement
- **TailwindCSS**: Utility-first styling with responsive design
- **React Router**: Client-side routing with auto-redirects

### **State Management**
- **React Context**: MacrocycleBuilderContext for builder state
- **localStorage**: Persistent state across browser sessions
- **Auto-detection**: URL-based program level identification
- **State Migration**: Legacy data compatibility

### **Drag & Drop System**
- **react-dnd**: Drag-and-drop functionality with HTML5Backend
- **react-big-calendar**: Calendar component with moment.js localizer
- **Custom Calendar**: Enhanced with drop zones and event styling
- **Context Adaptation**: Block types change based on program level

### **UI Components**
- **ContextAwareBuilder**: Main unified builder component
- **TimelineStep**: Interactive calendar with drag-and-drop
- **Program.jsx**: Main interface with auto-context detection
- **DraggableBlock**: Reusable draggable training block component

### **Integration Layer**
- **Supabase**: Optional backend integration for data persistence
- **Chart.js**: Data visualization and progress tracking
- **React Query**: Server state management and caching

## 📊 Export & Tracking

- **📅 Timeline Export**: Export program schedules as PDF/JSON
- **📈 Progress Charts**: Visual progress tracking with Chart.js
- **💾 State Persistence**: Auto-save builder progress across sessions
- **🔄 Data Migration**: Automatic legacy format conversion
- **📋 Program Templates**: Export/import custom program templates

## 🔬 Evidence-Based Approach

This implementation follows the Renaissance Periodization methodology as outlined in:

- **"The Renaissance Diet 2.0"** - Nutrition periodization principles
- **"Renaissance Periodization"** - Volume landmark methodology
- **Dr. Mike Israetel's Research** - Evidence-based training principles
- **Scientific Programming** - Block periodization and fatigue management

## 🎓 Training Phases

### **Macrocycle Phases (12+ weeks)**
- **Accumulation**: Weeks 1-4, volume emphasis, moderate intensity
- **Intensification**: Weeks 5-7, strength focus, reduced volume  
- **Realization**: Weeks 8-9, peak performance, maximal loads
- **Deload**: Week 10, recovery and resensitization

### **Mesocycle Phases (4-6 weeks)**
- **Preparation**: Week 1, movement quality and base building
- **Development**: Weeks 2-3, progressive overload and skill acquisition
- **Intensification**: Week 4, high intensity and reduced volume
- **Tapering**: Week 5-6, peak preparation and fatigue reduction

### **Microcycle Structure (1-2 weeks)**
- **Heavy Days**: 85-95% 1RM, strength emphasis, low volume
- **Moderate Days**: 70-80% 1RM, balanced volume and intensity  
- **Light Days**: 60-70% 1RM, volume focus, technique work
- **Rest Days**: Complete rest or light mobility work

## 🚀 Development Workflow

### **Frontend Development**
```bash
# React development (recommended)
cd tracker-ui-good/tracker-ui
npm install --legacy-peer-deps
npm run dev                    # Development server
npm run build                  # Production build
npm run test                   # Jest testing suite
```

### **Legacy Backend Development**  
```bash
# Legacy development (maintenance mode)
pnpm install                   # Install dependencies
pnpm run verify               # Full verification pipeline
pnpm run dev                  # Legacy development server
```

### **Testing & Quality**
```bash
# Frontend testing
npm run test                  # Jest unit tests
npm run test:coverage         # Coverage reports
npm run lint                  # ESLint checking

# Legacy testing  
pnpm test                     # Vitest unit tests
pnpm test:e2e                 # Playwright e2e tests
pnpm run audit                # Button handler audit
```

---

**Built for PowerHouseATX** - Evidence-based muscle building through Renaissance Periodization methodology with modern unified program builders.

## 🛠️ Troubleshooting

### **Common Issues**
- **Build fails**: Ensure Node.js 18+ and run `npm install --legacy-peer-deps`
- **Calendar not loading**: Verify react-big-calendar and moment.js are installed
- **Drag-drop not working**: Check react-dnd and HTML5Backend integration
- **Navigation issues**: Clear localStorage and restart development server
- **Supabase errors**: Verify `.env` variables or run without backend integration

### **Browser Support**
- **Chrome 90+**: Full support with all features
- **Firefox 88+**: Full support with all features  
- **Safari 14+**: Full support with all features
- **Edge 90+**: Full support with all features

### **Performance Tips**
- Use Chrome DevTools to monitor drag-and-drop performance
- Clear browser cache if timeline rendering is slow
- Disable browser extensions that might interfere with drag operations
