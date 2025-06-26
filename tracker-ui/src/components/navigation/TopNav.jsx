import { Link, NavLink } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { Monitor, LogOut } from "lucide-react";

export default function TopNav({ user, onSignOut }) {
  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/assessment", label: "Assessment" },
    { to: "/program", label: "Program Design" },
    { to: "/tracking", label: "Tracking" },
    { to: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="h-20 w-full bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 backdrop-blur-md border-b border-gray-700/50 text-gray-100 shadow-lg flex items-center px-8 lg:px-12">
      <Link to="/" className="flex items-center text-2xl font-bold tracking-wide hover:scale-105 transition-all duration-300 group">
        <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
          PowerHouse
        </span>
        <span className="bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent ml-0.5">
          ATX
        </span>
      </Link>

      <nav className="flex ml-20 gap-10 text-base font-bold uppercase tracking-wider">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "text-white bg-red-500/25 border border-red-500/40 shadow-lg scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 border border-transparent"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-5">
        {user && (
          <span className="text-base text-gray-300 hidden sm:inline px-4 py-2 rounded-lg bg-white/10 font-medium">
            {user.email}
          </span>
        )}
        <div className="p-2 rounded-xl hover:bg-white/15 transition-colors">
          <Avatar />
        </div>
        {user && onSignOut && (
          <button
            onClick={onSignOut}
            className="text-gray-400 hover:text-white hover:bg-red-600/25 p-3 rounded-xl transition-all duration-200 group"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </header>
  );
}
