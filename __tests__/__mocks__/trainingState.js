import { vi } from 'vitest';

export const mockTrainingState = {
  getWeeklySets: vi.fn(() => 10),
  getTotalWeeklyVolume: vi.fn(() => 15000),
};

export function resetMockTrainingState () {
  mockTrainingState.getWeeklySets.mockReset();
  mockTrainingState.getTotalWeeklyVolume.mockReset();
  mockTrainingState.getWeeklySets.mockReturnValue(10);
  mockTrainingState.getTotalWeeklyVolume.mockReturnValue(15000);
}

export default mockTrainingState;
