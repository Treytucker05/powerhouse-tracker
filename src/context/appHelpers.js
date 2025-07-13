import { supabase } from '../lib/api/supabaseClient';
import { toast } from 'react-toastify';

// Supabase and localStorage sync utilities
export const syncToSupabase = async (tableName, data, userId) => {
    try {
        if (!userId) {
            console.warn('No user ID provided for Supabase sync');
            return null;
        }

        const { data: result, error } = await supabase
            .from(tableName)
            .upsert({
                user_id: userId,
                ...data,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error(`Supabase sync error for ${tableName}:`, error);
            throw error;
        }

        return result;
    } catch (error) {
        console.error(`Failed to sync ${tableName} to Supabase:`, error);
        return null;
    }
};

export const syncToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify({
            ...data,
            lastUpdated: new Date().toISOString()
        }));
        return true;
    } catch (error) {
        console.error(`Failed to sync ${key} to localStorage:`, error);
        return false;
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
        return null;
    }
};

export const loadFromSupabase = async (tableName, userId) => {
    try {
        if (!userId) {
            return null;
        }

        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error(`Failed to load ${tableName} from Supabase:`, error);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Failed to load ${tableName} from Supabase:`, error);
        return null;
    }
};

// Assessment-specific helpers
export const generateRecommendation = (goal, experience, timeline) => {
    if (!goal || !experience || !timeline) return '';

    // Beginner recommendations
    if (experience === 'Beginner <1 year') {
        return 'Linear';
    }

    // Competition prep with adequate time
    if (goal === 'Powerlifting Competition' && (timeline === '12-16 weeks' || timeline === '16-20 weeks' || timeline === '20+ weeks')) {
        return 'Block';
    }

    // Advanced powerlifting
    if (experience === 'Advanced 3-5 years' && goal === 'Powerlifting Competition') {
        return 'Conjugate';
    }

    // Elite athletes
    if (experience === 'Elite 5+ years') {
        if (goal === 'Athletic Performance') return 'Conjugate';
        if (goal === 'Powerlifting Competition') return 'Conjugate';
        return 'Block';
    }

    // Bodybuilding/Physique
    if (goal === 'Bodybuilding/Physique') {
        if (experience === 'Intermediate 1-3 years') return 'Linear';
        return 'Block';
    }

    // Athletic Performance
    if (goal === 'Athletic Performance') {
        if (experience === 'Intermediate 1-3 years' || experience === 'Advanced 3-5 years') return 'Block';
        return 'Conjugate';
    }

    // General Fitness
    if (goal === 'General Fitness') {
        return 'Linear';
    }

    // Hybrid/Multiple goals
    if (goal === 'Hybrid/Multiple') {
        if (experience === 'Intermediate 1-3 years' || experience === 'Advanced 3-5 years') return 'Block';
        return 'Conjugate';
    }

    // Default fallback
    return 'Linear';
};
