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

    // We still keep local storage for offline capability or cache, 
    // but effectively we want to prioritize cloud data if logged in.
    // For simplicity in this "fast" implementation, we will use local state 
    // primarily driven by the firestore listener if connected.

    // Initialize with empty arrays to avoid showing local data to wrong user
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

    // Sync Vehicles from Firestore filtered by User
    useEffect(() => {
        if (!isConfigured || !user) return;

        const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const remoteVehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVehicles(remoteVehicles);
            },
            (error) => {
                console.error("Firestore Vehicles Error:", error);
            }
        );
        return () => unsubscribe();
    }, [user]);

    // Sync Fuel Entries
    useEffect(() => {
        if (!isConfigured || !user) return;

        const q = query(collection(db, "entries"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    // LocalStorage sync as fallback/cache
    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    useEffect(() => {
        localStorage.setItem('serviceEntries', JSON.stringify(serviceEntries));
    }, [serviceEntries]);

    // Sync Service Entries
    useEffect(() => {
        if (!isConfigured || !user) return;

        const q = query(collection(db, "serviceEntries"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setServiceEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const addVehicle = async (vehicle) => {
        if (!user) return;
        const newVehicle = { ...vehicle, id: Date.now().toString(), userId: user.uid };
        setVehicles(prev => [...prev, newVehicle]);
        if (isConfigured) await setDoc(doc(db, "vehicles", newVehicle.id), newVehicle);
    };

    const addEntry = async (entry) => {
        if (!user) return;
        const newEntry = { ...entry, id: Date.now().toString(), userId: user.uid };
        setEntries(prev => [...prev, newEntry]);
        if (isConfigured) await setDoc(doc(db, "entries", newEntry.id), newEntry);
    };

    const deleteEntry = async (id) => {
        setEntries(prev => prev.filter(e => e.id !== id));
        if (isConfigured) await deleteDoc(doc(db, "entries", id));
    };

    const editEntry = async (updatedEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (isConfigured) await setDoc(doc(db, "entries", updatedEntry.id), { ...updatedEntry, userId: user.uid });
    };

    const addServiceEntry = async (entry) => {
        if (!user) return;
        const newEntry = { ...entry, id: Date.now().toString(), userId: user.uid };
        setServiceEntries(prev => [...prev, newEntry]);
        if (isConfigured) await setDoc(doc(db, "serviceEntries", newEntry.id), newEntry);
    };

    const deleteServiceEntry = async (id) => {
        setServiceEntries(prev => prev.filter(e => e.id !== id));
        if (isConfigured) await deleteDoc(doc(db, "serviceEntries", id));
    };

    const editServiceEntry = async (updatedEntry) => {
        setServiceEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        if (isConfigured) await setDoc(doc(db, "serviceEntries", updatedEntry.id), { ...updatedEntry, userId: user.uid });
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
