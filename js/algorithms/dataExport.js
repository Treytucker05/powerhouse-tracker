/**
 * Data Management and Export Utilities
 * Handles data export, backup, and import functionality
 */

import trainingState from "../core/trainingState.js";
import { debugLog } from "../utils/debug.js";

/**
 * Export all training data as JSON
 * @param {Object} state - Training state object
 * @returns {Object} - Export summary
 */
export function exportAllData(state = trainingState) {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: "1.0.0",
      dataType: "powerhouse-training-data"
    },
    trainingState: {
      ...state,
      // Remove any circular references or non-serializable data
      currentWorkout: state.currentWorkout ? { ...state.currentWorkout } : null
    }
  };

  // Create downloadable file
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `powerhouse-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  debugLog("Data exported", { size: dataStr.length });
  
  return {
    exported: true,
    filename: link.download,
    size: dataStr.length,
    timestamp: exportData.metadata.exportDate
  };
}

/**
 * Export current chart as image
 * @returns {Object} - Export summary
 */
export function exportChart() {
  try {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) {
      throw new Error('Chart canvas not found');
    }
    
    // Convert canvas to image and download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `volume-chart-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
    
    debugLog("Chart exported");
    
    return {
      exported: true,
      filename: link.download,
      format: 'PNG',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Chart export failed:', error);
    throw error;
  }
}

/**
 * Create backup in Supabase (if available)
 * @param {Object} state - Training state object  
 * @returns {Object} - Backup summary
 */
export function createBackup(state = trainingState) {
  const backup = {
    id: `backup-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: exportAllData(state),
    uploaded: false
  };
  
  // For now, just save locally (Supabase integration would go here)
  const backups = JSON.parse(localStorage.getItem('powerhouse-backups') || '[]');
  backups.push(backup);
  
  // Keep only last 10 backups
  if (backups.length > 10) {
    backups.splice(0, backups.length - 10);
  }
  
  localStorage.setItem('powerhouse-backups', JSON.stringify(backups));
  
  debugLog("Backup created", backup);
  
  return {
    created: true,
    backupId: backup.id,
    timestamp: backup.timestamp,
    location: 'localStorage'
  };
}

/**
 * Toggle auto-backup functionality
 * @param {boolean} enabled - Enable/disable auto backup
 * @param {Object} state - Training state object
 * @returns {Object} - Auto-backup status
 */
export function autoBackup(enabled = true, state = trainingState) {
  state.autoBackupEnabled = enabled;
  
  if (enabled) {
    // Set up daily backup (simplified - would use proper scheduling)
    state.nextAutoBackup = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Create immediate backup
    const backup = createBackup(state);
    
    return {
      enabled: true,
      nextBackup: state.nextAutoBackup,
      lastBackup: backup.timestamp
    };
  } else {
    state.nextAutoBackup = null;
    return {
      enabled: false,
      nextBackup: null
    };
  }
}

/**
 * Import training data from JSON file
 * @param {File} file - JSON file to import
 * @param {Object} state - Training state object
 * @returns {Promise<Object>} - Import summary
 */
export function importData(file, state = trainingState) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (!importData.metadata || importData.metadata.dataType !== 'powerhouse-training-data') {
          throw new Error('Invalid data format');
        }
        
        // Merge imported data with current state (simplified)
        const mergeResult = {
          merged: true,
          conflicts: [],
          imported: {
            workouts: importData.trainingState.workoutHistory?.length || 0,
            progressionHistory: importData.trainingState.weeklyProgressionHistory?.length || 0,
            landmarks: Object.keys(importData.trainingState.volumeLandmarks || {}).length
          }
        };
        
        // Merge workout history
        if (importData.trainingState.workoutHistory) {
          state.workoutHistory = state.workoutHistory || [];
          state.workoutHistory.push(...importData.trainingState.workoutHistory);
        }
        
        // Merge progression history
        if (importData.trainingState.weeklyProgressionHistory) {
          state.weeklyProgressionHistory = state.weeklyProgressionHistory || [];
          state.weeklyProgressionHistory.push(...importData.trainingState.weeklyProgressionHistory);
        }
        
        // Import landmarks if current ones are empty
        if (importData.trainingState.volumeLandmarks && 
            (!state.volumeLandmarks || Object.keys(state.volumeLandmarks).length === 0)) {
          state.volumeLandmarks = importData.trainingState.volumeLandmarks;
        }
        
        debugLog("Data imported", mergeResult);
        resolve(mergeResult);
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
}

/**
 * Export feedback and session notes as CSV
 * @param {Object} state - Training state object
 * @returns {Object} - Export summary
 */
export function exportFeedback(state = trainingState) {
  const workoutHistory = state.workoutHistory || [];
  
  // Prepare CSV data
  const csvData = [
    ['Date', 'Exercise', 'Sets', 'Reps', 'Weight', 'RIR', 'RPE', 'Volume', 'Notes']
  ];
  
  workoutHistory.forEach(workout => {
    const date = new Date(workout.startTime).toLocaleDateString();
    
    workout.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        const rpe = set.rir !== null ? (10 - set.rir) : '';
        csvData.push([
          date,
          exercise.name || 'Unknown',
          exercise.sets?.length || 0,
          set.reps || '',
          set.weight || '',
          set.rir || '',
          rpe,
          set.weight * set.reps || '',
          workout.notes || ''
        ]);
      });
    });
  });
  
  // Convert to CSV string
  const csvString = csvData.map(row => 
    row.map(cell => 
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(',')
  ).join('\n');
  
  // Download CSV
  const blob = new Blob([csvString], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `powerhouse-feedback-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  debugLog("Feedback exported", { rows: csvData.length });
  
  return {
    exported: true,
    filename: link.download,
    rows: csvData.length - 1, // Exclude header
    format: 'CSV'
  };
}
