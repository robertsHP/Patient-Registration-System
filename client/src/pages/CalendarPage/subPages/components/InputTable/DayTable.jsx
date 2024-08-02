import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const generateLayout = (rows, colCount) => {
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
    rows.forEach((row, rowIndex) => {
        for (let col = 0; col < colCount; col++) {
            layout.push({
                i: `cell-${rowIndex}-${col}`,
                x: col,
                y: rowIndex + 2,
                w: 1,
                h: 1,
                static: true,
            });
        }
    });
    // Add button row
    layout.push({
        i: 'add-button',
        x: 0,
        y: rows.length + 2,
        w: colCount,
        h: 1,
        static: true,
    });

    return layout;
};

export default function DayTable({ monthName, dayName, dayNumber }) {
    const columns = ["Laiks", "Vārds un uzvārds", "Telefona numurs", "Piezīmes", "Kas pieņēma", ""];
    const [rows, setRows] = useState([{}, {}, {}]);

    const layout = generateLayout(rows, columns.length);

    const handleAddRow = () => {
        setRows([...rows, {}]);
    };

    const handleDeleteRow = (rowIndex) => {
        setRows(rows.filter((_, index) => index !== rowIndex));
    };

    return (
        <div className="grid-container">
            <GridLayout
                className="layout"
                layout={layout}
                cols={columns.length}
                rowHeight={30} // Adjust the height as needed
                width={columns.length * 150} // Adjust the width as needed
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
                {rows.map((_, rowIndex) =>
                    columns.map((col, colIndex) => (
                        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-item">
                            {colIndex === columns.length - 1 ? (
                                <button className="grid-button" onClick={() => handleDeleteRow(rowIndex)}>
                                    X
                                </button>
                            ) : (
                                <input type="text" className="grid-input" onChange={() => {}} />
                            )}
                        </div>
                    ))
                )}
                <button key="add-button" className="grid-button add-button" onClick={handleAddRow}>
                    Add Row
                </button>
            </GridLayout>
        </div>
    );
}
