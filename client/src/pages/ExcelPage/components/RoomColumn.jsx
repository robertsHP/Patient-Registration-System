import React from 'react';
import './RoomColumn.css';

export default function RoomColumn({ rooms, rowHeights }) {
    return (
        <div className="room-column">
            <div className="room-header">
                Room
            </div>
            <div>
                {Object.keys(rooms).map((roomId, index) => (
                    <div key={roomId} className="room-row" style={{ height: rowHeights[index] }}>
                        <div className="room-id">{roomId}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}