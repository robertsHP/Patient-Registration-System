import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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

    // Calculate the sum of all column widths
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    // Calculate the starting position for the additional columns
    const lastColumnStart = columnWidths.slice(0, columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

    return (
        <div className="grid-container">
            <GridLayout
                className="layout"
                layout={[
                    { i: 'room-column', x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
                    { i: 'name-column', x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
                    ...dateLayout.map((item, index) => ({
                        ...item,
                        x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                        y: 0,
                        w: columnWidths[index + 2],
                        h: 1,
                    })),
                    // Add the two additional columns at the end
                    { i: 'sum-column', x: lastColumnStart, y: 0, w: columnWidths[columnWidths.length - 2], h: 1, static: true },
                    { i: 'hotel-column', x: lastColumnStart + columnWidths[columnWidths.length - 2], y: 0, w: columnWidths[columnWidths.length - 1], h: 1, static: true }
                ]}
                cols={sumOfAllColWidths}
                rowHeight={30}
                width={1000}
                isDraggable={false}
                isResizable={false}
            >
                <div key="room-column" className="grid-cell header">Telpa</div>
                <div key="name-column" className="grid-cell header">Vārds</div>
                {dateLayout.map((item) => (
                    <div key={item.i} className="grid-cell">
                        {item.date.getDate()}
                    </div>
                ))}
                {/* Add the new column divs */}
                <div key="sum-column" className="grid-cell header"></div>
                <div key="hotel-column" className="grid-cell header">Viesnīca</div>
            </GridLayout>
            
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
