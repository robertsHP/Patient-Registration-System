import React, { useState } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ColumnGrid from './ColumnGrid/ColumnGrid';
import EventGrid from './EventGrid/EventGrid';

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
        events: [
            { i: 'event-0', x: 0, y: 1, w: 3, h: 1, title: 'Event 1' }
        ]
    };
};

export default function Grid({ year, month }) {
    const [data] = useState(initialData(year, month));
    const [nextEventId, setNextEventId] = useState(1);

    return (
        <div>
            <ColumnGrid 
                data={data}
            />
            <EventGrid 
                initialEvents={data.events}
                nextEventId={nextEventId}
                setNextEventId={setNextEventId}
            />
        </div>
    );
}