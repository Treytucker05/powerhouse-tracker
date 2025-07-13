import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, getCurrentUserId } from '../lib/api/supabaseClient'

export const useActiveSession = () => {
  const queryClient = useQueryClient()

  // Query for active session
  const sessionQuery = useQuery({
    queryKey: ['activeSession'],
    queryFn: async () => {
      try {
        const userId = await getCurrentUserId()
        if (!userId) {
          throw new Error('User not authenticated')
        }

        // Find current uncompleted training session
        const { data, error } = await supabase
          .from('training_sessions')
          .select(`
            *,
            planned_sets:sets!inner(*)
          `)
          .eq('user_id', userId)
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error
        }

        return data || null
      } catch (error) {
        if (error.code === 'PGRST116') {
          return null // No active session
        }
        console.error('Error fetching active session:', error)
        throw error
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation to add a set
  const addSetMutation = useMutation({
    mutationFn: async (setData) => {
      const userId = await getCurrentUserId()
      if (!userId) {
        throw new Error('User not authenticated')
      }

      if (!sessionQuery.data) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase
        .from('sets')
        .insert([{
          ...setData,
          session_id: sessionQuery.data.id,
          user_id: userId,
          logged_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['activeSession'])
      queryClient.invalidateQueries(['sessionSets'])
    }
  })

  // Mutation to finish session
  const finishSessionMutation = useMutation({
    mutationFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) {
        throw new Error('User not authenticated')
      }

      if (!sessionQuery.data) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase
        .from('training_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionQuery.data.id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      // Invalidate all session-related queries
      queryClient.invalidateQueries(['activeSession'])
      queryClient.invalidateQueries(['sessionSets'])
      queryClient.invalidateQueries(['weekStatus'])
      queryClient.invalidateQueries(['recentWorkouts'])
    }
  })

  return {
    // Session data
    activeSession: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    error: sessionQuery.error,
    
    // Mutations
    addSet: addSetMutation.mutateAsync,
    finishSession: finishSessionMutation.mutateAsync,
    
    // Loading states
    isAddingSet: addSetMutation.isPending,
    isFinishingSession: finishSessionMutation.isPending,
    
    // Refetch function
    refetch: sessionQuery.refetch
  }
}

export default useActiveSession
