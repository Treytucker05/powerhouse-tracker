import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/api/supabaseClient'
import Dashboard from '../pages/Dashboard';
import * as state from '../lib/state/trainingState';

// Mocks for heavy child components to keep test deterministic & light
vi.mock('../components/dashboard/VolumeTrackingChart', () => ({ default: () => <div data-testid="volume-chart" /> }))
vi.mock('../components/dashboard/TrainingStatusCard', () => ({ default: () => <div data-testid="status-card" /> }))
vi.mock('../components/dashboard/TrainingStatus', () => ({ default: () => <div data-testid="training-status" /> }))

// Mock actions hook
const startTodaySpy = vi.fn()
vi.mock('../hooks/useQuickActions', () => ({
  useQuickActions: () => ({
    data: {
      startToday: startTodaySpy,
      startTodayLabel: "Start Today's Workout",
      startTodayDisabled: false,
      hasPlannedSession: false
    },
    isLoading: false,
    error: null
  })
}))

// Provide a fresh QueryClient per test file
const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })

// Helper wrapper
const renderWithProviders = (ui) => render(
  <QueryClientProvider client={qc}>
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  </QueryClientProvider>
)

// Mock the supabase.from() chain to satisfy useWeeklyVolume internal query
const mockSelectChain = {
  eq: () => mockSelectChain,
  gte: () => mockSelectChain,
  lte: () => mockSelectChain,
  order: () => Promise.resolve({ data: [], error: null })
}

vi.spyOn(supabase, 'from').mockReturnValue({ select: () => mockSelectChain })

// Optionally stub visually complex child components if unstable (could mock but leaving for now)

describe('<Dashboard />', () => {
  beforeEach(() => {
    startTodaySpy.mockClear()
    vi.spyOn(state, 'useDashboardState').mockReturnValue({
      currentWeek: 3,
      phase: 'Accumulation',
      systemicFatigue: 0.65,
      muscleVolumes: {
        chest: { current: 14, mev: 10, mrv: 22 },
        back: { current: 18, mev: 12, mrv: 25 },
      },
      refreshDashboard: vi.fn(),
    })
  })

  it('renders core dashboard sections', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/Quick Actions/i)).toBeTruthy()
    expect(screen.getByTestId('volume-chart')).toBeTruthy()
    expect(screen.getByTestId('status-card')).toBeTruthy()
  })

  it("invokes start today's workout action", () => {
    renderWithProviders(<Dashboard />)
    fireEvent.click(screen.getByText(/Start Today's Workout/i))
    expect(startTodaySpy).toHaveBeenCalled()
  })
});
