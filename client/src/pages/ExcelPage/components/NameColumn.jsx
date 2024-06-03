import React from 'react';
import './NameColumn.css';

export default function NameColumn({ rooms, rowHeights }) {
    return (
        <div className="name-column">
            <div className="name-header">
                Name
            </div>
            <div>
                {Object.keys(rooms).map((roomId, index) => (
                    <div key={roomId} className="name-input-row" style={{ height: rowHeights[index] }}>
                        <input type="text" value={rooms[roomId].name} readOnly />
                    </div>
                ))}
            </div>
        </div>
    );
}