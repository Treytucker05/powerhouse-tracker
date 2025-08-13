import { supabase as realSupabase } from './api/supabaseClient';
// In test environment, skip Supabase network usage to avoid hanging / OOM
const supabase = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ? null : realSupabase;

// Lightweight key-value helpers used across the app
export function set(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('storage.set failed', e);
    }
}

export function get(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn('storage.get failed', e);
        return null;
    }
}

export function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.warn('storage.remove failed', e);
    }
}

/**
 * Save macrocycle data to Supabase or localStorage fallback
 * @param {Object} data - Macrocycle data to save
 * @returns {Promise<string>} - The ID of the saved macrocycle
 */
export async function saveMacrocycle(data) {
    const id = data.id || crypto.randomUUID();
    const record = {
        ...data,
        id,
        updatedAt: Date.now(),
        createdAt: data.createdAt || Date.now()
    };

    try {
        if (supabase) {
            const { data: savedData, error } = await supabase
                .from('macrocycles')
                .upsert(record, { onConflict: 'id' })
                .select()
                .single();

            if (error) throw error;
            console.log('Macrocycle saved to Supabase:', savedData);
        } else {
            // Fallback to localStorage
            localStorage.setItem(`macro_${id}`, JSON.stringify(record));
            console.log('Macrocycle saved to localStorage:', record);
        }
    } catch (error) {
        console.error('Error saving macrocycle:', error);
        // Fallback to localStorage if Supabase fails
        localStorage.setItem(`macro_${id}`, JSON.stringify(record));
        console.log('Fallback: Macrocycle saved to localStorage');
    }

    return id;
}

/**
 * Load macrocycle data from Supabase or localStorage
 * @param {string} id - The ID of the macrocycle to load
 * @returns {Promise<Object|null>} - The macrocycle data or null if not found
 */
export async function loadMacrocycle(id) {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('macrocycles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error loading from Supabase:', error);
    }

    // Fallback to localStorage
    const raw = localStorage.getItem(`macro_${id}`);
    return raw ? JSON.parse(raw) : null;
}

/**
 * Load all macrocycles for the overview page
 * @returns {Promise<Array>} - Array of macrocycle data
 */
export async function loadAllMacrocycles() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('macrocycles')
                .select('*')
                .order('updatedAt', { ascending: false });

            if (error) throw error;
            return data || [];
        }
    } catch (error) {
        console.error('Error loading all macrocycles from Supabase:', error);
    }

    // Fallback to localStorage
    const macrocycles = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('macro_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                macrocycles.push(data);
            } catch (error) {
                console.error('Error parsing localStorage macrocycle:', error);
            }
        }
    }

    // Sort by updatedAt descending
    return macrocycles.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Delete a macrocycle
 * @param {string} id - The ID of the macrocycle to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteMacrocycle(id) {
    try {
        if (supabase) {
            const { error } = await supabase
                .from('macrocycles')
                .delete()
                .eq('id', id);

            if (error) throw error;
        }

        // Also remove from localStorage
        localStorage.removeItem(`macro_${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting macrocycle:', error);
        return false;
    }
}
