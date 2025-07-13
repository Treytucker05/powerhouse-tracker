# 🤖 Auto-Volume Progression System Demo

## Quick Start Guide

### 1. Initialize Your Program

1. Open the application in your browser (http://localhost:8080)
2. Navigate to **"Weekly Planning"** section
3. Click **"🎯 Initialize at MEV"** to set all muscles to starting volumes

### 2. Run Auto-Progression

1. Click **"▶️ Run Weekly Auto-Progression"**
2. Watch as the system:
   - Generates realistic feedback for each muscle
   - Applies progression logic (+0, +1, or +2 sets)
   - Shows detailed results
   - Updates the volume chart

### 3. Continue Progression

1. Click **"📅 Next Week"** to advance the training cycle
2. Repeat auto-progression for subsequent weeks
3. System will automatically trigger deload when needed

## Expected Results

### Week 1-2: Initial Growth

- Most muscles: MEV → MEV+2 (aggressive start)
- Reason: "Starting from MEV - aggressive progression"

### Week 3-4: Steady Progress

- Most muscles: +1 set increments
- Reason: "Good recovery with adequate stimulus"

### Week 5-6: Approaching Limits

- Some muscles: +0 sets (holding volume)
- Reason: "At MRV - holding volume" or "High fatigue detected"

### Week 6-8: Deload Trigger

- System detects: "Most muscles at MRV"
- Auto-initiates: Deload phase (50% of MEV)
- Result: 🛑 "Deload phase initiated"

## Technical Features Demonstrated

✅ **Automated set progression** - No manual intervention required
✅ **Volume-adaptive feedback** - Higher volumes = more fatigue
✅ **Deload detection** - Automatic when conditions met  
✅ **Visual progression tracking** - Chart updates in real-time
✅ **Renaissance Periodization compliance** - Uses RP algorithms

## System Architecture

```
User Input (Weekly Feedback)
    ↓
Auto-Progression Algorithm (volume.js)
    ↓
Training State Updates (trainingState.js)
    ↓
UI Display & Chart Updates (globals.js)
```

This system eliminates the need for manual volume adjustments while maintaining the scientific rigor of Renaissance Periodization methodology.
