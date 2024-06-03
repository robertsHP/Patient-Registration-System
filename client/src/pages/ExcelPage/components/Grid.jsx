import React, { useState, useEffect } from 'react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import EventGrid from './EventGrid';
import NameColumn from './NameColumn';
import RoomColumn from './RoomColumn';

import './Grid.css';

const getMonthDays = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

const initialData = (year, month) => {
    const layout = [];
    getMonthDays(year, month).forEach((day, index) => {
        layout.push({ i: `day-${index}`, x: index, y: 0, w: 1, h: 1, static: true, date: day });
    });

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
                events: []
            }
        }
    };
};

export default function Grid({ year, month }) {
    const [data] = useState(initialData(year, month));
    const [nextEventId, setNextEventId] = useState(2); // Start with 2 since event-0 is already present
    const [rowHeights, setRowHeights] = useState([]);

    useEffect(() => {
        const calculateRowHeights = () => {
            const heights = data.layout.map(day => {
                let maxHeight = 1;
                Object.values(data.rooms).forEach(room => {
                    const overlappingEvents = room.events.filter(event => event.date.getTime() === day.date.getTime());
                    if (overlappingEvents.length > maxHeight) {
                        maxHeight = overlappingEvents.length;
                    }
                });
                return maxHeight * 50; // Assuming each event takes 50px height
            });
            setRowHeights(heights);
        };

        calculateRowHeights();
    }, [data]);

    return (
        <div className="grid-container">
            <RoomColumn rooms={data.rooms} rowHeights={rowHeights} />
            <NameColumn rooms={data.rooms} rowHeights={rowHeights} />
            <EventGrid 
                layout={data.layout}
                rooms={data.rooms}
                nextEventId={nextEventId}
                setNextEventId={setNextEventId}
                rowHeights={rowHeights}
            />
        </div>
    );
}