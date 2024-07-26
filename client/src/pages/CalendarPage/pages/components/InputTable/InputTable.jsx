import React from 'react';

import DayTable from './DayTable.jsx';

import { getDaysInMonth, getMonthName, getDayName } from '../../utils/monthUtilities.jsx';

import './GridTableContainer.css'; // Ensure to import the CSS file

export default function GridTableContainer({ year, month }) {
    const daysInMonth = getDaysInMonth(year, month);
    const monthName = getMonthName(month);

    const tables = Array.from({ length: daysInMonth }, (_, index) => {
        const dayName = getDayName(year, month, index + 1);
        const dayNumber = index + 1;
        return <DayTable key={index} monthName={monthName} dayName={dayName} dayNumber={dayNumber} />;
    });

    return (
        <div className="parent-grid-container">
            {tables.map((table, index) => (
                <div key={`table-${index}`} className="grid-item day-table">
                    {table}
                </div>
            ))}
        </div>
    );
}
