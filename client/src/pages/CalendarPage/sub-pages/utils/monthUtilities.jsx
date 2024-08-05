
import LVDate from "../../../../models/LVDate";

export function getMonthName(month) {
    const monthNames = [
        "Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs",
        "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
    ];
    return monthNames[month - 1];
}

// export const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
// }

export const getDaysOfMonth = (year, month) => {
    const days = [];
    var date = new LVDate(year, month, 1);
    var dayIndex = 1;

    while (date.getMonth() == month) {
        days.push(date);
        dayIndex++;
        date.setDate(dayIndex);
    }
    return days;
};

export const getDayName = (date) => {
    const dayNames = [
        "Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena",
        "Piektdiena", "Sestdiena", "Svētdiena"
    ];
    
    return dayNames[date.getDay()];
}