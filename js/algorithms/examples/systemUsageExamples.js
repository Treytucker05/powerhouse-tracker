/**
 * Training System Usage Examples
 * Demonstrates how to use RP and 5/3/1 systems separately without interference
 */

// Example usage of the training system selector

async function demonstrateSystemSeparation() {
    console.log("=== Training System Separation Demo ===\n");

    // Load the selector
    const selector = require('./trainingSystemSelector.js');

    // Show available systems
    console.log("Available Training Systems:");
    const systems = selector.getAvailableSystems();
    systems.forEach(system => {
        console.log(`- ${system.name}: ${system.description}`);
        console.log(`  Methodology: ${system.methodology}`);
        console.log(`  Compatible: ${system.compatible.join(', ') || 'Standalone'}\n`);
    });

    try {
        // === 5/3/1 System Example ===
        console.log("=== Using 5/3/1 System ===");
        const fiveThreeOneInterface = await selector.selectSystem('531');

        console.log(`Selected: ${fiveThreeOneInterface.name}`);
        console.log(`Description: ${fiveThreeOneInterface.description}`);

        // Example 5/3/1 workout calculation
        const fiveThreeOneWorkout = fiveThreeOneInterface.calculateWorkout('squat', 1, 300);
        console.log("5/3/1 Squat Workout (Week 1):");
        console.log(JSON.stringify(fiveThreeOneWorkout, null, 2));

        // Example 5/3/1 assistance work
        const fiveThreeOneAssistance = fiveThreeOneInterface.calculateAssistanceWork(
            ['push', 'pull', 'single-leg'],
            'BBB'
        );
        console.log("\n5/3/1 Assistance Work (BBB Template):");
        console.log(JSON.stringify(fiveThreeOneAssistance, null, 2));

        // === Switch to RP System ===
        console.log("\n=== Switching to RP System ===");

        // This demonstrates safe system switching
        const rpInterface = await selector.switchSystem('RP');
        console.log(`Switched to: ${rpInterface.interface.name}`);

        // Note: RP system would use different calculations
        // This would use MEV/MRV landmarks instead of percentages
        console.log("RP system would calculate volume based on:");
        console.log("- Current weekly sets per muscle group");
        console.log("- MEV/MRV landmarks");
        console.log("- Stimulus accumulation and fatigue state");

        // === Demonstrate Incompatibility Safety ===
        console.log("\n=== System Compatibility Check ===");
        const compatible = selector.areSystemsCompatible('531', 'RP');
        console.log(`5/3/1 compatible with RP: ${compatible}`);
        console.log("This prevents accidental methodology mixing\n");

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example of direct 5/3/1 usage without selector
async function direct531Example() {
    console.log("=== Direct 5/3/1 Usage Example ===\n");

    const FiveThreeOneSystem = require('./fiveThreeOne.js');
    const fiveThreeOne = new FiveThreeOneSystem();

    // Set training maxes
    fiveThreeOne.setTrainingMax('squat', 300);
    fiveThreeOne.setTrainingMax('bench', 225);
    fiveThreeOne.setTrainingMax('deadlift', 400);
    fiveThreeOne.setTrainingMax('press', 150);

    // Generate a complete 4-week cycle
    const cycle = fiveThreeOne.generateTrainingCycle({
        'squat': 300,
        'bench': 225,
        'deadlift': 400,
        'press': 150
    }, 'standard');

    console.log("Complete 5/3/1 Training Cycle:");
    console.log(`Methodology: ${cycle.methodology}`);
    console.log(`Template: ${cycle.template}`);
    console.log(`Exercises: ${cycle.exercises.join(', ')}`);

    // Show week 1 for all exercises
    console.log("\nWeek 1 Workouts:");
    Object.entries(cycle.weeks[1]).forEach(([exercise, workout]) => {
        if (exercise !== 'assistance') {
            console.log(`\n${exercise.toUpperCase()}:`);
            workout.sets.forEach((set, index) => {
                console.log(`  Set ${index + 1}: ${set.weight}lbs x ${set.reps}+ (${set.percentage}%)`);
            });
        }
    });

    // Show assistance work
    console.log("\nAssistance Work:");
    const assistance = cycle.weeks[1].assistance;
    Object.entries(assistance.categories).forEach(([category, work]) => {
        console.log(`${category}: ${work.targetReps} reps (${work.repRange} per set)`);
    });
}

// Example of progression tracking
function progressionTrackingExample() {
    console.log("\n=== 5/3/1 Progression Tracking Example ===\n");

    const FiveThreeOneSystem = require('./fiveThreeOne.js');
    const fiveThreeOne = new FiveThreeOneSystem();

    // Example session data
    const sessionData = {
        exercise: 'squat',
        week: 1,
        reps: 8,  // Hit 8 reps on 5+ set
        weight: 225,
        rpe: 8
    };

    // Track progression
    const progression = fiveThreeOne.trackProgression(sessionData);

    console.log("Session Performance Analysis:");
    console.log(`Exercise: ${progression.exercise}`);
    console.log(`Week: ${progression.week}`);
    console.log(`Performance: ${progression.performance.qualityScore}/3`);
    console.log(`Over Target: ${progression.performance.overTarget}`);
    console.log(`Recommendation: ${progression.progression.action}`);
    console.log(`Weight Increase: +${progression.progression.weightIncrease}lbs`);
    console.log(`Reasoning: ${progression.reasoning}`);
}

// Run examples
if (require.main === module) {
    demonstrateSystemSeparation()
        .then(() => direct531Example())
        .then(() => progressionTrackingExample())
        .catch(console.error);
}

module.exports = {
    demonstrateSystemSeparation,
    direct531Example,
    progressionTrackingExample
};
