import React, { useMemo } from 'react';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend 
} from 'recharts';
import { useFuel } from '../context/FuelContext';
import { calculateAllMileages, calculateTotalSpent } from '../utils/calculations';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, Activity, BarChart3 } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = () => {
    const { vehicles, getVehicleEntries, getVehicleServiceEntries } = useFuel();

    const stats = useMemo(() => {
        const allFuelEntries = vehicles.flatMap(v => getVehicleEntries(v.id));
        const allServiceEntries = vehicles.flatMap(v => getVehicleServiceEntries(v.id));

        // 1. Mileage Trend Data (Combined)
        const mileageData = vehicles.map(v => {
            const entries = getVehicleEntries(v.id);
            const mileages = calculateAllMileages(entries);
            return {
                name: v.name,
                data: mileages.slice().reverse().map(m => ({
                    date: new Date(m.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    mileage: parseFloat(m.mileage)
                }))
            };
        }).filter(v => v.data.length > 0);

        // 2. Monthly Expenditure Data (Per Vehicle)
        const monthlyDataMap = {};
        const activeVehiclesSet = new Set();

        [...allFuelEntries, ...allServiceEntries].forEach(entry => {
            const date = new Date(entry.date);
            const monthYear = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            const cost = parseFloat(entry.totalCost || entry.cost || 0);
            const v = vehicles.find(veh => veh.id === entry.vehicleId);
            const vehicleName = v ? v.name : 'Unknown';
            
            if (!monthlyDataMap[monthYear]) {
                monthlyDataMap[monthYear] = { month: monthYear, total: 0 };
            }
            if (!monthlyDataMap[monthYear][vehicleName]) {
                monthlyDataMap[monthYear][vehicleName] = 0;
            }
            monthlyDataMap[monthYear][vehicleName] += cost;
            monthlyDataMap[monthYear].total += cost;
            activeVehiclesSet.add(vehicleName);
        });

        const monthlyData = Object.values(monthlyDataMap).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
        });

        const activeVehicleNames = Array.from(activeVehiclesSet);

        return { mileageData, monthlyData, activeVehicleNames };
    }, [vehicles, getVehicleEntries, getVehicleServiceEntries]);

    if (stats.monthlyData.length === 0) return null;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-5 border-indigo-500/20 shadow-2xl min-w-[160px]">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-white/10 pb-2">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate max-w-[100px]">
                                        {entry.name}
                                    </p>
                                </div>
                                <p className="text-xs font-black text-slate-900 dark:text-white">
                                    ₹{entry.value.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-5 mb-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Insights</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-0.5">Performance & Investment Analytics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Expenditure Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 md:p-10 rounded-[2.5rem] border-emerald-500/10 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white">Monthly Spending</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Breakdown per vehicle</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                                {stats.activeVehicleNames.map((name, index) => (
                                    <Bar 
                                        key={name} 
                                        dataKey={name} 
                                        stackId="a" 
                                        fill={COLORS[index % COLORS.length]} 
                                        radius={index === stats.activeVehicleNames.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                                        barSize={32}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Efficiency Comparison */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 md:p-10 rounded-[2.5rem] border-indigo-500/10 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white">Mileage Stats</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Latest recorded km/L</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.mileageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="glass-card p-4 border-indigo-500/20 shadow-xl">
                                                    <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{payload[0].payload.name}</p>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{payload[0].value} <span className="text-xs font-bold text-slate-400">km/L</span></p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey={(v) => v.data[v.data.length - 1]?.mileage} name="Efficiency" radius={[12, 12, 12, 12]} barSize={40}>
                                    {stats.mileageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.9} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Analytics;

