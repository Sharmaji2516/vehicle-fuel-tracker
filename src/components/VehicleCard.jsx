import React, { useState } from 'react';
import { calculateMileage, calculateAverageMileage, calculateTotalSpent, calculateAllMileages, formatDate, calculateDaysSinceLastService, calculateFuelCost, calculateServiceCost, calculateExpiryStatus, getExpiryWarning } from '../utils/calculations';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Wrench, IndianRupee, Calendar, TrendingUp, Info, Shield, FileText, ChevronDown, ChevronUp, AlertTriangle, Edit3 } from 'lucide-react';
import EditVehicleDetailsModal from './EditVehicleDetailsModal';

const VehicleCard = ({ vehicle, entries, serviceEntries = [], onAddEntry, onViewHistory, onAddService, isSelected }) => {
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastMileage = calculateMileage(sortedEntries);
    const avgMileage = calculateAverageMileage(sortedEntries);
    const totalSpent = calculateTotalSpent(entries, serviceEntries);
    const fuelCost = calculateFuelCost(entries);
    const serviceCost = calculateServiceCost(serviceEntries);
    const recentMileages = calculateAllMileages(entries).slice(0, 3);
    const daysSinceService = calculateDaysSinceLastService(serviceEntries);

    const pucWarning = getExpiryWarning('PUC', vehicle.pucExpiryDate);
    const insuranceWarning = getExpiryWarning('Insurance', vehicle.insuranceExpiryDate);
    const pucStatus = calculateExpiryStatus(vehicle.pucExpiryDate);
    const insuranceStatus = calculateExpiryStatus(vehicle.insuranceExpiryDate);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className={`glass-card p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/20 dark:border-white/10 transition-all duration-500 ${isSelected ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20' : ''}`}
            onClick={(e) => onViewHistory(e, 'fuel')}
        >
            {/* Ambient Background Accents */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

            {/* Warning Banners */}
            <div className="relative z-20 flex flex-wrap gap-2 mb-4">
                {pucWarning && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm border ${pucWarning.urgent ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {pucWarning.message.toUpperCase()}
                    </motion.div>
                )}
                {insuranceWarning && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm border ${insuranceWarning.urgent ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {insuranceWarning.message.toUpperCase()}
                    </motion.div>
                )}
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {vehicle.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                            {vehicle.vehicleNumber || 'NO NUMBER'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/80 dark:text-indigo-400/80">
                            • {vehicle.type}
                        </span>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 p-4 rounded-[1.5rem] border border-indigo-500/10 dark:border-indigo-500/20 group/stat">
                    <p className="text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> Last Eff.
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{lastMileage}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">km/l</span>
                    </div>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-[1.5rem] border border-slate-200/50 dark:border-white/5">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Avg Eff.</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-700 dark:text-slate-200 tracking-tighter">{avgMileage}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">km/l</span>
                    </div>
                </div>
            </div>

            {/* Expandable Details Toggle */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsExpanded(!isDetailsExpanded);
                }}
                className="w-full mb-4 py-3 px-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:border-indigo-500/30 transition-all shadow-sm group/btn"
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 group-hover/btn:scale-110 transition-transform">
                        <Info className="w-3.5 h-3.5" />
                    </div>
                    PUC & INSURANCE
                </div>
                {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isDetailsExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6 space-y-3"
                    >
                        {/* PUC Details */}
                        {vehicle.pucNumber && (
                            <div className="p-4 rounded-2xl bg-white/40 dark:bg-indigo-500/5 border border-slate-200/50 dark:border-indigo-500/10 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                                        <FileText className="w-4 h-4" /> PUC
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border shadow-sm ${pucStatus.color.replace('text-', 'bg-').replace('-500', '-500/10')} ${pucStatus.color.replace('text-', 'border-').replace('-500', '-500/20')} ${pucStatus.color}`}>
                                        {pucStatus.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Cert #</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{vehicle.pucNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Expires</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatDate(vehicle.pucExpiryDate)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Insurance Details */}
                        {vehicle.insurancePolicyNumber && (
                            <div className="p-4 rounded-2xl bg-white/40 dark:bg-emerald-500/5 border border-slate-200/50 dark:border-emerald-500/10 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                        <Shield className="w-3.5 h-3.5" /> Insurance
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shadow-sm ${insuranceStatus.color.replace('text-', 'bg-').replace('-500', '-500/10')} ${insuranceStatus.color.replace('text-', 'border-').replace('-500', '-500/20')} ${insuranceStatus.color}`}>
                                        {insuranceStatus.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="col-span-2">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Provider</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{vehicle.insuranceCompany || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Policy #</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{vehicle.insurancePolicyNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Expires</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatDate(vehicle.insuranceExpiryDate)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Actions */}
            <div className="flex gap-3 relative z-10">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => onAddEntry(e, vehicle.id)}
                    className="flex-1 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all border border-indigo-400/20"
                >
                    <Droplet className="w-4 h-4" /> Add Fuel
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => onAddService(e)}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200 dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
                >
                    <Wrench className="w-4 h-4" /> Service
                </motion.button>
            </div>

            {/* Mini Stats Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/5 grid grid-cols-3 gap-2 relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Total Spent</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter truncate">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-center border-x border-slate-200/60 dark:border-white/5 px-2">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Last Svc</p>
                    <p className={`text-sm font-black tracking-tighter ${daysSinceService > 150 ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {daysSinceService ?? '-'} <span className="text-[10px] font-bold text-slate-500">d</span>
                    </p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Fuel Cost</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter truncate">₹{fuelCost.toLocaleString()}</p>
                </div>
            </div>

            {/* Edit Details Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <EditVehicleDetailsModal
                        vehicle={vehicle}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default VehicleCard;
