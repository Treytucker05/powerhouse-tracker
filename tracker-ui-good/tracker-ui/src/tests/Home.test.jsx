import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { renderWithProviders } from './test-utils';

// Mock the hooks
vi.mock('../lib/useWeeklyVolume', () => ({
  default: () => ({
    data: [
      { muscle: 'Chest', volume: 12, week: 1 },
      { muscle: 'Back', volume: 15, week: 1 }
    ],
    loading: false
  })
}));

describe('Home Dashboard', () => {
  it('should display main dashboard elements', async () => {
    const mockNavigate = vi.fn();

    const { container } = renderWithProviders(
      <MemoryRouter>
        <Home onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    // Wait for component to load and check for key elements
    await waitFor(() => {
      expect(container.textContent).toContain('Welcome back,');
    }, { timeout: 2000 });

    // Check if main sections are present
    expect(container.textContent).toContain('Current Training Status');
    expect(container.textContent).toContain('WEEK');
    expect(container.textContent).toContain('PHASE');
  });
});
