import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';

import './EventRow.css';

export default function EventRow({ room, events, nextEventId, setNextEventId, columnWidths, rowHeights }) {
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    const [localEvents, setLocalEvents] = useState(events);
    const [newEvents, setNewEvents] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const gridRef = useRef(null);

    const isOverlapping = (event1, event2) => {
        return (
            event1.y === event2.y &&
            !(event1.x + event1.w <= event2.x || event2.x + event2.w <= event1.x)
        );
    };

    const onLayoutChange = (layout) => {
        setLocalEvents((prevEvents) => 
            prevEvents.map((event) => {
                // Atrodam jauno izkārtojuma īpašību šim notikumam
                const newLayout = layout.find((l) => l.i === String(event.i));
    
                if (newLayout) {
                    // Pārbaudām, vai ir kāds pārklājošs notikums
                    const overlappedEvent = prevEvents.find(
                        (e) => e.i !== event.i && isOverlapping(e, newLayout)
                    );
    
                    // Ja nav pārklāšanās un jaunā pozīcija ir pieļaujamajos robežās
                    var inBounds = newLayout.x <= event.x || newLayout.x + newLayout.w >= event.x + event.w;
                    if (!overlappedEvent && inBounds) {
                        // Atjauninām notikuma izkārtojumu, bet saglabājam augstumu kā 1
                        return { ...event, ...newLayout, h: 1 };
                    }
                }
    
                // Atgriežam notikumu nemainītu, ja izmaiņas nav nepieciešamas
                return event;
            })
        );
    };

    const onGridMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle') || e.target.closest('.event-title')) {
            return; // Ignore mousedown on resize handles or event titles
        }

        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = gridRect.width / 31; // Assuming 31 columns for days
        const x = Math.floor((e.clientX - gridRect.left) / colWidth);

        setNewEvents({
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
        if (isCreatingEvent && newEvents) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = gridRect.width / 31; // Assuming 31 columns for days
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - newEvents.startX) + 1;
            const newX = Math.min(newEvents.startX, currentX) + 1; // Adjust for the "Name" column

            setNewEvents(prevEvent => ({
                ...prevEvent,
                x: newX,
                w: newWidth
            }));
        }
    };

    const onGridMouseUp = () => {
        if (isCreatingEvent && newEvents) {
            const newEvent = { 
                ...newEvent, 
                i: nextEventId, 
                x: Number(newEvent.x), 
                y: Number(newEvent.y), 
                w: Number(newEvent.w), 
                h: 1 
            };
            setLocalEvents(prevEvents => [
                ...prevEvents,
                newEvent
            ]);
            setNewEvents(null);
            setIsCreatingEvent(false);
            setNextEventId(prevId => prevId + 1);
        } else {
            setNewEvents(null);
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
                    { i: 'room-input', x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
                    { i: 'name-input', x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
                    ...localEvents.map((event, index) => ({
                            ...event, 
                            i: String(event.i), 
                            x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                            y: event.y + 1,
                            // w: columnWidths[index + 2],
                            h: 1
                    })),
                    // ...(newEvents ? [
                    //     { 
                    //         ...newEvents, 
                    //         i: String(newEvents.i), 
                    //         x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                    //         y: newEvents.y + 1,
                    //         w: columnWidths[index + 2],
                    //         h: 1
                    //     }
                    // ] : [])
                ]}
                cols={sumOfAllColWidths}
                rowHeight={50}
                width={1900}
                onLayoutChange={onLayoutChange}
                isDraggable
                isResizable
                draggableHandle=".event-title"
                resizeHandles={['e', 'w']}
            >
                {/* <div key={room.name} className="room-row">
                    <div className="room-id">{room.name}</div>
                </div>
                <div key={room.name} className="name-input-row">
                    <input type="text" value={""} />
                </div> */}
                {localEvents.map(event => (
                    <div key={event.i} style={{ height: rowHeights[event.y] }}>
                        <div className="event-title">{event.title}</div>
                    </div>
                ))}
                {newEvents && (
                    <div key={newEvents.i} style={{ height: rowHeights[newEvents.y] }}>
                        <div className="event-title">{newEvents.title}</div>
                    </div>
                )}
            </GridLayout>
        </div>
    );
}