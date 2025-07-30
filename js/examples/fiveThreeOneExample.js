/**
 * 5/3/1 Implementation Example
 * Demonstrates how to use the standalone 5/3/1 system
 * This example shows the system working independently from RP algorithms
 */

import { FiveThreeOneSystem } from '../algorithms/fiveThreeOne.js';

// Initialize the 5/3/1 system
const fiveThreeOne = new FiveThreeOneSystem();

// Example: Set up training maxes from current 1RMs
const currentOneRMs = {
    squat: 315,
    bench: 225,
    deadlift: 405,
    press: 155
};

console.log("=== 5/3/1 System Example ===\n");

// Calculate and set training maxes
fiveThreeOne.setTrainingMaxes(currentOneRMs);

console.log("1. Training Maxes (90% of 1RM):");
console.log(fiveThreeOne.trainingMaxes);
console.log();

// Generate Week 1 (5s week) workout for squat
console.log("2. Week 1 Squat Workout (5s week):");
const week1Squat = fiveThreeOne.calculateMainWork('squat', 1, 1, false);
console.log(week1Squat);
console.log();

// Generate Week 2 (3s week) workout for bench
console.log("3. Week 2 Bench Workout (3s week):");
const week2Bench = fiveThreeOne.calculateMainWork('bench', 1, 2, false);
console.log(week2Bench);
console.log();

// Generate Week 3 (1s week) workout for deadlift
console.log("4. Week 3 Deadlift Workout (1s week):");
const week3Deadlift = fiveThreeOne.calculateMainWork('deadlift', 1, 3, false);
console.log(week3Deadlift);
console.log();

// Generate deload workout
console.log("5. Week 4 Deload Workout (Press):");
const deloadPress = fiveThreeOne.calculateMainWork('press', 1, 1, true);
console.log(deloadPress);
console.log();

// Calculate assistance work using 5/3/1 principles
console.log("6. Assistance Work (Standard Template):");
const assistance = fiveThreeOne.calculateAssistanceWork(['push', 'pull', 'single-leg'], 'standard');
console.log(assistance);
console.log();

// Test progression after a good AMRAP set
console.log("7. Progression Example (10 reps on 5+ week):");
const progression = fiveThreeOne.progressTrainingMax('squat', 10);
console.log(progression);
console.log();

// Generate complete 4-week cycle
console.log("8. Complete 4-Week Cycle Preview:");
const cycle = fiveThreeOne.generateTrainingCycle({
    squat: fiveThreeOne.trainingMaxes.squat,
    bench: fiveThreeOne.trainingMaxes.bench
}, 'BBB');

console.log("Week 1 Squat:", cycle.weeks[1].squat);
console.log("Week 4 Deload:", cycle.weeks[4].squat);
console.log();

// Show 5/3/1 progression tracking
console.log("9. 5/3/1 Progression Tracking Example:");
const sessionData = {
    exercise: 'bench press',
    week: 1,
    reps: 8,
    weight: 191, // 85% of 225 TM
    rpe: 7
};

const progressionData = fiveThreeOne.trackProgression(sessionData);
console.log(progressionData);
console.log();

console.log("=== 5/3/1 System Ready for Integration ===");
console.log("This system operates completely independently from RP algorithms");
console.log("Use fiveThreeOne.getSystemInterface() for integration with main application");
