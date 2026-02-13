import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import VehicleCard from './VehicleCard';
import AddEntryForm from './AddEntryForm';
import AddVehicleForm from './AddVehicleForm';
import HistoryTable from './HistoryTable';

const Dashboard = () => {
    const { vehicles, getVehicleEntries, addVehicle } = useFuel();
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [viewHistoryId, setViewHistoryId] = useState(null);

    const handleAddEntry = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setEditingEntry(null);
        setIsAddModalOpen(true);
    };

    const handleEditEntry = (entry, vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setEditingEntry(entry);
        setIsAddModalOpen(true);
    };

    const handleViewHistory = (vehicleId) => {
        setViewHistoryId(viewHistoryId === vehicleId ? null : vehicleId);
    };

    return (
        <div className="space-y-8">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-indigo-500 pl-4">My Vehicles</h2>
                        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold hidden sm:inline">Cloud Synced</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold sm:hidden">Synced</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {vehicles.length === 0 && (
                            <button
                                onClick={() => {
                                    const defaults = [
                                        { name: 'Activa 5G', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Yamaha FZ Hybrid', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Maruti Suzuki Dzire', type: 'Car', fuelType: 'Petrol' },
                                    ];
                                    defaults.forEach(v => addVehicle(v));
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 text-xs md:text-base w-full md:w-auto"
                            >
                                🚀 Setup Garage
                            </button>
                        )}
                        <button
                            onClick={() => setIsAddVehicleModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Vehicle
                        </button>
                    </div>
                </div>

                {vehicles.length === 0 ? (
                    <div className="text-center p-12 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                        <p className="text-slate-400 text-lg mb-4">No vehicles found in the cloud.</p>
                        <p className="text-slate-500 text-sm">Click "Add Vehicle" or "Setup Garage" to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} onClick={() => handleViewHistory(vehicle.id)} className="cursor-pointer">
                                <VehicleCard
                                    vehicle={vehicle}
                                    entries={getVehicleEntries(vehicle.id)}
                                    onAddEntry={(e, id) => {
                                        e.stopPropagation();
                                        handleAddEntry(vehicle.id);
                                    }}
                                    onViewHistory={(e) => {
                                        e.stopPropagation();
                                        handleViewHistory(vehicle.id);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {viewHistoryId && (
                <section className="animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-cyan-500 pl-4">
                            History: {vehicles.find(v => v.id === viewHistoryId)?.name}
                        </h2>
                        <button onClick={() => setViewHistoryId(null)} className="text-slate-400 hover:text-white">
                            Close
                        </button>
                    </div>
                    <HistoryTable
                        vehicleId={viewHistoryId}
                        onEdit={(entry) => handleEditEntry(entry, viewHistoryId)}
                    />
                </section>
            )}

            {isAddModalOpen && (
                <AddEntryForm
                    vehicleId={selectedVehicleId}
                    initialData={editingEntry}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}

            {isAddVehicleModalOpen && (
                <AddVehicleForm
                    onClose={() => setIsAddVehicleModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
