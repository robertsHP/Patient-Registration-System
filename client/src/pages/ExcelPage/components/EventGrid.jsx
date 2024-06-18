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

// Sākotnējo datu uzstādīšanas funkcija
const initialData = (year, month) => {
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

    // Sākotnējā iestatīšana telpām un to notikumiem
    return {
        layout,
        rooms: {
            'Room 1': {
                name: 'John Doe',
                events: [
                    { i: 'event-0', x: 0, y: 1, w: 3, h: 1, title: 'Event 1', date: new Date(year, month, 1) }
                ]
            },
            'Room 2': {
                name: 'Jane Smith',
                events: [
                    { i: 'event-0', x: 0, y: 1, w: 3, h: 1, title: 'Event 2', date: new Date(year, month, 1) }
                ]
            }
        }
    };
};

// Galvenā Grid komponenta funkcija
export default function EventGrid({ year, month }) {
    // Stāvoklis grid datu glabāšanai
    const [data] = useState(initialData(year, month));
    // Stāvoklis, lai pārvaldītu nākamo pieejamo notikumu ID
    const [nextEventId, setNextEventId] = useState(2); // Sākas ar 2, jo event-0 jau ir
    // Stāvoklis, lai glabātu rindas augstumus, pamatojoties uz notikumu skaitu dienā
    const [rowHeights, setRowHeights] = useState([]);
    const [columnWidths, setColumnWidths] = useState(
        [4, 4, ...data.layout.map(() => 1)]
    );

    var width = columnWidths.reduce((acc, width) => acc + width, 0);

    // Efekts, lai aprēķinātu rindas augstumus, pamatojoties uz pārklājošiem notikumiem katrai dienai
    useEffect(() => {
        const calculateRowHeights = () => {
            const heights = data.layout.map(day => {
                let maxHeight = 1;
                // Pārbauda katru telpu un tās notikumus
                Object.values(data.rooms).forEach(room => {
                    const overlappingEvents = room.events.filter(event => event.date.getTime() === day.date.getTime());
                    if (overlappingEvents.length > maxHeight) {
                        maxHeight = overlappingEvents.length;
                    }
                });
                return maxHeight * 50; // Pieņemot, ka katrs notikums aizņem 50px augstumu
            });
            setRowHeights(heights);
        };
        calculateRowHeights();
    }, [data]);

    const layout = [
        { i: 'room-column', x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
        { i: 'name-column', x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
        ...data.layout.map((item, index) => ({
            ...item,
            x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
            y: 0,
            w: columnWidths[index + 2],
            h: 1,
        }))
    ];
 
    return (
        <div className="grid-container">
            <GridLayout
                className="layout"
                layout={layout}
                cols={width}
                rowHeight={30}
                width={1000}
                isDraggable={false}
                isResizable={false}
            >
                <div key="room-column" className="grid-cell header">Room</div>
                <div key="name-column" className="grid-cell header">Name</div>
                {data.layout.map((item) => (
                    <div key={item.i} className="grid-cell">
                        {item.date.getDate()}
                    </div>
                ))}
            </GridLayout>
            
            {Object.keys(data.rooms).map((roomId, roomIndex) => (
                <div
                    key={`room-${roomIndex}`} 
                    className="grid-cell"
                    style={{ gridColumn: `span ${columnWidths[roomId] || 4}` }}  // Adjust to the width specified
                >
                    <EventRow
                        room={data.rooms[roomId]}
                        events={data.rooms[roomId].events}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                        columnWidths={columnWidths}
                        rowHeights={rowHeights}
                    />
                </div>
            ))}
        </div>
    );
}