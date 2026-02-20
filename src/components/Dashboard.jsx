import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useAuth } from '../context/AuthContext';
import VehicleCard from './VehicleCard';
import AddEntryForm from './AddEntryForm';
import AddVehicleForm from './AddVehicleForm';
import HistoryTable from './HistoryTable';
import ServiceHistoryTable from './ServiceHistoryTable';
import AddServiceForm from './AddServiceForm';
import { Plus, Car, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const getSyncIcon = () => {
        switch (syncStatus) {
            case 'synced': return <Cloud className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
            case 'syncing': return <RefreshCw className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-spin" />;
            case 'offline': return <CloudOff className="w-4 h-4 text-slate-400" />;
            case 'migrating': return <RefreshCw className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" />;
            default: return <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
        }
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <section className="relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Car className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            My Garage
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="glass px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                {getSyncIcon()}
                                <span className="uppercase tracking-wider">
                                    {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {vehicles.length === 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const defaults = [
                                        { name: 'Activa 5G', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Yamaha FZ Hybrid', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Maruti Suzuki Dzire', type: 'Car', fuelType: 'Petrol' },
                                    ];
                                    defaults.forEach(v => addVehicle(v));
                                }}
                                className="bg-emerald-600/90 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 flex items-center gap-2"
                            >
                                🚀 Setup Demo
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAddVehicleModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Vehicle
                        </motion.button>
                    </div>
                </div>

                {vehicles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 glass rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-700"
                    >
                        <Car className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-2">Your garage is empty</p>
                        <p className="text-slate-400 dark:text-slate-500">Add a vehicle to start tracking fuel and maintainence.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {vehicles.map((vehicle, index) => (
                                <motion.div
                                    key={vehicle.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    layout
                                >
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
                                        isSelected={viewHistoryId === vehicle.id}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* History Section */}
            <AnimatePresence>
                {viewHistoryId && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass rounded-3xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        {vehicles.find(v => v.id === viewHistoryId)?.name} History
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        Viewing {historyType} records
                                    </p>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                                    <button
                                        onClick={() => setHistoryType('fuel')}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${historyType === 'fuel'
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Fuel
                                    </button>
                                    <button
                                        onClick={() => setHistoryType('service')}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${historyType === 'service'
                                                ? 'bg-emerald-600 text-white shadow-lg'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Service
                                    </button>
                                    <button
                                        onClick={() => setViewHistoryId(null)}
                                        className="ml-2 px-4 py-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
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
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Modals */}
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
        </div>
    );
};

export default Dashboard;
