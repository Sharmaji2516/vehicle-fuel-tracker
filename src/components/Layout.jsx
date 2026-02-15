import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'
            }`}>
            {/* Background Gradients - Only for dark theme */}
            {isDark && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-700/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-700/20 blur-[120px]" />
                </div>
            )}

            <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            FuelTracker
                        </h1>
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Manage your vehicle expenses with ease.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                }`}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-2">
                            {user?.photoURL && (
                                <img src={user.photoURL} alt="Profile" className={`w-8 h-8 rounded-full border ${isDark ? 'border-slate-600' : 'border-gray-300'}`} />
                            )}
                            <span className={`hidden md:inline text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{user?.displayName}</span>
                        </div>
                        <button
                            onClick={logout}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                                }`}
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <main>
                    {children}
                </main>

                <footer className={`mt-12 text-center text-sm pb-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    <p>© {new Date().getFullYear()} FuelTracker. All rights reserved.</p>
                    <p className="mt-1">Developed and Maintained by <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>Lav Sharma</span></p>
                    {user && (
                        <p className={`mt-1 text-xs ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>Owner: {user.displayName || user.email}</p>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default Layout;
