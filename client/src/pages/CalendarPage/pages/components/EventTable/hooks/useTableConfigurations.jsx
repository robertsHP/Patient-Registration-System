import { useMemo } from 'react';

export default function useTableConfigurations (date) {
    const getDaysOfMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const daysOfMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
    const columnWidths = [4, 4, ...daysOfMonth.map(() => 1), 1, 4];
    const dateLayout = daysOfMonth.map((day, index) => ({
        i: `day-${index}`, 
        x: index + 8, // Adjusting for fixed columns
        y: 0,
        w: 1,
        h: 1,
        static: true,
        num: day.getDate()
    }));
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    return {
        cols: sumOfAllColWidths,
        rowHeight: 20,
        width: 1200,

        daysOfMonth: daysOfMonth,
        dateLayout: dateLayout,
        columnWidths: columnWidths
    };
};