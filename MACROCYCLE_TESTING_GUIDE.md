# Macrocycle Testing & Validation Guide

## 🧪 **Testing Setup Complete**

The MacrocycleNew.jsx component has been enhanced with comprehensive debugging and testing capabilities. Here's how to execute the tests:

## 📋 **Files Created:**

1. **MACROCYCLE_TEST_SCENARIOS.js** - Test data and scenarios
2. **MACROCYCLE_TEST_RUNNER.js** - Automated test execution
3. **Enhanced MacrocycleNew.jsx** - Added comprehensive debugging

## 🚀 **How to Execute Tests:**

### **Method 1: Browser Console (Recommended)**

1. **Start the development server:**
   ```bash
   cd tracker-ui-good/tracker-ui
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to the macrocycle page:**
   ```
   http://localhost:5173/macrocycle
   ```

3. **Open browser console and look for debug logs:**
   - 🔍 [Component Mount] - Entry point detection
   - 🔍 [Program Data Processing] - Input validation  
   - 🔍 [Mesocycle Generation Start] - Algorithm execution
   - 🔍 [RP Compliance Check] - Research validation

4. **Run automated tests:**
   ```javascript
   // In browser console:
   const testRunner = new MacrocycleTestRunner();
   testRunner.runAllTests();
   ```

### **Method 2: Manual Testing Scenarios**

#### **Test 1: Entry Point from Program Design**
```javascript
// Simulate navigation with program data
const testData = {
  programData: {
    goal: 'hypertrophy',
    duration: 12,
    trainingAge: 'beginner',
    availableDays: 3,
    name: 'Beginner Test Program',
    startDate: '2024-01-01',
    recoveryScore: 'poor'
  }
};

// Navigate to macrocycle with state
history.pushState(testData, '', '/macrocycle');
```

#### **Test 2: Template Switching**
1. Load the macrocycle page
2. Use the red dropdown to switch between templates:
   - 12-Week Hypertrophy Focus
   - 16-Week Strength Cycle  
   - 20-Week Powerbuilding
3. Monitor console for recalculation logs

#### **Test 3: RP Research Compliance**
1. Expand timeline cards
2. Verify in console logs:
   - RIR progression starts at 4.0 RIR
   - Volume landmarks use 2024-25 values
   - Phase durations respect RP constraints
   - Deload recommendations trigger correctly

## 🔬 **What the Debug Logs Show:**

### **Component Mount Logs:**
```javascript
🔍 [Component Mount] {
  entryPoint: "Program Design Navigation" | "Direct Navigation",
  locationState: {...},
  pathname: "/macrocycle"
}
```

### **Program Data Processing:**
```javascript
🔍 [Program Data Processing] {
  receivedFromNavigation: true/false,
  finalProgramData: {...},
  usedDefaults: true/false
}
```

### **Mesocycle Generation:**
```javascript
🔍 [Mesocycle Generation Start] {
  template: "hypertrophy_12",
  programGoals: {...},
  templateData: {...}
}

🔍 [Processing Block 1] {
  blockType: "accumulation",
  originalDuration: 4,
  focus: "accumulation"
}

🔍 [Phase Duration Calculation] {
  blockType: "accumulation",
  originalDuration: 4,
  dynamicDuration: 6,
  trainingAge: "beginner",
  goal: "hypertrophy",
  recoveryScore: "poor"
}

🔍 [Volume Progression Calculations] {
  phaseDuration: 6,
  trainingAge: "beginner",
  chestLandmarks: { mev: 6, mrv: 24, mav: 16 },
  chestProgression: [6, 8, 12, 16, 20, 24]
}

🔍 [RIR Progression Calculations] {
  phaseDuration: 6,
  exerciseType: "compound",
  rirProgression: [
    { week: 1, targetRIR: 4.5, intensity: "70-75%" },
    { week: 2, targetRIR: 3.5, intensity: "72-77%" },
    ...
  ],
  startsAt: 4.5,
  endsAt: 0.5
}
```

### **RP Compliance Checks:**
```javascript
🔍 [RP Compliance Check] {
  volumeLandmarks: true,
  rirProgression: true,
  phaseDurations: true,
  warnings: [...]
}
```

## ✅ **Expected Test Results:**

### **Beginner Hypertrophy (12 weeks):**
- **Phases:** 3-4 phases
- **Volume Multiplier:** 0.8x (beginner gets 80% volume)
- **RIR Start:** 4.0 RIR
- **Duration Warnings:** None for standard phases

### **Advanced Strength (16 weeks):**
- **Phases:** 4-5 phases  
- **Volume Multiplier:** 1.2x (advanced gets 120% volume)
- **RIR Start:** 4.0 RIR
- **Duration Warnings:** May extend phases due to advanced recovery

### **Intermediate Powerbuilding (20 weeks):**
- **Phases:** 5-6 phases
- **Volume Multiplier:** 1.0x (baseline volume)
- **RIR Start:** 4.0 RIR
- **Duration Warnings:** Balanced progression

## 🚨 **Common Issues to Watch For:**

### **Volume Landmark Errors:**
```javascript
❌ BAD: { mev: 4.5, mrv: 30, mav: 20 } // Wrong 2024-25 values
✅ GOOD: { mev: 6, mrv: 24, mav: 16 }  // Correct 2024-25 values
```

### **RIR Progression Errors:**
```javascript
❌ BAD: targetRIR: 4.5 // Old starting point
✅ GOOD: targetRIR: 4.0 // 2024-25 research starts at 4.0
```

### **Phase Duration Errors:**
```javascript
❌ BAD: accumulation: 15 weeks // Exceeds RP max of 12
✅ GOOD: accumulation: 6 weeks  // Within RP constraints
```

## 📊 **Performance Benchmarks:**

- **Mesocycle Generation:** < 200ms
- **Template Switching:** < 100ms  
- **Phase Validation:** < 50ms
- **Console Log Overhead:** < 10ms per log

## 🔧 **Debugging Tips:**

1. **Enable Debug Mode:** Set `DEBUG_MODE = true` in MacrocycleNew.jsx
2. **Filter Console Logs:** Search for "🔍" to see only debug logs
3. **Performance Timing:** Look for generation times in logs
4. **Validation Warnings:** Yellow console warnings show RP deviations

## 🎯 **Success Criteria:**

✅ **Entry Point 1:** Program data flows correctly from navigation  
✅ **Entry Point 2:** Default values load when no navigation data  
✅ **Template Switching:** Real-time recalculation under 100ms  
✅ **RP Compliance:** All calculations use 2024-25 research  
✅ **Phase Validation:** Warnings appear for extreme values  
✅ **Performance:** Generation times under 200ms  

## 🚀 **Next Steps:**

After testing, you can:
1. **Disable Debug Mode:** Set `DEBUG_MODE = false` for production
2. **Add Database Integration:** Replace TODO comments with Supabase
3. **Enhance UI Controls:** Add phase duration editing interface
4. **Implement Export:** Add calendar and PDF export features

## 📞 **Support:**

If tests fail or show unexpected results:
1. Check console for error messages
2. Verify RP constants are properly imported
3. Ensure template data structure matches expectations
4. Validate program data format from navigation

**Testing is now ready! 🧪✨**
