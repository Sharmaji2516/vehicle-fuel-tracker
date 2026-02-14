import React from 'react';
import { useFuel } from '../context/FuelContext';
import { formatDate } from '../utils/calculations';

const ServiceHistoryTable = ({ vehicleId, onEdit }) => {
    const { getVehicleServiceEntries, deleteServiceEntry } = useFuel();
    const entries = getVehicleServiceEntries(vehicleId);

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-400">No service entries found. Click "Add Service" to record maintenance!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-700/50 text-xs uppercase font-medium text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Odometer</th>
                            <th className="px-6 py-4">Service Type</th>
                            <th className="px-6 py-4">Cost</th>
                            <th className="px-6 py-4">Notes</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700 last:border-0">
                                <td className="px-6 py-4 font-medium text-white">{formatDate(entry.date)}</td>
                                <td className="px-6 py-4">{entry.odometer} km</td>
                                <td className="px-6 py-4 text-emerald-400 font-medium">{entry.serviceType}</td>
                                <td className="px-6 py-4 font-bold text-slate-200">₹{entry.cost}</td>
                                <td className="px-6 py-4 text-slate-400 italic">
                                    <div className="max-w-xs truncate" title={entry.notes}>{entry.notes || '--'}</div>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => onEdit(entry)} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 px-3 py-1 rounded transition-colors">Edit</button>
                                    <button onClick={() => deleteServiceEntry(entry.id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 px-3 py-1 rounded transition-colors">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {entries.map((entry) => (
                    <div key={entry.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg">{formatDate(entry.date)}</span>
                                <span className="text-slate-400 text-sm">{entry.odometer} km</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-xl">₹{entry.cost}</span>
                        </div>
                        <div className="bg-slate-700/30 p-2 rounded-lg border border-slate-700/50">
                            <p className="text-indigo-300 font-bold text-sm mb-1">{entry.serviceType}</p>
                            <p className="text-slate-400 text-xs italic">{entry.notes || 'No notes'}</p>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => onEdit(entry)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
                            <button onClick={() => deleteServiceEntry(entry.id)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-rose-300 py-2 rounded-lg text-sm font-medium transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceHistoryTable;
