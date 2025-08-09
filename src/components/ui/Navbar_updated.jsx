import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Settings, User, LogOut } from 'lucide-react';
import { useApp } from '../../context';
import { supabase } from '../../lib/api/supabaseClient';

export default function Navbar() {
    const location = useLocation();
    const { user, assessment, clearUserData } = useApp();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            clearUserData();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        {
            to: '/',
            icon: Home,
            label: 'Dashboard',
            description: 'Dashboard & Overview'
        },
        {
            to: '/program',
            icon: Settings,
            label: 'Program Design',
            description: 'Complete Assessment & Build Your Program',
            badge: !assessment ? 'Start Here' : 'Continue'
        }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-sm">PH</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-lg">
                                        Power<span className="text-white font-semibold">House</span><span className="ml-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[12px] leading-none align-middle">ATX</span>
                                    </div>
                                    <div className="text-gray-400 text-xs">RP Toolkit</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Items - Desktop */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.to);

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`
                                            relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                            ${item.disabled
                                                ? 'text-gray-500 cursor-not-allowed'
                                                : active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }
                                        `}
                                        onClick={(e) => item.disabled && e.preventDefault()}
                                        title={item.disabled ? 'Complete assessment first' : item.description}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-4 h-4 mr-2" />
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                {/* User Info */}
                                <div className="hidden sm:block text-right">
                                    <div className="text-white text-sm font-medium">
                                        {user.user_metadata?.first_name || user.email?.split('@')[0] || 'User'}
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        {assessment ? 'Assessment Complete' : 'Setup Required'}
                                    </div>
                                </div>

                                {/* User Avatar */}
                                <div className="relative">
                                    <button className="bg-gray-700 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <User className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Sign Out */}
                                <button
                                    onClick={handleSignOut}
                                    className="bg-gray-700 rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.to);

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`
                                        block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                        ${item.disabled
                                            ? 'text-gray-500 cursor-not-allowed'
                                            : active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                    `}
                                    onClick={(e) => item.disabled && e.preventDefault()}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Icon className="w-5 h-5 mr-3" />
                                            <div>
                                                <div>{item.label}</div>
                                                <div className="text-xs text-gray-400">{item.description}</div>
                                            </div>
                                        </div>
                                        {item.badge && (
                                            <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Assessment Status Bar */}
            {!assessment && location.pathname !== '/assessment' && (
                <div className="bg-yellow-600 border-b border-yellow-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                                <ClipboardList className="w-4 h-4 text-yellow-100 mr-2" />
                                <span className="text-yellow-100 text-sm font-medium">
                                    Complete your assessment to unlock program design
                                </span>
                            </div>
                            <Link
                                to="/assessment"
                                className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                                Start Assessment
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
