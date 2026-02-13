import React from 'react';
import { calculateMileage, calculateAverageMileage, calculateTotalSpent } from '../utils/calculations';

const VehicleCard = ({ vehicle, entries, onAddEntry, onViewHistory }) => {
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastMileage = calculateMileage(sortedEntries);
    const avgMileage = calculateAverageMileage(sortedEntries);
    const totalSpent = calculateTotalSpent(entries);

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-700/50 px-2 py-1 rounded mt-1 inline-block">
                        {vehicle.type} • {vehicle.fuelType}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onViewHistory}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-full transition-colors text-sm font-medium"
                    >
                        History
                    </button>
                    <button
                        onClick={(e) => onAddEntry(e, vehicle.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors shadow-lg shadow-indigo-500/30"
                        title="Add Fuel Entry"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
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
                <div className="col-span-2 bg-slate-700/30 p-3 rounded-xl flex justify-between items-center">
                    <div>
                        <p className="text-slate-400 text-xs">Total Spent</p>
                        <p className="text-lg font-bold text-rose-400">₹{totalSpent}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs">Last Fill</p>
                        <p className="text-sm text-slate-300">{sortedEntries[0] ? new Date(sortedEntries[0].date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
