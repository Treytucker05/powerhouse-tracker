/**
 * @jest-environment jsdom
 */
+import { vi as jest } from 'vitest';

import { finishWorkout } from '../js/algorithms/workout.js';
import { finishWorkoutHandler } from '../js/ui/buttonHandlers.js';
import trainingState from '../js/core/trainingState.js';

describe('finishWorkout algorithm', () => {
  beforeEach(() => {
    trainingState.currentWorkout = {
      id: 'test-session',
      status: 'active',
      exercises: [],
      totalSets: 0,
      totalVolume: 0
    };
    trainingState.workoutHistory = [];
  });

  test('should move session to history and clear current', () => {
    const session = trainingState.currentWorkout;
    const result = finishWorkout();

    expect(result).toBe(session);
    expect(result.status).toBe('completed');
    expect(trainingState.workoutHistory).toContain(session);
    expect(trainingState.currentWorkout).toBeNull();
    expect(result.endTime).toBeDefined();
  });
});

describe('finishWorkoutHandler integration', () => {
  beforeEach(() => {
    trainingState.currentWorkout = {
      id: 'handler-session',
      status: 'active',
      exercises: []
    };
    trainingState.workoutHistory = [];
    window.dispatchEvent = vi.fn();
  });

  test('should dispatch workout-finished event and clear state', () => {
    finishWorkoutHandler();

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'workout-finished',
        detail: expect.objectContaining({ session: expect.any(Object) })
      })
    );
    expect(trainingState.currentWorkout).toBeNull();
    expect(trainingState.workoutHistory).toHaveLength(1);
  });
});
