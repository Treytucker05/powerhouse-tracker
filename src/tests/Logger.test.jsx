import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Logger from '../src/pages/Logger';

// Mock the hooks
vi.mock('../src/lib/useActiveSession', () => ({
  default: () => ({
    activeSession: null,
    loading: false,
    startSession: vi.fn(),
    finishSession: vi.fn(),
    addSet: vi.fn()
  })
}));

vi.mock('../src/lib/useSessionSets', () => ({
  default: () => []
}));

describe('Logger Page', () => {
  it('should display start session form when no active session', () => {
    render(<Logger />);
    
    expect(screen.getByText('Workout Logger')).toBeInTheDocument();
    expect(screen.getByText('Start New Session')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Push workout, feeling strong')).toBeInTheDocument();
    expect(screen.getByText('Start Session')).toBeInTheDocument();
  });
});
