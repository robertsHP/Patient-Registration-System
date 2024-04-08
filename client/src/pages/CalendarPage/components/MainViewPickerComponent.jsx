import React, { useState } from 'react';

import CalendarComponent from './CalendarComponent.jsx';
import TableComponent from './TableComponent.jsx';

import '../../../global.css'
import './MainViewPickerComponent.css'

export default function MainViewPickerComponent ({events, setEvents, eventID, setEventID}) {
    const [selectedComponent, setSelectedComponent] = useState('Calendar');

    return (
        <>
            <header>
                <div className="global-component">
                    <button 
                        className={selectedComponent === 'Calendar' ? 'selected' : ''} 
                        onClick={() => setSelectedComponent('Calendar')}
                    >
                        Kalendārs
                    </button>
                    <button 
                        className={selectedComponent === 'Table' ? 'selected' : ''} 
                        onClick={() => setSelectedComponent('Table')}
                    >
                        Tabula
                    </button>
                </div>
            </header>
            {selectedComponent === 'Calendar' ? 
                <CalendarComponent 
                    events={events}
                    setEvents={setEvents}
                    eventID={eventID}
                    setEventID={setEventID}
                /> : 
                <TableComponent 
                    events={events}
                    setEvents={setEvents}
                    eventID={eventID}
                    setEventID={setEventID}
                />
            }
        </>
    );
}