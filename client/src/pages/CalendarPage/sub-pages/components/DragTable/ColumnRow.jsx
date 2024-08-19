import React, { useState, useRef, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ColumnRow.css';

export default function ColumnRow({ config }) {
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
                    ...config.dateLayout.map((item, index) => ({
                        ...item,
                        x: config.columnWidths.slice(0, index + 1).reduce((acc, width) => acc + width, 0),
                        y: 0,
                        w: config.columnWidths[index + 1],
                        h: 1,
                        static: true
                    })),
                    { 
                        i: 'sum-column', 
                        x: config.getDateColumnsEnd(), 
                        y: 0, 
                        w: config.columnWidths[config.columnWidths.length - 2], 
                        h: 1, 
                        static: true 
                    },
                    { 
                        i: 'delete-gap', 
                        x: config.getDateColumnsEnd() + config.columnWidths[config.columnWidths.length - 2],
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
                <div key="room-column">Telpa</div>

                {config.dateLayout.map((date) => (
                    <div key={date.i}>
                        {date.num}
                    </div>
                ))}

                <div key="sum-column"></div>
                <div key="delete-gap"></div>
            </GridLayout>
        </>
    );
}

