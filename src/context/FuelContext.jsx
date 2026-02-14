import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, isConfigured } from '../firebase';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, setDoc, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FuelContext = createContext();

export const useFuel = () => {
    return useContext(FuelContext);
};

export const FuelProvider = ({ children }) => {
    const { user } = useAuth();

    // State management
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

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        localStorage.setItem('entries', JSON.stringify(entries));
        localStorage.setItem('serviceEntries', JSON.stringify(serviceEntries));
    }, [vehicles, entries, serviceEntries]);

    // Data Migration: Move guest data to user UID on login
    useEffect(() => {
        if (!isConfigured || !user) return;

        const migrateData = async () => {
            let migrated = false;

            // Migrate Vehicles
            const guestVehicles = vehicles.filter(v => v.userId === 'guest');
            for (const v of guestVehicles) {
                const updated = { ...v, userId: user.uid };
                await setDoc(doc(db, "vehicles", v.id), updated);
                migrated = true;
            }

            // Migrate Entries
            const guestEntries = entries.filter(e => e.userId === 'guest');
            for (const e of guestEntries) {
                const updated = { ...e, userId: user.uid };
                await setDoc(doc(db, "entries", e.id), updated);
                migrated = true;
            }

            // Migrate Service Entries
            const guestServices = serviceEntries.filter(s => s.userId === 'guest');
            for (const s of guestServices) {
                const updated = { ...s, userId: user.uid };
                await setDoc(doc(db, "serviceEntries", s.id), updated);
                migrated = true;
            }

            if (migrated) {
                console.log("Guest data migrated successfully");
            }
        };

        migrateData();
    }, [user, isConfigured]);

    // Sync Handlers (Clean, no state dependencies to avoid loops)
    useEffect(() => {
        if (!isConfigured || !user) return;

        const vQ = query(collection(db, "vehicles"), where("userId", "==", user.uid));
        const stopVehicles = onSnapshot(vQ, (s) => setVehicles(s.docs.map(d => ({ id: d.id, ...d.data() }))));

        const eQ = query(collection(db, "entries"), where("userId", "==", user.uid));
        const stopEntries = onSnapshot(eQ, (s) => setEntries(s.docs.map(d => ({ id: d.id, ...d.data() }))));

        const sQ = query(collection(db, "serviceEntries"), where("userId", "==", user.uid));
        const stopServices = onSnapshot(sQ, (s) => setServiceEntries(s.docs.map(d => ({ id: d.id, ...d.data() }))));

        return () => {
            stopVehicles();
            stopEntries();
            stopServices();
        };
    }, [user, isConfigured]);

    const addVehicle = async (vehicle) => {
        const id = Date.now().toString();
        const newVehicle = { ...vehicle, id, userId: user?.uid || 'guest' };
        setVehicles(prev => [...prev, newVehicle]);
        if (user && isConfigured) await setDoc(doc(db, "vehicles", id), newVehicle);
    };

    const addEntry = async (entry) => {
        const id = Date.now().toString();
        const newEntry = { ...entry, id, userId: user?.uid || 'guest' };
        setEntries(prev => [...prev, newEntry]);
        if (user && isConfigured) await setDoc(doc(db, "entries", id), newEntry);
    };

    const deleteEntry = async (id) => {
        setEntries(prev => prev.filter(e => e.id !== id));
        if (isConfigured) await deleteDoc(doc(db, "entries", id));
    };

    const editEntry = async (updatedEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (user && isConfigured) await setDoc(doc(db, "entries", updatedEntry.id), { ...updatedEntry });
    };

    const addServiceEntry = async (entry) => {
        const id = Date.now().toString();
        const newEntry = { ...entry, id, userId: user?.uid || 'guest' };
        setServiceEntries(prev => [...prev, newEntry]);
        if (user && isConfigured) await setDoc(doc(db, "serviceEntries", id), newEntry);
    };

    const deleteServiceEntry = async (id) => {
        setServiceEntries(prev => prev.filter(e => e.id !== id));
        if (isConfigured) await deleteDoc(doc(db, "serviceEntries", id));
    };

    const editServiceEntry = async (updatedEntry) => {
        setServiceEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (user && isConfigured) await setDoc(doc(db, "serviceEntries", updatedEntry.id), { ...updatedEntry });
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
        addVehicle,
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
