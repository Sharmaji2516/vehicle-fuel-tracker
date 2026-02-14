import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';

const AddServiceForm = ({ vehicleId, onClose, initialData }) => {
    const { addServiceEntry, editServiceEntry, vehicles } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [formData, setFormData] = useState(initialData || {
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        serviceType: '',
        cost: '',
        paymentMode: 'Cash'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{initialData ? 'Edit Service' : 'Add Service'} for {vehicle?.name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Odometer (km)</label>
                        <input
                            type="number"
                            name="odometer"
                            value={formData.odometer}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 15000"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Service Type</label>
                        <input
                            type="text"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Oil Change, Tire Rotation"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Cost</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            placeholder="₹ 0.00"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Payment Mode</label>
                        <div className="flex gap-4">
                            {['Cash', 'Online'].map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode }))}
                                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.paymentMode === mode
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    {mode === 'Cash' ? '💵 Cash' : '💳 Online'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Saving...' : (initialData ? 'Update Service Record' : 'Save Service Record')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddServiceForm;
