// Mock must be defined before components import Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: null } })),
      onAuthStateChange: vi.fn((cb) => {
        cb('SIGNED_OUT', { user: null });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signOut: vi.fn(async () => ({ error: null }))
    }
  }
}));
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppShell from '../layout/AppShell';
import { AppProvider } from '@/context/AppContext';

// (Duplicate mock removed)

describe('<AppShell />', () => {
  it('contains header with PowerHouse Tracker branding', async () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </BrowserRouter>
    );
    const power = await screen.findByText(/Power/i);
    const house = await screen.findByText(/House/i);
    expect(power).toBeTruthy();
    expect(house).toBeTruthy();
  });

  it('contains navigation links', async () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </BrowserRouter>
    );
    const dashboardLinks = await screen.findAllByText('Dashboard');
    expect(dashboardLinks.length).toBeGreaterThan(0);
    const programLinks = await screen.findAllByText(/Program/i);
    expect(programLinks.length).toBeGreaterThan(0);
    const trackingLinks = await screen.findAllByText(/Tracking/i);
    expect(trackingLinks.length).toBeGreaterThan(0);
  });

  it('renders with dark theme background', () => {
    const { container } = render(
      <BrowserRouter>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </BrowserRouter>
    );
    const mainContainer = container.querySelector('div');
    expect(mainContainer && mainContainer.className.includes('bg-black')).toBe(true);
  });
});
