import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PowerHouseVolumeChart from '../components/dashboard/PowerHouseVolumeChart';

describe('PowerHouseVolumeChart', () => {
  it('renders the chart with PowerHouse branding', () => {
    render(<PowerHouseVolumeChart />);
    
    // Check if the chart title is displayed
    expect(screen.getByText('📊 Weekly Volume by Muscle Group')).toBeInTheDocument();
    
    // Check if the legend items are displayed
    expect(screen.getByText('Optimal')).toBeInTheDocument();
    expect(screen.getByText('MEV')).toBeInTheDocument();
    expect(screen.getByText('MRV')).toBeInTheDocument();
    
    // Check if the chart canvas is rendered
    expect(screen.getByRole('img')).toBeInTheDocument(); // canvas has img role
  });
});
