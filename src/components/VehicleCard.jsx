import React from 'react';
import { calculateMileage, calculateAverageMileage, calculateTotalSpent, calculateAllMileages, formatDate, calculateDaysSinceLastService } from '../utils/calculations';

const VehicleCard = ({ vehicle, entries, serviceEntries = [], onAddEntry, onViewHistory, onAddService }) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastMileage = calculateMileage(sortedEntries);
    const avgMileage = calculateAverageMileage(sortedEntries);
    const totalSpent = calculateTotalSpent(entries, serviceEntries);
    const recentMileages = calculateAllMileages(entries).slice(0, 3);
    const daysSinceService = calculateDaysSinceLastService(serviceEntries);

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                    {vehicle.vehicleNumber && (
                        <p className="text-sm font-bold text-cyan-400 tracking-wider mt-1">{vehicle.vehicleNumber}</p>
                    )}
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-700/50 px-2 py-1 rounded mt-1 inline-block">
                        {vehicle.type} • {vehicle.fuelType}
                    </span>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-slate-700/50 rounded-full p-1 border border-slate-600">
                        <button
                            onClick={(e) => onViewHistory(e, 'fuel')}
                            className="px-3 py-1.5 rounded-full transition-all text-[11px] font-bold uppercase tracking-tight hover:bg-indigo-600 hover:text-white text-slate-300"
                        >
                            Fuel
                        </button>
                        <button
                            onClick={(e) => onViewHistory(e, 'service')}
                            className="px-3 py-1.5 rounded-full transition-all text-[11px] font-bold uppercase tracking-tight hover:bg-emerald-600 hover:text-white text-slate-300"
                        >
                            Service
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={(e) => onAddEntry(e, vehicle.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/30"
                            title="Add Fuel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => onAddService(e)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/30"
                            title="Add Service"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-700/30 p-3 rounded-xl">
                    <p className="text-slate-400 text-xs">Last Efficiency</p>
                    <p className="text-2xl font-bold text-cyan-400">{lastMileage} <span className="text-sm text-slate-500">km/l</span></p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-xl">
                    <p className="text-slate-400 text-xs">Avg Efficiency</p>
                    <p className="text-2xl font-bold text-emerald-400">{avgMileage} <span className="text-sm text-slate-500">km/l</span></p>
                </div>

                {recentMileages.length > 0 && (
                    <div className="col-span-2 bg-slate-700/20 p-3 rounded-xl">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Recent Mileages</p>
                        <div className="flex gap-2">
                            {recentMileages.map((m, idx) => (
                                <div key={idx} className="flex-1 bg-slate-800/50 p-2 rounded-lg border border-slate-700 text-center">
                                    <p className="text-cyan-400 font-bold text-sm">{m.mileage}</p>
                                    <p className="text-[9px] text-slate-500">{formatDate(m.date)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="col-span-2 bg-slate-700/30 p-3 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-slate-400 text-xs">Total Spent</p>
                        <p className="text-lg font-bold text-rose-400">₹{totalSpent}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs">Last Fill</p>
                        <p className="text-sm text-slate-300">{formatDate(sortedEntries[0]?.date)}</p>
                    </div>
                </div>

                {/* Days Since Last Service */}
                <div className="col-span-2 bg-slate-700/30 p-3 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">Days Since Last Service</p>
                    {daysSinceService !== null ? (
                        <div className="flex items-baseline gap-2">
                            <p className={`text-2xl font-bold ${daysSinceService <= 90 ? 'text-emerald-400' :
                                daysSinceService <= 150 ? 'text-yellow-400' :
                                    'text-rose-400'
                                }`}>
                                {daysSinceService}
                            </p>
                            <span className="text-sm text-slate-500">days ago</span>
                            {daysSinceService > 150 && (
                                <span className="text-rose-400 text-lg animate-pulse" title="Service Overdue!">⚠️</span>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm italic">No service records</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
