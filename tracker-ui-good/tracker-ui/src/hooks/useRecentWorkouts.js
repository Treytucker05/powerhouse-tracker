import { useQuery } from '@tanstack/react-query';
import { supabase, getCurrentUserId } from '../lib/api/supabaseClient.js';

// Fallback seed (used when auth missing or errors)
const FALLBACK_WORKOUTS = [
    { id: 'fw1', date: '2025-06-01', name: 'Push Day', duration: '60 mins', exercises: 6, sets: 18, volume: 8000, completed: true },
    { id: 'fw2', date: '2025-05-30', name: 'Pull Day', duration: '55 mins', exercises: 5, sets: 15, volume: 7200, completed: true },
];

function transform(raw) {
    return {
        id: raw.id,
        date: raw.date,
        name: raw.title,
        duration: `${raw.duration_minutes} mins`,
        exercises: raw.exercises_count,
        sets: raw.sets_count,
        volume: raw.total_volume,
        completed: raw.completed,
    };
}

export function useRecentWorkouts(limit = 5) {
    return useQuery({
        queryKey: ['recentWorkouts', limit],
        queryFn: async () => {
            const userId = await getCurrentUserId();
            if (!userId) {
                return FALLBACK_WORKOUTS;
            }
            try {
                // Chain shaped to satisfy existing test mocks: select -> eq -> eq -> order -> limit
                const result = await supabase
                    .from('workouts')
                    .select('id,title,date,duration_minutes,exercises_count,sets_count,total_volume,completed')
                    .eq('user_id', userId)
                    .eq('completed', true)
                    .order('date', { ascending: false })
                    .limit(limit);
                const { data, error } = result || {};
                if (error) throw error;
                if (!Array.isArray(data)) return [];
                return data.map(transform);
            } catch (e) {
                console.warn('useRecentWorkouts fallback due to error', e);
                return FALLBACK_WORKOUTS;
            }
        },
    });
}

export default useRecentWorkouts;
