import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Wrench, IndianRupee, CreditCard, Banknote, Save } from 'lucide-react';

const AddServiceForm = ({ vehicleId, onClose, initialData }) => {
    const { addServiceEntry, editServiceEntry, vehicles, getVehicleEntries, getVehicleServiceEntries } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    // Get latest odometer reading for auto-fill
    const latestOdometer = () => {
        const fuelEntries = getVehicleEntries(vehicleId);
        const serviceEntries = getVehicleServiceEntries(vehicleId);
        const all = [...fuelEntries, ...serviceEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
        return all[0]?.odometer || '';
    };

    const [formData, setFormData] = useState(() => {
        if (initialData) {
            // Normalize payment mode for existing data (Title Case)
            const normalizedPayment = initialData.paymentMode?.charAt(0).toUpperCase() + initialData.paymentMode?.slice(1).toLowerCase();
            return { ...initialData, paymentMode: normalizedPayment || 'Cash' };
        }
        return {
            date: new Date().toISOString().split('T')[0],
            odometer: latestOdometer(),
            serviceType: '',
            cost: '',
            paymentMode: 'Cash'
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
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                
                <div className="relative p-8 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {initialData ? 'Edit Service' : 'Service Entry'}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-1">
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
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
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
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Wrench className="w-3.5 h-3.5" /> Service Type
                            </label>
                            <input
                                type="text"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Engine Oil, Brake Pads"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <IndianRupee className="w-3.5 h-3.5" /> Service Cost
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
                                    className="w-full bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-6 pl-12 text-2xl font-black text-emerald-600 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                />
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/50 font-black text-xl">₹</div>
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
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                                            : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-white/5 text-slate-400 hover:border-emerald-500/20'
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
                            disabled={isSaving}
                            className="w-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-emerald-500/30 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
                        >
                            {isSaving ? 'Processing...' : (initialData ? 'Update Service Record' : 'Save Service Record')}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddServiceForm;
