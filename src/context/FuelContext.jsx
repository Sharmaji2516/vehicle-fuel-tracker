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
    const [vehicles, setVehicles] = useState([]);
    const [entries, setEntries] = useState([]);

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
                if (error.code === 'permission-denied') {
                    console.error("Make sure your Firestore rules allow reading from 'vehicles' where userId matches.");
                }
            }
        );
        return () => unsubscribe();
    }, [user]);

    // Sync Entries from Firestore filtered by User
    useEffect(() => {
        if (!isConfigured || !user) return;

        const q = query(collection(db, "entries"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const remoteEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEntries(remoteEntries);
            },
            (error) => {
                console.error("Firestore Entries Error:", error);
                if (error.code === 'permission-denied') {
                    console.error("Make sure your Firestore rules allow reading from 'entries' where userId matches.");
                }
            }
        );

        return () => unsubscribe();
    }, [user]);

    const addVehicle = async (vehicle) => {
        if (!user) return;
        const newVehicle = { ...vehicle, id: Date.now().toString(), userId: user.uid };

        // Optimistic update
        setVehicles(prev => [...prev, newVehicle]);

        if (isConfigured) {
            try {
                await setDoc(doc(db, "vehicles", newVehicle.id), newVehicle);
                console.log("Vehicle saved to cloud");
            } catch (e) {
                console.error("Error adding vehicle to cloud: ", e);
                alert("Error saving vehicle to cloud! Check your internet or Firebase permissions.");
            }
        }
    };

    const addEntry = async (entry) => {
        if (!user) return;
        const newEntry = { ...entry, id: Date.now().toString(), userId: user.uid };

        // Optimistic update
        setEntries(prev => [...prev, newEntry]);

        if (isConfigured) {
            try {
                await setDoc(doc(db, "entries", newEntry.id), newEntry);
                console.log("Entry saved to cloud");
            } catch (e) {
                console.error("Error adding entry to cloud: ", e);
                alert("Error saving entry! Check if your Firebase Database Rules allow writing.");
            }
        }
    };

    const deleteEntry = async (id) => {
        setEntries(prev => prev.filter(e => e.id !== id));
        if (isConfigured) {
            try {
                await deleteDoc(doc(db, "entries", id));
            } catch (e) {
                console.error("Error deleting from cloud:", e);
            }
        }
    }

    const editEntry = async (updatedEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));

        if (isConfigured) {
            try {
                await setDoc(doc(db, "entries", updatedEntry.id), { ...updatedEntry, userId: user.uid });
            } catch (e) {
                console.error("Error updating entry in cloud:", e);
            }
        }
    };

    const getVehicleEntries = (vehicleId) => {
        return entries
            .filter(e => e.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const value = {
        vehicles,
        entries,
        addVehicle,
        addEntry,
        deleteEntry,
        editEntry,
        getVehicleEntries
    };

    return <FuelContext.Provider value={value}>{children}</FuelContext.Provider>;
};
