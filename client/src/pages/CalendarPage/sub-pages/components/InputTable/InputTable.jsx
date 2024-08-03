import React, { useEffect, useState } from 'react';
import GridUI from './GridUI.jsx';
import DayTable from './DayTable.jsx';
import LVDate from '../../../../../models/LVDate.jsx';
import { getDaysInMonth, getMonthName, getDayName } from '../../utils/monthUtilities.jsx';
import './InputTable.css';

export default function InputTable({ data }) {
    if (data.appointments == null) {
        return null;
    }

    const [tables, setTables] = useState([]);

    useEffect(() => {
        const daysInMonth = getDaysInMonth(data.date.getFullYear(), data.date.getMonth());
        const monthName = getMonthName(data.date.getMonth());

        const generatedTables = Array.from({ length: daysInMonth }, (_, index) => {
            const dateNumber = index + 1;
            const date = new LVDate(data.date.getFullYear(), data.date.getMonth(), dateNumber);
            const dayName = getDayName(date);

            const appointmentsForDay = data.appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.begin_date);
                return appointmentDate.getDate() === dateNumber &&
                       appointmentDate.getMonth() === data.date.getMonth();
            });

            return (
                <DayTable
                    key={dateNumber}
                    monthName={monthName}
                    dayName={dayName}
                    dateNumber={dateNumber}
                    appointments={appointmentsForDay}
                />
            );
        });

        setTables(generatedTables);
    }, [data.fullDataUpdateTrigger]);

    return (
        <div className="parent-grid-container">
            <GridUI data={data} />
            <br />
            {tables.map((table, index) => (
                <div key={`table-${index}`} className="grid-item day-table">
                    {table}
                </div>
            ))}
        </div>
    );
}
