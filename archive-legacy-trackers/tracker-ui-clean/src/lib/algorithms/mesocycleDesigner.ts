export interface MesocycleConfig {
  weeks: number;            // 3–8
  startVolume: number;      // sets at MEV
  endVolume: number;        // sets near MRV
  rirStart: number;         // e.g. 4
  rirEnd: number;           // e.g. 0
}
export interface WeekPlan { week:number; sets:number; targetRIR:number }

export function designMesocycle(cfg: MesocycleConfig): WeekPlan[] {
  const plan: WeekPlan[] = [];
  const volStep = (cfg.endVolume - cfg.startVolume) / (cfg.weeks - 1);
  const rirStep = (cfg.rirStart - cfg.rirEnd) / (cfg.weeks - 1);
  for (let i = 0; i < cfg.weeks; i++) {
    plan.push({
      week: i + 1,
      sets: Math.round(cfg.startVolume + volStep * i),
      targetRIR: Math.round((cfg.rirStart - rirStep * i) * 10) / 10
    });
  }
  return plan;
}
