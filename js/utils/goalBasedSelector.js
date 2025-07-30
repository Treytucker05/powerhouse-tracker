/**
 * Goal-Based Training System Selector
 * Organizes training methodologies around primary training goals
 * Prevents system mixing until all individual systems are complete
 */

class GoalBasedTrainingSelector {
    constructor() {
        this.trainingGoals = {
            'strength': {
                name: 'Strength Development',
                description: 'Primary focus on increasing 1RM in main lifts',
                priority: 'Progressive overload with heavy loads',
                compatibleSystems: ['531', 'conjugate', 'linear-periodization'],
                recommendedSystem: '531',
                characteristics: [
                    'Low-moderate volume, high intensity',
                    'Percentage-based programming',
                    'Focus on compound movements',
                    'Linear or wave periodization'
                ]
            },

            'hypertrophy': {
                name: 'Muscle Growth',
                description: 'Primary focus on building muscle mass',
                priority: 'Volume accumulation with optimal stimulus',
                compatibleSystems: ['rp'],
                recommendedSystem: 'rp',
                characteristics: [
                    'High volume with MEV/MRV management',
                    'Stimulus-fatigue balance',
                    'Multiple rep ranges',
                    'Auto-regulation based on recovery'
                ]
            },

            'powerlifting': {
                name: 'Powerlifting Competition',
                description: 'Maximize squat, bench, deadlift total',
                priority: 'Sport-specific strength in competition lifts',
                compatibleSystems: ['531', 'conjugate', 'bulgarian'],
                recommendedSystem: '531',
                characteristics: [
                    'Competition lift specialization',
                    'Percentage-based training',
                    'Peaking protocols',
                    'Competition prep phases'
                ]
            },

            'general-fitness': {
                name: 'General Fitness',
                description: 'Overall health, strength, and conditioning',
                priority: 'Balanced development across multiple qualities',
                compatibleSystems: ['hybrid'],
                recommendedSystem: 'hybrid',
                characteristics: [
                    'Balanced strength and conditioning',
                    'Multiple movement patterns',
                    'Sustainable long-term approach',
                    'Health and performance focus'
                ]
            },

            'athletic-performance': {
                name: 'Athletic Performance',
                description: 'Sport-specific performance enhancement',
                priority: 'Transfer to sport-specific movements and qualities',
                compatibleSystems: ['conjugate'],
                recommendedSystem: 'conjugate',
                characteristics: [
                    'Sport-specific movement patterns',
                    'Power and speed development',
                    'Seasonal periodization',
                    'Recovery and injury prevention'
                ]
            }
        };

        this.availableSystems = {
            '531': {
                name: "Jim Wendler's 5/3/1",
                status: 'complete', // ✅ Already implemented
                methodology: 'Percentage-based linear progression',
                bestFor: ['strength', 'powerlifting'],
                implementation: 'js/algorithms/fiveThreeOne.js',
                features: ['Training Max progression', 'Wave periodization', 'AMRAP tracking']
            },

            'rp': {
                name: 'Renaissance Periodization',
                status: 'partial', // Exists but needs goal-specific implementation
                methodology: 'Volume landmarks and auto-regulation',
                bestFor: ['hypertrophy'],
                implementation: 'js/algorithms/volume.js',
                features: ['MEV/MRV tracking', 'Stimulus scoring', 'Recovery management']
            },

            'conjugate': {
                name: 'Conjugate/Westside Method',
                status: 'not-implemented',
                methodology: 'Max effort + Dynamic effort training',
                bestFor: ['powerlifting', 'athletic-performance'],
                implementation: null,
                features: ['Max effort work', 'Speed work', 'Accommodating resistance']
            },

            'linear-periodization': {
                name: 'Linear Periodization',
                status: 'not-implemented',
                methodology: 'Progressive volume/intensity manipulation',
                bestFor: ['strength', 'general-fitness'],
                implementation: null,
                features: ['Phase progression', 'Volume/intensity waves', 'Structured blocks']
            },

            'hybrid': {
                name: 'Hybrid System',
                status: 'future', // Build after all individual systems complete
                methodology: 'Combines multiple approaches intelligently',
                bestFor: ['general-fitness', 'athletic-performance'],
                implementation: null,
                features: ['Goal-phase switching', 'Method combination', 'Contextual selection']
            }
        };

        this.selectedGoal = null;
        this.activeSystem = null;
        this.developmentPhase = 'individual-systems'; // 'individual-systems' | 'hybrid-development'
    }

    /**
     * Step 1: Select primary training goal
     * @param {string} goalKey - Primary training goal
     * @returns {Object} - Goal details and compatible systems
     */
    selectPrimaryGoal(goalKey) {
        if (!this.trainingGoals[goalKey]) {
            throw new Error(`Unknown training goal: ${goalKey}`);
        }

        this.selectedGoal = goalKey;
        const goal = this.trainingGoals[goalKey];

        // Get available systems for this goal
        const compatibleSystems = goal.compatibleSystems.map(systemKey => {
            const system = this.availableSystems[systemKey];
            if (!system) {
                return {
                    key: systemKey,
                    name: systemKey,
                    status: 'unknown',
                    isRecommended: systemKey === goal.recommendedSystem,
                    isAvailable: false
                };
            }

            return {
                key: systemKey,
                ...system,
                isRecommended: systemKey === goal.recommendedSystem,
                isAvailable: system.status === 'complete'
            };
        });

        return {
            selectedGoal: goal.name,
            description: goal.description,
            priority: goal.priority,
            characteristics: goal.characteristics,
            compatibleSystems,
            recommendedSystem: this.availableSystems[goal.recommendedSystem],
            nextStep: 'Select a training system that matches your goal'
        };
    }

    /**
     * Step 2: Select training system based on goal
     * @param {string} systemKey - Training system to implement
     * @returns {Object} - System selection result
     */
    selectTrainingSystem(systemKey) {
        if (!this.selectedGoal) {
            throw new Error('Must select a primary goal first');
        }

        const goal = this.trainingGoals[this.selectedGoal];
        const system = this.availableSystems[systemKey];

        if (!system) {
            throw new Error(`Unknown training system: ${systemKey}`);
        }

        // Validate system compatibility with goal
        if (!goal.compatibleSystems.includes(systemKey)) {
            return {
                error: `${system.name} is not compatible with ${goal.name} goal`,
                suggestion: `Try: ${goal.compatibleSystems.join(', ')}`,
                compatibleSystems: goal.compatibleSystems
            };
        }

        // Check system implementation status
        if (system.status === 'not-implemented') {
            return {
                message: `${system.name} system needs to be implemented`,
                goal: goal.name,
                system: system.name,
                methodology: system.methodology,
                features: system.features,
                nextStep: `Implement ${system.name} system for ${goal.name} goal`,
                implementationPriority: this.getImplementationPriority(systemKey)
            };
        }

        if (system.status === 'complete') {
            this.activeSystem = systemKey;
            return {
                success: true,
                goal: goal.name,
                system: system.name,
                methodology: system.methodology,
                implementation: system.implementation,
                message: `${system.name} is ready for ${goal.name} training`,
                nextStep: 'Begin training with selected system'
            };
        }

        if (system.status === 'partial') {
            return {
                message: `${system.name} needs goal-specific customization`,
                goal: goal.name,
                system: system.name,
                nextStep: `Customize ${system.name} for ${goal.name} goal`,
                implementationPriority: this.getImplementationPriority(systemKey)
            };
        }

        if (system.status === 'future') {
            return {
                message: 'Hybrid systems will be available after individual systems are complete',
                currentPhase: 'Individual system development',
                requirement: 'Complete all individual systems first',
                availableNow: this.getAvailableSystemsForGoal(this.selectedGoal)
            };
        }
    }

    /**
     * Get available systems for current goal
     * @param {string} goalKey - Goal to check
     * @returns {Array} - Available systems
     */
    getAvailableSystemsForGoal(goalKey) {
        const goal = this.trainingGoals[goalKey];
        return goal.compatibleSystems
            .filter(systemKey => this.availableSystems[systemKey].status === 'complete')
            .map(systemKey => this.availableSystems[systemKey]);
    }

    /**
     * Get implementation priority for system development
     * @param {string} systemKey - System to prioritize
     * @returns {Object} - Priority and reasoning
     */
    getImplementationPriority(systemKey) {
        const system = this.availableSystems[systemKey];
        const goalCount = Object.values(this.trainingGoals)
            .filter(goal => goal.compatibleSystems.includes(systemKey)).length;

        const priorities = {
            'rp': {
                priority: 'high',
                reasoning: 'Hypertrophy is a common goal, system partially exists',
                estimatedWork: 'Medium - customize existing volume algorithms'
            },
            'conjugate': {
                priority: 'medium',
                reasoning: 'Supports multiple goals (powerlifting + athletic performance)',
                estimatedWork: 'High - completely new implementation'
            },
            'linear-periodization': {
                priority: 'medium',
                reasoning: 'Good foundation system for beginners',
                estimatedWork: 'Medium - straightforward implementation'
            },
            'hybrid': {
                priority: 'future',
                reasoning: 'Requires all other systems to be complete first',
                estimatedWork: 'High - complex integration logic'
            }
        };

        return priorities[systemKey] || {
            priority: 'low',
            reasoning: 'Limited goal compatibility',
            estimatedWork: 'Unknown'
        };
    }

    /**
     * Get current development roadmap
     * @returns {Object} - Development plan and priorities
     */
    getDevelopmentRoadmap() {
        const completedSystems = Object.entries(this.availableSystems)
            .filter(([key, system]) => system.status === 'complete')
            .map(([key, system]) => ({ key, ...system }));

        const pendingSystems = Object.entries(this.availableSystems)
            .filter(([key, system]) => ['not-implemented', 'partial'].includes(system.status))
            .map(([key, system]) => ({ key, ...system, priority: this.getImplementationPriority(key) }))
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority.priority] - priorityOrder[a.priority.priority];
            });

        return {
            currentPhase: this.developmentPhase,
            completed: completedSystems,
            pending: pendingSystems,
            nextRecommendation: pendingSystems[0] || null,
            hybridAvailable: pendingSystems.length === 0,
            totalProgress: {
                completed: completedSystems.length,
                total: Object.keys(this.availableSystems).length - 1, // Exclude hybrid
                percentage: Math.round((completedSystems.length / (Object.keys(this.availableSystems).length - 1)) * 100)
            }
        };
    }

    /**
     * Get all available goals for selection
     * @returns {Array} - Training goals with details
     */
    getAvailableGoals() {
        return Object.entries(this.trainingGoals).map(([key, goal]) => {
            // Check how many compatible systems are implemented
            const availableSystemsCount = goal.compatibleSystems.filter(
                systemKey => {
                    const system = this.availableSystems[systemKey];
                    return system && system.status === 'complete';
                }
            ).length;

            // Check if any systems are implemented for this goal
            const hasImplementedSystems = goal.compatibleSystems.some(
                systemKey => {
                    const system = this.availableSystems[systemKey];
                    return system && system.status === 'complete';
                }
            );

            return {
                key,
                name: goal.name,
                description: goal.description,
                characteristics: goal.characteristics,
                hasImplementedSystems,
                availableSystemsCount
            };
        });
    }

    /**
     * Get interface for main application integration
     * @returns {Object} - Integration interface
     */
    getIntegrationInterface() {
        return {
            // Goal selection
            getAvailableGoals: this.getAvailableGoals.bind(this),
            selectPrimaryGoal: this.selectPrimaryGoal.bind(this),

            // System selection
            selectTrainingSystem: this.selectTrainingSystem.bind(this),
            getAvailableSystemsForGoal: this.getAvailableSystemsForGoal.bind(this),

            // Development tracking
            getDevelopmentRoadmap: this.getDevelopmentRoadmap.bind(this),
            getImplementationPriority: this.getImplementationPriority.bind(this),

            // Current state
            getCurrentGoal: () => this.selectedGoal,
            getActiveSystem: () => this.activeSystem,
            getDevelopmentPhase: () => this.developmentPhase
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoalBasedTrainingSelector;
} else if (typeof window !== 'undefined') {
    window.GoalBasedTrainingSelector = GoalBasedTrainingSelector;
}

export { GoalBasedTrainingSelector };
