import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Play, Eye, FileText, Download, Calendar, TrendingUp } from 'lucide-react';

// Import the original component
import Implementation from './Implementation';

// Program Preview Section
const ProgramPreviewSection = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [previewData, setPreviewData] = useState({
        weeks: [],
        summary: {
            totalWeeks: 0,
            trainingDays: 0,
            totalSessions: 0,
            estimatedHours: 0
        }
    });

    // Mock program preview data
    const generatePreview = () => {
        const mockWeeks = Array.from({ length: 12 }, (_, weekIndex) => ({
            week: weekIndex + 1,
            focus: weekIndex < 4 ? 'Accumulation' : weekIndex < 8 ? 'Intensification' : 'Realization',
            sessions: [
                { day: 'Monday', type: 'Upper Body', duration: 90 },
                { day: 'Tuesday', type: 'Lower Body', duration: 90 },
                { day: 'Thursday', type: 'Upper Body', duration: 90 },
                { day: 'Friday', type: 'Lower Body', duration: 90 }
            ],
            totalVolume: Math.floor(Math.random() * 20) + 40,
            avgIntensity: Math.floor(Math.random() * 20) + 70
        }));

        setPreviewData({
            weeks: mockWeeks,
            summary: {
                totalWeeks: 12,
                trainingDays: 4,
                totalSessions: 48,
                estimatedHours: 72
            }
        });
    };

    React.useEffect(() => {
        generatePreview();
    }, []);

    const exportProgram = (format) => {
        // Mock export functionality
        alert(`Exporting program as ${format}...`);
    };

    return (
        <div className="space-y-6">
            {/* Program Summary */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5" />
                        Program Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{previewData.summary.totalWeeks}</div>
                            <div className="text-sm text-gray-300">Total Weeks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{previewData.summary.trainingDays}</div>
                            <div className="text-sm text-gray-300">Days/Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">{previewData.summary.totalSessions}</div>
                            <div className="text-sm text-gray-300">Total Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{previewData.summary.estimatedHours}h</div>
                            <div className="text-sm text-gray-300">Est. Time</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Download className="w-5 h-5" />
                        Export Program
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() => exportProgram('PDF')}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            PDF
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => exportProgram('Excel')}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Excel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => exportProgram('JSON')}
                            className="flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            JSON
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Breakdown */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Calendar className="w-5 h-5" />
                        Weekly Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {previewData.weeks.map((week) => (
                            <div key={week.week} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-white">Week {week.week}</h4>
                                    <Badge
                                        className={
                                            week.focus === 'Accumulation' ? 'bg-blue-600' :
                                                week.focus === 'Intensification' ? 'bg-orange-600' : 'bg-red-600'
                                        }
                                    >
                                        {week.focus}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <span className="text-sm text-gray-400">Volume:</span>
                                        <div className="font-medium text-white">{week.totalVolume} sets</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-400">Avg Intensity:</span>
                                        <div className="font-medium text-white">{week.avgIntensity}%</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {week.sessions.map((session, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-300">{session.day}: {session.type}</span>
                                            <span className="text-gray-400">{session.duration} min</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const EnhancedImplementation = ({ assessmentData, user, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [activeView, setActiveView] = useState('implementation');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Implementation</h2>
                    <p className="text-gray-300">Execute your program and track progress</p>
                </div>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger value="implementation" className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Program Execution
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Program Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="implementation" className="mt-6">
                    <Implementation
                        assessmentData={assessmentData}
                        user={user}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                    <ProgramPreviewSection
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
                    ← Previous: Monitoring & Recovery
                </Button>
                <Button
                    onClick={() => alert('Program Complete! Ready to start training.')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                    Complete Program 🎉
                </Button>
            </div>
        </div>
    );
};

export default EnhancedImplementation;
