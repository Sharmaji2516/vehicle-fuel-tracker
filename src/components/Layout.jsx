import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, LogOut, Sun, Moon, User } from 'lucide-react';
import { cn } from '../utils/cn';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={cn(
            "min-h-screen font-sans transition-colors duration-300",
            isDark ? "dark" : ""
        )}>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
                {/* Ambient Background Glow */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-100">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse-slow" />
                </div>

                {/* Navbar */}
                <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Fuel className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                                    FuelTracker
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                                >
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                                <div className="flex items-center gap-3">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.displayName}</span>
                                        <span className="text-xs text-slate-500">{user?.email}</span>
                                    </div>
                                    <div className="relative">
                                        {user?.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-indigo-500/20" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center ring-2 ring-indigo-500/20">
                                                <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <footer className="mt-auto border-t border-slate-200 dark:border-white/5 py-8 text-center text-sm text-slate-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <p className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-2">
                        <span>© {new Date().getFullYear()} FuelTracker.</span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1">
                            Developed & Maintained by
                            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 hover:scale-105 transition-transform cursor-default">
                                Lav & Kush Sharma
                            </span>
                        </span>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
