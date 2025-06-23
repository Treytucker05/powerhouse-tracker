import { useQuery } from '@tanstack/react-query'
import { supabase, getCurrentUserId } from '../lib/api/supabaseClient'

export const useQuickActions = () => {
  return useQuery({
    queryKey: ['quickActions'],
    queryFn: async () => {
      try {
        const userId = await getCurrentUserId()
        if (!userId) {
          throw new Error('User not authenticated')
        }

        // Get today's date
        const today = new Date().toISOString().split('T')[0]

        // Query for today's planned session
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .eq('planned', true)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error
        }

        const todaySession = data
        const hasPlannedSession = !!todaySession
        const sessionCompleted = todaySession?.completed || false

        const actions = {
          // Start Today's Workout
          startToday: () => {
            if (hasPlannedSession && !sessionCompleted) {
              // Navigate to session page with today's session
              window.location.href = `/sessions/${todaySession.id}`
            } else {
              // Navigate to general session page
              window.location.href = '/sessions'
            }
          },
          startTodayDisabled: !hasPlannedSession || sessionCompleted,
          startTodayLabel: sessionCompleted ? 'Completed' : hasPlannedSession ? 'Start Workout' : 'No Session',

          // Open Logger
          openLogger: () => {
            window.location.href = '/logger'
          },
          openLoggerDisabled: false,

          // View Program
          viewProgram: () => {
            window.location.href = '/intelligence'
          },
          viewProgramDisabled: false,

          // Session info
          todaySession,
          hasPlannedSession,
          sessionCompleted
        }

        return actions
      } catch (error) {
        console.error('Error fetching quick actions:', error)
        // Return fallback actions
        return {
          startToday: () => { window.location.href = '/sessions' },
          startTodayDisabled: false,
          startTodayLabel: 'Start Workout',
          openLogger: () => { window.location.href = '/logger' },
          openLoggerDisabled: false,
          viewProgram: () => { window.location.href = '/intelligence' },
          viewProgramDisabled: false,
          todaySession: null,
          hasPlannedSession: false,
          sessionCompleted: false
        }
      }
    },
    staleTime: 300000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export default useQuickActions
