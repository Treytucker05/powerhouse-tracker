import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import * as state from '../lib/state/trainingState';

describe('<Dashboard />', () => {
  it('renders snapshot', () => {
    const { asFragment } = renderWithProviders(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls refreshDashboard when Refresh is clicked', () => {
    const spy = vi.fn();
    vi.spyOn(state, 'useDashboardState').mockReturnValue({
      currentWeek: 3,
      phase: 'Accumulation',
      systemicFatigue: 0.65,
      muscleVolumes: {
        chest: { current: 14, mev: 10, mrv: 22 },
        back: { current: 18, mev: 12, mrv: 25 },
      },
      refreshDashboard: spy,
    });
    renderWithProviders(<Dashboard />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(spy).toHaveBeenCalled();
  });
});
