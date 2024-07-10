import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import useTableConfigurations from './hooks/useTableConfigurations.jsx';

import ColumnRow from './ColumnRow';
import EventRow from './EventRow';
import SumRow from './SumRow';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventTable.css';

export default function EventTable({ data }) {
    const config = useTableConfigurations(data.date);

    const [nextEventId, setNextEventId] = useState(
        data.rooms.flatMap(room => room.events.map(event => event.id_event)).length
    );

    return (
        <div className="grid-container">
            <ColumnRow
                config={config}
            />
            {data.rooms.map((room, roomIndex) => (
                ///LOOOOOK AT THIIIIISSSSSSZZZZ (pārvilkšanas kļūda)
                <div key={`room-${room.id_room}`} className="grid-cell" style={{ gridColumn: `span ${config.cols}` }}>
                    <EventRow
                        config={config}
                        room={room}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                    />
                </div>
            ))}
            <SumRow 
                config={config}
                rooms={data.rooms} 
            />
        </div>
    );
}
