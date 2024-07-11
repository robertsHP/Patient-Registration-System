import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';

import EventInputForm from './EventInputForm';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventRow.css';

export default function EventRow({ data, roomIndex, config, nextEventId, setNextEventId }) {
    const gridRef = useRef(null);

    const [room, setRoom] = useState(data.getRoomWithID(roomIndex));

    const [draggingEvent, setDraggingEvent] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);

    const [lastClickTime, setLastClickTime] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const lastColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

    const isValidEventPosition = (layoutItem) => {
        const dateColumnsStart = config.columnWidths.slice(0, 2).reduce((acc, width) => acc + width, 0);
        const dateColumnsEnd = config.columnWidths.slice(2, config.columnWidths.length - 2)
            .reduce((acc, width) => acc + width, dateColumnsStart);

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
        const dateColumnsEnd = dateColumnsStart + config.columnWidths.slice(2, config.columnWidths.length - 2)
            .reduce((acc, width) => acc + width, 0);

        return x >= dateColumnsStart && (x + w) <= dateColumnsEnd;
    };

    const getDateBasedOnLayoutPosition = (pos) => {
        var finalDate = null;
        config.dateLayout.forEach( date => {
            if (pos == date.x)
                finalDate = new Date(
                    data.date.getFullYear(), 
                    data.date.getMonth(), 
                    date.num
                );    
        });
        return finalDate;
    };

    const onLayoutChange = (layout) => {
        room.events.forEach(event => {
            const newLayout = layout.find(l => l.i === String(event.i));

            if (newLayout) {
                const validPosition = isValidEventPosition(newLayout);
                const notOverlapping = !isOverlapping(newLayout, room.events, event.i);

                if (validPosition && notOverlapping) {
                    var startDatePos = newLayout.x;
                    var endDatePos = newLayout.x + newLayout.w;

                    event.begin_date = getDateBasedOnLayoutPosition(startDatePos);
                    event.end_date = getDateBasedOnLayoutPosition(endDatePos);
                    event.x = newLayout.x;
                    event.w = newLayout.w;
                }
            }
            return event;
        });
        data.setRoomWithID(room.id_room, room);
    };

    const onMouseDown = (e) => {
        if (e.target.closest('.react-resizable-handle')) {
            return; // Ignore mousedown on resize handles
        } else if (e.target.closest('.event')) {
            const clickedEventElement = e.target.closest('.event');
        
            if (clickedEventElement) {
                const now = Date.now();
                const doubleClickThreshold = 300;
                
                if (now - lastClickTime < doubleClickThreshold) {
                    const eventKey = clickedEventElement.getAttribute('key');

                    console.log(eventKey);
                    
                    // const event = room.events.find(event => event.i === eventKey);
                    // handleEventDoubleClick(event);
                } else {
                    // Handle single-click
                    setLastClickTime(now);
                }
            }
            return;
        }
    
        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = config.width / config.cols; // Dynamic calculation based on grid width
        const x = Math.floor((e.clientX - gridRect.left) / colWidth);
    
        if (isInDateColumns(x, 1)) {
            var startDate = getDateBasedOnLayoutPosition(x);
            var endDate = getDateBasedOnLayoutPosition(x + 1);
    
            setDraggingEvent({
                id_event: null,
                notes: "",
                doctor: null,
                patient: null,
                end_date: endDate,
                begin_date: startDate,
                i: 'event-temp',
                x: x,
                y: 0,
                w: 1,
                h: 1,
                startX: x
            });
    
            setIsCreatingEvent(true);
        }
    };
    

    const onMouseMove = (e) => {
        if (isCreatingEvent && draggingEvent) {
            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = config.width / config.cols;
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - draggingEvent.startX) + 1;
            const newX = Math.min(draggingEvent.startX, currentX);

            if (isInDateColumns(newX, newWidth)) {
                var startDate = getDateBasedOnLayoutPosition(newX);
                var endDate = getDateBasedOnLayoutPosition(newX + newWidth);

                var newDragEv = {
                    ...draggingEvent,
                    end_date: endDate,
                    begin_date: startDate,
                    x: newX,
                    w: newWidth
                };

                setDraggingEvent(newDragEv);
            }
        }
    };

    const onMouseUp = () => {
        console.log('onMouseUp');
        if (isCreatingEvent && draggingEvent) {
            var inDateColumns = isInDateColumns(draggingEvent.x, draggingEvent.w);
            var overlapping = isOverlapping(draggingEvent, room.events, 'event-temp');

            if (inDateColumns && !overlapping) {
                const newEvent = { 
                    ...draggingEvent, 
                    i: `event-${nextEventId}`,
                    x: Number(draggingEvent.x), 
                    y: Number(draggingEvent.y), 
                    w: Number(draggingEvent.w), 
                    h: 1 
                };
                room.events.push(newEvent);
                setNextEventId(nextEventId + 1);
            }
            setDraggingEvent(null);
            setIsCreatingEvent(false);
        }
    };

    const handleEventDoubleClick = (event) => {
        console.log('double ccc');
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
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
                        i: `room-input-${roomIndex}`, 
                        x: 0, 
                        y: 0, 
                        w: 
                        config.columnWidths[0], 
                        h: 1, 
                        static: true 
                    },
                    { 
                        i: `name-input-${roomIndex}`, 
                        x: config.columnWidths[0], 
                        y: 0, 
                        w: config.columnWidths[1], 
                        h: 1, 
                        static: true 
                    },
                    ...room.events.map(event => ({
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
                <div key={`room-input-${roomIndex}`} className="grid-cell">
                    <input type="text" defaultValue={room.room_num} style={{ width: '100%' }} />
                </div>

                <div key={`name-input-${roomIndex}`} className="grid-cell">
                    <input type="text" defaultValue={room.events[0]?.patient.pat_name} style={{ width: '100%' }} />
                </div>

                {room.events.map(event => (
                    <div className="event" key={event.i} onDoubleClick={() => handleEventDoubleClick(event)}>
                        <div className="event-name no-select">
                            {event.i}
                            {/* {(event.patient == null) ? '' : event.patient.pat_name} */}
                        </div>
                    </div>
                ))}

                {draggingEvent && (
                    <div className="event" key={draggingEvent.i}></div>
                )}

                <div key="sum-value" className="grid-cell">
                    1
                </div>
                <div key="hotel-input" className="grid-cell">
                    <input type="text" defaultValue={"T"} style={{ width: '100%' }} />
                </div>
            </GridLayout>
            {selectedEvent && <EventInputForm 
                event={selectedEvent} 
                onClose={handleCloseModal} 
            />}
        </div>
    );
}
