export const snapshot = {};

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
  options: { autoBackup: true, backupFrequencyDays: 7 }
};

export function resetMockTrainingState () {
  mockTrainingState.currentMesocycle = 1;
  mockTrainingState.weeklyProgram    = [];
  mockTrainingState.logs             = [];
  mockTrainingState.backups          = [];
}
