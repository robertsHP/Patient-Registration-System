import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const generateLayout = (rows, colCount) => {
    const layout = [];
    layout.push({
        i: 'month-day-header',
        x: 0,
        y: 0,
        w: colCount,
        h: 1,
        static: true,
    });
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

export default function DayTable({ monthName, dayName, dateNumber, appointments }) {
    const columns = ["Laiks", "Vārds un uzvārds", "Telefona numurs", "Piezīmes", "Kas pieņēma", ""];
    
    const initialRows = appointments.length ? appointments : [{}, {}, {}];
    const [rows, setRows] = useState(initialRows);

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
                rowHeight={30}
                width={columns.length * 150}
                isResizable={false}
                isDraggable={false}
                margin={[0, 0]}
                containerPadding={[0, 0]}
            >
                <div key="month-day-header" className="grid-item month-day-header">
                    {`${monthName} ${dateNumber} - ${dayName}`}
                </div>
                {columns.map((col, index) => (
                    <div key={`header-${index}`} className="grid-item header">
                        {col}
                    </div>
                ))}
                {rows.map((row, rowIndex) =>
                    columns.map((col, colIndex) => (
                        <div key={`cell-${rowIndex}-${colIndex}`} className="grid-item">
                            {colIndex === columns.length - 1 ? (
                                <button className="grid-button" onClick={() => handleDeleteRow(rowIndex)}>
                                    X
                                </button>
                            ) : colIndex === 0 ? (
                                row.begin_date ? (
                                    new Date(row.begin_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                ) : (
                                    <input type="text" className="grid-input" onChange={() => {}} />
                                )
                            ) : colIndex === 1 ? (
                                row.patient_data ? (
                                    row.patient_data.pat_name
                                ) : (
                                    <input type="text" className="grid-input" onChange={() => {}} />
                                )
                            ) : colIndex === 2 ? (
                                row.patient_data ? (
                                    row.patient_data.phone_num
                                ) : (
                                    <input type="text" className="grid-input" onChange={() => {}} />
                                )
                            ) : colIndex === 3 ? (
                                row.notes ? (
                                    row.notes
                                ) : (
                                    <input type="text" className="grid-input" onChange={() => {}} />
                                )
                            ) : colIndex === 4 ? (
                                row.doctor_data ? (
                                    row.doctor_data.doc_name
                                ) : (
                                    <input type="text" className="grid-input" onChange={() => {}} />
                                )
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
