import React, { useEffect, useState } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputAndSelect from '../../../../../components/InputAndSelect.jsx';

import ApiService from '../../../../../services/ApiService.js';

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
                h: 1, // Set the initial height of the notes column to 1
                static: col === 3 ? false : true, // Allow resizing only for the notes column
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

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Fetch doctors and patients data when component mounts
        const fetchData = async () => {
            try {
                const [doctorsData, patientsData] = await Promise.all([
                    ApiService.get('/api/global/doctor'),
                    ApiService.get('/api/global/patient')
                ]);

                setDoctors(doctorsData);
                setPatients(patientsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);
    
    const [rows, setRows] = useState(
        appointments.length ? 
            appointments.map(appt => ({ ...appt, hasChanged: false })) 
            : 
            [{}, {}, {}]
    );

    const [layout, setLayout] = useState(generateLayout(rows, columns.length));

    const handleAddRow = () => {
        const newRows = [...rows, {}];
        setRows(newRows);
        setLayout(generateLayout(newRows, columns.length));
    };

    const handleDeleteRow = (rowIndex) => {
        const newRows = rows.filter((_, index) => index !== rowIndex);
        setRows(newRows);
        setLayout(generateLayout(newRows, columns.length));
    };

    const handleChange = (rowIndex, field, value) => {
        const newRows = rows.map((row, index) => 
            index === rowIndex ? { ...row, [field]: value, hasChanged: true } : row
        );
        setRows(newRows);
    };

    const handleSave = (rowIndex) => {
        const newRows = rows.map((row, index) => 
            index === rowIndex ? { ...row, hasChanged: false } : row
        );
        setRows(newRows);
        // Perform the save operation here (e.g., send the data to the server)
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
                onResizeStop={(layout, oldItem, newItem) => {
                    if (newItem.i.startsWith('cell') && newItem.i.split('-')[2] === '3') {
                        // Update the layout to extend the contents below when resizing
                        setLayout(layout);
                    }
                }}
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
                        <div 
                            key={`cell-${rowIndex}-${colIndex}`} 
                            className={`grid-item ${colIndex === 0 ? 'date-column' : ''} ${colIndex === 3 ? 'notes-column' : ''}`}
                        >
                            {colIndex === columns.length - 1 ? (
                                <>
                                    <button 
                                        className="grid-button save-button" 
                                        onClick={() => handleSave(rowIndex)}
                                        disabled={!row.hasChanged}
                                    >
                                        S
                                    </button>
                                    <button 
                                        className="grid-button delete-button" 
                                        onClick={() => handleDeleteRow(rowIndex)}
                                    >
                                        X
                                    </button>
                                </>
                            ) : colIndex === 0 ? (
                                <input 
                                    type="time" 
                                    className="grid-input" 
                                    value={row.begin_date ? 
                                        row.begin_date.toTimeString().slice(0, 5)
                                        : 
                                        ''
                                    }
                                    onChange={(e) => handleChange(rowIndex, 'begin_date', e.target.value)} 
                                />
                            ) : colIndex === 1 ? (
                                <InputAndSelect
                                    options={patients}
                                    nameColumn={'pat_name'}
                                    value={row.patient != null ? row.patient.pat_name : ''}
                                    handleOnChange={(value) => { onChange(value, 'patient'); }}
                                    handleAddOption={(value) => onAddOption(value, 'patient')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'patient')}
                                    placeholder=""
                                />

                            ) : colIndex === 2 ? (
                                <input 
                                    type="text" 
                                    className="grid-input" 
                                    value={row.patient ? row.patient.phone_num : ''}
                                    onChange={(e) => handleChange(rowIndex, 'patient', { ...row.patient, phone_num: e.target.value })} 
                                />
                            ) : colIndex === 3 ? (
                                <input 
                                    type="text"
                                    className="grid-input" 
                                    value={row.notes ? row.notes : ''}
                                    onChange={(e) => handleChange(rowIndex, 'notes', e.target.value)} 
                                />
                            ) : colIndex === 4 ? (
                                <input 
                                    type="text" 
                                    className="grid-input" 
                                    value={row.doctor ? row.doctor.doc_name : ''}
                                    onChange={(e) => handleChange(rowIndex, 'doctor', { ...row.doctor, doc_name: e.target.value })} 
                                />
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
