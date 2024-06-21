import React, { useState, useEffect } from 'react';

import Event from './models/Event.jsx';
import Room from './models/Room.jsx';

import EventGrid from './components/EventGrid/EventGrid.jsx';
import GridUI from './components/GridUI.jsx';

import './Page.css'

export default function BedsPage ({pages, page}) {
    var events = [
        new Event(0, 401, 'Vladislavs', '2024-03-28', '2024-04-04'),
        new Event(1, 403, 'Katrīna', '2024-01-20', '2024-01-30'),
        new Event(0, 403, 'Anda', '2024-04-15', '2024-04-19')
    ];
    var rooms = [
        new Room(0, 401, [ 'lielā gulta', 'dīvāns' ]),
        new Room(1, 402, [ 'lielā gulta', 'izv.dīv.' ] ),
        new Room(2, 403, [ '', '4 vienv.g.', '', '' ]),
        new Room(3, 404, [ 'gulta', '', '', 'gulta' ])
    ];
    const [date, setDate] = useState(new Date ());

    return (
        <>
            <GridUI 
                date={date} 
            />
            <EventGrid 
                date={date} 
            
            /> 
        </>
    );
}