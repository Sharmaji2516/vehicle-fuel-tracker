import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { useAuth } from '../context/AuthContext';
import VehicleCard from './VehicleCard';
import AddEntryForm from './AddEntryForm';
import AddVehicleForm from './AddVehicleForm';
import HistoryTable from './HistoryTable';
import ServiceHistoryTable from './ServiceHistoryTable';
import AddServiceForm from './AddServiceForm';
import MaintenanceAlerts from './MaintenanceAlerts';
import Analytics from './Analytics';
import { Plus, Car, Cloud, CloudOff, RefreshCw, AlertCircle, TrendingUp, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTotalSpent } from '../utils/calculations';

const Dashboard = () => {
    const { user } = useAuth();
    const { vehicles, getVehicleEntries, addVehicle, syncStatus, getVehicleServiceEntries } = useFuel();
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [viewHistoryId, setViewHistoryId] = useState(null);
    const [historyType, setHistoryType] = useState('fuel'); // 'fuel' or 'service'
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

    // Calculate total garage stats
    const totalVehicles = vehicles.length;
    const totalSpent = vehicles.reduce((acc, v) => {
        const fuelEntries = getVehicleEntries(v.id);
        const serviceEntries = getVehicleServiceEntries(v.id);
        return acc + Number(calculateTotalSpent(fuelEntries, serviceEntries));
    }, 0);

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
            case 'synced': return <Cloud className="w-4 h-4 text-emerald-500" />;
            case 'syncing': return <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />;
            case 'offline': return <CloudOff className="w-4 h-4 text-slate-400" />;
            case 'migrating': return <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />;
            default: return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    return (
        <div className="space-y-16 pb-20">
            <MaintenanceAlerts />

            {/* Garage Overview Summary */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-indigo-500/10"
                >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Car className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Garage</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{totalVehicles} <span className="text-sm font-bold text-slate-400 uppercase">Vehicles</span></h4>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-emerald-500/10"
                >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Investment</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalSpent.toLocaleString()}</h4>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-amber-500/10"
                >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        {getSyncIcon()}
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Cloud Sync</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {syncStatus === 'synced' ? 'Protected' : syncStatus}
                        </h4>
                    </div>
                </motion.div>
            </section>

            {/* Analytics Section */}
            <Analytics />

            {/* Garage Header */}
            <section className="relative">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 text-center md:text-left">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
                            My Garage
                            <span className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">{vehicles.length}</span>
                        </h2>
                        <p className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Manage your vehicles and track efficiency</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {vehicles.length === 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const defaults = [
                                        { name: 'Activa 5G', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Yamaha FZ Hybrid', type: 'Bike', fuelType: 'Petrol' },
                                        { name: 'Maruti Suzuki Dzire', type: 'Car', fuelType: 'Petrol' },
                                    ];
                                    defaults.forEach(v => addVehicle(v));
                                }}
                                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                            >
                                🚀 Setup Demo
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAddVehicleModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-900/40 flex items-center gap-3 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Vehicle
                        </motion.button>
                    </div>
                </div>

                {vehicles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 glass-card rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Car className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Your garage is empty</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Add your first vehicle to unlock insights</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {vehicles.map((vehicle, index) => (
                                <motion.div
                                    key={vehicle.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <VehicleCard
                                        vehicle={vehicle}
                                        entries={getVehicleEntries(vehicle.id)}
                                        serviceEntries={getVehicleServiceEntries(vehicle.id)}
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

            {/* History Section - Floating Overlay or Content Section */}
            <AnimatePresence>
                {viewHistoryId && (
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="relative z-20"
                    >
                        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-indigo-500/20 shadow-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-slate-200 dark:border-white/5 pb-10">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                                        {vehicles.find(v => v.id === viewHistoryId)?.name} 
                                        <span className="text-indigo-500 ml-3">Logs</span>
                                    </h3>
                                    <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Detailed records for fuel and maintenance
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                    <button
                                        onClick={() => setHistoryType('fuel')}
                                        className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${historyType === 'fuel'
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'
                                            }`}
                                    >
                                        Fuel Logs
                                    </button>

                                    <button
                                        onClick={() => setHistoryType('service')}
                                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historyType === 'service'
                                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
                                            }`}
                                    >
                                        Services
                                    </button>
                                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2" />
                                    <button
                                        onClick={() => setViewHistoryId(null)}
                                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[400px]">
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
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
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
            </AnimatePresence>
        </div>
    );
};


export default Dashboard;
