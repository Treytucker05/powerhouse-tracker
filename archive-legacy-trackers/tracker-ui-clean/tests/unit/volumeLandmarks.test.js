import { describe, it, expect, beforeEach } from "vitest";
import { VolumeLandmarks } from "../../lib/volumeLandmarks.js";

describe("VolumeLandmarks", () => {
  let v;
  beforeEach(() => {
    v = new VolumeLandmarks();
  });
  it("MV applies level multiplier", () => {
    expect(v.mv("chest", "beginner")).toBe(6);
  });
  it("MEV is 25 % above MV", () => {
    const mv = v.mv("back");
    expect(v.mev("back")).toBe(Math.ceil(mv * 1.25));
  });
  it("MRV uses muscle multiplier", () => {
    const mev = v.mev("calves");
    expect(v.mrv("calves")).toBe(Math.ceil(mev * 3.5));
  });
  it("MAV bounds valid", () => {
    const m = v.mav("chest");
    expect(m.lower).toBeLessThan(m.upper);
  });
  it("defaults to mult 1 for unknown level", () => {
    expect(v.mv("chest", "unknown")).toBe(8);
  });
  it("default MRV multiplier when missing", () => {
    const custom = { ...v.cfg, mrvMultipliers: {} };
    const t = new VolumeLandmarks(custom);
    const mev = t.mev("chest");
    expect(t.mrv("chest")).toBe(Math.ceil(mev * 2.2));
  });
});
