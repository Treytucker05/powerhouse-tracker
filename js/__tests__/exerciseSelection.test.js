import { selectOptimalExercises } from "../algorithms/exerciseSelection.js";

describe("selectOptimalExercises", () => {
  test("returns top cable flyes when equipment available", () => {
    const res = selectOptimalExercises("chest", {
      availableEquipment: [
        "barbell",
        "bench",
        "dumbbells",
        "cables",
        "incline_bench",
      ],
      trainingGoal: "hypertrophy",
    });
    expect(res[0].name).toBe("Cable Flyes");
    expect(res).toHaveLength(5);
  });

  test("falls back to push ups with bodyweight only", () => {
    const res = selectOptimalExercises("chest", {
      availableEquipment: ["bodyweight"],
    });
    expect(res[0].name).toBe("Push Ups");
  });

  test("handles unknown muscle", () => {
    const res = selectOptimalExercises("unknown", {});
    expect(res[0].name).toBe("No exercises found");
  });
});
