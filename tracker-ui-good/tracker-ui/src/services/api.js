import { supabase, getCurrentUserId } from '../lib/api/supabaseClient';
import { toast } from 'react-toastify';

/**
 * ProgramService - Data abstraction layer for program management
 * Handles saving/loading programs with Supabase + localStorage sync
 */
class ProgramService {
    constructor() {
        this.STORAGE_PREFIX = 'program_';
        this.PROGRAMS_INDEX_KEY = 'programs_index';
    }

    /**
     * Save program to both localStorage and Supabase
     * @param {Object} program - Program data to save
     * @returns {Promise<Object>} - Saved program with updated metadata
     */
    async saveProgram(program) {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                console.warn('No user ID available for Supabase sync');
            }

            // Validate program data
            if (!program || !program.name) {
                throw new Error('Program name is required');
            }

            // Prepare program data with metadata
            const programData = {
                ...program,
                id: program.id || `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: userId || 'anonymous',
                updatedAt: new Date().toISOString(),
                createdAt: program.createdAt || new Date().toISOString(),
                version: (program.version || 0) + 1
            };

            // Save to localStorage first (guaranteed to work)
            const localSaveSuccess = this._saveToLocalStorage(programData);
            if (!localSaveSuccess) {
                throw new Error('Failed to save to local storage');
            }

            // Attempt Supabase save with conflict handling
            let supabaseResult = null;
            if (userId) {
                try {
                    supabaseResult = await this._saveToSupabase(programData, userId);
                } catch (supabaseError) {
                    console.warn('Supabase save failed, continuing with localStorage:', supabaseError);

                    // Handle common conflicts
                    if (supabaseError.code === '23505') { // Unique constraint violation
                        toast.warning('Program name already exists. Using local version.');
                    } else if (supabaseError.code === 'PGRST301') { // Row level security
                        toast.warning('Insufficient permissions. Saved locally only.');
                    } else {
                        toast.warning('Cloud sync failed. Program saved locally.');
                    }
                }
            }

            // Success notification
            const syncStatus = supabaseResult ? 'synced to cloud' : 'saved locally';
            toast.success(`Program "${programData.name}" ${syncStatus} successfully`);

            return {
                ...programData,
                syncedToSupabase: !!supabaseResult,
                lastSyncAt: supabaseResult ? new Date().toISOString() : null
            };

        } catch (error) {
            console.error('Failed to save program:', error);
            toast.error(`Failed to save program: ${error.message}`);
            throw error;
        }
    }

    /**
     * Load program by ID - try Supabase first, fallback to localStorage
     * @param {string} programId - Program ID to load
     * @returns {Promise<Object|null>} - Program data or null if not found
     */
    async loadProgram(programId) {
        try {
            if (!programId) {
                throw new Error('Program ID is required');
            }

            const userId = getCurrentUserId();
            let programData = null;

            // Try Supabase first if user is authenticated
            if (userId) {
                try {
                    programData = await this._loadFromSupabase(programId, userId);
                    if (programData) {
                        // Update localStorage with latest from Supabase
                        this._saveToLocalStorage(programData);
                        return programData;
                    }
                } catch (supabaseError) {
                    console.warn('Supabase load failed, trying localStorage:', supabaseError);
                }
            }

            // Fallback to localStorage
            programData = this._loadFromLocalStorage(programId);
            if (programData) {
                // Check if this is an outdated local copy
                if (userId && !programData.syncedToSupabase) {
                    toast.info('Loading offline version of program');
                }
                return programData;
            }

            // Not found anywhere
            toast.error(`Program "${programId}" not found`);
            return null;

        } catch (error) {
            console.error('Failed to load program:', error);
            toast.error(`Failed to load program: ${error.message}`);
            return null;
        }
    }

    /**
     * Load all programs for the current user
     * @returns {Promise<Array>} - Array of program summaries
     */
    async loadAllPrograms() {
        try {
            const userId = getCurrentUserId();
            let programs = [];

            // Try Supabase first
            if (userId) {
                try {
                    programs = await this._loadAllFromSupabase(userId);
                    if (programs.length > 0) {
                        // Update local index
                        this._updateLocalIndex(programs);
                        return programs;
                    }
                } catch (supabaseError) {
                    console.warn('Supabase load all failed, trying localStorage:', supabaseError);
                }
            }

            // Fallback to localStorage
            programs = this._loadAllFromLocalStorage();
            if (programs.length === 0) {
                toast.info('No programs found');
            }

            return programs;

        } catch (error) {
            console.error('Failed to load programs:', error);
            toast.error('Failed to load programs');
            return [];
        }
    }

    /**
     * Delete program from both storage locations
     * @param {string} programId - Program ID to delete
     * @returns {Promise<boolean>} - Success status
     */
    async deleteProgram(programId) {
        try {
            if (!programId) {
                throw new Error('Program ID is required');
            }

            const userId = getCurrentUserId();
            let success = false;

            // Delete from Supabase first
            if (userId) {
                try {
                    await this._deleteFromSupabase(programId, userId);
                    success = true;
                } catch (supabaseError) {
                    console.warn('Supabase delete failed:', supabaseError);
                }
            }

            // Delete from localStorage
            const localDeleteSuccess = this._deleteFromLocalStorage(programId);

            if (success || localDeleteSuccess) {
                toast.success('Program deleted successfully');
                return true;
            } else {
                throw new Error('Failed to delete from both storage locations');
            }

        } catch (error) {
            console.error('Failed to delete program:', error);
            toast.error(`Failed to delete program: ${error.message}`);
            return false;
        }
    }

    /**
     * Check sync status between local and cloud storage
     * @param {string} programId - Program ID to check
     * @returns {Promise<Object>} - Sync status information
     */
    async checkSyncStatus(programId) {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                return { synced: false, reason: 'No user authenticated' };
            }

            const localProgram = this._loadFromLocalStorage(programId);
            const cloudProgram = await this._loadFromSupabase(programId, userId);

            if (!localProgram && !cloudProgram) {
                return { synced: false, reason: 'Program not found' };
            }

            if (!localProgram) {
                return { synced: false, reason: 'Missing local copy' };
            }

            if (!cloudProgram) {
                return { synced: false, reason: 'Missing cloud copy' };
            }

            const localVersion = localProgram.version || 0;
            const cloudVersion = cloudProgram.version || 0;

            if (localVersion === cloudVersion) {
                return { synced: true, version: localVersion };
            } else {
                return {
                    synced: false,
                    reason: 'Version mismatch',
                    localVersion,
                    cloudVersion,
                    needsSync: true
                };
            }

        } catch (error) {
            console.error('Failed to check sync status:', error);
            return { synced: false, reason: error.message };
        }
    }

    // Private methods for storage operations

    _saveToLocalStorage(program) {
        try {
            const key = `${this.STORAGE_PREFIX}${program.id}`;
            localStorage.setItem(key, JSON.stringify({
                ...program,
                lastUpdated: new Date().toISOString()
            }));

            // Update programs index
            this._updateLocalIndex([program]);
            return true;
        } catch (error) {
            console.error('LocalStorage save failed:', error);
            return false;
        }
    }

    _loadFromLocalStorage(programId) {
        try {
            const key = `${this.STORAGE_PREFIX}${programId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('LocalStorage load failed:', error);
            return null;
        }
    }

    _deleteFromLocalStorage(programId) {
        try {
            const key = `${this.STORAGE_PREFIX}${programId}`;
            localStorage.removeItem(key);

            // Update index
            const index = this._getLocalIndex();
            const updatedIndex = index.filter(p => p.id !== programId);
            localStorage.setItem(this.PROGRAMS_INDEX_KEY, JSON.stringify(updatedIndex));

            return true;
        } catch (error) {
            console.error('LocalStorage delete failed:', error);
            return false;
        }
    }

    _loadAllFromLocalStorage() {
        try {
            const index = this._getLocalIndex();
            return index.map(indexEntry => {
                const program = this._loadFromLocalStorage(indexEntry.id);
                return program || indexEntry; // Fallback to index entry if full program missing
            }).filter(Boolean);
        } catch (error) {
            console.error('LocalStorage load all failed:', error);
            return [];
        }
    }

    async _saveToSupabase(program, userId) {
        const { data, error } = await supabase
            .from('programs')
            .upsert({
                id: program.id,
                user_id: userId,
                name: program.name,
                description: program.description,
                program_type: program.type,
                goal_type: program.goal,
                duration_weeks: program.duration,
                training_days_per_week: program.trainingDaysPerWeek,
                // New enhanced columns for comprehensive program storage
                model: program.trainingModel || program.selectedTrainingModel,
                block_sequence: JSON.stringify(program.blocks || []),
                phases: JSON.stringify(program.phases || []),
                weekly_outline: JSON.stringify(program.weeklyOutline || []),
                parameters: JSON.stringify(program.parameters || {}),
                // Legacy compatibility
                blocks: JSON.stringify(program.blocks || []),
                assessment_id: program.assessmentId,
                total_duration: program.totalDuration,
                is_active: program.isActive,
                version: program.version,
                created_at: program.createdAt,
                updated_at: program.updatedAt
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return this._transformSupabaseProgram(data);
    }

    async _loadFromSupabase(programId, userId) {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('id', programId)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // No rows found
                return null;
            }
            throw error;
        }

        return this._transformSupabaseProgram(data);
    }

    async _loadAllFromSupabase(userId) {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data.map(this._transformSupabaseProgram);
    }

    async _deleteFromSupabase(programId, userId) {
        const { error } = await supabase
            .from('programs')
            .delete()
            .eq('id', programId)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }
    }

    _transformSupabaseProgram(supabaseData) {
        return {
            id: supabaseData.id,
            userId: supabaseData.user_id,
            name: supabaseData.name,
            description: supabaseData.description,
            type: supabaseData.program_type || supabaseData.type,
            goal: supabaseData.goal_type || supabaseData.goal,
            duration: supabaseData.duration_weeks || supabaseData.duration,
            trainingDaysPerWeek: supabaseData.training_days_per_week,
            // New enhanced fields
            trainingModel: supabaseData.model,
            selectedTrainingModel: supabaseData.model,
            phases: typeof supabaseData.phases === 'string'
                ? JSON.parse(supabaseData.phases)
                : supabaseData.phases,
            weeklyOutline: typeof supabaseData.weekly_outline === 'string'
                ? JSON.parse(supabaseData.weekly_outline)
                : supabaseData.weekly_outline,
            parameters: typeof supabaseData.parameters === 'string'
                ? JSON.parse(supabaseData.parameters)
                : supabaseData.parameters,
            blockSequence: typeof supabaseData.block_sequence === 'string'
                ? JSON.parse(supabaseData.block_sequence)
                : supabaseData.block_sequence,
            // Legacy compatibility
            blocks: typeof supabaseData.blocks === 'string'
                ? JSON.parse(supabaseData.blocks)
                : supabaseData.blocks ||
                (typeof supabaseData.block_sequence === 'string'
                    ? JSON.parse(supabaseData.block_sequence)
                    : supabaseData.block_sequence),
            assessmentId: supabaseData.assessment_id,
            totalDuration: supabaseData.total_duration,
            isActive: supabaseData.is_active,
            version: supabaseData.version,
            createdAt: supabaseData.created_at,
            updatedAt: supabaseData.updated_at,
            syncedToSupabase: true,
            lastSyncAt: new Date().toISOString()
        };
    }

    _getLocalIndex() {
        try {
            const index = localStorage.getItem(this.PROGRAMS_INDEX_KEY);
            return index ? JSON.parse(index) : [];
        } catch (error) {
            console.error('Failed to load local index:', error);
            return [];
        }
    }

    _updateLocalIndex(programs) {
        try {
            const existingIndex = this._getLocalIndex();
            const updatedIndex = [...existingIndex];

            programs.forEach(program => {
                const existingIndex = updatedIndex.findIndex(p => p.id === program.id);
                const indexEntry = {
                    id: program.id,
                    name: program.name,
                    updatedAt: program.updatedAt,
                    createdAt: program.createdAt,
                    type: program.type,
                    goal: program.goal
                };

                if (existingIndex >= 0) {
                    updatedIndex[existingIndex] = indexEntry;
                } else {
                    updatedIndex.push(indexEntry);
                }
            });

            localStorage.setItem(this.PROGRAMS_INDEX_KEY, JSON.stringify(updatedIndex));
        } catch (error) {
            console.error('Failed to update local index:', error);
        }
    }
}

/**
 * Utility functions for easier usage
 */

// Quick save function for React components
export const quickSaveProgram = async (programData, options = {}) => {
    try {
        return await programService.saveProgram(programData);
    } catch (error) {
        if (!options.suppressToast) {
            toast.error(`Save failed: ${error.message}`);
        }
        throw error;
    }
};

// Quick load function for React components  
export const quickLoadProgram = async (programId, options = {}) => {
    try {
        return await programService.loadProgram(programId);
    } catch (error) {
        if (!options.suppressToast) {
            toast.error(`Load failed: ${error.message}`);
        }
        throw error;
    }
};

// Quick load all function for React components
export const quickLoadAllPrograms = async (options = {}) => {
    try {
        return await programService.loadAllPrograms();
    } catch (error) {
        if (!options.suppressToast) {
            toast.error(`Load failed: ${error.message}`);
        }
        throw error;
    }
};

// Quick delete function for React components
export const quickDeleteProgram = async (programId, options = {}) => {
    try {
        return await programService.deleteProgram(programId);
    } catch (error) {
        if (!options.suppressToast) {
            toast.error(`Delete failed: ${error.message}`);
        }
        throw error;
    }
};

// Check if a program is synced with cloud storage
export const checkProgramSyncStatus = async (programId) => {
    return await programService.checkSyncStatus(programId);
};

// Export singleton instance
export const programService = new ProgramService();

// Export the singleton instance as default
export default programService;

// Named exports for convenience
export { ProgramService };
