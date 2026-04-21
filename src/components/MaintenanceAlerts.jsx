import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { getVehicleAlerts } from '../utils/calculations';
import { AlertTriangle, ShieldAlert, Wrench, X, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenanceAlerts = () => {
    const { vehicles, getVehicleServiceEntries } = useFuel();
    const [alerts, setAlerts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const allAlerts = vehicles.flatMap(vehicle => {
            const serviceEntries = getVehicleServiceEntries(vehicle.id);
            return getVehicleAlerts(vehicle, serviceEntries);
        });

        const criticalOrWarningAlerts = allAlerts.filter(a => a.level === 'critical' || a.level === 'warning');

        setAlerts(criticalOrWarningAlerts);

        if (criticalOrWarningAlerts.length > 0) {
            // Small delay to let the dashboard render
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [vehicles, getVehicleServiceEntries]);

    // If no alerts, don't render anything, not even the banner
    if (alerts.length === 0) return null;

    const criticalCount = alerts.filter(a => a.level === 'critical').length;

    return (
        <>
            {/* Persistent Floating Banner */}
            <AnimatePresence>
                {!isOpen && alerts.length > 0 && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed top-0 left-0 right-0 z-[10001] flex items-center justify-center p-2"
                    >
                        <button className={`w-full max-w-4xl flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border-2 ${criticalCount > 0
                            ? 'bg-rose-600 border-rose-400 text-white'
                            : 'bg-amber-500 border-amber-300 text-white'
                            } hover:scale-[1.01] active:scale-[0.99] transition-all group shadow-rose-500/20`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-white/20 text-white animate-pulse">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                                    {alerts.length} Urgent Maintenance {alerts.length === 1 ? 'Action' : 'Actions'} Required
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase bg-black/10 px-3 py-1 rounded-full border border-white/20">
                                View Details <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Modal Alert */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className={`p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center ${criticalCount > 0 ? 'bg-rose-50 dark:bg-rose-500/5' : 'bg-amber-50 dark:bg-amber-500/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${criticalCount > 0 ? 'bg-rose-500 shadow-rose-500/20' : 'bg-amber-500 shadow-amber-500/20'} shadow-lg text-white`}>
                                        {criticalCount > 0 ? <ShieldAlert className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Maintenance Required</h3>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                                            {alerts.length} Important {alerts.length === 1 ? 'Alert' : 'Alerts'} for your garage
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Sub-header Explanation */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 flex gap-4 text-[10px] font-black uppercase tracking-tighter overflow-x-auto whitespace-nowrap scrollbar-hide">
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green (&gt;15 Days)
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow (Expires &lt;15 Days / Service &gt;165 Days)
                                </div>
                                <div className="flex items-center gap-1.5 text-rose-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red (Expired / Service &gt;180 Days)
                                </div>
                            </div>

                            {/* List of Alerts */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {alerts.map((alert, idx) => (
                                    <div
                                        key={`${alert.vehicleName}-${alert.type}-${idx}`}
                                        className={`group relative p-4 rounded-3xl border transition-all ${alert.level === 'critical'
                                            ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                                            : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2.5 rounded-xl shrink-0 ${alert.level === 'critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                                                }`}>
                                                {alert.type === 'Service' ? <Wrench className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate uppercase tracking-wide">
                                                        {alert.vehicleName}
                                                    </h4>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${alert.level === 'critical'
                                                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                        }`}>
                                                        {alert.type}
                                                    </span>
                                                </div>
                                                <p className={`text-xs font-bold leading-relaxed ${alert.level === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                                                    }`}>
                                                    {alert.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Component */}
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
                                >
                                    I'll fix it soon
                                </button>
                                <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-4 font-bold uppercase tracking-widest">
                                    Stay safe on the road 🛣️
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaintenanceAlerts;
