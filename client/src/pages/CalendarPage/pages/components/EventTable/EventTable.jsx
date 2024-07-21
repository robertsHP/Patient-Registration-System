import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import useTableConfigurations from '../../hooks/useTableConfigurations.jsx';

import GridUI from './GridUI.jsx';
import ColumnRow from './ColumnRow.jsx';
import EventRow from './EventRow.jsx';
import SumRow from './SumRow.jsx';
import EventInputForm from './EventInputForm.jsx';

import { LayoutProvider } from '../../contexts/LayoutContext.jsx';

import Test from './Test.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventTable.css';

export default function EventTable({ data }) {
    const config = useTableConfigurations(data.date);
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <LayoutProvider>
            <div className="grid-container">
                <GridUI data={data} />
                <ColumnRow
                    config={config}
                />
                {data.rooms !== null && data.rooms.length !== 0 &&
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
        </LayoutProvider>
    );
}
