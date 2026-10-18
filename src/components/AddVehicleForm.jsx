import React, { useState, useEffect } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Hash, Fuel, ShieldCheck, FileText, ChevronDown, ChevronUp, PlusCircle, Check } from 'lucide-react';
import DocumentUploadInput from './DocumentUploadInput';

const AddVehicleForm = ({ onClose }) => {
    const { addVehicle } = useFuel();
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
        name: '',
        vehicleNumber: '',
        type: 'Bike',
        fuelType: 'Petrol',
        pucNumber: '',
        pucIssueDate: '',
        pucExpiryDate: '',
        pucDocumentUrl: '',
        insuranceCompany: '',
        insurancePolicyNumber: '',
        insuranceIssueDate: '',
        insuranceExpiryDate: '',
        insuranceDocumentUrl: ''
    });

    const [showOptional, setShowOptional] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle(formData);
        showNotification('New vehicle added to your garage!');
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
                            New Vehicle
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-0.5">
                            ADD TO YOUR DIGITAL GARAGE
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
                    <form onSubmit={handleSubmit} className="space-y-6 pb-4">
                        {/* Section: Identity */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Car className="w-3.5 h-3.5 text-indigo-500" /> Vehicle Name / Model
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. Activa 5G, Dzire, Yamaha FZ"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Hash className="w-3.5 h-3.5 text-indigo-500" /> License Plate Number
                                </label>
                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    required
                                    placeholder="e.g. RJ 09 XX 0000"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all shadow-inner uppercase"
                                />
                            </div>
                        </div>

                        {/* Section: Type & Fuel */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    Vehicle Classification
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Bike', 'Car'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`p-3.5 rounded-2xl border-2 font-black uppercase tracking-wider text-xs transition-all active:scale-95 ${formData.type === type
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-500/30'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    <Fuel className="w-3.5 h-3.5 text-indigo-500" /> Fuel Type
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {['Petrol', 'Diesel', 'CNG'].map((fuel) => (
                                        <button
                                            key={fuel}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, fuelType: fuel })}
                                            className={`py-3 px-2 rounded-2xl border-2 font-black uppercase tracking-wider text-xs transition-all active:scale-95 text-center ${formData.fuelType === fuel
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-500/30'
                                                }`}
                                        >
                                            {fuel}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Optional PUC & Insurance Toggle */}
                        <div className="border-t border-slate-200/80 dark:border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowOptional(!showOptional)}
                                className="w-full flex justify-between items-center py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500/30 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    {showOptional ? 'Hide PUC & Insurance Details' : '+ Add PUC & Insurance Details (Optional)'}
                                </span>
                                {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <AnimatePresence>
                                {showOptional && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-5 pt-4"
                                    >
                                        {/* PUC Details */}
                                        <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <FileText className="w-4 h-4" /> Pollution Control (PUC)
                                            </h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="pucNumber"
                                                    placeholder="PUC Certificate Number"
                                                    value={formData.pucNumber}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                />
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</span>
                                                    <input
                                                        type="date"
                                                        name="pucExpiryDate"
                                                        value={formData.pucExpiryDate}
                                                        onChange={handleChange}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                                    />
                                                </div>
                                                <DocumentUploadInput
                                                    label="PUC Certificate Copy"
                                                    value={formData.pucDocumentUrl}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, pucDocumentUrl: url }))}
                                                    vehicleId="new_vehicle"
                                                    category="puc"
                                                    documentTitle="New Vehicle - PUC Certificate"
                                                />
                                            </div>
                                        </div>

                                        {/* Insurance Details */}
                                        <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <ShieldCheck className="w-4 h-4" /> Vehicle Insurance
                                            </h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="insuranceCompany"
                                                    placeholder="Insurance Company (e.g. LIC, United India)"
                                                    value={formData.insuranceCompany}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                                <input
                                                    type="text"
                                                    name="insurancePolicyNumber"
                                                    placeholder="Policy Number"
                                                    value={formData.insurancePolicyNumber}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                                />
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</span>
                                                    <input
                                                        type="date"
                                                        name="insuranceExpiryDate"
                                                        value={formData.insuranceExpiryDate}
                                                        onChange={handleChange}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                                    />
                                                </div>
                                                <DocumentUploadInput
                                                    label="Insurance Policy Copy"
                                                    value={formData.insuranceDocumentUrl}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, insuranceDocumentUrl: url }))}
                                                    vehicleId="new_vehicle"
                                                    category="insurance"
                                                    documentTitle="New Vehicle - Insurance Policy"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 pb-6">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black py-4 sm:py-4.5 rounded-2xl shadow-xl shadow-indigo-500/25 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                Add Vehicle To Garage
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddVehicleForm;
