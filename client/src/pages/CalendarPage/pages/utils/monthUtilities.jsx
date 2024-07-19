

export function getMonthName(month) {
    const monthNames = [
        "Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs",
        "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
    ];
    return monthNames[month - 1];
}