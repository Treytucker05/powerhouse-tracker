import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppShell from '../layout/AppShell';

// Mock Supabase client
vi.mock('../lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ 
          data: { session: null } 
        }),
        onAuthStateChange: vi.fn().mockReturnValue({ 
          data: { subscription: { unsubscribe: vi.fn() } } 
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    },
  };
});

describe('<AppShell />', () => {
  it('contains header with PowerHouse Tracker branding', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    );
    
    expect(getByText('PowerHouse Tracker')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    );
    
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Program')).toBeInTheDocument();
    expect(getByText('Tracking')).toBeInTheDocument();
    expect(getByText('Analytics')).toBeInTheDocument();
  });

  it('renders with dark theme background', () => {
    const { container } = render(
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    );
    
    const mainContainer = container.querySelector('div');
    expect(mainContainer).toHaveClass('bg-black');
  });
});
