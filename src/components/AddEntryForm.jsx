import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Gauge, Droplet, IndianRupee, CreditCard, Banknote, Check, Zap, Fuel, AlertCircle, Info } from 'lucide-react';
import { getVehicleStackInfo } from '../utils/calculations';
import DocumentUploadInput from './DocumentUploadInput';

const AddEntryForm = ({ vehicleId, onClose, initialData }) => {
    const { addEntry, editEntry, vehicles, getVehicleEntries } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const existingEntries = getVehicleEntries ? getVehicleEntries(vehicleId) : [];
    const stackInfo = getVehicleStackInfo(existingEntries);
    // Get the most recent odometer for reference
    const latestOdometer = existingEntries.length > 0 ? Math.max(...existingEntries.map(e => Number(e.odometer) || 0)) : null;

    // Keyboard shortcut: Press Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const [formData, setFormData] = useState(initialData ? {
        ...initialData,
        entryType: initialData.entryType || (initialData.isPartial ? 'partial' : 'full') || 'full',
        receiptUrl: initialData.receiptUrl || ''
    } : {
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        price: '', // Price per liter
        totalCost: '',
        paymentMode: 'Cash',
        receiptUrl: '',
        entryType: 'full' // 'full' | 'partial'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };
        setValidationError('');

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
            if (parseFloat(liters) > 0) {
                updatedData.price = (parseFloat(value) / parseFloat(liters)).toFixed(2);
            }
        }

        setFormData(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        const odoNum = parseFloat(formData.odometer);
        const litersNum = parseFloat(formData.liters);
        const costNum = parseFloat(formData.totalCost);
        const priceNum = parseFloat(formData.price || 0);

        // Validation checks
        if (isNaN(odoNum) || odoNum <= 0) {
            setValidationError('Please enter a valid positive odometer reading.');
            return;
        }
        if (isNaN(litersNum) || litersNum <= 0) {
            setValidationError('Please enter a valid fuel quantity in liters (greater than 0).');
            return;
        }
        if (isNaN(costNum) || costNum <= 0) {
            setValidationError('Please enter a valid total amount in ₹ (greater than 0).');
            return;
        }

        setIsSubmitting(true);
        const now = new Date().toISOString();

        try {
            const entryData = {
                ...formData,
                vehicleId,
                entryType: formData.entryType,
                isPartial: formData.entryType === 'partial',
                odometer: odoNum,
                liters: litersNum,
                price: priceNum,
                totalCost: costNum,
                updatedAt: now,
                createdAt: initialData?.createdAt || now
            };

            if (initialData) {
                await editEntry({ ...entryData, id: initialData.id });
            } else {
                await addEntry(entryData);
            }
            onClose();
        } catch (err) {
            console.error('Failed to save fuel entry:', err);
            setValidationError('Failed to save entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
                        
                        {/* Refill Type Selector (Full Tank vs Partial Fill) */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                Refill Type (टंकी स्थिति)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, entryType: 'full' }))}
                                    className={`relative p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col gap-1 ${
                                        formData.entryType === 'full'
                                            ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                                            <Fuel className="w-4 h-4 text-emerald-500" />
                                            Full Tank
                                        </div>
                                        {formData.entryType === 'full' && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                        Auto-cut • Confirms mileage
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, entryType: 'partial' }))}
                                    className={`relative p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col gap-1 ${
                                        formData.entryType === 'partial'
                                            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-amber-500/40'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            Partial Fill
                                        </div>
                                        {formData.entryType === 'partial' && (
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                        Top-up • Stacks until full
                                    </p>
                                </button>
                            </div>

                            {/* Informational Hint & Active Stack Notice */}
                            {stackInfo.pendingCount > 0 && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-400 text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px]">
                                        <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                        <span>Current Buffer: {stackInfo.pendingCount}x Partial Fill{stackInfo.pendingCount > 1 ? 's' : ''} Stacked ({stackInfo.stackedLiters} L)</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                        {formData.entryType === 'full'
                                            ? `✅ Selecting 'Full Tank': Previous ${stackInfo.stackedLiters} L + this refill will be combined to calculate your exact mileage.`
                                            : `⚡ Selecting 'Partial': This fuel will be stacked into the buffer alongside the previous ${stackInfo.stackedLiters} L.`}
                                    </p>
                                </div>
                            )}

                            {stackInfo.pendingCount === 0 && (
                                <>
                                    {formData.entryType === 'partial' ? (
                                        <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 shrink-0" />
                                            <span>Liters & km will be stacked. Certified mileage will calculate on your next Full Tank.</span>
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                                            <Check className="w-3.5 h-3.5 shrink-0" />
                                            <span>Calculates true mileage across all distance and fuel since the previous Full Tank.</span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Validation Error Alert */}
                        {validationError && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}

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
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        <Gauge className="w-3.5 h-3.5 text-indigo-500" /> Odometer (km)
                                    </label>
                                    {latestOdometer && !initialData && (
                                        <span className="text-[9px] text-slate-400 font-mono">
                                            Last: {latestOdometer} km
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="number"
                                    name="odometer"
                                    value={formData.odometer}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder={latestOdometer ? `e.g. ${latestOdometer + 150}` : "e.g. 24500"}
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
                                        min="0.01"
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
                                        min="0.01"
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
                                    min="0.01"
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
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black py-4 sm:py-4.5 rounded-2xl shadow-xl shadow-indigo-500/25 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer ${
                                    isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                            >
                                <Check className="w-4 h-4" />
                                {isSubmitting ? 'Saving Entry...' : (initialData ? 'Update Fuel Log' : 'Save Entry Record')}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddEntryForm;
