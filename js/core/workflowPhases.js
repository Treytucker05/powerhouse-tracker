/**
 * RP Training Workflow Phases
 * Organizes 41+ actions into 7 progressive disclosure phases
 */

export const workflowPhases = [
  {
    id: 'foundation',
    title: '🏗️ Foundation Setup',
    cadence: 'One-time setup',
    level: 1, // Beginner+
    description: 'Essential setup and volume landmarks',
    buttons: [
      { 
        selector: '[onclick="saveLandmarks()"]',
        label: 'Save Volume Landmarks',
        primary: true
      },
      { 
        selector: '[onclick="applyVolumePreset(\'beginner\')"]',
        label: 'Beginner Preset'
      },
      { 
        selector: '[onclick="applyVolumePreset(\'intermediate\')"]',
        label: 'Intermediate Preset'
      },
      { 
        selector: '[onclick="applyVolumePreset(\'advanced\')"]',
        label: 'Advanced Preset'
      },
      { 
        selector: '[onclick="setupMeso()"]',
        label: 'Setup Mesocycle'
      }
    ]
  },
  
  {
    id: 'daily',
    title: '📝 Daily Training',
    cadence: 'During workouts',
    level: 1, // Beginner+
    description: 'Real-time workout feedback and logging',
    buttons: [
      { 
        selector: '[onclick="submitFeedback()"]',
        label: 'Process with RP Algorithms',
        primary: true
      },
      { 
        selector: '[onclick="resetWeeklyData()"]',
        label: 'Reset Week'
      },
      { 
        selector: '[onclick="exportSummary()"]',
        label: '📊 Export Chart'
      }
    ]
  },
  
  {
    id: 'weekly',
    title: '📊 Weekly Review',
    cadence: 'End of week',
    level: 1, // Beginner+
    description: 'Analyze progress and plan next week',
    buttons: [
      { 
        selector: '[onclick="analyzeDeload()"]',
        label: 'Analyze Deload Need',
        primary: true
      },
      { 
        selector: '[onclick="runAutoVolumeProgression()"]',
        label: '▶️ Run Weekly Auto-Progression'
      },
      { 
        selector: '[onclick="initializeAllMusclesAtMEV()"]',
        label: '🎯 Initialize at MEV'
      },
      { 
        selector: '[onclick="advanceToNextWeek()"]',
        label: '📅 Next Week'
      },
      { 
        selector: '[onclick="analyzeFrequency()"]',
        label: 'Optimize Frequency'
      }
    ]
  },
  
  {
    id: 'periodization',
    title: '🎯 Periodization',
    cadence: 'Block planning',
    level: 2, // Intermediate+
    description: 'RIR scheduling and load management',
    buttons: [
      { 
        selector: '[onclick="showRIRSchedule()"]',
        label: 'Show RIR Schedule',
        primary: true
      },
      { 
        selector: '[onclick="runWeeklyLoadAdjustments()"]',
        label: 'Process Weekly Adjustments'
      },
      { 
        selector: '[onclick="showNextWeekLoadProgression()"]',
        label: 'Show Load Progression'
      }
    ]
  },
  
  {
    id: 'live',
    title: '🔴 Live Training',
    cadence: 'During sets',
    level: 2, // Intermediate+
    description: 'Real-time performance monitoring',
    buttons: [
      { 
        selector: '[onclick="startLiveSession()"]',
        label: '🎮 Start Live Session',
        primary: true
      },
      { 
        selector: '[onclick="logTrainingSet()"]',
        label: '📊 Log Set'
      },
      { 
        selector: '[onclick="endLiveSession()"]',
        label: '⏹️ End Session'
      }
    ]
  },
  
  {
    id: 'intelligence',
    title: '🧠 AI Intelligence',
    cadence: 'As needed',
    level: 3, // Advanced
    description: 'Machine learning insights and optimization',
    buttons: [
      { 
        selector: '[onclick="initializeIntelligence()"]',
        label: '🚀 Initialize Intelligence',
        primary: true
      },
      { 
        selector: '[onclick="getWeeklyIntelligence()"]',
        label: '📈 Weekly Intelligence Report'
      },
      { 
        selector: '[onclick="getOptimalExercises()"]',
        label: '💡 Smart Exercise Selection'
      },
      { 
        selector: '[onclick="assessTrainingRisk()"]',
        label: '⚠️ Risk Assessment'
      },
      { 
        selector: '[onclick="optimizeVolumeLandmarks()"]',
        label: '🎯 Optimize Volume Landmarks'
      },
      { 
        selector: '[onclick="predictDeloadTiming()"]',
        label: '🔮 Predict Deload Timing'
      },
      { 
        selector: '[onclick="detectPlateaus()"]',
        label: '📈 Plateau Analysis'
      },
      { 
        selector: '[onclick="getAdaptiveRIR()"]',
        label: '🎛️ Adaptive RIR Recommendations'
      }
    ]
  },
  
  {
    id: 'advanced',
    title: '⚙️ Advanced Tools',
    cadence: 'Power users',
    level: 3, // Advanced
    description: 'Program generation, analytics, and system management',
    buttons: [
      { 
        selector: '[onclick="generateWeeklyProgram()"]',
        label: '📋 Generate Weekly Program',
        primary: true
      },
      { 
        selector: '[onclick="performanceManager.initialize()"]',
        label: '🚀 Initialize Monitoring'
      },
      { 
        selector: '[onclick="performanceManager.generateReport()"]',
        label: '📊 Performance Report'
      },
      { 
        selector: '[onclick="performanceManager.optimizeApp()"]',
        label: '⚙️ Optimize App'
      },
      { 
        selector: '[onclick="performanceManager.clearCache()"]',
        label: '🧹 Clear Cache'
      },
      { 
        selector: '[onclick="dataExportManager.exportAllData()"]',
        label: '📤 Export All Data'
      },
      { 
        selector: '[onclick="dataExportManager.createBackup()"]',
        label: '💾 Create Backup'
      },
      { 
        selector: '[onclick="dataExportManager.importData()"]',
        label: '📥 Import Data'
      },
      { 
        selector: '[onclick="dataExportManager.scheduleAutoBackup()"]',
        label: '⏰ Auto Backup'
      },
      { 
        selector: '[onclick="userFeedbackManager.initializeFeedbackSystem()"]',
        label: '🎯 Initialize Feedback'
      },
      { 
        selector: '[onclick="userFeedbackManager.showFeedbackForm()"]',
        label: '💭 Submit Feedback'
      },
      { 
        selector: '[onclick="userFeedbackManager.viewAnalytics()"]',
        label: '📊 View Analytics'
      },
      { 
        selector: '[onclick="userFeedbackManager.exportFeedbackData()"]',
        label: '📤 Export Feedback'
      }
    ]
  }
];

export default workflowPhases;
