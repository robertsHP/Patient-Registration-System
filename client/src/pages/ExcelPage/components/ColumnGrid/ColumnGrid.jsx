import React, { useState } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import DayCell from './DayCell';

import './ColumnGrid.css';

export default function ColumnGrid({ data }) {
    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
        <GridLayout
            className="layout"
            layout={data.layout.map(item => ({ ...item, y: 0 }))}
            cols={data.layout.length}
            rowHeight={50}
            width={1200}
            isDraggable={false}
            isResizable={false}
        >
            {data.layout.map((item) => (
                <div key={item.i}>
                    <DayCell date={item.date} />
                </div>
            ))}
        </GridLayout>
    </div>
    );
}