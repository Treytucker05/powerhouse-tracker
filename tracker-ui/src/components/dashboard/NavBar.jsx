import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/tracking', label: 'Tracking', icon: '📊' },
    { path: '/mesocycle', label: 'Mesocycle', icon: '🗓️' },
    { path: '/microcycle', label: 'Microcycle', icon: '📅' },
    { path: '/macrocycle', label: 'Macrocycle', icon: '🎯' },
  ];
  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto navbar">
      <div className="container">
        <ul className="flex gap-8 px-4 md:px-8 relative">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`
                relative pb-3 cursor-pointer whitespace-nowrap
                text-sm font-medium transition-colors
                ${location.pathname === item.path 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }
              `}
              onClick={() => navigate(item.path)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {location.pathname === item.path && (
                <span
                  className="
                    absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t
                    bg-gradient-to-r from-red-500 to-red-700
                  "
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
