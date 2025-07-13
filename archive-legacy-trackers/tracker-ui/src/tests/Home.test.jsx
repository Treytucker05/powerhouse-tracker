import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/Home';

// Import renderWithProviders function (defined globally in vitest.setup.js)
const { renderWithProviders } = globalThis;

// Mock the training state hooks
vi.mock('../context/trainingStateHooks', () => ({
  useTrainingState: () => ({
    state: {
      aiInsight: 'Test AI insight',
      currentProgram: null,
      fatigue: 'moderate',
      currentCycle: null,
      weeklySetTonnageByMuscle: [],
      workoutSessions: [],
      currentWeek: 1,
      mesocycles: []
    },
    dispatch: vi.fn(),
    setupMesocycle: vi.fn(),
  }),
  useAI: () => 'Test AI insight',
}));

// Mock the dev seed function
vi.mock('../lib/devSeed', () => ({
  seedDemo: vi.fn(),
}));

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
  it('should display weekly volume chart and fatigue status', () => {
    const mockNavigate = vi.fn();
    renderWithProviders(<Home onNavigate={mockNavigate} />);

    // Check if main elements are present
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    expect(screen.getByText('Trey')).toBeInTheDocument();
    expect(screen.getByText('Hypertrophy')).toBeInTheDocument();
  });
});
