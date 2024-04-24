import React, { useEffect, useState } from 'react';

import { ActionState } from '../../hooks/useActionStateHook.jsx';
import { useCalendarContext } from '../../contexts/CalendarContext.jsx';

import { exportExcel } from '../../services/exportExcel.jsx';

import './CalendarOptions.css'

export default function CalendarOptions(props) {
    const { 
        actionState, setActionState,
        setSelectedEvent, events,
        setSelectedDisallowedDate, selectedDisallowedDate,
        rooms, selectedRoom, setSelectedRoom,
        getRoom,
        month, year
    } = useCalendarContext();

    const roomSelect = (event) => {
        const id = event.target.value;

        setSelectedRoom(getRoom(id));
        
        switch (actionState) {
            case ActionState.ADD :
                setSelectedEvent(null);
                break;
            case ActionState.UNAVAILABILITY :
                setSelectedDisallowedDate(null);
                break;
        }
    };
    const actionSelect = (event) => {
        const selectedOption = Object.values(ActionState).find(
            option => option.name === event.target.value
        );
        setActionState(selectedOption);

        switch (actionState) {
            case ActionState.ADD :
                setSelectedEvent(null);
                break;
            case ActionState.UNAVAILABILITY :
                setSelectedDisallowedDate(null);
                break;
        }
    };
    const excelButton = () => {
        console.log("excelButton");
        exportExcel(month, year, events, rooms);
    };
    
    return (
        <>
            <div className="container">
                <div className="container-left">
                    {rooms &&
                        <select 
                            className="selectStyle" 
                            onChange={roomSelect} 
                            value={selectedRoom.id}
                        >
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.num}
                                </option>
                            ))}
                        </select>
                    }
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

