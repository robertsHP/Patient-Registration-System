import React, { useState, useContext, useEffect } from 'react';

import LVDate from '../../../../../models/LVDate';
import * as monthUtilities from '../../utils/monthUtilities.jsx';

import './GridUI.css';

export default function GridUI({ data }) {
    const [leftButtonClicked, setLeftButtonClicked] = useState(false);
    const [rightButtonClicked, setRightButtonClicked] = useState(false);

    const [monthName, setMonthName] = useState(
        monthUtilities.getMonthName(data.date.getMonth())
    );

    const handleLeftButtonClick = () => {
        const newDate = new LVDate(data.date);

        newDate.setMonth(newDate.getMonth() - 1);
        data.setDate(newDate);

        setLeftButtonClicked(true);
    };

    const handleRightButtonClick = () => {
        const newDate = new LVDate(data.date);

        newDate.setMonth(newDate.getMonth() + 1);
        data.setDate(newDate);

        setRightButtonClicked(true);
    };

    useEffect(() => {
        setMonthName(
            monthUtilities.getMonthName(data.date.getMonth())
        );
    }, [data.date]);

    return (
        <div className="grid-ui">
            <button 
                className={`grid-ui__left-button ${leftButtonClicked ? 'active-button' : ''}`} 
                onClick={handleLeftButtonClick}
            >
                &#8592; {/* Left Arrow */}
            </button>

            <div className="grid-ui__month-name">
                {monthName}
            </div>

            <button 
                className={`grid-ui__right-button ${rightButtonClicked ? 'active-button' : ''}`} 
                onClick={handleRightButtonClick}
            >
                &#8594; {/* Right Arrow */}
            </button>
        </div>
    );
}
