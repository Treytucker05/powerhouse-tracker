import { describe, it, expect } from 'vitest';
import PowerHouseVolumeChart from '../components/dashboard/PowerHouseVolumeChart';
import { renderWithProviders } from './test-utils';

describe('PowerHouseVolumeChart', () => {
  it('renders the chart with basic elements', () => {
    const { container } = renderWithProviders(<PowerHouseVolumeChart />);

    // Check if the component renders without crashing
    expect(container.querySelector('div')).toBeTruthy();

    // Check for chart-related text content
    expect(container.textContent).toContain('Weekly Volume');
  });
});
