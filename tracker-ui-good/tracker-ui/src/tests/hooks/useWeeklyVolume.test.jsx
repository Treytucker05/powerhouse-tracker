import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useWeeklyVolume } from '../../hooks/useWeeklyVolume'

// Mock the supabase client
vi.mock('../../lib/api/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({
                data: [
                  {
                    muscle_group: 'Chest',
                    sets: 10,
                    mrv_percentage: 70,
                    week_start_date: '2025-06-15'
                  },
                  {
                    muscle_group: 'Back',
                    sets: 12,
                    mrv_percentage: 65,
                    week_start_date: '2025-06-15'
                  }
                ],
                error: null
              }))
            }))
          }))
        }))
      }))
    }))
  },
  getCurrentUserId: vi.fn(() => Promise.resolve('test-user-id'))
}))

describe('useWeeklyVolume', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('fetches weekly volume data successfully', async () => {
    const { result } = renderHook(() => useWeeklyVolume(), { wrapper })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check that data is structured correctly
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data.length).toBe(4) // 4 weeks
    
    // Check structure of first week
    const firstWeek = result.current.data[0]
    expect(firstWeek).toHaveProperty('weekLabel')
    expect(firstWeek).toHaveProperty('volumes')
    expect(firstWeek.volumes).toHaveProperty('Chest')
    expect(firstWeek.volumes).toHaveProperty('Back')
  })

  it('handles authentication error gracefully', async () => {
    // Obtain the mocked module and force auth failure for this invocation
    const supabaseModule = await import('../../lib/api/supabaseClient')
    supabaseModule.getCurrentUserId.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useWeeklyVolume(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should return fallback data when auth fails
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
  })

  it('refetches data when volume:updated event is fired', async () => {
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')
    
    const { result } = renderHook(() => useWeeklyVolume(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Clear the spy to reset call count
    invalidateQueriesSpy.mockClear()

    // Fire the volume:updated event
    window.dispatchEvent(new CustomEvent('volume:updated', { 
      detail: { setData: { exercise: 'Bench Press', weight: 100, reps: 10 } } 
    }))

    // Verify invalidateQueries was called with the correct query key
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(['weeklyVolume'])
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1)

    invalidateQueriesSpy.mockRestore()
  })
})
