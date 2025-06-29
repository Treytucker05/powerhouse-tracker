import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export default function TopNav({ user, onSignOut }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between
                    bg-surface/80 backdrop-blur-md border-b border-white/10
                    px-6 py-3">
      <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
        <Dumbbell className="w-5 h-5 text-accent" />
        PowerHouse&nbsp;ATX
      </Link>

      <div className="flex gap-6 text-sm font-semibold">
        <Link to="/program" className="hover:text-brand">Program</Link>
        <Link to="/tracking" className="hover:text-brand">Tracking</Link>
        <Link to="/analytics" className="hover:text-brand">Analytics</Link>
      </div>
    </nav>
  );
}
