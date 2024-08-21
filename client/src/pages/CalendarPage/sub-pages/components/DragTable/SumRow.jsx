import React, { useState, useEffect, useContext } from 'react';

import GridLayout from 'react-grid-layout';

import LVDate from '../../../../../models/LVDate.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './SumRow.css';

export default function SumRow({ data, config }) {
    const [dateSums, setDateSums] = useState([]);
    const [totalSum, setTotalSum] = useState(0);

    // Helper function to check if an appointment occurs on a specific date
    const isAppointmentOnDate = (appointment, date) => {
        const appointmentStart = appointment.begin_date;
        const appointmentEnd = appointment.end_date;

        const dateObj = date.getObject();
        const appointmentStartDateObj = appointmentStart.getObject();
        const appointmentEndDateObj = appointmentEnd.getObject();

        return dateObj >= appointmentStartDateObj && dateObj <= appointmentEndDateObj;
    };

    useEffect(() => {
        if (!data.rooms) {
            setDateSums([]);
            setTotalSum(0);
        } else {
            const newHorizontalSums = config.dateLayout.map(dateItem => {
                const year = data.date.getFullYear();
                const month = data.date.getMonth();
                const date = new LVDate(year, month, dateItem.num);
    
                return Object.values(data.rooms).reduce((sum, room) => {
                    return sum + room.appointments.reduce((appointmentSum, appointment) => {
                        return appointmentSum + isAppointmentOnDate(appointment, date);
                    }, 0);
                }, 0);
            });

            setDateSums(newHorizontalSums);
    
            const finalHorizontalSums = newHorizontalSums.reduce((sum, dateSum) => sum + dateSum, 0);

            const finalVerticalSums = Object.values(data.rooms).reduce((sum, room) => {
                const roomSum = data.getSumOfAllAppointmentDays(room.id);
                return sum + roomSum;
            }, 0);

            setTotalSum(finalHorizontalSums + finalVerticalSums);
        }
    }, [data.fullDataUpdateTrigger, data.singleDataUpdateTrigger]);

    const postDateColumnsStart = config.getDateColumnsEnd() + 1;

    return (
        <GridLayout
            className="sum-row"
            layout={[
                { 
                    i: 'room-gap', 
                    x: 0, 
                    y: 0, 
                    w: config.columnWidths[0], 
                    h: 1, 
                    static: true 
                },
                ...config.dateLayout.map((item, index) => ({
                    ...item,
                    x: config.columnWidths.slice(0, index + 1).reduce((acc, width) => acc + width, 0),
                    y: 0,
                    w: config.columnWidths[index + 1],
                    h: 1,
                    static: true
                })),
                { 
                    i: 'sum-gap', 
                    x: postDateColumnsStart,
                    y: 0, 
                    w: config.columnWidths[config.columnWidths.length - 2], 
                    h: 1, 
                    static: true 
                },
                { 
                    i: 'delete-gap', 
                    x: postDateColumnsStart + config.columnWidths[config.columnWidths.length - 2],
                    y: 0, 
                    w: config.columnWidths[config.columnWidths.length - 1], 
                    h: 1, 
                    static: true 
                }
            ]}
            cols={config.cols}
            rowHeight={config.rowHeight}
            width={config.width}
            isDraggable={false}
            isResizable={false}
        >
            <div key="room-gap"></div>

            {config.dateLayout.map((item, index) => (
                <div key={item.i}>
                    {dateSums[index]}
                </div>
            ))}
            
            <div key="sum-gap">{totalSum}</div>
            <div key="delete-gap"></div>
        </GridLayout>
    );
}

