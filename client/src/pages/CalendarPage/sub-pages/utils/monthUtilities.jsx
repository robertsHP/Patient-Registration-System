

export function getMonthName(month) {
    const monthNames = [
        "Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs",
        "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
    ];
    return monthNames[month - 1];
}

export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
}

export const getDayName = (date) => {
    const dayNames = [
        "Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena",
        "Piektdiena", "Sestdiena", "Svētdiena"
    ];
    return dayNames[date.getDay()];
}