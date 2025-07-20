import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { User, Target, TrendingUp, FileText, Settings } from 'lucide-react';

// Import the original components
import GoalsAndNeeds from './GoalsAndNeeds';

// Import legacy component functionality (we'll need to adapt this)
const ProgramOverviewSection = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [selectedModel, setSelectedModel] = useState('');
    const [programData, setProgramData] = useState({
        name: '',
        duration: '',
        frequency: '',
        focus: ''
    });

    const trainingModels = [
        {
            id: 'conjugate',
            name: 'Conjugate',
            description: 'High frequency, varied intensity approach with rotating exercises',
            bestFor: 'Advanced athletes, powerlifters'
        },
        {
            id: 'block_periodization',
            name: 'Block Periodization',
            description: 'Sequential focused training blocks with specific adaptations',
            bestFor: 'Intermediate to advanced, specific sport preparation'
        },
        {
            id: 'daily_undulating',
            name: 'Daily Undulating Periodization',
            description: 'Varying intensity and volume within each training week',
            bestFor: 'Intermediate athletes, general strength and hypertrophy'
        },
        {
            id: 'linear',
            name: 'Linear Periodization',
            description: 'Progressive increase in intensity with decreased volume over time',
            bestFor: 'Beginners to intermediate, strength focus'
        }
    ];

    const handleModelSelect = (modelId) => {
        setSelectedModel(modelId);
    };

    const handleProgramDataChange = (field, value) => {
        setProgramData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Program Basic Information */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5" />
                        Program Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Program Name
                            </label>
                            <input
                                type="text"
                                value={programData.name}
                                onChange={(e) => handleProgramDataChange('name', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter program name..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Duration (weeks)
                            </label>
                            <input
                                type="number"
                                value={programData.duration}
                                onChange={(e) => handleProgramDataChange('duration', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Frequency
                            </label>
                            <select
                                value={programData.frequency}
                                onChange={(e) => handleProgramDataChange('frequency', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select frequency...</option>
                                <option value="3">3 days/week</option>
                                <option value="4">4 days/week</option>
                                <option value="5">5 days/week</option>
                                <option value="6">6 days/week</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Primary Focus
                            </label>
                            <select
                                value={programData.focus}
                                onChange={(e) => handleProgramDataChange('focus', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select focus...</option>
                                <option value="strength">Strength</option>
                                <option value="hypertrophy">Hypertrophy</option>
                                <option value="power">Power</option>
                                <option value="endurance">Endurance</option>
                                <option value="general">General Fitness</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Training Model Selection */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Settings className="w-5 h-5" />
                        Training Model Selection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {trainingModels.map((model) => (
                            <div
                                key={model.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedModel === model.id
                                        ? 'border-blue-500 bg-blue-900/20'
                                        : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                onClick={() => handleModelSelect(model.id)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-white">{model.name}</h4>
                                    {selectedModel === model.id && (
                                        <Badge className="bg-blue-600 text-white">Selected</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{model.description}</p>
                                <p className="text-xs text-gray-400">Best for: {model.bestFor}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const EnhancedAssessmentGoals = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [activeView, setActiveView] = useState('goals');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessment & Goals</h2>
                    <p className="text-gray-300">Complete athlete assessment and program setup</p>
                </div>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger value="goals" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Goals & Needs Assessment
                    </TabsTrigger>
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Program Overview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="goals" className="mt-6">
                    <GoalsAndNeeds
                        assessmentData={assessmentData}
                        user={user}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                    <ProgramOverviewSection
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
                    ← Previous
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2"
                >
                    Next: Periodization Design →
                </Button>
            </div>
        </div>
    );
};

export default EnhancedAssessmentGoals;
