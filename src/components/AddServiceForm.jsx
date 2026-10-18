import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Wrench, IndianRupee, CreditCard, Banknote, Check } from 'lucide-react';
import DocumentUploadInput from './DocumentUploadInput';

const AddServiceForm = ({ vehicleId, onClose, initialData }) => {
    const { addServiceEntry, editServiceEntry, vehicles, getVehicleEntries, getVehicleServiceEntries } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Get latest odometer reading for auto-fill
    const latestOdometer = () => {
        const fuelEntries = getVehicleEntries(vehicleId);
        const serviceEntries = getVehicleServiceEntries(vehicleId);
        const all = [...fuelEntries, ...serviceEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
        return all[0]?.odometer || '';
    };

    const [formData, setFormData] = useState(() => {
        if (initialData) {
            const normalizedPayment = initialData.paymentMode?.charAt(0).toUpperCase() + initialData.paymentMode?.slice(1).toLowerCase();
            return {
                ...initialData,
                paymentMode: normalizedPayment || 'Cash',
                invoiceUrl: initialData.invoiceUrl || ''
            };
        }
        return {
            date: new Date().toISOString().split('T')[0],
            odometer: latestOdometer(),
            serviceType: '',
            cost: '',
            paymentMode: 'Cash',
            invoiceUrl: ''
        };
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        const entryData = {
            ...formData,
            vehicleId,
            odometer: parseFloat(formData.odometer),
            cost: parseFloat(formData.cost) || 0
        };

        if (initialData) {
            editServiceEntry({ ...entryData, id: initialData.id });
        } else {
            addServiceEntry(entryData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto"
            >
                {/* Fixed Sticky Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {initialData ? 'Edit Service Log' : 'Add Service Record'}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-0.5">
                            FOR {vehicle?.name || 'VEHICLE'}
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

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6 pb-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Service Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Gauge className="w-3.5 h-3.5 text-emerald-500" /> Odometer (km)
                                </label>
                                <input
                                    type="number"
                                    name="odometer"
                                    value={formData.odometer}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 25000"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                <Wrench className="w-3.5 h-3.5 text-emerald-500" /> Service Type / Description
                            </label>
                            <input
                                type="text"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Engine Oil, Brake Pads, General Service"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all shadow-inner"
                            />
                        </div>

                        {/* Service Cost */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Service Amount (Cost)
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-emerald-50/50 dark:bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-4 pl-12 text-2xl font-black text-emerald-600 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xl">₹</div>
                            </div>
                        </div>

                        {/* Payment Mode */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'Cash', icon: Banknote, label: 'Cash' },
                                    { id: 'Online', icon: CreditCard, label: 'Digital / UPI' }
                                ].map(mode => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode.id }))}
                                        className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl border-2 font-black uppercase tracking-wider text-xs transition-all active:scale-95 ${formData.paymentMode === mode.id
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-emerald-500/30'
                                            }`}
                                    >
                                        <mode.icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Invoice Attachment */}
                        <div className="pt-1">
                            <DocumentUploadInput
                                label="Service Invoice / Mechanic Bill (Optional)"
                                description="Auto-compressed to ~100KB"
                                value={formData.invoiceUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, invoiceUrl: url }))}
                                vehicleId={vehicleId}
                                category="service_bills"
                                documentTitle={`Service Bill - ${formData.serviceType || 'Maintenance'} (₹${formData.cost || '0'})`}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 pb-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black py-4 sm:py-4.5 rounded-2xl shadow-xl shadow-emerald-500/25 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" />
                                {isSaving ? 'Saving...' : (initialData ? 'Update Service Record' : 'Save Service Record')}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddServiceForm;
