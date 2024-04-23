import React, { useState } from 'react';

import { ActionState } from '../../hooks/useActionStateHook.jsx';

import './CalendarOptions.css'

export default function CalendarOptions(props) {
    const roomSelect = (event) => {
        const id = event.target.value;
        props.setRoomID(id);
    };
    const actionSelect = (event) => {
        const selectedOption = Object.values(ActionState).find(
            option => option.name === event.target.value
        );
        props.setActionState(selectedOption);
    };
    const excelButton = () => {
        console.log("excelButton");
    };
    return (
        <>
            <label>
                <select className="selectStyle" onChange={roomSelect} defaultValue={props.roomID}>
                    {props.rooms.map(room => (
                        <option key={room.id} value={room.id}>
                            {room.num}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                <select className="selectStyle" onChange={actionSelect} value={props.actionState?.name}>
                    {Object.values(ActionState).map(option => (
                        <option key={option.name} value={option.name}>
                            {option.description}
                        </option>
                    ))}
                </select>
                <button className="buttonStyle" onClick={excelButton}>Lejupielādēt Excel</button>
            </label>
        </>
    );
}

