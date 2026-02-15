import React, { useState } from 'react';
import { useFuel } from '../context/FuelContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const UpdateVehicleNumbers = ({ onClose }) => {
    const { vehicles } = useFuel();
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    const vehicleNumbers = {
        'Activa': 'RJ09FS3881',
        'Dzire': 'RJ09CC7411',
        'Yamaha': 'RJ09ZS4743',
        'FZ': 'RJ09ZS4743'
    };

    const updateNumbers = async () => {
        setUpdating(true);
        setStatus('Updating...');

        try {
            let updated = 0;

            for (const vehicle of vehicles) {
                for (const [name, number] of Object.entries(vehicleNumbers)) {
                    if (vehicle.name.toLowerCase().includes(name.toLowerCase())) {
                        await updateDoc(doc(db, 'vehicles', vehicle.id), {
                            vehicleNumber: number
                        });
                        updated++;
                        setStatus(`Updated ${vehicle.name} → ${number}`);
                        break;
                    }
                }
            }

            setStatus(`✅ Successfully updated ${updated} vehicle(s)! Refresh the page to see changes.`);
        } catch (error) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Update Vehicle Numbers</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-4">
                    <p className="text-slate-400 text-sm">
                        This will add vehicle numbers to your vehicles:
                    </p>

                    <ul className="space-y-2 text-sm">
                        {vehicles.map(v => {
                            const matchedNumber = Object.entries(vehicleNumbers).find(([name]) =>
                                v.name.toLowerCase().includes(name.toLowerCase())
                            );
                            return (
                                <li key={v.id} className="bg-slate-700/30 p-2 rounded">
                                    <span className="text-white font-bold">{v.name}</span>
                                    {matchedNumber && (
                                        <span className="text-cyan-400 ml-2">→ {matchedNumber[1]}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <button
                        onClick={updateNumbers}
                        disabled={updating}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {updating ? 'Updating...' : 'Update Vehicle Numbers'}
                    </button>

                    {status && (
                        <div className="bg-slate-700/50 p-3 rounded-lg text-sm text-slate-200">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateVehicleNumbers;
