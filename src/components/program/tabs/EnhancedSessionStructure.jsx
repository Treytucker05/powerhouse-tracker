import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calendar, BarChart3, Zap, Settings, TrendingUp } from 'lucide-react';

// Import the original component
import MicrocycleDesign from './MicrocycleDesign';

// Loading Parameters Section
const LoadingParametersSection = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [blockParameters, setBlockParameters] = useState({});
    const [activeBlock, setActiveBlock] = useState('accumulation');

    const blocks = [
        { id: 'accumulation', name: 'Accumulation', phase: 'accumulation' },
        { id: 'intensification', name: 'Intensification', phase: 'intensification' },
        { id: 'realization', name: 'Realization', phase: 'realization' },
        { id: 'deload', name: 'Deload', phase: 'deload' }
    ];

    const getLoadingRecommendation = (phase, assessmentData) => {
        const baseRecommendations = {
            accumulation: { min: 55, max: 70, optimal: 62 },
            intensification: { min: 70, max: 85, optimal: 77 },
            realization: { min: 85, max: 95, optimal: 90 },
            deload: { min: 30, max: 50, optimal: 40 }
        };

        const base = baseRecommendations[phase];
        if (!base) return null;

        const experienceMultiplier = {
            'Beginner': 0.9,
            'Intermediate': 1.0,
            'Advanced': 1.1
        };

        const multiplier = experienceMultiplier[assessmentData?.experience_level] || 1.0;

        return {
            min: Math.round(base.min * multiplier),
            max: Math.round(base.max * multiplier),
            optimal: Math.round(base.optimal * multiplier)
        };
    };

    const handleParameterChange = (blockId, parameter, value) => {
        setBlockParameters(prev => ({
            ...prev,
            [blockId]: {
                ...prev[blockId],
                [parameter]: value
            }
        }));
    };

    const BlockParameterForm = ({ block }) => {
        const params = blockParameters[block.id] || {};
        const recommendation = getLoadingRecommendation(block.phase, assessmentData);

        return (
            <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                    <CardTitle className="text-white">{block.name} Block</CardTitle>
                    {recommendation && (
                        <div className="text-sm text-gray-300">
                            Recommended: {recommendation.optimal}% (Range: {recommendation.min}-{recommendation.max}%)
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Intensity (%)
                            </label>
                            <input
                                type="number"
                                value={params.intensity || ''}
                                onChange={(e) => handleParameterChange(block.id, 'intensity', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder={recommendation?.optimal.toString() || "70"}
                                min="0"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Volume (sets/week)
                            </label>
                            <input
                                type="number"
                                value={params.volume || ''}
                                onChange={(e) => handleParameterChange(block.id, 'volume', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="12"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Frequency
                            </label>
                            <select
                                value={params.frequency || ''}
                                onChange={(e) => handleParameterChange(block.id, 'frequency', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select...</option>
                                <option value="2">2x/week</option>
                                <option value="3">3x/week</option>
                                <option value="4">4x/week</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rest (seconds)
                            </label>
                            <input
                                type="number"
                                value={params.rest || ''}
                                onChange={(e) => handleParameterChange(block.id, 'rest', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="180"
                                min="30"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Block Selection */}
            <div className="flex space-x-2">
                {blocks.map((block) => (
                    <button
                        key={block.id}
                        onClick={() => setActiveBlock(block.id)}
                        className={`px-4 py-2 rounded-lg font-medium ${activeBlock === block.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {block.name}
                    </button>
                ))}
            </div>

            {/* Active Block Parameters */}
            {blocks.map((block) => (
                activeBlock === block.id && (
                    <BlockParameterForm key={block.id} block={block} />
                )
            ))}
        </div>
    );
};

// Training Methods Section
const TrainingMethodsSection = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [selectedMethods, setSelectedMethods] = useState([]);

    const trainingMethods = [
        {
            id: 'maximal_effort',
            name: 'Maximal Effort Method',
            description: 'Work up to 1RM or near maximal loads',
            intensity: '90-100%',
            volume: 'Low',
            bestFor: 'Strength, neural adaptations'
        },
        {
            id: 'dynamic_effort',
            name: 'Dynamic Effort Method',
            description: 'Speed work with submaximal loads',
            intensity: '50-60%',
            volume: 'Moderate',
            bestFor: 'Rate of force development, power'
        },
        {
            id: 'repetition_effort',
            name: 'Repetition Effort Method',
            description: 'High rep training to muscular failure',
            intensity: '60-80%',
            volume: 'High',
            bestFor: 'Hypertrophy, muscular endurance'
        },
        {
            id: 'cluster_training',
            name: 'Cluster Training',
            description: 'Breaking sets into smaller clusters with rest',
            intensity: '80-90%',
            volume: 'Moderate-High',
            bestFor: 'Strength, power maintenance'
        }
    ];

    const toggleMethod = (methodId) => {
        setSelectedMethods(prev =>
            prev.includes(methodId)
                ? prev.filter(id => id !== methodId)
                : [...prev, methodId]
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {trainingMethods.map((method) => (
                    <Card
                        key={method.id}
                        className={`cursor-pointer transition-colors ${selectedMethods.includes(method.id)
                                ? 'bg-blue-900/20 border-blue-500'
                                : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => toggleMethod(method.id)}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white">{method.name}</CardTitle>
                                {selectedMethods.includes(method.id) && (
                                    <Badge className="bg-blue-600 text-white">Selected</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 mb-3">{method.description}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Intensity:</span>
                                    <div className="font-medium text-white">{method.intensity}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Volume:</span>
                                    <div className="font-medium text-white">{method.volume}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Best For:</span>
                                    <div className="font-medium text-white">{method.bestFor}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const EnhancedSessionStructure = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [activeView, setActiveView] = useState('microcycles');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Session Structure</h2>
                    <p className="text-gray-300">Design microcycles, loading parameters, and training methods</p>
                </div>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger value="microcycles" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Microcycles
                    </TabsTrigger>
                    <TabsTrigger value="loading" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Loading Parameters
                    </TabsTrigger>
                    <TabsTrigger value="methods" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Training Methods
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="microcycles" className="mt-6">
                    <MicrocycleDesign
                        assessmentData={assessmentData}
                        user={user}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </TabsContent>

                <TabsContent value="loading" className="mt-6">
                    <LoadingParametersSection
                        assessmentData={assessmentData}
                        user={user}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </TabsContent>

                <TabsContent value="methods" className="mt-6">
                    <TrainingMethodsSection
                        assessmentData={assessmentData}
                        user={user}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </TabsContent>
            </Tabs>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-2"
                >
                    ← Previous: Mesocycles
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2"
                >
                    Next: Monitoring & Recovery →
                </Button>
            </div>
        </div>
    );
};

export default EnhancedSessionStructure;
