import React from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-700/20 blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-700/20 blur-[120px] animate-pulse-slow" />

            <div className="z-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                <div className="mb-6">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
                        FuelTracker
                    </h1>
                    <p className="text-slate-400">Secure Cloud Sync & Backup</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-3 px-4 rounded-xl hover:bg-slate-100 transition-all transform hover:-translate-y-0.5 shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="text-left space-y-3 mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                        <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">How your data is protected:</h3>
                        <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                            <li>Each user has a unique ID tied to their Google account.</li>
                            <li>Data is filtered so you <span className="text-indigo-400">only</span> see what you added.</li>
                            <li>Cloud sync ensures your records are never lost, even if you refresh or switch devices.</li>
                        </ul>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                        Authentication is handled securely by Google, ensuring your password never reaches our servers.
                        Anyone can sign in, but they will only access their own private dashboard.
                    </p>
                </div>
            </div>

            <footer className="mt-8 text-slate-600 text-sm text-center">
                <p>Developed and Maintained by <span className="text-slate-400 font-medium">Lav Sharma</span></p>
            </footer>
        </div>
    );
};

export default Login;
