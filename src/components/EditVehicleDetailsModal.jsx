import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';
import { FileText, Shield, Calendar, Hash, Building2 } from 'lucide-react';

const EditVehicleDetailsModal = ({ vehicle, onClose }) => {
    const { updateVehicle } = useFuel();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        pucNumber: vehicle.pucNumber || '',
        pucIssueDate: vehicle.pucIssueDate || '',
        pucExpiryDate: vehicle.pucExpiryDate || '',
        insuranceCompany: vehicle.insuranceCompany || '',
        insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
        insuranceIssueDate: vehicle.insuranceIssueDate || '',
        insuranceExpiryDate: vehicle.insuranceExpiryDate || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateVehicle(vehicle.id, formData);
        showNotification('Vehicle details updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[9999] animate-fade-in overflow-hidden touch-none">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-800 w-full sm:max-w-lg sm:rounded-3xl shadow-2xl border-x sm:border border-slate-200 dark:border-slate-700 flex flex-col h-[92vh] h-[92dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden"
            >
                {/* Fixed Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            PUC & Insurance
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase mt-0.5">{vehicle.name} • {vehicle.vehicleNumber || 'No Number'}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                    {/* PUC Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <FileText className="w-4 h-4" />
                                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Pollution Control (PUC)</h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, pucNumber: '', pucIssueDate: '', pucExpiryDate: '' })}
                                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Certificate Number</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="pucNumber"
                                        placeholder="Enter PUC Certificate #"
                                        value={formData.pucNumber}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Issue Date</label>
                                    <input
                                        type="date"
                                        name="pucIssueDate"
                                        value={formData.pucIssueDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Expiry Date</label>
                                    <input
                                        type="date"
                                        name="pucExpiryDate"
                                        value={formData.pucExpiryDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Section */}
                    <div className="space-y-4 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <Shield className="w-4 h-4" />
                                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Vehicle Insurance</h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, insuranceCompany: '', insurancePolicyNumber: '', insuranceIssueDate: '', insuranceExpiryDate: '' })}
                                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Insurance Company</label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="insuranceCompany"
                                        placeholder="e.g. LIC, HDFC Ergo"
                                        value={formData.insuranceCompany}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Policy Number</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="insurancePolicyNumber"
                                        placeholder="Enter Policy #"
                                        value={formData.insurancePolicyNumber}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Issue Date</label>
                                    <input
                                        type="date"
                                        name="insuranceIssueDate"
                                        value={formData.insuranceIssueDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Expiry Date</label>
                                    <input
                                        type="date"
                                        name="insuranceExpiryDate"
                                        value={formData.insuranceExpiryDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Save Button for convenience */}
                    <div className="pt-4 pb-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/30 text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Save All Details
                        </button>
                        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-3 font-bold uppercase tracking-widest opacity-60">Saves both PUC & Insurance</p>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex gap-3 shrink-0 pb-[max(2rem,env(safe-area-inset-bottom))] mb-[env(safe-area-inset-bottom)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] bg-indigo-600 text-white py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVehicleDetailsModal;
