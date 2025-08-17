import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

/**
 * NASMOPTPhaseStep - Step 9: OPT Phase Selection
 * 
 * Complete NASM OPT Model Phase Selection:
 * - 5 phases of the Optimum Performance Training model
 * - Goal-based phase recommendations
 * - Detailed phase characteristics and parameters
 * - Direct progression to program configuration
 */

// NASM OPT Model Phases with complete training parameters
const OPT_PHASES = {
    phase1: {
        id: 'phase1',
        name: 'Phase 1: Stabilization Endurance',
        category: 'Stabilization',
        description: 'Develop muscular endurance, stability, and movement efficiency',
        duration: '4-6 weeks',
        level: 'Beginner',
        color: '#dc2626',
        parameters: {
            sets: '1-3 sets',
            reps: '12-20 reps',
            tempo: '4/2/1 (slow/controlled)',
            rest: '0-90 seconds',
            intensity: '50-70% 1RM',
            load: 'Light to moderate'
        },
        focus: [
            'Muscular endurance',
            'Core stability',
            'Movement efficiency',
            'Joint mobility',
            'Postural control'
        ],
        benefits: [
            'Improved movement quality',
            'Enhanced muscular endurance',
            'Better postural control',
            'Injury prevention foundation',
            'Preparation for higher intensities'
        ],
        exercises: [
            'Ball squats, single-leg balance',
            'Push-ups on ball, planks',
            'Standing cable chest press',
            'Single-leg Romanian deadlift',
            'Overhead squats with light weight'
        ],
        clientTypes: ['Beginner', 'Deconditioned', 'Injury history', 'Movement dysfunction']
    },
    phase2: {
        id: 'phase2',
        name: 'Phase 2: Strength Endurance',
        category: 'Strength',
        description: 'Develop stabilization and prime mover strength simultaneously',
        duration: '4-6 weeks',
        level: 'Beginner to Intermediate',
        color: '#dc2626',
        parameters: {
            sets: '2-4 sets',
            reps: '8-12 reps',
            tempo: '2/0/2 (moderate)',
            rest: '0-60 seconds',
            intensity: '70-80% 1RM',
            load: 'Moderate'
        },
        focus: [
            'Strength endurance',
            'Stabilization strength',
            'Neuromuscular efficiency',
            'Prime mover strength',
            'Muscular endurance'
        ],
        benefits: [
            'Enhanced strength endurance',
            'Improved stabilization',
            'Better movement efficiency',
            'Increased lean body mass',
            'Improved muscular endurance'
        ],
        exercises: [
            'Superset: Bench press + push-ups',
            'Superset: Squats + single-leg squats',
            'Superset: Rows + single-arm rows',
            'Superset: Overhead press + single-arm press',
            'Core stabilization circuits'
        ],
        clientTypes: ['Intermediate', 'Strength endurance goals', 'General fitness']
    },
    phase3: {
        id: 'phase3',
        name: 'Phase 3: Muscular Development',
        category: 'Strength',
        description: 'Maximize muscle growth and development',
        duration: '4-6 weeks',
        level: 'Intermediate to Advanced',
        color: '#dc2626',
        parameters: {
            sets: '3-5 sets',
            reps: '6-12 reps',
            tempo: '2/0/2 (controlled)',
            rest: '0-60 seconds',
            intensity: '75-85% 1RM',
            load: 'Moderate to heavy'
        },
        focus: [
            'Muscular hypertrophy',
            'Muscle growth',
            'Strength development',
            'Body composition',
            'Metabolic enhancement'
        ],
        benefits: [
            'Increased muscle mass',
            'Enhanced strength',
            'Improved body composition',
            'Better muscular definition',
            'Increased metabolic rate'
        ],
        exercises: [
            'Traditional strength training',
            'Compound movements',
            'Isolation exercises',
            'Progressive overload protocols',
            'Higher volume training'
        ],
        clientTypes: ['Hypertrophy goals', 'Body composition', 'Intermediate to advanced']
    },
    phase4: {
        id: 'phase4',
        name: 'Phase 4: Maximal Strength',
        category: 'Strength',
        description: 'Develop maximum force production capabilities',
        duration: '4-6 weeks',
        level: 'Advanced',
        color: '#dc2626',
        parameters: {
            sets: '3-5 sets',
            reps: '1-5 reps',
            tempo: 'X/X/X (explosive)',
            rest: '3-5 minutes',
            intensity: '85-100% 1RM',
            load: 'Heavy to maximum'
        },
        focus: [
            'Maximal strength',
            'Force production',
            'Neural adaptations',
            'Power development',
            'Performance enhancement'
        ],
        benefits: [
            'Maximum strength gains',
            'Enhanced power output',
            'Improved rate of force development',
            'Neural efficiency',
            'Athletic performance'
        ],
        exercises: [
            'Heavy compound movements',
            'Low rep protocols',
            'Olympic lift variations',
            'Heavy squats, deadlifts, presses',
            'Explosive movements'
        ],
        clientTypes: ['Advanced athletes', 'Strength goals', 'Performance athletes']
    },
    phase5: {
        id: 'phase5',
        name: 'Phase 5: Power',
        category: 'Power',
        description: 'Develop rate of force production and explosive power',
        duration: '4-6 weeks',
        level: 'Advanced',
        color: '#dc2626',
        parameters: {
            sets: '3-5 sets',
            reps: '1-5 reps',
            tempo: 'X/X/X (explosive)',
            rest: '3-5 minutes',
            intensity: '30-45% 1RM (speed) / 85-100% 1RM (strength)',
            load: 'Variable (light for speed, heavy for strength)'
        },
        focus: [
            'Power development',
            'Rate of force development',
            'Explosive strength',
            'Sport-specific power',
            'Athletic performance'
        ],
        benefits: [
            'Explosive power gains',
            'Improved athletic performance',
            'Enhanced rate of force development',
            'Sport-specific adaptations',
            'Functional power'
        ],
        exercises: [
            'Superset: Heavy squats + jump squats',
            'Superset: Bench press + medicine ball throws',
            'Olympic lift variations',
            'Plyometric exercises',
            'Speed and agility drills'
        ],
        clientTypes: ['Elite athletes', 'Sport performance', 'Power development goals']
    }
};

// Goal-based phase recommendations
const GOAL_TO_PHASE = {
    weight_loss: {
        primary: 'phase1',
        secondary: 'phase2',
        reasoning: 'Stabilization endurance and strength endurance phases maximize caloric expenditure and improve movement efficiency',
        progression: ['phase1', 'phase2', 'phase1', 'phase2']
    },
    muscle_gain: {
        primary: 'phase3',
        secondary: 'phase2',
        reasoning: 'Muscular development phase optimizes hypertrophy while strength endurance provides foundation',
        progression: ['phase1', 'phase2', 'phase3', 'phase2']
    },
    sports_performance: {
        primary: 'phase5',
        secondary: 'phase4',
        reasoning: 'Power development with maximal strength foundation for athletic performance',
        progression: ['phase1', 'phase2', 'phase4', 'phase5']
    },
    general_fitness: {
        primary: 'phase2',
        secondary: 'phase1',
        reasoning: 'Strength endurance provides balanced fitness benefits with stabilization foundation',
        progression: ['phase1', 'phase2', 'phase1', 'phase2']
    },
    strength: {
        primary: 'phase4',
        secondary: 'phase3',
        reasoning: 'Maximal strength development with muscular development support',
        progression: ['phase1', 'phase2', 'phase3', 'phase4']
    }
};

const NASMOPTPhaseStep = () => {
    const { state, actions } = useProgramContext();
    const [selectedPhase, setSelectedPhase] = useState(null);
    const [showRecommendation, setShowRecommendation] = useState(true);

    // Get recommended phase based on user's primary goal
    const getRecommendedPhase = () => {
        const userGoal = state.primaryGoal?.toLowerCase().replace(' ', '_') || 'general_fitness';
        const goalMapping = GOAL_TO_PHASE[userGoal] || GOAL_TO_PHASE.general_fitness;
        return {
            phase: OPT_PHASES[goalMapping.primary],
            reasoning: goalMapping.reasoning,
            progression: goalMapping.progression.map(phaseId => OPT_PHASES[phaseId].name)
        };
    };

    const recommendation = getRecommendedPhase();

    const handlePhaseSelection = (phaseId) => {
        const phase = OPT_PHASES[phaseId];
        setSelectedPhase(phase);

        // Save selected phase to context
        actions.setMethodologyContext({
            ...state.methodologyContext,
            selectedOPTPhase: phase,
            phaseParameters: phase.parameters,
            phaseProgression: GOAL_TO_PHASE[state.primaryGoal?.toLowerCase().replace(' ', '_') || 'general_fitness'].progression
        });
    };

    const handleContinue = () => {
        if (selectedPhase) {
            // Advance to next step (step 10)
            actions.setCurrentStep(10);
        }
    };

    const PhaseCard = ({ phase, isRecommended, isSelected }) => (
        <div
            className={`phase-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
            onClick={() => handlePhaseSelection(phase.id)}
        >
            <div className="phase-header">
                <h3>{phase.name}</h3>
                <div className="phase-category">{phase.category}</div>
                {isRecommended && <div className="recommended-badge">Recommended</div>}
            </div>

            <div className="phase-description">
                <p>{phase.description}</p>
                <div className="phase-details">
                    <span className="duration">Duration: {phase.duration}</span>
                    <span className="level">Level: {phase.level}</span>
                </div>
            </div>

            <div className="phase-parameters">
                <h4>Training Parameters</h4>
                <div className="parameter-grid">
                    <div className="parameter">
                        <strong>Sets:</strong> {phase.parameters.sets}
                    </div>
                    <div className="parameter">
                        <strong>Reps:</strong> {phase.parameters.reps}
                    </div>
                    <div className="parameter">
                        <strong>Tempo:</strong> {phase.parameters.tempo}
                    </div>
                    <div className="parameter">
                        <strong>Rest:</strong> {phase.parameters.rest}
                    </div>
                    <div className="parameter">
                        <strong>Intensity:</strong> {phase.parameters.intensity}
                    </div>
                    <div className="parameter">
                        <strong>Load:</strong> {phase.parameters.load}
                    </div>
                </div>
            </div>

            <div className="phase-focus">
                <h4>Primary Focus</h4>
                <ul>
                    {phase.focus.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="client-types">
                <h4>Best For</h4>
                <div className="client-type-tags">
                    {phase.clientTypes.map((type, index) => (
                        <span key={index} className="client-type-tag">{type}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="nasm-opt-phase-step">
            <div className="step-header">
                <h2>🎯 NASM OPT Phase Selection</h2>
                <p>Select the appropriate OPT model phase based on your goals and experience level</p>
            </div>

            {showRecommendation && (
                <div className="recommendation-section">
                    <div className="recommendation-card">
                        <h3>📋 Recommended Phase for {state.primaryGoal || 'Your Goal'}</h3>
                        <div className="recommended-phase">
                            <h4>{recommendation.phase.name}</h4>
                            <p><strong>Why:</strong> {recommendation.reasoning}</p>
                        </div>
                        <div className="progression-path">
                            <h4>Suggested Progression</h4>
                            <div className="progression-timeline">
                                {recommendation.progression.map((phaseName, index) => (
                                    <div key={index} className="progression-item">
                                        <span className="phase-number">{index + 1}</span>
                                        <span className="phase-name">{phaseName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            className="dismiss-recommendation"
                            onClick={() => setShowRecommendation(false)}
                        >
                            View All Phases
                        </button>
                    </div>
                </div>
            )}

            <div className="phases-grid">
                {Object.values(OPT_PHASES).map(phase => (
                    <PhaseCard
                        key={phase.id}
                        phase={phase}
                        isRecommended={phase.id === recommendation.phase.id}
                        isSelected={selectedPhase?.id === phase.id}
                    />
                ))}
            </div>

            {selectedPhase && (
                <div className="selection-summary">
                    <div className="selected-phase-summary">
                        <h3>Selected: {selectedPhase.name}</h3>
                        <p>{selectedPhase.description}</p>
                        <div className="key-benefits">
                            <h4>Key Benefits</h4>
                            <ul>
                                {selectedPhase.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="continue-section">
                        <button
                            className="continue-btn"
                            onClick={handleContinue}
                        >
                            Continue with {selectedPhase.name} →
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .nasm-opt-phase-step {
                    padding: 30px;
                    background: #111827;
                    color: #d1d5db;
                    min-height: 100vh;
                }

                .step-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .step-header h2 {
                    color: #dc2626;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    font-weight: 700;
                }

                .step-header p {
                    font-size: 1.2em;
                    color: #9ca3af;
                }

                .recommendation-section {
                    margin-bottom: 40px;
                }

                .recommendation-card {
                    background: #1f2937;
                    border: 2px solid #dc2626;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .recommendation-card h3 {
                    color: #dc2626;
                    margin-bottom: 20px;
                    font-size: 1.5em;
                }

                .recommended-phase h4 {
                    color: #ffffff;
                    font-size: 1.3em;
                    margin-bottom: 10px;
                }

                .progression-path {
                    margin-top: 25px;
                }

                .progression-path h4 {
                    color: #dc2626;
                    margin-bottom: 15px;
                }

                .progression-timeline {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .progression-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #374151;
                    padding: 8px 12px;
                    border-radius: 6px;
                }

                .phase-number {
                    background: #dc2626;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9em;
                    font-weight: bold;
                }

                .phase-name {
                    font-size: 0.9em;
                    color: #d1d5db;
                }

                .dismiss-recommendation {
                    background: #374151;
                    color: #d1d5db;
                    border: 1px solid #4b5563;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }

                .dismiss-recommendation:hover {
                    background: #4b5563;
                    border-color: #6b7280;
                }

                .phases-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }

                .phase-card {
                    background: #1f2937;
                    border: 2px solid #374151;
                    border-radius: 12px;
                    padding: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .phase-card:hover {
                    border-color: #dc2626;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.2);
                }

                .phase-card.selected {
                    border-color: #dc2626;
                    background: #292524;
                    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
                }

                .phase-card.recommended {
                    border-color: #fbbf24;
                }

                .phase-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .phase-header h3 {
                    color: #dc2626;
                    font-size: 1.3em;
                    margin: 0;
                    font-weight: 600;
                }

                .phase-category {
                    background: #dc2626;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: 600;
                }

                .recommended-badge {
                    background: #fbbf24;
                    color: #111827;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: 600;
                }

                .phase-description {
                    margin-bottom: 20px;
                }

                .phase-description p {
                    color: #d1d5db;
                    line-height: 1.5;
                    margin-bottom: 10px;
                }

                .phase-details {
                    display: flex;
                    gap: 15px;
                    font-size: 0.9em;
                    color: #9ca3af;
                }

                .phase-parameters {
                    margin-bottom: 20px;
                }

                .phase-parameters h4 {
                    color: #dc2626;
                    font-size: 1.1em;
                    margin-bottom: 10px;
                }

                .parameter-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .parameter {
                    background: #374151;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 0.9em;
                }

                .parameter strong {
                    color: #dc2626;
                }

                .phase-focus {
                    margin-bottom: 20px;
                }

                .phase-focus h4 {
                    color: #dc2626;
                    font-size: 1.1em;
                    margin-bottom: 10px;
                }

                .phase-focus ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .phase-focus li {
                    color: #d1d5db;
                    font-size: 0.9em;
                    padding: 4px 0;
                    border-left: 3px solid #dc2626;
                    padding-left: 12px;
                    margin-bottom: 4px;
                }

                .client-types h4 {
                    color: #dc2626;
                    font-size: 1.1em;
                    margin-bottom: 10px;
                }

                .client-type-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .client-type-tag {
                    background: #374151;
                    color: #d1d5db;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    border: 1px solid #4b5563;
                }

                .selection-summary {
                    background: #1f2937;
                    border: 2px solid #dc2626;
                    border-radius: 12px;
                    padding: 30px;
                    margin-top: 30px;
                }

                .selected-phase-summary h3 {
                    color: #dc2626;
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }

                .selected-phase-summary p {
                    color: #d1d5db;
                    margin-bottom: 20px;
                    font-size: 1.1em;
                }

                .key-benefits h4 {
                    color: #dc2626;
                    margin-bottom: 10px;
                }

                .key-benefits ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .key-benefits li {
                    color: #d1d5db;
                    padding: 6px 0;
                    border-left: 3px solid #dc2626;
                    padding-left: 15px;
                    margin-bottom: 6px;
                }

                .continue-section {
                    margin-top: 30px;
                    text-align: center;
                }

                .continue-btn {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 1.2em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .continue-btn:hover {
                    background: #b91c1c;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
                }

                @media (max-width: 768px) {
                    .phases-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .parameter-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .progression-timeline {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default NASMOPTPhaseStep;
