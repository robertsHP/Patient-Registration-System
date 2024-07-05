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
        setLocalEvents(prevEvents =>
            prevEvents.map(event => {
                const newLayout = layout.find(l => l.i === String(event.i));
                if (newLayout && !isOverlapping(newLayout, prevEvents, event.i)) {
                    return { ...event, ...newLayout, h: 1 };
                }
                return event;
            })
        );
    };

    const isOverlapping = (newLayout, events, currentEventId) => {
        return events.some(event => event.i !== currentEventId && areOverlapping(event, newLayout));
    };

    const areOverlapping = (event1, event2) => {
        return event1.y === event2.y && !(event1.x + event1.w <= event2.x || event2.x + event2.w <= event1.x);
    };

    const isInDateColumns = (x, w) => {
        const dateColumnsStart = columnWidths.slice(0, 2).reduce((acc, width) => acc + width, 0);
        const dateColumnsEnd = dateColumnsStart + columnWidths.slice(2, columnWidths.length - 2).reduce((acc, width) => acc + width, 0);
        return x >= dateColumnsStart && (x + w) <= dateColumnsEnd;
    };

    const onMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle') || e.target.closest('.event')) return;

        const { hoveredCol } = calculateMousePosition(e);
        if (isInDateColumns(hoveredCol, 1)) startDraggingEvent(hoveredCol);
    };

    const onMouseMove = (e) => {
        if (isCreatingEvent && draggingEvent) {
            const { hoveredCol, newWidth } = calculateMousePosition(e, draggingEvent.startX);
            if (isInDateColumns(hoveredCol, newWidth) && !isOverlapping({ ...draggingEvent, x: hoveredCol, w: newWidth }, localEvents)) {
                updateDraggingEvent(hoveredCol, newWidth);
            }
        }
    };

    const onMouseUp = () => {
        if (isCreatingEvent && draggingEvent) {
            if (isInDateColumns(draggingEvent.x, draggingEvent.w) && !isOverlapping(draggingEvent, localEvents)) {
                const newEvent = { ...draggingEvent, i: nextEventId, x: Number(draggingEvent.x), y: Number(draggingEvent.y), w: Number(draggingEvent.w), h: 1 };
                setLocalEvents(prevEvents => [...prevEvents, newEvent]);
                setNextEventId(prevId => prevId + 1);
            }
            stopDraggingEvent();
        }
    };

    const calculateMousePosition = (e, startX = null) => {
        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = gridRect.width / sumOfAllColWidths;
        const hoveredCol = Math.floor((e.clientX - gridRect.left) / colWidth);
        const currentCol = startX !== null ? Math.floor((e.clientX - gridRect.left) / colWidth) : null;
        const newWidth = startX !== null ? Math.abs(currentCol - startX) + 1 : null;

        console.log('colWidth = '+colWidth);
        console.log('hoveredCol = '+hoveredCol);
        console.log('currentCol = '+currentCol);
        console.log('newWidth = '+newWidth);
        console.log('----------------------------------------------');

        return { hoveredCol, currentCol, newWidth };
    };

    const startDraggingEvent = (x) => {
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

    const updateDraggingEvent = (x, w) => {
        setDraggingEvent(prevEvent => ({
            ...prevEvent,
            x: x,
            w: w
        }));
    };

    const stopDraggingEvent = () => {
        setDraggingEvent(null);
        setIsCreatingEvent(false);
    };

    const lastColumnStart = columnWidths.slice(0, columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

    return (
        <div ref={gridRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} style={{ position: 'relative' }}>
            <GridLayout
                className="layout"
                layout={[
                    { i: `room-input-${room.id_room}`, x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
                    { i: `name-input-${room.id_room}`, x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
                    ...localEvents.map(event => ({
                        ...event,
                        i: String(event.i),
                        h: 1,
                        x: Math.max(event.x, columnWidths[0] + columnWidths[1]),
                    })),
                    ...(draggingEvent ? [{ ...draggingEvent, h: 1, x: Math.max(draggingEvent.x, columnWidths[0] + columnWidths[1]) }] : []),
                    { i: 'sum-column', x: lastColumnStart, y: 0, w: columnWidths[columnWidths.length - 2], h: 1, static: true },
                    { i: 'hotel-column', x: lastColumnStart + columnWidths[columnWidths.length - 2], y: 0, w: columnWidths[columnWidths.length - 1], h: 1, static: true }
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
                <div key={`room-input-${room.id_room}`} className="grid-cell">
                    <input type="text" defaultValue={room.room_num} style={{ width: '100%' }} />
                </div>

                <div key={`name-input-${room.id_room}`} className="grid-cell">
                    <input type="text" defaultValue={room.events[0]?.patient.pat_name} style={{ width: '100%' }} />
                </div>

                {localEvents.map(event => (
                    <div className="event" key={event.i}>
                        <div className="event-name no-select">{event.notes}</div>
                    </div>
                ))}

                {draggingEvent && (
                    <div className="event" key={draggingEvent.i}>
                        <div className="event-name no-select">{draggingEvent.title}</div>
                    </div>
                )}

                <div key="sum-column" className="grid-cell">
                    1
                </div>
                <div key="hotel-column" className="grid-cell">
                    <input type="text" defaultValue={"T"} style={{ width: '100%' }} />
                </div>
            </GridLayout>
        </div>
    );
}
