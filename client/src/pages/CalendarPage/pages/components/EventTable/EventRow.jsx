import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventRow.css';

export default function EventRow({ config, room, nextEventId, setNextEventId }) {
    const [localEvents, setLocalEvents] = useState(room.events);
    const [draggingEvent, setDraggingEvent] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const gridRef = useRef(null);

    const lastColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

    const isValidEventPosition = (layoutItem) => {
        const dateColumnsStart = config.columnWidths.slice(0, 2).reduce((acc, width) => acc + width, 0);
        const dateColumnsEnd = config.columnWidths.slice(2, config.columnWidths.length - 2).reduce((acc, width) => acc + width, dateColumnsStart);

        // Ensure the event is within date columns
        return (
            layoutItem.x >= dateColumnsStart &&
            (layoutItem.x + layoutItem.w) <= dateColumnsEnd
        );
    };

    const isOverlapping = (newLayout, events, currentEventId) => {
        const overlapping = (event1, event2) => {
            // Check if y-coordinates are the same
            if (event1.y !== event2.y) {
                return false;
            }
        
            // Check if both the starts and ends of the events overlap
            const start1 = event1.x;
            const end1 = event1.x + event1.w;
            const start2 = event2.x;
            const end2 = event2.x + event2.w;
        
            // Check for overlap: either event2 starts within event1 or event1 starts within event2
            const startsOverlap = (start1 >= start2 && start1 <= end2) || (start2 >= start1 && start2 <= end1);
            // Check for overlap: either event2 ends within event1 or event1 ends within event2
            const endsOverlap = (end1 >= start2 && end1 <= end2) || (end2 >= start1 && end2 <= end1);
        
            return startsOverlap && endsOverlap;
        };

        return events.some(
            event => event.i !== currentEventId && overlapping(event, newLayout)
        );
    };

    const isInDateColumns = (x, w) => {
        const dateColumnsStart = config.columnWidths.slice(0, 2).reduce((acc, width) => acc + width, 0);
        const dateColumnsEnd = dateColumnsStart + config.columnWidths.slice(2, config.columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

        return x >= dateColumnsStart && (x + w) <= dateColumnsEnd;
    };

    const onLayoutChange = (layout) => {
        setLocalEvents(prevEvents =>
            prevEvents.map(event => {
                const newLayout = layout.find(l => l.i === String(event.i));
    
                if (newLayout) {
                    const validPosition = isValidEventPosition(newLayout);
                    const notOverlapping = !isOverlapping(newLayout, prevEvents, event.i);
    
                    if (validPosition && notOverlapping) {
                        return { ...event, ...newLayout, h: 1 };
                    }
                }
                return event;
            })
        );
    };

    const onMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle') || e.target.closest('.event')) {
            return; // Ignore mousedown on resize handles or event names
        }

        console.log('onMouseDown');
        
        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = config.width / config.cols; // Dynamic calculation based on grid width
        const x = Math.floor((e.clientX - gridRect.left) / colWidth);

        if (isInDateColumns(x, 1)) {
            setDraggingEvent({
                i: 'event-temp',
                x: x,
                y: 0,
                w: 1,
                h: 1,
                title: 'New Event',
                startX: x
            });

            setIsCreatingEvent(true);
        }
    };

    const onMouseMove = (e) => {
        if (isCreatingEvent && draggingEvent) {
            console.log('onMouseMove');

            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = config.width / config.cols;
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - draggingEvent.startX) + 1;
            const newX = Math.min(draggingEvent.startX, currentX);

            if (isInDateColumns(newX, newWidth)) {
                setDraggingEvent(prevEvent => ({
                    ...prevEvent,
                    x: newX,
                    w: newWidth
                }));
            }
        }
    };

    const onMouseUp = () => {
        if (isCreatingEvent && draggingEvent) {
            console.log('onMouseUp');

            var inDateColumns = isInDateColumns(draggingEvent.x, draggingEvent.w);
            var overlapping = isOverlapping(draggingEvent, localEvents, 'event-temp');

            if (inDateColumns && !overlapping) {
                const newEvent = { 
                    ...draggingEvent, 
                    i: nextEventId, 
                    x: Number(draggingEvent.x), 
                    y: Number(draggingEvent.y), 
                    w: Number(draggingEvent.w), 
                    h: 1 
                };
                setLocalEvents(prevEvents => [...prevEvents, newEvent]);
                setNextEventId(prevId => prevId + 1);
            }
            setDraggingEvent(null);
            setIsCreatingEvent(false);
        }
    };

    return (
        <div 
            ref={gridRef} 
            onMouseDown={onMouseDown} 
            onMouseMove={onMouseMove} 
            onMouseUp={onMouseUp}
        >
            <GridLayout
                className="layout"
                layout={[
                    { 
                        i: `room-input-${room.id_room}`, 
                        x: 0, 
                        y: 0, 
                        w: 
                        config.columnWidths[0], 
                        h: 1, 
                        static: true 
                    },
                    { 
                        i: `name-input-${room.id_room}`, 
                        x: config.columnWidths[0], 
                        y: 0, 
                        w: config.columnWidths[1], 
                        h: 1, 
                        static: true 
                    },
                    ...localEvents.map(event => ({
                        ...event,
                        i: String(event.i),
                        h: 1,
                        x: Math.min(Math.max(
                            event.x, 
                            config.columnWidths[0] + config.columnWidths[1]), 
                            lastColumnStart - event.w
                        ),
                    })),
                    ...(draggingEvent ? [
                        { 
                            ...draggingEvent, 
                            h: 1, 
                            x: Math.min(Math.max(draggingEvent.x, config.columnWidths[0] + config.columnWidths[1]), 
                            lastColumnStart - draggingEvent.w) 
                        }
                    ] : []),
                    { 
                        i: 'sum-value', 
                        x: lastColumnStart, 
                        y: 0, 
                        w: config.columnWidths[config.columnWidths.length - 2], 
                        h: 1, 
                        static: true 
                    },
                    { 
                        i: 'hotel-input', 
                        x: lastColumnStart + config.columnWidths[config.columnWidths.length - 2], 
                        y: 0, w: config.columnWidths[config.columnWidths.length - 1], 
                        h: 1, 
                        static: true 
                    }
                ]}
                cols={config.cols}
                rowHeight={config.rowHeight}
                width={config.width}
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

                <div key="sum-value" className="grid-cell">
                    1
                </div>
                <div key="hotel-input" className="grid-cell">
                    <input type="text" defaultValue={"T"} style={{ width: '100%' }} />
                </div>
            </GridLayout>
        </div>
    );
}
