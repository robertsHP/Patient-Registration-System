import React, { useState, useRef, useEffect, useContext } from 'react';

import GridLayout from 'react-grid-layout';

import { convertEventForSendingToDB } from '../../utils/conversionUtilities.jsx';
import { getDaysInMonth } from '../../utils/monthUtilities.jsx';

import usePageRefresh from '../../../../../hooks/usePageRefresh.jsx';

import ApiService from '../../../../../services/ApiService.js';
import LVDate from '../../../../../models/LVDate.jsx';

import { EventTableContext } from '../../contexts/EventTableContext.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventRow.css';

export default function EventRow({ data, roomID, config, selectedEvent, setSelectedEvent }) {
    // const { eventRowEffectTrigger } = useContext(EventTableContext);

    const pageRefreshed = usePageRefresh();

    const [manualRefresh, setManualRefresh] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const refreshRow = () => {
        setManualRefresh(true);
        setRefresh(prev => prev + 1);
    };

    const [gridItemDragged, setGridItemDragged] = useState(false);
    const [gridItemResized, setGridItemResized] = useState(false);

    const gridRef = useRef(null);

    const [room, setRoom] = useState(data.getRoomWithID(roomID));

    const [draggingEvent, setDraggingEvent] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);

    const [lastClickTime, setLastClickTime] = useState(0);

    const lastColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2)
        .reduce((acc, width) => acc + width, 0);

    useEffect(() => {
        setRoom(data.getRoomWithID(roomID)); //LOCAL ROOM
        refreshRow();
    }, [data.fullDataUpdateTrigger]);

    const isValidEventPosition = (layoutItem) => {
        // Ensure the event is within date columns
        return (
            layoutItem.x >= config.getDateColumnsStart() &&
            (layoutItem.x + layoutItem.w) <= config.getDateColumnsEnd()
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
        return x >= config.getDateColumnsStart() && (x + w) <= config.getDateColumnsEnd();
    };

    const getDateBasedOnLayoutPosition = (pos) => {
        var finalDate = null;

        config.dateLayout.forEach(date => {
            if (pos == date.x) {
                finalDate = new LVDate(
                    data.date.getFullYear(),
                    data.date.getMonth(),
                    date.num
                );
            }
        });
        return finalDate;
    };

    const manageGridDragging = (newLayout, event) => {
        const newEventLayout = newLayout.find(l => l.i === String(event.i));

        if (newEventLayout) {
            console.log("WORKY");

            var startDatePos = newLayout.x;
            var endDatePos = newLayout.x + newLayout.w - 1;

            var finalBeginDate = null;
            var finalExtendsToPreviousMonth = false;
            var finalEndDate = null;
            var finalExtendsToNextMonth = false;

            var startLoss = 0;
            var endLoss = 0;

            const daysCountInPrevMonth = getDaysInMonth(
                data.date.getFullYear(),
                data.date.getMonth() - 1
            );

            // console.log("-----OLD EVENT----");
            // console.log("event.begin_date");
            // console.log(event.begin_date.getObject());
            // console.log("event.end_date");
            // console.log(event.end_date.getObject());

            if (startDatePos < config.getDateColumnsStart()) {
                startLoss = config.getDateColumnsStart() - startDatePos;

                finalExtendsToPreviousMonth = true;
                finalBeginDate = new LVDate(
                    data.date.getFullYear(), 
                    data.date.getMonth() - 1, 
                    daysCountInPrevMonth - startLoss
                );
            } if (event.extendsToPreviousMonth) {
                // console.log("!!!!!LIFE AND DEATH");

                var startGains = daysCountInPrevMonth - event.begin_date.getDate();

                // console.log(startGains);

                finalExtendsToPreviousMonth = false;
                finalBeginDate = new LVDate(
                    data.date.getFullYear(), 
                    data.date.getMonth(), 
                    startGains
                );
            }

            // console.log("-------------------------------------------");

            // console.log("endDatePos");
            // console.log(endDatePos);
            // console.log("config.dateColumnsEnd");
            // console.log(config.dateColumnsEnd);

            if (endDatePos > config.getDateColumnsEnd()) {
                endLoss = config.getDateColumnsEnd() - endDatePos;

                finalExtendsToNextMonth = true;
                finalEndDate = new LVDate(
                    data.date.getFullYear(), 
                    data.date.getMonth() + 1, 
                    endLoss
                );
            }

            // console.log("BEFOER-------------------------------------------");

            // console.log("finalBeginDate");
            // console.log(finalBeginDate);
            // console.log("finalEndDate");
            // console.log(finalEndDate);

            if (finalEndDate == null) {
                if (startLoss > 0) {
                    endDatePos -= startLoss;
                }
                finalEndDate = getDateBasedOnLayoutPosition(endDatePos);
            }

            if (finalBeginDate == null) {
                if (endLoss > 0) {
                    startDatePos += endLoss;
                }
                finalBeginDate = getDateBasedOnLayoutPosition(startDatePos);
            }

            // console.log("AFTER-------------------------------------------");

            // console.log("begin_date");
            // console.log(finalBeginDate.getObject());
            // console.log("finalEndDate");
            // console.log(finalEndDate.getObject());

            // console.log("-------------------------------------------");

            // console.log("startLoss");
            // console.log(startLoss);
            // console.log("endLoss");
            // console.log(endLoss);

            event.x = startDatePos;
            event.w = endDatePos - startDatePos + 1;

            event.extendsToPreviousMonth = finalExtendsToPreviousMonth;
            event.begin_date = finalBeginDate;
            event.extendsToNextMonth = finalExtendsToNextMonth;
            event.end_date = finalEndDate;
        }

        return event;
    };

    const updateEvent = (newLayout, event) => {
        const newEventLayout = newLayout.find(l => l.i === String(event.i));

        if (newEventLayout) {
            const validPosition = isValidEventPosition(newEventLayout);
            const notOverlapping = !isOverlapping(newEventLayout, room.events, event.i);

            if (validPosition && notOverlapping) {
                var startDatePos = newEventLayout.x;
                var endDatePos = newEventLayout.x + newEventLayout.w - 1;

                event.begin_date = getDateBasedOnLayoutPosition(startDatePos);
                event.end_date = getDateBasedOnLayoutPosition(endDatePos);

                event.x = newEventLayout.x;
                event.w = newEventLayout.w;

                if(pageRefreshed && !isCreatingEvent) {
                    var convertedEvent = convertEventForSendingToDB(room, event);

                    console.log("UPDATE");

                    ApiService.put(`/api/event/${event.id}`, convertedEvent)
                    .catch(error => {
                        console.log(error);
                    });
                }
            }
        }

        return event;
    };

    const updateLayout = (newLayout) => {
        console.log("!TRIGGER CHANGE");
        room.events.forEach(event => {
            if(gridItemDragged) {
                // event = manageGridDragging(newLayout, event);
            }
            event = updateEvent(newLayout, event);
            return event;
        });
        data.setRoomWithID(room.id, room);
    }

    const onLayoutChange = (newLayout) => {
        console.log("ON LAYOUT CHANGE");

        if (gridItemDragged) {
            setGridItemDragged(false);
        } else if (gridItemResized) {
            setGridItemResized(false);
        } else if (manualRefresh) {
            updateLayout(newLayout);
            setManualRefresh(false);
        }
    };

    const onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
        updateLayout(layout);
        setGridItemDragged(true);
    };

    // Handle resize stop
    const onResizeStop = (layout, oldItem, newItem, placeholder, e, element) => {
        updateLayout(layout);
        setGridItemResized(true);
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
                    const reactFiberKey = Object.keys(clickedEventElement)
                        .find(key => key.startsWith('__reactFiber$'));
                    const objEl = clickedEventElement[reactFiberKey];
                    const eventKey = objEl.key.replace('event-', '');
                    const event = data.getEventWithID(roomID, eventKey);
                    
                    handleEventDoubleClick(event);
                } else {
                    // Handle single-click
                    setLastClickTime(now);
                }
            }
        } else {
            const gridRect = gridRef.current.getBoundingClientRect();
            const colWidth = config.width / config.cols; // Dynamic calculation based on grid width
            const x = Math.floor((e.clientX - gridRect.left) / colWidth);
        
            if (isInDateColumns(x, 1)) {
                var startDate = getDateBasedOnLayoutPosition(x);
                var endDate = getDateBasedOnLayoutPosition(x + 1);
        
                setDraggingEvent({
                    id: null,
                    notes: "",
                    doctor: {
                        doc_name: null,
                        id: null
                    },
                    patient: {
                        pat_name: null,
                        phone_num: null,
                        id: null,
                        patient_type: {
                            pat_type: null,
                            id: null
                        },
                        hotel_stay_end: null,
                        hotel_stay_start: null
                    },
                    end_date: endDate,
                    begin_date: startDate,
                    i: 'event-temp',
                    x: x,
                    y: 0,
                    w: 1,
                    h: 1,
                    startX: x,
                    extendsToPreviousMonth: false,
                    extendsToNextMonth: false
                });
        
                setIsCreatingEvent(true);
            }
            refreshRow();
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
                refreshRow();
            }
        }
    };

    const onMouseUp = () => {
        if (isCreatingEvent && draggingEvent) {
            var inDateColumns = isInDateColumns(draggingEvent.x, draggingEvent.w);
            var overlapping = isOverlapping(draggingEvent, room.events, 'event-temp');

            if (inDateColumns && !overlapping) {
                var tempDraggingEvent = draggingEvent;
                var convertedEvent = convertEventForSendingToDB(room, draggingEvent);

                ApiService.post('/api/event', convertedEvent)
                    .then(result => {
                        tempDraggingEvent.id = result;

                        const newEvent = { 
                            ...tempDraggingEvent, 
                            i: `event-${result}`,
                            x: Number(tempDraggingEvent.x), 
                            y: Number(tempDraggingEvent.y), 
                            w: Number(tempDraggingEvent.w), 
                            h: 1,
                            extendsToPreviousMonth: false,
                            extendsToNextMonth: false
                        };
                        room.events.push(newEvent);

                        refreshRow();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            setDraggingEvent(null);
            setIsCreatingEvent(false);
        }
    };

    const handleEventDoubleClick = (event) => {
        setSelectedEvent(event);
    };

    return (
        <div
            ref={gridRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <GridLayout
                className={`event-row-${roomID}`}
                layout={[
                    {
                        i: `room-input-${roomID}`,
                        x: 0,
                        y: 0,
                        w: config.columnWidths[0],
                        h: 1,
                        static: true
                    },
                    {
                        i: `name-input-${roomID}`,
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
                key={refresh}
                cols={config.cols}
                rowHeight={config.rowHeight}
                width={config.width}
                onLayoutChange={onLayoutChange}
                onDragStop={onDragStop}
                onResizeStop={onResizeStop}
                isDraggable
                isResizable
                draggableHandle=".event"
                resizeHandles={['e', 'w']}
                compactType={null}
                // preventCollision={true}
                // isBounded={true}
            >
                <div key={`room-input-${roomID}`} className="grid-cell">
                    <input type="text" defaultValue={room.room_num} style={{ width: '100%' }} />
                </div>
    
                <div key={`name-input-${roomID}`} className="grid-cell">
                    <input type="text" defaultValue={room.events[0]?.patient.pat_name} style={{ width: '100%' }} />
                </div>
    
                {room.events.map(event => (
                    <div className="event" key={event.i}>
                        <div className="event-name no-select">
                            {event.i}
                        </div>
                        {event.extendsToPreviousMonth && <div className="extends-previous">...</div>}
                        {event.extendsToNextMonth && <div className="extends-next">...</div>}
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
        </div>
    );    
}
