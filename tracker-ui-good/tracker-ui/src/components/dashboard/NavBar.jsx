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
    <nav className="bg-gray-800 border-b border-gray-700 overflow-x-auto navbar shadow-lg">
      <div className="container">
        <ul className="flex gap-2 px-4 md:px-8 relative">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`
                relative pb-4 pt-4 px-6 cursor-pointer whitespace-nowrap
                text-base font-semibold transition-all duration-300 ease-in-out
                rounded-t-lg hover:bg-gray-700
                ${location.pathname === item.path 
                  ? "text-white bg-gray-700 border-b-4 border-red-500 shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                }
              `}
              onClick={() => navigate(item.path)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <span
                  className="
                    absolute left-0 right-0 -bottom-[1px] h-1 rounded-t-lg
                    bg-red-500 shadow-red-500/50 shadow-lg
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
