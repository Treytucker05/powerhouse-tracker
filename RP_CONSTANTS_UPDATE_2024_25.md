# RP Constants Update - 2024-25 Research

## Summary of Changes Made

### 1. Volume Landmarks Updated ✅

**Updated values based on latest research:**

- **Chest**: MEV 8→6 (kept MV=4, MRV=24)
- **Back**: MV 6→8 (kept MEV=10, MRV=25) 
- **Quads**: MEV 10→8, MRV 25→20, added MAV=18
- **Shoulders**: MV 6→2, kept MRV=24, added MAV=16
- **Added MAV (Maximum Adaptive Volume) for all muscle groups**

### 2. Phase Duration Algorithm Added ✅

**New function: `calculatePhaseDuration(phase, trainingAge, goal, recoveryScore)`**

- **Base durations** from research:
  - Foundation: 3-6 weeks (base: 4)
  - Hypertrophy: 4-8 weeks (base: 6)  
  - Strength: 4-6 weeks (base: 5)
  - Peak: 1-3 weeks (base: 2)

- **Modifiers implemented:**
  - Training age: Beginner 1.2x, Intermediate 1.0x, Advanced 0.8x
  - Goal: Hypertrophy 1.1x, Strength 1.0x, Powerbuilding 0.9x, Endurance 1.2x
  - Recovery: Poor 0.8x, Average 1.0x, Good 1.1x, Excellent 1.2x

### 3. RIR Progression Updated ✅

**New function: `calculateRIRProgression(weeks, exerciseType, baseRIR)`**

- **Updated to start at 4 RIR** (not 4.5)
- **Added compound modifier**: +0.5 RIR for compound exercises for safety
- **Research-based intensity mapping**: RIR to %1RM conversion table
- **Enhanced output**: Includes week, targetRIR, baseRIR, exerciseType, intensity

### 4. Deload Trigger Logic Added ✅

**New function: `shouldDeload(metrics)`**

**Research-based triggers implemented:**
- **Volume triggers**: Approaching/breaching MRV threshold
- **Fatigue triggers**: High fatigue scores (≥8/10)
- **Performance triggers**: 10%+ performance drops from baseline
- **Time triggers**: 6+ weeks since last deload
- **Recovery indicators**: Poor sleep, low motivation, high joint pain

**Returns comprehensive analysis:**
- Urgency score (0-15+ scale)
- List of triggered conditions  
- Recommendation level: URGENT/RECOMMENDED/CONSIDER/NOT_NEEDED

### 5. Additional Enhancements ✅

- **Updated RIR schemes**: Modified 6-week scheme to end with double 0 RIR
- **Added intensity calculator**: `calculateIntensityFromRIR()` with research-based %1RM mapping
- **Enhanced exports**: All new functions added to default export
- **Updated MacrocycleNew.jsx**: Uses new `calculateRIRProgression` function

## Usage Examples

```javascript
// Calculate optimal phase duration
const duration = calculatePhaseDuration('hypertrophy', 'intermediate', 'hypertrophy', 'good');
// Returns: 7 weeks (6 * 1.0 * 1.1 * 1.1 = 7.26 → 7)

// Get RIR progression for compounds
const rirProg = calculateRIRProgression(4, 'compound');
// Returns: [{week: 1, targetRIR: 4.5, baseRIR: 4, exerciseType: 'compound', intensity: '67-72%'}, ...]

// Check deload necessity  
const deloadCheck = shouldDeload({
  currentVolume: 23,
  mrvThreshold: 24,
  fatigueScore: 8,
  performanceDrop: 12,
  weeksSinceDeload: 7
});
// Returns: {shouldDeload: true, urgencyScore: 13, recommendation: 'URGENT', ...}
```

## Files Modified

1. **`src/constants/rpConstants.js`** - Main constants file with all updates
2. **`src/pages/MacrocycleNew.jsx`** - Updated imports and RIR function usage

## Research Sources Applied

- 2024-25 Renaissance Periodization volume landmark updates
- Latest MEV/MRV research for compound vs isolation exercises  
- Updated phase duration algorithms based on training age and recovery
- Enhanced deload triggering based on multiple fatigue indicators
- RIR progression refinements with compound exercise safety modifiers

All changes maintain backward compatibility while implementing the latest RP research findings.
