import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Intelligence from '../pages/Intelligence';

// Mock the useAdaptiveRIR hook
vi.mock('../src/lib/useAdaptiveRIR', () => ({
  default: () => [
    {
      muscle: 'Chest',
      recommended_rir: 2.5,
      confidence: 0.85
    },
    {
      muscle: 'Back',
      recommended_rir: 3.0,
      confidence: 0.92
    }
  ]
}));

describe('Intelligence Page', () => {
  it('should display adaptive RIR recommendations', () => {
    render(<Intelligence />);
    
    // Check if the page title is displayed
    expect(screen.getByText('Adaptive RIR Recommendations')).toBeInTheDocument();
    
    // Check if muscle groups are displayed
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    
    // Check if RIR values are displayed
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
    
    // Check if confidence levels are displayed
    expect(screen.getByText('Confidence: 85%')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 92%')).toBeInTheDocument();
  });
    it('should display empty state when no recommendations', () => {
    // Mock empty data
    vi.doMock('../src/lib/useAdaptiveRIR', () => ({
      default: () => []
    }));
    
    const { unmount } = render(<Intelligence />);
    unmount();
    
    // Re-render with new mock
    render(<Intelligence />);
    
    expect(screen.getByText('No recommendations found.')).toBeInTheDocument();
  });
});
