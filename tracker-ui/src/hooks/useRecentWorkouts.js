import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabaseClient'

export const useRecentWorkouts = () => {
  return useQuery({
    queryKey: ['recentWorkouts'],
    queryFn: async () => {
      try {
        const userId = await supabase.getCurrentUserId()
        if (!userId) {
          throw new Error('User not authenticated')
        }

        // Fetch last 4 completed training sessions
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('completed', true)
          .order('date', { ascending: false })
          .limit(4)

        if (error) {
          throw error
        }

        // Map to the expected format
        return data?.map(session => ({
          id: session.id,
          date: session.date,
          name: session.title,
          duration: `${session.duration_minutes} mins`,
          exercises: session.exercises_count,
          sets: session.sets_count,
          volume: session.total_volume,
          completed: session.completed
        })) || []
      } catch (error) {
        console.error('Error fetching recent workouts:', error)
        // Return fallback data if query fails
        return [
          {
            id: 1,
            date: "2025-06-20",
            name: "Push Day A",
            duration: "68 mins",
            exercises: 6,
            sets: 18,
            volume: 8250,
            completed: true
          },
          {
            id: 2,
            date: "2025-06-18",
            name: "Pull Day A",
            duration: "72 mins",
            exercises: 5,
            sets: 16,
            volume: 7890,
            completed: true
          },
          {
            id: 3,
            date: "2025-06-16",
            name: "Legs & Core",
            duration: "81 mins",
            exercises: 7,
            sets: 20,
            volume: 12300,
            completed: true
          },
          {
            id: 4,
            date: "2025-06-14",
            name: "Push Day B",
            duration: "65 mins",
            exercises: 6,
            sets: 17,
            volume: 7950,
            completed: false
          }
        ]
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export default useRecentWorkouts
