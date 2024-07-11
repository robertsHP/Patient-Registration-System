import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import useTableConfigurations from './hooks/useTableConfigurations.jsx';

import ColumnRow from './ColumnRow';
import EventRow from './EventRow';
import SumRow from './SumRow';


import Test from './Test';


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
                <div key={`room-${roomIndex}`} className="grid-cell" style={{ gridColumn: `span ${config.cols}` }}>
                    <EventRow
                        data={data}
                        roomIndex={roomIndex}
                        config={config}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                    />
                </div>
            ))}
            <SumRow 
                data={data}
                config={config}
            />
            {/* <Test /> */}
        </div>
    );
}
