import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';

const AddVehicleForm = ({ onClose }) => {
    const { addVehicle } = useFuel();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Bike', // Default to Bike
        fuelType: 'Petrol' // Default to Petrol
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add New Vehicle</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Vehicle Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Honda City, Jupiter"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
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
                            <label className="block text-sm font-medium text-slate-400 mb-1">Fuel</label>
                            <select
                                name="fuelType"
                                value={formData.fuelType}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                            >
                                <option value="Petrol">Petrol ⛽</option>
                                <option value="Diesel">Diesel 🚛</option>
                                <option value="CNG">CNG 💨</option>
                                <option value="Electric">Electric ⚡</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5 mt-6"
                    >
                        Add Vehicle
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleForm;
