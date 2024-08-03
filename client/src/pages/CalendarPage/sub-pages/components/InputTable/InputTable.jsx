import React, { useEffect, useState } from 'react';

import GridUI from './GridUI.jsx';
import DayTable from './DayTable.jsx';
import LVDate from '../../../../../models/LVDate.jsx';

import { getDaysInMonth, getMonthName, getDayName } from '../../utils/monthUtilities.jsx';

import './InputTable.css';

export default function InputTable({ data }) {
    const [tables, setTables] = useState([]);
    const [appointmentsByDay, setAppointmentsByDay] = useState([]);

    useEffect(() => {
        if (data.appointments != null) {
            const daysInMonth = getDaysInMonth(data.date.getFullYear(), data.date.getMonth());
            const monthName = getMonthName(data.date.getMonth());

            const tempAppointmentsByDay = [];

            const generatedTables = Array.from({ length: daysInMonth }, (_, index) => {
                const dateNumber = index + 1;
                const date = new LVDate(data.date.getFullYear(), data.date.getMonth(), dateNumber);
                const dayName = getDayName(date);

                const appointmentsForDay = data.appointments.filter(appointment => {
                    appointment.begin_date = new LVDate(appointment.begin_date).getObject();
                    return appointment.begin_date.getDate() === dateNumber;
                });

                // Collect the appointments for the day in the temporary object
                tempAppointmentsByDay[index] = appointmentsForDay;

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

            // Set the state once after the loop
            setAppointmentsByDay(tempAppointmentsByDay);
            setTables(generatedTables);
        }
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
