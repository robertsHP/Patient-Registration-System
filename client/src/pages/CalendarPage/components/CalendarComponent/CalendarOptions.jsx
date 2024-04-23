import React, { useEffect, useState } from 'react';

import { ActionState } from '../../hooks/useActionStateHook.jsx';
import { useCalendarContext } from '../../contexts/CalendarContext.jsx';

import { exportExcel } from '../../services/exportExcel.jsx';

import './CalendarOptions.css'

export default function CalendarOptions(props) {
    const { 
        actionState, setActionState,
        setEventID, events,
        rooms, roomID, setRoomID,
        month, year
    } = useCalendarContext();

    const roomSelect = (event) => {
        const id = event.target.value;
        setRoomID(id);
        setEventID(-1);
    };
    const actionSelect = (event) => {
        const selectedOption = Object.values(ActionState).find(
            option => option.name === event.target.value
        );
        setActionState(selectedOption);
        setEventID(-1);
    };
    const excelButton = () => {
        console.log("excelButton");
        exportExcel(month, year, events, rooms);
    };
    
    return (
        <>
            <div className="container">
                <div className="container-left">
                    <select className="selectStyle" onChange={roomSelect} value={roomID}>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.num}
                            </option>
                        ))}
                    </select>
                    <select className="selectStyle" onChange={actionSelect} value={actionState?.name}>
                        {Object.values(ActionState).map(option => (
                            <option key={option.name} value={option.name}>
                                {option.description}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="container-right">
                    <button className="buttonStyle" onClick={excelButton}>Lejupielādēt Excel</button>
                </div>
            </div>
        </>
    );
}

