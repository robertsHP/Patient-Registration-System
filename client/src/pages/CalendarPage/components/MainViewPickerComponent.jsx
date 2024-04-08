import React, { useState } from 'react';

import CalendarComponent from './CalendarComponent.jsx';
import TableComponent from './TableComponent.jsx';

export default function MainViewPickerComponent ({events, setEvents, eventID, setEventID}) {
    const [selectedComponent, setSelectedComponent] = useState('Calendar');

    return (
        <>
            <header>
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