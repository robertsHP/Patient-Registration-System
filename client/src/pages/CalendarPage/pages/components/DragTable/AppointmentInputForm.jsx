import React, { useState, useEffect } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow';
import InputAndSelect from '../../../../../components/InputAndSelect';

import ApiService from '../../../../../services/ApiService.js';

import './AppointmentInputForm.css';

export default function AppointmentInputForm({ selectedAppointment, setSelectedAppointment }) {
    const [formData, setFormData] = useState({
        patient: null,
        patient_phone: '',
        begin_date: '',
        end_date: '',
        notes: '',
        doctor: null,
        hotel_stay_start: '',
        hotel_stay_end: '',
        appointment_type: null,
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Fetch doctors and patients data when component mounts
        const fetchDoctorsAndPatients = async () => {
            try {
                const [doctorsData, patientsData] = await Promise.all([
                    ApiService.get('/api/doctor'),
                    ApiService.get('/api/patient')
                ]);

                setDoctors(doctorsData);
                setPatients(patientsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchDoctorsAndPatients();
    }, []);

    const onWindowClose = () => {
        setSelectedAppointment(null);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onChange = (value, label) => {
        setFormData({ ...formData, [label]: value });
    };

    const onAddOption = (value, label) => {
        const addOption = (newValue, label, optionsList, setOptionsList) => {
            setFormData({ ...formData, [label]: newValue });

            ApiService.post(`/api/${label}`, newValue)
                .then((result) => {
                    newValue.id = result;
                    setFormData({ ...formData, [label]: newValue });
                    setOptionsList([...optionsList, newValue]);
                })
                .catch((error) => {
                    console.log(`AppointmentInputForm (${label}) POST error: `);
                    console.log(error);
                });
        };

        if (label === 'doctor') {
            addOption(
                { doc_name: value },
                label,
                doctors,
                setDoctors
            );
        } else if (label === 'patient') {
            addOption(
                { pat_name: value, phone_num: null },
                label,
                patients,
                setPatients
            );
        }
    };

    const onDeleteOption = (option, label) => {
        const deleteOption = (message, option, label, optionsList, setOptionsList) => {
            ConfirmationWindow.show(
                message,
                () => {
                    if (formData[label] != null) {
                        if (formData[label].id === option.id) {
                            setFormData({ ...formData, [label]: null });
                        }
                    }

                    ApiService.delete(`/api/input-form/${label}/${option.id}`, option)
                        .then((result) => {
                            console.log(result);

                            setOptionsList(
                                optionsList.filter(value => value !== option)
                            );
                        })
                        .catch((error) => {
                            console.log(`AppointmentInputForm (${label}) DELETE error: `);
                            console.log(error);
                        });
                },
                () => { }
            );
        };

        if (label === 'doctor') {
            deleteOption(
                `
                    Vai tiešām vēlaties dzēst ārstu? 
                    Visi dati, kas ir saistīti ar šo personu tiks neatgriezeniski dzēsti.
                `,
                option, label, doctors, setDoctors
            );
        } else if (label === 'patient') {
            deleteOption(
                `
                    Vai tiešām vēlaties dzēst pacientu? 
                    Visi dati, kas ir saistīti ar šo personu tiks neatgriezeniski dzēsti.
                `,
                option, label, patients, setPatients
            );
        }
    };

    const onSave = () => {
        console.log('Save function called');
    };

    const onDelete = () => {
        console.log('Delete function called');
    };

    return (
        <>
            <div className="window-overlay">
                <div className="window">
                    <div className="window-header">
                        <button className="close-button" onClick={onWindowClose}>
                            X
                        </button>
                    </div>
                    <form className="window-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pat_name">Patient Name:</label>
                                <InputAndSelect
                                    options={patients}
                                    nameColumn={'pat_name'}
                                    value={formData.patient != null ? formData.patient.pat_name : ''}
                                    handleOnChange={(value) => { onChange(value, 'patient'); }}
                                    handleAddOption={(value) => onAddOption(value, 'patient')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'patient')}
                                    placeholder="Ievadi pacienta vārdu un uzvārdu"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="patient_phone">Patient Phone Number:</label>
                                <input
                                    type="text"
                                    id="patient_phone"
                                    name="patient_phone"
                                    value={formData.patient_phone}
                                    onChange={onInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <div className="form-group">
                                    <label htmlFor="begin_date">Start Date:</label>
                                    <input
                                        type="datetime-local"
                                        id="begin_date"
                                        name="begin_date"
                                        value={formData.begin_date}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end_date">End Date:</label>
                                    <input
                                        type="datetime-local"
                                        id="end_date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_start">Hotel Stay Start:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_start"
                                        name="hotel_stay_start"
                                        value={formData.hotel_stay_start}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_end">Hotel Stay End:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_end"
                                        name="hotel_stay_end"
                                        value={formData.hotel_stay_end}
                                        onChange={onInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="notes">Notes:</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="doc_name">Doctor Name:</label>
                                <InputAndSelect
                                    options={doctors}
                                    nameColumn={'doc_name'}
                                    value={formData.doctor != null ? formData.doctor.doc_name : ''}
                                    handleOnChange={(value) => { onChange(value, 'doctor'); }}
                                    handleAddOption={(value) => onAddOption(value, 'doctor')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'doctor')}
                                    placeholder="Ievadi ārsta vārdu un uzvārdu"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="appointment_type">Appointment Type:</label>
                                <InputAndSelect
                                    options={[] /* Add appointment types if available */}
                                    nameColumn={'appointment_type'}
                                    value={formData.appointment_type != null ? formData.appointment_type : ''}
                                    handleOnChange={(value) => { onChange(value, 'appointment_type'); }}
                                    handleAddOption={(value) => onAddOption(value, 'appointment_type')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'appointment_type')}
                                    placeholder="Ievadi vizītes veidu"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <button type="button" onClick={onSave}>Save</button>
                            <button type="button" onClick={onDelete}>Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
