import { Link, NavLink } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { Dumbbell, LogOut } from "lucide-react";

export default function TopNav({ user, onSignOut }) {
  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/assessment", label: "Assessment" },
    { to: "/program", label: "Program Design" },
    { to: "/tracking", label: "Tracking" },
    { to: "/analytics", label: "Analytics" },
  ];

  return (
    <header
      className="sticky top-0 z-50 flex justify-between items-center"
      style={{
        backgroundColor: '#000',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 10px rgba(255, 0, 0, 0.3)'
      }}
    >
      <div className="flex items-center gap-2">
        <Dumbbell className="w-6 h-6" style={{ color: '#FF0000' }} />
        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          <span style={{ color: '#FF0000' }}>Power</span>
          <span style={{ color: '#FFF', margin: '0 0.2rem' }}>House</span>
          <span style={{
            color: '#000',
            backgroundColor: '#FFF',
            padding: '0.2rem 0.5rem',
            borderRadius: '5px'
          }}>ATX</span>
        </div>
      </div>

      <nav className="flex" style={{ gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <span
                style={{
                  padding: '0.5rem 1rem',
                  whiteSpace: 'nowrap',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive ? '#FF0000' : 'transparent',
                  color: isActive ? '#000' : '#fff',
                  borderRadius: '5px',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = '#FF0000';
                    e.target.style.color = '#000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#fff';
                  }
                }}
              >
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {user && (
          <span style={{
            color: '#fff',
            fontSize: '0.9rem',
            padding: '0.3rem 0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '5px'
          }}>
            {user.email}
          </span>
        )}
        <div
          style={{
            padding: '0.5rem',
            borderRadius: '5px',
            transition: 'all 0.3s ease',
            color: '#fff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF0000';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#fff';
          }}
        >
          <Avatar />
        </div>
        {user && onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              color: '#fff',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#FF0000';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#fff';
            }}
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
