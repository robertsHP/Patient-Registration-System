import React, { useState, useEffect } from 'react';

import EventGrid from './components/EventGrid.jsx';

import './Page.css'

export default function BedsPage ({pages, page}) {
    var events = [
        { id: 0, room: 401, patientName: 'Vladislavs', start: '2024-03-28', end: '2024-04-04' },
        { id: 1, room: 403, patientName: 'Katrīna', start: '2024-01-20', end: '2024-01-30' },
        { id: 2, room: 403, patientName: 'Anda', start: '2024-04-15', end: '2024-04-19' }
    ];
    var rooms = [
        { id: 0, num: 401, beds: [ 'lielā gulta', 'dīvāns' ] },
        { id: 1, num: 402, beds: [ 'lielā gulta', 'izv.dīv.' ] },
        { id: 2, num: 403, beds: [ '', '4 vienv.g.', '', '' ] },
        { id: 3, num: 404, beds: [ 'gulta', '', '', 'gulta' ] },
    ];

    return (
        <>
            <EventGrid year={2024} month={4} /> 
        </>
    );
}