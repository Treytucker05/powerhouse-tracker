import { Link, NavLink } from "react-router-dom";
import HeaderAuthButton from '@/components/auth/HeaderAuthButton';
import { Avatar } from "../ui/avatar";
import {
  Dumbbell,
  LogOut,
  Menu,
  X,
  Home,
  ClipboardList,
  Cog,
  Activity,
  BarChart3,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useFinalPlan } from '@/store/finalPlanStore';
import { Link as RRLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function TopNav({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { locked, reset, plan } = useFinalPlan();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/program-design", label: "Program Design", icon: Cog },
    { to: "/tracking", label: "Tracking", icon: Activity },
    { to: "/train", label: "Train Today", icon: ClipboardList },
    { to: "/history", label: "History", icon: Activity },
    { to: "/settings", label: "Settings", icon: Cog },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/exercises", label: "Exercises", icon: Dumbbell },
    { to: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 dark:bg-gray-900 shadow-md">
      <div className="flex justify-between items-center p-4 gap-4 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Dumbbell className="w-6 h-6 text-red-500" />
          <div className="text-xl font-bold">
            <span className="text-red-500">Power</span>
            <span className="text-white mx-1">House</span>
            <span
              className="inline-block bg-white !text-black px-2 py-0.5 rounded text-sm font-semibold tracking-wide select-none leading-none border border-black/10"
              style={{ color: '#000', WebkitTextStroke: '0', textShadow: 'none' }}
            >ATX</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 flex-1 justify-center">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActive
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-red-300 hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-2 relative">
          {/* Profile Avatar Button */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full transition-colors hover:bg-gray-800"
            title="Profile"
          >
            <Avatar />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 bg-gray-800 rounded-md shadow-lg py-2 min-w-48 border border-gray-700">
              {user && (
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                </div>
              )}
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile Settings
              </Link>
            </div>
          )}

          {/* Logout Button */}
          <HeaderAuthButton />
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {locked && (
        <div className="bg-emerald-900/30 border-t border-b border-emerald-700 text-emerald-200 text-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
              <span>
                Plan Locked — saved {plan?.createdAt ? new Date(plan.createdAt).toLocaleString() : 'this session'}.
              </span>
              <span
                className="text-emerald-300/80"
                title={`Rotation: ${plan?.schedule?.rotation ?? '-'} • Test: ${plan?.progression?.plan?.testAfterAnchor ?? '-'}`}
              >
                Template: {plan?.step3?.supplemental?.Template || 'Custom'} • Days/wk: {plan?.schedule?.daysPerWeek ?? '-'} • Weeks: {plan?.progression?.weeks?.length ?? '-'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-xs rounded border border-emerald-600 hover:bg-emerald-800"
                onClick={() => navigate('/build/step6')}
              >View</button>
              <button
                className="px-2 py-1 text-xs rounded border border-gray-600 hover:bg-gray-800 text-gray-200"
                onClick={() => {
                  if (window.confirm('Reset final plan and unlock Steps 1–5?')) {
                    reset();
                    toast.info('Final plan reset. Steps 1–5 unlocked.');
                  }
                }}
              >Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-gray-900">
          <div className="px-4 py-2 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-red-300 hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}

            {/* Mobile Profile Link */}
            <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-red-300 hover:bg-gray-800'
                }`
              }
            >
              <Avatar />
              Profile
            </NavLink>

            {/* Mobile Logout */}
            <HeaderAuthButton />
          </div>
        </div>
      )}

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
}
