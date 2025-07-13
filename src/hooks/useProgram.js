import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Custom hook for program management
 * Provides access to current program state and program-related actions
 * @returns {Object} - Program state and actions
 */
export const useProgram = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useProgram must be used within an AppContext provider');
    }

    const {
        currentProgram,
        loading,
        errors,
        dispatch,
        updateProgram,
        saveProgram,
        clearProgram,
        setLoading,
        setError,
        clearError
    } = context;

    /**
     * Save or update a program
     * @param {Object} programData - Program data to save
     * @returns {Promise<Object>} - Saved program object
     */
    const handleSaveProgram = async (programData) => {
        try {
            setLoading('program', true);
            clearError('program');

            const savedProgram = await saveProgram(programData);
            return savedProgram;
        } catch (error) {
            console.error('Error saving program:', error);
            setError('program', error.message || 'Failed to save program');
            throw error;
        } finally {
            setLoading('program', false);
        }
    };

    /**
     * Update the current program with partial data
     * @param {Object} updates - Partial program data to update
     * @returns {Promise<Object>} - Updated program object
     */
    const handleUpdateProgram = async (updates) => {
        try {
            setLoading('program', true);
            clearError('program');

            if (!currentProgram) {
                throw new Error('No current program to update');
            }

            const updatedProgram = await updateProgram({
                ...currentProgram,
                ...updates,
                updatedAt: new Date().toISOString()
            });

            return updatedProgram;
        } catch (error) {
            console.error('Error updating program:', error);
            setError('program', error.message || 'Failed to update program');
            throw error;
        } finally {
            setLoading('program', false);
        }
    };

    /**
     * Add a new block to the current program
     * @param {Object} blockData - Block data to add
     * @returns {Promise<Object>} - Updated program with new block
     */
    const addBlock = async (blockData) => {
        try {
            if (!currentProgram) {
                throw new Error('No current program to add block to');
            }

            const newBlock = {
                id: `block_${Date.now()}`,
                order: currentProgram.blocks?.length || 0,
                ...blockData
            };

            const updatedBlocks = [...(currentProgram.blocks || []), newBlock];

            return await handleUpdateProgram({
                blocks: updatedBlocks,
                totalDuration: updatedBlocks.reduce((sum, block) => sum + (block.duration || 0), 0)
            });
        } catch (error) {
            console.error('Error adding block:', error);
            throw error;
        }
    };

    /**
     * Update a specific block in the current program
     * @param {string} blockId - ID of the block to update
     * @param {Object} blockUpdates - Updates to apply to the block
     * @returns {Promise<Object>} - Updated program
     */
    const updateBlock = async (blockId, blockUpdates) => {
        try {
            if (!currentProgram || !currentProgram.blocks) {
                throw new Error('No current program or blocks to update');
            }

            const updatedBlocks = currentProgram.blocks.map(block =>
                block.id === blockId
                    ? { ...block, ...blockUpdates }
                    : block
            );

            return await handleUpdateProgram({
                blocks: updatedBlocks,
                totalDuration: updatedBlocks.reduce((sum, block) => sum + (block.duration || 0), 0)
            });
        } catch (error) {
            console.error('Error updating block:', error);
            throw error;
        }
    };

    /**
     * Remove a block from the current program
     * @param {string} blockId - ID of the block to remove
     * @returns {Promise<Object>} - Updated program
     */
    const removeBlock = async (blockId) => {
        try {
            if (!currentProgram || !currentProgram.blocks) {
                throw new Error('No current program or blocks to remove');
            }

            const updatedBlocks = currentProgram.blocks
                .filter(block => block.id !== blockId)
                .map((block, index) => ({ ...block, order: index })); // Reorder

            return await handleUpdateProgram({
                blocks: updatedBlocks,
                totalDuration: updatedBlocks.reduce((sum, block) => sum + (block.duration || 0), 0)
            });
        } catch (error) {
            console.error('Error removing block:', error);
            throw error;
        }
    };

    /**
     * Reorder blocks in the current program
     * @param {Array} newBlockOrder - Array of block IDs in new order
     * @returns {Promise<Object>} - Updated program
     */
    const reorderBlocks = async (newBlockOrder) => {
        try {
            if (!currentProgram || !currentProgram.blocks) {
                throw new Error('No current program or blocks to reorder');
            }

            const reorderedBlocks = newBlockOrder
                .map(blockId => currentProgram.blocks.find(block => block.id === blockId))
                .filter(Boolean) // Remove any null/undefined blocks
                .map((block, index) => ({ ...block, order: index }));

            return await handleUpdateProgram({
                blocks: reorderedBlocks
            });
        } catch (error) {
            console.error('Error reordering blocks:', error);
            throw error;
        }
    };

    /**
     * Clone the current program with a new name
     * @param {string} newName - Name for the cloned program
     * @returns {Promise<Object>} - New cloned program
     */
    const cloneProgram = async (newName) => {
        try {
            if (!currentProgram) {
                throw new Error('No current program to clone');
            }

            const clonedProgram = {
                ...currentProgram,
                id: `program_${Date.now()}`,
                name: newName || `${currentProgram.name} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
                blocks: currentProgram.blocks?.map(block => ({
                    ...block,
                    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                }))
            };

            return await handleSaveProgram(clonedProgram);
        } catch (error) {
            console.error('Error cloning program:', error);
            throw error;
        }
    };

    /**
     * Get program statistics and progress
     * @returns {Object} - Program statistics
     */
    const getProgramStats = () => {
        if (!currentProgram) {
            return {
                totalDuration: 0,
                totalBlocks: 0,
                averageBlockDuration: 0,
                blockTypes: {},
                totalVolume: 0,
                isComplete: false,
                progress: 0
            };
        }

        const { blocks = [], totalDuration = 0 } = currentProgram;

        // Calculate block type distribution
        const blockTypes = blocks.reduce((acc, block) => {
            const type = block.type || 'other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        // Calculate total volume across all blocks
        const totalVolume = blocks.reduce((sum, block) => {
            const blockVolume = block.parameters?.volume?.sets || 0;
            const blockDuration = block.duration || 0;
            return sum + (blockVolume * blockDuration);
        }, 0);

        // Calculate average block duration
        const averageBlockDuration = blocks.length > 0
            ? Math.round(totalDuration / blocks.length * 10) / 10
            : 0;

        return {
            totalDuration,
            totalBlocks: blocks.length,
            averageBlockDuration,
            blockTypes,
            totalVolume,
            isComplete: currentProgram.isActive === false,
            progress: 0, // TODO: Calculate based on completed sessions
            createdAt: currentProgram.createdAt,
            lastUpdated: currentProgram.updatedAt
        };
    };

    /**
     * Validate program structure and parameters
     * @returns {Object} - Validation result
     */
    const validateProgram = () => {
        if (!currentProgram) {
            return {
                isValid: false,
                errors: ['No program to validate'],
                warnings: [],
                suggestions: []
            };
        }

        const errors = [];
        const warnings = [];
        const suggestions = [];

        // Basic program validation
        if (!currentProgram.name || currentProgram.name.trim().length === 0) {
            errors.push('Program name is required');
        }

        if (!currentProgram.blocks || currentProgram.blocks.length === 0) {
            errors.push('Program must have at least one block');
        }

        // Block validation
        if (currentProgram.blocks) {
            currentProgram.blocks.forEach((block, index) => {
                if (!block.name) {
                    warnings.push(`Block ${index + 1} is missing a name`);
                }

                if (!block.duration || block.duration < 1) {
                    errors.push(`Block ${index + 1} must have a duration of at least 1 week`);
                }

                if (!block.type) {
                    warnings.push(`Block ${index + 1} is missing a type`);
                }

                if (!block.parameters) {
                    warnings.push(`Block ${index + 1} is missing parameters`);
                }
            });
        }

        // Program duration validation
        if (currentProgram.totalDuration && currentProgram.totalDuration < 4) {
            suggestions.push('Programs shorter than 4 weeks may not provide optimal adaptations');
        } else if (currentProgram.totalDuration && currentProgram.totalDuration > 24) {
            suggestions.push('Programs longer than 24 weeks may benefit from being split into phases');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions
        };
    };

    return {
        // State
        currentProgram,
        loading: loading.program,
        error: errors.program,

        // Core actions
        saveProgram: handleSaveProgram,
        updateProgram: handleUpdateProgram,
        clearProgram,

        // Block management
        addBlock,
        updateBlock,
        removeBlock,
        reorderBlocks,

        // Utility actions
        cloneProgram,
        getProgramStats,
        validateProgram,

        // Loading and error management
        setLoading: (value) => setLoading('program', value),
        clearError: () => clearError('program'),

        // Direct dispatch access for advanced usage
        dispatch
    };
};

export default useProgram;
