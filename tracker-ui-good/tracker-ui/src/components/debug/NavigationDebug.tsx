import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationDebug: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const testNavigation = (path: string) => {
        console.log(`🔄 Attempting navigation to: ${path}`);
        console.log(`📍 Current location:`, location);
        try {
            navigate(path);
            console.log(`✅ Navigation to ${path} successful`);
        } catch (error) {
            console.error(`❌ Navigation to ${path} failed:`, error);
        }
    };

    return (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
            <h4 className="font-bold mb-2">Navigation Debug</h4>
            <p className="text-xs mb-2">Current: {location.pathname}</p>
            <div className="space-y-1">
                <button
                    onClick={() => testNavigation('/')}
                    className="block w-full text-left px-2 py-1 bg-red-700 rounded text-xs"
                >
                    Go to Home
                </button>
                <button
                    onClick={() => testNavigation('/program')}
                    className="block w-full text-left px-2 py-1 bg-red-700 rounded text-xs"
                >
                    Go to Program
                </button>
                <button
                    onClick={() => testNavigation('/program-design')}
                    className="block w-full text-left px-2 py-1 bg-red-700 rounded text-xs"
                >
                    Go to Program Design
                </button>
            </div>
        </div>
    );
};

export default NavigationDebug;
