**ACTIVE APP:** Only `tracker-ui-good/tracker-ui` is live. Root scripts proxy to it.
All other folders are legacy and ignored by tools (ESLint/Prettier/CI).


# PowerHouse Tracker v3.0.0

![Vitest](https://img.shields.io/badge/tests-passing-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-yellow)
![Design System](https://img.shields.io/badge/Design%20System-Complete-brightgreen)
![Deploy](https://github.com/Treytucker05/powerhouse-tracker/actions/workflows/deploy.yml/badge.svg)

A modern React-based training tracker with **complete program design system**, **centralized design system**, **7-step periodization methodology**, and **cross-browser compatibility**.

### Feature flag: method packs
- Packs ON by default. Kill-switch:
  - Vite: `VITE_USE_METHOD_PACKS=false`
  - CRA:  `REACT_APP_USE_METHOD_PACKS=false`

## 📋 Quick Reference

### **Current Development Status**
- **📊 Current Status:** [`CURRENT_STATUS_UPDATE_AUGUST_2025.md`](CURRENT_STATUS_UPDATE_AUGUST_2025.md) - **LATEST** comprehensive status report
- **🎯 Master Plan:** [`MASTER_DEVELOPMENT_PLAN.md`](MASTER_DEVELOPMENT_PLAN.md) - Long-term development roadmap
- **⚙️ Technical Details:** [`GOAL_FIRST_DEVELOPMENT_PLAN.md`](GOAL_FIRST_DEVELOPMENT_PLAN.md) - Implementation specifics  
- **💪 5/3/1 System:** [`FIVETHREEONE_IMPLEMENTATION_COMPLETE.md`](FIVETHREEONE_IMPLEMENTATION_COMPLETE.md) - Complete algorithm documentation
- **🏆 Goal-First Approach:** [`GOAL_FIRST_IMPLEMENTATION_COMPLETE.md`](GOAL_FIRST_IMPLEMENTATION_COMPLETE.md) - Training goal selector system
- **📚 Book Extraction:** [`COMPLETE_BOOK_EXTRACTION_CHECKLIST.md`](COMPLETE_BOOK_EXTRACTION_CHECKLIST.md) - Systematic knowledge extraction framework

### **Active Implementation**
- **📱 Main Program:** `tracker-ui-good/tracker-ui/src/pages/StreamlinedProgram.jsx` - 8-step streamlined workflow
- **🏥 Injury Screening:** `tracker-ui-good/tracker-ui/src/components/program/tabs/InjuryScreeningStep.jsx` - **NEW** Enhanced algorithmic assessment
- **📅 Timeline System:** `tracker-ui-good/tracker-ui/src/components/program/tabs/TimelineStep.jsx` - **NEW** Comprehensive periodization options
- **🧮 Algorithms:** `js/algorithms/` - Core training systems (5/3/1, RP, etc.)
- **🎯 Goal Selector:** `js/utils/goalBasedSelector.js` - 7 training goals with system compatibility
- **🎨 Design System:** `tracker-ui-good/tracker-ui/src/components/` - Centralized UI components

### **Documentation Archive**
- **📁 Historical Docs:** [`docs/archive/`](docs/archive/) - Completed implementations and old planning files
 - **📚 Docs Hub:** [`docs/INDEX.md`](docs/INDEX.md) - Canonical index of all docs (supersedes legacy indices)

> Ongoing: README and instructional files are being consolidated per [`docs/docs-audit.md`](docs/docs-audit.md). Merged drafts live in `docs/merge-drafts/`.

## 🎯 Latest Features (v3.0.0)

###   **Enhanced Algorithmic Injury Screening** ⭐ **LATEST - AUGUST 2025**
- **10 Structured Questions**: Radio/checkbox responses for precise algorithmic processing
- **Multi-Injury Algorithm**: Handles multiple simultaneous injuries with compound safety protocols
- **Injury-Exercise Matrix**: Comprehensive mapping of injuries to specific exercise modifications
- **Progressive Return Protocol**: 4-phase return-to-training system with volume/intensity guidelines
- **System Compatibility Analysis**: Injury adaptability ratings for all training systems (RP, 5/3/1, Linear, Josh Bryant)
- **Real-Time Algorithm Results**: Live calculation of volume multipliers, intensity caps, exercise exclusions
- **Exercise Modifications**: Specific ROM restrictions, load limitations, tempo adjustments, equipment alternatives

### 📅 **Comprehensive Timeline System** ⭐ **NEW**
- **Mesocycles**: 2-8 week options for short training blocks and skill acquisition phases
- **Macrocycles Medium**: 8-24 week standard periodization for most training goals
- **Macrocycles Long-term**: 6 months to 2 years for advanced athletes and multi-year planning
- **Custom Durations**: User-defined timeline flexibility for unique programming needs
- **Category-Based Selection**: Intuitive periodization framework with clear duration guidelines

### 🔧 **Streamlined Program Design Workflow** ⭐ **ENHANCED**
- **8-Step Process**: Simplified from complex multi-page system to focused workflow
- **Bromley-Free Interface**: Clean PowerHouse ATX branding throughout main workflow
- **Enhanced Context Management**: Advanced state management with timeline and injury screening actions
- **Modern React Architecture**: Hooks-based components with centralized context providers

###  🎨 **Centralized Design System** ⭐ **MATURE**
- **Global Color Control**: Change one CSS variable to update ALL components across the app
- **Red Input Fields**: All form inputs now use red backgrounds with proper contrast
- **CSS Custom Properties**: Centralized design tokens for colors, spacing, and typography
- **React Component Library**: Pre-built Card, FormInput, Button, and Grid components
- **Theme Switching**: Easy switching between color schemes (default, blue inputs, high contrast)
- **Cross-Browser Compatibility**: Aggressive CSS overrides for autocomplete visibility
- **"Set It and Forget It"**: No more manual color fixes - update once, applies everywhere

### ✅ **7-Step Periodization Program Design** ⭐ **ESTABLISHED**
- **Goals & Needs Assessment**: Comprehensive athlete evaluation and training objective setting
- **Macrocycle Structure**: Annual training timeline with periodization model selection
- **Phase Design**: Preparatory, competitive, and transition phase planning  
- **Mesocycle Planning**: 2-6 week training blocks with specific adaptations
- **Microcycle Design**: Weekly training patterns and loading schemes
- **Session & Monitoring**: Daily session templates and progress tracking protocols
- **Implementation**: Program execution, tracking, and refinement strategies

### 🎨 **Professional PowerHouse Dark Theme** ⭐ **UPGRADED**
- **Design System Integration**: All colors managed through CSS custom properties
- **Primary Colors**: PowerHouse red (#dc2626/#ef4444) with consistent application
- **High Contrast Design**: Improved text visibility with proper color contrast ratios
- **Mobile Responsive**: Touch-optimized controls with design system consistency
- **Component Standardization**: Unified styling across all UI elements

### 🧠 **Enhanced Training Intelligence**
- **Evidence-Based Methodology**: 7-step periodization following sports science principles
- **State Management**: React Context with useReducer for seamless tab navigation
- **Real-Time Updates**: Immediate feedback and validation throughout program creation
- **Component Isolation**: Systematic debugging with centralized styling system

## 🚀 Quick Start

### Prerequisites
This project uses **npm** for package management and **React 19** with **Vite 6**.

### Development Setup

**Important**: All commands must be run from the `tracker-ui-good/tracker-ui/` directory.

```bash
# Navigate to the correct directory first!
cd tracker-ui-good/tracker-ui/

# Install dependencies
npm install --legacy-peer-deps

# Start development server (opens on http://localhost:5173)
npm run dev

# Automated setup (optional)
# Run either setup script from tracker-ui directory:
./setup.sh    # Linux/Mac
setup.bat     # Windows
```

**All subsequent commands assume you're in the `tracker-ui-good/tracker-ui/` directory:**

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview

# Run E2E tests
npm run test:e2e

# Lint and fix code
npm run lint
```

##   Design System Architecture

### Centralized Styling System
The application features a comprehensive design system that eliminates the need for manual color overrides:

#### CSS Custom Properties (`src/styles/design-system.css`)
```css
:root {
  /* Input Colors - Change once, applies everywhere */
  --input-bg: #dc2626;           /* Red background for all inputs */
  --input-border: #6b7280;       /* Gray border for form elements */
  --input-text: #ffffff;         /* White text for contrast */
  
  /* Background Colors */
  --bg-primary: #111827;         /* Primary dark background */
  --bg-secondary: #1f2937;       /* Secondary background */
  --bg-tertiary: #374151;        /* Tertiary background */
  
  /* Text Colors */
  --text-primary: #ffffff;       /* Primary white text */
  --text-secondary: #d1d5db;     /* Secondary light gray */
  --text-muted: #9ca3af;         /* Muted gray text */
  
  /* Accent Colors */
  --accent-primary: #dc2626;     /* PowerHouse red */
  --accent-hover: #ef4444;       /* Red hover state */
  --accent-pressed: #b91c1c;     /* Red pressed state */
}
```

#### Component Classes
```css
/* Form Components */
.form-input {
  background-color: var(--input-bg);
  color: var(--input-text);
  border: 1px solid var(--input-border);
}

.form-label {
  color: var(--text-secondary);
  font-weight: 500;
}

/* Layout Components */
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--bg-tertiary);
  border-radius: 0.5rem;
}

.button-primary {
  background-color: var(--accent-primary);
  color: var(--text-primary);
}
```

#### React Component Library (`src/components/ui/DesignSystem.jsx`)
```jsx
// Pre-built components using design system
export const FormInput = ({ label, error, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <input className="form-input" {...props} />
    {error && <span className="form-error">{error}</span>}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

export const Button = ({ variant = "primary", children, ...props }) => (
  <button className={`button button-${variant}`} {...props}>
    {children}
  </button>
);
```

#### Theme Configuration (`src/config/designSystem.js`)
```javascript
export const designTokens = {
  colors: {
    primary: '#dc2626',
    secondary: '#ef4444',
    background: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#374151'
    }
  },
  
  themes: {
    default: { inputBg: '#dc2626' },
    blueInputs: { inputBg: '#2563eb' },
    highContrast: { inputBg: '#000000' }
  }
};
```

#### Benefits
- **Global Control**: Change `--input-bg` once, updates ALL input fields
- **Consistency**: No more manual Tailwind classes for common patterns
- **Maintainability**: Centralized location for all design decisions
- **Theme Switching**: Easy color scheme changes without touching components
- **Developer Experience**: Simple classes replace complex Tailwind combinations

##  🎯 Core Application Features

### Dashboard System
- **Training Status Overview**: Current week, phase, and progress tracking
- **Volume Tracking Charts**: Visual representation of weekly training volumes
- **Fatigue Recovery Indicators**: Real-time fatigue status with systemic tracking
- **Quick Actions Panel**: One-click access to common training functions
- **Upcoming Sessions Preview**: Calendar view of scheduled training sessions

### Program Design System (v3.0.0 - 7-Step Methodology)
- **Horizontal Tab Navigation**: Clean tab-based interface with design system styling
  - 🎯 **Goals & Needs**: Athlete assessment, training history, and objective setting
  -   **Macrocycle Structure**: Annual timeline with periodization model selection
  - 🔄 **Phase Design**: Preparatory, competitive, and transition phase planning
  -   **Mesocycle Planning**: Training blocks with specific adaptation focuses
  - 📋 **Microcycle Design**: Weekly patterns and loading scheme development
  - 🏃 **Session & Monitoring**: Daily templates and progress tracking protocols
  -   **Implementation**: Execution strategies and program refinement
- **Design System Integration**: All components use centralized CSS custom properties
- **Real-Time State Management**: Seamless tab switching with preserved program state
- **Evidence-Based Approach**: Following sports science periodization principles

### Workout Management
- **Real-Time Logging**: Start/finish sessions with set-by-set tracking
- **Session History**: Complete workout session browser with detailed views
- **Set Log Drawer**: Click any session for comprehensive set information
- **Exercise Database**: High SFR exercises with biomechanical profiles

### Intelligence Features
- **Adaptive RIR Recommendations**: Personalized recommendations with confidence levels
- **Deload Analysis**: Automated fatigue detection and volume reset protocols
- **Training Focus Distribution**: Evidence-based method selection and distribution
- **Progress Tracking**: Historical data analysis with trend identification

### Data & Analytics
- **Supabase Integration**: Real-time cloud synchronization and data persistence
- **Export Functionality**: Comprehensive data export in multiple formats
- **Chart Visualizations**: Interactive charts with Chart.js integration
- **Responsive Design**: Mobile-optimized interface for all screen sizes

## ⚙️ Environment Setup

### Supabase Configuration
Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔄 Automatic Deployment

Changes pushed to the `release/f531-v2-alpha` branch now automatically build and deploy to **GitHub Pages** via the workflow at `.github/workflows/deploy.yml`.

Pipeline summary:
- Trigger: Push (or manual dispatch) on `release/f531-v2-alpha`
- Environment: Node 20, npm cache
- Steps: checkout → install (npm ci) → build (`vite build`) → upload artifact → deploy (GitHub Pages)
- Output: `dist/` published to Pages (no manual worktree push required anymore)

To force a redeploy without code changes:
```
git commit --allow-empty -m "chore: trigger redeploy" && git push origin release/f531-v2-alpha
```

If a deployment seems stuck, check the Actions tab for the latest run logs. The badge at the top of this README reflects current workflow status.

### Database Schema (Optional Cloud Features)
Run in Supabase SQL Editor if using cloud synchronization:

```sql
-- Add program design columns
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS training_days_per_week INTEGER DEFAULT 4;

ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS block_type TEXT;

ALTER TABLE program_blocks 
ADD COLUMN IF NOT EXISTS focus TEXT;
```

## 🎯 Application Usage

### Getting Started
1. **Dashboard**: Landing page with training overview and quick actions
2. **Program Design**: Create complete training programs with 5-tab interface
3. **Workout Logger**: Real-time session tracking with set-by-set logging
4. **Session History**: Browse and analyze all completed workouts
5. **Intelligence**: View AI recommendations and deload analysis

### Program Design Workflow (7-Step Periodization)
The Program Design system features a horizontal navigation bar with 7 evidence-based steps:

1. **🎯 Goals & Needs Assessment**: Comprehensive athlete evaluation
   - Training History: Previous experience, injury history, training background
   - Performance Analysis: Current strength levels, movement quality assessment
   - Goal Setting: Specific, measurable training objectives (strength, power, hypertrophy)
   - Sport Requirements: Sport-specific demands and competition schedule
   - Individual Factors: Recovery capacity, training availability, lifestyle constraints

2. **📅 Macrocycle Structure**: Annual training timeline planning
   - Periodization Model Selection: Linear, Block, Daily Undulating, or Conjugate
   - Competition Schedule: Key competitions and peak performance windows
   - Training Phases: Preparatory, competitive, and transition periods
   - Annual Volume Distribution: Overall training load across the year
   - Recovery Blocks: Planned deload and restoration periods

3. **🔄 Phase Design**: Detailed phase planning and objectives
   - Preparatory Phase: General and specific preparation periods
   - Competitive Phase: Pre-competition and competition periods  
   - Transition Phase: Active recovery and regeneration
   - Phase Objectives: Specific adaptations targeted in each phase
   - Training Emphasis: Primary and secondary training focuses per phase

4. **📊 Mesocycle Planning**: 2-6 week training block design
   - Block Types: Accumulation, intensification, realization, restoration
   - Adaptation Focus: Specific physiological adaptations per block
   - Volume Progression: Progressive overload schemes within blocks
   - Intensity Distribution: Load management across training zones
   - Block Sequencing: Logical progression between mesocycles

5. **  Microcycle Design**: Weekly training pattern development
   - Training Frequency: Sessions per week and muscle group frequency
   - Session Distribution: Training day arrangement and recovery placement
   - Weekly Loading: Volume and intensity patterns within the week
   - Exercise Selection: Movement patterns and muscle group distribution
   - Recovery Integration: Active recovery and complete rest days

6. **🏃 Session & Monitoring**: Daily session templates and tracking
   - Session Structure: Warm-up, main work, and cool-down protocols
   - Exercise Programming: Sets, reps, intensity, and rest periods
   - Monitoring Protocols: RPE, heart rate, velocity-based training
   - Progress Indicators: Key performance metrics and assessment tools
   - Autoregulation: Adaptive strategies based on readiness and fatigue

7. **🚀 Implementation**: Program execution and refinement
   - Execution Strategies: How to implement the program effectively
   - Progress Tracking: Monitoring systems and data collection
   - Program Adjustments: When and how to modify the program
   - Troubleshooting: Common issues and solutions during implementation
   - Long-term Planning: Program evaluation and future planning

### Training Execution
1. **Start Session**: Begin workout from dashboard or logger
2. **Log Sets**: Record exercise, weight, reps, and RIR in real-time

## 5/3/1 Extraction Build

All template / exercise data lives in:  
`scripts/extraction.config.json` (edit this only).

### Build Options

**Option 1 — VS Code Task**  
- Press `Ctrl+Shift+P` → “Run Task” → `Build Extraction Sheet (TS)` or `Build Extraction Sheet (JS Fallback)`.

**Option 2 — npm scripts**  
- `npm run extract:build` → TypeScript (ts-node)  
- `npm run extract:build:js` → JavaScript fallback  
- `npm run extract:all` → Build + auto-open Excel + CSV folder

**Option 3 — Double-click**  
- Run `scripts/run-extraction.cmd` from Explorer.

### Outputs
- Excel workbook: `data/extraction/531_extraction_template.xlsx`  
- CSVs: `public/methodology/extraction/*.csv`

**Rule:** never hand-edit Excel/CSVs. Always update the JSON and rebuild.

---
3. **Track Progress**: Monitor volume, fatigue, and adaptation markers
4. **Analyze Performance**: Review session data and intelligence recommendations

## 🎨 User Interface Design & Design System

### Centralized Design System
The application implements a comprehensive design system for consistent styling:

#### Design System Files
- **`src/styles/design-system.css`**: Master stylesheet with CSS custom properties
- **`src/components/ui/DesignSystem.jsx`**: React component library
- **`src/config/designSystem.js`**: Configuration and theme switching
- **`src/hooks/useDesignSystem.js`**: Programmatic access to design tokens

#### Usage Patterns
```jsx
// Option 1: CSS Classes (Simplest)
<input className="form-input" />
<div className="card">
  <button className="button-primary">Save</button>
</div>

// Option 2: React Components
import { Card, FormInput, Button } from '../components/ui/DesignSystem';
<Card>
  <FormInput label="Name" placeholder="Enter name" />
  <Button variant="primary">Save</Button>
</Card>

// Option 3: Theme Switching
import { useDesignSystem } from '../hooks/useDesignSystem';
const { switchTheme } = useDesignSystem();
switchTheme('blueInputs'); // Changes all inputs to blue
```

### PowerHouse Theme System
The application implements a professional dark theme with PowerHouse branding:

- **Primary Colors**: 
  - PowerHouse Red: `var(--accent-primary)` (#dc2626)
  - Red Variants: `var(--accent-hover)` (#ef4444), `var(--accent-pressed)` (#b91c1c)
  - Background: `var(--bg-primary)` (#111827), `var(--bg-secondary)` (#1f2937)
  - Text: `var(--text-primary)` (#ffffff), `var(--text-secondary)` (#d1d5db)

- **Form Elements**:
  - **Input Backgrounds**: All inputs use red backgrounds via `var(--input-bg)`
  - **Cross-Browser Compatibility**: Aggressive CSS overrides for autocomplete
  - **High Contrast**: Proper color contrast ratios for accessibility
  - **Consistent Styling**: No more manual Tailwind classes for form elements

- **Navigation Design**:
  - **Horizontal Layout**: All navigation bars use horizontal orientation
  - **Design System Buttons**: Buttons use `.button-primary` class with CSS variables
  - **Sticky Positioning**: Navigation stays accessible while scrolling
  - **Mobile Responsive**: Collapsible hamburger menu for mobile devices

### Program Design Interface (7-Step Methodology)
The Program Design system features a distinctive interface with centralized styling:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Program Design - 7-Step Periodization                              │
├─────────────────────────────────────────────────────────────────────┤
│ [🎯 Goals & Needs] [  Macrocycle] [🔄 Phase Design]               │
│ [  Mesocycles] [  Microcycles] [🏃 Sessions] [🚀 Implementation]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Tab Content Area - Design system styled with CSS custom properties │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Tab Navigation**: Uses `.button-primary` class with CSS custom properties
- **Active State**: Background color controlled by `var(--accent-primary)`
- **Hover Effects**: Managed through `var(--accent-hover)` for consistency
- **Content Areas**: All use `.card` class with design system backgrounds
- **Form Elements**: All inputs automatically use `.form-input` styling

## 🧭 Navigation Architecture

### Main Application Navigation
The application features a horizontal navigation bar with PowerHouse branding:

```
┌─────────────────────────────────────────────────────────────────────┐
│ [🏠] PowerHouse ATX    [Dashboard] [Assessment] [Program Design]    │
│                        [Tracking] [Analytics] [Exercises]     [User] │
└─────────────────────────────────────────────────────────────────────┘
```

**Main Navigation Items:**
- **🏠 Dashboard**: Training overview, volume charts, quick actions
- **📋 Assessment**: Movement screens, strength testing, goal setting
- **🎯 Program Design**: Complete program creation system (5-tab interface)
- **📈 Tracking**: Workout logging, session history, progress monitoring  
- **📊 Analytics**: Performance analysis, trend identification, recommendations
- **💪 Exercises**: Exercise database, technique guides, video demonstrations
- **👤 User Profile**: Account settings, preferences, data management

### Program Design Navigation (7-Step System)
When in Program Design, users see a specialized horizontal tab interface with evidence-based periodization steps:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Program Design - Evidence-Based Periodization                      │
├─────────────────────────────────────────────────────────────────────┤
│ [🎯 Goals & Needs] [  Macrocycle] [🔄 Phase Design]               │
│ [  Mesocycles] [  Microcycles] [🏃 Sessions] [🚀 Implementation]  │
└─────────────────────────────────────────────────────────────────────┘
```

**7-Step Program Design Tabs:**
1. **🎯 Goals & Needs**: Athlete assessment, training history, objective setting
2. **  Macrocycle Structure**: Annual timeline, periodization model selection
3. **🔄 Phase Design**: Preparatory, competitive, and transition phase planning
4. **  Mesocycle Planning**: 2-6 week training blocks with specific adaptations
5. **  Microcycle Design**: Weekly patterns and loading scheme development
6. **🏃 Session & Monitoring**: Daily templates and progress tracking protocols
7. **🚀 Implementation**: Execution strategies and program refinement

### Navigation Behavior
- **Sticky Headers**: Navigation remains accessible during scrolling
- **Active State Indicators**: Red background highlights current location
- **Hover Effects**: Smooth color transitions and subtle shadow effects
- **Mobile Adaptation**: Collapsible hamburger menu for smaller screens
- **State Preservation**: Tab switching maintains user progress and data

## 🛠️ Technical Architecture

### Frontend Stack
- **React 19**: Latest React with concurrent features and improved performance
- **Vite 6**: Ultra-fast build tool with hot module replacement
- **TailwindCSS**: Utility-first CSS framework enhanced with design system
- **Design System**: CSS custom properties with centralized component styling
- **React Router**: Client-side routing with nested route support
- **React Context**: Global state management with useReducer pattern

### Design System Architecture

#### CSS Custom Properties (`src/styles/design-system.css`)
The design system uses CSS custom properties for centralized styling control:

```css
:root {
  /* Color System */
  --input-bg: #dc2626;           /* Red inputs - change once, applies everywhere */
  --accent-primary: #dc2626;     /* PowerHouse red */
  --accent-hover: #ef4444;       /* Hover states */
  --accent-pressed: #b91c1c;     /* Pressed states */
  
  /* Background Hierarchy */
  --bg-primary: #111827;         /* Primary backgrounds */
  --bg-secondary: #1f2937;       /* Secondary backgrounds */
  --bg-tertiary: #374151;        /* Tertiary backgrounds */
  
  /* Text Hierarchy */
  --text-primary: #ffffff;       /* Primary text */
  --text-secondary: #d1d5db;     /* Secondary text */
  --text-muted: #9ca3af;         /* Muted text */
}

/* Component Classes */
.form-input { background-color: var(--input-bg); }
.card { background-color: var(--bg-secondary); }
.button-primary { background-color: var(--accent-primary); }
```

#### React Component Library (`src/components/ui/DesignSystem.jsx`)
Pre-built components that automatically use design system styling:

```jsx
export const FormInput = ({ label, error, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <input className="form-input" {...props} />
    {error && <span className="form-error">{error}</span>}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const Button = ({ variant = "primary", children, ...props }) => (
  <button className={`button button-${variant}`} {...props}>
    {children}
  </button>
);
```

#### Design System Hook (`src/hooks/useDesignSystem.js`)
Programmatic access to design tokens and theme switching:

```jsx
export const useDesignSystem = () => {
  const switchTheme = (themeName) => {
    const theme = themes[themeName];
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  const getColor = (colorName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${colorName}`);
  };

  return { switchTheme, getColor };
};
```

### React Router Configuration

The application uses React Router v7 with nested routing structure defined in `/src/App.jsx`:

#### Main Routes
```jsx
<Routes>
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/" element={<AppShell />}>
    <Route index element={<Home />} />                    // Dashboard homepage
    <Route path="program" element={<Program />} />        // 7-Step Program Design system  
    <Route path="assessment" element={<Assessment />} />   // Movement & strength assessment
    <Route path="tracking" element={<TrackingEnhanced />} /> // Workout logging interface
    <Route path="analytics" element={<Analytics />} />    // Performance analysis
    <Route path="exercises" element={<ExercisesPage />} /> // Exercise database
    <Route path="profile" element={<ProfilePage />} />    // User settings
    <Route path="resources" element={<ResourcesPage />} /> // Documentation & guides
    
    {/* Design system enhanced program page */}
    <Route path="program-with-design-system" element={<ProgramWithDesignSystem />} />
    
    {/* Legacy route redirects - All redirect to /program */}
    <Route path="mesocycle" element={<MacrocycleRedirect />} />
    <Route path="microcycle" element={<MacrocycleRedirect />} />
    <Route path="macrocycle" element={<MacrocycleRedirect />} />
    <Route path="builder" element={<MacrocycleRedirect />} />
    
    {/* Legacy program design builder with context provider */}
    <Route path="program-design" element={
      <MacrocycleBuilderProvider>
        <ContextAwareBuilder />
      </MacrocycleBuilderProvider>
    } />
  </Route>
</Routes>
```

#### Program Design System Updates
- **Primary Route**: `/program` - Main 7-step program design interface
- **Enhanced Version**: `/program-with-design-system` - Program page rebuilt with design system components
- **Legacy Support**: `/program-design` - Maintains backward compatibility
- **Component Updates**: All tab components updated to use design system styling

#### Route Protection
- **AppShell Component**: Wraps all main routes with authentication checking
- **Protected Routes**: `/tracking`, `/mesocycle`, `/microcycle`, `/macrocycle` require authentication
- **Auth Redirection**: Unauthenticated users redirected to `/auth` for protected routes
- **Layout Structure**: All routes except `/auth` use AppShell layout with TopNav + main content area

### Navigation Component Architecture

#### TopNav Component (`/src/components/navigation/TopNav.jsx`)

**Props Interface:**
```jsx
interface TopNavProps {
  user: User | null;           // Supabase user object from auth state
  onSignOut: () => void;       // Sign out callback function
}
```

**Navigation Items:**
```jsx
const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/assessment", label: "Assessment", icon: ClipboardList },
  { to: "/program", label: "Program Design", icon: Cog },
  { to: "/tracking", label: "Tracking", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/exercises", label: "Exercises", icon: Dumbbell },
  { to: "/resources", label: "Resources", icon: BookOpen },
];
```

**Dynamic Features:**
- **Responsive Design**: Desktop horizontal navigation, mobile hamburger menu
- **Active State**: Uses `NavLink` with automatic active styling (red background)
- **Profile Dropdown**: User avatar with email display and profile link
- **Authentication Integration**: Shows/hides logout button based on user state
- **Mobile Optimization**: Collapsible menu with touch-friendly buttons

**State Management:**
- `isMobileMenuOpen`: Controls mobile menu visibility
- `isProfileOpen`: Controls profile dropdown visibility
- Uses React Router's `NavLink` for automatic active state detection

### Global State Management

#### Primary Context: ProgramContext (`/src/contexts/ProgramContext.jsx`)

**State Structure (7-Step Methodology):**
```jsx
const initialState = {
  // UI State - 7-Step Navigation
  activeTab: 'goals',                      // Current Program Design step (goals/macrocycle/phases/mesocycles/microcycles/sessions/implementation)
  selectedLevel: null,                     // Selected difficulty level
  isLoading: false,                        // Loading state
  error: null,                             // Error messages
  
  // Step 1: Goals & Needs Assessment
  goalsAndNeeds: {
    trainingHistory: '',                   // Previous training experience
    injuryHistory: '',                     // Injury and limitation assessment
    trainingGoals: [],                     // Primary and secondary objectives
    sportRequirements: '',                 // Sport-specific demands
    availableTime: '',                     // Training time constraints
    recoveryFactors: ''                    // Recovery and lifestyle factors
  },
  
  // Step 2: Macrocycle Structure  
  macrocycleStructure: {
    periodizationModel: '',                // Linear/Block/DUP/Conjugate
    annualPlan: '',                        // Year-long training timeline
    competitionSchedule: [],               // Key competitions and events
    trainingPhases: [],                    // Major training periods
    volumeDistribution: ''                 // Annual volume planning
  },
  
  // Step 3: Phase Design
  phaseDesign: {
    preparatoryPhase: {},                  // General and specific preparation
    competitivePhase: {},                  // Pre-competition and competition
    transitionPhase: {},                   // Active recovery and regeneration
    phaseObjectives: [],                   // Specific adaptations per phase
    trainingEmphasis: []                   // Primary and secondary focuses
  },
  
  // Step 4: Mesocycle Planning
  mesocyclePlanning: {
    blockTypes: [],                        // Accumulation/Intensification/Realization/Restoration
    adaptationFocus: [],                   // Specific physiological targets
    volumeProgression: {},                 // Progressive overload schemes
    intensityDistribution: {},             // Load management across zones
    blockSequence: []                      // Logical mesocycle progression
  },
  
  // Step 5: Microcycle Design
  microcycleDesign: {
    trainingFrequency: 0,                  // Sessions per week
    sessionDistribution: [],               // Training day arrangement
    weeklyLoading: {},                     // Volume and intensity patterns
    exerciseSelection: [],                 // Movement patterns and muscles
    recoveryIntegration: []                // Recovery and rest day placement
  },
  
  // Step 6: Session & Monitoring
  sessionMonitoring: {
    sessionStructure: {},                  // Warm-up, main work, cool-down
    exerciseProgramming: [],               // Sets, reps, intensity, rest
    monitoringProtocols: [],               // RPE, HR, VBT protocols
    progressIndicators: [],                // KPIs and assessment tools
    autoregulation: {}                     // Adaptive strategies
  },
  
  // Step 7: Implementation
  implementation: {
    executionStrategies: [],               // Implementation guidelines
    progressTracking: {},                  // Monitoring systems
    programAdjustments: [],                // Modification protocols
    troubleshooting: [],                   // Common issues and solutions
    longTermPlanning: {}                   // Evaluation and future planning
  },
  
  // Legacy Support (Backward Compatibility)
  programData: {
    name: '',                              // Program name
    goal: 'hypertrophy',                   // Primary goal
    duration: 12,                          // Program length in weeks
    trainingDays: 4,                       // Training days per week
    selectedTemplate: null                 // Chosen program template
  },
  
  // Assessment Integration
  assessmentData: null,                    // User assessment results
  isLoadingAssessment: true,              // Assessment loading state
  assessmentError: null,                  // Assessment errors
  
  // Generated Results
  generatedProgram: null                 // Final program output
};
```

**Updated Reducer Actions:**
```jsx
export const PROGRAM_ACTIONS = {
  // 7-Step Navigation
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  
  // Step-Specific Actions
  UPDATE_GOALS_AND_NEEDS: 'UPDATE_GOALS_AND_NEEDS',
  UPDATE_MACROCYCLE_STRUCTURE: 'UPDATE_MACROCYCLE_STRUCTURE',
  UPDATE_PHASE_DESIGN: 'UPDATE_PHASE_DESIGN',
  UPDATE_MESOCYCLE_PLANNING: 'UPDATE_MESOCYCLE_PLANNING',
  UPDATE_MICROCYCLE_DESIGN: 'UPDATE_MICROCYCLE_DESIGN',
  UPDATE_SESSION_MONITORING: 'UPDATE_SESSION_MONITORING',
  UPDATE_IMPLEMENTATION: 'UPDATE_IMPLEMENTATION',
  
  // Legacy Actions (Backward Compatibility)
  SET_PROGRAM_DATA: 'SET_PROGRAM_DATA',
  SET_ASSESSMENT_DATA: 'SET_ASSESSMENT_DATA',
  SET_TRAINING_MODEL: 'SET_TRAINING_MODEL',
  SET_GENERATED_PROGRAM: 'SET_GENERATED_PROGRAM'
};
```

**Action Creators (7-Step Methodology):**
All actions are memoized with `useCallback` for performance:
- `setActiveTab(tab)`: Navigate between the 7 program design steps
- `updateGoalsAndNeeds(data)`: Update athlete assessment and goal setting
- `updateMacrocycleStructure(data)`: Update annual planning and periodization
- `updatePhaseDesign(data)`: Update training phase objectives
- `updateMesocyclePlanning(data)`: Update training block design
- `updateMicrocycleDesign(data)`: Update weekly pattern development
- `updateSessionMonitoring(data)`: Update daily templates and monitoring
- `updateImplementation(data)`: Update execution and refinement strategies

#### Secondary Context: MacrocycleBuilderContext (`/src/contexts/MacrocycleBuilderContext.tsx`)

Provides additional context for legacy macrocycle routes and builder components.

### Key Dependencies & Custom Hooks

#### Core Dependencies (package.json)
```json
{
  // UI & Navigation
  "react": "^19.1.0",                      // Latest React with concurrent features
  "react-dom": "^19.1.0",                 // React DOM renderer
  "react-router-dom": "^7.6.2",           // Client-side routing
  "lucide-react": "^0.523.0",             // Modern icon library
  
  // Drag & Drop
  "@dnd-kit/core": "^6.3.1",              // Core drag-and-drop functionality
  "@dnd-kit/sortable": "^10.0.0",         // Sortable list components
  "@dnd-kit/utilities": "^3.2.2",         // DnD utility functions
  
  // Data Management
  "@supabase/supabase-js": "^2.50.0",     // Supabase client library
  "@tanstack/react-query": "^5.81.2",     // Server state management
  
  // Visualization
  "chart.js": "^4.5.0",                   // Chart rendering
  "recharts": "^2.15.3",                  // React chart components
  
  // UI Components
  "react-toastify": "^11.0.5",            // Toast notifications
  "@radix-ui/react-tabs": "^1.1.12",      // Accessible tab components
  
  // PDF Generation
  "html2canvas": "^1.4.1",                // HTML to canvas conversion
  "jspdf": "^3.0.1",                      // PDF generation
  
  // Date Management
  "moment": "^2.30.1",                    // Date parsing and formatting
  "react-big-calendar": "^1.19.4"         // Calendar component
}
```

#### Custom Hooks (`/src/hooks/`)

**1. useActiveSession (`/src/hooks/useActiveSession.js`)**
- **Purpose**: Manages current workout session state
- **Dependencies**: `@tanstack/react-query`, Supabase
- **Key Features**:
  - Queries `training_sessions` table for active sessions
  - Mutations for adding sets to current session
  - Real-time session updates with React Query cache invalidation
  - Automatic user authentication checking

**2. useWorkoutSessions (`/src/hooks/useWorkoutSessions.js`)**  
- **Purpose**: CRUD operations for workout session history
- **Dependencies**: Supabase, TrainingStateContext
- **Key Features**:
  - Fetches session history with associated `workout_sets`
  - Creates new workout sessions with mesocycle tracking
  - Updates session status and completion data
  - Integrates with current mesocycle week from context

**3. useWeeklyVolume (`/src/hooks/useWeeklyVolume.js`)**
- **Purpose**: Tracks and analyzes training volume by muscle group
- **Database Table**: `weekly_volume`
- **Key Features**:
  - Queries weekly volume by muscle group and user
  - Calculates volume trends and progression
  - Supports volume-based deload recommendations

**4. useExercises (`/src/hooks/useExercises.js`)**
- **Purpose**: Exercise database management
- **Key Features**:
  - Maintains exercise library with muscle group mappings
  - Provides exercise selection for workout logging
  - Supports custom exercise creation and modification

**5. useQuickActions (`/src/hooks/useQuickActions.js`)**
- **Purpose**: Dashboard quick action functionality
- **Key Features**:
  - Start new workout sessions
  - Quick exercise logging
  - Navigation shortcuts to key application areas

**6. useLogSet (`/src/hooks/useLogSet.js`)**
- **Purpose**: Individual set logging with RIR tracking
- **Key Features**:
  - Logs sets to `workout_sets` table
  - Automatic volume calculation (weight × reps)
  - RIR (Reps in Reserve) integration for autoregulation

### Database Schema & Supabase Integration

#### Core Tables

**1. `training_sessions`**
```sql
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_name TEXT,
  mesocycle_week INTEGER,
  planned_exercises JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2. `workout_sets`**
```sql
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES training_sessions(id),
  exercise_name TEXT NOT NULL,
  muscle_group TEXT,
  weight DECIMAL,
  reps INTEGER,
  rir DECIMAL,                           -- Reps in Reserve for autoregulation
  set_number INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id)
);
```

**3. `weekly_volume`**
```sql
CREATE TABLE weekly_volume (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  muscle TEXT NOT NULL,
  volume DECIMAL NOT NULL,
  week INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**4. `rir_recommendations`**
```sql
CREATE TABLE rir_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  muscle TEXT NOT NULL,
  recommended_rir DECIMAL NOT NULL,
  confidence DECIMAL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Mutation Patterns

**Session Management:**
```javascript
// Create new session
const { data, error } = await supabase
  .from('training_sessions')
  .insert([{
    user_id: userId,
    session_name: sessionName,
    mesocycle_week: currentWeek,
    planned_exercises: exercises,
    started_at: new Date().toISOString(),
    status: 'active'
  }])
  .select()
  .single();

// Add set to session
const { data, error } = await supabase
  .from('workout_sets')
  .insert([{
    session_id: sessionId,
    exercise_name: exercise,
    muscle_group: muscleGroup,
    weight: weight,
    reps: reps,
    rir: rir,
    set_number: setNumber,
    user_id: userId
  }])
  .select()
  .single();
```

**Volume Tracking:**
```javascript
// Update weekly volume
const { data, error } = await supabase
  .from('weekly_volume')
  .upsert([{
    user_id: userId,
    muscle: muscleGroup,
    volume: totalVolume,
    week: currentWeek
  }], {
    onConflict: 'user_id,muscle,week'
  });
```

**RIR Recommendations:**
```javascript
// Fetch adaptive RIR suggestions
const { data, error } = await supabase
  .from('rir_recommendations')
  .select('*')
  .eq('muscle', muscleGroup)
  .order('confidence', { ascending: false })
  .limit(1)
  .single();
```

#### Real-Time Subscriptions

The application uses Supabase real-time subscriptions for live data updates:

```javascript
// Listen for session updates
const subscription = supabase
  .channel('training_sessions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'training_sessions',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Handle real-time session updates
    queryClient.invalidateQueries(['activeSession']);
  })
  .subscribe();
```

## Database Schema

The application expects the following Supabase tables/views:

### `workout_sessions`
- `id` (primary key)
- `start_time` (timestamp)
- `end_time` (timestamp, nullable)
- `notes` (text, nullable)

### `workout_sets` 
- `id` (primary key)
- `session_id` (foreign key to workout_sessions)
- `set_number` (integer)
- `exercise` (text)
- `weight` (numeric)
- `reps` (integer)
- `rir` (numeric, nullable - Reps in Reserve)

### `rir_recommendations`
- `muscle` (text)
- `recommended_rir` (numeric)
- `confidence` (numeric, 0-1 scale)

### `weekly_volume` 
- `muscle` (text)
- `volume` (numeric)
- `week` (integer)
- `user_id` (uuid, NOT NULL, default: auth.uid())

## 🧪 Testing & Quality Assurance

### Test Suite Overview
The application includes comprehensive testing across multiple layers:

- **Unit Tests**: Vitest for component and hook testing
- **E2E Tests**: Playwright for full application workflow testing  
- **Linting**: ESLint for code quality and consistency
- **Coverage**: Automated coverage reporting with actionable insights

### Running Tests Locally

```bash
# Unit tests (watch mode for development)
npm run test

# Unit tests with coverage report
npm run test:coverage

# E2E tests with Playwright
npm run test:e2e

# E2E tests in interactive mode
npm run test:e2e -- --ui

# Code linting
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

### Test Organization
```
__tests__/
├── components/          # Component unit tests
├── hooks/              # Custom hook tests  
├── helpers/            # Utility function tests
├── __mocks__/          # Test mocks and fixtures
└── e2e/               # Playwright E2E tests
```

### Continuous Integration
- **GitHub Actions**: Automated testing on every pull request
- **Build Verification**: Ensures code compiles successfully
- **Coverage Thresholds**: Maintains minimum test coverage standards
- **Cross-Browser Testing**: Validates functionality across different browsers

## 🔧 Development Tools & Configuration

### Vite Configuration
- **Fast HMR**: Hot module replacement for instant feedback
- **Build Optimization**: Production builds with code splitting
- **Asset Processing**: Automatic asset optimization and compression
- **Environment Variables**: Secure handling of sensitive configuration

### ESLint Setup
- **React Rules**: React-specific linting for best practices
- **Code Style**: Consistent formatting and structure enforcement
- **Import Organization**: Automatic import sorting and validation
- **Accessibility**: A11y linting for inclusive design

### VS Code Integration
Recommended extensions for optimal development experience:
- **ES7+ React/Redux/React-Native**: React snippets and autocomplete
- **Tailwind CSS IntelliSense**: CSS class suggestions and validation
- **ESLint**: Real-time linting feedback
- **Prettier**: Automatic code formatting
- **GitLens**: Enhanced Git integration and history

## 📊 Performance & Optimization

### Build Performance
- **Bundle Analysis**: Regular bundle size monitoring
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Dead code elimination for smaller bundles
- **Asset Optimization**: Image and asset compression

### Runtime Performance
- **React Profiling**: Performance monitoring with React DevTools
- **Memory Management**: Efficient component lifecycle management
- **Lazy Loading**: On-demand loading of heavy components
- **Caching Strategy**: Intelligent caching with React Query

### Mobile Optimization
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Touch Interactions**: Optimized touch targets and gestures
- **Performance Budget**: Strict performance constraints for mobile devices
- **Progressive Enhancement**: Core functionality works without JavaScript

## ⚠️ Troubleshooting

### Common Issues & Solutions

#### Installation Problems
- **Dependency conflicts**: Use `npm install --legacy-peer-deps` to resolve peer dependency issues
- **Node version**: Ensure Node.js 18+ is installed (`node --version`)
- **Cache issues**: Clear npm cache with `npm cache clean --force`
- **Permission errors**: Use `sudo` on Unix systems or run as administrator on Windows

#### Build & Development Issues
- **Build fails**: Verify environment variables are set in `.env` file
- **Port conflicts**: Change dev server port with `npm run dev -- --port 3000`
- **Hot reload not working**: Restart dev server and clear browser cache
- **TypeScript errors**: Run `npm run type-check` to identify type issues

#### Runtime Errors
- **White screen**: Check browser console for JavaScript errors
- **Charts not loading**: Verify Chart.js is properly installed and imported
- **Supabase connection**: Confirm environment variables and network connectivity
- **Input field visibility**: Update browser to latest version for CSS compatibility

#### Testing Issues
- **Tests failing**: Run `npm run test -- --verbose` for detailed error information
- **E2E test timeouts**: Increase timeout values in `playwright.config.js`
- **Coverage gaps**: Use `npm run test:coverage` to identify untested code
- **Mock issues**: Check `__mocks__` directory for proper mock implementations

### Performance Troubleshooting
- **Slow initial load**: Enable build optimization and check bundle size
- **Memory leaks**: Use React DevTools Profiler to identify component issues
- **Mobile performance**: Test on actual devices, not just browser dev tools
- **Network issues**: Implement proper loading states and error boundaries

### Browser Compatibility & Design System
- **Input styling issues**: The design system includes aggressive CSS overrides for browser autocomplete
  - Uses `--input-bg` CSS custom property for consistent red backgrounds
  - WebkitTextFillColor and WebkitBoxShadow properties for cross-browser support
  - Form elements automatically inherit design system styling via `.form-input` class
- **Design system compatibility**: CSS custom properties supported in all modern browsers
  - Fallback values provided for older browsers
  - Progressive enhancement ensures core functionality without design system
- **Dark theme integration**: All components use design system CSS variables
  - `var(--bg-primary)`, `var(--text-primary)` for consistent theming
  - No more hardcoded Tailwind classes for colors
- **Horizontal navigation**: Optimized for both desktop and mobile with design system buttons

### Design System Troubleshooting
- **Colors not updating**: Verify CSS custom properties are loaded in `src/styles/design-system.css`
- **Theme switching not working**: Check `useDesignSystem` hook implementation
- **Component styling issues**: Ensure components are using design system classes (`.form-input`, `.card`, `.button-primary`)
- **Build issues**: Verify design system CSS is imported in `src/styles/index.css`

## 📚 Additional Resources

### Documentation
- **Component Library**: See `/docs/components.md` for component documentation
- **API Reference**: Check `/docs/api.md` for backend integration details
- **Deployment Guide**: Follow `/docs/deployment.md` for production setup
- **Contributing**: Read `/docs/contributing.md` for development guidelines
- **Design System Guide**: See `DESIGN_SYSTEM_GUIDE.md` for complete design system usage
- **Design System Implementation**: Check `DESIGN_SYSTEM_COMPLETE.md` for implementation status

### Design System Files
- **`src/styles/design-system.css`**: Master stylesheet with CSS custom properties
- **`src/components/ui/DesignSystem.jsx`**: React component library
- **`src/config/designSystem.js`**: Configuration and theme switching
- **`src/hooks/useDesignSystem.js`**: Programmatic access to design tokens
- **`src/pages/ProgramWithDesignSystem.jsx`**: Example implementation of Program page with design system
- **`src/components/program/tabs/GoalsAndNeedsWithDesignSystem.jsx`**: Example tab component using design system

### Migration Examples
```jsx
// Before: Manual Tailwind classes
<input className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />

// After: Design system class
<input className="form-input" />

// Before: Manual button styling
<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">

// After: Design system component
<Button variant="primary">Save</Button>
```

### External Resources
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **Vite Guide**: [vitejs.dev](https://vitejs.dev)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Renaissance Periodization**: [renaissanceperiodization.com](https://renaissanceperiodization.com)

### Community & Support
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Discord Community**: Real-time chat and support
- **Email Support**: Contact maintainers for critical issues

---

**PowerHouse Tracker v3.0.0** - *7-Step Periodization with Centralized Design System*

Built with ❤️ using React 19, Vite 6, TailwindCSS, and CSS Custom Properties

**Key Features:**
- ✅ 7-Step Evidence-Based Periodization Methodology
- 🎨 Centralized Design System with CSS Custom Properties  
- 🔴 Global Color Control (Change once, applies everywhere)
- 📱 Cross-Browser Input Field Compatibility
- ⚡ Real-Time State Management with React Context
- 🚀 Modern Development Stack with Vite 6 and React 19

This architecture provides a robust foundation for comprehensive program design, centralized styling management, and evidence-based training methodology through the integration of modern web technologies and sports science principles.
