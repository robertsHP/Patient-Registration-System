import React, { Component, createRef } from 'react';
import GridLayout from 'react-grid-layout';

import { convertEventForSendingToDB } from '../../utils/conversionUtilities.jsx';
import { getDaysInMonth } from '../../utils/monthUtilities.jsx';

import ApiService from '../../../../../services/ApiService.js';
import LVDate from '../../../../../models/LVDate.jsx';

import { EventTableContext } from '../../contexts/EventTableContext.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './EventRow.css';

export default class EventRow extends Component {
    static contextType = EventTableContext;

    constructor(props) {
        super(props);

        this.state = {
            manualRefresh: false,
            refresh: 0,
            gridItemDragged: false,
            gridItemResized: false,
            room: props.data.getRoomWithID(props.roomID),
            draggingEvent: null,
            isCreatingEvent: false,
            lastClickTime: 0,
        };

        this.pageRefreshed = props.pageRefreshed;
        this.gridRef = createRef();
        this.refreshRow = this.refreshRow.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.handleEventDoubleClick = this.handleEventDoubleClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.fullDataUpdateTrigger !== prevProps.data.fullDataUpdateTrigger) {
            this.setState({
                room: this.props.data.getRoomWithID(this.props.roomID),
            });
            this.refreshRow();
        }
    }

    refreshRow() {
        this.setState((prevState) => ({
            manualRefresh: true,
            refresh: prevState.refresh + 1,
        }));
    }

    isValidEventPosition(layoutItem) {
        const dateColumnsStart = this.props.config.getDateColumnsStart();
        const dateColumnsEnd = this.props.config.getDateColumnsEnd();

        // Ensure the event is within date columns
        return (
            layoutItem.x >= dateColumnsStart &&
            (layoutItem.x + layoutItem.w) <= dateColumnsEnd
        );
    }

    isOverlapping(newLayout, events, currentEventId) {
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
            (event) => event.i !== currentEventId && overlapping(event, newLayout)
        );
    }

    isInDateColumns(x, w) {
        const dateColumnsStart = this.props.config.getDateColumnsStart();
        const dateColumnsEnd = this.props.config.getDateColumnsEnd();

        return x >= dateColumnsStart && (x + w) <= dateColumnsEnd;
    }

    getDateBasedOnLayoutPosition(pos) {
        var finalDate = null;

        if (pos < this.props.config.getDateColumnsStart()) {
            const daysCountInPrevMonth = getDaysInMonth(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth() - 1
            );
            const dateNum = daysCountInPrevMonth - (this.props.config.getDateColumnsStart() - pos);

            finalDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth() - 1,
                dateNum
            );
        } else if (pos > this.props.config.getDateColumnsEnd()) {
            const dateNum = this.props.config.getDateColumnsEnd() - pos;

            finalDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth() + 1,
                dateNum
            );
        } else {
            this.props.config.dateLayout.forEach((date) => {
                if (pos === date.x) {
                    finalDate = new LVDate(
                        this.props.data.date.getFullYear(),
                        this.props.data.date.getMonth(),
                        date.num
                    );
                }
            });
        }
        return finalDate;
    }

    getPositionBasedOnDate (tempDate) {
        var finalPos = null;

        if (tempDate.getMonth() == data.date.getMonth()) {
            this.props.config.dateLayout.forEach((date) => {
                if (tempDate.getDate() == date.num) {
                    finalPos = date.x;
                }
            });
        } else {
            if (tempDate.getMonth() < data.date.getMonth()) {
                finalPos = this.props.config.getDateColumnsStart();
            } else {
                finalPos = this.props.config.getDateColumnsEnd();
            }
        }

        return finalPos;
    }

    updateLayout(newLayout) {
        console.log("!TRIGGER CHANGE");
        const room = this.state.room;
        room.events.forEach((event) => {
            const newEventLayout = newLayout.find((l) => l.i === String(event.i));

            if (newEventLayout) {
                const validPosition = this.isValidEventPosition(newEventLayout);
                const notOverlapping = !this.isOverlapping(newEventLayout, room.events, event.i);

                if (validPosition && notOverlapping) {
                    var startDatePos = newEventLayout.x;
                    var endDatePos = newEventLayout.x + newEventLayout.w - 1;

                    event.begin_date = this.getDateBasedOnLayoutPosition(startDatePos);
                    event.end_date = this.getDateBasedOnLayoutPosition(endDatePos);

                    event.x = newEventLayout.x;
                    event.w = newEventLayout.w;

                    if (this.pageRefreshed && !this.state.isCreatingEvent) {
                        var convertedEvent = convertEventForSendingToDB(room, event);

                        console.log("UPDATE");

                        ApiService.put(`/api/event/${event.id}`, convertedEvent).catch((error) => {
                            console.log(error);
                        });
                    }
                }
            }
            return event;
        });
        this.props.data.setRoomWithID(room.id, room);
    }

    onLayoutChange(newLayout) {
        console.log("ON LAYOUT CHANGE");

        console.log("gridItemDragged");
        console.log(this.state.gridItemDragged);
        console.log("gridItemResized");
        console.log(this.state.gridItemResized);
        console.log("manualRefresh");
        console.log(this.state.manualRefresh);

        if (this.state.gridItemDragged || this.state.gridItemResized || this.state.manualRefresh) {
            if (this.state.gridItemDragged) {
                this.setState({ gridItemDragged: false });
            } else if (this.state.gridItemResized) {
                this.setState({ gridItemResized: false });
            } else if (this.state.manualRefresh) {
                this.updateLayout(newLayout);
                this.setState({ manualRefresh: false });
            }
        }
    }

    onDrag (layout, oldItem, newItem, placeholder, e, element) {
        // const newLayout = layout.map((item) => {
        //     if (item.i === newItem.i) {
        //         return { ...item, w: newItem.w, h: newItem.h };
        //     }
        //     return item;
        // });
        // setLayout(newLayout);


    };

    onDragStop(layout, oldItem, newItem, placeholder, e, element) {
        const updatedEvents = this.state.room.events.map((event) => {
            if (event.i === newItem.i) {
                var prevEvent = event;

                var newStartDatePos = newItem.x;
                var newEndDatePos = newItem.x + newItem.w - 1;

                var newStartDate = this.getDateBasedOnLayoutPosition(newStartDatePos);
                var newEndDate = this.getDateBasedOnLayoutPosition(newEndDatePos);

                var finalBeginDate = null;
                var finalExtendsToPreviousMonth = false;
                var finalEndDate = null;
                var finalExtendsToNextMonth = false;

                var startLoss = 0;
                var startGains = 0;
                var endLoss = 0;
                var endGains = 0;

                console.log("----------------------------------------------------");

                const daysCountInPrevMonth = getDaysInMonth(
                    this.props.data.date.getFullYear(),
                    this.props.data.date.getMonth() - 1
                );

                const dateColumnsStart = this.props.config.getDateColumnsStart();
                const dateColumnsEnd = this.props.config.getDateColumnsEnd();

                const dateColumnsStartAsDate = new LVDate(
                    this.props.data.date.getFullYear(), 
                    this.props.data.date.getMonth(),
                    1
                );
                const dateColumnsEndAsDate = new LVDate(
                    this.props.data.date.getFullYear(), 
                    this.props.data.date.getMonth(),
                    getDaysInMonth(
                        this.props.data.date.getFullYear(), 
                        this.props.data.date.getMonth()
                    )
                );


                /*
                    if (extToPrev && extToNext) {
                        check which side gets loss and which gets gains

                        adjust start and end accordingly
                        set event start as DateColStart and end as DateColEnd
                        set extToPrev and extToNext
                    } else {
                        if (extToPrev && startPos < dateColStart) {
                            check wether there are losses or gains


                        } else if (extToPrev && startPos >= dateColStart) {
                            done
                        } else if (startPos >= dateColStart) {
                            done
                        }

                        if (extToNext && endPos > dateColEnd) {

                        } else if (extToNext && endPos <= dateColEnd) {

                        } else if (endPos <= dateColEnd) {
                        
                        }
                    }
                        
                */

                if (event.extendsToPreviousMonth && event.extendsToNextMonth) {
                    // var prevBeginDate = prevEvent.begin_date.getDate();
                    // var prevEndDate = prevEvent.end_date.getDate();

                    // var newStartDate = this.getPositionBasedOnDate(newStartDatePos);
                    // var newEndDate = this.getPositionBasedOnDate(newEndDatePos);

                    // finalExtendsToPreviousMonth = true;
                    // finalBeginDate = new LVDate(
                    //     this.props.data.date.getFullYear(),
                    //     this.props.data.date.getMonth() - 1,
                        
                    // );
                } else {
                    if (event.extendsToPreviousMonth && newStartDatePos < dateColumnsStart) {
                        startLoss = dateColumnsStart - newStartDatePos;

                        var prevBeginDate = prevEvent.begin_date.getDate();

                        finalExtendsToPreviousMonth = true;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth() - 1,
                            prevBeginDate - startLoss
                        );
                        newStartDatePos = this.getPositionBasedOnDate(finalBeginDate);
                    } else if (event.extendsToPreviousMonth && newStartDatePos >= dateColumnsStart) {
                        startGains = daysCountInPrevMonth - event.begin_date.getDate();

                        var date = (newStartDatePos - dateColumnsStart) - startGains + 1;

                        finalExtendsToPreviousMonth = false;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth(),
                            date
                        );
                        newStartDatePos = this.getPositionBasedOnDate(finalBeginDate);
                    } else if (newStartDatePos < dateColumnsStart) {
                        startLoss = dateColumnsStart - newStartDatePos;
    
                        finalExtendsToPreviousMonth = true;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth() - 1,
                            daysCountInPrevMonth - startLoss
                        );
                        newStartDatePos = this.getPositionBasedOnDate(finalBeginDate);
                    }

                    if (event.extendsToNextMonth && newEndDatePos > dateColumnsEndAsDate) {

                    } else if (event.extendsToNextMonth && newEndDatePos <= dateColumnsEndAsDate) {
                        
                    } else if (newEndDatePos > dateColumnsEnd) {
                        endLoss = dateColumnsEnd - newEndDatePos;
    
                        finalExtendsToNextMonth = true;
                        finalEndDate = new LVDate(
                            this.props.data.date.getFullYear(), 
                            this.props.data.date.getMonth() + 1, 
                            endLoss
                        );
                    }

                    if (finalEndDate == null) {
                        if (startLoss > 0) {
                            newEndDatePos -= startLoss;
                        } else if (startGains > 0) {
                            newStartDatePos += startGains;
                        }
                        finalEndDate = this.getDateBasedOnLayoutPosition(newEndDatePos);
                    }
    
                    if (finalBeginDate == null) {
                        finalBeginDate = this.getDateBasedOnLayoutPosition(newStartDatePos);
    
                        if (endLoss > 0) {
                            newStartDatePos += endLoss;
                        } else if (endGains > 0) {
                            newEndDatePos -= endGains;
                        }
                    }
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

                event.x = newStartDatePos;
                event.w = newEndDatePos - newStartDatePos + 1;

                event.extendsToPreviousMonth = finalExtendsToPreviousMonth;
                event.begin_date = finalBeginDate;
                event.extendsToNextMonth = finalExtendsToNextMonth;
                event.end_date = finalEndDate;

                console.log("startLoss");
                console.log(startLoss);
                console.log("endLoss");
                console.log(endLoss);

                console.log("event.x");
                console.log(event.x);
                console.log("event.w");
                console.log(event.w);

                console.log("event.begin_date");
                console.log(event.begin_date.getObject());
                console.log("event.end_date");
                console.log(event.end_date.getObject());
            }
            return event;
        });

        this.setState((prevState) => ({
            room: { ...prevState.room, events: updatedEvents },
            gridItemDragged: true,
            manualRefresh: false,
        }));
        this.updateLayout(layout);
    }

    onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
        this.updateLayout(layout);
        this.setState({ gridItemResized: true, manualRefresh: false });
    }

    onMouseDown(e) {
        if (e.target.closest('.react-resizable-handle')) {
            return; // Ignore mousedown on resize handles
        } else if (e.target.closest('.event')) {
            const clickedEventElement = e.target.closest('.event');

            if (clickedEventElement) {
                const now = Date.now();
                const doubleClickThreshold = 300;

                if (now - this.state.lastClickTime < doubleClickThreshold) {
                    const reactFiberKey = Object.keys(clickedEventElement).find((key) => key.startsWith('__reactFiber$'));
                    const objEl = clickedEventElement[reactFiberKey];
                    const eventKey = objEl.key.replace('event-', '');
                    const event = this.props.data.getEventWithID(this.props.roomID, eventKey);

                    this.handleEventDoubleClick(event);
                } else {
                    // Handle single-click
                    this.setState({ lastClickTime: now });
                }
            }
        } else {
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols; // Dynamic calculation based on grid width
            const x = Math.floor((e.clientX - gridRect.left) / colWidth);

            if (this.isInDateColumns(x, 1)) {
                var startDate = this.getDateBasedOnLayoutPosition(x);
                var endDate = this.getDateBasedOnLayoutPosition(x + 1);

                this.setState({
                    draggingEvent: {
                        id: null,
                        notes: "",
                        doctor: {
                            doc_name: null,
                            id: null,
                        },
                        patient: {
                            pat_name: null,
                            phone_num: null,
                            id: null,
                            patient_type: {
                                pat_type: null,
                                id: null,
                            },
                            hotel_stay_end: null,
                            hotel_stay_start: null,
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
                        extendsToNextMonth: false,
                    },
                    isCreatingEvent: true,
                });
            }
            this.refreshRow();
        }
    }

    onMouseMove(e) {
        if (this.state.isCreatingEvent && this.state.draggingEvent) {
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols;
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - this.state.draggingEvent.startX) + 1;
            const newX = Math.min(this.state.draggingEvent.startX, currentX);

            if (this.isInDateColumns(newX, newWidth)) {
                var startDate = this.getDateBasedOnLayoutPosition(newX);
                var endDate = this.getDateBasedOnLayoutPosition(newX + newWidth);

                this.setState((prevState) => ({
                    draggingEvent: {
                        ...prevState.draggingEvent,
                        end_date: endDate,
                        begin_date: startDate,
                        x: newX,
                        w: newWidth,
                    },
                }));
                this.refreshRow();
            }
        }
    }

    onMouseUp() {
        if (this.state.isCreatingEvent && this.state.draggingEvent) {
            var inDateColumns = this.isInDateColumns(this.state.draggingEvent.x, this.state.draggingEvent.w);
            var overlapping = this.isOverlapping(this.state.draggingEvent, this.state.room.events, 'event-temp');

            if (inDateColumns && !overlapping) {
                var tempDraggingEvent = this.state.draggingEvent;
                var convertedEvent = convertEventForSendingToDB(this.state.room, this.state.draggingEvent);

                ApiService.post('/api/event', convertedEvent)
                    .then((result) => {
                        tempDraggingEvent.id = result;

                        const newEvent = {
                            ...tempDraggingEvent,
                            i: `event-${result}`,
                            x: Number(tempDraggingEvent.x),
                            y: Number(tempDraggingEvent.y),
                            w: Number(tempDraggingEvent.w),
                            h: 1,
                            extendsToPreviousMonth: false,
                            extendsToNextMonth: false,
                        };
                        this.setState((prevState) => ({
                            room: {
                                ...prevState.room,
                                events: [...prevState.room.events, newEvent],
                            },
                        }));
                        this.refreshRow();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            this.setState({
                draggingEvent: null,
                isCreatingEvent: false,
            });
        }
    }

    handleEventDoubleClick(event) {
        this.props.setSelectedEvent(event);
    }

    render() {
        const { data, roomID, config } = this.props;
        const { room, draggingEvent, refresh } = this.state;
        const lastColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2).reduce((acc, width) => acc + width, 0);

        return (
            <div
                ref={this.gridRef}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
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
                            static: true,
                        },
                        {
                            i: `name-input-${roomID}`,
                            x: config.columnWidths[0],
                            y: 0,
                            w: config.columnWidths[1],
                            h: 1,
                            static: true,
                        },
                        ...room.events.map((event) => ({
                            ...event,
                            i: String(event.i),
                            h: 1,
                            x: Math.min(Math.max(event.x, config.columnWidths[0] + config.columnWidths[1]), lastColumnStart - event.w),
                        })),
                        ...(draggingEvent
                            ? [
                                  {
                                      ...draggingEvent,
                                      h: 1,
                                      x: Math.min(
                                          Math.max(draggingEvent.x, config.columnWidths[0] + config.columnWidths[1]),
                                          lastColumnStart - draggingEvent.w
                                      ),
                                  },
                              ]
                            : []),
                        {
                            i: 'sum-value',
                            x: lastColumnStart,
                            y: 0,
                            w: config.columnWidths[config.columnWidths.length - 2],
                            h: 1,
                            static: true,
                        },
                        {
                            i: 'hotel-input',
                            x: lastColumnStart + config.columnWidths[config.columnWidths.length - 2],
                            y: 0,
                            w: config.columnWidths[config.columnWidths.length - 1],
                            h: 1,
                            static: true,
                        },
                    ]}
                    key={refresh}
                    cols={config.cols}
                    rowHeight={config.rowHeight}
                    width={config.width}
                    onLayoutChange={this.onLayoutChange}
                    onDrag={this.onDrag}
                    onDragStop={this.onDragStop}
                    onResizeStop={this.onResizeStop}
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

                    {room.events.map((event) => (
                        <div className="event" key={event.i}>
                            <div className="event-name no-select">{event.i}</div>
                            {event.extendsToPreviousMonth && <div className="extends-previous">...</div>}
                            {event.extendsToNextMonth && <div className="extends-next">...</div>}
                        </div>
                    ))}

                    {draggingEvent && <div className="event" key={draggingEvent.i}></div>}

                    <div key="sum-value" className="grid-cell">
                        1
                    </div>
                    <div key="hotel-input" className="grid-cell">
                        <input type="text" defaultValue={'T'} style={{ width: '100%' }} />
                    </div>
                </GridLayout>
            </div>
        );
    }
}
