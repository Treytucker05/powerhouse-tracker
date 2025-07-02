import { describe, it, expect, vi } from 'vitest';

import AppShell from '../layout/AppShell';

// Mock Supabase client
vi.mock('../lib/supabaseClient', () => {
  return {
    default: {
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
    const { getByText } = renderWithProviders(<AppShell />);
    
    expect(getByText((content) => /Power\s*House/i.test(content))).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    const { getByText } = renderWithProviders(<AppShell />);
    
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText(/Program\s*Design/i)).toBeInTheDocument();
    expect(getByText('Tracking')).toBeInTheDocument();
    expect(getByText('Analytics')).toBeInTheDocument();
  });

  it('renders with dark theme background', () => {
    const { container } = renderWithProviders(<AppShell />);
    
    const mainContainer = container.querySelector('div');
    expect(mainContainer).toHaveClass('bg-black');
  });
});
