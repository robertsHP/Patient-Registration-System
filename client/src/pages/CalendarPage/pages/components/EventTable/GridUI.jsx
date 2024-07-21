import React, { useState, useContext, useEffect } from 'react';

import { LayoutContext } from '../../contexts/LayoutContext';

import LVDate from '../../../../../models/LVDate';

import './GridUI.css';

export default function GridUI({ data }) {
    const { triggerLayoutChange } = useContext(LayoutContext);

    const [leftButtonClicked, setLeftButtonClicked] = useState(false);
    const [rightButtonClicked, setRightButtonClicked] = useState(false);

    useEffect(() => {
        data.refreshRooms(() => {
            console.log(data.rooms);
            triggerLayoutChange();
        });
    }, [data.date]);

    const handleLeftButtonClick = () => {
        data.setDate(prevDate => {
            const newDate = new LVDate(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setLeftButtonClicked(true);
            return newDate;
        });
    };

    const handleRightButtonClick = () => {
        data.setDate(prevDate => {
            const newDate = new LVDate(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setRightButtonClicked(true);
            return newDate;
        });
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
