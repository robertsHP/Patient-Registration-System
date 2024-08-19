import { useMemo } from 'react';

import { getDaysOfMonth } from '../utils/monthUtilities.jsx';
import LVDate from '../../../../models/LVDate.jsx';

export default function useTableConfigurations (date) {
    const daysOfMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
    const columnWidths = [4, ...daysOfMonth.map(() => 1), 1, 5];

    const dateLayout = daysOfMonth.map((day, index) => ({
        i: `day-${index + 1}`, 
        x: index + 4, // Adjusting for fixed columns
        y: 0,
        w: 1,
        h: 1,
        static: true,
        num: index + 1
    }));

    const getDateColumnsStart = () => {
        return columnWidths.slice(0, 1).reduce((acc, width) => acc + width, 0);
    };

    const getDateColumnsEnd = () => {
        const dateColumnsStart = getDateColumnsStart();

        return dateColumnsStart + columnWidths.slice(1, columnWidths.length - 2)
            .reduce((acc, width) => acc + width, 0);
    };

    const getSumOfAllColumns = () => {
        return columnWidths.reduce((acc, width) => acc + width, 0);
    };

    return {
        cols: getSumOfAllColumns(),
        rowHeight: 20,
        width: 1200,

        daysOfMonth,
        dateLayout,
        columnWidths,

        getDateColumnsStart,
        getDateColumnsEnd,
        getSumOfAllColumns
    };
};