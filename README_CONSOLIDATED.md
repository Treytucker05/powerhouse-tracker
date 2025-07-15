# PowerHouse Tracker v2.0.0

![Vitest](https://img.shields.io/badge/tests-passing-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-yellow)

A modern React-based training tracker with **complete program design system**, **professional dark theme**, and **cross-browser compatibility**.

## 🎯 Latest Features (v2.0.0)

### ✅ **Complete Program Design System**
- **Program Overview**: Assessment data collection with training model selection (Conjugate, Block Periodization, DUP, Linear)
- **Block Sequencing**: Drag-and-drop block ordering with duration controls (+/- weeks)
- **Loading Parameters**: Block-specific volume and intensity configuration
- **Training Methods**: Westside Barbell methodology with Training Focus Distribution (Max/Repeated/Dynamic Effort)
- **Program Preview**: Complete program generation, export, and implementation guidelines

### 🎨 **Professional PowerHouse Dark Theme**
- **Primary Colors**: PowerHouse red (#dc2626/#ef4444) with black/dark gray backgrounds
- **Horizontal Navigation**: Clean horizontal navigation bars with red gradient buttons
- **Cross-Browser Input Fields**: Aggressive CSS overrides for autocomplete visibility on light backgrounds
- **High Contrast Design**: Optimal readability with professional dark theme
- **Mobile Responsive**: Seamless experience across all device sizes with touch-optimized controls

### 🧠 **Enhanced Training Intelligence**
- **Modular Architecture**: Clean separation between 5 program components with horizontal navigation
- **State Management**: React Context with useReducer for centralized program state across tabs
- **Real-Time Updates**: Immediate feedback and validation throughout program creation workflow
- **Component Isolation**: Systematic debugging and error recovery systems with professional PowerHouse theme

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

## 🎯 Core Application Features

### Dashboard System
- **Training Status Overview**: Current week, phase, and progress tracking
- **Volume Tracking Charts**: Visual representation of weekly training volumes
- **Fatigue Recovery Indicators**: Real-time fatigue status with systemic tracking
- **Quick Actions Panel**: One-click access to common training functions
- **Upcoming Sessions Preview**: Calendar view of scheduled training sessions

### Program Design System (NEW v2.0.0)
- **Horizontal Tab Navigation**: Clean tab-based interface with red gradient buttons
  - 📋 **Overview**: Program details and assessment data collection
  - 🔄 **Block Sequencing**: Drag-and-drop timeline with duration controls  
  - ⚙️ **Loading Parameters**: Block-specific volume and intensity configuration
  - 💪 **Training Methods**: Westside Barbell methodology integration
  - 👁️ **Program Preview**: Generation and export functionality
- **PowerHouse Theme Integration**: Consistent red/black theme with professional appearance
- **Real-Time State Management**: Seamless tab switching with preserved program state
- **Cross-Platform Compatibility**: Responsive design optimized for desktop and mobile

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

### Program Design Workflow
The Program Design system features a horizontal navigation bar with 5 specialized tabs:

1. **📋 Overview Tab**: Set program basics and collect assessment data
   - Program Information: Name, primary goal (Strength/Hypertrophy/Power/Endurance), duration, training days
   - Assessment Data Integration: Pull from previous assessments for personalized recommendations
   - Training Model Selection: Choose from 4 evidence-based models:
     - **Conjugate Method**: High-frequency varied intensity with rotating exercises (Advanced)
     - **Block Periodization**: Sequential focused training blocks with specific adaptations (Intermediate-Advanced)
     - **Daily Undulating Periodization**: Varying intensity and volume within each week (Intermediate)
     - **Linear Periodization**: Progressive intensity increase with decreased volume (Beginner-Intermediate)

2. **🔄 Block Sequencing Tab**: Design your training timeline
   - Drag-and-Drop Interface: Reorder training blocks with visual feedback
   - Duration Controls: Adjust block length with +/- week buttons
   - Visual Timeline: See your complete program structure at a glance
   - Block Type Selection: Choose from accumulation, intensification, realization, and deload phases

3. **⚙️ Loading Parameters Tab**: Configure training variables
   - Block-Specific Settings: Customize volume and intensity for each training block
   - Progressive Overload Planning: Set systematic progression schemes
   - Volume Distribution: Configure weekly volume progression within blocks
   - Intensity Zones: Define training intensity ranges for each phase

4. **💪 Training Methods Tab**: Apply Westside Barbell methodology
   - Training Focus Distribution: Allocate percentages across three methods:
     - **Max Effort Method**: Heavy singles/doubles for absolute strength (90-100% 1RM)
     - **Repeated Effort Method**: Multiple reps to failure for hypertrophy (70-85% 1RM)  
     - **Dynamic Effort Method**: Speed work for power development (50-70% 1RM)
   - Method-Specific Parameters: Configure sets, reps, and intensity for each method
   - Exercise Selection: Choose exercises that match your selected training focus

5. **👁️ Program Preview Tab**: Generate and export your program
   - Complete Program Generation: Compile all inputs into comprehensive training program
   - Export Options: Save program in multiple formats (PDF, JSON, printable)
   - Implementation Guidelines: Receive detailed instructions for program execution
   - Program Validation: Check for potential issues before implementation

### Training Execution
1. **Start Session**: Begin workout from dashboard or logger
2. **Log Sets**: Record exercise, weight, reps, and RIR in real-time
3. **Track Progress**: Monitor volume, fatigue, and adaptation markers
4. **Analyze Performance**: Review session data and intelligence recommendations

## 🎨 User Interface Design

### PowerHouse Theme System
The application implements a professional dark theme with PowerHouse branding:

- **Primary Colors**: 
  - PowerHouse Red: `#dc2626` (primary actions, active states)
  - Red Variants: `#ef4444` (hover states), `#b91c1c` (pressed states)
  - Background: `#000000` (header), `#111827` (navigation), `#1f2937` (content areas)
  - Text: `#ffffff` (primary), `#9ca3af` (secondary), `#6b7280` (muted)

- **Navigation Design**:
  - **Horizontal Layout**: All navigation bars use horizontal orientation for optimal space usage
  - **Red Gradient Buttons**: Buttons feature gradient backgrounds with hover animations
  - **Sticky Positioning**: Navigation stays accessible while scrolling
  - **Mobile Responsive**: Collapsible hamburger menu for mobile devices

### Program Design Interface
The Program Design system features a distinctive interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Program Design                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ [📋 Overview] [🔄 Block Sequencing] [⚙️ Loading Parameters]         │
│ [💪 Training Methods] [👁️ Program Preview]                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Tab Content Area - Dark theme with professional styling            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Tab Navigation**: Horizontal red gradient buttons with icons and labels
- **Active State**: Bright red background with white text for selected tab
- **Hover Effects**: Subtle color transitions and shadow effects
- **Content Areas**: Dark gray backgrounds with high contrast text

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

### Program Design Navigation (Sub-System)
When in Program Design, users see a specialized horizontal tab interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Program Design                                    Complete Builder   │
├─────────────────────────────────────────────────────────────────────┤
│ [📋 Overview] [🔄 Block Sequencing] [⚙️ Loading Parameters]         │
│ [💪 Training Methods] [👁️ Program Preview]                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Program Design Tabs:**
1. **📋 Overview**: Program basics, assessment data, training model selection
2. **🔄 Block Sequencing**: Drag-and-drop timeline, duration controls
3. **⚙️ Loading Parameters**: Volume/intensity configuration per block  
4. **💪 Training Methods**: Westside Barbell focus distribution
5. **👁️ Program Preview**: Generation, export, implementation guidelines

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
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing with nested route support
- **React Context**: Global state management with useReducer pattern

### React Router Configuration

The application uses React Router v7 with nested routing structure defined in `/src/App.jsx`:

#### Main Routes
```jsx
<Routes>
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/" element={<AppShell />}>
    <Route index element={<Home />} />                    // Dashboard homepage
    <Route path="program" element={<Program />} />        // Program Design system  
    <Route path="assessment" element={<Assessment />} />   // Movement & strength assessment
    <Route path="tracking" element={<TrackingEnhanced />} /> // Workout logging interface
    <Route path="analytics" element={<Analytics />} />    // Performance analysis
    <Route path="exercises" element={<ExercisesPage />} /> // Exercise database
    <Route path="profile" element={<ProfilePage />} />    // User settings
    <Route path="resources" element={<ResourcesPage />} /> // Documentation & guides
    
    {/* Legacy route redirects - All redirect to /program */}
    <Route path="mesocycle" element={<MacrocycleRedirect />} />
    <Route path="microcycle" element={<MacrocycleRedirect />} />
    <Route path="macrocycle" element={<MacrocycleRedirect />} />
    <Route path="builder" element={<MacrocycleRedirect />} />
    
    {/* Program Design Builder with context provider */}
    <Route path="program-design" element={
      <MacrocycleBuilderProvider>
        <ContextAwareBuilder />
      </MacrocycleBuilderProvider>
    } />
  </Route>
</Routes>
```

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

**State Structure:**
```jsx
const initialState = {
  // UI State
  activeTab: 'overview',                    // Current Program Design tab
  selectedLevel: null,                      // Selected difficulty level
  isLoading: false,                        // Loading state
  error: null,                             // Error messages
  
  // Program Configuration
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
  
  // Training Model Selection
  selectedTrainingModel: '',              // Conjugate/Block/DUP/Linear
  
  // Block Sequencing (Drag-and-Drop)
  blockSequence: [
    {
      id: 'accumulation',
      name: 'Accumulation', 
      duration: 4,
      color: '#10B981',
      phase: 'accumulation',
      description: 'High volume phase for building work capacity'
    },
    // ... other blocks
  ],
  
  // Loading Parameters
  blockParameters: {
    accumulation: { loading: 60, movement: 'Bilateral', loadingResults: null },
    intensification: { loading: 75, movement: 'Unilateral', loadingResults: null },
    // ... other block configurations
  },
  
  // Training Methods & Energy Systems
  selectedTrainingMethod: '',             // Westside Barbell method
  methodSFR: '',                         // Stimulus-to-Fatigue Ratio
  selectedEnergySystem: '',              // Energy system focus
  
  // Generated Results
  loadingResults: null,                   // Calculated loading parameters
  generatedProgram: null                 // Final program output
};
```

**Reducer Actions:**
```jsx
export const PROGRAM_ACTIONS = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_PROGRAM_DATA: 'SET_PROGRAM_DATA',
  SET_ASSESSMENT_DATA: 'SET_ASSESSMENT_DATA',
  SET_TRAINING_MODEL: 'SET_TRAINING_MODEL',
  SET_BLOCK_SEQUENCE: 'SET_BLOCK_SEQUENCE',
  UPDATE_BLOCK_PARAMETER: 'UPDATE_BLOCK_PARAMETER',
  SET_LOADING_RESULTS: 'SET_LOADING_RESULTS',
  SET_GENERATED_PROGRAM: 'SET_GENERATED_PROGRAM',
  // ... other actions
};
```

**Action Creators:**
All actions are memoized with `useCallback` for performance:
- `setActiveTab(tab)`: Navigate between Program Design tabs
- `setProgramData(data)`: Update program configuration
- `setBlockSequence(sequence)`: Update drag-and-drop block order
- `updateBlockParameter(blockId, updates)`: Modify block-specific parameters
- `setGeneratedProgram(program)`: Store final program output

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

### Browser Compatibility
- **Input styling issues**: The Program Overview tab includes aggressive CSS overrides for browser autocomplete
  - Light background inputs with black text for maximum visibility
  - WebkitTextFillColor and WebkitBoxShadow inset properties for cross-browser support
  - Multiple fallback properties for Chrome, Safari, Firefox, and Edge compatibility
- **Dark theme problems**: All components use consistent TailwindCSS classes (gray-800/gray-700)
- **Drag-and-drop functionality**: Uses modern HTML5 drag API with @dnd-kit/core for enhanced compatibility
- **Horizontal navigation**: Optimized for both desktop and mobile with touch-friendly buttons

## 📚 Additional Resources

### Documentation
- **Component Library**: See `/docs/components.md` for component documentation
- **API Reference**: Check `/docs/api.md` for backend integration details
- **Deployment Guide**: Follow `/docs/deployment.md` for production setup
- **Contributing**: Read `/docs/contributing.md` for development guidelines

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

**PowerHouse Tracker v2.0.0** - *Complete Program Design System with Professional Dark Theme*

Built with ❤️ using React 19, Vite 6, and TailwindCSS

This architecture provides a robust foundation for real-time workout tracking, comprehensive program design, and intelligent training recommendations through the integration of React 19, modern state management, and Supabase's real-time capabilities.
