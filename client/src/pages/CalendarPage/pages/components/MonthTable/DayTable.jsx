import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const generateLayout = (rowCount, colCount) => {
    const layout = [];
    // Header row for month and day names
    layout.push({
        i: 'month-day-header',
        x: 0,
        y: 0,
        w: colCount,
        h: 1,
        static: true,
    });
    // Column headers
    for (let i = 0; i < colCount; i++) {
        layout.push({
            i: `header-${i}`,
            x: i,
            y: 1,
            w: 1,
            h: 1,
            static: true,
        });
    }
    // Cells
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            layout.push({
                i: `cell-${row}-${col}`,
                x: col,
                y: row + 2,
                w: 1,
                h: 1,
                static: true,
            });
        }
    }
    return layout;
};

export default function DayTable({ monthName, dayName, dayNumber }) {
    const columns = ["Time", "Name and surname", "Phone number", "Notes", "Doctor"];
    const rowCount = 5;

    const layout = generateLayout(rowCount, columns.length);

    return (
        <div className="grid-container">
            <GridLayout
                className="layout"
                layout={layout}
                cols={columns.length}
                rowHeight={30} // Adjust the height as needed
                width={columns.length * 175} // Adjust the width as needed
                isResizable={false}
                isDraggable={false}
                margin={[0, 0]} // No margin between grid items
                containerPadding={[0, 0]} // No padding in the container
            >
                <div key="month-day-header" className="grid-item month-day-header">
                    {`${monthName} ${dayNumber} - ${dayName}`}
                </div>
                {columns.map((col, index) => (
                    <div key={`header-${index}`} className="grid-item header">
                        {col}
                    </div>
                ))}
                {Array.from({ length: rowCount }).map((_, rowIndex) =>
                    columns.map((_, colIndex) => (
                        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-item">
                            <input type="text" className="grid-input" onChange={() => {}} />
                        </div>
                    ))
                )}
            </GridLayout>
        </div>
    );
}
