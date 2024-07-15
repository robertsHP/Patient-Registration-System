import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import useTableConfigurations from '../../hooks/useTableConfigurations.jsx';

import EventInputForm from './EventInputForm';

import ColumnRow from './ColumnRow';
import EventRow from './EventRow';
import SumRow from './SumRow';

import Test from './Test';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventTable.css';

export default function EventTable({ data }) {
    const config = useTableConfigurations(data.date);
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <div className="grid-container">
            <ColumnRow
                config={config}
            />
            {data.rooms.length !== 0 &&
                data.rooms.map((room) => 
                    room && (
                        <div key={`room-${room.id}`} className="grid-cell" style={{ gridColumn: `span ${config.cols}` }}>
                            <EventRow
                                data={data}
                                roomID={room.id}
                                config={config}
                                selectedEvent={selectedEvent}
                                setSelectedEvent={setSelectedEvent}
                            />
                        </div>
                    )
                )
            }
            <SumRow 
                data={data}
                config={config}
            />
            {selectedEvent && <EventInputForm 
                selectedEvent={selectedEvent} 
                setSelectedEvent={setSelectedEvent} 
            />}
            {/* <Test /> */}
        </div>
    );
}
