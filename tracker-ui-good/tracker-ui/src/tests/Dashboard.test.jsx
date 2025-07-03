import { describe, it, expect, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { renderWithProviders } from './test-utils';

// Mock the hooks that cause issues
vi.mock('../hooks/useWeeklyVolume', () => ({
  useWeeklyVolume: () => ({
    data: { weeklyData: [], totalVolume: 0 },
    isLoading: false,
    error: null
  })
}))

vi.mock('../hooks/useWeekStatus', () => ({
  useWeekStatus: () => ({
    currentWeek: 3,
    totalWeeks: 4,
    phase: 'Accumulation',
    daysToDeload: 5
  })
}))

vi.mock('../hooks/useFatigueStatus', () => ({
  useFatigueStatus: () => ({
    systemicFatigue: 65,
    muscleStatus: { chest: 'Working', back: 'Working' }
  })
}))

describe('Dashboard', () => {
  it('renders without crashing', async () => {
    const { container } = renderWithProviders(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for component to stabilize - just check container exists
    await waitFor(() => {
      expect(container.querySelector('div')).toBeTruthy();
    }, { timeout: 3000 });

    // Check for key dashboard elements by text content
    expect(container.textContent).toContain('Week');
    expect(container.textContent).toContain('Accumulation');
  });

  it('renders main dashboard sections', async () => {
    const { container } = renderWithProviders(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(container.textContent).toContain('Current Week');
    }, { timeout: 2000 });

    // Check for main sections by text content
    expect(container.textContent).toContain('Weekly Volume');
    expect(container.textContent).toContain('Systemic Fatigue');
    expect(container.textContent).toContain('Upcoming Sessions');
  });
});
