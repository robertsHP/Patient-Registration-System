import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventRow.css';

export default function EventRow({ room, events, nextEventId, setNextEventId, columnWidths }) {
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    const [localEvents, setLocalEvents] = useState(events);
    const [draggingEvent, setDraggingEvent] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const gridRef = useRef(null);

    const onLayoutChange = (layout) => {
        setLocalEvents(prevEvents => (
            prevEvents.map(event => {
                const newLayout = layout.find(l => l.i === String(event.i));
                if (newLayout) {
                    const overlappedEvent = prevEvents.find(e => e.i !== event.i && areOverlapping(e, newLayout));
                    if (!overlappedEvent && (newLayout.x <= event.x || newLayout.x + newLayout.w >= event.x + event.w)) {
                        return { ...event, ...newLayout, h: 1 }; // Ensure the height remains 1
                    }
                }
                return event;
            })
        ));
    };

    const areOverlapping = (event1, event2) => {
        return (
            event1.y === event2.y &&
            !(event1.x + event1.w <= event2.x || event2.x + event2.w <= event1.x)
        );
    };

    const onMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle') || e.target.closest('.event')) {
            return; // Ignore mousedown on resize handles or event names
        }

        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = gridRect.width / sumOfAllColWidths; // Dynamic calculation based on grid width
        const x = Math.floor((e.clientX - gridRect.left) / colWidth);

        setDraggingEvent({
            i: `event-temp`,
            x: x,
            y: 0,
            w: 1,
            h: 1,
            title: 'New Event',
            startX: x
        });

        setIsCreatingEvent(true);
    };

    const onMouseMove = (e) => {
        if (isCreatingEvent && draggingEvent) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = gridRect.width / sumOfAllColWidths; // Dynamic calculation based on grid width
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - draggingEvent.startX) + 1;
            const newX = Math.min(draggingEvent.startX, currentX);

            setDraggingEvent(prevEvent => ({
                ...prevEvent,
                x: newX,
                w: newWidth
            }));
        }
    };

    const onMouseUp = () => {
        if (isCreatingEvent && draggingEvent) {
            const newEvent = { ...draggingEvent, i: nextEventId, x: Number(draggingEvent.x), y: Number(draggingEvent.y), w: Number(draggingEvent.w), h: 1 };
            setLocalEvents(prevEvents => [
                ...prevEvents,
                newEvent
            ]);
            setDraggingEvent(null);
            setIsCreatingEvent(false);
            setNextEventId(prevId => prevId + 1);
        }
    };

    // Calculate the starting position for the additional columns
    const lastColumnStart = columnWidths.slice(0, columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

    return (
        <div
            ref={gridRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{ position: 'relative' }}
        >
            <GridLayout
                className="layout"
                layout={[
                    { i: `room-input-${room.id}`, x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
                    { i: `name-input-${room.id}`, x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
                    // Dynamic events
                    ...localEvents.map((event) => ({
                        ...event,
                        i: String(event.i),
                        h: 1, // Ensuring height is set correctly
                        x: event.x < columnWidths[0] + columnWidths[1] ? columnWidths[0] + columnWidths[1] : event.x, // Prevent overlap with inputs
                    })),
                    // New event in progress
                    ...(draggingEvent ? [{ ...draggingEvent, h: 1, x: draggingEvent.x < columnWidths[0] + columnWidths[1] ? columnWidths[0] + columnWidths[1] : draggingEvent.x }] : []),
                    // Add additional columns
                    { i: 'additional-input-1', x: lastColumnStart, y: 0, w: columnWidths[columnWidths.length - 2], h: 1, static: true },
                    { i: 'additional-input-2', x: lastColumnStart + columnWidths[columnWidths.length - 2], y: 0, w: columnWidths[columnWidths.length - 1], h: 1, static: true }
                ]}
                cols={sumOfAllColWidths}
                rowHeight={50}
                width={1000}
                onLayoutChange={onLayoutChange}
                isDraggable
                isResizable
                draggableHandle=".event"
                resizeHandles={['e', 'w']}
            >
                <div key={`room-input-${room.id}`} className="grid-cell">
                    <input type="text" defaultValue={room.name} style={{ width: '100%' }} />
                </div>

                <div key={`name-input-${room.id}`} className="grid-cell">
                    <input type="text" defaultValue={room.patient} style={{ width: '100%' }} />
                </div>

                {/* Render events */}
                {localEvents.map(event => (
                    <div className="event" key={event.i}>
                        <div className="event-name no-select">{event.title}</div> {/* Apply no-select class here */}
                    </div>
                ))}

                {/* New event in progress */}
                {draggingEvent && (
                    <div className="event" key={draggingEvent.i}>
                        <div className="event-name no-select">{draggingEvent.title}</div> {/* Apply no-select class here */}
                    </div>
                )}

                {/* Additional column inputs */}
                <div key="additional-input-1" className="grid-cell">
                    <input type="text" defaultValue={1} style={{ width: '100%' }} />
                </div>
                <div key="additional-input-2" className="grid-cell">
                    <input type="text" defaultValue={"T"} style={{ width: '100%' }} />
                </div>
            </GridLayout>
        </div>
    );
}