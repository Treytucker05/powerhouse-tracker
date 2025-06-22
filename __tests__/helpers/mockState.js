export const snapshot = {};

export function resetMockTrainingState() {
  // Reset function for compatibility
}

export function makeTrainingState() {
  return {
    currentMesocycle: 1,
    weeklyProgram: [],
    logs: [],
    backups: [],
    options: { autoBackup: true, backupFrequencyDays: 7 },
    getWeeklySets: () => 0,
    getTotalWeeklyVolume: () => 0,
    settings: { autoBackup: true },
    lastBackup: null
  };
}

export const mockTrainingState = {
  currentMesocycle: 1,
  weeklyProgram:   [],
  logs:            [],
  backups:         [],
  options: { autoBackup: true, backupFrequencyDays: 7 },
  getWeeklySets: () => 0,
  getTotalWeeklyVolume: () => 0,
  settings: { autoBackup: true },
  lastBackup: null
};

export default {
  getWeeklySets: () => 0,
  getTotalWeeklyVolume: () => 0,
  settings: { autoBackup: true },
  lastBackup: null,
  currentMesocycle: 1,
  weeklyProgram: [],
  logs: [],
  backups: [],
  options: { autoBackup: true, backupFrequencyDays: 7 }
};
