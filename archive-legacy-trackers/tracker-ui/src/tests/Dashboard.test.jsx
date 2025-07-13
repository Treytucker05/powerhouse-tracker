import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Import renderWithProviders function (defined globally in vitest.setup.js)
const { renderWithProviders } = globalThis;

describe('Dashboard', () => {

  it('renders without crashing', () => {
    renderWithProviders(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('PowerHouse Tracker')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // Header and nav
  });

  it('renders all dashboard components', async () => {
    renderWithProviders(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for async content to load - the new hooks may show loading states initially
    await waitFor(() => {
      expect(screen.getByText('Week Overview')).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Volume Heatmap')).toBeInTheDocument();
    });

    expect(screen.getByText('Progress Metrics')).toBeInTheDocument();
    expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
  });
});
