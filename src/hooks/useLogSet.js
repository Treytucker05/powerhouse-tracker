import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/api/supabaseClient'
import { useActiveSession } from './useActiveSession'

export const useLogSet = () => {
  const { activeSession, addSet, finishSession } = useActiveSession()

  const logSetMutation = useMutation({
    mutationFn: async (setData) => {
      // Add the set using the active session hook
      const newSet = await addSet(setData)

      // Emit volume:updated event for dashboard refresh
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('volume:updated', { 
          detail: { setData: newSet } 
        }))
      }, 0)

      return newSet
    },
    onSuccess: async () => {
      // Check if session should be completed
      if (activeSession?.planned_sets) {
        // Count completed sets per exercise
        const { data: completedSets } = await supabase
          .from('sets')
          .select('exercise, set_number')
          .eq('session_id', activeSession.id)

        const completedByExercise = {}
        completedSets?.forEach(set => {
          if (!completedByExercise[set.exercise]) {
            completedByExercise[set.exercise] = 0
          }
          completedByExercise[set.exercise]++
        })

        // Check if all planned sets are complete
        const plannedByExercise = {}
        activeSession.planned_sets.forEach(set => {
          if (!plannedByExercise[set.exercise]) {
            plannedByExercise[set.exercise] = 0
          }
          plannedByExercise[set.exercise]++
        })

        const allSetsComplete = Object.keys(plannedByExercise).every(exercise => {
          return completedByExercise[exercise] >= plannedByExercise[exercise]
        })

        if (allSetsComplete) {
          // Auto-complete the session
          await finishSession()
          
          // Emit session completion event
          window.dispatchEvent(new CustomEvent('session:completed', { 
            detail: { 
              sessionId: activeSession.id,
              completedSets: Object.values(completedByExercise).reduce((a, b) => a + b, 0)
            } 
          }))
        }
      }
    }
  })

  return {
    logSet: logSetMutation.mutateAsync,
    isLogging: logSetMutation.isPending,
    error: logSetMutation.error
  }
}

export default useLogSet
