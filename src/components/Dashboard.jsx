import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useAuth } from '../context/AuthContext';
import VehicleCard from './VehicleCard';
import AddEntryForm from './AddEntryForm';
import AddVehicleForm from './AddVehicleForm';
import HistoryTable from './HistoryTable';
import ServiceHistoryTable from './ServiceHistoryTable';
import AddServiceForm from './AddServiceForm';
import UpdateVehicleNumbers from './UpdateVehicleNumbers';

const Dashboard = () => {
    const { user } = useAuth();
    const { vehicles, getVehicleEntries, addVehicle, syncStatus } = useFuel();
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [viewHistoryId, setViewHistoryId] = useState(null);
    const [historyType, setHistoryType] = useState('fuel'); // 'fuel' or 'service'
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [isUpdateVehicleNumbersOpen, setIsUpdateVehicleNumbersOpen] = useState(false);

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

    const handleViewHistory = (vehicleId, type = 'fuel') => {
        if (viewHistoryId === vehicleId && historyType === type) {
            setViewHistoryId(null);
        } else {
            setViewHistoryId(vehicleId);
            setHistoryType(type);
        }
    };

    const handleAddService = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setEditingService(null);
        setIsAddServiceModalOpen(true);
    };

    const handleEditService = (entry, vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setEditingService(entry);
        setIsAddServiceModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-indigo-500 pl-4">My Vehicles</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                                <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : syncStatus === 'offline' ? 'bg-slate-500' : 'bg-amber-500'}`}></div>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1">
                                    {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'migrating' ? 'Migrating...' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline'}
                                </span>
                            </div>
                            <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">v1.5 - Absolute Sync</span>
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
                        <p className="text-slate-400 text-lg mb-4">{syncStatus === 'migrating' ? 'Migrating your data...' : 'No vehicles found in the cloud.'}</p>
                        <p className="text-slate-500 text-sm">Click "Add Vehicle" or "Setup Garage" to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} onClick={() => handleViewHistory(vehicle.id)} className="cursor-pointer">
                                <VehicleCard
                                    vehicle={vehicle}
                                    entries={getVehicleEntries(vehicle.id)}
                                    serviceEntries={useFuel().getVehicleServiceEntries(vehicle.id)}
                                    onAddEntry={(e, id) => {
                                        e.stopPropagation();
                                        handleAddEntry(vehicle.id);
                                    }}
                                    onViewHistory={(e, type) => {
                                        e.stopPropagation();
                                        handleViewHistory(vehicle.id, type);
                                    }}
                                    onAddService={(e) => {
                                        e.stopPropagation();
                                        handleAddService(vehicle.id);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {viewHistoryId && (
                <section className="animate-fade-in-up">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className={`text-2xl font-bold text-white border-l-4 ${historyType === 'fuel' ? 'border-cyan-500' : 'border-emerald-500'} pl-4`}>
                                {historyType === 'fuel' ? 'Fuel History' : 'Service History'}: {vehicles.find(v => v.id === viewHistoryId)?.name}
                            </h2>
                        </div>
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 w-full md:w-auto">
                            <button
                                onClick={() => setHistoryType('fuel')}
                                className={`flex-1 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${historyType === 'fuel' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Fuel
                            </button>
                            <button
                                onClick={() => setHistoryType('service')}
                                className={`flex-1 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${historyType === 'service' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Service
                            </button>
                            <button onClick={() => setViewHistoryId(null)} className="ml-2 p-2 text-slate-400 hover:text-white md:hidden font-bold">✕</button>
                        </div>
                        <button onClick={() => setViewHistoryId(null)} className="hidden md:block text-slate-400 hover:text-white font-bold transition-colors">
                            Close History
                        </button>
                    </div>

                    {historyType === 'fuel' ? (
                        <HistoryTable
                            vehicleId={viewHistoryId}
                            onEdit={(entry) => handleEditEntry(entry, viewHistoryId)}
                        />
                    ) : (
                        <ServiceHistoryTable
                            vehicleId={viewHistoryId}
                            onEdit={(entry) => handleEditService(entry, viewHistoryId)}
                        />
                    )}
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

            {isAddServiceModalOpen && (
                <AddServiceForm
                    vehicleId={selectedVehicleId}
                    initialData={editingService}
                    onClose={() => setIsAddServiceModalOpen(false)}
                />
            )}

            {isUpdateVehicleNumbersOpen && (
                <UpdateVehicleNumbers
                    onClose={() => setIsUpdateVehicleNumbersOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
