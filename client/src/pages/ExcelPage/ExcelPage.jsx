import React from 'react';

import EventGrid from './components/EventGrid.jsx';

import './ExcelPage.css';

export default function ExcelPage() {
    return (
        <div>
            <h1>Event Scheduler</h1>
            <EventGrid year={2024} month={4} /> {/* May 2024 */}
        </div>
    );
}