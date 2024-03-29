import React, { useState, useEffect } from 'react';

import './EventFormComponent.css'

class EventFormComponent extends React.Component {
    constructor(props) {
        super(props);
        var selectedEvent = this.props.events[this.props.selEventID];
        this.state = {
            formState: {
                id: selectedEvent.id || '',
                title: selectedEvent.title || '',
                start: selectedEvent.start || '',
                end: selectedEvent.end || '',
                room: selectedEvent.room || '',
                bedName: selectedEvent.bedName || '',
                description: selectedEvent.description || '',
                patientName: selectedEvent.patientName || '',
                doctorName: selectedEvent.doctorName || '',
                hotelStayDate: selectedEvent.hotelStayDate || ''
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.events[this.props.selEventID] !== prevProps.events[prevProps.selEventID]) {
            var selectedEvent = this.props.events[this.props.selEventID];
            this.setState({
                formState: {
                    id: selectedEvent.id || '',
                    title: selectedEvent.title || '',
                    start: selectedEvent.start || '',
                    end: selectedEvent.end || '',
                    room: selectedEvent.room || '',
                    bedName: selectedEvent.bedName || '',
                    description: selectedEvent.description || '',
                    patientName: selectedEvent.patientName || '',
                    doctorName: selectedEvent.doctorName || '',
                    hotelStayDate: selectedEvent.hotelStayDate || ''
                }
            });
        }
    }

    render() {
        return (
            <>
                <form>
                    <label>
                        Nosaukums:
                        <input type="text" name="title" value={this.state.formState.title} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Sākuma datums:
                        <input type="date" name="start" value={this.state.formState.start} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Beigu datums:
                        <input type="date" name="end" value={this.state.formState.end} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Telpas Nr.:
                        <input type="text" name="room" value={this.state.formState.room} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Gulta:
                        <input type="text" name="bedName" value={this.state.formState.bedName} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Apraksts:
                        <textarea name="description" value={this.state.formState.description} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Pacients:
                        <input type="text" name="patientName" value={this.state.formState.patientName} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Ārsts:
                        <input type="text" name="doctorName" value={this.state.formState.doctorName} onChange={this.handleInputUpdate} />
                    </label>
                    {/* <label>
                        Viesnīcas datums:
                        <input type="date" name="hotelStayDate" value={this.state.formState.hotelStayDate} onChange={this.handleInputUpdate} />
                    </label> */}
                </form>
                <button onClick={this.handleClick}>
                    Atjaunot
                </button>
                <button onClick={this.handleClick}>
                    Dzēst
                </button>
            </>
        );
    }

    handleInputUpdate = (event) => {
        console.log("handleInputUpdate");

        const updatedEvent = {
            ...this.state.formState,
            [event.target.name]: event.target.value
        };

        // If the start date is after the end date, swap them
        if (updatedEvent.start > updatedEvent.end) {
            var newStart = updatedEvent.start;
            var newEnd = updatedEvent.end;

            updatedEvent.start = newEnd;
            updatedEvent.end = newStart;
        }

        this.setState({ formState: updatedEvent });
        this.props.setEvents(this.props.events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

    handleClick = () => {
        console.log('Button clicked!');
    };
}

export default EventFormComponent