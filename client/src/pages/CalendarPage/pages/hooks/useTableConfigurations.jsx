import { useMemo } from 'react';

import LVDate from '../../../../models/LVDate.jsx';

export default function useTableConfigurations (date) {
    const getDaysOfMonth = (year, month) => {
        const days = [];
        var date = new LVDate(year, month, 1);
        var dayIndex = 1;

        while (date.getMonth() == month) {
            days.push(date);
            dayIndex++;
            date.setDay(dayIndex);
        }
        return days;
    };

    const daysOfMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
    const columnWidths = [4, 4, ...daysOfMonth.map(() => 1), 3, 4];

    const dateLayout = daysOfMonth.map((day, index) => ({
        i: `day-${index + 1}`, 
        x: index + 8, // Adjusting for fixed columns
        y: 0,
        w: 1,
        h: 1,
        static: true,
        num: index + 1
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