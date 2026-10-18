/**
 * Vehicle Fuel Tracker - Calculation Utilities
 * Enhanced with Smart Stacking Engine for Full Tank & Partial Fills
 */

/**
 * Processes fuel entries chronologically to compute:
 * - Odometer difference (trip distance) for every entry
 * - Stacked partial-fill buffer
 * - Accurate cycle mileage when a full-tank refill confirms the interval
 * 
 * Formula:
 * Mileage (km/L) = (Current Full Odometer - Previous Full Odometer) / (All Stacked Partial Liters + Current Full Liters)
 */
export const getProcessedFuelEntries = (entries = []) => {
    if (!entries || entries.length === 0) return [];

    // Sort chronologically (ascending by date, then by odometer)
    const sorted = [...entries].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return Number(a.odometer) - Number(b.odometer);
    });

    const processedMap = new Map();
    let lastFullRef = null;
    let runningStackLiters = 0;
    let runningStackEntries = [];

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const prev = i > 0 ? sorted[i - 1] : null;

        const isPartial = current.entryType === 'partial' || current.isPartial === true;
        const currentOdo = Number(current.odometer);
        const currentLiters = Number(current.liters || 0);

        // Trip distance from the immediately previous entry
        let tripDistance = null;
        if (prev && !isNaN(prev.odometer)) {
            const diff = currentOdo - Number(prev.odometer);
            if (diff >= 0) tripDistance = diff;
        }

        if (isPartial) {
            // Accumulate partial fill into the active stack
            runningStackLiters += currentLiters;
            runningStackEntries.push(current);

            const distanceSinceLastFull = lastFullRef ? (currentOdo - Number(lastFullRef.odometer)) : null;

            processedMap.set(current.id, {
                ...current,
                tripDistance: tripDistance !== null ? `${tripDistance} km` : '--',
                rawTripDistance: tripDistance,
                efficiency: null,
                rawEfficiency: null,
                status: 'partial_stacked',
                stackedLitersIncluded: 0,
                distanceSinceLastFull,
                isPartial: true,
                entryType: 'partial'
            });
        } else {
            // Full Tank entry
            let efficiency = null;
            let status = 'baseline';
            let stackedIncluded = 0;
            let cycleDistance = null;

            if (lastFullRef) {
                cycleDistance = currentOdo - Number(lastFullRef.odometer);
                const totalFuelInCycle = runningStackLiters + currentLiters;

                if (cycleDistance > 0 && totalFuelInCycle > 0) {
                    efficiency = (cycleDistance / totalFuelInCycle).toFixed(2);
                    status = runningStackEntries.length > 0 ? 'confirmed_stacked' : 'confirmed';
                    stackedIncluded = runningStackLiters;
                }
            } else {
                // First full tank acts as the initial baseline
                status = 'baseline';
            }

            // Reset running stack buffer for the next measurement cycle
            runningStackLiters = 0;
            runningStackEntries = [];
            lastFullRef = current;

            processedMap.set(current.id, {
                ...current,
                tripDistance: tripDistance !== null ? `${tripDistance} km` : '--',
                rawTripDistance: tripDistance,
                cycleDistance,
                efficiency: efficiency ? `${efficiency} km/L` : '--',
                rawEfficiency: efficiency ? parseFloat(efficiency) : null,
                status,
                stackedLitersIncluded: stackedIncluded,
                isPartial: false,
                entryType: 'full'
            });
        }
    }

    // Preserve the input array order (e.g. descending by date)
    return entries.map(original => processedMap.get(original.id) || original);
};

/**
 * Returns active pending stack information for a vehicle
 */
export const getVehicleStackInfo = (entries = []) => {
    if (!entries || entries.length === 0) {
        return { stackedLiters: 0, distanceSinceLastFull: 0, pendingCount: 0, hasLastFull: false };
    }

    const sorted = [...entries].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return Number(a.odometer) - Number(b.odometer);
    });

    // Find the latest full tank
    let lastFullIdx = -1;
    for (let i = sorted.length - 1; i >= 0; i--) {
        const e = sorted[i];
        if (e.entryType !== 'partial' && e.isPartial !== true) {
            lastFullIdx = i;
            break;
        }
    }

    // Accumulate all partial entries after that last full tank (or all partials if no full tank yet)
    const pendingPartials = sorted.slice(lastFullIdx + 1).filter(e => e.entryType === 'partial' || e.isPartial === true);
    const stackedLiters = pendingPartials.reduce((sum, e) => sum + Number(e.liters || 0), 0);

    let distanceSinceLastFull = 0;
    if (lastFullIdx >= 0 && pendingPartials.length > 0) {
        const lastFullOdo = Number(sorted[lastFullIdx].odometer);
        const latestPartialOdo = Number(pendingPartials[pendingPartials.length - 1].odometer);
        if (latestPartialOdo >= lastFullOdo) {
            distanceSinceLastFull = latestPartialOdo - lastFullOdo;
        }
    } else if (pendingPartials.length > 1) {
        distanceSinceLastFull = Number(pendingPartials[pendingPartials.length - 1].odometer) - Number(pendingPartials[0].odometer);
    }

    return {
        stackedLiters: Number(stackedLiters.toFixed(2)),
        distanceSinceLastFull,
        pendingCount: pendingPartials.length,
        hasLastFull: lastFullIdx >= 0
    };
};

/**
 * Returns the most recent confirmed mileage (ignores pending partial entries)
 */
export const calculateMileage = (entries) => {
    if (!entries || entries.length < 2) return 0;
    const processed = getProcessedFuelEntries(entries);
    const sortedDesc = [...processed].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestConfirmed = sortedDesc.find(e => e.rawEfficiency && e.rawEfficiency > 0);
    return latestConfirmed ? latestConfirmed.rawEfficiency.toFixed(2) : 0;
};

/**
 * Returns average mileage across all confirmed full-tank intervals
 */
export const calculateAverageMileage = (entries) => {
    if (!entries || entries.length < 2) return 0;
    const processed = getProcessedFuelEntries(entries);
    const confirmedEntries = processed.filter(e => e.rawEfficiency && e.rawEfficiency > 0);
    if (confirmedEntries.length === 0) return 0;

    const sumMileage = confirmedEntries.reduce((sum, e) => sum + e.rawEfficiency, 0);
    return (sumMileage / confirmedEntries.length).toFixed(2);
};

export const calculateTotalSpent = (fuelEntries = [], serviceEntries = []) => {
    const fuelTotal = fuelEntries.reduce((acc, curr) => acc + Number(curr.totalCost || 0), 0);
    const serviceTotal = serviceEntries.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);
    return (fuelTotal + serviceTotal).toFixed(2);
};

export const calculateFuelCost = (fuelEntries = []) => {
    const fuelTotal = fuelEntries.reduce((acc, curr) => acc + Number(curr.totalCost || 0), 0);
    return fuelTotal.toFixed(2);
};

export const calculateServiceCost = (serviceEntries = []) => {
    const serviceTotal = serviceEntries.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);
    return serviceTotal.toFixed(2);
};

/**
 * Returns all confirmed mileages for chart analytics (skips partials so graphs remain accurate)
 */
export const calculateAllMileages = (entries) => {
    if (!entries || entries.length < 2) return [];
    const processed = getProcessedFuelEntries(entries);
    return processed
        .filter(e => e.rawEfficiency && e.rawEfficiency > 0)
        .map(e => ({
            date: e.date,
            mileage: e.rawEfficiency.toFixed(2)
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const calculateDaysSinceLastService = (serviceEntries) => {
    if (!serviceEntries || serviceEntries.length === 0) return null;

    const sorted = [...serviceEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastService = sorted[0];

    if (!lastService || !lastService.date) return null;

    const lastServiceDate = new Date(lastService.date);
    const today = new Date();

    const diffTime = today - lastServiceDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
};

export const calculateExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'Unknown', color: 'text-slate-500', level: 'none' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { status: 'Expired', color: 'text-red-500', days: Math.abs(diffDays), level: 'critical' };
    } else if (diffDays <= 15) {
        return { status: 'Expiring Soon', color: 'text-amber-500', days: diffDays, level: 'warning' };
    } else {
        return { status: 'Active', color: 'text-emerald-500', days: diffDays, level: 'safe' };
    }
};

export const getVehicleAlerts = (vehicle, serviceEntries = []) => {
    const alerts = [];

    // Check PUC
    if (vehicle.pucExpiryDate) {
        const puc = calculateExpiryStatus(vehicle.pucExpiryDate);
        if (puc.level !== 'safe') {
            alerts.push({
                type: 'PUC',
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                status: puc.status,
                days: puc.days,
                level: puc.level,
                message: puc.level === 'critical'
                    ? `PUC expired ${puc.days} days ago!`
                    : `PUC expires in ${puc.days} days.`
            });
        }
    }

    // Check Insurance
    if (vehicle.insuranceExpiryDate) {
        const ins = calculateExpiryStatus(vehicle.insuranceExpiryDate);
        if (ins.level !== 'safe') {
            alerts.push({
                type: 'Insurance',
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                status: ins.status,
                days: ins.days,
                level: ins.level,
                message: ins.level === 'critical'
                    ? `Insurance expired ${ins.days} days ago!`
                    : `Insurance expires in ${ins.days} days.`
            });
        }
    }

    // Check Service (180 days interval)
    const daysSinceService = calculateDaysSinceLastService(serviceEntries);
    if (daysSinceService !== null) {
        if (daysSinceService >= 180) {
            alerts.push({
                type: 'Service',
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                status: 'Overdue',
                days: daysSinceService,
                level: 'critical',
                message: `Service is ${daysSinceService - 180} days overdue!`
            });
        } else if (daysSinceService >= 165) {
            alerts.push({
                type: 'Service',
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                status: 'Due Soon',
                days: 180 - daysSinceService,
                level: 'warning',
                message: `Service due in ${180 - daysSinceService} days.`
            });
        }
    }

    return alerts;
};

export const getExpiryWarning = (type, expiryDate) => {
    const { status, days, level } = calculateExpiryStatus(expiryDate);

    if (level === 'critical') {
        return { message: `${type} expired ${days} days ago`, urgent: true };
    } else if (level === 'warning') {
        return { message: `${type} expires in ${days} days`, urgent: false };
    }
    return null;
};
