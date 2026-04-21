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
        <div
            className={`glass-card p-6 rounded-3xl relative overflow-hidden group cursor-pointer border border-slate-200 dark:border-white/5 transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={(e) => onViewHistory(e, 'fuel')}
        >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent dark:from-white/5 dark:to-white/0 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {/* Warning Banners */}
            <div className="relative z-20 space-y-1 mb-3">
                {pucWarning && (
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 ${pucWarning.urgent ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {pucWarning.message.toUpperCase()}
                    </div>
                )}
                {insuranceWarning && (
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 ${insuranceWarning.urgent ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {insuranceWarning.message.toUpperCase()}
                    </div>
                )}
            </div>

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
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {vehicle.type}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/50 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all"
                        title="Edit Details"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>
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

            {/* Expandable Details Toggle */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsExpanded(!isDetailsExpanded);
                }}
                className="w-full mb-4 py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all"
            >
                <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    PUC & INSURANCE DETAILS
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
                            <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                                        <FileText className="w-3 h-3" /> PUC Info
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pucStatus.color.replace('text-', 'bg-').replace('-500', '-500/10')} ${pucStatus.color.replace('text-', 'border-').replace('-500', '-500/20')} ${pucStatus.color}`}>
                                        {pucStatus.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase">Cert #</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{vehicle.pucNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase">Expires</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{formatDate(vehicle.pucExpiryDate)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Insurance Details */}
                        {vehicle.insurancePolicyNumber && (
                            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                        <Shield className="w-3 h-3" /> Insurance Info
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${insuranceStatus.color.replace('text-', 'bg-').replace('-500', '-500/10')} ${insuranceStatus.color.replace('text-', 'border-').replace('-500', '-500/20')} ${insuranceStatus.color}`}>
                                        {insuranceStatus.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div className="col-span-2 mb-1">
                                        <p className="text-[9px] text-slate-400 uppercase">Company</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{vehicle.insuranceCompany || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase">Policy #</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{vehicle.insurancePolicyNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase">Expires</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{formatDate(vehicle.insuranceExpiryDate)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Add/Edit Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditModalOpen(true);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 hover:bg-slate-100 dark:hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-3 h-3" />
                            {(!vehicle.pucNumber && !vehicle.insurancePolicyNumber)
                                ? 'Add PUC & Insurance Details'
                                : 'Edit PUC & Insurance Details'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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

            {/* Edit Details Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <EditVehicleDetailsModal
                        vehicle={vehicle}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehicleCard;
