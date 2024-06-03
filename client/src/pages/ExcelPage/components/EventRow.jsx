import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';

import Event from './Event';

export default function EventRow({ events, nextEventId, setNextEventId, rowHeights }) {
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

    const onGridMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle') || e.target.closest('.event-title')) {
            return; // Ignore mousedown on resize handles or event titles
        }

        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = gridRect.width / 31; // Assuming 31 columns for days
        const x = Math.floor((e.clientX - gridRect.left) / colWidth);

        setDraggingEvent({
            i: `event-temp`,
            x: x + 1, // Adjust for the "Name" column
            y: 0,
            w: 1,
            h: 1,
            title: 'New Event',
            startX: x
        });

        setIsCreatingEvent(true);
    };

    const onGridMouseMove = (e) => {
        if (isCreatingEvent && draggingEvent) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = gridRect.width / 31; // Assuming 31 columns for days
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - draggingEvent.startX) + 1;
            const newX = Math.min(draggingEvent.startX, currentX) + 1; // Adjust for the "Name" column

            setDraggingEvent(prevEvent => ({
                ...prevEvent,
                x: newX,
                w: newWidth
            }));
        }
    };

    const onGridMouseUp = () => {
        if (isCreatingEvent && draggingEvent) {
            const newEvent = { ...draggingEvent, i: nextEventId, x: Number(draggingEvent.x), y: Number(draggingEvent.y), w: Number(draggingEvent.w), h: 1 };
            setLocalEvents(prevEvents => [
                ...prevEvents,
                newEvent
            ]);
            setDraggingEvent(null);
            setIsCreatingEvent(false);
            setNextEventId(prevId => prevId + 1);
        } else {
            setDraggingEvent(null);
            setIsCreatingEvent(false);
        }
    };

    return (
        <div
            ref={gridRef}
            onMouseDown={onGridMouseDown}
            onMouseMove={onGridMouseMove}
            onMouseUp={onGridMouseUp}
            style={{ position: 'relative' }}
        >
            <GridLayout
                className="layout"
                layout={[
                    ...localEvents.map(event => ({ ...event, i: String(event.i), y: event.y + 1 })),
                    ...(draggingEvent ? [{ ...draggingEvent, i: String(draggingEvent.i), y: draggingEvent.y + 1 }] : [])
                ]}
                cols={31} // Assuming 31 columns for days
                rowHeight={50}
                width={1200}
                onLayoutChange={onLayoutChange}
                isDraggable
                isResizable
                draggableHandle=".event-title"
                resizeHandles={['e', 'w']}
            >
                {localEvents.map(event => (
                    <div key={event.i} style={{ height: rowHeights[event.y] }}>
                        <Event title={event.title} />
                    </div>
                ))}
                {draggingEvent && (
                    <div key={draggingEvent.i} style={{ height: rowHeights[draggingEvent.y] }}>
                        <Event title={draggingEvent.title} />
                    </div>
                )}
            </GridLayout>
        </div>
    );
}