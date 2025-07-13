import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const progCfg = require('../config/progression-config.json');

export class SetProgression {
  evaluateWeeklyProgression(s, p) {
    const total = s + p;
    if (total >= progCfg.deloadTriggers.totalScoreThreshold || p >= progCfg.deloadTriggers.singleDayPerformanceThreshold)
      return { action: 'initiate_deload', rationale: 'Exceeding recovery capacity', scores: { soreness: s, performance: p, total } };
    if (total <= 1) return { action: 'add_2_3_sets', rationale: 'Under-stimulated', setsToAdd: Math.random() < 0.5 ? 2 : 3 };
    if (p >= 3) return { action: 'maintain_sets', rationale: 'Approaching MRV' };
    return { action: 'add_1_set', rationale: 'Standard progression' };
  }

  detectPerformanceCrash(arr) {
    if (arr.length < 3) return false;
    const thr = progCfg.deloadTriggers.performanceCrashThreshold;
    return arr.slice(-3).every(v => v >= thr);
  }

  getRecommendation(s, p, h = []) {
    const hist = [...h, p];
    if (this.detectPerformanceCrash(hist))
      return { action: 'initiate_deload', rationale: '3-day performance crash detected', crashDetected: true };
    return this.evaluateWeeklyProgression(s, p);
  }
}
export default SetProgression;
