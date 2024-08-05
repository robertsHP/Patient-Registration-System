import React, { useEffect, useState } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputSelector from '../../../../../components/InputSelector.jsx';

import ApiService from '../../../../../services/ApiService.js';

import './DayTable.css';

export default function DayTable({ monthName, dayName, dateNumber, appointments }) {
    const columns = ["Laiks", "Vārds un uzvārds", "Telefona numurs", "Piezīmes", "Kas pieņēma", ""];

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [rows, setRows] = useState(appointments.length ? 
        appointments.map(appt => ({ ...appt, hasChanged: false })) 
        : 
        [{}, {}, {}]
    );

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
    
    const handleAddRow = () => {
        const newRows = [...rows, {}];
        setRows(newRows);
    };

    const handleDeleteRow = (rowIndex) => {
        const newRows = rows.filter((_, index) => index !== rowIndex);
        setRows(newRows);
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

    const onChangePatient = (rowIndex, patient) => {
        const newRows = rows.map((row, index) => 
            index === rowIndex ? { ...row, patient, patient_phone: patient.phone_num, hasChanged: true } : row
        );
        setRows(newRows);
    };

    const onAddOption = async (value, label) => {
        const newValue = { name: value };
        try {
            const result = await ApiService.post(`/api/${label}`, newValue);
            newValue.id = result;
            if (label === 'doctor') {
                setDoctors([...doctors, newValue]);
            } else if (label === 'patient') {
                setPatients([...patients, newValue]);
            }
        } catch (error) {
            console.log(`DayTable (${label}) POST error: `, error);
        }
    };

    const onDeleteOption = async (option, label) => {
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
                {`${monthName} ${dateNumber} - ${dayName}`}
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
                                    value={row.patient != null ? row.patient.pat_name : ''}
                                    handleOnChange={(patient) => { onChangePatient(rowIndex, patient); }}
                                    handleAddOption={(value) => onAddOption(value, 'patient')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'patient')}
                                    className="day-table__input"
                                    placeholder=""
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="day-table__input" 
                                    value={row.patient ? row.patient.phone_num : ''}
                                    onChange={(e) => handleChange(rowIndex, 'patient', { ...row.patient, phone_num: e.target.value })} 
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
                                    handleOnChange={(value) => handleChange(rowIndex, 'doctor', value)}
                                    handleAddOption={(value) => onAddOption(value, 'doctor')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'doctor')}
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


