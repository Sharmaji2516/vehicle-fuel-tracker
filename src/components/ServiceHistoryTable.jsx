import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/calculations';
import ConfirmDialog from './ConfirmDialog';
import { Download, Receipt, Trash2 } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

const ServiceHistoryTable = ({ vehicleId, onEdit }) => {
    const { getVehicleServiceEntries, deleteServiceEntry, editServiceEntry, vehicles } = useFuel();
    const { showNotification } = useNotification();
    const entries = getVehicleServiceEntries(vehicleId);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewingInvoice, setViewingInvoice] = useState(null);

    const handleDelete = async () => {
        if (deleteConfirm) {
            await deleteServiceEntry(deleteConfirm.id);
            showNotification('Service entry deleted successfully!', 'success');
            setDeleteConfirm(null);
        }
    };

    const handleExport = () => {
        try {
            const headers = [
                "Date",
                "Odometer (km)",
                "Service Type",
                "Cost (INR)",
                "Payment Mode"
            ];
            
            const rows = entries.map(entry => [
                formatDate(entry.date),
                entry.odometer,
                entry.serviceType,
                entry.cost,
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
            const fileName = `${vehicleName.toLowerCase().replace(/\s+/g, '_')}_service_logs.csv`;
            
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Services exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('Failed to export services', 'error');
        }
    };

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-400">No service entries found. Click "Add Service" to record maintenance!</p>
            </div>
        );
    }

    return (
        <>
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
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Odometer</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4 text-center">Invoice</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700 last:border-0">
                                    <td className="px-6 py-4 font-medium text-white">{formatDate(entry.date)}</td>
                                    <td className="px-6 py-4">{entry.odometer} km</td>
                                    <td className="px-6 py-4 text-emerald-400 font-bold text-base">{entry.serviceType}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-200 text-base">₹{entry.cost}</span>
                                            <span className={`text-[10px] font-bold uppercase mt-1 ${entry.paymentMode === 'Online' ? 'text-blue-400' : 'text-amber-400'}`}>
                                                {entry.paymentMode || 'Cash'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {entry.invoiceUrl ? (
                                            <button
                                                type="button"
                                                onClick={() => setViewingInvoice(entry)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                                                title="View Service Invoice"
                                            >
                                                <Receipt className="w-3.5 h-3.5" />
                                                <span>Bill</span>
                                            </button>
                                        ) : (
                                            <span className="text-slate-600 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => onEdit(entry)} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 px-3 py-1 rounded transition-colors">Edit</button>
                                        <button onClick={() => setDeleteConfirm(entry)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 px-3 py-1 rounded transition-colors">Delete</button>
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
                            <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                                <div>
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Service Type</span>
                                    <p className="text-emerald-400 font-bold text-xl">{entry.serviceType}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider block mb-1">Mode</span>
                                    <span className={`text-sm font-bold uppercase ${entry.paymentMode === 'Online' ? 'text-blue-400' : 'text-amber-400'}`}>
                                        {entry.paymentMode === 'Online' ? '💳 Online' : '💵 Cash'}
                                    </span>
                                </div>
                            </div>
                            {entry.invoiceUrl && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewingInvoice(entry)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-colors"
                                    >
                                        <Receipt className="w-4 h-4" />
                                        View Service Invoice / Bill
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (window.confirm('Delete this attached service bill / invoice?')) {
                                                await editServiceEntry({ ...entry, invoiceUrl: null });
                                                showNotification('Service invoice deleted', 'success');
                                            }
                                        }}
                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all shrink-0"
                                        title="Delete Service Invoice"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-2">
                                <button onClick={() => onEdit(entry)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
                                <button onClick={() => setDeleteConfirm(entry)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-rose-300 py-2 rounded-lg text-sm font-medium transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title="Delete Service Entry?"
                message={`Are you sure you want to delete the service entry from ${deleteConfirm ? formatDate(deleteConfirm.date) : ''}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Service Invoice Document Viewer */}
            <DocumentViewerModal
                isOpen={!!viewingInvoice}
                onClose={() => setViewingInvoice(null)}
                documentUrl={viewingInvoice?.invoiceUrl}
                title={`Service Invoice • ${viewingInvoice?.serviceType || 'Maintenance'}`}
                subtitle={viewingInvoice ? `${formatDate(viewingInvoice.date)} • ₹${viewingInvoice.cost} • ${viewingInvoice.odometer} km` : ''}
                onDelete={async () => {
                    if (viewingInvoice) {
                        await editServiceEntry({ ...viewingInvoice, invoiceUrl: null });
                        showNotification('Service invoice deleted successfully', 'success');
                        setViewingInvoice(null);
                    }
                }}
            />
        </>
    );
};

export default ServiceHistoryTable;
