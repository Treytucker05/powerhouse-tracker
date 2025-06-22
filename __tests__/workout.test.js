/**
 * Workout Algorithm Tests
 * Tests for Phase-4 workout session management
 */

import { vi } from 'vitest';

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
  saveState: vi.fn()
}));

// Import the modules after mocking
const { startWorkout, validateWorkoutStart, getCurrentWorkout, getWorkoutStats } = await import('../js/algorithms/workout.js');

describe('Workout Algorithm', () => {
  beforeEach(() => {
    // Reset mock state before each test
    mockTrainingState.currentWorkout = null;
    mockTrainingState.workoutHistory = [];
    mockTrainingState.currentWeek = 1;
    mockTrainingState.volumeLandmarks = {
      chest: { MV: 10, MRV: 20 },
      back: { MV: 12, MRV: 24 }
    };
  });

  describe('startWorkout', () => {
    test('should create a new workout session with default timestamp', () => {
      const result = startWorkout();
      
      expect(result).toMatchObject({
        id: expect.stringMatching(/^workout_\d{4}-\d{2}-\d{2}_\d{6}_[a-z0-9]{4}$/),
        startTime: expect.any(String),
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
      });
      
      expect(mockTrainingState.currentWorkout).toBe(result);
    });

    test('should create workout session with custom timestamp', () => {
      const customTime = new Date('2024-01-15T10:30:00Z');
      const result = startWorkout(customTime);
      
      expect(result.startTime).toBe('2024-01-15T10:30:00.000Z');
      expect(result.metadata.week).toBe(1);
    });

    test('should handle string timestamp', () => {
      const timeString = '2024-01-15T10:30:00Z';
      const result = startWorkout(timeString);
      
      expect(result.startTime).toBe(timeString);
    });

    test('should use current training state values', () => {
      mockTrainingState.currentWeek = 5;
      mockTrainingState.currentMesocycle = 2;
      mockTrainingState.programVersion = '2.1';
      
      const result = startWorkout();
      
      expect(result.metadata).toEqual({
        week: 5,
        mesocycle: 2,
        programVersion: '2.1'
      });
    });
  });

  describe('validateWorkoutStart', () => {
    test('should return valid when no active workout and landmarks configured', () => {
      const result = validateWorkoutStart();
      
      expect(result).toEqual({
        isValid: true,
        reason: 'Ready to start workout'
      });
    });

    test('should return invalid when active workout exists', () => {
      mockTrainingState.currentWorkout = {
        id: 'test-workout',
        status: 'active'
      };
      
      const result = validateWorkoutStart();
      
      expect(result).toEqual({
        isValid: false,
        reason: 'Another workout session is already active. Please end the current session first.'
      });
    });

    test('should return invalid when volume landmarks not configured', () => {
      mockTrainingState.volumeLandmarks = {};
      
      const result = validateWorkoutStart();
      
      expect(result).toEqual({
        isValid: false,
        reason: 'Volume landmarks not configured. Please complete Phase 1 setup first.'
      });
    });

    test('should return invalid when volume landmarks is null', () => {
      mockTrainingState.volumeLandmarks = null;
      
      const result = validateWorkoutStart();
      
      expect(result).toEqual({
        isValid: false,
        reason: 'Volume landmarks not configured. Please complete Phase 1 setup first.'
      });
    });
  });

  describe('getCurrentWorkout', () => {
    test('should return current workout when exists', () => {
      const mockWorkout = { id: 'test-workout', status: 'active' };
      mockTrainingState.currentWorkout = mockWorkout;
      
      const result = getCurrentWorkout();
      
      expect(result).toBe(mockWorkout);
    });

    test('should return null when no current workout', () => {
      mockTrainingState.currentWorkout = null;
      
      const result = getCurrentWorkout();
      
      expect(result).toBeNull();
    });
  });

  describe('getWorkoutStats', () => {
    test('should return default stats when no workout provided and no current workout', () => {
      const result = getWorkoutStats();
      
      expect(result).toEqual({
        duration: 0,
        setsCompleted: 0,
        totalVolume: 0,
        averageRIR: 0,
        musclesWorked: []
      });
    });

    test('should calculate stats for provided workout', () => {
      const mockWorkout = {
        startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        totalSets: 12,
        totalVolume: 2400,
        muscleGroups: ['chest', 'triceps'],
        exercises: [
          {
            sets: [
              { rir: 2 },
              { rir: 1 },
              { rir: 0 }
            ]
          },
          {
            sets: [
              { rir: 3 },
              { rir: 2 }
            ]
          }
        ]
      };
      
      const result = getWorkoutStats(mockWorkout);
      
      expect(result.duration).toBeGreaterThan(25); // Should be around 30 minutes
      expect(result.setsCompleted).toBe(12);
      expect(result.totalVolume).toBe(2400);
      expect(result.averageRIR).toBe(1.6); // (2+1+0+3+2)/5 = 1.6
      expect(result.musclesWorked).toEqual(['chest', 'triceps']);
    });

    test('should use current workout when no workout provided', () => {
      const mockWorkout = {
        startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        totalSets: 6,
        totalVolume: 1200,
        muscleGroups: ['back'],
        exercises: []
      };
      
      mockTrainingState.currentWorkout = mockWorkout;
      
      const result = getWorkoutStats();
      
      expect(result.duration).toBeGreaterThan(10);
      expect(result.setsCompleted).toBe(6);
      expect(result.totalVolume).toBe(1200);
      expect(result.averageRIR).toBe(0); // No sets with RIR data
      expect(result.musclesWorked).toEqual(['back']);
    });

    test('should handle workout with no exercises', () => {
      const mockWorkout = {
        startTime: new Date().toISOString(),
        totalSets: 0,
        totalVolume: 0,
        muscleGroups: [],
        exercises: []
      };
      
      const result = getWorkoutStats(mockWorkout);
      
      expect(result.averageRIR).toBe(0);
      expect(result.musclesWorked).toEqual([]);
    });
  });
});
