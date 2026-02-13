import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';

const AddEntryForm = ({ vehicleId, onClose, initialData }) => {
    const { addEntry, editEntry, vehicles } = useFuel();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [formData, setFormData] = useState(initialData || {
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        price: '', // Price per liter
        totalCost: ''
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{initialData ? 'Edit Entry' : 'Add Fuel'} for {vehicle?.name}</h3>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Liters</label>
                            <input
                                type="number"
                                step="0.01"
                                name="liters"
                                value={formData.liters}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Price / L</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="₹ 0.00"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Total Cost</label>
                        <input
                            type="number"
                            step="0.01"
                            name="totalCost"
                            value={formData.totalCost}
                            onChange={handleChange}
                            required
                            placeholder="₹ 0.00"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        Save Entry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntryForm;
