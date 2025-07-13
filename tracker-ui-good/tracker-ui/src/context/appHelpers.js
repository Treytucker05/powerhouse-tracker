import { supabase } from '../lib/api/supabaseClient';
import { toast } from 'react-toastify';

// Cache for table existence checks to avoid repeated queries
const tableExistsCache = new Map();

// Check if a Supabase table exists
export const checkTableExists = async (tableName) => {
    // Return cached result if available
    if (tableExistsCache.has(tableName)) {
        return tableExistsCache.get(tableName);
    }

    try {
        // Try a simple count query to check if table exists
        const { error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
            .limit(0);

        const exists = !error || error.code !== '42P01'; // 42P01 = relation does not exist
        tableExistsCache.set(tableName, exists);

        if (!exists) {
            console.log(`Table '${tableName}' does not exist in Supabase, falling back to localStorage`);
        }

        return exists;
    } catch (error) {
        console.warn(`Error checking table existence for '${tableName}':`, error);
        tableExistsCache.set(tableName, false);
        return false;
    }
};

// Safe Supabase query wrapper
export const safeSupabaseQuery = async (tableName, queryBuilder, fallbackValue = []) => {
    try {
        // Check if table exists first
        const tableExists = await checkTableExists(tableName);
        if (!tableExists) {
            console.log(`Table '${tableName}' not available, returning fallback value`);
            return { data: fallbackValue, error: null };
        }

        // Execute the query
        const result = await queryBuilder;
        return result;
    } catch (error) {
        console.error(`Safe query error for table '${tableName}':`, error);
        return { data: fallbackValue, error };
    }
};

// Supabase and localStorage sync utilities
export const syncToSupabase = async (tableName, data, userId) => {
    try {
        if (!userId) {
            console.warn('No user ID provided for Supabase sync');
            return null;
        }

        // Check if table exists before attempting sync
        const tableExists = await checkTableExists(tableName);
        if (!tableExists) {
            console.log(`Table '${tableName}' does not exist, skipping Supabase sync`);
            return null;
        }

        const { data: result, error } = await safeSupabaseQuery(
            tableName,
            supabase
                .from(tableName)
                .upsert({
                    user_id: userId,
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single()
        );

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
        // Check if table exists
        const tableExists = await checkTableExists(tableName);
        if (!tableExists) {
            // Fallback to localStorage if table doesn't exist
            const localData = loadFromLocalStorage(tableName);
            if (localData) {
                toast.info(`Using local data - ${tableName} table not found in database`);
            }
            return localData;
        }

        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session || !userId) {
            // Fallback to localStorage if not authenticated
            const localData = loadFromLocalStorage(tableName);
            if (!session && localData) {
                toast.info('Using local data - login for cloud sync');
            }
            return localData;
        }

        // Use simpler query without ordering by updated_at since column may not exist
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_id', userId)
            .limit(1);

        // Handle database errors gracefully
        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found
                console.log(`No ${tableName} data found for user ${userId}`);
                return null;
            } else if (error.code === '42P01') {
                // Table doesn't exist
                console.log(`Table ${tableName} does not exist in database`);
                const localData = loadFromLocalStorage(tableName);
                if (localData) {
                    toast.info(`Using local data - ${tableName} table not found in database`);
                }
                return localData;
            } else if (error.code === '42703') {
                // Column doesn't exist - retry without ordering
                console.log(`Column issue in ${tableName}, using basic query`);
                const { data: retryData, error: retryError } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('user_id', userId);

                if (retryError) {
                    console.error(`Retry failed for ${tableName}:`, retryError.message || retryError);
                    const localData = loadFromLocalStorage(tableName);
                    if (localData) {
                        toast.warn(`Database schema issue - using local data`);
                    }
                    return localData;
                }
                return retryData?.[0] || null;
            } else {
                // Other database errors
                console.error(`Supabase error for ${tableName}:`, error.message || error);

                // Fallback to localStorage on database error
                const localData = loadFromLocalStorage(tableName);
                if (localData) {
                    toast.warn(`Database connection issue - using local data`);
                    return localData;
                }
                return null;
            }
        }

        return data?.[0] || null; // Return first result or null
    } catch (error) {
        console.error(`Failed to load ${tableName} from Supabase:`, error.message || error);

        // Fallback to localStorage on any unexpected error
        const localData = loadFromLocalStorage(tableName);
        if (localData) {
            toast.warn(`Cloud sync unavailable - using local data`);
            return localData;
        }
        return null;
    }
};

// Batch load multiple tables from Supabase efficiently
export const batchLoadFromSupabase = async (tableNames, userId) => {
    try {
        // Check authentication once for all tables
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session || !userId) {
            // Fallback to localStorage for all tables
            const results = {};
            tableNames.forEach(tableName => {
                const localData = loadFromLocalStorage(tableName);
                results[tableName] = localData;
            });

            if (!session && Object.values(results).some(data => data !== null)) {
                toast.info('Using local data - login for cloud sync');
            }

            return results;
        }

        // Load all tables in parallel
        const promises = tableNames.map(async (tableName) => {
            try {
                // Check if table exists
                const tableExists = await checkTableExists(tableName);
                if (!tableExists) {
                    console.log(`Table '${tableName}' not available, returning localStorage data`);
                    const localData = loadFromLocalStorage(tableName);
                    return { tableName, data: localData };
                }

                // Use simpler query without ordering by updated_at
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('user_id', userId)
                    .limit(1);

                if (error) {
                    if (error.code === 'PGRST116') {
                        // No rows found
                        return { tableName, data: null };
                    } else if (error.code === '42P01') {
                        // Table doesn't exist
                        console.log(`Table ${tableName} does not exist`);
                        const localData = loadFromLocalStorage(tableName);
                        return { tableName, data: localData };
                    } else if (error.code === '42703') {
                        // Column doesn't exist - already using basic query
                        console.log(`Schema issue with ${tableName}:`, error.message);
                        const localData = loadFromLocalStorage(tableName);
                        return { tableName, data: localData };
                    } else {
                        console.error(`Supabase error for ${tableName}:`, error.message || error);
                        const localData = loadFromLocalStorage(tableName);
                        return { tableName, data: localData };
                    }
                }

                return { tableName, data: data?.[0] || null };
            } catch (err) {
                console.error(`Failed to load ${tableName}:`, err.message || err);
                const localData = loadFromLocalStorage(tableName);
                return { tableName, data: localData };
            }
        });

        const results = await Promise.all(promises);

        // Convert array to object
        const resultObj = {};
        results.forEach(({ tableName, data }) => {
            resultObj[tableName] = data;
        });

        return resultObj;
    } catch (error) {
        console.error('Batch load failed:', error.message || error);

        // Fallback to localStorage for all tables
        const results = {};
        tableNames.forEach(tableName => {
            results[tableName] = loadFromLocalStorage(tableName);
        });

        toast.warn('Cloud sync unavailable - using local data');
        return results;
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
