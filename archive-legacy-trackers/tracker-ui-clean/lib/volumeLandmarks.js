import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const muscleConfig = require('../config/muscle-config.json');

export class VolumeLandmarks {
  constructor(cfg = muscleConfig) { this.cfg = cfg; }
  mult(level = 'intermediate') { return this.cfg.individualMultipliers[level] ?? 1; }

  mv(m, lvl) { return Math.round(this.cfg.baselineVolumes[m] * this.mult(lvl)); }
  mev(m, lvl) { return Math.ceil(this.mv(m, lvl) * 1.25); }
  mrv(m, lvl) { return Math.ceil(this.mev(m, lvl) * (this.cfg.mrvMultipliers[m] ?? 2.2)); }
  mav(m, lvl) { return { lower: Math.ceil(this.mev(m, lvl) * 1.2), upper: Math.floor(this.mrv(m, lvl) * 0.95) }; }

  getLandmarks(m, lvl) { return { MV: this.mv(m, lvl), MEV: this.mev(m, lvl), MAV: this.mav(m, lvl), MRV: this.mrv(m, lvl) }; }
}
export default VolumeLandmarks;
