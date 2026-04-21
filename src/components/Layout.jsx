import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, LogOut, Sun, Moon, User, Facebook, Instagram, MapPin, Smartphone, Mail, Clock } from 'lucide-react';
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

                <footer className="mt-12 bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            {/* Brand Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-500 rounded-lg">
                                        <Fuel className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white">FuelTracker</span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    Your personal companion for tracking vehicle performance, fuel efficiency, and maintenance records. Precision monitoring for every mile.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:text-indigo-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                                    <a href="#" className="hover:text-indigo-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                                    <a href="#" className="hover:text-indigo-400 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold">Quick Links</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Vehicles</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Maintenance History</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Fuel Logs</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Settings</a></li>
                                </ul>
                            </div>

                            {/* Support Section */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold">Get Support</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-indigo-400" />
                                        <span>29 Rajive Colony, Meera Market, Chittorgarh</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Smartphone className="w-4 h-4 text-indigo-400" />
                                        <span>+91 9680580008, +91 9636328022</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-indigo-400" />
                                        <span>sonu18soni@gmail.com</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-indigo-400" />
                                        <span>Daily: 8:00 AM - 10:00 PM</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Credits Badge */}
                        <div className="flex flex-col items-center pt-8 border-t border-slate-800 gap-6">
                            <div className="inline-flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-sm group hover:border-indigo-500/50 transition-all cursor-pointer">
                                <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden bg-white shadow-inner">
                                    <img src="/chittortech_logo.png" alt="ChittorTech Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium tracking-wide">
                                    Developed & Maintained by <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">ChittorTech</span>
                                </span>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-xs text-slate-500">
                                    © {new Date().getFullYear()} FuelTracker. All rights reserved.
                                </p>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold font-mono">
                                    Fuel Efficiency & Vehicle Management System
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
