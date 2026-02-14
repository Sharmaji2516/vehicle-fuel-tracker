import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            {/* DEBUG BANNER */}
            <div className="bg-rose-600 text-white text-[10px] font-bold py-1 px-4 text-center z-[100] relative">
                🚨 VERSION v1.3 LIVE - IF YOU SEE THIS, UPDATE IS WORKING 🚨
            </div>
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-700/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-700/20 blur-[120px]" />
            </div>

            <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            FuelTracker
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your vehicle expenses with ease.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User Profile */}
                        <div className="flex items-center gap-2">
                            {user?.photoURL && (
                                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600" />
                            )}
                            <span className="hidden md:inline text-sm text-slate-300">{user?.displayName}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors border border-slate-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <main>
                    {children}
                </main>

                <footer className="mt-12 text-center text-slate-500 text-sm pb-4">
                    <p>© {new Date().getFullYear()} FuelTracker. All rights reserved.</p>
                    <p className="mt-1">Developed and Maintained by <span className="text-slate-400 font-medium">Lav Sharma</span></p>
                    {user && (
                        <p className="mt-1 text-xs text-slate-600">Owner: {user.displayName || user.email}</p>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default Layout;
