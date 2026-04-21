import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useNotification } from '../context/NotificationContext';

const AddVehicleForm = ({ onClose }) => {
    const { addVehicle } = useFuel();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        vehicleNumber: '',
        type: 'Bike',
        fuelType: 'Petrol',
        pucNumber: '',
        pucIssueDate: '',
        pucExpiryDate: '',
        insuranceCompany: '',
        insurancePolicyNumber: '',
        insuranceIssueDate: '',
        insuranceExpiryDate: ''
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[9999] animate-fade-in overflow-hidden touch-none">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 w-full sm:max-w-md sm:rounded-2xl shadow-2xl border-x sm:border border-slate-700 flex flex-col h-[92vh] h-[92dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden"
            >
                {/* Fixed Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-lg font-bold text-white">Add New Vehicle</h3>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g. Honda City"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Number</label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                required
                                placeholder="e.g. RJ09CC7411"
                                value={formData.vehicleNumber}
                                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white uppercase focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Bike">Bike 🏍️</option>
                                    <option value="Car">Car 🚗</option>
                                    <option value="Scooty">Scooty 🛵</option>
                                    <option value="Auto">Auto 🛺</option>
                                    <option value="Bus">Bus 🚌</option>
                                    <option value="Truck">Truck 🚚</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fuel</label>
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Petrol">Petrol ⛽</option>
                                    <option value="Diesel">Diesel 🚛</option>
                                    <option value="CNG">CNG 💨</option>
                                    <option value="Electric">Electric ⚡</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Optional Details Toggle */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setShowOptional(!showOptional)}
                            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-indigo-500 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {showOptional ? '➖ Hide Optional Details' : '➕ Add PUC & Insurance Details'}
                        </button>
                    </div>

                    {showOptional && (
                        <div className="space-y-6 pt-4 animate-fade-in pb-4">
                            {/* PUC Section */}
                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/10 pb-2">Pollution (PUC)</h4>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Cert Number</label>
                                    <input
                                        type="text"
                                        name="pucNumber"
                                        placeholder="Certificate #"
                                        value={formData.pucNumber}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Issue Date</label>
                                        <input
                                            type="date"
                                            name="pucIssueDate"
                                            value={formData.pucIssueDate}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            name="pucExpiryDate"
                                            value={formData.pucExpiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Section */}
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/10 pb-2">Insurance Details</h4>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Company</label>
                                    <input
                                        type="text"
                                        name="insuranceCompany"
                                        placeholder="LIC, HDFC, etc."
                                        value={formData.insuranceCompany}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Policy Number</label>
                                    <input
                                        type="text"
                                        name="insurancePolicyNumber"
                                        placeholder="Policy #"
                                        value={formData.insurancePolicyNumber}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Issue</label>
                                        <input
                                            type="date"
                                            name="insuranceIssueDate"
                                            value={formData.insuranceIssueDate}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                        <input
                                            type="date"
                                            name="insuranceExpiryDate"
                                            value={formData.insuranceExpiryDate}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Direct Save Button for better visibility */}
                            <div className="pt-2 pb-2">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <span>Save & Add Vehicle</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">Click above to save all details</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Footer */}
                <div className="p-5 border-t border-slate-700 bg-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex gap-3 shrink-0 pb-[max(2rem,env(safe-area-inset-bottom))] mb-[env(safe-area-inset-bottom)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 rounded-xl border border-slate-600 text-slate-400 text-sm font-bold hover:bg-slate-700 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] bg-indigo-500 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Add Vehicle</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleForm;
