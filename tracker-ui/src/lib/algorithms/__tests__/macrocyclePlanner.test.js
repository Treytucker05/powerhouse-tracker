import { describe, it, expect } from 'vitest';
import { createYearlyPlan, createLinearPlan, createSpecializationPlan } from '../macrocyclePlanner';

describe('macrocyclePlanner', () => {
  const mockProfile = {
    trainingAge: 'intermediate',
    primaryGoal: 'hypertrophy',
    daysPerWeek: 4,
    sessionLength: 60,
    totalWeeks: 16,
    dietPhase: 'maintain',
    priorityMuscles: ['chest', 'back'],
    volumeTolerance: 'moderate',
    recoveryCapacity: 7
  };

  describe('createLinearPlan', () => {
    it('should create a plan with correct total weeks', () => {
      const plan = createLinearPlan(mockProfile);
      
      expect(plan).toBeDefined();
      expect(plan.totalWeeks).toBe(16);
      expect(plan.phases).toBeDefined();
      expect(plan.phases.length).toBeGreaterThan(0);
      
      // Check that phase weeks add up to total
      const totalPhaseWeeks = plan.phases.reduce((sum, phase) => sum + phase.lengthWeeks, 0);
      expect(totalPhaseWeeks).toBe(16);
    });

    it('should include required phase properties', () => {
      const plan = createLinearPlan(mockProfile);
      
      plan.phases.forEach(phase => {
        expect(phase).toHaveProperty('id');
        expect(phase).toHaveProperty('title');
        expect(phase).toHaveProperty('type');
        expect(phase).toHaveProperty('lengthWeeks');
        expect(phase).toHaveProperty('diet');
        expect(phase).toHaveProperty('volumeModifier');
        expect(phase.lengthWeeks).toBeGreaterThan(0);
      });
    });
  });

  describe('createSpecializationPlan', () => {
    const advancedProfile = {
      ...mockProfile,
      trainingAge: 'advanced',
      specialization: {
        enabled: true,
        focusMuscles: ['chest', 'shoulders'],
        intensityLevel: 'moderate'
      }
    };

    it('should create a specialization plan', () => {
      const plan = createSpecializationPlan(advancedProfile);
      
      expect(plan).toBeDefined();
      expect(plan.planType).toBe('specialization');
      expect(plan.phases.some(phase => phase.type === 'specialization')).toBe(true);
    });

    it('should have higher volume modifier for specialization phase', () => {
      const plan = createSpecializationPlan(advancedProfile);
      const specPhase = plan.phases.find(phase => phase.type === 'specialization');
      
      expect(specPhase).toBeDefined();
      expect(specPhase.volumeModifier).toBeGreaterThan(1.0);
    });
  });

  describe('createYearlyPlan', () => {
    it('should choose linear plan for non-advanced users', () => {
      const plan = createYearlyPlan(mockProfile);
      expect(plan.planType).toBe('linear');
    });

    it('should choose specialization plan for advanced users with specialization enabled', () => {
      const advancedProfile = {
        ...mockProfile,
        trainingAge: 'advanced',
        specialization: {
          enabled: true,
          focusMuscles: ['chest'],
          intensityLevel: 'moderate'
        }
      };
      
      const plan = createYearlyPlan(advancedProfile);
      expect(plan.planType).toBe('specialization');
    });
  });
});
