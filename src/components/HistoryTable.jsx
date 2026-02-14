import { useFuel } from '../context/FuelContext';
import { formatDate } from '../utils/calculations';

const HistoryTable = ({ vehicleId, onEdit }) => {
    const { getVehicleEntries, deleteEntry } = useFuel();
    const entries = getVehicleEntries(vehicleId);

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-400">No fuel entries found. Add one to see history!</p>
            </div>
        );
    }

    // Prepare entries with calculated mileage
    const sortedChronological = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const entriesWithMileage = entries.map(entry => {
        const currentIdx = sortedChronological.findIndex(e => e.id === entry.id);
        const prevEntry = currentIdx > 0 ? sortedChronological[currentIdx - 1] : null;

        let efficiency = "--";
        let tripDistance = "--";
        if (prevEntry) {
            const distance = entry.odometer - prevEntry.odometer;
            tripDistance = distance + " km";
            if (entry.liters > 0) {
                efficiency = (distance / entry.liters).toFixed(2) + " km/L";
            }
        }
        return { ...entry, efficiency, tripDistance };
    });

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-700/50 text-xs uppercase font-medium text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Odometer</th>
                            <th className="px-6 py-4">Trip</th>
                            <th className="px-6 py-4">Fuel</th>
                            <th className="px-6 py-4">Efficiency</th>
                            <th className="px-6 py-4">Price/L</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {entriesWithMileage.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700 last:border-0">
                                <td className="px-6 py-4 font-medium text-white">
                                    {formatDate(entry.date)}
                                </td>
                                <td className="px-6 py-4">{entry.odometer} km</td>
                                <td className="px-6 py-4 text-indigo-400 font-medium">{entry.tripDistance}</td>
                                <td className="px-6 py-4 text-slate-300">{entry.liters} L</td>
                                <td className="px-6 py-4 font-bold text-cyan-400">{entry.efficiency}</td>
                                <td className="px-6 py-4">₹{entry.price}</td>
                                <td className="px-6 py-4 font-bold text-emerald-400">₹{entry.totalCost}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(entry)}
                                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 px-3 py-1 rounded transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 px-3 py-1 rounded transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile View</span>
                    <span className="text-[10px] text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">{entries.length} Entries</span>
                </div>
                {entriesWithMileage.map((entry) => (
                    <div key={entry.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg">{formatDate(entry.date)}</span>
                                <span className="text-slate-400 text-sm">{entry.odometer} km</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-xl">₹{entry.totalCost}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 border-t border-slate-700/50 pt-3">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Trip Distance</span>
                                <span className="text-white font-medium">{entry.tripDistance}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Fuel Filled</span>
                                <span className="text-white font-medium">{entry.liters} L</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Efficiency</span>
                                <span className="text-cyan-400 font-bold">{entry.efficiency}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Price / Total</span>
                                <span className="text-slate-200">₹{entry.price} / ₹{entry.totalCost}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => onEdit(entry)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteEntry(entry.id)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-rose-300 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTable;
