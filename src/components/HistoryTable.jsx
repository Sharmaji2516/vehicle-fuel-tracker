import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';
import { formatDate, getProcessedFuelEntries, getVehicleStackInfo } from '../utils/calculations';
import ConfirmDialog from './ConfirmDialog';
import { Download, Receipt, Trash2, Zap, Fuel, AlertCircle, Info } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

const HistoryTable = ({ vehicleId, onEdit }) => {
    const { getVehicleEntries, deleteEntry, editEntry, vehicles } = useFuel();
    const { showNotification } = useNotification();
    const entries = getVehicleEntries(vehicleId) || [];
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewingReceipt, setViewingReceipt] = useState(null);

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        const entryToDelete = deleteConfirm;
        setDeleteConfirm(null);
        try {
            await deleteEntry(entryToDelete.id);
            showNotification('Fuel entry deleted successfully!', 'success');
        } catch (error) {
            console.error('Delete failed:', error);
            showNotification('Failed to delete fuel entry', 'error');
        }
    };

    const stackInfo = getVehicleStackInfo(entries);
    const entriesWithMileage = getProcessedFuelEntries(entries);

    const handleExport = () => {
        try {
            const headers = [
                "Date",
                "Entry Type",
                "Odometer (km)",
                "Trip Distance",
                "Fuel Filled (L)",
                "Mileage / Efficiency",
                "Price per Liter (INR)",
                "Total Cost (INR)",
                "Payment Mode"
            ];
            
            const rows = entriesWithMileage.map(entry => [
                formatDate(entry.date),
                entry.entryType === 'partial' ? 'Partial Fill (Stacked)' : 'Full Tank',
                entry.odometer,
                entry.tripDistance,
                entry.liters,
                entry.status === 'partial_stacked'
                    ? 'Stacked (Pending Full Tank)'
                    : (entry.efficiency || '--'),
                entry.price,
                entry.totalCost,
                entry.paymentMode || 'Cash'
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            
            const vehicleName = vehicles?.find(v => v.id === vehicleId)?.name || 'vehicle';
            const fileName = `${vehicleName.toLowerCase().replace(/\s+/g, '_')}_fuel_logs.csv`;
            
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Logs exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('Failed to export logs', 'error');
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Active Stack Buffer Notice in Logs View */}
                {stackInfo.pendingCount > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <span>Active Stack Buffer: {stackInfo.pendingCount}x Partial Fill{stackInfo.pendingCount > 1 ? 's' : ''} Stacked ({stackInfo.stackedLiters} L)</span>
                                </h4>
                                <p className="text-[11px] text-amber-400/90 font-medium">
                                    {stackInfo.distanceSinceLastFull > 0 ? `${stackInfo.distanceSinceLastFull} km driven since last full tank. ` : ''}
                                    All stacked fuel will be combined to calculate certified mileage on your next Full Tank.
                                </p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                            Pending Full Tank
                        </span>
                    </div>
                )}

                {entries.length === 0 ? (
                    <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                        <p className="text-slate-400">No fuel entries found. Add one to see history!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-wider"
                            >
                                <Download className="w-4.5 h-4.5" />
                                Export to Excel
                            </button>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-700/50 text-xs uppercase font-medium text-slate-300">
                            <tr>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-4 py-4">Type</th>
                                <th className="px-5 py-4">Odometer</th>
                                <th className="px-4 py-4">Trip</th>
                                <th className="px-4 py-4">Fuel</th>
                                <th className="px-5 py-4">Efficiency</th>
                                <th className="px-4 py-4">Price/L</th>
                                <th className="px-5 py-4">Total</th>
                                <th className="px-4 py-4">Mode</th>
                                <th className="px-4 py-4 text-center">Receipt</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {entriesWithMileage.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700 last:border-0">
                                    <td className="px-5 py-4 font-medium text-white whitespace-nowrap">
                                        {formatDate(entry.date)}
                                    </td>

                                    {/* Entry Type Badge */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {entry.entryType === 'partial' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                <Zap className="w-3 h-3" /> Partial
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                <Fuel className="w-3 h-3" /> Full Tank
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-5 py-4 whitespace-nowrap">{entry.odometer} km</td>
                                    <td className="px-4 py-4 text-indigo-400 font-medium whitespace-nowrap">{entry.tripDistance}</td>
                                    <td className="px-4 py-4 text-slate-300 whitespace-nowrap">{entry.liters} L</td>

                                    {/* Efficiency / Mileage Column */}
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        {entry.status === 'partial_stacked' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Fuel and distance are stacked into buffer until next full tank">
                                                <Zap className="w-3 h-3" /> Stacked
                                            </span>
                                        ) : entry.status === 'confirmed_stacked' ? (
                                            <div className="flex flex-col">
                                                <span className="font-black text-cyan-400 tracking-tight">{entry.efficiency}</span>
                                                <span className="text-[9px] text-amber-400 font-bold">
                                                    +{entry.stackedLitersIncluded}L stacked
                                                </span>
                                            </div>
                                        ) : entry.status === 'confirmed' ? (
                                            <span className="font-black text-cyan-400 tracking-tight">{entry.efficiency}</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-semibold">Baseline Ref.</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">₹{entry.price}</td>
                                    <td className="px-5 py-4 font-bold text-emerald-400 whitespace-nowrap">₹{entry.totalCost}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${entry.paymentMode === 'Online'
                                            ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
                                            : 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                                            }`}>
                                            {entry.paymentMode || 'Cash'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                        {entry.receiptUrl ? (
                                            <button
                                                type="button"
                                                onClick={() => setViewingReceipt(entry)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                                                title="View Fuel Receipt"
                                            >
                                                <Receipt className="w-3.5 h-3.5" />
                                                <span>Bill</span>
                                            </button>
                                        ) : (
                                            <span className="text-slate-600 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right flex justify-end gap-2 whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(entry)}
                                            className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 px-3 py-1 rounded transition-colors text-xs font-bold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(entry)}
                                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 px-3 py-1 rounded transition-colors text-xs font-bold"
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
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-lg">{formatDate(entry.date)}</span>
                                        {entry.entryType === 'partial' ? (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                                <Zap className="w-2.5 h-2.5" /> Partial
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                                <Fuel className="w-2.5 h-2.5" /> Full
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-slate-400 text-sm">{entry.odometer} km</span>
                                </div>
                                <span className="text-emerald-400 font-bold text-xl">₹{entry.totalCost}</span>
                            </div>

                            <div className="flex justify-between items-center bg-slate-700/30 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Payment Mode</span>
                                <span className={`text-[10px] font-bold uppercase ${entry.paymentMode === 'Online' ? 'text-blue-400' : 'text-amber-400'
                                    }`}>
                                    {entry.paymentMode === 'Online' ? '💳 Online' : '💵 Cash'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-base text-slate-400 border-t border-slate-700/50 pt-3">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-0.5">Trip Distance</span>
                                    <span className="text-white font-medium">{entry.tripDistance}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-0.5">Fuel Filled</span>
                                    <span className="text-white font-medium">{entry.liters} L</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-0.5">Efficiency</span>
                                    {entry.status === 'partial_stacked' ? (
                                        <span className="text-amber-400 font-black text-sm flex items-center gap-1">
                                            <Zap className="w-3.5 h-3.5" /> Stacked
                                        </span>
                                    ) : entry.status === 'confirmed_stacked' ? (
                                        <div className="flex flex-col">
                                            <span className="text-cyan-400 font-black text-sm">{entry.efficiency}</span>
                                            <span className="text-[10px] text-amber-400 font-bold">+{entry.stackedLitersIncluded}L stacked</span>
                                        </div>
                                    ) : entry.status === 'confirmed' ? (
                                        <span className="text-cyan-400 font-black text-sm">{entry.efficiency}</span>
                                    ) : (
                                        <span className="text-slate-500 font-bold text-xs">Baseline Ref.</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-0.5">Price / Total</span>
                                    <span className="text-slate-200 font-medium">₹{entry.price} / ₹{entry.totalCost}</span>
                                </div>
                            </div>

                            {entry.receiptUrl && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewingReceipt(entry)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-colors"
                                    >
                                        <Receipt className="w-4 h-4" />
                                        View Fuel Bill / Receipt
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (window.confirm('Delete this attached fuel receipt?')) {
                                                await editEntry({ ...entry, receiptUrl: null });
                                                showNotification('Fuel receipt deleted', 'success');
                                            }
                                        }}
                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all shrink-0"
                                        title="Delete Fuel Receipt"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    onClick={() => onEdit(entry)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(entry)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-rose-300 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title="Delete Fuel Entry?"
                message={`Are you sure you want to delete the fuel entry from ${deleteConfirm ? formatDate(deleteConfirm.date) : ''}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Receipt Document Viewer Modal */}
            <DocumentViewerModal
                isOpen={!!viewingReceipt}
                onClose={() => setViewingReceipt(null)}
                documentUrl={viewingReceipt?.receiptUrl}
                title={`Fuel Receipt • ${viewingReceipt ? formatDate(viewingReceipt.date) : ''}`}
                subtitle={viewingReceipt ? `₹${viewingReceipt.totalCost} • ${viewingReceipt.liters} Liters @ ₹${viewingReceipt.price}/L` : ''}
                onDelete={async () => {
                    if (viewingReceipt) {
                        await editEntry({ ...viewingReceipt, receiptUrl: null });
                        showNotification('Fuel receipt deleted successfully', 'success');
                        setViewingReceipt(null);
                    }
                }}
            />
        </>
    );
};

export default HistoryTable;
