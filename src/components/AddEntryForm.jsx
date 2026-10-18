import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Droplet, IndianRupee, CreditCard, Banknote, Check } from 'lucide-react';
import DocumentUploadInput from './DocumentUploadInput';

const AddEntryForm = ({ vehicleId, onClose, initialData }) => {
    const { addEntry, editEntry, vehicles } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const [formData, setFormData] = useState(initialData ? {
        ...initialData,
        receiptUrl: initialData.receiptUrl || ''
    } : {
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        price: '', // Price per liter
        totalCost: '',
        paymentMode: 'Cash',
        receiptUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };

        // Auto-calculate total cost if price and liters are present
        if (name === 'price' || name === 'liters') {
            const liters = name === 'liters' ? value : formData.liters;
            const price = name === 'price' ? value : formData.price;
            if (liters && price) {
                updatedData.totalCost = (parseFloat(liters) * parseFloat(price)).toFixed(2);
            }
        }

        // Auto-calculate price if total cost and liters are present
        if (name === 'totalCost' && formData.liters) {
            const liters = formData.liters;
            updatedData.price = (parseFloat(value) / parseFloat(liters)).toFixed(2);
        }

        setFormData(updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const entryData = {
            ...formData,
            vehicleId,
            odometer: parseFloat(formData.odometer),
            liters: parseFloat(formData.liters),
            price: parseFloat(formData.price),
            totalCost: parseFloat(formData.totalCost)
        };

        if (initialData) {
            editEntry({ ...entryData, id: initialData.id });
        } else {
            addEntry(entryData);
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
                            {initialData ? 'Edit Fuel Log' : 'Add Fuel Entry'}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-0.5">
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
                    <form id="add-fuel-form" onSubmit={handleSubmit} className="space-y-6 pb-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Gauge className="w-3.5 h-3.5 text-indigo-500" /> Odometer (km)
                                </label>
                                <input
                                    type="number"
                                    name="odometer"
                                    value={formData.odometer}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 24500"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Droplet className="w-3.5 h-3.5 text-cyan-500" /> Fuel Quantity (Liters)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="liters"
                                        value={formData.liters}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 pl-10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 outline-none transition-all shadow-inner"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">L</div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Price per Liter
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 pl-10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all shadow-inner"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</div>
                                </div>
                            </div>
                        </div>

                        {/* Total Investment Card */}
                        <div className="space-y-1.5">
                            <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-indigo-500" /> Total Investment
                                </span>
                                <span className="text-[9px] text-indigo-500 lowercase font-medium">Auto-calculated</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="totalCost"
                                    value={formData.totalCost}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-indigo-50/50 dark:bg-indigo-500/10 border-2 border-indigo-500/30 rounded-2xl p-4 pl-12 text-2xl font-black text-indigo-600 dark:text-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-xl">₹</div>
                            </div>
                        </div>

                        {/* Payment Method */}
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
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-500/30'
                                            }`}
                                    >
                                        <mode.icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bill / Receipt Attachment */}
                        <div className="pt-1">
                            <DocumentUploadInput
                                label="Fuel Bill / Pump Receipt (Optional)"
                                description="Auto-compressed to ~100KB"
                                value={formData.receiptUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, receiptUrl: url }))}
                                vehicleId={vehicleId}
                                category="fuel_bills"
                                documentTitle={`Fuel Receipt - ${formData.date} (₹${formData.totalCost || '0'})`}
                            />
                        </div>

                        {/* Big Prominent Save Button */}
                        <div className="pt-2 pb-6">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black py-4 sm:py-4.5 rounded-2xl shadow-xl shadow-indigo-500/25 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                {initialData ? 'Update Fuel Log' : 'Save Entry Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddEntryForm;
