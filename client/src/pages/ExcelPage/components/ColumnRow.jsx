import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

export default function ColumnRow ({ columnWidths, data }) {
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    const layout = [
        { i: 'room-column', x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
        { i: 'name-column', x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
        ...data.layout.map((item, index) => ({
            ...item,
            x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
            y: 0,
            w: columnWidths[index + 2],
            h: 1,
        }))
    ];

    return (
        <GridLayout
            className="layout"
            layout={layout}
            cols={sumOfAllColWidths}
            rowHeight={20}
            width={1900}
            isDraggable={false}
            isResizable={false}
        >
            <div key="room-column" className="grid-cell header">Room</div>
            <div key="name-column" className="grid-cell header">Name</div>
            {data.layout.map((item, index) => (
                <div key={item.i} className="grid-cell">
                    {item.date.getDate()}
                </div>
            ))}
        </GridLayout>
    );
};