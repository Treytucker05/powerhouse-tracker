import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useLogSet } from '../../tracker-ui/src/hooks/useLogSet'

// Mock the supabase client
vi.mock('../../tracker-ui/src/lib/api/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [
            { exercise: 'Bench Press', set_number: 1 },
            { exercise: 'Bench Press', set_number: 2 },
            { exercise: 'Squats', set_number: 1 }
          ],
          error: null
        }))
      }))
    }))
  },
  getCurrentUserId: vi.fn(() => Promise.resolve('test-user-id'))
}))

// Mock the useActiveSession hook
vi.mock('../../tracker-ui/src/hooks/useActiveSession', () => ({
  useActiveSession: vi.fn(() => ({
    activeSession: {
      id: 'session-123',
      planned_sets: [
        { exercise: 'Bench Press', set_number: 1 },
        { exercise: 'Bench Press', set_number: 2 },
        { exercise: 'Squats', set_number: 1 }
      ]
    },
    addSet: vi.fn(() => Promise.resolve({
      id: 'set-456',
      exercise: 'Bench Press',
      weight: 225,
      reps: 8,
      rpe: 8
    })),
    finishSession: vi.fn(() => Promise.resolve())
  }))
}))

// Mock window.dispatchEvent
const mockDispatchEvent = vi.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true
})

describe('useLogSet', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )

    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('should provide logSet function', () => {
    const { result } = renderHook(() => useLogSet(), { wrapper })

    expect(result.current.logSet).toBeInstanceOf(Function)
    expect(result.current.isLogging).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should emit volume:updated event when logging a set', async () => {
    const { result } = renderHook(() => useLogSet(), { wrapper })

    const setData = {
      exercise: 'Bench Press',
      weight: 225,
      reps: 8,
      rpe: 8
    }

    await result.current.logSet(setData)

    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'volume:updated',
          detail: expect.objectContaining({
            setData: expect.objectContaining({
              id: 'set-456',
              exercise: 'Bench Press',
              weight: 225,
              reps: 8,
              rpe: 8
            })
          })
        })
      )
    })
  })

  it('should finish session when all planned sets are completed', async () => {
    const { useActiveSession } = await import('../../tracker-ui/src/hooks/useActiveSession')
    const mockFinishSession = vi.fn(() => Promise.resolve())
    
    // Mock a session that's about to be completed
    useActiveSession.mockReturnValue({
      activeSession: {
        id: 'session-123',
        planned_sets: [
          { exercise: 'Bench Press', set_number: 1 },
          { exercise: 'Bench Press', set_number: 2 },
          { exercise: 'Squats', set_number: 1 }
        ]
      },
      addSet: vi.fn(() => Promise.resolve({
        id: 'set-789',
        exercise: 'Squats',
        weight: 315,
        reps: 5,
        rpe: 9
      })),
      finishSession: mockFinishSession
    })

    const { result } = renderHook(() => useLogSet(), { wrapper })

    const setData = {
      exercise: 'Squats',
      weight: 315,
      reps: 5,
      rpe: 9
    }

    await result.current.logSet(setData)

    await waitFor(() => {
      expect(mockFinishSession).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'session:completed',
          detail: expect.objectContaining({
            sessionId: 'session-123',
            completedSets: 3
          })
        })
      )
    })
  })

  it('should not finish session when planned sets are not complete', async () => {
    const { useActiveSession } = await import('../../tracker-ui/src/hooks/useActiveSession')
    const mockFinishSession = vi.fn(() => Promise.resolve())
    
    // Mock a session with incomplete sets
    useActiveSession.mockReturnValue({
      activeSession: {
        id: 'session-123',
        planned_sets: [
          { exercise: 'Bench Press', set_number: 1 },
          { exercise: 'Bench Press', set_number: 2 },
          { exercise: 'Squats', set_number: 1 },
          { exercise: 'Squats', set_number: 2 }
        ]
      },
      addSet: vi.fn(() => Promise.resolve({
        id: 'set-101',
        exercise: 'Bench Press',
        weight: 225,
        reps: 8,
        rpe: 8
      })),
      finishSession: mockFinishSession
    })

    // Mock Supabase to return only partial completion
    const { supabase } = await import('../../tracker-ui/src/lib/api/supabaseClient')
    supabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [
            { exercise: 'Bench Press', set_number: 1 },
            { exercise: 'Bench Press', set_number: 2 }
          ],
          error: null
        }))
      }))
    })

    const { result } = renderHook(() => useLogSet(), { wrapper })

    const setData = {
      exercise: 'Bench Press',
      weight: 225,
      reps: 8,
      rpe: 8
    }

    await result.current.logSet(setData)

    // Should emit volume:updated but not finish session
    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'volume:updated'
        })
      )
    })

    expect(mockFinishSession).not.toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    const { useActiveSession } = await import('../../tracker-ui/src/hooks/useActiveSession')
    
    useActiveSession.mockReturnValue({
      activeSession: {
        id: 'session-123',
        planned_sets: []
      },
      addSet: vi.fn(() => Promise.reject(new Error('Failed to add set'))),
      finishSession: vi.fn()
    })

    const { result } = renderHook(() => useLogSet(), { wrapper })

    const setData = {
      exercise: 'Bench Press',
      weight: 225,
      reps: 8,
      rpe: 8
    }

    await expect(result.current.logSet(setData)).rejects.toThrow('Failed to add set')
  })

  it('should handle session without planned sets', async () => {
    const { useActiveSession } = await import('../../tracker-ui/src/hooks/useActiveSession')
    const mockFinishSession = vi.fn(() => Promise.resolve())
    
    useActiveSession.mockReturnValue({
      activeSession: {
        id: 'session-123',
        planned_sets: null
      },
      addSet: vi.fn(() => Promise.resolve({
        id: 'set-999',
        exercise: 'Bench Press',
        weight: 225,
        reps: 8,
        rpe: 8
      })),
      finishSession: mockFinishSession
    })

    const { result } = renderHook(() => useLogSet(), { wrapper })

    const setData = {
      exercise: 'Bench Press',
      weight: 225,
      reps: 8,
      rpe: 8
    }

    await result.current.logSet(setData)

    // Should emit volume:updated but not attempt to finish session
    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'volume:updated'
        })
      )
    })

    expect(mockFinishSession).not.toHaveBeenCalled()
  })
})
