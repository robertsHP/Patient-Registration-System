import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ColumnRow from './ColumnRow';
import EventRow from './EventRow';

import './EventGrid.css';

// Palīgfunkcija, lai iegūtu visas dienas konkrētajā mēnesī un gadā
const getMonthDays = (year, month) => {
    const date = new Date(year, month, 1); // Sākas ar pirmo mēneša dienu
    const days = [];
    // Cikls cauri katrai mēneša dienai un pievienošana dienu masīvam
    while (date.getMonth() === month) {
        days.push(new Date(date)); // Klonē datuma objektu, lai izvairītos no atsauces problēmām
        date.setDate(date.getDate() + 1); // Pāriet uz nākamo dienu
    }
    return days;
};

const getDateLayout = (year, month) => {
    const layout = [];
    // Izveido izkārtojuma ierakstu katrai mēneša dienai
    getMonthDays(year, month).forEach((day, index) => {
        layout.push({ 
            i: `day-${index}`, 
            x: index,
            y: 0,
            w: 1, // Platums (1 grid vienība)
            h: 1, // Augstums (1 grid vienība)
            static: true, // Padara dienas šūnu statisku (nepārvietojamu)
            date: day // Saglabā datuma objektu
        });
    });
    return layout;
}

// Sākotnējo datu uzstādīšanas funkcija
const initialData = (year, month) => {
    // Sākotnējā iestatīšana telpām un to notikumiem
    return {
        ...getDateLayout(year, month),
        rooms: [
            {
                name: 'Room 1',
                patient: 'John Doe',
                events: [
                    { i: 'event-0', x: 0, y: 1, w: 3, h: 1, title: 'Event 1', date: new Date(year, month, 1) }
                ]
            },
            {
                name: 'Jane Smith',
                patient: 'Jane Smith',
                events: [
                    { i: 'event-0', x: 0, y: 1, w: 3, h: 1, title: 'Event 2', date: new Date(year, month, 1) }
                ]
            }
        ]
    };
};

export default function EventGrid({ date, setDate, dataStorage, setDataStorage }) {



    const [data] = useState(initialData(date.getFullYear(), date.getMonth() + 1));
    const [dateLayout, setDateLayout] = useState(getDateLayout(date.getFullYear(), date.getMonth() + 1));
    const [nextEventId, setNextEventId] = useState(2); // Starts with 2 because event-0 already exists

    const [columnWidths, setColumnWidths] = useState(
        [4, 4, ...dateLayout.map(() => 1), 1, 4] // Two additional columns at the end with widths 4 each
    );

    

    return (
        <div className="grid-container">
            <ColumnRow
                dateLayout={dateLayout}
                columnWidths={columnWidths}
            />
            {Object.keys(data.rooms).map((roomId, roomIndex) => (
                <div
                    key={`room-${roomIndex}`} 
                    className="grid-cell"
                    style={{ gridColumn: `span ${columnWidths[roomId] || 4}` }}
                >
                    <EventRow
                        room={data.rooms[roomId]}
                        events={data.rooms[roomId].events}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                        columnWidths={columnWidths}
                    />
                </div>
            ))}
        </div>
    );
}
