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
            {/* <ColumnRow
                config={config}
            /> */}
            {/* {preparedRooms.map((room, roomIndex) => (
                <div key={`room-${room.id_room}`} className="grid-cell" style={{ gridColumn: `span ${sumOfAllColWidths}` }}>
                    <EventRow
                        room={room}
                        width={width}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                        columnWidths={columnWidths}
                        sumOfAllColWidths={sumOfAllColWidths}
                    />
                </div>
            ))} */}
            {/* <SumRow 
                dateLayout={dateLayout} 
                width={width} 
                columnWidths={columnWidths} 
                sumOfAllColWidths={sumOfAllColWidths} 
                rooms={rooms} 
            /> */}
        </div>
    );
}
