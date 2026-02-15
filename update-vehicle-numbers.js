// Script to update vehicle numbers for existing vehicles
// Run this with: node update-vehicle-numbers.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

// Your Firebase config (same as in src/firebase.js)
const firebaseConfig = {
    apiKey: "AIzaSyDe1wYOkGHwJOqKEjGTbqCQNYOQPgGQjhg",
    authDomain: "vehicle-fuel-tracker-1e2d1.firebaseapp.com",
    projectId: "vehicle-fuel-tracker-1e2d1",
    storageBucket: "vehicle-fuel-tracker-1e2d1.firebasestorage.app",
    messagingSenderId: "1009893859086",
    appId: "1:1009893859086:web:f3e9a5e5d8e5e5e5e5e5e5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Vehicle numbers to update
const vehicleUpdates = {
    'Dzire': 'RJ09CC7411',
    'Yamaha': 'RJ09ZS4743',
    // Add the third vehicle name here
    // 'VehicleName': 'RJ09FS3881'
};

async function updateVehicleNumbers() {
    try {
        console.log('🚀 Starting vehicle number updates...\n');

        // Get all vehicles
        const vehiclesRef = collection(db, 'vehicles');
        const snapshot = await getDocs(vehiclesRef);

        let updatedCount = 0;

        for (const docSnap of snapshot.docs) {
            const vehicle = docSnap.data();
            const vehicleName = vehicle.name;

            // Check if this vehicle needs updating
            for (const [name, number] of Object.entries(vehicleUpdates)) {
                if (vehicleName.includes(name)) {
                    console.log(`✅ Updating ${vehicleName} with number ${number}`);

                    await updateDoc(doc(db, 'vehicles', docSnap.id), {
                        vehicleNumber: number
                    });

                    updatedCount++;
                    break;
                }
            }
        }

        console.log(`\n✨ Successfully updated ${updatedCount} vehicle(s)!`);
        console.log('🎉 Done! You can now refresh your app to see the vehicle numbers.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating vehicles:', error);
        process.exit(1);
    }
}

updateVehicleNumbers();
