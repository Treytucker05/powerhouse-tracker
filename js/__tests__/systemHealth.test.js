import { workflowPhases } from '../core/workflowPhases.js';
import * as handlers from '../ui/additionalHandlers.js';

describe('System Health', () => {
  test('phases defined', () => {
    expect(workflowPhases.length).toBeGreaterThan(0);
  });

  test('handlers exist', () => {
    expect(typeof handlers.btnOptimizeFrequency).toBe('function');
    expect(typeof handlers.btnProcessWithRPAlgorithms).toBe('function');
  });
});
