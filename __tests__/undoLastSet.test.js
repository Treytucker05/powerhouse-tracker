/**
 * @jest-environment jsdom */

import { vi as jest } from 'vitest';

import { undoLastSet } from '../js/algorithms/workout.js';
import { undoLastSetHandler } from '../js/ui/buttonHandlers.js';
import trainingState from '../js/core/trainingState.js';

describe('UndoLastSet Algorithm', () => {
  let mockSession;
  
  beforeEach(() => {
    // Create a fresh mock session with some sets
    mockSession = {
      id: 'test-session',
      startTime: '2024-01-15T10:00:00Z',
      status: 'active',
      totalSets: 3,
      totalVolume: 3770,
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            {
              id: 'set_1',
              timestamp: '2024-01-15T10:05:00Z',
              exercise: 'Bench Press',
              weight: 135,
              reps: 10,
              rir: 2,
              notes: 'First set',
              setNumber: 1
            },
            {
              id: 'set_2', 
              timestamp: '2024-01-15T10:08:00Z',
              exercise: 'Bench Press',
              weight: 140,
              reps: 8,
              rir: 1,
              notes: 'Second set',
              setNumber: 2
            }
          ],
          totalSets: 2,
          totalVolume: 2470,
          muscleGroups: ['chest', 'triceps']
        },
        {
          name: 'Squat',
          sets: [
            {
              id: 'set_3',
              timestamp: '2024-01-15T10:15:00Z',
              exercise: 'Squat',
              weight: 185,
              reps: 8,
              rir: 3,
              notes: 'Third set',
              setNumber: 1
            }
          ],
          totalSets: 1,
          totalVolume: 1480,
          muscleGroups: ['quadriceps', 'glutes']
        }
      ],
      muscleGroups: ['chest', 'triceps', 'quadriceps', 'glutes']
    };
    
    // Reset training state
    trainingState.currentWorkout = null;
  });

  describe('undoLastSet validation', () => {
    test('should throw error when no session provided', () => {
      expect(() => undoLastSet(null)).toThrow('No workout session provided');
    });

    test('should throw error when session is not active', () => {
      mockSession.status = 'completed';
      expect(() => undoLastSet(mockSession)).toThrow('Cannot undo set - workout session is not active');
    });

    test('should throw error when no exercises in session', () => {
      mockSession.exercises = [];
      expect(() => undoLastSet(mockSession)).toThrow('No exercises found in current session');
    });

    test('should throw error when no sets found', () => {
      mockSession.exercises = [
        {
          name: 'Empty Exercise',
          sets: [],
          totalSets: 0,
          totalVolume: 0
        }
      ];
      expect(() => undoLastSet(mockSession)).toThrow('No sets found to undo');
    });
  });

  describe('undoLastSet functionality', () => {
    test('should remove the most recent set by timestamp', () => {
      const result = undoLastSet(mockSession);
      const { session: updatedSession, removedSet } = result;
      
      // Should remove the Squat set (most recent timestamp)
      expect(removedSet.exercise).toBe('Squat');
      expect(removedSet.timestamp).toBe('2024-01-15T10:15:00Z');
      
      // Should have removed the entire Squat exercise since it had only one set
      expect(updatedSession.exercises).toHaveLength(1);
      expect(updatedSession.exercises[0].name).toBe('Bench Press');
      
      // Should update session totals
      expect(updatedSession.totalSets).toBe(2);
      expect(updatedSession.totalVolume).toBe(2470);
    });

    test('should update set numbers after removing a set from middle', () => {
      // Add another set to Bench Press with earlier timestamp than Squat
      mockSession.exercises[0].sets.push({
        id: 'set_4',
        timestamp: '2024-01-15T10:12:00Z', // Between bench sets and squat
        exercise: 'Bench Press',
        weight: 142,
        reps: 7,
        rir: 0,
        notes: 'Third bench set',
        setNumber: 3
      });
      mockSession.exercises[0].totalSets = 3;
      mockSession.exercises[0].totalVolume += (142 * 7);
      mockSession.totalSets = 4;
      mockSession.totalVolume += (142 * 7);
      
      const result = undoLastSet(mockSession);
      const { session: updatedSession, removedSet } = result;
      
      // Should still remove the Squat set (most recent)
      expect(removedSet.exercise).toBe('Squat');
      
      // Bench Press should still have 3 sets with correct numbering
      const benchPress = updatedSession.exercises.find(ex => ex.name === 'Bench Press');
      expect(benchPress.sets).toHaveLength(3);
      expect(benchPress.sets[0].setNumber).toBe(1);
      expect(benchPress.sets[1].setNumber).toBe(2);
      expect(benchPress.sets[2].setNumber).toBe(3);
    });

    test('should remove exercise entirely when last set is undone', () => {
      // Start with session that has only one set for Squat
      const singleSetSession = {
        ...mockSession,
        exercises: [
          {
            name: 'Squat',
            sets: [
              {
                id: 'set_1',
                timestamp: '2024-01-15T10:15:00Z',
                exercise: 'Squat',
                weight: 185,
                reps: 8,
                rir: 3,
                setNumber: 1
              }
            ],
            totalSets: 1,
            totalVolume: 1480,
            muscleGroups: ['quadriceps', 'glutes']
          }
        ],
        totalSets: 1,
        totalVolume: 1480
      };
      
      const result = undoLastSet(singleSetSession);
      const { session: updatedSession } = result;
      
      // Should have no exercises left
      expect(updatedSession.exercises).toHaveLength(0);
      expect(updatedSession.totalSets).toBe(0);
      expect(updatedSession.totalVolume).toBe(0);
      expect(updatedSession.muscleGroups).toEqual([]);
    });

    test('should update muscle groups correctly after removing exercise', () => {
      const result = undoLastSet(mockSession);
      const { session: updatedSession } = result;
      
      // Should only have chest and triceps from Bench Press
      expect(updatedSession.muscleGroups).toEqual(expect.arrayContaining(['chest', 'triceps']));
      expect(updatedSession.muscleGroups).not.toContain('quadriceps');
      expect(updatedSession.muscleGroups).not.toContain('glutes');
    });

    test('should update trainingState.currentWorkout', () => {
      trainingState.currentWorkout = mockSession;
      
      const result = undoLastSet(mockSession);
      const { session: updatedSession } = result;
      
      expect(trainingState.currentWorkout).toBe(updatedSession);
    });

    test('should handle undo with null RIR values', () => {
      mockSession.exercises[1].sets[0].rir = null;
      
      const result = undoLastSet(mockSession);
      const { removedSet } = result;
      
      expect(removedSet.rir).toBeNull();
    });
  });

  describe('edge cases', () => {
    test('should handle multiple exercises with same timestamp', () => {
      // Make timestamps identical
      const sameTimestamp = '2024-01-15T10:15:00Z';
      mockSession.exercises[0].sets[1].timestamp = sameTimestamp;
      mockSession.exercises[1].sets[0].timestamp = sameTimestamp;
      
      const result = undoLastSet(mockSession);
      
      // Should still work and remove one of them
      expect(result.removedSet).toBeDefined();
      expect(result.session.totalSets).toBe(2);
    });

    test('should handle exercise with zero weight and reps', () => {
      mockSession.exercises.push({
        name: 'Bodyweight Exercise',
        sets: [
          {
            id: 'set_bodyweight',
            timestamp: '2024-01-15T10:20:00Z', // Most recent
            exercise: 'Bodyweight Exercise',
            weight: 0,
            reps: 0,
            rir: 5,
            setNumber: 1
          }
        ],
        totalSets: 1,
        totalVolume: 0,
        muscleGroups: ['core']
      });
      mockSession.totalSets = 4;
      mockSession.muscleGroups.push('core');
      
      const result = undoLastSet(mockSession);
      const { removedSet } = result;
      
      expect(removedSet.exercise).toBe('Bodyweight Exercise');
      expect(removedSet.weight).toBe(0);
      expect(removedSet.reps).toBe(0);
    });
  });
});

describe('UndoLastSet Handler Integration', () => {
  let mockWorkout;
    beforeEach(() => {
    // Mock DOM events
    global.window = Object.create(window);
    const mockDispatchEvent = vi.fn();
    global.window.dispatchEvent = mockDispatchEvent;
    window.dispatchEvent = mockDispatchEvent;
    
    // Create mock workout with sets
    mockWorkout = {
      id: 'test-workout',
      status: 'active',
      exercises: [
        {
          name: 'Test Exercise',
          sets: [
            {
              id: 'test-set',
              timestamp: '2024-01-15T10:00:00Z',
              exercise: 'Test Exercise',
              weight: 100,
              reps: 10,
              rir: 2,
              setNumber: 1
            }
          ],
          totalSets: 1,
          totalVolume: 1000,
          muscleGroups: ['test']
        }
      ],
      totalSets: 1,
      totalVolume: 1000,
      muscleGroups: ['test']
    };
    
    // Reset training state
    trainingState.currentWorkout = null;
      // Mock console methods
    const mockConsoleLog = vi.fn();
    const mockConsoleError = vi.fn();
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
  });

  test('should handle successful undo operation', () => {
    trainingState.currentWorkout = mockWorkout;
    
    undoLastSetHandler();
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'set-undone',
        detail: expect.objectContaining({
          removedSet: expect.objectContaining({
            exercise: 'Test Exercise',
            weight: 100,
            reps: 10
          }),
          sessionStats: expect.objectContaining({
            totalSets: 0,
            totalVolume: 0,
            exercisesWorked: 0
          })
        })
      })
    );
    
    expect(console.log).toHaveBeenCalledWith(
      'Set undone successfully:', 
      expect.objectContaining({
        exercise: 'Test Exercise'
      })
    );
  });

  test('should handle no active workout session', () => {
    trainingState.currentWorkout = null;
    
    undoLastSetHandler();
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'undo-set-failed',
        detail: {
          error: 'No active workout session. Please start a workout first.'
        }
      })
    );
    
    expect(console.error).toHaveBeenCalledWith('No active workout session');
  });

  test('should handle inactive workout session', () => {
    mockWorkout.status = 'completed';
    trainingState.currentWorkout = mockWorkout;
    
    undoLastSetHandler();
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'undo-set-failed',
        detail: {
          error: 'No active workout session. Please start a workout first.'
        }
      })
    );
  });

  test('should handle undo operation failure', () => {
    // Create workout with no sets
    mockWorkout.exercises = [];
    trainingState.currentWorkout = mockWorkout;
    
    undoLastSetHandler();
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'undo-set-failed',
        detail: {
          error: 'No exercises found in current session'
        }
      })
    );
    
    expect(console.error).toHaveBeenCalledWith(
      'Failed to undo set:', 
      'No exercises found in current session'
    );
  });

  test('should be exposed on window object', async () => {
    expect(typeof undoLastSetHandler).toBe('function');

    // Test if handler is properly exposed
    const mod = await import('../js/ui/buttonHandlers.js');
    const importedHandler = mod.undoLastSetHandler;
    expect(typeof importedHandler).toBe('function');
  });
});
