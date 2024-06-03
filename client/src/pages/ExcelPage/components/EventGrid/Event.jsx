import React from 'react';
import './Event.css';

export default function Event({ title }) {
    return (
        <div className="event">
            <div className="event-title">{title}</div>
        </div>
    );
}