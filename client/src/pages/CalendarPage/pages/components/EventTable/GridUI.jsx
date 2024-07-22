import React, { useState, useContext, useEffect } from 'react';

import { EventTableContext } from '../../contexts/EventTableContext.jsx';

import LVDate from '../../../../../models/LVDate';

import './GridUI.css';

export default function GridUI({ data }) {
    const { triggerLayoutChange } = useContext(EventTableContext);

    const [leftButtonClicked, setLeftButtonClicked] = useState(false);
    const [rightButtonClicked, setRightButtonClicked] = useState(false);

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

    return (
        <div className="container">
            <button 
                className={`sidebar-button ${leftButtonClicked ? 'active-button' : ''}`} 
                onClick={handleLeftButtonClick}
            >
                &#8592; {/* Left Arrow */}
            </button>
            <button 
                className={`sidebar-button ${rightButtonClicked ? 'active-button' : ''}`} 
                onClick={handleRightButtonClick}
            >
                &#8594; {/* Right Arrow */}
            </button>
        </div>
    );
}
