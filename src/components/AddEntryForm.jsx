import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Droplet, IndianRupee, CreditCard, Banknote, Save } from 'lucide-react';

const AddEntryForm = ({ vehicleId, onClose, initialData }) => {
    const { addEntry, editEntry, vehicles } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [formData, setFormData] = useState(initialData || {
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        price: '', // Price per liter
        totalCost: '',
        paymentMode: 'Cash'
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                
                <div className="relative p-8 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {initialData ? 'Edit Log' : 'Fuel Entry'}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1">
                                FOR {vehicle?.name}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Gauge className="w-3.5 h-3.5" /> Odometer (km)
                                </label>
                                <input
                                    type="number"
                                    name="odometer"
                                    value={formData.odometer}
                                    onChange={handleChange}
                                    required
                                    placeholder="000000"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Droplet className="w-3.5 h-3.5" /> Liters
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
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 pl-10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">L</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <IndianRupee className="w-3.5 h-3.5" /> Price / L
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
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 pl-10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Save className="w-3.5 h-3.5" /> Total Investment
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
                                    className="w-full bg-indigo-500/5 dark:bg-indigo-500/10 border-2 border-indigo-500/20 rounded-2xl p-6 pl-12 text-2xl font-black text-indigo-600 dark:text-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                />
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500/50 font-black text-xl">₹</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'Cash', icon: Banknote, label: 'Cash' },
                                    { id: 'Online', icon: CreditCard, label: 'Digital' }
                                ].map(mode => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode.id }))}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all ${formData.paymentMode === mode.id
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                                            : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-white/5 text-slate-400 hover:border-indigo-500/20'
                                            }`}
                                    >
                                        <mode.icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-500/30 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] mt-4"
                        >
                            Save Entry Record
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};


export default AddEntryForm;
