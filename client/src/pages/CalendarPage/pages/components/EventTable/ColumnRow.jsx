import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ColumnRow.css';

export default function ColumnRow({ dateLayout, width, columnWidths, sumOfAllColWidths}) {
    const lastColumnStart = columnWidths.slice(0, columnWidths.length - 2)
        .reduce((acc, width) => acc + width, 0);
    
    return (
        <>
            <GridLayout
                className="layout"
                layout={[
                    { i: 'room-column', x: 0, y: 0, w: columnWidths[0], h: 1, static: true },
                    { i: 'name-column', x: columnWidths[0], y: 0, w: columnWidths[1], h: 1, static: true },
                    ...dateLayout.map((item, index) => ({
                        ...item,
                        x: columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                        y: 0,
                        w: columnWidths[index + 2],
                        h: 1,
                    })),
                    // Add the two additional columns at the end
                    { i: 'sum-column', x: lastColumnStart, y: 0, w: columnWidths[columnWidths.length - 2], h: 1, static: true },
                    { i: 'hotel-column', x: lastColumnStart + columnWidths[columnWidths.length - 2], y: 0, w: columnWidths[columnWidths.length - 1], h: 1, static: true }
                ]}
                cols={sumOfAllColWidths}
                rowHeight={20}
                width={width}
                isDraggable={false}
                isResizable={false}
            >
                <div key="room-column" className="grid-cell header">Telpa</div>
                <div key="name-column" className="grid-cell header">Vārds</div>
                {dateLayout.map((item) => (
                    <div key={item.i} className="grid-cell">
                        {item.title}
                    </div>
                ))}
                {/* Add the new column divs */}
                <div key="sum-column" className="grid-cell header"></div>
                <div key="hotel-column" className="grid-cell header">Viesnīca</div>
            </GridLayout>
        </>
    );
}