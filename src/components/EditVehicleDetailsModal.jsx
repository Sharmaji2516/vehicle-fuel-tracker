import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';
import { FileText, Shield, Calendar, Hash, Building2, X, Check } from 'lucide-react';
import DocumentUploadInput from './DocumentUploadInput';

const EditVehicleDetailsModal = ({ vehicle, onClose }) => {
    const { updateVehicle } = useFuel();
    const { showNotification } = useNotification();

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const [formData, setFormData] = useState({
        pucNumber: vehicle.pucNumber || '',
        pucIssueDate: vehicle.pucIssueDate || '',
        pucExpiryDate: vehicle.pucExpiryDate || '',
        pucDocumentUrl: vehicle.pucDocumentUrl || '',
        insuranceCompany: vehicle.insuranceCompany || '',
        insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
        insuranceIssueDate: vehicle.insuranceIssueDate || '',
        insuranceExpiryDate: vehicle.insuranceExpiryDate || '',
        insuranceDocumentUrl: vehicle.insuranceDocumentUrl || ''
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
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <div className="relative z-10 bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto">
                {/* Fixed Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            PUC & Insurance
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase mt-0.5">
                            {vehicle.name} • {vehicle.vehicleNumber || 'No Number'}
                        </p>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        title="Close (Esc)"
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-rose-500 transition-colors shadow-sm active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-8 custom-scrollbar">
                    <form id="edit-vehicle-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
                        {/* PUC Section */}
                        <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <FileText className="w-4 h-4" />
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Pollution Control (PUC)</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, pucNumber: '', pucIssueDate: '', pucExpiryDate: '', pucDocumentUrl: '' })}
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
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Issue Date</label>
                                        <input
                                            type="date"
                                            name="pucIssueDate"
                                            value={formData.pucIssueDate}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Expiry Date</label>
                                        <input
                                            type="date"
                                            name="pucExpiryDate"
                                            value={formData.pucExpiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>
                                <DocumentUploadInput
                                    label="PUC Certificate Copy (Photo / PDF)"
                                    description="Auto-compressed to ~100KB"
                                    value={formData.pucDocumentUrl}
                                    onChange={(url) => setFormData(prev => ({ ...prev, pucDocumentUrl: url }))}
                                    vehicleId={vehicle.id}
                                    category="puc"
                                    documentTitle={`${vehicle.name} - PUC Certificate`}
                                />
                            </div>
                        </div>

                        {/* Insurance Section */}
                        <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <Shield className="w-4 h-4" />
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Vehicle Insurance</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, insuranceCompany: '', insurancePolicyNumber: '', insuranceIssueDate: '', insuranceExpiryDate: '', insuranceDocumentUrl: '' })}
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
                                            placeholder="e.g. United India, LIC, HDFC Ergo"
                                            value={formData.insuranceCompany}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
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
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Issue Date</label>
                                        <input
                                            type="date"
                                            name="insuranceIssueDate"
                                            value={formData.insuranceIssueDate}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5">Expiry Date</label>
                                        <input
                                            type="date"
                                            name="insuranceExpiryDate"
                                            value={formData.insuranceExpiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>
                                <DocumentUploadInput
                                    label="Insurance Policy Copy (Photo / PDF)"
                                    description="Auto-compressed to ~100KB"
                                    value={formData.insuranceDocumentUrl}
                                    onChange={(url) => setFormData(prev => ({ ...prev, insuranceDocumentUrl: url }))}
                                    vehicleId={vehicle.id}
                                    category="insurance"
                                    documentTitle={`${vehicle.name} - Insurance Policy`}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 pb-6 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/25 text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVehicleDetailsModal;
