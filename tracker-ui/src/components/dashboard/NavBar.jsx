import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/tracking', label: 'Tracking', icon: '📊' },
    { path: '/mesocycle', label: 'Mesocycle', icon: '🗓️' },
    { path: '/microcycle', label: 'Microcycle', icon: '📅' },
    { path: '/macrocycle', label: 'Macrocycle', icon: '🎯' },
  ];  return (
    <nav className="bg-gray-800 border-b border-gray-700 overflow-x-auto navbar">
      <div className="container">
        <ul className="flex gap-8 px-4 md:px-8 relative">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`
                relative pb-3 cursor-pointer whitespace-nowrap
                text-sm font-medium transition-colors
                ${location.pathname === item.path 
                  ? "text-white border-b-2 border-red-500" 
                  : "text-gray-400 hover:text-white"
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
                    bg-red-500
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
