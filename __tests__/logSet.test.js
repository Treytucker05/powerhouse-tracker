/**
 * LogSet Algorithm Tests
 * Tests for Phase-4 set logging functionality
 */

import { vi as jest } from 'vitest';

// Mock the trainingState module
const mockTrainingState = {
  currentWorkout: null,
  workoutHistory: [],
  currentWeek: 1,
  currentMesocycle: 1,
  programVersion: '1.0',
  volumeLandmarks: {
    chest: { MV: 10, MRV: 20 },
    back: { MV: 12, MRV: 24 }
  }
};

// Mock the core module
jest.unstable_mockModule('../js/core/trainingState.js', () => ({
  default: mockTrainingState,
  saveState: jest.fn()
}));

// Import the modules after mocking
const { logSet } = await import('../js/algorithms/workout.js');

describe('LogSet Algorithm', () => {
  let mockSession;

  beforeEach(() => {
    // Reset mock state before each test
    mockTrainingState.currentWorkout = null;
    
    // Create a fresh mock session for each test
    mockSession = {
      id: 'test-workout-123',
      startTime: '2024-01-15T10:00:00Z',
      status: 'active',
      exercises: [],
      totalSets: 0,
      totalVolume: 0,
      sessionType: 'standard',
      muscleGroups: [],
      notes: '',
      metadata: {
        week: 1,
        mesocycle: 1,
        programVersion: '1.0'
      }
    };
  });

  describe('logSet validation', () => {
    test('should throw error when no session provided', () => {
      const setData = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2
      };

      expect(() => logSet(null, setData)).toThrow('No active workout session provided');
    });

    test('should throw error when session is not active', () => {
      mockSession.status = 'completed';
      const setData = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2
      };

      expect(() => logSet(mockSession, setData)).toThrow('Cannot log set - workout session is not active');
    });

    test('should throw error when setData is invalid', () => {
      expect(() => logSet(mockSession, null)).toThrow('Invalid set data provided');
      expect(() => logSet(mockSession, undefined)).toThrow('Invalid set data provided');
      expect(() => logSet(mockSession, 'string')).toThrow('Invalid set data provided');
    });

    test('should throw error when exercise name is missing', () => {
      const setData = { weight: 135, reps: 10, rir: 2 };
      expect(() => logSet(mockSession, setData)).toThrow('Exercise name is required');
      
      const setDataEmptyExercise = { exercise: '', weight: 135, reps: 10, rir: 2 };
      expect(() => logSet(mockSession, setDataEmptyExercise)).toThrow('Exercise name is required');
    });

    test('should throw error when weight is invalid', () => {
      const baseSetData = { exercise: 'Bench Press', reps: 10, rir: 2 };
      
      expect(() => logSet(mockSession, { ...baseSetData, weight: undefined })).toThrow('Valid weight is required');
      expect(() => logSet(mockSession, { ...baseSetData, weight: null })).toThrow('Valid weight is required');
      expect(() => logSet(mockSession, { ...baseSetData, weight: -5 })).toThrow('Valid weight is required');
    });

    test('should throw error when reps is invalid', () => {
      const baseSetData = { exercise: 'Bench Press', weight: 135, rir: 2 };
      
      expect(() => logSet(mockSession, { ...baseSetData, reps: undefined })).toThrow('Valid reps count is required');
      expect(() => logSet(mockSession, { ...baseSetData, reps: null })).toThrow('Valid reps count is required');
      expect(() => logSet(mockSession, { ...baseSetData, reps: -1 })).toThrow('Valid reps count is required');
    });

    test('should throw error when RIR is out of range', () => {
      const baseSetData = { exercise: 'Bench Press', weight: 135, reps: 10 };
      
      expect(() => logSet(mockSession, { ...baseSetData, rir: -1 })).toThrow('RIR must be between 0 and 10');
      expect(() => logSet(mockSession, { ...baseSetData, rir: 11 })).toThrow('RIR must be between 0 and 10');
    });

    test('should allow valid RIR values', () => {
      const baseSetData = { exercise: 'Bench Press', weight: 135, reps: 10 };
      
      expect(() => logSet(mockSession, { ...baseSetData, rir: 0 })).not.toThrow();
      expect(() => logSet(mockSession, { ...baseSetData, rir: 5 })).not.toThrow();
      expect(() => logSet(mockSession, { ...baseSetData, rir: 10 })).not.toThrow();
    });

    test('should allow undefined RIR', () => {
      const setData = { exercise: 'Bench Press', weight: 135, reps: 10 };
      expect(() => logSet(mockSession, setData)).not.toThrow();
    });
  });

  describe('logSet functionality', () => {
    test('should log first set for new exercise', () => {
      const setData = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2,
        notes: 'Good form'
      };

      const updatedSession = logSet(mockSession, setData);

      expect(updatedSession.exercises).toHaveLength(1);
      expect(updatedSession.exercises[0]).toMatchObject({
        name: 'Bench Press',
        totalSets: 1,
        totalVolume: 1350, // 135 * 10
        muscleGroups: ['chest', 'triceps']
      });

      const loggedSet = updatedSession.exercises[0].sets[0];
      expect(loggedSet).toMatchObject({
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2,
        notes: 'Good form',
        setNumber: 1
      });

      expect(loggedSet.id).toMatch(/^set_\d+_[a-z0-9]{4}$/);
      expect(loggedSet.timestamp).toBeDefined();
    });

    test('should add second set to existing exercise', () => {
      // Log first set
      const firstSet = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2
      };
      logSet(mockSession, firstSet);

      // Log second set
      const secondSet = {
        exercise: 'Bench Press',
        weight: 140,
        reps: 8,
        rir: 1
      };
      const updatedSession = logSet(mockSession, secondSet);

      expect(updatedSession.exercises).toHaveLength(1);
      expect(updatedSession.exercises[0].sets).toHaveLength(2);
      expect(updatedSession.exercises[0].totalSets).toBe(2);
      expect(updatedSession.exercises[0].totalVolume).toBe(2470); // (135*10) + (140*8)

      const loggedSet = updatedSession.exercises[0].sets[1];
      expect(loggedSet.setNumber).toBe(2);
      expect(loggedSet.weight).toBe(140);
      expect(loggedSet.reps).toBe(8);
    });

    test('should handle multiple exercises', () => {
      // Log bench press set
      const benchSet = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2
      };
      logSet(mockSession, benchSet);

      // Log squat set
      const squatSet = {
        exercise: 'Squat',
        weight: 185,
        reps: 8,
        rir: 3
      };
      const updatedSession = logSet(mockSession, squatSet);

      expect(updatedSession.exercises).toHaveLength(2);
      expect(updatedSession.exercises[0].name).toBe('Bench Press');
      expect(updatedSession.exercises[1].name).toBe('Squat');
      expect(updatedSession.exercises[1].muscleGroups).toEqual(['quadriceps', 'glutes']);
    });

    test('should update session totals correctly', () => {
      // Log multiple sets across exercises
      logSet(mockSession, { exercise: 'Bench Press', weight: 135, reps: 10, rir: 2 });
      logSet(mockSession, { exercise: 'Bench Press', weight: 140, reps: 8, rir: 1 });
      const updatedSession = logSet(mockSession, { exercise: 'Squat', weight: 185, reps: 8, rir: 3 });

      expect(updatedSession.totalSets).toBe(3);
      expect(updatedSession.totalVolume).toBe(3950); // (135*10) + (140*8) + (185*8)
      expect(updatedSession.muscleGroups).toEqual(expect.arrayContaining(['chest', 'triceps', 'quadriceps', 'glutes']));
    });

    test('should update trainingState.currentWorkout', () => {
      const setData = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: 2
      };

      const updatedSession = logSet(mockSession, setData);

      expect(mockTrainingState.currentWorkout).toBe(updatedSession);
    });

    test('should handle zero weight and reps', () => {
      const setData = {
        exercise: 'Bodyweight Exercise',
        weight: 0,
        reps: 0,
        rir: 5
      };

      const updatedSession = logSet(mockSession, setData);

      expect(updatedSession.exercises[0].totalVolume).toBe(0);
      expect(updatedSession.totalVolume).toBe(0);
    });

    test('should convert numeric strings to numbers', () => {
      const setData = {
        exercise: 'Bench Press',
        weight: '135',
        reps: '10',
        rir: '2',
        notes: 123 // Non-string notes should be converted
      };

      const updatedSession = logSet(mockSession, setData);
      const loggedSet = updatedSession.exercises[0].sets[0];

      expect(loggedSet.weight).toBe(135);
      expect(loggedSet.reps).toBe(10);
      expect(loggedSet.rir).toBe(2);
      expect(loggedSet.notes).toBe('123');
    });

    test('should handle null RIR', () => {
      const setData = {
        exercise: 'Bench Press',
        weight: 135,
        reps: 10,
        rir: null
      };

      const updatedSession = logSet(mockSession, setData);
      const loggedSet = updatedSession.exercises[0].sets[0];

      expect(loggedSet.rir).toBeNull();
    });

    test('should assign muscle groups based on exercise name', () => {
      const exercises = [
        { name: 'Pull-up', expected: ['back', 'biceps'] },
        { name: 'Deadlift', expected: ['back', 'glutes', 'hamstrings'] },
        { name: 'Shoulder Press', expected: ['shoulders', 'triceps'] },
        { name: 'Bicep Curl', expected: ['biceps'] },
        { name: 'Unknown Exercise', expected: ['other'] }
      ];

      exercises.forEach(({ name, expected }) => {
        const freshSession = { ...mockSession, exercises: [] };
        const updatedSession = logSet(freshSession, {
          exercise: name,
          weight: 100,
          reps: 10
        });

        expect(updatedSession.exercises[0].muscleGroups).toEqual(expected);
      });
    });
  });
});
