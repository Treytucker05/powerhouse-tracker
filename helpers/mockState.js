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
