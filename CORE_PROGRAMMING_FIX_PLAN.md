# Core Programming Fix Plan

## Issues Identified & Solutions

### 1. Schedule System
**Problems:**
- Routing issues in tests (useLocation errors)
- Inconsistent lift order handling
- Frequency selection not properly integrated

**Fixes:**
- Fix BuilderProgress component router dependency
- Consolidate schedule helper functions
- Improve lift order validation

### 2. Warm-up System
**Current State:** Basic implementation exists in `warmup.js`
**Issues:**
- Not properly integrated with main workout flow
- Missing customization options
- Needs better scheme validation

**Fixes:**
- Enhanced warm-up protocol integration
- Better percentage validation
- Custom warm-up builder

### 3. Programming Approach
**Current State:** Basic cards in Step3ScheduleWarmup
**Issues:**
- Leader/Anchor not fully implemented
- 5s PRO integration incomplete
- Competition prep placeholder

**Fixes:**
- Complete Leader/Anchor cycle logic
- Integrate 5s PRO main set modifications
- Enhanced programming approach validation

### 4. Supplemental Work
**Current State:** FSL, SSL, BBB, 5s PRO options exist
**Issues:**
- Calculation inconsistencies
- Template integration gaps
- Volume progression missing

**Fixes:**
- Unified supplemental calculation engine
- Template-specific supplemental rules
- Progressive volume schemes

### 5. Assistance Work
**Current State:** Basic categories and equipment mapping
**Issues:**
- Template integration incomplete
- Exercise recommendation engine basic
- Volume/intensity guidance missing

**Fixes:**
- Smart assistance recommendations
- Template-specific assistance protocols
- Equipment-based exercise filtering

### 6. Core Scheme (AMRAP/Main Sets)
**Current State:** Basic AMRAP flagging in compute531.js
**Issues:**
- 5s PRO not properly disabling AMRAP
- Rep scheme validation incomplete
- PR tracking integration missing

**Fixes:**
- Enhanced main set calculation
- Proper 5s PRO integration
- Rep scheme validation engine

### 7. Conditioning
**Current State:** Basic structure in conditioningPlanner.js
**Issues:**
- Not integrated with main program
- Template-specific conditioning missing
- Recovery consideration gaps

**Fixes:**
- Template-aware conditioning protocols
- Recovery integration
- Progressive conditioning schemes

## Implementation Priority

1. **Core Scheme & AMRAP** - Foundation for all calculations
2. **Programming Approach** - Affects all other systems
3. **Supplemental Integration** - Major training component
4. **Schedule System** - User experience critical
5. **Warm-up Integration** - Session structure
6. **Assistance Work** - Volume completion
7. **Conditioning** - Optional but valuable

## Files to Focus On

1. `compute531.js` - Core calculation engine
2. `Step3ScheduleWarmup.jsx` - Main configuration UI
3. `warmup.js` - Warm-up protocols
4. `conditioningPlanner.js` - Conditioning integration
5. Step components for proper routing
6. Template integration files

## Success Criteria

- All tests passing
- Core programming calculations working correctly
- User interface responsive and intuitive
- Template integration seamless
- Progressive overload logic sound
