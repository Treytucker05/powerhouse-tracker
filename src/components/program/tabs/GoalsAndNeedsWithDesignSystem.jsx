import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, User, Trophy } from 'lucide-react';

// Import design system components
import {
    Section,
    SectionHeader,
    Grid,
    InputField,
    SelectField,
    TextareaField,
    Button,
    Card,
    FormGroup,
    FormLabel
} from '../../ui/DesignSystem';

const GoalsAndNeedsWithDesignSystem = ({ assessmentData, onNext, canGoNext }) => {
    const [goals, setGoals] = useState({
        timeframe: '1-year',
        primaryGoal: assessmentData?.primaryGoal || '',
        sportDemands: [],
        biomotorPriorities: {
            strength: 'medium',
            power: 'medium',
            endurance: 'medium',
            speed: 'medium',
            agility: 'medium',
            flexibility: 'medium'
        },
        trainingHistory: assessmentData?.trainingExperience || '',
        performanceGoals: ''
    });

    const biomotorAbilities = [
        { key: 'strength', label: 'Strength', description: 'Maximum force production' },
        { key: 'power', label: 'Power', description: 'Rate of force development' },
        { key: 'endurance', label: 'Endurance', description: 'Aerobic capacity & muscular endurance' },
        { key: 'speed', label: 'Speed', description: 'Movement velocity' },
        { key: 'agility', label: 'Agility', description: 'Change of direction ability' },
        { key: 'flexibility', label: 'Flexibility', description: 'Range of motion & mobility' }
    ];

    const timeframes = [
        { value: '6-month', label: '6 Months', description: 'Short-term focus & specific adaptations' },
        { value: '1-year', label: '1 Year', description: 'Annual periodization cycle' },
        { value: '2-year', label: '2 Years', description: 'Olympic/collegiate cycle' },
        { value: '4-year', label: '4 Years', description: 'Long-term athlete development' }
    ];

    const experienceLevels = [
        { value: 'novice', label: 'Novice', description: '< 1 year training experience' },
        { value: 'intermediate', label: 'Intermediate', description: '1-3 years training experience' },
        { value: 'advanced', label: 'Advanced', description: '3+ years training experience' },
        { value: 'elite', label: 'Elite', description: 'Competitive/professional level' }
    ];

    const priorityOptions = [
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' }
    ];

    const handleBiomotorChange = (ability, priority) => {
        setGoals(prev => ({
            ...prev,
            biomotorPriorities: {
                ...prev.biomotorPriorities,
                [ability]: priority
            }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Assessment Summary */}
            <Section>
                <SectionHeader
                    title="Assessment Summary"
                    description="Review your current fitness profile and training background"
                />

                {assessmentData ? (
                    <Grid columns={3}>
                        <Card>
                            <div className="text-center">
                                <User className="mx-auto mb-2 text-accent-primary" size={24} />
                                <h4 className="text-primary font-semibold mb-1">Experience Level</h4>
                                <p className="text-secondary text-sm">{assessmentData.experienceLevel}</p>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <Target className="mx-auto mb-2 text-accent-primary" size={24} />
                                <h4 className="text-primary font-semibold mb-1">Primary Goal</h4>
                                <p className="text-secondary text-sm">{assessmentData.primaryGoal}</p>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <Trophy className="mx-auto mb-2 text-accent-primary" size={24} />
                                <h4 className="text-primary font-semibold mb-1">Recommended System</h4>
                                <p className="text-secondary text-sm">Periodized Training</p>
                            </div>
                        </Card>
                    </Grid>
                ) : (
                    <div className="text-center py-8 bg-tertiary rounded-lg">
                        <User className="mx-auto mb-4 text-muted" size={48} />
                        <p className="text-muted">Complete initial assessment to see summary</p>
                        <Button variant="primary" className="mt-4">
                            Take Assessment
                        </Button>
                    </div>
                )}
            </Section>

            {/* Training Timeframe */}
            <Section>
                <SectionHeader
                    title="Training Timeframe"
                    description="Select your planning horizon for periodization structure"
                />

                <Grid columns={2}>
                    {timeframes.map(timeframe => (
                        <Card
                            key={timeframe.value}
                            className={`cursor-pointer transition-colors border-2 ${goals.timeframe === timeframe.value
                                    ? 'border-accent-primary bg-accent-primary bg-opacity-10'
                                    : 'border-secondary hover:border-primary'
                                }`}
                            onClick={() => setGoals(prev => ({ ...prev, timeframe: timeframe.value }))}
                        >
                            <div className="text-center">
                                <Calendar className="mx-auto mb-2 text-accent-primary" size={24} />
                                <h4 className="text-primary font-semibold mb-1">{timeframe.label}</h4>
                                <p className="text-secondary text-sm">{timeframe.description}</p>
                            </div>
                        </Card>
                    ))}
                </Grid>
            </Section>

            {/* Long-term Performance Goals */}
            <Section>
                <SectionHeader
                    title="Long-term Performance Goals"
                    description="Describe your specific performance objectives and targets"
                />

                <TextareaField
                    label="Performance Goals"
                    rows={4}
                    placeholder="Describe your long-term performance objectives (e.g., compete in powerlifting meet, improve 1RM squat by 50lbs, complete marathon under 4 hours)..."
                    value={goals.performanceGoals}
                    onChange={(e) => setGoals(prev => ({ ...prev, performanceGoals: e.target.value }))}
                />
            </Section>

            {/* Biomotor Ability Priorities */}
            <Section>
                <SectionHeader
                    title="Biomotor Ability Priorities"
                    description="Set training priorities for different physical capacities"
                />

                <Grid columns={2}>
                    {biomotorAbilities.map((ability) => (
                        <Card key={ability.key} className="border border-secondary">
                            <div className="mb-3">
                                <h4 className="text-primary font-semibold">{ability.label}</h4>
                                <p className="text-secondary text-sm">{ability.description}</p>
                            </div>

                            <SelectField
                                label="Priority Level"
                                options={priorityOptions}
                                value={goals.biomotorPriorities[ability.key]}
                                onChange={(e) => handleBiomotorChange(ability.key, e.target.value)}
                            />
                        </Card>
                    ))}
                </Grid>
            </Section>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <Button variant="secondary" disabled>
                    <span className="mr-2">←</span> Previous
                </Button>

                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={!canGoNext}
                >
                    Next Step <span className="ml-2">→</span>
                </Button>
            </div>
        </div>
    );
};

export default GoalsAndNeedsWithDesignSystem;
