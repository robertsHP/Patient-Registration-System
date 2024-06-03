import React from 'react';
import './DayCell.css';

export default function DayCell({ date }) {
    return (
        <div className="day-cell">
            {date.getDate()}
        </div>
    );
}