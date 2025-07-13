export const snapshot = {};

export function resetMockTrainingState() {
  // Reset function for compatibility
}

export default {
  getWeeklySets: () => 0,
  getTotalWeeklyVolume: () => 0,
  settings: { autoBackup: true },
  lastBackup: null,
  currentMesocycle: 1,
  weeklyProgram: [],
  logs: [],
  backups: [],
  options: { autoBackup: true, backupFrequencyDays: 7 },
  workoutHistory: [],
};
