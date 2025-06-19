/**
 * @jest-environment jsdom
 */

import { autoProgressWeeklyVolume } from '../js/algorithms/effort.js';
import '../main.js';

describe('Weekly Auto Progression', () => {
  beforeAll(() => {
    // Set up DOM for button test
    document.body.innerHTML = `
      <button id="btnRunWeeklyAutoProgression">Run Weekly Auto Progression</button>
    `;
  });

  describe('autoProgressWeeklyVolume algorithm', () => {
    test('should progress muscles below MEV rapidly', () => {
      const weeklyVolume = { Chest: 6 }; // Below MEV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 2;

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(6);
      expect(result.progressions.Chest.newVolume).toBe(8); // Should reach MEV
      expect(result.progressions.Chest.progression).toBe(2);
      expect(result.progressions.Chest.reasoning).toContain("Below MEV");
    });

    test('should progress muscles at MEV with standard progression', () => {
      const weeklyVolume = { Chest: 8 }; // At MEV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 2;

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(8);
      expect(result.progressions.Chest.newVolume).toBe(10);
      expect(result.progressions.Chest.progression).toBe(2);
      expect(result.progressions.Chest.reasoning).toContain("standard weekly progression");
    });

    test('should progress muscles between MEV-MAV moderately', () => {
      const weeklyVolume = { Chest: 12 }; // Between MEV and MAV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 2;

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(12);
      expect(result.progressions.Chest.newVolume).toBe(14);
      expect(result.progressions.Chest.progression).toBe(2);
      expect(result.progressions.Chest.reasoning).toContain("RIR-based progression");
    });

    test('should progress muscles between MAV-MRV conservatively', () => {
      const weeklyVolume = { Chest: 18 }; // Between MAV and MRV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 3; // High RIR allows progression

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(18);
      expect(result.progressions.Chest.newVolume).toBe(19);
      expect(result.progressions.Chest.progression).toBe(1);
      expect(result.progressions.Chest.reasoning).toContain("conservative progression");
    });

    test('should maintain muscles at MRV with high fatigue', () => {
      const weeklyVolume = { Chest: 22 }; // At MRV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 1.5; // Low RIR indicates fatigue

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(22);
      expect(result.progressions.Chest.newVolume).toBe(22);
      expect(result.progressions.Chest.progression).toBe(0);
      expect(result.progressions.Chest.reasoning).toContain("maintain maximum volume");
    });

    test('should reduce volume when at MRV with very low RIR', () => {
      const weeklyVolume = { Chest: 22 }; // At MRV
      const landmarks = { Chest: { MEV: 8, MAV: 16, MRV: 22 } };
      const targetRIR = 0.5; // Very low RIR indicates high fatigue

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.progressions.Chest.currentVolume).toBe(22);
      expect(result.progressions.Chest.newVolume).toBe(21);
      expect(result.progressions.Chest.progression).toBe(-1);
      expect(result.progressions.Chest.reasoning).toContain("slight reduction for recovery");
    });    test('should handle multiple muscle groups correctly', () => {
      const weeklyVolume = { 
        Chest: 6,    // Below MEV
        Back: 12,    // MEV-MAV range
        Shoulders: 20 // MAV-MRV range
      };
      const landmarks = { 
        Chest: { MEV: 8, MAV: 16, MRV: 22 },
        Back: { MEV: 10, MAV: 18, MRV: 26 },
        Shoulders: { MEV: 6, MAV: 14, MRV: 20 }
      };
      const targetRIR = 2;

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.summary.totalMuscles).toBe(3);
      // Chest: below MEV -> progression
      // Back: MEV-MAV range -> progression  
      // Shoulders: MAV-MRV range with targetRIR 2 -> should maintain (no progression)
      expect(result.summary.progressedMuscles).toBe(2);
      expect(result.summary.maintainedMuscles).toBe(1);
      expect(result.progressions.Chest.progression).toBe(2); // Rapid progression to MEV
      expect(result.progressions.Back.progression).toBe(2); // Standard progression
      expect(result.progressions.Shoulders.progression).toBe(0); // At high volume, maintain
    });

    test('should include summary statistics', () => {
      const weeklyVolume = { 
        Chest: 8,    // Standard progression
        Back: 22     // At MRV, maintain
      };
      const landmarks = { 
        Chest: { MEV: 8, MAV: 16, MRV: 22 },
        Back: { MEV: 10, MAV: 18, MRV: 22 }
      };
      const targetRIR = 2;

      const result = autoProgressWeeklyVolume(weeklyVolume, landmarks, targetRIR);

      expect(result.summary.totalMuscles).toBe(2);
      expect(result.summary.progressedMuscles).toBe(1);
      expect(result.summary.maintainedMuscles).toBe(1);
      expect(result.summary.reducedMuscles).toBe(0);
      expect(result.summary.recommendations).toHaveLength(2);
    });
  });

  describe('runWeeklyAutoProgression integration', () => {
    beforeEach(() => {
      // Reset window state
      window.trainingState = {
        weeklyVolume: { Chest: 8, Back: 12 },
        volumeLandmarks: { 
          Chest: { MEV: 8, MAV: 16, MRV: 22 },
          Back: { MEV: 10, MAV: 18, MRV: 26 }
        },
        targetRIR: 2,
        weekNo: 2
      };
    });

    test('runWeeklyAutoProgression should be exposed as a function', () => {
      expect(typeof window.btnRunWeeklyAutoProgression).toBe('function');
      expect(window.btnRunWeeklyAutoProgression.name).toBe('runWeeklyAutoProgression');
    });

    test('should update training state with new volumes', () => {
      const initialChestVolume = window.trainingState.weeklyVolume.Chest;
      
      // Call the handler
      window.btnRunWeeklyAutoProgression();
      
      // Should have progressed
      expect(window.trainingState.weeklyVolume.Chest).toBeGreaterThan(initialChestVolume);
    });

    test('should save progression history', () => {
      window.btnRunWeeklyAutoProgression();
      
      expect(window.trainingState.progressionHistory).toBeDefined();
      expect(window.trainingState.progressionHistory).toHaveLength(1);
      expect(window.trainingState.progressionHistory[0].week).toBe(2);
      expect(window.trainingState.progressionHistory[0].progressionResult).toBeDefined();
    });

    test('should update last progression timestamp', () => {
      const beforeTimestamp = Date.now();
      
      window.btnRunWeeklyAutoProgression();
      
      expect(window.trainingState.lastAutoProgression).toBeDefined();
      const afterTimestamp = new Date(window.trainingState.lastAutoProgression).getTime();
      expect(afterTimestamp).toBeGreaterThanOrEqual(beforeTimestamp);
    });    test('should dispatch weekly-auto-progression event', () => {
      let eventFired = false;
      let eventDetail = null;

      window.addEventListener('weekly-auto-progression', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      window.btnRunWeeklyAutoProgression();

      expect(eventFired).toBe(true);
      expect(eventDetail.progressionResult).toBeDefined();
      expect(eventDetail.progressionResult.progressions).toBeDefined();
    });
  });
});
