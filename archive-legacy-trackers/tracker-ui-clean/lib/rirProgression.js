export class RIRProgression {
  progressionMaps = {
    hypertrophy: { name: 'Standard Hypertrophy', weeks: { 1: { r: 3.5, l: '65-70%' }, 2: { r: 2.5, l: '70-75%' }, 3: { r: 1.5, l: '75-85%' }, 4: { r: 0.5, l: '85-95%' }, 5: 'deload' } },
    strength: { name: '2-in-2 Strength', weeks: { 1: { r: 2, l: '75-80%' }, 2: { r: 1.5, l: '80-85%' }, 3: { r: 1, l: '85-90%' }, 4: { r: 0.5, l: '90-95%' }, 5: 'deload' } },
    volume: { name: 'High Volume', weeks: { 1: { r: 4, l: '60-65%' }, 2: { r: 3, l: '65-70%' }, 3: { r: 2, l: '70-75%' }, 4: { r: 1, l: '75-80%' }, 5: 'deload' } }
  };

  getWeeklyRIR(w, type = 'hypertrophy') {
    const plan = this.progressionMaps[type];
    if (!plan) throw new Error(`Unknown program type ${type}`);
    const wk = plan.weeks[w];
    if (!wk) throw new Error(`Invalid week ${w}`);
    return wk;
  }

  calcLoad(oneRM, targetRIR, reps) {
    const repsAtFail = reps + targetRIR;
    const pct = 100 / (1 + repsAtFail / 30);
    return Math.round(oneRM * pct / 100);
  }
}
export default RIRProgression;
