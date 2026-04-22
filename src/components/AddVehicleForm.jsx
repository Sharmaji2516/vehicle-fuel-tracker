import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Hash, Fuel, ShieldCheck, FileText, ChevronDown, ChevronUp, PlusCircle, Check } from 'lucide-react';

const AddVehicleForm = ({ onClose }) => {
    const { addVehicle } = useFuel();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        vehicleNumber: '',
        type: 'Bike',
        fuelType: 'Petrol',
        pucNumber: '',
        pucIssueDate: '',
        pucExpiryDate: '',
        insuranceCompany: '',
        insurancePolicyNumber: '',
        insuranceIssueDate: '',
        insuranceExpiryDate: ''
    });

    const [showOptional, setShowOptional] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle(formData);
        showNotification('New vehicle added to your garage!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                
                <div className="relative p-8 md:p-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                New Vehicle
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1">
                                ADD TO YOUR DIGITAL GARAGE
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Section: Identity */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Car className="w-3.5 h-3.5" /> Vehicle Identity
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. BMW M4 Competition"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Hash className="w-3.5 h-3.5" /> License Plate
                                </label>
                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    required
                                    placeholder="RJ 09 XX 0000"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Section: Specifications */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option value="Bike">Bike</option>
                                    <option value="Car">Car</option>
                                    <option value="Scooty">Scooty</option>
                                    <option value="Auto">Auto</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Truck">Truck</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Fuel className="w-3.5 h-3.5" /> Fuel
                                </label>
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                        </div>

                        {/* Section: Compliance Toggle */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setShowOptional(!showOptional)}
                                className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/30 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                            >
                                {showOptional ? <ChevronUp className="w-4 h-4" /> : <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                {showOptional ? 'Hide Compliance Details' : 'Add PUC & Insurance'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showOptional && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-8 overflow-hidden pb-4"
                                >
                                    {/* PUC Details */}
                                    <div className="space-y-4 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Pollution (PUC)
                                        </h4>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="pucNumber"
                                                placeholder="Certificate Number"
                                                value={formData.pucNumber}
                                                onChange={handleChange}
                                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Expiry Date</span>
                                                    <input
                                                        type="date"
                                                        name="pucExpiryDate"
                                                        value={formData.pucExpiryDate}
                                                        onChange={handleChange}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insurance Details */}
                                    <div className="space-y-4 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> Insurance
                                        </h4>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="insuranceCompany"
                                                placeholder="Insurance Company"
                                                value={formData.insuranceCompany}
                                                onChange={handleChange}
                                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <input
                                                type="text"
                                                name="insurancePolicyNumber"
                                                placeholder="Policy Number"
                                                value={formData.insurancePolicyNumber}
                                                onChange={handleChange}
                                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Expiry Date</span>
                                                    <input
                                                        type="date"
                                                        name="insuranceExpiryDate"
                                                        value={formData.insuranceExpiryDate}
                                                        onChange={handleChange}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-4 shrink-0">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-500/30 uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Check className="w-5 h-5" />
                                Add To Garage
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};


export default AddVehicleForm;
