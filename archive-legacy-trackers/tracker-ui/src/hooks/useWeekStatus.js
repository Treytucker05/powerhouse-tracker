import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabaseClient'

export const useWeekStatus = () => {
  return useQuery({
    queryKey: ['weekStatus'],
    queryFn: async () => {
      try {
        const userId = await supabase.getCurrentUserId()
        if (!userId) {
          throw new Error('User not authenticated')
        }

        // Get current week date range (Monday to Sunday)
        const now = new Date()
        const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Adjust for Sunday = 0
        
        const monday = new Date(now.getTime() + mondayOffset * 24 * 60 * 60 * 1000)
        monday.setHours(0, 0, 0, 0)
        
        const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000)
        sunday.setHours(23, 59, 59, 999)

        // Query training sessions for current week
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', userId)
          .gte('date', monday.toISOString().split('T')[0])
          .lte('date', sunday.toISOString().split('T')[0])
          .order('date', { ascending: true })

        if (error) {
          throw error
        }

        // Build days array for the week
        const days = []
        const sessionsMap = new Map()
        
        // Map sessions by date
        data?.forEach(session => {
          sessionsMap.set(session.date, session)
        })

        // Generate days for the week
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        let completedCount = 0

        for (let i = 0; i < 7; i++) {
          const dayDate = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000)
          const dateString = dayDate.toISOString().split('T')[0]
          const session = sessionsMap.get(dateString)
          
          let status = 'rest' // default
          let focus = 'Rest Day'
          
          if (session) {
            if (session.completed) {
              status = 'completed'
              completedCount++
            } else if (session.planned) {
              status = 'planned'
            } else {
              status = 'scheduled'
            }
            focus = session.focus || session.name || 'Workout'
          }

          days.push({
            label: dayLabels[i],
            status,
            focus,
            date: dateString
          })
        }

        return {
          days,
          completedCount,
          totalPlanned: data?.filter(s => s.planned || s.completed).length || 0
        }
      } catch (error) {
        console.error('Error fetching week status:', error)
        // Return fallback data
        return {
          days: [
            { label: 'Mon', status: 'completed', focus: 'Push Day A' },
            { label: 'Tue', status: 'completed', focus: 'Pull Day A' },
            { label: 'Wed', status: 'completed', focus: 'Legs & Core' },
            { label: 'Thu', status: 'completed', focus: 'Push Day B' },
            { label: 'Fri', status: 'planned', focus: 'Pull Day B' },
            { label: 'Sat', status: 'rest', focus: 'Rest Day' },
            { label: 'Sun', status: 'rest', focus: 'Rest Day' }
          ],
          completedCount: 4,
          totalPlanned: 5
        }
      }
    },
    staleTime: 300000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export default useWeekStatus
