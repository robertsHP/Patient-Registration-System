import React from 'react';
import Grid from './components/Grid.jsx';
import './ExcelPage.css';

export default function ExcelPage() {
    return (
        <div>
            <h1>Event Scheduler</h1>
            <Grid year={2024} month={4} /> {/* May 2024 */}
        </div>
    );
}