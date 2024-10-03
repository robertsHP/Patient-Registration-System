import React, { useEffect, useState } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputSelector from '../../../../../components/InputSelector.jsx';

import LVDate from '../../../../../models/LVDate.jsx';

import ApiService from '../../../../../services/ApiService.js';

import './DayTable.css';

export default function DayTable({ monthName, dayName, date, appointments }) {
    const columns = ["Laiks", "Vārds un uzvārds", "Telefona numurs", "Piezīmes", "Kas pieņēma", ""];

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [rows, setRows] = useState([]);

    const getDefaultRow = () => {
        return {
            id: null,
            begin_date: null,
            doctor: null,
            patient: null,
            notes: "",
        };
    }

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

    useEffect(() => {
        setRows(appointments.length ? 
            appointments.map(appt => ({ ...appt, hasChanged: false })) 
            : 
            [getDefaultRow(), getDefaultRow(), getDefaultRow()]
        );
    }, [appointments]);

    const prepareRowForSendingToDB = (row) => {
        return {
            id: row.id,
            begin_date: row.begin_date != null ? 
                row.begin_date.toDateString() 
                : 
                new LVDate(date.getFullYear(), date.getMonth(), date.getDate()).toDateString(),
            doctor: row.doctor,
            notes: row.notes,
            patient: row.patient
        };
    }

    const handleAddRow = () => {
        const newRows = [...rows, {}];
        setRows(newRows);
    };

    const handleDeleteRow = async (rowIndex) => {
        const deletedRow = rows.find((_, index) => index === rowIndex);
        const newRows = rows.filter((_, index) => index !== rowIndex);
        
        setRows(newRows);

        try {
            const finalRow = prepareRowForSendingToDB(deletedRow);
            const params = `/api/calendar-page/input-table/appointment/${finalRow.id}`;

            await ApiService.delete(params, finalRow);
        } catch (error) {
            console.log("DayTable error: ");
            console.log(error);
        }
    };

    const onInputChange = (rowIndex, label, value) => {
        const getFinalValue = (label, data) => {
            const splitLabel = label.split('.');

            return {
                ...data,
                [splitLabel[1]]: value
            };
        }

        var finalLabel = label;
        var finalValue = value;

        const newRows = rows.map((row, index) => {
            if (index === rowIndex) {
                if (label.includes('patient')) {
                    finalLabel = 'patient';
                    finalValue = getFinalValue(label, row[finalLabel]);
                } else if (label.includes('doctor')) {
                    finalLabel = 'doctor';
                    finalValue = getFinalValue(label, row[finalLabel]);
                } else if (label.includes('appointment_type')) {
                    finalLabel = 'appointment_type';
                    finalValue = getFinalValue(label, row[finalLabel]);
                }

                return {
                    ...row,
                    [finalLabel]: finalValue
                };
            } else {
                return row;
            }
        });

        setRows(newRows);
    };

    const onSelectChange = (rowIndex, label, value) => {
        console.log("onSelectChange");

        const newRows = rows.map((row, index) => {
            if (index === rowIndex) {
                return {
                    ...row,
                    [label]: value,
                    hasChanged: true
                };
            } else {
                return row;
            }

        });

        setRows(newRows);
    };

    const handleChange = (rowIndex, field, value) => {
        if (field == "begin_date") {
            if(typeof value === 'string') {
                const splitStr = value.split(":");
                const intArray = splitStr.map((item) => parseInt(item));

                value = new LVDate(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    intArray[0],
                    intArray[1]
                );
            }
        }

        const newRows = rows.map((row, index) => 
            index === rowIndex ? { ...row, [field]: value, hasChanged: true } : row
        );
        setRows(newRows);
    };

    const onChangePatient = (rowIndex, patient) => {
        const newRows = rows.map((row, index) => 
            index === rowIndex ? 
                { 
                    ...row, 
                    patient,
                    hasChanged: true 
                } 
                : 
                row
        );
        setRows(newRows);
    };

    const handleSave = async (rowIndex) => {
        let changedRow = null;
    
        const newRows = rows.map((row, index) => {
            if (index === rowIndex) {
                changedRow = { ...row, hasChanged: false };
                return changedRow;
            }
            return row;
        });

        setRows(newRows);

        try {
            const finalRow = prepareRowForSendingToDB(changedRow);

            if (changedRow.id == null) {
                const params = '/api/calendar-page/input-table/appointment';
                const result = await ApiService.post(params, finalRow);

                changedRow.id = result;
            } else {
                const params = `/api/calendar-page/input-table/appointment/${finalRow.id}`;
                const result = await ApiService.put(params, finalRow);

                console.log(result);
            }
        } catch (error) {
            console.log("DayTable error: ");
            console.log(error);
        }
    };

    const onDeleteOption = async (label, option) => {
        try {
            await ApiService.delete(`/api/${label}/${option.id}`);
            if (label === 'doctor') {
                setDoctors(doctors.filter(doc => doc.id !== option.id));
            } else if (label === 'patient') {
                setPatients(patients.filter(pat => pat.id !== option.id));
            }
        } catch (error) {
            console.log(`DayTable (${label}) DELETE error: `, error);
        }
    };

    return (
        <div className="day-table">
            <div className="day-table__table-head">
                {`${date.getDate()} - ${dayName}`}
            </div>
            <table className="day-table__table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <input 
                                    type="time" 
                                    className="day-table__input" 
                                    value={row.begin_date ? row.begin_date.toTimeString().slice(0, 5) : ''}
                                    onChange={(e) => handleChange(rowIndex, 'begin_date', e.target.value)} 
                                />
                            </td>
                            <td>
                                <InputSelector
                                    options={patients}
                                    nameColumn={'pat_name'}
                                    value={
                                        row.patient != null ? 
                                            row.patient.pat_name 
                                            : 
                                            ''
                                        }
                                    defaultValue={{
                                        id: null,
                                        pat_name: null,
                                        phone_num: null
                                    }}
                                    handleInputChange={(value) => onInputChange(
                                        rowIndex,
                                        'patient.pat_name', 
                                        value['pat_name']
                                    )}
                                    handleSelectOption={(value) => onSelectChange(
                                        rowIndex,
                                        'patient', 
                                        value
                                    )}

                                    handleDeleteOption={(value) => onDeleteOption('patient', value)}
                                    className="day-table__input"
                                    placeholder=""
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="day-table__input" 
                                    value={
                                        row.patient != null ? 
                                            row.patient.phone_num != null ?
                                                row.patient.phone_num
                                                :
                                                ''
                                            : 
                                            ''
                                    }
                                    onChange={(e) => handleChange(
                                        rowIndex, 
                                        'patient', 
                                        { ...row.patient, phone_num: e.target.value }
                                    )} 
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="day-table__input" 
                                    value={row.notes ? row.notes : ''}
                                    onChange={(e) => handleChange(rowIndex, 'notes', e.target.value)} 
                                />
                            </td>
                            <td>
                                <InputSelector
                                    options={doctors}
                                    nameColumn={'doc_name'}
                                    value={row.doctor != null ? row.doctor.doc_name : ''}
                                    defaultValue={{
                                        id: null,
                                        doc_name: null
                                    }}

                                    handleInputChange={(value) => onInputChange(
                                        rowIndex,
                                        'doctor.doc_name', 
                                        value['doc_name']
                                    )}
                                    handleSelectOption={(value) => onSelectChange(
                                        rowIndex,
                                        'doctor', 
                                        value
                                    )}

                                    handleDeleteOption={(value) => onDeleteOption('doctor', value)}
                                    className="day-table__input"
                                    placeholder=""
                                />
                            </td>
                            <td>
                                <button 
                                    className="day-table__save-button" 
                                    onClick={() => handleSave(rowIndex)}
                                    disabled={!row.hasChanged}
                                >
                                    S
                                </button>
                                <button 
                                    className="day-table__delete-button" 
                                    onClick={() => handleDeleteRow(rowIndex)}
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="day-table__add-button" onClick={handleAddRow}>
                Add Row
            </button>
        </div>
    );
}


