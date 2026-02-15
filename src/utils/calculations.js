export const calculateMileage = (entries) => {
    if (!entries || entries.length < 2) return 0;

    // Sort by odometer just in case
    const sorted = [...entries].sort((a, b) => b.odometer - a.odometer);

    const latest = sorted[0];
    const previous = sorted[1];

    const distance = latest.odometer - previous.odometer;
    const fuel = latest.liters;

    if (fuel <= 0) return 0;

    return (distance / fuel).toFixed(2);
};

export const calculateAverageMileage = (entries) => {
    if (!entries || entries.length < 2) return 0;

    const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalDistance = last.odometer - first.odometer;
    const totalFuel = sorted.slice(1).reduce((acc, curr) => acc + Number(curr.liters), 0);

    if (totalFuel <= 0) return 0;

    return (totalDistance / totalFuel).toFixed(2);
};

export const calculateTotalSpent = (fuelEntries = [], serviceEntries = []) => {
    const fuelTotal = fuelEntries.reduce((acc, curr) => acc + Number(curr.totalCost || 0), 0);
    const serviceTotal = serviceEntries.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);
    return (fuelTotal + serviceTotal).toFixed(2);
};
export const calculateAllMileages = (entries) => {
    if (!entries || entries.length < 2) return [];

    // Sort by odometer chronological (ascending)
    const sorted = [...entries].sort((a, b) => a.odometer - b.odometer);
    const results = [];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const previous = sorted[i - 1];
        const distance = current.odometer - previous.odometer;
        const fuel = current.liters;

        if (fuel > 0) {
            results.push({
                date: current.date,
                mileage: (distance / fuel).toFixed(2)
            });
        }
    }

    // Return descending by date (most recent first)
    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const calculateDaysSinceLastService = (serviceEntries) => {
    if (!serviceEntries || serviceEntries.length === 0) return null;

    // Sort by date descending to get the most recent service
    const sorted = [...serviceEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastService = sorted[0];

    if (!lastService || !lastService.date) return null;

    const lastServiceDate = new Date(lastService.date);
    const today = new Date();

    // Calculate difference in milliseconds and convert to days
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
