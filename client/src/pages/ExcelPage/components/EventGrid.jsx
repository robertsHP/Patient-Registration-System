import React from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import EventRow from './EventRow';
import DayCell from './DayCell';

import './EventGrid.css';

export default function EventGrid({ layout, rooms, nextEventId, setNextEventId, rowHeights }) {
    return (
        <div className="event-grid">
            <div>
                <GridLayout
                    className="layout"
                    layout={layout.map((item, index) => ({ ...item, y: 0, h: rowHeights[index] / 50 }))}
                    cols={layout.length}
                    rowHeight={50}
                    width={1200}
                    isDraggable={false}
                    isResizable={false}
                >
                    {layout.map((item, index) => (
                        <div key={item.i} style={{ height: rowHeights[index] }}>
                            <DayCell date={item.date} />
                        </div>
                    ))}
                </GridLayout>
            </div>
            {Object.keys(rooms).map((roomId, roomIndex) => (
                <div key={roomIndex}>
                    <EventRow
                        events={rooms[roomId].events}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                        rowHeights={rowHeights}
                    />
                </div>
            ))}
        </div>
    );
}