# GitHub Copilot Instructions for PowerHouse Tracker

## Project Overview
PowerHouse Tracker v3.0.0 is a modern React-based training tracker with a complete program design system, centralized design system, 7-step periodization methodology, and cross-browser compatibility. It implements evidence-based training methodologies including Renaissance Periodization (RP), 5/3/1, Linear Periodization, and more.

## Critical: Active App Location
⚠️ **IMPORTANT**: Only `tracker-ui-good/tracker-ui` is the live/active application. All other folders are legacy code and should be ignored. Root scripts proxy to the active app.

## Project Structure

### Core Directories
- **`tracker-ui-good/tracker-ui/`** - Active React application (React 19 + Vite 6)
  - `src/pages/StreamlinedProgram.jsx` - Main 8-step program design workflow
  - `src/components/program/tabs/` - Individual step components
  - `src/components/` - Centralized design system components
  - `src/context/` - React Context providers for state management
- **`js/`** - ES modules for algorithms and core state
  - `js/algorithms/` - Training system algorithms (5/3/1, RP, etc.)
  - `js/utils/goalBasedSelector.js` - 7 training goals with system compatibility
  - `js/ui/globals.js` - Browser globals for legacy code integration
  - `js/ui/additionalHandlers.js` - Additional UI event handlers
- **Entry Points**
  - `main.js` - Legacy entry point
  - `index.js` - Node.js exports
  - Bundler: Vite 6

### Legacy Directories (DO NOT MODIFY)
- `src/`, `fitness-tracker/`, `tracker-ui/` - Legacy code, ignored by ESLint/Prettier/CI

## Development Commands

### Installation
```bash
npm install  # Install all dependencies
```

### Development
```bash
npm run dev        # Start development server (proxies to tracker-ui-good/tracker-ui)
npm start          # Alias for npm run dev
```

### Testing
```bash
npm run test       # Run all tests in active app
npm run test:ci    # Run tests in CI mode with coverage
npm run test:unit  # Execute Vitest test suite with coverage
npm run test:e2e   # Execute Playwright end-to-end tests
npm run verify     # Build, test, and lint in one command
```

### Build and Lint
```bash
npm run build      # Build production bundle
npm run lint       # Run ESLint on active app
npm run prepush    # Pre-push checks (lint + test:ci)
```

## Code Style and Conventions

### JavaScript/React Style
- **ES6 modules** with named exports
- Use **semicolons** and **double quotes** for strings
- Prefer **functional helpers** over large classes
- Use **React Hooks** (no class components in new code)
- Follow **modern React patterns** (hooks-based state management)

### Button Handler Mapping
- Handlers live in `js/ui/globals.js` and `js/ui/additionalHandlers.js`
- Buttons follow the `btnActionName` naming convention
- Event delegation in `js/app.js` maps button IDs to handlers

### Component Architecture
- Use **React Context** with `useReducer` for state management
- **Centralized design system components**: Card, FormInput, Button, Grid
- All styling uses **CSS custom properties** for consistency
- Components in `tracker-ui-good/tracker-ui/src/components/`

## Design System

### Colors (CSS Custom Properties)
- **Primary Red**: `--color-primary` (#dc2626), `--color-primary-hover` (#ef4444)
- **Background**: Dark theme with `--color-bg-card`, `--color-bg-input`
- **Text**: `--color-text`, `--color-text-secondary`, `--color-text-muted`
- **Set It and Forget It**: Change one CSS variable to update ALL components

### Form Inputs
- All form inputs use **red backgrounds** (`--color-bg-input: #dc2626`)
- Proper **contrast ratios** for accessibility
- **Aggressive CSS overrides** for cross-browser autocomplete visibility
- Use `FormInput` component from design system

### Theme
- **PowerHouse Dark Theme** with consistent branding
- **Mobile responsive** with touch-optimized controls
- High contrast design for readability

## Training Methodologies

### Renaissance Periodization (RP)
- Uses volume landmarks: **MV** (Maintenance Volume), **MEV** (Minimum Effective Volume), **MAV** (Maximum Adaptive Volume), **MRV** (Maximum Recoverable Volume)
- **Auto-progression** adjusts sets week to week based on feedback
- **Deloads** triggered when MRV breached or fatigue accumulates

### 5/3/1 System
- Complete Wendler system implementation
- Percentage calculator for 1RM-based loading
- Assistance work: BBB, FSL, and other templates
- Deload protocols for fatigue management

### Training Goals
Seven supported goals with system compatibility:
1. Strength
2. Power
3. Hypertrophy
4. Endurance
5. Fat Loss
6. Athletic Performance
7. General Fitness

## Key Features

### 8-Step Program Design Workflow
1. Goals & Needs Assessment
2. Timeline Selection (Macrocycle Structure)
3. Injury Screening (10 structured questions with algorithmic processing)
4. Phase Design
5. Mesocycle Planning
6. Microcycle Design
7. Session Planning
8. Monitoring & Implementation

### Injury Screening System
- **10 structured questions** with radio/checkbox responses
- **Multi-injury algorithm** handles compound safety protocols
- **Injury-Exercise Matrix** maps injuries to exercise modifications
- **Progressive Return Protocol** with 4-phase system
- **Real-time algorithm results** for volume multipliers, intensity caps
- **Exercise modifications**: ROM restrictions, load limits, tempo adjustments

### Timeline System
- **Mesocycles**: 2-8 weeks for short training blocks
- **Macrocycles Medium**: 8-24 weeks for standard periodization
- **Macrocycles Long-term**: 6 months to 2 years for advanced planning
- **Custom durations**: User-defined flexibility

## Feature Flags

### Method Packs
Method packs are **ON by default**. Use kill-switch to disable:
- **Vite**: `VITE_USE_METHOD_PACKS=false`
- **CRA**: `REACT_APP_USE_METHOD_PACKS=false`

## State Management

### Context Providers
- `ProgramContext` - Main program state management
- Uses `useReducer` for complex state updates
- Actions include:
  - `UPDATE_TIMELINE` - Timeline/macrocycle changes
  - `UPDATE_INJURY_SCREEN` - Injury screening data updates
  - Standard CRUD operations for program data

### Data Flow
- Props flow from Context providers to child components
- State updates via dispatch actions
- Real-time validation and feedback
- Component isolation for systematic debugging

## Documentation

### Key Documentation Files
- `README.md` - Main project documentation
- `AGENTS.md` - Agent-specific guidelines (this file's source)
- `CURRENT_STATUS_UPDATE_AUGUST_2025.md` - Latest comprehensive status
- `MASTER_DEVELOPMENT_PLAN.md` - Long-term development roadmap
- `FIVETHREEONE_IMPLEMENTATION_COMPLETE.md` - 5/3/1 algorithm docs
- `GOAL_FIRST_IMPLEMENTATION_COMPLETE.md` - Goal-based system docs

### Documentation Archive
- `docs/archive/` - Completed implementations and old planning files

## Testing Guidelines

### Unit Tests
- Use **Vitest** for unit testing
- Tests located in `__tests__` directories
- Coverage reports generated automatically
- Focus on algorithm correctness and component behavior

### E2E Tests
- Use **Playwright** for end-to-end testing
- Tests in `tests/` directory
- Simulate real user workflows
- Verify cross-browser compatibility

### Test Coverage
- Maintain high coverage for core algorithms
- Test edge cases in training calculations
- Verify injury screening logic
- Validate state management flows

## Best Practices

### When Adding New Features
1. Follow existing component structure in `tracker-ui-good/tracker-ui/src/components/`
2. Use design system components (Card, FormInput, Button, Grid)
3. Leverage CSS custom properties for styling
4. Add tests for new algorithms and complex logic
5. Update context providers if new state is needed
6. Maintain consistency with 8-step workflow

### When Fixing Bugs
1. Only modify code in `tracker-ui-good/tracker-ui/` (active app)
2. Do not touch legacy directories
3. Verify fixes don't break existing tests
4. Consider cross-browser compatibility
5. Maintain design system consistency

### When Refactoring
1. Preserve existing functionality
2. Use modern React patterns (hooks over classes)
3. Extract reusable components to design system
4. Update tests to match refactored code
5. Document significant architectural changes

## Common Pitfalls to Avoid

1. **Do not modify legacy directories** - Only work in `tracker-ui-good/tracker-ui/`
2. **Do not add inline styles** - Use CSS custom properties and design system
3. **Do not use class components** - Use functional components with hooks
4. **Do not bypass context providers** - Follow established state management patterns
5. **Do not ignore cross-browser compatibility** - Test in multiple browsers
6. **Do not add dependencies lightly** - Prefer existing libraries and patterns

## Additional Resources

- Main README: Comprehensive project overview
- AGENTS.md: Detailed agent guidelines (source for this file)
- package.json: Scripts and dependencies
- Component documentation: See individual component files in `src/components/`
