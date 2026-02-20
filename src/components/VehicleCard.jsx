import React from 'react';
import { calculateMileage, calculateAverageMileage, calculateTotalSpent, calculateAllMileages, formatDate, calculateDaysSinceLastService, calculateFuelCost, calculateServiceCost } from '../utils/calculations';
import { motion } from 'framer-motion';
import { Droplet, Wrench, IndianRupee, Calendar, TrendingUp } from 'lucide-react';

const VehicleCard = ({ vehicle, entries, serviceEntries = [], onAddEntry, onViewHistory, onAddService, isSelected }) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastMileage = calculateMileage(sortedEntries);
    const avgMileage = calculateAverageMileage(sortedEntries);
    const totalSpent = calculateTotalSpent(entries, serviceEntries);
    const fuelCost = calculateFuelCost(entries);
    const serviceCost = calculateServiceCost(serviceEntries);
    const recentMileages = calculateAllMileages(entries).slice(0, 3);
    const daysSinceService = calculateDaysSinceLastService(serviceEntries);

    return (
        <div
            className={`glass-card p-6 rounded-3xl relative overflow-hidden group cursor-pointer border border-slate-200 dark:border-white/5 transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={(e) => onViewHistory(e, 'fuel')}
        >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent dark:from-white/5 dark:to-white/0 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{vehicle.name}</h3>
                    {vehicle.vehicleNumber && (
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded-md inline-block border border-slate-200 dark:border-slate-700">
                            {vehicle.vehicleNumber}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {vehicle.type}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 text-center md:text-left">
                    <p className="text-indigo-600 dark:text-indigo-300 text-xs font-medium mb-1 flex items-center justify-center md:justify-start gap-1">
                        <TrendingUp className="w-3 h-3" /> Last Eff.
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{lastMileage} <span className="text-xs text-indigo-500/60 dark:text-indigo-300/60 font-medium">km/l</span></p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center md:text-left">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Avg Eff.</p>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{avgMileage} <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">km/l</span></p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 relative z-10">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => onAddEntry(e, vehicle.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 flex items-center justify-center gap-2 transition-colors"
                >
                    <Droplet className="w-4 h-4" /> Fuel
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => onAddService(e)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 flex items-center justify-center gap-2 transition-colors"
                >
                    <Wrench className="w-4 h-4" /> Service
                </motion.button>
            </div>

            {/* Mini Stats Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2 text-center relative z-10">
                <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total Spent</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">₹{totalSpent}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Days Ago</p>
                    <p className={`text-xs font-bold mt-1 ${daysSinceService > 150 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                        {daysSinceService ?? '-'}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Fuel Cost</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">₹{fuelCost}</p>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
