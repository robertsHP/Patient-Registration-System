import React, { useState, useEffect } from 'react';

import { formData } from '../data/formData.jsx';

import '../../../global.css'
import './EventFormComponent.css'

export default class EventFormComponent extends React.Component {
    constructor(props) {
        super(props);

        var selectedEvent = this.props.getEvent(this.props.eventID);

        this.state = {
            formState: {
                id: selectedEvent.id || '',
                name: selectedEvent.name || '',
                start: selectedEvent.start || '',
                end: selectedEvent.end || '',
                room: selectedEvent.room || '',
                bedName: selectedEvent.bedName || '',
                description: selectedEvent.description || '',
                doctorName: selectedEvent.doctorName || '',
                hotelStayDate: selectedEvent.hotelStayDate || ''
            }
        };

        this.handleInputUpdate = this.handleInputUpdate.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        var selectedEvent = this.props.getEvent(this.props.eventID);

        //atjauno notikuma informāciju gadījuma, ja ir veiktas kādas izmaiņas
        if (selectedEvent !== prevProps.events[prevProps.eventID]) {
            this.setState({
                formState: {
                    id: selectedEvent.id || '',
                    name: selectedEvent.name || '',
                    start: selectedEvent.start || '',
                    end: selectedEvent.end || '',
                    room: selectedEvent.room || '',
                    bedName: selectedEvent.bedName || '',
                    description: selectedEvent.description || '',
                    doctorName: selectedEvent.doctorName || '',
                    hotelStayDate: selectedEvent.hotelStayDate || ''
                }
            });
        }
    }

    render() {
        // const NosaukumsComponent = formData.beds.title.tag;

        return (
            <div className="global-component">
                <form>
                    {/* <NosaukumsComponent
                        value={this.state.formState.title} 
                        onChange={this.handleInputUpdate}
                    /> */}
                    <label>
                        Pacienta vārds un uzvārds:
                        <input type="text" name="name" value={this.state.formState.name} onChange={this.handleInputUpdate} />
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
                        :
                        <input type="date" name="hotelStayDate" value={this.state.formState.hotelStayDate} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Gulta:
                        <input type="text" name="bedName" value={this.state.formState.bedName} onChange={this.handleInputUpdate} />
                    </label>
                    {/* <label>
                        Apraksts:
                        <textarea name="description" value={this.state.formState.description} onChange={this.handleInputUpdate} />
                    </label> */}
                    <label>
                        Ārsts:
                        <input type="text" name="doctorName" value={this.state.formState.doctorName} onChange={this.handleInputUpdate} />
                    </label>
                    <label>
                        Viesnīca:
                        <input type="date" name="hotelStayDate" value={this.state.formState.hotelStayDate} onChange={this.handleInputUpdate} />
                    </label>
                </form>
                <button onClick={this.handleSaveClick}>
                    Saglabāt
                </button>
                <button onClick={this.handleDeleteClick}>
                    Dzēst
                </button>
            </div>
        );
    }

    handleInputUpdate = (event) => {
        console.log("handleInputUpdate");

        //Kā tiek kāda vērtība mainīta ievades formā, tā arī izveido jaunu notikumu
        const updatedEvent = {
            ...this.state.formState,
            [event.target.name]: event.target.value
        };
        
        //Ja sākuma datums ir pēc beigu datuma tad samaina
        if (updatedEvent.start > updatedEvent.end) {
            var newStart = updatedEvent.start;
            var newEnd = updatedEvent.end;

            updatedEvent.start = newEnd;
            updatedEvent.end = newStart;
        }

        this.setState({ formState: updatedEvent });
        this.props.setEvent(updatedEvent);
    };

    handleSaveClick = () => {
        console.log('Save clicked!');
    };
    handleDeleteClick = () => {
        console.log('Delete clicked!');
    };
}