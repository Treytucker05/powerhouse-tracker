/**
 * Training System Selector
 * Provides clean separation between RP and 5/3/1 methodologies
 * Ensures no interference between different training philosophies
 */

class TrainingSystemSelector {
    constructor() {
        this.currentSystem = null;
        this.availableSystems = {
            'RP': {
                name: 'Renaissance Periodization',
                description: 'Volume-based training using MEV/MRV landmarks',
                loadModule: () => import('./volume.js'),
                compatible: ['fatigue', 'autoregulation'],
                methodology: 'Volume landmarks and stimulus management'
            },
            '531': {
                name: 'Jim Wendler 5/3/1',
                description: 'Percentage-based powerlifting methodology',
                loadModule: () => import('./fiveThreeOne.js'),
                compatible: [],
                methodology: 'Training max percentages and linear progression'
            }
        };
    }

    /**
     * Select and initialize a training system
     * @param {string} systemKey - 'RP' or '531'
     * @returns {Promise<Object>} - System interface
     */
    async selectSystem(systemKey) {
        if (!this.availableSystems[systemKey]) {
            throw new Error(`Unknown training system: ${systemKey}`);
        }

        const systemConfig = this.availableSystems[systemKey];

        try {
            // Load the selected system module
            const systemModule = await systemConfig.loadModule();

            // Clear any previous system state
            this.clearCurrentSystem();

            // Initialize the new system
            if (systemKey === 'RP') {
                this.currentSystem = {
                    type: 'RP',
                    instance: systemModule.default || systemModule,
                    interface: this.createRPInterface(systemModule)
                };
            } else if (systemKey === '531') {
                const FiveThreeOneSystem = systemModule.default || systemModule;
                const instance = new FiveThreeOneSystem();
                this.currentSystem = {
                    type: '531',
                    instance: instance,
                    interface: instance.getSystemInterface()
                };
            }

            return this.currentSystem.interface;
        } catch (error) {
            throw new Error(`Failed to load training system ${systemKey}: ${error.message}`);
        }
    }

    /**
     * Create RP system interface
     * @param {Object} rpModule - RP module
     * @returns {Object} - Standardized interface
     */
    createRPInterface(rpModule) {
        return {
            name: "Renaissance Periodization",
            methodology: "Volume landmarks and stimulus management",
            calculateWorkout: rpModule.calculateOptimalVolume?.bind(rpModule),
            trackProgression: rpModule.assessVolumeProgression?.bind(rpModule),
            calculateAssistanceWork: rpModule.calculateAssistanceVolume?.bind(rpModule),
            isStandalone: false,
            compatibleWith: ['fatigue', 'autoregulation'],
            description: "RP-based volume management with MEV/MRV landmarks"
        };
    }

    /**
     * Clear current system state to prevent interference
     */
    clearCurrentSystem() {
        if (this.currentSystem) {
            // Clear any cached data or state
            this.currentSystem = null;

            // Clear any global variables that might cause interference
            if (typeof window !== 'undefined') {
                delete window.currentTrainingSystem;
                delete window.trainingState;
            }
        }
    }

    /**
     * Get current system information
     * @returns {Object|null} - Current system info
     */
    getCurrentSystem() {
        return this.currentSystem ? {
            type: this.currentSystem.type,
            name: this.currentSystem.interface.name,
            methodology: this.currentSystem.interface.methodology,
            isStandalone: this.currentSystem.interface.isStandalone
        } : null;
    }

    /**
     * Check if systems are compatible for mixing
     * @param {string} system1 - First system key
     * @param {string} system2 - Second system key
     * @returns {boolean} - True if compatible
     */
    areSystemsCompatible(system1, system2) {
        if (system1 === system2) return true;

        const sys1 = this.availableSystems[system1];
        const sys2 = this.availableSystems[system2];

        if (!sys1 || !sys2) return false;

        // 5/3/1 is standalone and not compatible with RP
        if ((system1 === '531' || system2 === '531') && system1 !== system2) {
            return false;
        }

        return sys1.compatible.includes(system2) || sys2.compatible.includes(system1);
    }

    /**
     * Get available systems for selection
     * @returns {Object} - Available systems info
     */
    getAvailableSystems() {
        return Object.entries(this.availableSystems).map(([key, system]) => ({
            key,
            name: system.name,
            description: system.description,
            methodology: system.methodology,
            compatible: system.compatible
        }));
    }

    /**
     * Validate system selection for safety
     * @param {string} systemKey - System to validate
     * @param {Object} currentWorkout - Current workout context
     * @returns {Object} - Validation result
     */
    validateSystemSelection(systemKey, currentWorkout = {}) {
        const system = this.availableSystems[systemKey];
        if (!system) {
            return { valid: false, reason: "Unknown training system" };
        }

        // Check for potential conflicts
        if (this.currentSystem && this.currentSystem.type !== systemKey) {
            if (!this.areSystemsCompatible(this.currentSystem.type, systemKey)) {
                return {
                    valid: false,
                    reason: `${system.name} is not compatible with current ${this.currentSystem.interface.name} system`,
                    recommendation: "Complete current cycle or switch systems"
                };
            }
        }

        return { valid: true, system: system.name };
    }

    /**
     * Switch between systems safely
     * @param {string} newSystemKey - New system to switch to
     * @returns {Promise<Object>} - Switch result
     */
    async switchSystem(newSystemKey) {
        const validation = this.validateSystemSelection(newSystemKey);
        if (!validation.valid) {
            throw new Error(validation.reason);
        }

        const previousSystem = this.currentSystem?.type;

        try {
            const newInterface = await this.selectSystem(newSystemKey);

            return {
                success: true,
                previousSystem,
                newSystem: newSystemKey,
                interface: newInterface,
                message: `Successfully switched to ${newInterface.name}`
            };
        } catch (error) {
            throw new Error(`Failed to switch systems: ${error.message}`);
        }
    }
}

// Export singleton instance
const trainingSystemSelector = new TrainingSystemSelector();

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = trainingSystemSelector;
} else if (typeof window !== 'undefined') {
    window.trainingSystemSelector = trainingSystemSelector;
}

// Also export the class for custom instances
if (typeof module !== 'undefined' && module.exports) {
    module.exports.TrainingSystemSelector = TrainingSystemSelector;
} else if (typeof window !== 'undefined') {
    window.TrainingSystemSelector = TrainingSystemSelector;
}
