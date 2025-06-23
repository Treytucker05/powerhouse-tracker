import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

describe('Dashboard', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText('PowerHouse Tracker')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // Header and nav
  });

  it('renders all dashboard components', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    // Check for key sections
    expect(screen.getByText('Week Overview')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Volume Heatmap')).toBeInTheDocument();
    expect(screen.getByText('Progress Metrics')).toBeInTheDocument();
    expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
  });
});
