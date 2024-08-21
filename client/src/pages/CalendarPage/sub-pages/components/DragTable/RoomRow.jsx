import React, { Component, createRef } from 'react';
import GridLayout from 'react-grid-layout';

import * as dragTableUtilities from '../../utils/dragTableUtilities.jsx';
import * as monthUtilities from '../../utils/monthUtilities.jsx';

import ApiService from '../../../../../services/ApiService.js';
import LVDate from '../../../../../models/LVDate.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './RoomRow.css';

export default class RoomRow extends Component {
    constructor(props) {
        super(props);

        this.room = props.data.getRoomWithID(props.roomID);
        this.gridItemDragged = false;
        this.gridItemResized = false;
        this.manualRefresh = false;

        this.state = {
            refresh: 0,
            draggingAppointment: null,
            isCreatingAppointment: false,
            lastClickTime: 0,
            roomNumber: this.room.room_num
        };

        this.pageRefreshed = props.pageRefreshed;
        this.gridRef = createRef();
        this.refreshRow = this.refreshRow.bind(this);
        this.updateAppointmentInDB = this.updateAppointmentInDB.bind(this);
        this.appointmentDragUpdate = this.appointmentDragUpdate.bind(this);
        this.appointmentResizeUpdate = this.appointmentResizeUpdate.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.insertAppointmentInDB = this.insertAppointmentInDB.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.handleAppointmentDoubleClick = this.handleAppointmentDoubleClick.bind(this);
        this.roomNumberUpdate = this.roomNumberUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");

        var fullDataUpdate = this.props.data.fullDataUpdateTrigger !== prevProps.data.fullDataUpdateTrigger;
        // var singleDataUpdate = this.props.data.singleDataUpdateTrigger !== prevProps.data.singleDataUpdateTrigger;

        if (fullDataUpdate) {
            this.room = this.props.data.getRoomWithID(this.props.roomID);
            this.refreshRow();
        }
        // if(this.props.data.singleDataUpdateTrigger !== prevProps.data.singleDataUpdateTrigger) {
        //     if(this.props.selectedAppointment.id_room == this.state.room.id) {
        //         this.state.room
        //     }
        // }
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

    appointmentDragUpdate(appointment, newStartDatePos, newEndDatePos) {
        const dateColumnsStart = this.props.config.getDateColumnsStart();
        const dateColumnsEnd = this.props.config.getDateColumnsEnd();

        let finalBeginDate = null;
        let finalExtendsToPreviousMonth = false;
        let finalEndDate = null;
        let finalExtendsToNextMonth = false;

        const daysCountInPrevMonth = monthUtilities.getDaysOfMonth(
            this.props.data.date.getFullYear(),
            this.props.data.date.getMonth() - 1
        ).length;

        const daysCountInCurrentMonth = monthUtilities.getDaysOfMonth(
            this.props.data.date.getFullYear(),
            this.props.data.date.getMonth()
        ).length;

        // Calculate if the appointment extends into the previous month
        if (newStartDatePos < dateColumnsStart) {
            const startLoss = dateColumnsStart - newStartDatePos;
            const dayOfMonth = daysCountInPrevMonth - startLoss + 1;

            finalBeginDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth() - 1,
                dayOfMonth
            );
            finalExtendsToPreviousMonth = true;
        } else {
            finalBeginDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                newStartDatePos,
                this.props.data.date,
                this.props.config
            );
            finalExtendsToPreviousMonth = false;
        }

        // Calculate if the appointment extends into the next month
        if (newEndDatePos > dateColumnsEnd) {
            const endLoss = newEndDatePos - dateColumnsEnd;

            finalEndDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth() + 1,
                endLoss
            );
            finalExtendsToNextMonth = true;
        } else {
            finalEndDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                newEndDatePos,
                this.props.data.date,
                this.props.config
            );
            finalExtendsToNextMonth = false;

            console.log("?????????????????");
            console.log(finalEndDate);
        }

        // Handle dragging back into the current month from previous month
        if (appointment.extendsToPreviousMonth && newStartDatePos >= dateColumnsStart) {
            const daysDraggedIntoCurrentMonth = newStartDatePos - dateColumnsStart;
            const startGains = daysCountInPrevMonth - appointment.begin_date.getDate();

            finalBeginDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth(),
                daysDraggedIntoCurrentMonth - startGains + 1
            );
            finalEndDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth(),
                daysDraggedIntoCurrentMonth + appointment.end_date.getDate()
            );

            finalExtendsToPreviousMonth = false;
        }

        // Handle dragging back into the current month from next month
        if (appointment.extendsToNextMonth && newEndDatePos <= dateColumnsEnd) {
            const daysDraggedIntoCurrentMonth = dateColumnsEnd - newEndDatePos;
            const endGains = appointment.end_date.getDate();

            console.log("daysDraggedIntoCurrentMonth");
            console.log(daysDraggedIntoCurrentMonth);
            console.log("endGains");
            console.log(endGains);

            finalBeginDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                newStartDatePos,
                this.props.data.date,
                this.props.config
            );

            finalEndDate = new LVDate(
                this.props.data.date.getFullYear(),
                this.props.data.date.getMonth(),
                daysCountInCurrentMonth - daysDraggedIntoCurrentMonth + endGains + 1
            );
            finalExtendsToNextMonth = false;
        }

        // Handle expanding appointments when dragging within the same month
        if (finalExtendsToPreviousMonth && finalBeginDate.getMonth() < this.props.data.date.getMonth()) {
            const startLoss = dateColumnsStart - newStartDatePos;
            const dayOfMonth = finalBeginDate.getDate() - startLoss;
            finalBeginDate.setDate(dayOfMonth);
        }

        if (finalExtendsToNextMonth && finalEndDate.getMonth() > this.props.data.date.getMonth()) {
            const endLoss = newEndDatePos - dateColumnsEnd;
            const dayOfMonth = finalEndDate.getDate() + endLoss;
            finalEndDate.setDate(dayOfMonth);
        }

        console.log("finalBeginDate");
        console.log(finalBeginDate);
        console.log("adjustedEndDatePos");
        console.log(finalEndDate);

        // Calculate the new start and end positions (x and w) 
        // based on the resulting start and end dates
        const adjustedStartDatePos = dragTableUtilities.getPositionBasedOnDate(
            finalBeginDate, 
            this.props.data.date, 
            this.props.config
        );
        const adjustedEndDatePos = dragTableUtilities.getPositionBasedOnDate(
            finalEndDate, 
            this.props.data.date, 
            this.props.config
        );

        // Update appointment with new dates and positions
        appointment.x = adjustedStartDatePos;
        appointment.w = adjustedEndDatePos - adjustedStartDatePos + 1;
        appointment.extendsToPreviousMonth = finalExtendsToPreviousMonth;
        appointment.begin_date = finalBeginDate;
        appointment.extendsToNextMonth = finalExtendsToNextMonth;
        appointment.end_date = finalEndDate;

        console.log("appointment.begin_date.getObject()");
        console.log(appointment.begin_date.getObject());
        console.log("appointment.end_date.getObject()");
        console.log(appointment.end_date.getObject());

        console.log("appointment.x");
        console.log(appointment.x);
        console.log("appointment.w");
        console.log(appointment.w);

        return appointment;
    }

    appointmentResizeUpdate(appointment, newStartDatePos, newEndDatePos) {
        const dateColumnsStart = this.props.config.getDateColumnsStart();
        const dateColumnsEnd = this.props.config.getDateColumnsEnd();
        const currentMonth = this.props.data.date.getMonth();
        const currentYear = this.props.data.date.getFullYear();
    
        // Update begin_date and end_date based on new positions
        appointment.begin_date = dragTableUtilities.getDateBasedOnLayoutPosition(
            newStartDatePos, 
            this.props.data.date, 
            this.props.config
        );
        appointment.end_date = dragTableUtilities.getDateBasedOnLayoutPosition(
            newEndDatePos, 
            this.props.data.date, 
            this.props.config
        );
    
        // Determine if the appointment extends into the previous or next month
        appointment.extendsToPreviousMonth = appointment.begin_date.getMonth() < currentMonth ||
                                              appointment.begin_date.getFullYear() < currentYear;
        appointment.extendsToNextMonth = appointment.end_date.getMonth() > currentMonth ||
                                         appointment.end_date.getFullYear() > currentYear;
    
        // Calculate adjusted positions
        let adjustedStartDatePos, adjustedEndDatePos;
    
        if (appointment.extendsToPreviousMonth) {
            adjustedStartDatePos = dateColumnsStart; // Start at the beginning of the current month
        } else {
            adjustedStartDatePos = dragTableUtilities.getPositionBasedOnDate(
                appointment.begin_date, 
                this.props.data.date, 
                this.props.config
            );
        }
    
        if (appointment.extendsToNextMonth) {
            adjustedEndDatePos = dateColumnsEnd; // End at the last day of the current month
        } else {
            adjustedEndDatePos = dragTableUtilities.getPositionBasedOnDate(
                appointment.end_date, 
                this.props.data.date, 
                this.props.config
            );
        }
    
        // Update position and width
        appointment.x = adjustedStartDatePos;
        appointment.w = adjustedEndDatePos - adjustedStartDatePos + 1;
    
        return appointment;
    }

    updateLayout(newLayout) {
        console.log("updateLayout");

        this.room.appointments.forEach((appointment) => {
            const newAppointmentLayout = newLayout.find((l) => l.i === String(appointment.i));

            if (newAppointmentLayout) {
                if (this.pageRefreshed && !this.state.isCreatingAppointment) {
                    var convertedAppointment = dragTableUtilities.convertAppointmentForSendingToDB(
                        this.room, 
                        appointment
                    );
                    this.updateAppointmentInDB(appointment.id, convertedAppointment);
                }
            }
            return appointment;
        });
        this.props.data.setRoomWithID(this.room.id, this.room);
    }

    onLayoutChange(newLayout) {
        console.log("onLayoutChange");

        // console.log("gridItemDragged");
        // console.log(this.gridItemDragged);
        // console.log("gridItemResized");
        // console.log(this.gridItemResized);
        // console.log("manualRefresh");
        // console.log(this.manualRefresh);

        if (this.gridItemDragged) {
            this.updateLayout(newLayout);
            this.gridItemDragged = false;
        } else if (this.gridItemResized) {
            this.updateLayout(newLayout);
            this.gridItemResized = false;
        } else if (this.manualRefresh) {
            this.updateLayout(newLayout);
            this.manualRefresh = false;
        }
    }

    onDragStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onDragStop");

        this.room.appointments.map((appointment) => {
            if (appointment.i === newItem.i) {
                const newStartDatePos = newItem.x;
                const newEndDatePos = newItem.x + newItem.w - 1;

                appointment = this.appointmentDragUpdate(
                    appointment, 
                    newStartDatePos, 
                    newEndDatePos
                );
            }
            return appointment;
        });
        
        this.gridItemDragged = true;
        this.gridItemResized = false;
        this.manualRefresh = false;
    }

    onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onResizeStop");

        this.room.appointments.map((appointment) => {
            if (appointment.i === newItem.i) {
                const newStartDatePos = newItem.x;
                const newEndDatePos = newItem.x + newItem.w - 1;

                appointment = this.appointmentResizeUpdate(
                    appointment,
                    newStartDatePos,
                    newEndDatePos
                );
            }
            return appointment;
        });

        this.gridItemDragged = false;
        this.gridItemResized = true;
        this.manualRefresh = false;
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

            if (dragTableUtilities.isInDateColumns(x, 1, this.props.config)) {
                var startDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                    x,
                    this.props.data.date, 
                    this.props.config
                );
                var endDate = dragTableUtilities.getDateBasedOnLayoutPosition(
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
        if (this.state.isCreatingAppointment && this.state.draggingAppointment) {
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols;
            const currentX = Math.floor((e.clientX - gridRect.left) / colWidth);
            const newWidth = Math.abs(currentX - this.state.draggingAppointment.startX) + 1;
            const newX = Math.min(this.state.draggingAppointment.startX, currentX);

            if (dragTableUtilities.isInDateColumns(newX, newWidth, this.props.config)) {
                var startDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                    newX,
                    this.props.data.date, 
                    this.props.config
                );
                var endDate = dragTableUtilities.getDateBasedOnLayoutPosition(
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
    
            this.room = {
                ...this.room,
                appointments: [...this.room.appointments, newAppointment],
            };
            // this.setState((prevState) => ({
            //     room: {
            //         ...prevState.room,
            //         appointments: [...prevState.room.appointments, newAppointment],
            //     },
            // }));
    
            this.refreshRow();
        } catch (error) {
            console.log("RoomRow error: ");
            console.log(error);
        }
    }

    onMouseUp() {
        console.log("onMouseUp");

        if (this.state.isCreatingAppointment && this.state.draggingAppointment) {
            var inDateColumns = dragTableUtilities.isInDateColumns(
                this.state.draggingAppointment.x, 
                this.state.draggingAppointment.w,
                this.props.config
            );
            var overlapping = dragTableUtilities.isOverlapping(
                this.state.draggingAppointment, 
                this.room.appointments, 
                'appointment-temp'
            );

            if (inDateColumns && !overlapping) {
                var tempDraggingAppointment = this.state.draggingAppointment;
                var convertedAppointment = dragTableUtilities.convertAppointmentForSendingToDB(
                    this.room, 
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
        this.props.setSelectedAppointment(appointment);
    }

    async roomNumberUpdate (event) {
        try {
            this.room.room_num = event.target.value;

            this.props.data.setRoomWithID(
                this.room.id, 
                this.room
            );

            var finalRoom = {
                id: this.room.id,
                room_num: this.room.room_num,
                id_floor: this.props.data.floorID
            };

            const params = `/api/global/room/${finalRoom.id}`;
            await ApiService.put(params, finalRoom);
        } catch (error) {
            console.log("RoomRow error: ");
            console.log(error);
        }
    }

    render() {
        console.log("render");

        const { data, roomID, config } = this.props;
        const { draggingAppointment, refresh } = this.state;

        const lastColumnStart = config.getDateColumnsEnd() + 1;

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
                        ...this.room.appointments.map((appointment) => ({
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
                            w: config.columnWidths[config.columnWidths.length - 2],
                            h: 1,
                            static: true,
                        },
                        {
                            i: 'delete-button',
                            x: lastColumnStart + config.columnWidths[config.columnWidths.length - 2],
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
                        <input 
                            type="text" 
                            value={this.state.roomNumber} 
                            className="room-row__number-input"
                            onChange={(event) => this.setState({ roomNumber: event.target.value })}
                            onBlur={this.roomNumberUpdate} 
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </div>

                    {this.room.appointments.map((appointment) => {
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

                    <div key="delete-button" className="grid-cell">
                        <button 
                            onClick={() => this.props.deleteRoomRow(roomID)} 
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            X
                        </button>
                    </div>
                </GridLayout>
            </div>
        );
    }
}

