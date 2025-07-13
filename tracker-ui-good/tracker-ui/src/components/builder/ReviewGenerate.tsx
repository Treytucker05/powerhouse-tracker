import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext';
import { calculateMacrocycleVolumeProgression } from '../../lib/algorithms/volumeProgression';
import { calculatePersonalizedVolume } from '../../lib/algorithms/rpAlgorithms';

interface ValidationResult {
    type: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
}

interface ExportFormat {
    format: 'json' | 'csv' | 'pdf' | 'mesocycle';
    name: string;
    description: string;
}

const ReviewGenerate: React.FC = () => {
    const { state, dispatch } = useBuilder();
    const { programDetails, blocks, specialization } = state;

    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [volumeProgression, setVolumeProgression] = useState<any>(null);
    const [selectedExportFormat, setSelectedExportFormat] = useState<string>('mesocycle');
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    // Export formats
    const exportFormats: ExportFormat[] = [
        {
            format: 'mesocycle',
            name: 'Mesocycle Builder',
            description: 'Export to mesocycle builder for detailed week-by-week programming'
        },
        {
            format: 'json',
            name: 'JSON Data',
            description: 'Raw program data for backup or external tools'
        },
        {
            format: 'csv',
            name: 'CSV Spreadsheet',
            description: 'Import into Excel or Google Sheets'
        },
        {
            format: 'pdf',
            name: 'PDF Report',
            description: 'Printable program overview and progression charts'
        }
    ];

    // Calculate volume progression and validate program
    useEffect(() => {
        if (blocks.length > 0) {
            const specializationMuscles = specialization && specialization !== 'None'
                ? specialization.split(',').map(s => s.trim().toLowerCase())
                : [];

            const progression = calculateMacrocycleVolumeProgression(
                programDetails,
                blocks,
                specializationMuscles
            );

            setVolumeProgression(progression);

            // Validate the program
            const validations = validateProgram(progression, programDetails, blocks);
            setValidationResults(validations);
        }
    }, [programDetails, blocks, specialization]);

    // Program validation logic
    const validateProgram = (progression: any, details: any, blocks: any[]): ValidationResult[] => {
        const validations: ValidationResult[] = [];

        // Check program duration
        const totalWeeks = blocks.reduce((sum, block) => sum + block.weeks, 0);
        if (totalWeeks < 8) {
            validations.push({
                type: 'warning',
                title: 'Short Program Duration',
                message: `${totalWeeks} weeks may be insufficient for significant adaptations. Consider extending to 8-12 weeks.`,
                severity: 'medium'
            });
        }

        // Check deload frequency
        const deloadBlocks = blocks.filter(block => block.type === 'deload');
        if (totalWeeks > 8 && deloadBlocks.length === 0) {
            validations.push({
                type: 'error',
                title: 'Missing Deload Phase',
                message: 'Programs longer than 8 weeks should include at least one deload week to prevent overtraining.',
                severity: 'high'
            });
        }

        // Check systemic load
        if (progression?.systemicLoad) {
            const extremeWeeks = progression.systemicLoad.filter((week: any) => week.category === 'extreme');
            if (extremeWeeks.length > 2) {
                validations.push({
                    type: 'warning',
                    title: 'High Systemic Load',
                    message: `${extremeWeeks.length} weeks show extreme training load. Consider volume reduction or additional deloads.`,
                    severity: 'high'
                });
            }
        }

        // Check specialization balance
        const specializationMuscles = specialization?.split(',').map(s => s.trim()) || [];
        if (specializationMuscles.length > 3) {
            validations.push({
                type: 'warning',
                title: 'Excessive Specialization',
                message: 'More than 3 specialized muscle groups may exceed recovery capacity and limit results.',
                severity: 'medium'
            });
        }

        // Check training frequency vs experience
        if (details.trainingExperience === 'beginner' && details.trainingDaysPerWeek > 4) {
            validations.push({
                type: 'info',
                title: 'High Training Frequency',
                message: 'Beginners typically respond well to 3-4 training days per week. Consider recovery capacity.',
                severity: 'low'
            });
        }

        // Check diet phase alignment
        if (details.dietPhase === 'cut' && specializationMuscles.length > 1) {
            validations.push({
                type: 'warning',
                title: 'Specialization During Cut',
                message: 'Specializing multiple muscle groups during a cut may impair recovery and results.',
                severity: 'medium'
            });
        }

        return validations;
    };

    // Handle export
    const handleExport = async () => {
        setIsExporting(true);

        try {
            const exportData = {
                programDetails,
                blocks,
                specialization,
                volumeProgression,
                createdAt: new Date().toISOString(),
                format: selectedExportFormat
            };

            switch (selectedExportFormat) {
                case 'mesocycle':
                    // Store export data for mesocycle builder
                    localStorage.setItem('macrocycle_export', JSON.stringify(exportData));
                    // TODO: Implement navigation to mesocycle builder
                    console.log('Mesocycle export ready:', exportData);
                    break;

                case 'json':
                    downloadFile(JSON.stringify(exportData, null, 2), `${programDetails.name}_macrocycle.json`, 'application/json');
                    break;

                case 'csv':
                    const csvData = convertToCSV(exportData);
                    downloadFile(csvData, `${programDetails.name}_macrocycle.csv`, 'text/csv');
                    break;

                case 'pdf':
                    // For now, just download JSON - PDF generation would require additional libraries
                    downloadFile(JSON.stringify(exportData, null, 2), `${programDetails.name}_macrocycle.json`, 'application/json');
                    break;
            }

            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Helper function to download file
    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Convert data to CSV format
    const convertToCSV = (data: any): string => {
        const lines: string[] = [];
        lines.push('Week,Block Type,Muscle Group,Volume (Sets),RIR,Intensity %');

        if (data.volumeProgression?.weeklyProgression) {
            Object.entries(data.volumeProgression.weeklyProgression).forEach(([muscle, weeks]: [string, any]) => {
                weeks.forEach((week: any) => {
                    lines.push(`${week.week},${week.blockType},${muscle},${week.volume},${week.rir},${week.intensity}`);
                });
            });
        }

        return lines.join('\n');
    };

    // Handle navigation
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 3.5 });
    };

    const handleStartOver = () => {
        dispatch({ type: 'RESET_BUILDER' });
    };

    // Get validation icon and color
    const getValidationStyle = (type: string) => {
        switch (type) {
            case 'error':
                return { color: 'text-red-400', bg: 'bg-red-900/20 border-red-700', icon: '⚠️' };
            case 'warning':
                return { color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700', icon: '⚠️' };
            case 'info':
                return { color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700', icon: 'ℹ️' };
            default:
                return { color: 'text-gray-400', bg: 'bg-gray-900/20 border-gray-700', icon: '•' };
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Review & Generate</h1>
                    <p className="text-gray-400">Step 4 of 4 - Validate and export your macrocycle</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-6">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Program Summary */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Program Summary</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-4">Program Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white font-medium">{programDetails.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="text-white font-medium">{programDetails.duration} weeks</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Experience:</span>
                                        <span className="text-white font-medium capitalize">{programDetails.trainingExperience}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Diet Phase:</span>
                                        <span className="text-white font-medium capitalize">{programDetails.dietPhase}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Training Days:</span>
                                        <span className="text-white font-medium">{programDetails.trainingDaysPerWeek}/week</span>
                                    </div>
                                </div>
                            </div>

                            {/* Volume Summary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-4">Volume Summary</h3>
                                {volumeProgression && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Sets:</span>
                                            <span className="text-white font-medium">{volumeProgression.totalSets}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Specialized Muscles:</span>
                                            <span className="text-white font-medium">{volumeProgression.specializationMuscles.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Weeks:</span>
                                            <span className="text-white font-medium">{volumeProgression.totalWeeks}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Avg Weekly Sets:</span>
                                            <span className="text-white font-medium">
                                                {Math.round(volumeProgression.totalSets / volumeProgression.totalWeeks)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Block Structure */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Block Structure</h2>
                        <div className="space-y-4">
                            {blocks.map((block, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-4 h-4 rounded-full ${block.type === 'accumulation' ? 'bg-blue-500' :
                                            block.type === 'intensification' ? 'bg-yellow-500' :
                                                block.type === 'realization' ? 'bg-red-500' :
                                                    'bg-gray-500'
                                            }`}></div>
                                        <div>
                                            <p className="text-white font-medium">{block.name}</p>
                                            <p className="text-gray-400 text-sm capitalize">{block.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">{block.weeks} weeks</p>
                                        <p className="text-gray-400 text-sm">
                                            {block.rirRange[0]}-{block.rirRange[1]} RIR
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Validation Results */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Program Validation</h2>

                        {validationResults.length === 0 ? (
                            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-400">✅</span>
                                    <span className="text-green-300 font-medium">Program validation passed!</span>
                                </div>
                                <p className="text-green-400 text-sm mt-2">
                                    Your program meets all RP guidelines and is ready for implementation.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {validationResults.map((result, index) => {
                                    const style = getValidationStyle(result.type);
                                    return (
                                        <div key={index} className={`${style.bg} border rounded-lg p-4`}>
                                            <div className="flex items-start space-x-3">
                                                <span className="text-xl">{style.icon}</span>
                                                <div>
                                                    <h3 className={`font-medium ${style.color}`}>{result.title}</h3>
                                                    <p className="text-gray-300 text-sm mt-1">{result.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Export Options */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Export Program</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exportFormats.map((format) => (
                                    <button
                                        key={format.format}
                                        onClick={() => setSelectedExportFormat(format.format)}
                                        className={`text-left p-4 rounded-lg border-2 transition-all ${selectedExportFormat === format.format
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                            }`}
                                    >
                                        <h3 className="font-medium text-white mb-2">{format.name}</h3>
                                        <p className="text-gray-400 text-sm">{format.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${isExporting
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 transform hover:scale-105'
                                        } text-white`}
                                >
                                    {isExporting ? 'Exporting...' : `Export as ${exportFormats.find(f => f.format === selectedExportFormat)?.name}`}
                                </button>

                                {exportSuccess && (
                                    <div className="mt-4 bg-green-900/20 border border-green-700 rounded-lg p-3">
                                        <p className="text-green-300 text-sm">✅ Export successful!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Volume Distribution
                        </button>

                        <button
                            onClick={handleStartOver}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                        >
                            Start New Program
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewGenerate;
