import React, { useState } from 'react';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarComponent from '../components/CalendarComponent.jsx';
import EventFormComponent from '../components/EventFormComponent.jsx';

import './CalendarPage.css'

class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [
                { id: 0, title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
                { id: 1, title: 'Event 2', start: '2024-03-02', end: '2024-03-05' }
            ],
            selEventID: -1
        };
    }

    setEvents = (newEvents) => {
        this.setState({ events: newEvents });
    }

    setSelEventID = (newID) => {
        this.setState({ selEventID: newID });
    }

    render() {
        const { events, selEventID } = this.state;

        return (
            <div className="flex-container">
                <div className="search">
                    <SearchComponent />
                </div>
                <div className="calendar">
                    <CalendarComponent 
                        events={events}
                        setEvents={this.setEvents}
                        selEventID={selEventID}
                        setSelEventID={this.setSelEventID}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {events[selEventID] && 
                        <EventFormComponent 
                            events={events}
                            setEvents={this.setEvents}
                            selEventID={selEventID}
                            setSelEventID={this.setSelEventID}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default CalendarPage