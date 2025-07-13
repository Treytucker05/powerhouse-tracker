import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Logger from '../pages/Logger';

// Import renderWithProviders function (defined globally in vitest.setup.js)
const { renderWithProviders } = globalThis;

// Mock the hooks
vi.mock('../hooks/useActiveSession', () => ({
  useActiveSession: () => ({
    activeSession: null,
    loading: false,
    startSession: vi.fn(),
    finishSession: vi.fn(),
    addSet: vi.fn()
  })
}));

vi.mock('../lib/useSessionSets', () => ({
  default: () => []
}));

describe('Logger Page', () => {
  it('should display start session form when no active session', () => {
    renderWithProviders(<Logger />);

    expect(screen.getByText('Workout Logger')).toBeInTheDocument();
    expect(screen.getByText('Start New Session')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Push workout, feeling strong')).toBeInTheDocument();
    expect(screen.getByText('Start Session')).toBeInTheDocument();
  });
});
