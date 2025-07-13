/**
 * Intelligent Exercise Selection & Program Design
 * Automatically selects optimal exercises based on goals, equipment, and fatigue patterns
 */

import trainingState from "../core/trainingState.js";

/**
 * Exercise database with biomechanical and fatigue profiles
 */
const EXERCISE_DATABASE = {
  // Chest exercises
  chest: {
    barbell_bench_press: {
      type: "compound",
      primaryMuscles: ["chest"],
      secondaryMuscles: ["triceps", "front_delts"],
      equipment: ["barbell", "bench"],
      fatigueIndex: 8.5, // 1-10 scale
      skillRequirement: 7,
      ranges: { strength: [1, 5], hypertrophy: [6, 12], endurance: [12, 20] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "high",
        coordination: "moderate",
      },
    },
    dumbbell_bench_press: {
      type: "compound",
      primaryMuscles: ["chest"],
      secondaryMuscles: ["triceps", "front_delts"],
      equipment: ["dumbbells", "bench"],
      fatigueIndex: 7.5,
      skillRequirement: 6,
      ranges: { strength: [1, 6], hypertrophy: [6, 15], endurance: [12, 25] },
      biomechanics: {
        rangeOfMotion: "extended",
        stabilityRequirement: "moderate",
        coordination: "moderate",
      },
    },
    push_ups: {
      type: "compound",
      primaryMuscles: ["chest"],
      secondaryMuscles: ["triceps", "front_delts", "core"],
      equipment: ["bodyweight"],
      fatigueIndex: 4.0,
      skillRequirement: 3,
      ranges: { strength: [1, 8], hypertrophy: [8, 20], endurance: [15, 50] },
      biomechanics: {
        rangeOfMotion: "moderate",
        stabilityRequirement: "high",
        coordination: "low",
      },
    },
    incline_dumbbell_press: {
      type: "compound",
      primaryMuscles: ["chest"],
      secondaryMuscles: ["triceps", "front_delts"],
      equipment: ["dumbbells", "incline_bench"],
      fatigueIndex: 7.0,
      skillRequirement: 5,
      ranges: { strength: [1, 6], hypertrophy: [6, 15], endurance: [12, 20] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "moderate",
        coordination: "moderate",
      },
    },
    cable_flyes: {
      type: "isolation",
      primaryMuscles: ["chest"],
      secondaryMuscles: [],
      equipment: ["cables"],
      fatigueIndex: 5.5,
      skillRequirement: 4,
      ranges: { strength: [1, 8], hypertrophy: [8, 20], endurance: [15, 30] },
      biomechanics: {
        rangeOfMotion: "extended",
        stabilityRequirement: "low",
        coordination: "low",
      },
    },
  },

  // Back exercises
  back: {
    deadlift: {
      type: "compound",
      primaryMuscles: ["back"],
      secondaryMuscles: ["glutes", "hamstrings", "traps"],
      equipment: ["barbell"],
      fatigueIndex: 9.5,
      skillRequirement: 9,
      ranges: { strength: [1, 5], hypertrophy: [5, 10], endurance: [8, 15] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "very_high",
        coordination: "high",
      },
    },
    pull_ups: {
      type: "compound",
      primaryMuscles: ["back"],
      secondaryMuscles: ["biceps", "rear_delts"],
      equipment: ["pull_up_bar"],
      fatigueIndex: 7.5,
      skillRequirement: 6,
      ranges: { strength: [1, 6], hypertrophy: [5, 12], endurance: [10, 20] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "moderate",
        coordination: "moderate",
      },
    },
    barbell_rows: {
      type: "compound",
      primaryMuscles: ["back"],
      secondaryMuscles: ["biceps", "rear_delts"],
      equipment: ["barbell"],
      fatigueIndex: 8.0,
      skillRequirement: 7,
      ranges: { strength: [1, 6], hypertrophy: [6, 12], endurance: [10, 20] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "high",
        coordination: "high",
      },
    },
    lat_pulldowns: {
      type: "compound",
      primaryMuscles: ["back"],
      secondaryMuscles: ["biceps", "rear_delts"],
      equipment: ["cable_machine"],
      fatigueIndex: 6.0,
      skillRequirement: 4,
      ranges: { strength: [1, 8], hypertrophy: [6, 15], endurance: [12, 25] },
      biomechanics: {
        rangeOfMotion: "full",
        stabilityRequirement: "low",
        coordination: "low",
      },
    },
  },

  // Add more muscle groups...
  quads: {
    back_squat: {
      type: "compound",
      primaryMuscles: ["quads"],
      secondaryMuscles: ["glutes", "core"],
      equipment: ["barbell", "squat_rack"],
      fatigueIndex: 9.0,
      skillRequirement: 8,
      ranges: { strength: [1, 5], hypertrophy: [6, 12], endurance: [12, 20] },
    },
    leg_press: {
      type: "compound",
      primaryMuscles: ["quads"],
      secondaryMuscles: ["glutes"],
      equipment: ["leg_press_machine"],
      fatigueIndex: 6.5,
      skillRequirement: 3,
      ranges: { strength: [1, 8], hypertrophy: [8, 20], endurance: [15, 30] },
    },
  },
};

/**
 * Smart Exercise Selection based on multiple factors
 * @param {string} muscle - Target muscle group
 * @param {Object} constraints - Training constraints and preferences
 * @returns {Array} - Ranked exercise recommendations
 */
function selectOptimalExercises(muscle, constraints = {}) {
  const {
    availableEquipment = ["barbell", "dumbbells", "cables", "machines"],
    trainingGoal = "hypertrophy", // strength, hypertrophy, endurance
    experienceLevel = "intermediate", // beginner, intermediate, advanced
    fatigueLevel = 5, // 1-10 scale
    timeConstraint = "moderate", // low, moderate, high
    previousExercises = [], // To avoid repetition
    injuryHistory = [], // Areas to avoid loading
    preferredStyle = "balanced", // compound_focused, isolation_focused, balanced
  } = constraints;

  const muscleExercises = EXERCISE_DATABASE[muscle.toLowerCase()] || {};

  if (Object.keys(muscleExercises).length === 0) {
    return [
      {
        name: "No exercises found",
        score: 0,
        reasoning: "Muscle not in database",
      },
    ];
  }

  // Score each exercise
  const scoredExercises = Object.entries(muscleExercises).map(
    ([name, exercise]) => {
      let score = 0;
      let reasoning = [];

      // Equipment availability (mandatory)
      const hasEquipment = exercise.equipment.every((eq) =>
        availableEquipment.includes(eq),
      );
      if (!hasEquipment) {
        return {
          name,
          score: 0,
          reasoning: ["Equipment not available"],
          exercise,
        };
      }

      // Experience level compatibility
      const skillGap = Math.abs(
        exercise.skillRequirement - getExperienceScore(experienceLevel),
      );
      if (skillGap <= 2) {
        score += 20;
        reasoning.push("Skill level appropriate");
      } else if (skillGap <= 4) {
        score += 10;
        reasoning.push("Skill level manageable");
      } else {
        score += 0;
        reasoning.push("Skill level mismatch");
      }

      // Training goal alignment
      const goalRange = exercise.ranges[trainingGoal];
      if (goalRange) {
        score += 15;
        reasoning.push(`Optimal for ${trainingGoal}`);
      } else {
        score += 5;
        reasoning.push(`Suboptimal for ${trainingGoal}`);
      }

      // Fatigue considerations
      const fatigueCompatibility =
        10 - Math.abs(exercise.fatigueIndex - (10 - fatigueLevel));
      score += fatigueCompatibility;
      if (exercise.fatigueIndex <= 10 - fatigueLevel) {
        reasoning.push("Good fatigue compatibility");
      } else {
        reasoning.push("High fatigue exercise - use carefully");
      }

      // Time efficiency
      if (timeConstraint === "high") {
        if (exercise.type === "compound") {
          score += 15;
          reasoning.push("Time-efficient compound movement");
        } else {
          score += 5;
          reasoning.push("Isolation movement - less time efficient");
        }
      }

      // Style preference
      if (
        preferredStyle === "compound_focused" &&
        exercise.type === "compound"
      ) {
        score += 10;
        reasoning.push("Matches compound preference");
      } else if (
        preferredStyle === "isolation_focused" &&
        exercise.type === "isolation"
      ) {
        score += 10;
        reasoning.push("Matches isolation preference");
      } else if (preferredStyle === "balanced") {
        score += 8;
        reasoning.push("Balanced selection");
      }

      // Novelty bonus (avoid recent exercises)
      if (!previousExercises.includes(name)) {
        score += 8;
        reasoning.push("Novel exercise selection");
      } else {
        score -= 5;
        reasoning.push("Recently used - may cause adaptation plateau");
      }

      // Injury considerations
      const injuryRisk = checkInjuryRisk(exercise, injuryHistory);
      if (injuryRisk > 0) {
        score -= injuryRisk * 5;
        reasoning.push(`Injury risk consideration: -${injuryRisk * 5} points`);
      }

      return {
        name: formatExerciseName(name),
        score: Math.max(0, score),
        reasoning,
        exercise,
        repRange: goalRange || [6, 12],
        sets: recommendSets(exercise, trainingGoal),
        rest: recommendRest(exercise, trainingGoal),
      };
    },
  );

  // Sort by score and return top recommendations
  return scoredExercises.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5 recommendations
}

/**
 * Convert experience level to numeric score
 * @param {string} level - Experience level
 * @returns {number} - Numeric score (1-10)
 */
function getExperienceScore(level) {
  const levels = {
    beginner: 3,
    intermediate: 6,
    advanced: 9,
  };
  return levels[level] || 6;
}

/**
 * Check injury risk for exercise
 * @param {Object} exercise - Exercise data
 * @param {Array} injuryHistory - List of injury areas
 * @returns {number} - Risk score (0-5)
 */
function checkInjuryRisk(exercise, injuryHistory) {
  let risk = 0;

  // High skill/coordination exercises with injury history
  if (exercise.skillRequirement > 7 && injuryHistory.includes("back")) {
    risk += 3;
  }

  // High fatigue exercises with general injury concerns
  if (exercise.fatigueIndex > 8 && injuryHistory.length > 0) {
    risk += 2;
  }

  // Specific muscle group injuries
  exercise.primaryMuscles.forEach((muscle) => {
    if (injuryHistory.includes(muscle)) {
      risk += 4;
    }
  });

  return Math.min(5, risk);
}

/**
 * Format exercise name for display
 * @param {string} name - Raw exercise name
 * @returns {string} - Formatted name
 */
function formatExerciseName(name) {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Recommend sets based on exercise and goal
 * @param {Object} exercise - Exercise data
 * @param {string} goal - Training goal
 * @returns {number} - Recommended sets
 */
function recommendSets(exercise, goal) {
  const baseSets = {
    strength: exercise.type === "compound" ? 3 : 2,
    hypertrophy: exercise.type === "compound" ? 3 : 3,
    endurance: exercise.type === "compound" ? 2 : 4,
  };

  return baseSets[goal] || 3;
}

/**
 * Recommend rest periods
 * @param {Object} exercise - Exercise data
 * @param {string} goal - Training goal
 * @returns {string} - Rest recommendation
 */
function recommendRest(exercise, goal) {
  const restPeriods = {
    strength: exercise.type === "compound" ? "3-5 minutes" : "2-3 minutes",
    hypertrophy: exercise.type === "compound" ? "2-3 minutes" : "1-2 minutes",
    endurance: exercise.type === "compound" ? "1-2 minutes" : "30-60 seconds",
  };

  return restPeriods[goal] || "2-3 minutes";
}

/**
 * Generate weekly program structure
 * @param {Object} goals - Training goals and constraints
 * @returns {Object} - Complete weekly program
 */
function generateWeeklyProgram(goals = {}) {
  const {
    daysPerWeek = 4,
    muscleGroups = ["chest", "back", "quads", "shoulders"],
    splitType = "upper_lower", // full_body, upper_lower, push_pull_legs, body_part
    availableEquipment = ["barbell", "dumbbells", "cables"],
    experienceLevel = "intermediate",
    timePerSession = 60, // minutes
  } = goals;

  const program = {
    splitType,
    daysPerWeek,
    sessions: [],
  };

  // Generate sessions based on split type
  switch (splitType) {
    case "upper_lower":
      program.sessions = generateUpperLowerSplit(daysPerWeek, goals);
      break;
    case "push_pull_legs":
      program.sessions = generatePushPullLegsSplit(daysPerWeek, goals);
      break;
    case "full_body":
      program.sessions = generateFullBodySplit(daysPerWeek, goals);
      break;
    default:
      program.sessions = generateUpperLowerSplit(daysPerWeek, goals);
  }

  return program;
}

/**
 * Generate upper/lower split program
 * @param {number} daysPerWeek - Training frequency
 * @param {Object} goals - Training goals
 * @returns {Array} - Session array
 */
function generateUpperLowerSplit(daysPerWeek, goals) {
  const sessions = [];

  // Upper body session
  const upperMuscles = ["chest", "back", "shoulders", "biceps", "triceps"];
  const upperSession = {
    name: "Upper Body",
    type: "upper",
    exercises: [],
  };

  upperMuscles.forEach((muscle) => {
    if (EXERCISE_DATABASE[muscle]) {
      const exercises = selectOptimalExercises(muscle, goals);
      if (exercises.length > 0) {
        upperSession.exercises.push({
          muscle,
          exercise: exercises[0].name,
          sets: exercises[0].sets,
          reps: exercises[0].repRange,
          rest: exercises[0].rest,
        });
      }
    }
  });

  // Lower body session
  const lowerMuscles = ["quads", "hamstrings", "glutes", "calves"];
  const lowerSession = {
    name: "Lower Body",
    type: "lower",
    exercises: [],
  };

  lowerMuscles.forEach((muscle) => {
    if (EXERCISE_DATABASE[muscle]) {
      const exercises = selectOptimalExercises(muscle, goals);
      if (exercises.length > 0) {
        lowerSession.exercises.push({
          muscle,
          exercise: exercises[0].name,
          sets: exercises[0].sets,
          reps: exercises[0].repRange,
          rest: exercises[0].rest,
        });
      }
    }
  });

  // Arrange sessions based on frequency
  for (let day = 1; day <= daysPerWeek; day++) {
    if (day % 2 === 1) {
      sessions.push({ ...upperSession, day });
    } else {
      sessions.push({ ...lowerSession, day });
    }
  }

  return sessions;
}

/**
 * Generate push/pull/legs split
 * @param {number} daysPerWeek - Training frequency
 * @param {Object} goals - Training goals
 * @returns {Array} - Session array
 */
function generatePushPullLegsSplit(daysPerWeek, goals) {
  const sessions = [];

  const splits = {
    push: {
      name: "Push (Chest, Shoulders, Triceps)",
      muscles: ["chest", "shoulders", "triceps"],
    },
    pull: {
      name: "Pull (Back, Biceps)",
      muscles: ["back", "biceps"],
    },
    legs: {
      name: "Legs (Quads, Hamstrings, Glutes, Calves)",
      muscles: ["quads", "hamstrings", "glutes", "calves"],
    },
  };

  const splitOrder = ["push", "pull", "legs"];

  for (let day = 1; day <= daysPerWeek; day++) {
    const splitType = splitOrder[(day - 1) % 3];
    const split = splits[splitType];

    const session = {
      name: split.name,
      type: splitType,
      day,
      exercises: [],
    };

    split.muscles.forEach((muscle) => {
      if (EXERCISE_DATABASE[muscle]) {
        const exercises = selectOptimalExercises(muscle, goals);
        if (exercises.length > 0) {
          session.exercises.push({
            muscle,
            exercise: exercises[0].name,
            sets: exercises[0].sets,
            reps: exercises[0].repRange,
            rest: exercises[0].rest,
          });
        }
      }
    });

    sessions.push(session);
  }

  return sessions;
}

/**
 * Generate full body split
 * @param {number} daysPerWeek - Training frequency
 * @param {Object} goals - Training goals
 * @returns {Array} - Session array
 */
function generateFullBodySplit(daysPerWeek, goals) {
  const sessions = [];
  const allMuscles = ["chest", "back", "quads", "shoulders"];

  for (let day = 1; day <= daysPerWeek; day++) {
    const session = {
      name: `Full Body - Day ${day}`,
      type: "full_body",
      day,
      exercises: [],
    };

    // Rotate exercise selections to provide variety
    allMuscles.forEach((muscle) => {
      if (EXERCISE_DATABASE[muscle]) {
        const exercises = selectOptimalExercises(muscle, {
          ...goals,
          previousExercises: day > 1 ? [`exercise_from_day_${day - 1}`] : [],
        });

        if (exercises.length > 0) {
          session.exercises.push({
            muscle,
            exercise: exercises[0].name,
            sets: Math.max(1, exercises[0].sets - 1), // Fewer sets in full body
            reps: exercises[0].repRange,
            rest: exercises[0].rest,
          });
        }
      }
    });

    sessions.push(session);
  }

  return sessions;
}

export {
  selectOptimalExercises,
  generateWeeklyProgram,
  EXERCISE_DATABASE,
  formatExerciseName,
};
