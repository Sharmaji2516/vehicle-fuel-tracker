import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl space-y-5">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white">Something went wrong</h2>
                            <p className="text-sm text-slate-400">
                                An unexpected render issue occurred. Your data is safe.
                            </p>
                        </div>
                        {this.state.error && (
                            <div className="p-3 bg-slate-950 rounded-xl text-left text-xs font-mono text-rose-400/90 overflow-x-auto border border-white/5 max-h-32">
                                {this.state.error.toString()}
                            </div>
                        )}
                        <button
                            onClick={this.handleReload}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
