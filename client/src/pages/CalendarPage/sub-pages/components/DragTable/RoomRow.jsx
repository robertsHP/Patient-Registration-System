import React, { Component, createRef } from 'react';
import GridLayout from 'react-grid-layout';

import { 
    convertAppointmentForSendingToDB,
    isValidAppointmentPosition,
    isOverlapping,
    isInDateColumns,
    getDateBasedOnLayoutPosition,
    getPositionBasedOnDate,

} from '../../utils/dragTableUtilities.jsx';

import { getDaysOfMonth } from '../../utils/monthUtilities.jsx';

import ApiService from '../../../../../services/ApiService.js';
import LVDate from '../../../../../models/LVDate.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './RoomRow.css';

export default class RoomRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            manualRefresh: false,
            refresh: 0,
            gridItemDragged: false,
            gridItemResized: false,
            room: props.data.getRoomWithID(props.roomID),
            draggingAppointment: null,
            isCreatingAppointment: false,
            lastClickTime: 0,
        };

        this.pageRefreshed = props.pageRefreshed;
        this.gridRef = createRef();
        this.refreshRow = this.refreshRow.bind(this);
        this.updateAppointmentInDB = this.updateAppointmentInDB.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.insertAppointmentInDB = this.insertAppointmentInDB.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.handleAppointmentDoubleClick = this.handleAppointmentDoubleClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");

        if (this.props.data.fullDataUpdateTrigger !== prevProps.data.fullDataUpdateTrigger) {
            this.setState({
                room: this.props.data.getRoomWithID(this.props.roomID),
            });
            this.refreshRow();
        }
        if(this.props.data.singleDataUpdateTrigger !== prevProps.data.singleDataUpdateTrigger) {

        }
    }

    refreshRow() {
        console.log("refreshRow");

        this.setState((prevState) => ({
            manualRefresh: true,
            refresh: prevState.refresh + 1,
        }));
    }

    async updateAppointmentInDB (id, convertedAppointment) {
        console.log("updateAppointmentInDB");

        try {
            const params = `/api/calendar-page/drag-table/appointment/${id}`;
            await ApiService.put(params, convertedAppointment);
        } catch (error) {
            console.log("RoomRow error: ");
            console.log(error);
        }
    }

    updateLayout(newLayout) {
        console.log("updateLayout");
        const room = this.state.room;

        room.appointments.forEach((appointment) => {
            const newAppointmentLayout = newLayout.find((l) => l.i === String(appointment.i));

            if (newAppointmentLayout) {
                const validPosition = isValidAppointmentPosition(newAppointmentLayout, this.props.config);
                const notOverlapping = !isOverlapping(
                    newAppointmentLayout, 
                    room.appointments, 
                    appointment.i
                );

                if (validPosition && notOverlapping) {
                    var startDatePos = newAppointmentLayout.x;
                    var endDatePos = newAppointmentLayout.x + newAppointmentLayout.w - 1;

                    appointment.begin_date = getDateBasedOnLayoutPosition(
                        startDatePos, 
                        this.props.data.date, 
                        this.props.config
                    );
                    appointment.end_date = getDateBasedOnLayoutPosition(
                        endDatePos, 
                        this.props.data.date, 
                        this.props.config
                    );

                    appointment.x = newAppointmentLayout.x;
                    appointment.w = newAppointmentLayout.w;

                    if (this.pageRefreshed && !this.state.isCreatingAppointment) {
                        var convertedAppointment = convertAppointmentForSendingToDB(room, appointment);

                        this.updateAppointmentInDB(appointment.id, convertedAppointment);
                    }
                }
            }
            return appointment;
        });
        this.props.data.setRoomWithID(room.id, room);
    }

    onLayoutChange(newLayout) {
        console.log("onLayoutChange");

        // console.log("gridItemDragged");
        // console.log(this.state.gridItemDragged);
        // console.log("gridItemResized");
        // console.log(this.state.gridItemResized);
        // console.log("manualRefresh");
        // console.log(this.state.manualRefresh);

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
        console.log("onDrag");
        // const newLayout = layout.map((item) => {
        //     if (item.i === newItem.i) {
        //         return { ...item, w: newItem.w, h: newItem.h };
        //     }
        //     return item;
        // });
        // setLayout(newLayout);
    };

    onDragStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onDragStop");
        const updatedAppointments = this.state.room.appointments.map((appointment) => {
            if (appointment.i === newItem.i) {
                var prevAppointment = appointment;

                var newStartDatePos = newItem.x;
                var newEndDatePos = newItem.x + newItem.w - 1;

                var newStartDate = getDateBasedOnLayoutPosition(
                    newStartDatePos,
                    this.props.data.date, 
                    this.props.config
                );
                var newEndDate = getDateBasedOnLayoutPosition(
                    newEndDatePos,
                    this.props.data.date, 
                    this.props.config
                );

                var finalBeginDate = null;
                var finalExtendsToPreviousMonth = false;
                var finalEndDate = null;
                var finalExtendsToNextMonth = false;

                var startLoss = 0;
                var startGains = 0;
                var endLoss = 0;
                var endGains = 0;

                console.log("----------------------------------------------------");

                const daysCountInPrevMonth = getDaysOfMonth(
                    this.props.data.date.getFullYear(),
                    this.props.data.date.getMonth() - 1
                ).length;

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
                    getDaysOfMonth(
                        this.props.data.date.getFullYear(), 
                        this.props.data.date.getMonth()
                    ).length
                );


                /*
                    if (extToPrev && extToNext) {
                        check which side gets loss and which gets gains

                        adjust start and end accordingly
                        set appointment start as DateColStart and end as DateColEnd
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

                //Ja ir ievilkts iepriekšējā un nākošajā mēnesī
                if (appointment.extendsToPreviousMonth && appointment.extendsToNextMonth) {
                    // var prevBeginDate = prevAppointment.begin_date.getDate();
                    // var prevEndDate = prevAppointment.end_date.getDate();

                    var newStartDate = getPositionBasedOnDate(
                        newStartDatePos,
                        this.props.data.date,
                        this.props.config
                    );
                    var newEndDate = getPositionBasedOnDate(
                        newEndDatePos,
                        this.props.data.date,
                        this.props.config
                    );

                    // finalExtendsToPreviousMonth = true;
                    // finalBeginDate = new LVDate(
                    //     this.props.data.date.getFullYear(),
                    //     this.props.data.date.getMonth() - 1,
                        
                    // );
                } else {
                    if (appointment.extendsToPreviousMonth && newStartDatePos < dateColumnsStart) {
                        startLoss = dateColumnsStart - newStartDatePos;

                        var prevBeginDate = prevAppointment.begin_date.getDate();

                        finalExtendsToPreviousMonth = true;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth() - 1,
                            prevBeginDate - startLoss
                        );
                        newStartDatePos = getPositionBasedOnDate(
                            finalBeginDate,
                            this.props.data.date,
                            this.props.config
                        );
                    } else if (appointment.extendsToPreviousMonth && newStartDatePos >= dateColumnsStart) {
                        startGains = daysCountInPrevMonth - appointment.begin_date.getDate();

                        var date = (newStartDatePos - dateColumnsStart) - startGains + 1;

                        finalExtendsToPreviousMonth = false;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth(),
                            date
                        );
                        newStartDatePos = getPositionBasedOnDate(
                            finalBeginDate,
                            this.props.data.date,
                            this.props.config
                        );
                    } else if (newStartDatePos < dateColumnsStart) {
                        startLoss = dateColumnsStart - newStartDatePos;
    
                        finalExtendsToPreviousMonth = true;
                        finalBeginDate = new LVDate(
                            this.props.data.date.getFullYear(),
                            this.props.data.date.getMonth() - 1,
                            daysCountInPrevMonth - startLoss
                        );
                        newStartDatePos = getPositionBasedOnDate(
                            finalBeginDate,
                            this.props.data.date,
                            this.props.config
                        );
                    }

                    if (appointment.extendsToNextMonth && newEndDatePos > dateColumnsEndAsDate) {

                    } else if (appointment.extendsToNextMonth && newEndDatePos <= dateColumnsEndAsDate) {
                        
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
                        finalEndDate = getDateBasedOnLayoutPosition(
                            newEndDatePos,
                            this.props.data.date, 
                            this.props.config
                        );
                    }
    
                    if (finalBeginDate == null) {
                        finalBeginDate = getDateBasedOnLayoutPosition(
                            newStartDatePos,
                            this.props.data.date, 
                            this.props.config
                        );
    
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

                appointment.x = newStartDatePos;
                appointment.w = newEndDatePos - newStartDatePos + 1;

                appointment.extendsToPreviousMonth = finalExtendsToPreviousMonth;
                appointment.begin_date = finalBeginDate;
                appointment.extendsToNextMonth = finalExtendsToNextMonth;
                appointment.end_date = finalEndDate;

                // console.log("startLoss");
                // console.log(startLoss);
                // console.log("endLoss");
                // console.log(endLoss);

                // console.log("appointment.x");
                // console.log(appointment.x);
                // console.log("appointment.w");
                // console.log(appointment.w);

                // console.log("appointment.begin_date");
                // console.log(appointment.begin_date.getObject());
                // console.log("appointment.end_date");
                // console.log(appointment.end_date.getObject());
            }
            return appointment;
        });

        this.setState((prevState) => ({
            room: { ...prevState.room, appointments: updatedAppointments },
            gridItemDragged: true,
            manualRefresh: false,
        }));
        this.updateLayout(layout);
    }

    onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onResizeStop");

        this.updateLayout(layout);
        this.setState({ gridItemResized: true, manualRefresh: false });
    }

    onMouseDown(e) {
        console.log("onMouseDown");

        if (e.target.closest('.react-resizable-handle')) {
            return; // Ignore mousedown on resize handles
        } else if (e.target.closest('.appointment')) {
            const clickedAppointmentElement = e.target.closest('.appointment');

            if (clickedAppointmentElement) {
                const now = Date.now();
                const doubleClickThreshold = 300;

                if (now - this.state.lastClickTime < doubleClickThreshold) {
                    const reactFiberKey = Object.keys(clickedAppointmentElement).find(
                        (key) => key.startsWith('__reactFiber$')
                    );
                    const objEl = clickedAppointmentElement[reactFiberKey];
                    const appointmentKey = objEl.key.replace('appointment-', '');
                    const appointment = this.props.data.getAppointmentWithID(this.props.roomID, appointmentKey);

                    this.handleAppointmentDoubleClick(appointment);
                } else {
                    // Handle single-click
                    this.setState({ lastClickTime: now });
                }
            }
        } else {
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols; // Dynamic calculation based on grid width
            const x = Math.floor((e.clientX - gridRect.left) / colWidth);

            if (isInDateColumns(x, 1, this.props.config)) {
                var startDate = getDateBasedOnLayoutPosition(
                    x,
                    this.props.data.date, 
                    this.props.config
                );
                var endDate = getDateBasedOnLayoutPosition(
                    x + 1,
                    this.props.data.date, 
                    this.props.config
                );

                this.setState({
                    draggingAppointment: {
                        id: null,
                        patient: {
                            pat_name: null,
                            phone_num: null,
                            id: null,
                        },
                        end_date: endDate,
                        begin_date: startDate,
                        notes: "",
                        doctor: {
                            doc_name: null,
                            id: null,
                        },
                        hotel_stay_start: null,
                        hotel_stay_end: null,
                        appointment_type: {
                            id: null,
                            type_name: null,
                        },
                        i: 'appointment-temp',
                        x: x,
                        y: 0,
                        w: 1,
                        h: 1,
                        startX: x,
                        extendsToPreviousMonth: false,
                        extendsToNextMonth: false,
                    },
                    isCreatingAppointment: true,
                });
            }
            this.refreshRow();
        }
    }

    onMouseMove(e) {
        console.log("onMouseMove");

        if (this.state.isCreatingAppointment && this.state.draggingAppointment) {
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols;
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - this.state.draggingAppointment.startX) + 1;
            const newX = Math.min(this.state.draggingAppointment.startX, currentX);

            if (isInDateColumns(newX, newWidth, this.props.config)) {
                var startDate = getDateBasedOnLayoutPosition(
                    newX,
                    this.props.data.date, 
                    this.props.config
                );
                var endDate = getDateBasedOnLayoutPosition(
                    newX + newWidth,
                    this.props.data.date, 
                    this.props.config
                );

                this.setState((prevState) => ({
                    draggingAppointment: {
                        ...prevState.draggingAppointment,
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

    async insertAppointmentInDB (tempDraggingAppointment, convertedAppointment) {
        console.log("insertAppointmentInDB");

        try {
            var url = '/api/calendar-page/drag-table/appointment';
            const result = await ApiService.post(url, convertedAppointment);

            tempDraggingAppointment.id = result;
    
            const newAppointment = {
                ...tempDraggingAppointment,
                i: `appointment-${result}`,
                x: Number(tempDraggingAppointment.x),
                y: Number(tempDraggingAppointment.y),
                w: Number(tempDraggingAppointment.w),
                h: 1,
                extendsToPreviousMonth: false,
                extendsToNextMonth: false,
            };
    
            this.setState((prevState) => ({
                room: {
                    ...prevState.room,
                    appointments: [...prevState.room.appointments, newAppointment],
                },
            }));
    
            this.refreshRow();
        } catch (error) {
            console.log("RoomRow error: ");
            console.log(error);
        }
    }

    onMouseUp() {
        console.log("onMouseUp");

        if (this.state.isCreatingAppointment && this.state.draggingAppointment) {
            var inDateColumns = isInDateColumns(
                this.state.draggingAppointment.x, 
                this.state.draggingAppointment.w,
                this.props.config
            );
            var overlapping = isOverlapping(
                this.state.draggingAppointment, 
                this.state.room.appointments, 
                'appointment-temp'
            );

            if (inDateColumns && !overlapping) {
                var tempDraggingAppointment = this.state.draggingAppointment;
                var convertedAppointment = convertAppointmentForSendingToDB(
                    this.state.room, 
                    this.state.draggingAppointment
                );

                this.insertAppointmentInDB(tempDraggingAppointment, convertedAppointment);
            }
            this.setState({
                draggingAppointment: null,
                isCreatingAppointment: false,
            });
        }
    }

    handleAppointmentDoubleClick(appointment) {
        console.log("handleAppointmentDoubleClick");

        this.props.setSelectedAppointment(appointment);
    }

    render() {
        console.log("render");

        const { data, roomID, config } = this.props;
        const { room, draggingAppointment, refresh } = this.state;

        const lastColumnStart = config.getDateColumnsEnd();

        return (
            <div
                ref={this.gridRef}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                <GridLayout
                    className={`room-row-${roomID}`}
                    layout={[
                        {
                            i: `room-input-${roomID}`,
                            x: 0,
                            y: 0,
                            w: config.columnWidths[0],
                            h: 1,
                            static: true
                        },
                        ...room.appointments.map((appointment) => ({
                            ...appointment,
                            i: String(appointment.i),
                            h: 1,
                            x: Math.min(
                                Math.max(appointment.x, config.columnWidths[0]),
                                lastColumnStart - appointment.w
                            ),
                        })),
                        ...(draggingAppointment
                            ? [
                                  {
                                      ...draggingAppointment,
                                      h: 1,
                                      x: Math.min(
                                            Math.max(
                                                draggingAppointment.x, 
                                                config.columnWidths[0]
                                            ),
                                            lastColumnStart - draggingAppointment.w
                                      ),
                                  },
                              ]
                            : []),
                        {
                            i: 'sum-value',
                            x: lastColumnStart,
                            y: 0,
                            w: config.columnWidths[config.columnWidths.length - 1],
                            h: 1,
                            static: true,
                        }
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
                    draggableHandle=".appointment"
                    resizeHandles={['e', 'w']}
                    compactType={null}
                    // preventCollision={true}
                    // isBounded={true}
                >
                    <div key={`room-input-${roomID}`}>
                        <input type="text" defaultValue={room.room_num} style={{ width: '100%' }} />
                    </div>

                    {room.appointments.map((appointment) => {
                        return (
                            <div className="appointment" key={appointment.i}>
                                <div className="room-row__appointment-name no-select">
                                    {appointment.i}
                                </div>

                                {appointment.extendsToPreviousMonth && 
                                    <div className="room-row__appointment-extend-previous">
                                        ...
                                    </div>
                                }
                                {appointment.extendsToNextMonth && 
                                    <div className="room-row__appointment-extend-next">
                                        ...
                                    </div>
                                }
                            </div>
                        );
                    })}

                    {draggingAppointment && 
                        <div className="appointment" key={draggingAppointment.i}>
                        </div>
                    }

                    <div key="sum-value" className="grid-cell">
                        {data.getSumOfAllAppointmentDays(roomID)}
                    </div>
                </GridLayout>
            </div>
        );
    }
}
