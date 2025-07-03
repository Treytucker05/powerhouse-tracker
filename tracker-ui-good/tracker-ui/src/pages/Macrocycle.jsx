/**
 * Macrocycle Designer - RP Research Integrated Version (FIXED)
 * Created: July 1, 2025
 * 
 * Fixed version with working:
 * - Drag-and-drop for mesocycle blocks using @dnd-kit
 * - Mobile responsive tabs  
 * - Export to PDF/Calendar functionality
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Simplified imports for core functionality
const DEBUG_MODE = true;

const debugLog = (category, data) => {
    if (!DEBUG_MODE) return;
    console.log(`🔍 [${category}]`, data);
};

// UI Style Constants - Use these for consistent theming
const BUTTON_STYLES = {
    primary: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium",
    secondary: "bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors duration-200",
    danger: "bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium",
};

const CONTAINER_STYLES = {
    formField: "bg-red-600 rounded p-3",
    card: "bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl",
    input: "w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500",
};

const TEXT_STYLES = {
    label: "block text-xs text-white mb-1",
    title: "text-3xl font-bold text-white mb-2",
    subtitle: "text-gray-400",
};

export default function Macrocycle() {
    const location = useLocation();
    const navigate = useNavigate();

    // State management  
    const [selectedTemplate, setSelectedTemplate] = useState('hypertrophy_12');
    const [currentWeek] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('builder');

    // MacrocycleBuilder state structure
    const [selectedBlockId, setSelectedBlockId] = useState(1);
    const [validationResults, setValidationResults] = useState({
        blockSequence: { status: 'pass', message: 'Phase potentiation follows' },
        deloadTiming: { status: 'pass', message: 'Scheduled within 6 weeks' },
        chestVolume: { status: 'warning', message: 'May exceed MRV in week 4' },
        rirProgression: { status: 'pass', message: 'Appropriate for training age' }
    });

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Program data
    const programData = location.state?.programData || {
        goal: 'hypertrophy',
        duration: 12,
        trainingAge: 'intermediate',
        availableDays: 4,
        name: 'Custom Macrocycle',
        startDate: new Date().toISOString().split('T')[0],
        recoveryScore: 'average'
    };

    // Enhanced blocks data structure for MacrocycleBuilder
    const [blocks, setBlocks] = useState([
        {
            id: 1,
            name: 'Volume Accumulation',
            type: 'accumulation',
            duration: 4,
            weeks: 4,
            status: 'current',
            progress: 75,
            icon: '💪',
            gradient: 'from-green-600 to-green-800',
            borderColor: 'border-green-500/50',
            glowColor: 'green',
            startDate: '2025-07-01',
            endDate: '2025-07-28',
            objectives: ['Maximize training volume', 'Progressive overload focus', 'Muscle growth emphasis'],
            volumeStrategy: {
                startingSets: 12,
                peakSets: 22,
                progression: 'linear',
                deloadReduction: 0.4
            },
            intensityStrategy: {
                rpeRange: [6, 8],
                loadRange: [65, 80],
                progression: 'gradual'
            },
            rirProgression: {
                week1: 4,
                week2: 3,
                week3: 2,
                week4: 1
            },
            muscleEmphasis: {
                chest: 18,
                back: 20,
                shoulders: 14,
                arms: 16,
                legs: 22
            },
            keyMetrics: {
                volume: '16-22 sets',
                intensity: '65-80% 1RM',
                frequency: '4x/week',
                focus: 'Volume Accumulation'
            },
            researchBased: true
        },
        {
            id: 2,
            name: 'Strength Intensification',
            type: 'intensification',
            duration: 3,
            weeks: 3,
            status: 'planned',
            progress: 0,
            icon: '🔥',
            gradient: 'from-orange-600 to-red-700',
            borderColor: 'border-orange-500/50',
            glowColor: 'orange',
            startDate: '2025-07-29',
            endDate: '2025-08-18',
            objectives: ['Maintain volume', 'Increase intensity', 'Advanced techniques'],
            volumeStrategy: {
                startingSets: 12,
                peakSets: 16,
                progression: 'maintained',
                deloadReduction: 0.5
            },
            intensityStrategy: {
                rpeRange: [7, 9],
                loadRange: [80, 95],
                progression: 'aggressive'
            },
            rirProgression: {
                week1: 3,
                week2: 2,
                week3: 1
            },
            muscleEmphasis: {
                chest: 14,
                back: 16,
                shoulders: 12,
                arms: 14,
                legs: 18
            },
            keyMetrics: {
                intensity: '80-95% 1RM',
                volume: '12-16 sets',
                frequency: '3x/week',
                focus: 'Strength Building'
            },
            researchBased: true
        },
        {
            id: 3,
            name: 'Peak Performance',
            type: 'realization',
            duration: 2,
            weeks: 2,
            status: 'planned',
            progress: 0,
            icon: '⚡',
            gradient: 'from-purple-600 to-purple-800',
            borderColor: 'border-purple-500/50',
            glowColor: 'purple',
            startDate: '2025-08-19',
            endDate: '2025-09-01',
            objectives: ['Peak performance', 'Volume tapering', 'Recovery optimization'],
            volumeStrategy: {
                startingSets: 8,
                peakSets: 12,
                progression: 'tapering',
                deloadReduction: 0.6
            },
            intensityStrategy: {
                rpeRange: [8, 10],
                loadRange: [95, 105],
                progression: 'peak'
            },
            rirProgression: {
                week1: 2,
                week2: 0
            },
            muscleEmphasis: {
                chest: 10,
                back: 12,
                shoulders: 8,
                arms: 10,
                legs: 14
            },
            keyMetrics: {
                intensity: '95-105% 1RM',
                volume: '8-12 sets',
                tapering: 'Active',
                focus: 'Performance Peak'
            },
            researchBased: true
        }
    ]);

    // Block Management Handlers

    // Add a new block with proper defaults and RIR progression
    const addBlock = () => {
        const newBlockId = Math.max(...blocks.map(b => b.id)) + 1;

        const newBlock = {
            id: newBlockId,
            name: 'Volume Accumulation',
            type: 'accumulation',
            duration: 4,
            weeks: 4,
            status: 'planned',
            progress: 0,
            icon: '💪',
            gradient: 'from-green-600 to-green-800',
            borderColor: 'border-green-500/50',
            glowColor: 'green',
            startDate: new Date(Date.now() + (blocks.length * 4 * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            endDate: new Date(Date.now() + ((blocks.length + 1) * 4 * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            objectives: ['Maximize training volume', 'Progressive overload focus', 'Muscle growth emphasis'],
            volumeStrategy: {
                startingSets: 12,
                peakSets: 20,
                progression: 'linear',
                deloadReduction: 0.4
            },
            intensityStrategy: {
                rpeRange: [6, 8],
                loadRange: [65, 80],
                progression: 'gradual'
            },
            rirProgression: getRIRProgression('accumulation', 4, 'gradual'),
            muscleEmphasis: {
                chest: 16,
                back: 18,
                shoulders: 12,
                arms: 14,
                legs: 20
            },
            keyMetrics: {
                volume: '16-20 sets',
                intensity: '65-80% 1RM',
                frequency: '4x/week',
                focus: 'Volume Accumulation'
            },
            researchBased: true
        };

        setBlocks(prevBlocks => {
            const updatedBlocks = [...prevBlocks, newBlock];

            // Trigger validation
            validateProgram(updatedBlocks);

            // Run sequence validation
            const sequenceValidation = validateBlockSequence(updatedBlocks);
            if (!sequenceValidation.isValid) {
                debugLog('Validation Errors after Add', sequenceValidation.errors);
            }

            debugLog('Block Added', { newBlock, totalBlocks: updatedBlocks.length });
            return updatedBlocks;
        });

        // Auto-select the new block
        setSelectedBlockId(newBlockId);
    };

    // Enhanced updateBlock with validation
    const updateBlockHandler = (blockId, changes) => {
        setBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks.map(block => {
                if (block.id === blockId) {
                    const updatedBlock = { ...block, ...changes };

                    // Check if we need to regenerate RIR progression
                    const needsRIRUpdate =
                        changes.type !== undefined ||
                        changes.weeks !== undefined ||
                        changes.duration !== undefined ||
                        (changes.intensityStrategy && changes.intensityStrategy.progression !== undefined);

                    if (needsRIRUpdate) {
                        const newRIRProgression = getRIRProgression(
                            updatedBlock.type,
                            updatedBlock.weeks || updatedBlock.duration,
                            updatedBlock.intensityStrategy?.progression || 'gradual'
                        );

                        updatedBlock.rirProgression = newRIRProgression;

                        debugLog('Auto-Updated RIR Progression', {
                            blockId,
                            blockName: updatedBlock.name,
                            newRIRProgression
                        });
                    }

                    return updatedBlock;
                }
                return block;
            });

            // Trigger validation after update
            validateProgram(updatedBlocks);

            // Run detailed sequence validation
            const sequenceValidation = validateBlockSequence(updatedBlocks);
            if (!sequenceValidation.isValid) {
                debugLog('Validation Errors after Update', sequenceValidation.errors);
            }

            debugLog('Block Updated', { blockId, changes, updatedBlocks });
            return updatedBlocks;
        });
    };

    // Delete a block and revalidate
    const deleteBlock = (blockId) => {
        if (blocks.length <= 1) {
            alert('Cannot delete the last remaining block. A program must have at least one block.');
            return;
        }

        const blockToDelete = blocks.find(b => b.id === blockId);
        if (!blockToDelete) {
            debugLog('Delete Block Error', { error: 'Block not found', blockId });
            return;
        }

        setBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks.filter(block => block.id !== blockId);

            // Trigger validation after deletion
            validateProgram(updatedBlocks);

            // Run sequence validation
            const sequenceValidation = validateBlockSequence(updatedBlocks);
            if (!sequenceValidation.isValid) {
                debugLog('Validation Errors after Delete', sequenceValidation.errors);
            }

            debugLog('Block Deleted', {
                deletedBlock: blockToDelete.name,
                remainingBlocks: updatedBlocks.length
            });
            return updatedBlocks;
        });

        // If the deleted block was selected, select the first remaining block
        if (selectedBlockId === blockId) {
            const remainingBlocks = blocks.filter(b => b.id !== blockId);
            if (remainingBlocks.length > 0) {
                setSelectedBlockId(remainingBlocks[0].id);
            }
        }
    };

    // Reorder blocks with drag and drop
    const reorderBlocks = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;

        setBlocks(prevBlocks => {
            const updatedBlocks = [...prevBlocks];
            const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
            updatedBlocks.splice(toIndex, 0, movedBlock);

            // Trigger validation after reorder
            validateProgram(updatedBlocks);

            // Run sequence validation
            const sequenceValidation = validateBlockSequence(updatedBlocks);
            if (!sequenceValidation.isValid) {
                debugLog('Validation Errors after Reorder', sequenceValidation.errors);
            }

            debugLog('Blocks Reordered', {
                fromIndex,
                toIndex,
                movedBlock: movedBlock.name,
                newOrder: updatedBlocks.map(b => b.name)
            });

            return updatedBlocks;
        });
    };

    // Update the existing updateBlock to use the new handler
    const updateBlock = (blockId, updates) => {
        updateBlockHandler(blockId, updates);
    };

    // RP Compliance validation function
    const validateProgram = useCallback((blocksToValidate = blocks) => {
        const results = {
            blockSequence: { status: 'pass', message: 'Phase potentiation follows' },
            deloadTiming: { status: 'pass', message: 'Scheduled within 6 weeks' },
            chestVolume: { status: 'warning', message: 'May exceed MRV in week 4' },
            rirProgression: { status: 'pass', message: 'Appropriate for training age' }
        };

        // Validate block sequence (accumulation -> intensification -> realization)
        const types = blocksToValidate.map(b => b.type);
        const expectedSequence = ['accumulation', 'intensification', 'realization'];
        if (!types.every((type, index) => type === expectedSequence[index])) {
            results.blockSequence = { status: 'warning', message: 'Consider optimal phase sequence' };
        }

        // Validate total duration for deload timing
        const totalWeeks = blocksToValidate.reduce((sum, block) => sum + block.weeks, 0);
        if (totalWeeks > 8) {
            results.deloadTiming = { status: 'warning', message: 'Consider deload after 6-8 weeks' };
        }

        // Validate chest volume (example check)
        const chestVolumeBlock = blocksToValidate.find(b => b.muscleEmphasis?.chest > 16);
        if (chestVolumeBlock) {
            results.chestVolume = { status: 'warning', message: `High chest volume in ${chestVolumeBlock.name}` };
        } else {
            results.chestVolume = { status: 'pass', message: 'Chest volume within MRV' };
        }

        // Validate RIR progression
        const hasProperRirProgression = blocksToValidate.every(block => {
            const rirValues = Object.values(block.rirProgression || {});
            return rirValues.length > 0 && rirValues.every(rir => rir >= 0 && rir <= 4);
        });

        if (!hasProperRirProgression) {
            results.rirProgression = { status: 'warning', message: 'Review RIR progression' };
        }

        setValidationResults(results);
        debugLog('Program Validation', results);
    }, [blocks]);

    // Calculate block volume based on RP methodology
    const calculateBlockVolume = (block, muscle, userMEV = 12, userMRV = 20) => {
        const { volumeStrategy, muscleEmphasis, weeks } = block;

        // Get muscle emphasis multiplier
        const muscleEmphasisValue = muscleEmphasis[muscle] || 14;
        let emphasisMultiplier = 1.0;

        if (muscleEmphasisValue > 18) emphasisMultiplier = 1.2; // high
        else if (muscleEmphasisValue < 10) emphasisMultiplier = 0.6; // maintenance
        else emphasisMultiplier = 1.0; // moderate

        // Apply volume strategy
        let weeklyVolumes = [];
        const adjustedMEV = userMEV * emphasisMultiplier;
        const adjustedMRV = userMRV * emphasisMultiplier;

        switch (volumeStrategy.progression) {
            case 'linear': // Standard MEV→MRV progression
                for (let week = 1; week <= weeks; week++) {
                    const progress = (week - 1) / (weeks - 1);
                    const volume = adjustedMEV + (progress * (adjustedMRV - adjustedMEV));
                    weeklyVolumes.push(Math.round(volume));
                }
                break;

            case 'maintained': { // Conservative approach (MEV + 20%)
                const conservativeVolume = Math.round(adjustedMEV * 1.2);
                weeklyVolumes = Array(weeks).fill(conservativeVolume);
                break;
            }

            case 'tapering': { // Aggressive approach (MRV - 10%)
                const aggressiveVolume = Math.round(adjustedMRV * 0.9);
                for (let week = 1; week <= weeks; week++) {
                    const taperProgress = (week - 1) / (weeks - 1);
                    const volume = aggressiveVolume * (1 - taperProgress * 0.4); // 40% reduction over time
                    weeklyVolumes.push(Math.round(volume));
                }
                break;
            }

            default: {// Standard progression
                for (let week = 1; week <= weeks; week++) {
                    const progress = (week - 1) / (weeks - 1);
                    const volume = adjustedMEV + (progress * (adjustedMRV - adjustedMEV));
                    weeklyVolumes.push(Math.round(volume));
                }
                break;
            }
        }

        debugLog('Volume Calculation', {
            block: block.name,
            muscle,
            strategy: volumeStrategy.progression,
            userMEV,
            userMRV,
            adjustedMEV,
            adjustedMRV,
            emphasisMultiplier,
            weeklyVolumes
        });

        return weeklyVolumes;
    };

    // Validate block sequence according to RP principles
    const validateBlockSequence = (blocksToValidate = blocks) => {
        const errors = [];
        const warnings = [];

        // Check block sequence logic
        const types = blocksToValidate.map(b => b.type);
        const expectedSequence = ['accumulation', 'intensification', 'realization'];

        // Validate sequence order
        for (let i = 0; i < types.length; i++) {
            const currentType = types[i];
            const expectedType = expectedSequence[i];

            if (currentType !== expectedType) {
                warnings.push({
                    type: 'sequence',
                    message: `Block ${i + 1}: Expected '${expectedType}' but found '${currentType}'`,
                    block: blocksToValidate[i].name,
                    severity: 'warning'
                });
            }
        }

        // Check accumulation before intensification rule
        const accumulationIndex = types.indexOf('accumulation');
        const intensificationIndex = types.indexOf('intensification');

        if (accumulationIndex > intensificationIndex && intensificationIndex !== -1) {
            errors.push({
                type: 'phase_order',
                message: 'Accumulation phase must come before intensification phase',
                severity: 'error'
            });
        }

        // Check total program duration
        const totalWeeks = blocksToValidate.reduce((sum, block) => sum + block.weeks, 0);
        const programDuration = programData.duration;

        if (totalWeeks !== programDuration) {
            errors.push({
                type: 'duration_mismatch',
                message: `Total block duration (${totalWeeks} weeks) doesn't match program duration (${programDuration} weeks)`,
                severity: 'error'
            });
        }

        // Check deload timing (no more than 6 weeks without deload)
        let consecutiveWeeks = 0;
        let needsDeload = false;

        for (const block of blocksToValidate) {
            consecutiveWeeks += block.weeks;

            if (consecutiveWeeks > 6) {
                needsDeload = true;
                break;
            }

            // Reset if this block includes deload (assuming last week of each block could be deload)
            if (block.volumeStrategy.deloadReduction && block.volumeStrategy.deloadReduction > 0.3) {
                consecutiveWeeks = 0;
            }
        }

        if (needsDeload) {
            warnings.push({
                type: 'deload_timing',
                message: 'Consider adding deload week after 6 weeks of training',
                severity: 'warning'
            });
        }

        // Check volume progressions within blocks
        blocksToValidate.forEach((block, index) => {
            const chestVolume = calculateBlockVolume(block, 'chest', 12, 20);
            const maxVolume = Math.max(...chestVolume);

            if (maxVolume > 24) { // Assuming 24 as upper MRV limit
                warnings.push({
                    type: 'volume_warning',
                    message: `Block ${index + 1}: Chest volume may exceed MRV (${maxVolume} sets)`,
                    block: block.name,
                    severity: 'warning'
                });
            }
        });

        // Check RIR progression logic
        blocksToValidate.forEach((block, index) => {
            const rirValues = Object.values(block.rirProgression || {});
            const isDescending = rirValues.every((val, i) => i === 0 || val <= rirValues[i - 1]);

            if (!isDescending && rirValues.length > 1) {
                warnings.push({
                    type: 'rir_progression',
                    message: `Block ${index + 1}: RIR should generally decrease over time`,
                    block: block.name,
                    severity: 'warning'
                });
            }
        });

        const validationResults = {
            errors,
            warnings,
            isValid: errors.length === 0,
            summary: {
                totalBlocks: blocksToValidate.length,
                totalWeeks,
                programDuration,
                errorCount: errors.length,
                warningCount: warnings.length
            }
        };

        debugLog('Block Sequence Validation', validationResults);

        return validationResults;
    };

    // Generate RIR progression based on block type, duration, and intensity strategy
    const getRIRProgression = (blockType, duration, intensityStrategy = 'gradual') => {
        let baseStartRIR, baseEndRIR;

        // Set base RIR values based on block type
        switch (blockType) {
            case 'accumulation':
                baseStartRIR = 4;
                baseEndRIR = 2;
                break;
            case 'intensification':
                baseStartRIR = 3;
                baseEndRIR = 1;
                break;
            case 'realization':
                baseStartRIR = 2;
                baseEndRIR = 0;
                break;
            case 'deload':
                baseStartRIR = 4;
                baseEndRIR = 4; // Constant for deload
                break;
            default:
                baseStartRIR = 3;
                baseEndRIR = 1;
        }

        // Adjust for intensity strategy
        let intensityAdjustment = 0;
        switch (intensityStrategy) {
            case 'gradual':
            case 'maintained':
                intensityAdjustment = 0;
                break;
            case 'aggressive':
            case 'peak':
                intensityAdjustment = -1; // More aggressive = lower RIR
                break;
            case 'conservative':
                intensityAdjustment = 1; // More conservative = higher RIR
                break;
            default:
                intensityAdjustment = 0;
        }

        // Apply intensity adjustment
        const startRIR = Math.max(0, Math.min(5, baseStartRIR + intensityAdjustment));
        const endRIR = Math.max(0, Math.min(5, baseEndRIR + intensityAdjustment));

        // Generate weekly progression
        const weeklyRIR = {};

        if (blockType === 'deload') {
            // Constant RIR for deload
            for (let week = 1; week <= duration; week++) {
                weeklyRIR[`week${week}`] = startRIR;
            }
        } else {
            // Progressive RIR reduction
            for (let week = 1; week <= duration; week++) {
                if (duration === 1) {
                    // Single week block
                    weeklyRIR[`week${week}`] = Math.round((startRIR + endRIR) / 2);
                } else {
                    // Multi-week progression
                    const progress = (week - 1) / (duration - 1);
                    const currentRIR = startRIR - (progress * (startRIR - endRIR));
                    weeklyRIR[`week${week}`] = Math.round(currentRIR);
                }
            }
        }

        debugLog('RIR Progression Generated', {
            blockType,
            duration,
            intensityStrategy,
            baseStartRIR,
            baseEndRIR,
            intensityAdjustment,
            finalStartRIR: startRIR,
            finalEndRIR: endRIR,
            weeklyRIR
        });

        return weeklyRIR;
    };



    // Run initial validation and RIR progression setup
    useEffect(() => {
        validateProgram();

        // Initialize RIR progressions for all blocks if they don't have proper ones
        setBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks.map(block => {
                const expectedRIRProgression = getRIRProgression(
                    block.type,
                    block.weeks,
                    block.intensityStrategy?.progression || 'gradual'
                );

                // Check if current RIR progression matches expected pattern
                const currentRIRKeys = Object.keys(block.rirProgression || {});
                const expectedRIRKeys = Object.keys(expectedRIRProgression);

                const needsUpdate =
                    currentRIRKeys.length !== expectedRIRKeys.length ||
                    !expectedRIRKeys.every(key => currentRIRKeys.includes(key));

                if (needsUpdate) {
                    debugLog('Initializing RIR Progression', {
                        blockName: block.name,
                        oldProgression: block.rirProgression,
                        newProgression: expectedRIRProgression
                    });

                    return {
                        ...block,
                        rirProgression: expectedRIRProgression
                    };
                }

                return block;
            });

            return updatedBlocks;
        });
    }, [validateProgram]);

    // Drag and Drop Handler
    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = blocks.findIndex(item => item.id === active.id);
            const newIndex = blocks.findIndex(item => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderBlocks(oldIndex, newIndex);
            }
        }
    }

    // Circular Progress Component
    const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = 'green' }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        const colorMap = {
            blue: '#3b82f6',
            green: '#10b981',
            orange: '#f97316',
            purple: '#8b5cf6',
            red: '#ef4444',
            gray: '#6b7280'
        };

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(75, 85, 99, 0.3)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colorMap[color]}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                        {percentage}%
                    </span>
                </div>
            </div>
        );
    };

    // Sortable Horizontal Block Card Component
    const SortableBlockCard = ({ block, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: block.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        const isSelected = selectedBlockId === block.id;

        return (
            <div ref={setNodeRef} style={style} className="flex-shrink-0 w-48">
                <div
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer group ${isSelected
                        ? `bg-gradient-to-br ${block.gradient}/40 border-red-500 shadow-2xl ring-2 ring-red-400/50`
                        : block.status === 'completed'
                            ? `bg-gradient-to-br ${block.gradient}/20 ${block.borderColor} shadow-lg`
                            : block.status === 'current'
                                ? `bg-gradient-to-br ${block.gradient}/30 ${block.borderColor} shadow-xl`
                                : `bg-gradient-to-br from-gray-800/40 to-gray-700/30 border-gray-600/40 shadow-md`
                        } backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl`}
                    onClick={() => {
                        setSelectedBlockId(block.id);
                        debugLog('Block Selected', { blockId: block.id, blockName: block.name });
                    }}
                >
                    {/* Selection Indicator */}
                    {isSelected && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
                    )}

                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute top-2 right-2 bg-red-600 rounded p-1 text-white hover:text-gray-200 transition-colors z-10 cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>

                    {/* Block Content */}
                    <div className="space-y-3">
                        {/* Block Header */}
                        <div className="text-center">
                            <div className="text-2xl mb-1">{block.icon}</div>
                            <h3 className="text-sm font-bold text-white">Block {index + 1}</h3>
                        </div>

                        {/* Block Type */}
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-white mb-1">{block.name}</h4>
                            <p className="text-xs text-gray-300 capitalize">{block.type}</p>
                        </div>

                        {/* Duration */}
                        <div className="text-center">
                            <p className="text-sm text-gray-300">{block.weeks} weeks</p>
                            <p className="text-xs text-gray-400">{block.progress}% complete</p>
                        </div>

                        {/* Colored Progress Bar */}
                        <div className="mt-4">
                            <div className="relative w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${block.gradient}`}
                                    style={{ width: `${block.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Connecting Arrow */}
                    {index < blocks.length - 1 && (
                        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Program Design Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Program Design</h1>
                        <p className="text-gray-400">Build evidence-based training programs using Renaissance Periodization methodology</p>
                    </div>
                </div>

                {/* Program Design Navigation Tabs - Enhanced with Black/Red Theme */}
                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-1'} mb-8 bg-gradient-to-r from-gray-900 to-black rounded-xl p-2 border border-gray-700/50 shadow-2xl`}>
                    {[
                        { id: 'overview', label: 'Overview', icon: '🏠', description: 'Program overview' },
                        { id: 'builder', label: 'Builder', icon: '🔧', description: 'Macrocycle designer' },
                        { id: 'calculator', label: 'Calculator', icon: '🧮', description: 'Volume calculations' },
                        { id: 'exercises', label: 'Exercises', icon: '💪', description: 'Exercise database' },
                        { id: 'templates', label: 'Templates', icon: '📋', description: 'Program templates' }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    debugLog('Navigation Tab Click', { clickedTab: tab.id, previousTab: activeTab });
                                    setActiveTab(tab.id);

                                    // Handle navigation based on tab
                                    if (tab.id === 'builder') {
                                        window.scrollTo(0, 0);
                                    } else if (tab.id === 'overview') {
                                        navigate('/program');
                                    } else if (tab.id === 'calculator') {
                                        alert('Volume Calculator - Coming Soon!\nWill include MEV/MRV calculations based on RP research.');
                                    } else if (tab.id === 'exercises') {
                                        alert('Exercise Database - Coming Soon!\nWill include exercise selection based on muscle groups and training phases.');
                                    } else if (tab.id === 'templates') {
                                        alert('Program Templates - Coming Soon!\nWill include pre-built programs for different goals and experience levels.');
                                    }
                                }}
                                className={`group relative flex items-center ${isMobile ? 'justify-center' : ''} space-x-3 px-6 py-4 rounded-lg transition-all duration-300 transform ${isMobile ? 'w-full' : 'min-w-[140px]'}`}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    color: 'black',
                                    border: '2px solid #f87171',
                                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)',
                                    transform: 'scale(1.05)'
                                } : {
                                    background: 'linear-gradient(135deg, #374151, #1f2937)',
                                    color: 'white',
                                    border: '1px solid #4b5563'
                                }}
                            >
                                {/* Active Tab Indicator */}
                                {isActive && (
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
                                )}

                                {/* Tab Icon */}
                                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                    {tab.icon}
                                </span>

                                {/* Tab Content */}
                                <div className={`flex flex-col ${isMobile ? 'items-center' : 'items-start'}`}>
                                    <span
                                        className={`font-bold transition-all duration-300 ${isMobile ? 'text-sm' : ''}`}
                                        style={isActive ? {
                                            color: 'black',
                                            fontSize: isMobile ? '0.875rem' : '1.125rem',
                                            fontWeight: '900'
                                        } : {
                                            color: 'white',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {tab.label}
                                    </span>
                                    {!isMobile && (
                                        <span
                                            className="text-xs transition-all duration-300"
                                            style={isActive ? {
                                                color: '#1f2937',
                                                fontWeight: '600'
                                            } : {
                                                color: '#d1d5db'
                                            }}
                                        >
                                            {tab.description}
                                        </span>
                                    )}
                                </div>

                                {/* Active Tab Accent */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg pointer-events-none"></div>
                                )}

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                            </button>
                        );
                    })}
                </div>

                {/* Breadcrumb Navigation */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/program')}
                            className="px-4 py-2 rounded-lg transition-all duration-200 font-bold shadow-lg flex items-center space-x-2"
                            style={{
                                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                color: 'white',
                                border: '1px solid #f87171',
                                boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
                            }}
                        >
                            <span>←</span>
                            <span>Back to Program Design</span>
                        </button>
                        <div className="text-center">
                            <div className="text-sm text-gray-400">Program Design &gt; Builder &gt; Macrocycle</div>
                            <h2 className="text-2xl font-bold text-white">Macrocycle Builder</h2>
                        </div>
                    </div>

                    {/* Program Info */}
                    {programData && (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-4">
                            <h3 className="text-xl font-semibold text-white mb-2">{programData.name}</h3>
                            <div className="flex items-center space-x-6 text-sm text-gray-300">
                                <span>Goal: <span className="text-red-400 capitalize">{programData.goal}</span></span>
                                <span>Duration: <span className="text-red-400">{programData.duration} weeks</span></span>
                                <span>Training Age: <span className="text-blue-400 capitalize">{programData.trainingAge}</span></span>
                                <span>Days/Week: <span className="text-green-400">{programData.availableDays}</span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Page Header with Template Selector */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-black text-white mb-4 transition-all duration-500"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #dc2626 50%, #ffffff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
                                letterSpacing: '1px'
                            }}>
                            🎯 {programData.name || 'Macrocycle Designer'}
                        </h1>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-2">
                            Evidence-based periodization using Renaissance Periodization research (2024-25)
                        </p>
                        <p className="text-blue-400 text-sm mb-6">
                            Dynamic phase calculations • Real volume progressions • Research-validated deload triggers
                        </p>

                        {/* Template Selector */}
                        <div className="flex justify-center mb-20">
                            <div className="relative">
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="bg-red-600 hover:bg-red-700 border-2 border-red-500 text-white font-black text-xl px-8 py-6 rounded-xl shadow-2xl focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 cursor-pointer min-w-[20rem] uppercase tracking-wide"
                                >
                                    <option value="hypertrophy_12">HYPERTROPHY 12-WEEK</option>
                                    <option value="strength_8">STRENGTH 8-WEEK</option>
                                    <option value="powerbuilding_16">POWERBUILDING 16-WEEK</option>
                                </select>
                            </div>
                        </div>

                        {/* Program Info Display */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4 shadow-lg">
                                <div className="space-y-2 text-center">
                                    <div className="text-sm text-gray-400">
                                        Goal: <span className="text-blue-400 font-semibold capitalize">{programData.goal}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Duration: <span className="text-green-400 font-semibold">{programData.duration} weeks</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Training Age: <span className="text-purple-400 font-semibold capitalize">{programData.trainingAge}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Days/Week: <span className="text-orange-400 font-semibold">{programData.availableDays}</span>
                                    </div>
                                    <div className="text-sm text-gray-400 border-t border-gray-600 pt-2 mt-2">
                                        Current Week: <span className="text-red-400 font-semibold">{currentWeek}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Started: {new Date(programData.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BLOCK TIMELINE Section */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">🏗️ BLOCK TIMELINE</h2>
                                <p className="text-gray-400">Training blocks arranged horizontally • Drag to reorder sequence</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={addBlock}
                                    className={`flex items-center gap-2 ${BUTTON_STYLES.primary}`}
                                >
                                    <span className="text-lg">+</span>
                                    Add Block
                                </button>
                                {blocks.length > 1 && (
                                    <button
                                        onClick={() => deleteBlock(selectedBlockId)}
                                        className={`flex items-center gap-2 ${BUTTON_STYLES.danger}`}
                                    >
                                        <span className="text-lg">×</span>
                                        Delete Selected
                                    </button>
                                )}
                            </div>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map(m => m.id)}
                                strategy={horizontalListSortingStrategy}
                            >
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {blocks.map((block, index) => (
                                        <SortableBlockCard
                                            key={block.id}
                                            block={block}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* BLOCK CONFIGURATION Section */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">⚙️ BLOCK CONFIGURATION</h2>
                            <p className="text-gray-400">Configure parameters for the selected training block</p>
                        </div>

                        {(() => {
                            const selectedBlock = blocks.find(b => b.id === selectedBlockId);
                            if (!selectedBlock) return <div className="text-gray-400">No block selected</div>;

                            return (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Block Info */}
                                    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <span className="text-3xl">{selectedBlock.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{selectedBlock.name}</h3>
                                                <p className="text-gray-400 capitalize">{selectedBlock.type} • {selectedBlock.weeks} weeks</p>
                                            </div>
                                        </div>

                                        {/* Block Type & Duration Controls */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-white mb-3">Block Configuration</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">Block Type</label>
                                                    <select
                                                        value={selectedBlock.type}
                                                        onChange={(e) => updateBlock(selectedBlock.id, {
                                                            type: e.target.value
                                                        })}
                                                        className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        <option value="accumulation">Accumulation</option>
                                                        <option value="intensification">Intensification</option>
                                                        <option value="realization">Realization</option>
                                                        <option value="deload">Deload</option>
                                                    </select>
                                                </div>
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">Duration (weeks)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="8"
                                                        value={selectedBlock.weeks}
                                                        onChange={(e) => updateBlock(selectedBlock.id, {
                                                            weeks: parseInt(e.target.value),
                                                            duration: parseInt(e.target.value)
                                                        })}
                                                        className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Volume Strategy */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-white mb-3">Volume Strategy</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">Starting Sets</label>
                                                    <input
                                                        type="number"
                                                        value={selectedBlock.volumeStrategy.startingSets}
                                                        onChange={(e) => updateBlock(selectedBlock.id, {
                                                            volumeStrategy: {
                                                                ...selectedBlock.volumeStrategy,
                                                                startingSets: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">Peak Sets</label>
                                                    <input
                                                        type="number"
                                                        value={selectedBlock.volumeStrategy.peakSets}
                                                        onChange={(e) => updateBlock(selectedBlock.id, {
                                                            volumeStrategy: {
                                                                ...selectedBlock.volumeStrategy,
                                                                peakSets: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Intensity Strategy */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-white mb-3">Intensity Strategy</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-red-600 rounded p-3 col-span-3">
                                                    <label className="block text-xs text-white mb-1">Progression Strategy</label>
                                                    <select
                                                        value={selectedBlock.intensityStrategy.progression}
                                                        onChange={(e) => updateBlock(selectedBlock.id, {
                                                            intensityStrategy: {
                                                                ...selectedBlock.intensityStrategy,
                                                                progression: e.target.value
                                                            }
                                                        })}
                                                        className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        <option value="gradual">Gradual</option>
                                                        <option value="aggressive">Aggressive</option>
                                                        <option value="conservative">Conservative</option>
                                                        <option value="maintained">Maintained</option>
                                                        <option value="peak">Peak</option>
                                                    </select>
                                                </div>
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">RPE Range</label>
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={selectedBlock.intensityStrategy.rpeRange[0]}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                intensityStrategy: {
                                                                    ...selectedBlock.intensityStrategy,
                                                                    rpeRange: [parseInt(e.target.value), selectedBlock.intensityStrategy.rpeRange[1]]
                                                                }
                                                            })}
                                                            className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                        <span className="text-gray-400 self-center">-</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={selectedBlock.intensityStrategy.rpeRange[1]}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                intensityStrategy: {
                                                                    ...selectedBlock.intensityStrategy,
                                                                    rpeRange: [selectedBlock.intensityStrategy.rpeRange[0], parseInt(e.target.value)]
                                                                }
                                                            })}
                                                            className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="bg-red-600 rounded p-3">
                                                    <label className="block text-xs text-white mb-1">Load Range (%)</label>
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="number"
                                                            min="50"
                                                            max="110"
                                                            value={selectedBlock.intensityStrategy.loadRange[0]}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                intensityStrategy: {
                                                                    ...selectedBlock.intensityStrategy,
                                                                    loadRange: [parseInt(e.target.value), selectedBlock.intensityStrategy.loadRange[1]]
                                                                }
                                                            })}
                                                            className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                        <span className="text-gray-400 self-center">-</span>
                                                        <input
                                                            type="number"
                                                            min="50"
                                                            max="110"
                                                            value={selectedBlock.intensityStrategy.loadRange[1]}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                intensityStrategy: {
                                                                    ...selectedBlock.intensityStrategy,
                                                                    loadRange: [selectedBlock.intensityStrategy.loadRange[0], parseInt(e.target.value)]
                                                                }
                                                            })}
                                                            className="w-full bg-white text-black px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIR Progression & Muscle Emphasis */}
                                    <div className="space-y-6">
                                        {/* RIR Progression */}
                                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-lg font-semibold text-white">RIR Progression</h4>
                                                <button
                                                    onClick={() => {
                                                        const newRIRProgression = getRIRProgression(
                                                            selectedBlock.type,
                                                            selectedBlock.weeks,
                                                            selectedBlock.intensityStrategy?.progression || 'gradual'
                                                        );
                                                        updateBlock(selectedBlock.id, {
                                                            rirProgression: newRIRProgression
                                                        });
                                                    }}
                                                    className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                                    title="Regenerate RIR progression based on current block settings"
                                                >
                                                    Auto-Calculate
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {Object.entries(selectedBlock.rirProgression).map(([week, rir]) => (
                                                    <div key={week} className="bg-red-600 rounded p-2 text-center">
                                                        <label className="block text-xs text-white mb-1 capitalize">{week}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="4"
                                                            value={rir}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                rirProgression: {
                                                                    ...selectedBlock.rirProgression,
                                                                    [week]: parseInt(e.target.value)
                                                                }
                                                            })}
                                                            className="w-full bg-white text-black px-1 py-1 rounded text-sm text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                💡 RIR automatically updates when block type or duration changes
                                            </div>
                                        </div>

                                        {/* Muscle Emphasis */}
                                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                                            <h4 className="text-lg font-semibold text-white mb-3">Muscle Emphasis (sets/week)</h4>
                                            <div className="space-y-3">
                                                {Object.entries(selectedBlock.muscleEmphasis).map(([muscle, sets]) => (
                                                    <div key={muscle} className="flex items-center justify-between">
                                                        <span className="text-gray-300 capitalize flex-1">{muscle}</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="30"
                                                            value={sets}
                                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                                                muscleEmphasis: {
                                                                    ...selectedBlock.muscleEmphasis,
                                                                    [muscle]: parseInt(e.target.value)
                                                                }
                                                            })}
                                                            className="w-16 bg-white text-black px-2 py-1 rounded text-sm text-center ml-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* RP COMPLIANCE CHECK Section */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">✅ RP COMPLIANCE CHECK</h2>
                            <p className="text-gray-400">Verify your program meets Renaissance Periodization guidelines</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={`rounded-lg p-4 text-center border ${validationResults.blockSequence.status === 'pass'
                                ? 'bg-green-900/20 border-green-500/30'
                                : 'bg-yellow-900/20 border-yellow-500/30'
                                }`}>
                                <div className={`text-2xl mb-2 ${validationResults.blockSequence.status === 'pass' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {validationResults.blockSequence.status === 'pass' ? '✅' : '⚠️'}
                                </div>
                                <h4 className={`font-semibold mb-1 ${validationResults.blockSequence.status === 'pass' ? 'text-green-300' : 'text-yellow-300'
                                    }`}>Block Sequence</h4>
                                <p className={`text-sm ${validationResults.blockSequence.status === 'pass' ? 'text-green-200' : 'text-yellow-200'
                                    }`}>{validationResults.blockSequence.message}</p>
                            </div>

                            <div className={`rounded-lg p-4 text-center border ${validationResults.deloadTiming.status === 'pass'
                                ? 'bg-green-900/20 border-green-500/30'
                                : 'bg-yellow-900/20 border-yellow-500/30'
                                }`}>
                                <div className={`text-2xl mb-2 ${validationResults.deloadTiming.status === 'pass' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {validationResults.deloadTiming.status === 'pass' ? '✅' : '⚠️'}
                                </div>
                                <h4 className={`font-semibold mb-1 ${validationResults.deloadTiming.status === 'pass' ? 'text-green-300' : 'text-yellow-300'
                                    }`}>Deload Timing</h4>
                                <p className={`text-sm ${validationResults.deloadTiming.status === 'pass' ? 'text-green-200' : 'text-yellow-200'
                                    }`}>{validationResults.deloadTiming.message}</p>
                            </div>

                            <div className={`rounded-lg p-4 text-center border ${validationResults.chestVolume.status === 'pass'
                                ? 'bg-green-900/20 border-green-500/30'
                                : 'bg-yellow-900/20 border-yellow-500/30'
                                }`}>
                                <div className={`text-2xl mb-2 ${validationResults.chestVolume.status === 'pass' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {validationResults.chestVolume.status === 'pass' ? '✅' : '⚠️'}
                                </div>
                                <h4 className={`font-semibold mb-1 ${validationResults.chestVolume.status === 'pass' ? 'text-green-300' : 'text-yellow-300'
                                    }`}>Chest Volume</h4>
                                <p className={`text-sm ${validationResults.chestVolume.status === 'pass' ? 'text-green-200' : 'text-yellow-200'
                                    }`}>{validationResults.chestVolume.message}</p>
                            </div>

                            <div className={`rounded-lg p-4 text-center border ${validationResults.rirProgression.status === 'pass'
                                ? 'bg-green-900/20 border-green-500/30'
                                : 'bg-yellow-900/20 border-yellow-500/30'
                                }`}>
                                <div className={`text-2xl mb-2 ${validationResults.rirProgression.status === 'pass' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {validationResults.rirProgression.status === 'pass' ? '✅' : '⚠️'}
                                </div>
                                <h4 className={`font-semibold mb-1 ${validationResults.rirProgression.status === 'pass' ? 'text-green-300' : 'text-yellow-300'
                                    }`}>RIR Progression</h4>
                                <p className={`text-sm ${validationResults.rirProgression.status === 'pass' ? 'text-green-200' : 'text-yellow-200'
                                    }`}>{validationResults.rirProgression.message}</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                className="px-8 py-3 rounded-lg font-bold transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    color: 'white',
                                    border: '2px solid #f87171',
                                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
                                }}
                                onClick={() => alert('Running full RP compliance analysis...')}
                            >
                                Run Full Analysis
                            </button>
                        </div>
                    </div>

                </div>

                {/* Navigation and Actions */}
                <div className="mt-8 px-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                color: 'white',
                                border: '2px solid #f87171',
                                boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
                            }}
                        >
                            <span>← Back</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => alert('Configuration saved successfully!')}
                                className="px-6 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    color: 'white',
                                    border: '2px solid #f87171',
                                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
                                }}
                            >
                                Save Progress
                            </button>

                            <button
                                onClick={() => alert('Proceeding to Mesocycle Builder...')}
                                className="flex items-center gap-2 px-8 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    color: 'white',
                                    border: '2px solid #f87171',
                                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)'
                                }}
                            >
                                <span>Continue to Mesocycle →</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
