import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, isConfigured } from '../firebase';
import { collection, onSnapshot, query, deleteDoc, doc, setDoc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FuelContext = createContext();

export const useFuel = () => {
    return useContext(FuelContext);
};

export const FuelProvider = ({ children }) => {
    const { user } = useAuth();

    // State management - Load from localStorage initially (needed for migration)
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('vehicles');
        return saved ? JSON.parse(saved) : [];
    });
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('entries');
        return saved ? JSON.parse(saved) : [];
    });
    const [serviceEntries, setServiceEntries] = useState(() => {
        const saved = localStorage.getItem('serviceEntries');
        return saved ? JSON.parse(saved) : [];
    });

    const [migrationDone, setMigrationDone] = useState(false);
    const [syncStatus, setSyncStatus] = useState('offline');

    // Save to LocalStorage ONLY in true guest mode
    useEffect(() => {
        if (!user && !isConfigured) {
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            localStorage.setItem('entries', JSON.stringify(entries));
            localStorage.setItem('serviceEntries', JSON.stringify(serviceEntries));
        }
    }, [vehicles, entries, serviceEntries, user, isConfigured]);

    // Data Migration: Run once when user logs in with configured cloud
    useEffect(() => {
        if (!isConfigured) return;

        if (!user) {
            setMigrationDone(false);
            setSyncStatus('offline');
            return;
        }

        const migrateData = async () => {
            setSyncStatus('migrating');
            try {
                const migrator = async (collectionName, currentData) => {
                    const guests = (currentData || []).filter(item => item.userId === 'guest');
                    for (const item of guests) {
                        const updated = { ...item, userId: user.uid };
                        await setDoc(doc(db, collectionName, item.id), updated);
                    }
                };

                await migrator("vehicles", vehicles);
                await migrator("entries", entries);
                await migrator("serviceEntries", serviceEntries);

                console.log("Migration complete");
            } catch (err) {
                console.warn("Migration warning:", err);
            } finally {
                setMigrationDone(true);
                setSyncStatus('syncing');
            }
        };

        migrateData();
    }, [user, isConfigured]);

    // Firebase Sync
    useEffect(() => {
        if (!isConfigured || !user || !migrationDone) return;

        console.log("Starting Firebase sync for:", user.email);

        localStorage.removeItem('vehicles');
        localStorage.removeItem('entries');
        localStorage.removeItem('serviceEntries');

        const unsubVehicles = onSnapshot(query(collection(db, "vehicles"), where("userId", "==", user.uid)), (s) => {
            setVehicles(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubEntries = onSnapshot(query(collection(db, "entries"), where("userId", "==", user.uid)), (s) => {
            setEntries(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const unsubServices = onSnapshot(query(collection(db, "serviceEntries"), where("userId", "==", user.uid)), (s) => {
            setServiceEntries(s.docs.map(d => ({ id: d.id, ...d.data() })));
            setSyncStatus('synced');
        });

        return () => {
            unsubVehicles();
            unsubEntries();
            unsubServices();
        };
    }, [user, isConfigured, migrationDone]);

    const addVehicle = async (vehicle) => {
        const id = Date.now().toString();
        const newVehicle = { ...vehicle, id, userId: user?.uid || 'guest' };
        setVehicles(prev => [...prev, newVehicle]);
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "vehicles", id), newVehicle);
            } catch (err) {
                console.warn("Firestore save vehicle error:", err);
            }
        }
    };

    const updateVehicle = async (vehicleId, updates) => {
        setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, ...updates } : v));
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "vehicles", vehicleId), updates, { merge: true });
            } catch (err) {
                console.warn("Firestore update vehicle error:", err);
            }
        }
    };

    const deleteVehicle = async (vehicleId) => {
        setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        setEntries(prev => prev.filter(e => e.vehicleId !== vehicleId));
        setServiceEntries(prev => prev.filter(e => e.vehicleId !== vehicleId));
        if (user && isConfigured) {
            try {
                await deleteDoc(doc(db, "vehicles", vehicleId));
            } catch (err) {
                console.warn("Firestore delete vehicle error:", err);
            }
        }
    };

    const addEntry = async (entry) => {
        const id = Date.now().toString();
        const newEntry = { ...entry, id, userId: user?.uid || 'guest' };
        setEntries(prev => [...prev, newEntry]);
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "entries", id), newEntry);
            } catch (err) {
                console.warn("Firestore save entry error:", err);
            }
        }
    };

    const deleteEntry = async (id) => {
        setEntries(prev => prev.filter(e => e.id !== id));
        if (user && isConfigured) {
            try {
                await deleteDoc(doc(db, "entries", id));
            } catch (err) {
                console.warn("Firestore delete entry error:", err);
            }
        }
    };

    const editEntry = async (updatedEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "entries", updatedEntry.id), { ...updatedEntry, userId: user.uid });
            } catch (err) {
                console.warn("Firestore edit entry error:", err);
            }
        }
    };

    const addServiceEntry = async (entry) => {
        const id = Date.now().toString();
        const newEntry = { ...entry, id, userId: user?.uid || 'guest' };
        setServiceEntries(prev => [...prev, newEntry]);
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "serviceEntries", id), newEntry);
            } catch (err) {
                console.warn("Firestore save service error:", err);
            }
        }
    };

    const deleteServiceEntry = async (id) => {
        setServiceEntries(prev => prev.filter(e => e.id !== id));
        if (user && isConfigured) {
            try {
                await deleteDoc(doc(db, "serviceEntries", id));
            } catch (err) {
                console.warn("Firestore delete service error:", err);
            }
        }
    };

    const editServiceEntry = async (updatedEntry) => {
        setServiceEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (user && isConfigured) {
            try {
                await setDoc(doc(db, "serviceEntries", updatedEntry.id), { ...updatedEntry, userId: user.uid });
            } catch (err) {
                console.warn("Firestore edit service error:", err);
            }
        }
    };

    const getVehicleEntries = (vehicleId) => {
        return entries
            .filter(e => e.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const getVehicleServiceEntries = (vehicleId) => {
        return serviceEntries
            .filter(e => e.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const value = {
        vehicles,
        entries,
        serviceEntries,
        syncStatus,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addEntry,
        deleteEntry,
        editEntry,
        getVehicleEntries,
        addServiceEntry,
        deleteServiceEntry,
        editServiceEntry,
        getVehicleServiceEntries
    };

    return <FuelContext.Provider value={value}>{children}</FuelContext.Provider>;
};
