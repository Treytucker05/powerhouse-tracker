import { expect, test } from "vitest";
import { designMesocycle } from "../src/lib/algorithms/mesocycleDesigner";

test("linear set & RIR progression", () => {
  const plan = designMesocycle({weeks:4,startVolume:8,endVolume:16,rirStart:4,rirEnd:0});
  expect(plan[0]).toEqual({week:1,sets:8,targetRIR:4});
  expect(plan[3]).toEqual({week:4,sets:16,targetRIR:0});
  expect(plan).toHaveLength(4);
});
