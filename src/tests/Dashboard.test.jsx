import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../pages/Dashboard';

describe('Dashboard', () => {
  const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  it('renders without crashing', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    
    expect(screen.getByText('PowerHouse Tracker')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // Header and nav
  });  it('renders all dashboard components', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>
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
