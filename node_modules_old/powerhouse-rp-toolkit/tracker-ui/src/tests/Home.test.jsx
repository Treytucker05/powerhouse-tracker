import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../src/pages/Home';

// Mock the hooks
vi.mock('../src/lib/useWeeklyVolume', () => ({
  default: () => ({
    data: [
      { muscle: 'Chest', volume: 12, week: 1 },
      { muscle: 'Back', volume: 15, week: 1 }
    ],
    loading: false
  })
}));

describe('Home Dashboard', () => {
  it('should display weekly volume chart and fatigue status', () => {
    const mockNavigate = vi.fn();
    render(<Home onNavigate={mockNavigate} />);
    
    // Check if main elements are present
    expect(screen.getByText('PowerHouse Tracker')).toBeInTheDocument();
    expect(screen.getByText('Weekly Volume')).toBeInTheDocument();
    expect(screen.getByText('Fatigue Status:')).toBeInTheDocument();
    
    // Check if navigation buttons are present
    expect(screen.getByText('View Sessions')).toBeInTheDocument();
    expect(screen.getByText('View Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Start Workout')).toBeInTheDocument();
    expect(screen.getByText('Analyze Deload Need')).toBeInTheDocument();
  });
});
