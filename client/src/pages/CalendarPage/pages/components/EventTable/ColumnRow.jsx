import React, { useState, useRef } from 'react';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ColumnRow.css';

export default function ColumnRow({ config }) {
    const lastColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2)
        .reduce((acc, width) => acc + width, 0);

    return (
        <>
            <GridLayout
                className="column-row"
                layout={[
                    { 
                        i: 'room-column', 
                        x: 0, 
                        y: 0, 
                        w: config.columnWidths[0], 
                        h: 1, 
                        static: true 
                    },
                    { i
                        : 'name-column', 
                        x: config.columnWidths[0], 
                        y: 0, 
                        w: config.columnWidths[1], 
                        h: 1, 
                        static: true 
                    },
                    ...config.dateLayout.map((item, index) => ({
                        ...item,
                        x: config.columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                        y: 0,
                        w: config.columnWidths[index + 2],
                        h: 1,
                        static: true
                    })),
                    // Add the two additional columns at the end
                    { 
                        i: 'sum-column', 
                        x: lastColumnStart, 
                        y: 0, 
                        w: config.columnWidths[config.columnWidths.length - 2], 
                        h: 1, 
                        static: true 
                    },
                    { 
                        i: 'hotel-column', 
                        x: lastColumnStart + config.columnWidths[config.columnWidths.length - 2], 
                        y: 0, 
                        w: config.columnWidths[config.columnWidths.length - 1], 
                        h: 1, 
                        static: true 
                    }
                ]}
                cols={config.cols}
                rowHeight={config.rowHeight}
                width={config.width}
                isDraggable={false}
                isResizable={false}
            >
                <div key="room-column" className="grid-cell header">Telpa</div>
                <div key="name-column" className="grid-cell header">Vārds</div>
                {config.dateLayout.map((date) => (
                    <div key={date.i} className="grid-cell">
                        {date.num}
                    </div>
                ))}
                <div key="sum-column" className="grid-cell header"></div>
                <div key="hotel-column" className="grid-cell header">Viesnīca</div>
            </GridLayout>
        </>
    );
}