import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({ customPaths = [] }) => {
  const location = useLocation();
  
  // Define the hierarchy and display names
  const pathMapping = {
    '/': { name: 'Home', icon: HomeIcon },
    '/tracking': { name: 'Tracking', icon: null },
    '/mesocycle': { name: 'Mesocycle Planning', icon: null },
    '/microcycle': { name: 'Microcycle Planning', icon: null },
    '/macrocycle': { name: 'Macrocycle Planning', icon: null },
    ...customPaths.reduce((acc, path) => {
      acc[path.path] = { name: path.name, icon: path.icon };
      return acc;
    }, {})
  };

  // Build breadcrumb trail
  const buildBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ path: '/', name: 'Home', icon: HomeIcon }];
    
    // Build cumulative paths
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const pathInfo = pathMapping[currentPath];
      if (pathInfo) {
        breadcrumbs.push({
          path: currentPath,
          name: pathInfo.name,
          icon: pathInfo.icon
        });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <nav className="breadcrumb-nav mb-6">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = breadcrumb.icon;
          
          return (
            <div key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
              )}
              
              {isLast ? (
                <span className="flex items-center text-blue-400 font-medium">
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3 relative">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out progress-bar"
            style={{ 
              width: `${((breadcrumbs.length - 1) / 3) * 100}%`,
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
            }}
          />
        </div>
        
        {/* Progress steps */}
        <div className="absolute top-0 left-0 w-full flex justify-between -mt-1">
          {['Tracking', 'Mesocycle', 'Microcycle', 'Macrocycle'].map((step, index) => (
            <div 
              key={step}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                index < breadcrumbs.length - 1 
                  ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/50' 
                  : 'bg-gray-700 border-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
