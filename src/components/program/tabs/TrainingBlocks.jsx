import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Plus, Calendar, Target, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const TrainingBlocks = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [activeView, setActiveView] = useState('phases');
    const [phases, setPhases] = useState([]);
    const [mesocycles, setMesocycles] = useState([]);
    const [selectedPhase, setSelectedPhase] = useState(null);

    // Initialize default phases based on assessment
    useEffect(() => {
        const defaultPhases = [
            {
                id: 'prep-1',
                name: 'General Preparation',
                type: 'preparatory',
                duration: '8-12 weeks',
                focus: 'Base building, movement quality, general fitness',
                color: 'blue',
                mesocycles: []
            },
            {
                id: 'prep-2',
                name: 'Specific Preparation',
                type: 'preparatory',
                duration: '6-8 weeks',
                focus: 'Sport-specific skills, targeted strength',
                color: 'green',
                mesocycles: []
            },
            {
                id: 'competition',
                name: 'Competition Phase',
                type: 'competitive',
                duration: '4-8 weeks',
                focus: 'Peak performance, competition readiness',
                color: 'red',
                mesocycles: []
            },
            {
                id: 'transition',
                name: 'Transition Phase',
                type: 'transition',
                duration: '2-4 weeks',
                focus: 'Active recovery, regeneration',
                color: 'gray',
                mesocycles: []
            }
        ];
        setPhases(defaultPhases);
    }, []);

    const mesocycleTemplates = [
        {
            name: 'Anatomical Adaptation',
            duration: '3-4 weeks',
            focus: 'Movement quality, tissue preparation',
            intensity: 'Low-Moderate',
            volume: 'Moderate-High'
        },
        {
            name: 'Hypertrophy',
            duration: '3-4 weeks',
            focus: 'Muscle mass development',
            intensity: 'Moderate',
            volume: 'High'
        },
        {
            name: 'Maximum Strength',
            duration: '2-3 weeks',
            focus: 'Neural adaptation, force production',
            intensity: 'High',
            volume: 'Low-Moderate'
        },
        {
            name: 'Power Development',
            duration: '2-3 weeks',
            focus: 'Rate of force development',
            intensity: 'High',
            volume: 'Low'
        },
        {
            name: 'Competition Prep',
            duration: '2 weeks',
            focus: 'Peak performance readiness',
            intensity: 'Variable',
            volume: 'Low'
        },
        {
            name: 'Deload/Recovery',
            duration: '1 week',
            focus: 'Recovery and regeneration',
            intensity: 'Low',
            volume: 'Low'
        }
    ];

    const addMesocycleToPhase = (phaseId, mesocycleTemplate) => {
        const newMesocycle = {
            id: `meso-${Date.now()}`,
            ...mesocycleTemplate,
            phaseId,
            order: phases.find(p => p.id === phaseId)?.mesocycles?.length || 0
        };

        setPhases(prevPhases =>
            prevPhases.map(phase =>
                phase.id === phaseId
                    ? { ...phase, mesocycles: [...(phase.mesocycles || []), newMesocycle] }
                    : phase
            )
        );
    };

    const PhaseCard = ({ phase }) => (
        <Card className="bg-gray-700 border-gray-600 hover:border-gray-500 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <div className={`w-3 h-3 rounded-full bg-${phase.color}-500`}></div>
                        {phase.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        {phase.duration}
                    </Badge>
                </div>
                <p className="text-sm text-gray-300">{phase.focus}</p>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Mesocycles</span>
                        <span className="text-sm font-medium text-white">
                            {phase.mesocycles?.length || 0}
                        </span>
                    </div>

                    {phase.mesocycles && phase.mesocycles.length > 0 && (
                        <div className="space-y-2">
                            {phase.mesocycles.map((meso, index) => (
                                <div key={meso.id} className="bg-gray-600 p-2 rounded text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-white">{meso.name}</span>
                                        <span className="text-gray-300">{meso.duration}</span>
                                    </div>
                                    <div className="text-gray-400 mt-1">{meso.focus}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPhase(phase)}
                        className="w-full text-xs"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Mesocycle
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const MesocycleSelector = () => {
        if (!selectedPhase) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Add Mesocycle to {selectedPhase.name}
                    </h3>

                    <div className="grid gap-3">
                        {mesocycleTemplates.map((template, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                                onClick={() => {
                                    addMesocycleToPhase(selectedPhase.id, template);
                                    setSelectedPhase(null);
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-white">{template.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                        {template.duration}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{template.focus}</p>
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <span>Intensity: {template.intensity}</span>
                                    <span>Volume: {template.volume}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPhase(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Training Blocks</h2>
                    <p className="text-gray-300">Design your training phases and mesocycles</p>
                </div>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger value="phases" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Training Phases
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Timeline View
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Block Analysis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="phases" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {phases.map((phase) => (
                            <PhaseCard key={phase.id} phase={phase} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Training Block Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {phases.map((phase, phaseIndex) => (
                                    <div key={phase.id} className="border-l-4 border-blue-500 pl-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-white">{phase.name}</h3>
                                            <Badge variant="secondary">{phase.duration}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-300 mb-3">{phase.focus}</p>

                                        {phase.mesocycles && phase.mesocycles.length > 0 && (
                                            <div className="ml-4 space-y-2">
                                                {phase.mesocycles.map((meso, mesoIndex) => (
                                                    <div key={meso.id} className="bg-gray-700 p-3 rounded">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-white">
                                                                {mesoIndex + 1}. {meso.name}
                                                            </span>
                                                            <span className="text-xs text-gray-300">
                                                                {meso.duration}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">{meso.focus}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Training Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {phases.map((phase) => (
                                        <div key={phase.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full bg-${phase.color}-500`}></div>
                                                <span className="text-sm text-gray-300">{phase.name}</span>
                                            </div>
                                            <span className="text-sm font-medium text-white">
                                                {phase.mesocycles?.length || 0} blocks
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Block Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Total Phases</span>
                                        <span className="font-medium text-white">{phases.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Total Mesocycles</span>
                                        <span className="font-medium text-white">
                                            {phases.reduce((sum, phase) => sum + (phase.mesocycles?.length || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Est. Duration</span>
                                        <span className="font-medium text-white">24-36 weeks</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
                    ← Previous: Periodization Design
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2"
                >
                    Next: Session Structure →
                </Button>
            </div>

            {/* Mesocycle Selector Modal */}
            <MesocycleSelector />
        </div>
    );
};

export default TrainingBlocks;
