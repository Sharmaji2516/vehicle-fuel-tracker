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

export const calculateTotalSpent = (entries) => {
    return entries.reduce((acc, curr) => acc + Number(curr.totalCost), 0).toFixed(2);
};
