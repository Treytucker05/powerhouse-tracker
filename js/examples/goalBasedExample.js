/**
 * Goal-Based Training System Example
 * Demonstrates the new goal-first approach to system selection
 */

import { GoalBasedTrainingSelector } from '../utils/goalBasedSelector.js';

// Initialize the goal-based selector
const goalSelector = new GoalBasedTrainingSelector();

console.log("=== Goal-Based Training System Selection ===\n");

// Step 1: Show available goals
console.log("1. Available Training Goals:");
const availableGoals = goalSelector.getAvailableGoals();
availableGoals.forEach((goal, index) => {
    console.log(`${index + 1}. ${goal.name}`);
    console.log(`   Description: ${goal.description}`);
    console.log(`   Available Systems: ${goal.availableSystemsCount}`);
    console.log(`   Characteristics: ${goal.characteristics.slice(0, 2).join(', ')}...`);
    console.log();
});

// Step 2: Select a goal (Strength Development)
console.log("2. Selecting 'Strength Development' Goal:");
try {
    const strengthGoal = goalSelector.selectPrimaryGoal('strength');
    console.log(`Selected: ${strengthGoal.selectedGoal}`);
    console.log(`Priority: ${strengthGoal.priority}`);
    console.log("\nCompatible Systems:");
    strengthGoal.compatibleSystems.forEach(system => {
        const status = system.isAvailable ? "✅ Available" :
            system.status === 'not-implemented' ? "❌ Not Implemented" :
                "⚠️ Needs Work";
        const recommended = system.isRecommended ? " (RECOMMENDED)" : "";
        console.log(`  - ${system.name}: ${status}${recommended}`);
    });
    console.log();

    // Step 3: Select 5/3/1 system (available)
    console.log("3. Selecting 5/3/1 System for Strength Goal:");
    const systemSelection = goalSelector.selectTrainingSystem('531');
    if (systemSelection.success) {
        console.log(`✅ ${systemSelection.system} ready for ${systemSelection.goal}!`);
        console.log(`Implementation: ${systemSelection.implementation}`);
        console.log(`Next Step: ${systemSelection.nextStep}`);
    }
    console.log();

    // Step 4: Try selecting unavailable system (Conjugate)
    console.log("4. Trying to Select Conjugate Method (Not Implemented):");
    const conjugateSelection = goalSelector.selectTrainingSystem('conjugate');
    console.log(`Status: ${conjugateSelection.message}`);
    console.log(`Next Step: ${conjugateSelection.nextStep}`);
    console.log(`Priority: ${conjugateSelection.implementationPriority.priority}`);
    console.log(`Reasoning: ${conjugateSelection.implementationPriority.reasoning}`);
    console.log();

} catch (error) {
    console.error("Error:", error.message);
}

// Step 5: Select a different goal (Hypertrophy)
console.log("5. Selecting 'Hypertrophy' Goal:");
try {
    const hypertrophyGoal = goalSelector.selectPrimaryGoal('hypertrophy');
    console.log(`Selected: ${hypertrophyGoal.selectedGoal}`);
    console.log(`Priority: ${hypertrophyGoal.priority}`);

    // Try to select RP system
    console.log("\nTrying RP System for Hypertrophy:");
    const rpSelection = goalSelector.selectTrainingSystem('rp');
    console.log(`Status: ${rpSelection.message}`);
    console.log(`Next Step: ${rpSelection.nextStep}`);
    console.log(`Priority: ${rpSelection.implementationPriority.priority}`);
    console.log();

} catch (error) {
    console.error("Error:", error.message);
}

// Step 6: Show development roadmap
console.log("6. Development Roadmap:");
const roadmap = goalSelector.getDevelopmentRoadmap();
console.log(`Current Phase: ${roadmap.currentPhase}`);
console.log(`Progress: ${roadmap.totalProgress.completed}/${roadmap.totalProgress.total} systems (${roadmap.totalProgress.percentage}%)`);

console.log("\nCompleted Systems:");
roadmap.completed.forEach(system => {
    console.log(`  ✅ ${system.name}`);
});

console.log("\nPending Systems (by priority):");
roadmap.pending.forEach(system => {
    console.log(`  🔨 ${system.name} - ${system.priority.priority} priority`);
    console.log(`     ${system.priority.reasoning}`);
    console.log(`     Work Required: ${system.priority.estimatedWork}`);
});

console.log(`\nHybrid System Available: ${roadmap.hybridAvailable ? 'Yes' : 'No'}`);
if (!roadmap.hybridAvailable && roadmap.nextRecommendation) {
    console.log(`Next Recommended Implementation: ${roadmap.nextRecommendation.name}`);
}

console.log("\n=== Goal-First Approach Benefits ===");
console.log("✅ Prevents methodology mixing");
console.log("✅ Focuses development efforts");
console.log("✅ Ensures system compatibility");
console.log("✅ Clear progression path");
console.log("✅ Hybrid development only after individual systems complete");

// Example of goal-system workflow
console.log("\n=== Recommended Workflow ===");
console.log("1. User selects primary training goal");
console.log("2. System shows compatible methodologies");
console.log("3. User selects available system OR requests implementation");
console.log("4. Focus on perfecting individual systems");
console.log("5. Build hybrid system after all individual systems complete");
console.log("6. Enable intelligent goal-phase switching in hybrid");

export { goalSelector };
