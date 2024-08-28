import React, { Component, createRef } from 'react';
import GridLayout from 'react-grid-layout';

import * as dragTableUtilities from './utils/dragTableUtilities.jsx';
import * as appointmentUpdateUtilities from './utils/appointmentUpdateUtilities.jsx';

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

        this.appointmentClassName = 'room-row__appointment';

        this.state = {
            refresh: 0,
            draggingAppointment: null,
            isCreatingAppointment: false,
            lastClickTime: 0,
            roomNumber: this.room.room_num
        };

        this.pageRefreshed = props.pageRefreshed;
        this.gridRef = createRef();
        this.updateAppointmentInDB = this.updateAppointmentInDB.bind(this);
        
        this.appointmentUpdate = this.appointmentUpdate.bind(this);

        this.updateLayout = this.updateLayout.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);

        this.updateAppointments = this.updateAppointments.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);

        this.createNewAppointment = this.createNewAppointment.bind(this);
        this.clickOnAppointment = this.clickOnAppointment.bind(this);
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
        var singleDataUpdate = this.props.data.singleDataUpdateTrigger !== prevProps.data.singleDataUpdateTrigger;

        if (fullDataUpdate || singleDataUpdate) {
            this.room = this.props.data.getRoomWithID(this.props.roomID);
            this.props.refreshRoom(this.props.roomID);
        }
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
    
    appointmentUpdate (appointment, newStartDatePos, newEndDatePos) {
        // var oldAppointment = { ...appointment };

        const {
            finalBeginDate,
            finalEndDate,
            finalExtendsToPreviousMonth,
            finalExtendsToNextMonth,
            adjustedStartDatePos,
            adjustedEndDatePos,
            outOfCurrentMonth
        } = appointmentUpdateUtilities.calculateAppointmentUpdates(
            appointment, 
            newStartDatePos, 
            newEndDatePos, 
            this.props.data.date, 
            this.props.config
        );

        appointment.x = adjustedStartDatePos;
        appointment.w = adjustedEndDatePos - adjustedStartDatePos + 1;
        appointment.extendsToPreviousMonth = finalExtendsToPreviousMonth;
        appointment.begin_date = finalBeginDate;
        appointment.extendsToNextMonth = finalExtendsToNextMonth;
        appointment.end_date = finalEndDate;

        // if(dragTableUtilities.areAppointmentsOverlapping(appointment, this.room.appointments)) {
        //     return oldAppointment;
        // }

        if (outOfCurrentMonth) {
            // Remove the appointment from the room if it is out of the current month
            this.room.appointments = this.room.appointments.filter(a => a.i !== appointment.i);
            this.props.data.setRoomWithID(this.room.id, this.room);
            this.props.refreshRoom(this.props.roomID);
        }
    
        return appointment;
    }

    updateLayout(newLayout) {
        console.log("updateLayout");

        this.room.appointments.forEach((appointment) => {
            const newAppointmentLayout = newLayout.find((l) => l.i === String(appointment.i));

            if (newAppointmentLayout) {
                if (this.pageRefreshed && !this.state.isCreatingAppointment) {
                    var convertedAppointment = dragTableUtilities.convertAppointmentForSendingToDB(
                        this.room.id, 
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

    updateAppointments(newItem) {
        this.room.appointments.map((appointment) => {
            if (appointment.i === newItem.i) {
                const newStartDatePos = newItem.x;
                const newEndDatePos = newItem.x + newItem.w - 1;

                appointment = this.appointmentUpdate(
                    appointment, 
                    newStartDatePos, 
                    newEndDatePos
                );
            }
            return appointment;
        });
    }

    onDragStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onDragStop");

        this.updateAppointments(newItem);
        
        this.gridItemDragged = true;
        this.gridItemResized = false;
        this.manualRefresh = false;
    }

    onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
        console.log("onResizeStop");

        this.updateAppointments(newItem);

        this.gridItemDragged = false;
        this.gridItemResized = true;
        this.manualRefresh = false;
    }

    clickOnAppointment (event) {
        const clickedAppointmentElement = event.target.closest(`.${this.appointmentClassName}`);

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
    }

    createNewAppointment(x) {
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

    onMouseDown(e) {
        console.log("onMouseDown");

        if (e.target.closest('.react-resizable-handle')) {
            return; // Ignore mousedown on resize handles
        } else if (e.target.closest(`.${this.appointmentClassName}`)) {
            this.clickOnAppointment(e);
        } else {
            //Create new appointment
            const gridRect = this.gridRef.current.getBoundingClientRect();
            const colWidth = this.props.config.width / this.props.config.cols; // Dynamic calculation based on grid width
            const x = Math.floor((e.clientX - gridRect.left) / colWidth);

            if (dragTableUtilities.isInDateColumns(x, 1, this.props.config)) {
                this.createNewAppointment(x);
            }
            this.props.refreshRoom(this.props.roomID);
        }
    }

    onMouseMove(e) {
        // console.log("onMouseMove");

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
                this.props.refreshRoom(this.props.roomID);
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
            this.props.data.setRoomWithID(this.room.id, this.room);
            this.props.refreshRoom(this.props.roomID);
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
                    this.room.id, 
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
        this.props.setSelectedAppointmentData({
            roomID: this.props.roomID,
            appointment: appointment
        });
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
                    draggableHandle={`.${this.appointmentClassName}`}
                    resizeHandles={['e', 'w']}
                    compactType={null}
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
                            <div className={this.appointmentClassName} key={appointment.i}>
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

