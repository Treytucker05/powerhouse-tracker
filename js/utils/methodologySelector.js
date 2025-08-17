/**
 * Training Methodology Selector
 * Allows users to choose between RP-based and 5/3/1 systems
 * Ensures no interference between methodologies
 */

import { FiveThreeOneSystem } from '../algorithms/fiveThreeOne.js';
// Note: Import your existing RP volume system here
// import { RPVolumeSystem } from '../algorithms/volume.js';

class MethodologySelector {
    constructor() {
        this.availableMethodologies = {
            'rp': {
                name: 'Renaissance Periodization',
                description: 'Volume-based training using MEV/MRV landmarks',
                system: null, // Would be initialized with your existing RP system
                features: ['MEV/MRV tracking', 'Stimulus scoring', 'Auto-regulation'],
                compatibility: ['hybrid-approaches']
            },
            '531': {
                name: "Jim Wendler's 5/3/1",
                description: 'Percentage-based training with linear progression',
                system: new FiveThreeOneSystem(),
                features: ['Training Max progression', 'Wave periodization', 'AMRAP sets'],
                compatibility: ['standalone-only']
            }
        };

        this.activeMethodology = null;
        this.userPreferences = {
            allowMethodologyMixing: false, // Set to true only if explicitly requested
            defaultMethodology: '531'
        };
    }

    /**
     * Select a training methodology
     * @param {string} methodology - 'rp' or '531'
     * @param {Object} options - Configuration options
     * @returns {Object} - Selected system interface
     */
    selectMethodology(methodology, options = {}) {
        if (!this.availableMethodologies[methodology]) {
            throw new Error(`Unknown methodology: ${methodology}`);
        }

        const selected = this.availableMethodologies[methodology];

        // Ensure no interference between systems
        if (this.activeMethodology && this.activeMethodology !== methodology) {
            console.warn(`Switching from ${this.activeMethodology} to ${methodology}`);
            console.warn('Previous methodology data will be preserved but not actively used');
        }

        this.activeMethodology = methodology;

        return {
            methodology: selected.name,
            description: selected.description,
            system: selected.system,
            features: selected.features,
            isActive: true,
            separateFrom: Object.keys(this.availableMethodologies).filter(m => m !== methodology)
        };
    }

    /**
     * Get current active methodology
     * @returns {Object} - Current system info
     */
    getActiveMethodology() {
        if (!this.activeMethodology) {
            return { error: 'No methodology selected' };
        }

        return this.availableMethodologies[this.activeMethodology];
    }

    /**
     * Calculate workout using active methodology
     * @param {Object} parameters - Workout parameters
     * @returns {Object} - Workout calculation
     */
    calculateWorkout(parameters) {
        const active = this.getActiveMethodology();

        if (active.error) {
            throw new Error('No methodology selected. Please select RP or 5/3/1 first.');
        }

        if (this.activeMethodology === '531') {
            return this.calculate531Workout(parameters);
        } else if (this.activeMethodology === 'rp') {
            return this.calculateRPWorkout(parameters);
        }
    }

    /**
     * Calculate 5/3/1 workout
     * @param {Object} params - Workout parameters
     * @returns {Object} - 5/3/1 workout
     */
    calculate531Workout(params) {
        const { lift, week, isDeload } = params;
        const system = this.availableMethodologies['531'].system;

        return system.calculateWorkout(lift, week, isDeload);
    }

    /**
     * Calculate RP workout (placeholder for your existing system)
     * @param {Object} params - Workout parameters
     * @returns {Object} - RP workout
     */
    calculateRPWorkout(params) {
        // This would integrate with your existing RP volume calculations
        return {
            methodology: 'RP',
            message: 'RP system integration goes here',
            params
        };
    }

    /**
     * Get methodology comparison
     * @returns {Object} - Comparison of methodologies
     */
    getMethodologyComparison() {
        return {
            'Renaissance Periodization': {
                focus: 'Volume management',
                progression: 'Stimulus-based auto-regulation',
                structure: 'Flexible based on recovery',
                tracking: 'MEV/MRV landmarks',
                bestFor: 'Advanced lifters, bodybuilding focus'
            },
            '5/3/1': {
                focus: 'Strength progression',
                progression: 'Linear Training Max increases',
                structure: 'Fixed 4-week waves',
                tracking: 'AMRAP performance',
                bestFor: 'Intermediate lifters, strength focus'
            }
        };
    }

    /**
     * Ensure methodology separation
     * @param {string} requestedMethodology - Methodology to activate
     * @returns {boolean} - Whether switch is safe
     */
    ensureMethodologySeparation(requestedMethodology) {
        if (!this.activeMethodology) {
            return true; // No conflict if nothing is active
        }

        if (this.activeMethodology === requestedMethodology) {
            return true; // Same methodology, no conflict
        }

        // Different methodologies - ensure separation
        console.log(`Methodology Switch: ${this.activeMethodology} → ${requestedMethodology}`);
        console.log('Previous methodology data preserved but deactivated');

        return true; // Safe switch with proper separation
    }

    /**
     * Get system interface for integration
     * @returns {Object} - Integration interface
     */
    getIntegrationInterface() {
        return {
            selectMethodology: this.selectMethodology.bind(this),
            calculateWorkout: this.calculateWorkout.bind(this),
            getActiveMethodology: this.getActiveMethodology.bind(this),
            getMethodologyComparison: this.getMethodologyComparison.bind(this),
            ensureSeparation: this.ensureMethodologySeparation.bind(this),

            // Direct access to systems (for advanced use)
            get531System: () => this.availableMethodologies['531'].system,
            getRPSystem: () => this.availableMethodologies['rp'].system
        };
    }
}

// Export for use in main application
export { MethodologySelector };

// Example usage
if (typeof window !== 'undefined') {
    window.MethodologySelector = MethodologySelector;
}

console.log('Methodology Selector loaded - supports separate RP and 5/3/1 systems');
