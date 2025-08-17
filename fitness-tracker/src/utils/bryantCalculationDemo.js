/**
 * Bryant Periodization Volume Calculator Demo
 * 
 * Shows exact MRV calculations with Bryant's 0.8x/1.3x modifiers
 */

// Example calculations using your enhanced calculatePersonalizedVolume function

const demonstrateBryantCalculations = () => {
    console.log('=== BRYANT PERIODIZATION VOLUME CALCULATIONS ===\n');

    // Base MRV values (Israetel recommendations)
    const baseMRV = {
        chest: 18,
        back: 25,
        shoulders: 16,
        quads: 20,
        hamstrings: 16
    };

    // Gainer type classifications with Bryant's exact modifiers
    const gainerTypes = {
        fast: {
            type: 'Fast Gainer',
            volumeModifier: 0.8,  // Bryant: 80% volume
            mrvModifier: 0.8      // Bryant: 80% MRV
        },
        average: {
            type: 'Average Gainer',
            volumeModifier: 1.0,  // Bryant: 100% volume
            mrvModifier: 1.0      // Bryant: 100% MRV
        },
        slow: {
            type: 'Slow Gainer',
            volumeModifier: 1.3,  // Bryant: 130% volume  
            mrvModifier: 1.3      // Bryant: 130% MRV
        }
    };

    // Intermediate experience modifier (1.0x)
    const experienceModifier = 1.0;

    Object.entries(baseMRV).forEach(([muscle, baseValue]) => {
        console.log(`\n${muscle.toUpperCase()} MRV CALCULATIONS:`);
        console.log(`Base MRV: ${baseValue} sets/week`);
        console.log('─'.repeat(40));

        Object.entries(gainerTypes).forEach(([type, classification]) => {
            const personalizedMRV = Math.round(baseValue * classification.mrvModifier * experienceModifier);
            const difference = personalizedMRV - baseValue;
            const percentChange = Math.round(((personalizedMRV / baseValue) - 1) * 100);

            console.log(`${classification.type.padEnd(15)}: ${personalizedMRV.toString().padStart(2)} sets/week (${percentChange >= 0 ? '+' : ''}${percentChange}% | ${difference >= 0 ? '+' : ''}${difference} sets)`);
        });
    });

    // Demonstrate specific examples from Bryant book
    console.log('\n=== BRYANT BOOK EXAMPLES ===\n');

    console.log('80% 1RM Test Results → Classification:');
    console.log('• 4-8 reps   → Fast Gainer   (0.8x modifier)');
    console.log('• 10-12 reps → Average Gainer (1.0x modifier)');
    console.log('• 15+ reps   → Slow Gainer   (1.3x modifier)');

    console.log('\nChest MRV Example (Base: 18 sets/week):');
    console.log('• Fast Gainer:    18 × 0.8 = 14 sets/week');
    console.log('• Average Gainer: 18 × 1.0 = 18 sets/week');
    console.log('• Slow Gainer:    18 × 1.3 = 23 sets/week');

    console.log('\nQuadriceps MRV Example (Base: 20 sets/week):');
    console.log('• Fast Gainer:    20 × 0.8 = 16 sets/week');
    console.log('• Average Gainer: 20 × 1.0 = 20 sets/week');
    console.log('• Slow Gainer:    20 × 1.3 = 26 sets/week');
};

// Run the demonstration
demonstrateBryantCalculations();

/**
 * Expected Output:
 * 
 * CHEST MRV CALCULATIONS:
 * Base MRV: 18 sets/week
 * ─────────────────────────────────────────
 * Fast Gainer    : 14 sets/week (-20% | -4 sets)
 * Average Gainer : 18 sets/week (+0% | +0 sets)
 * Slow Gainer    : 23 sets/week (+30% | +5 sets)
 * 
 * BACK MRV CALCULATIONS:
 * Base MRV: 25 sets/week
 * ─────────────────────────────────────────
 * Fast Gainer    : 20 sets/week (-20% | -5 sets)
 * Average Gainer : 25 sets/week (+0% | +0 sets)
 * Slow Gainer    : 33 sets/week (+30% | +8 sets)
 */

export default demonstrateBryantCalculations;
