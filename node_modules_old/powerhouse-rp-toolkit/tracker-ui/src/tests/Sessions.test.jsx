import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sessions from '../src/pages/Sessions';

// Mock the hooks
vi.mock('../src/lib/useWorkoutSessions', () => ({
  default: () => [
    {
      id: 1,
      start_time: '2025-06-19T10:00:00Z',
      end_time: '2025-06-19T11:00:00Z',
      notes: 'Great workout'
    }
  ]
}));

vi.mock('../src/lib/useSessionSets', () => ({
  default: (sessionId) => sessionId ? [
    {
      id: 1,
      set_number: 1,
      exercise: 'Bench Press',
      weight: 135,
      reps: 10,
      rir: 2
    }
  ] : []
}));

describe('Sessions with Drawer', () => {
  it('should open drawer when session row is clicked', () => {
    render(<Sessions />);
    
    // Find and click on the session row
    const sessionRow = screen.getByText('Great workout').closest('tr');
    fireEvent.click(sessionRow);
    
    // Check if drawer opened with set log
    expect(screen.getByText('Set log')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('135')).toBeInTheDocument();
  });
  
  it('should close drawer when close button is clicked', () => {
    render(<Sessions />);
    
    // Open drawer
    const sessionRow = screen.getByText('Great workout').closest('tr');
    fireEvent.click(sessionRow);
    
    // Close drawer
    const closeButton = screen.getByText('Close ✕');
    fireEvent.click(closeButton);
    
    // Check if drawer is closed
    expect(screen.queryByText('Set log')).not.toBeInTheDocument();
  });
});
