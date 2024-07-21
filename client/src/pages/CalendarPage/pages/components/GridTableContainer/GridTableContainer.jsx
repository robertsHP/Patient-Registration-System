import React from 'react';

import DayTable from './DayTable';

import './GridTableContainer.css'; // Ensure to import the CSS file

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const getMonthName = (month) => {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
};

const getDayName = (year, month, day) => {
    return new Date(year, month, day).toLocaleString('default', { weekday: 'long' });
};

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
