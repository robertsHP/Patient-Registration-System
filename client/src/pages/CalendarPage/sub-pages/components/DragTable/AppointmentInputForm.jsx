import React, { useState, useEffect } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputAndSelect from '../../../../../components/InputAndSelect.jsx';

import ApiService from '../../../../../services/ApiService.js';

import './AppointmentInputForm.css';

export default function AppointmentInputForm({ data, selectedAppointment, setSelectedAppointment }) {
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
    const [appointmentTypes, setAppointmentTypes] = useState([]);

    useEffect(() => {
        // Fetch doctors and patients data when component mounts
        const fetchData = async () => {
            try {
                const [doctorsData, patientsData, typesData] = await Promise.all([
                    ApiService.get('/api/global/doctor'),
                    ApiService.get('/api/global/patient'),
                    ApiService.get('/api/global/appointment_type')
                ]);

                setDoctors(doctorsData);
                setPatients(patientsData);
                setAppointmentTypes(typesData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onChange = (value, label) => {
        setFormData({ ...formData, [label]: value });
    };

    const onAddOption = (value, label) => {
        const addOption = async (newValue, label, optionsList, setOptionsList) => {
            setFormData({ ...formData, [label]: newValue });

            try {
                const result = await ApiService.post(`/api/${label}`, newValue);
                newValue.id = result;
                setFormData({ ...formData, [label]: newValue });
                setOptionsList([...optionsList, newValue]);
            } catch (error) {
                console.log(`AppointmentInputForm (${label}) POST error: `);
                console.log(error);
            }
        };

        var finalValue = null;
        var optionsList = null;
        var setOptionsList = null;

        if (label === 'doctor') {
            finalValue = { doc_name: value };
            optionsList = doctors;
            setOptionsList = setDoctors;
        } else if (label === 'patient') {
            finalValue = { pat_name: value, phone_num: null };
            optionsList = patients;
            setOptionsList = setPatients;
        } else if (label === 'appointment_type') {
            finalValue = { type_name: value };
            optionsList = appointmentTypes;
            setOptionsList = setAppointmentTypes;
        }

        if (finalValue != null) {
            addOption(finalValue, label, optionsList, setOptionsList);
        }
    };

    const onDeleteOption = (option, label) => {
        const deleteOption = (message, option, label, optionsList, setOptionsList) => {
            ConfirmationWindow.show(
                message,
                async () => {
                    try {
                        var url = `/api/calendar-page/input-form/${label}/${option.id}`
    
                        await ApiService.delete(url);
                        setOptionsList(
                            optionsList.filter(value => value != option)
                        );

                        if (formData[label] != null) {
                            if (formData[label].id === option.id) {
                                setFormData({ ...formData, [label]: null });
                            }
                        }
                    } catch (error) {
                        console.log(`AppointmentInputForm (${label}) DELETE error: `);
                        console.log(error);
                    }
                },
                () => { }
            );
        };

        var messageLabel = null;
        var optionsList = null;
        var setOptionsList = null;

        if (label === 'doctor') {
            messageLabel = 'ārstu';
            optionsList = doctors;
            setOptionsList = setDoctors;
        } else if (label === 'patient') {
            messageLabel = 'pacientu';
            optionsList = patients;
            setOptionsList = setPatients;
        } else if (label === 'appointment_type') {
            messageLabel = 'veidu';
            optionsList = appointmentTypes;
            setOptionsList = setAppointmentTypes;
        }

        if (messageLabel != null) {
            deleteOption(
                `
                    Vai tiešām vēlaties dzēst ${messageLabel}? 
                    Visi dati, kas ir saistīti ar šo personu tiks neatgriezeniski dzēsti.
                `,
                option, label, optionsList, setOptionsList
            );
        }
    };


    const onWindowClose = () => {
        setSelectedAppointment(null);
    };

    const onCancel = () => {
        onWindowClose();
    };

    const onSave = (e) => {
        const updateAppointment = async () => {
            var url = `/api/calendar-page/drag-table/appointment/${selectedAppointment.id}`;

            try {
                await ApiService.put(url, formData);
                console.log('Updated appointment');
                onWindowClose();
            } catch (error) {
                console.log(`AppointmentInputForm (onSave) PUT error: `);
                console.log(error);
            }
        };

        e.preventDefault();
        // Custom validation logic here
        const isValid = validateForm();
        if (isValid) {
            console.log('Save function called');

            updateAppointment();
        }
    };

    const validateForm = () => {
        // Custom validation logic here
        // if (!formData.patient) {
        //     alert('Patient name is required.');
        //     return false;
        // }
        if (!formData.begin_date) {
            alert('Start date is required.');
            return false;
        }
        if (!formData.end_date) {
            alert('End date is required.');
            return false;
        }
        if (!formData.hotel_stay_start) {
            alert('Hotel start date is required.');
            return false;
        }
        if (!formData.hotel_stay_end) {
            alert('Hotel end date is required.');
            return false;
        }
        // if (!formData.notes) {
        //     alert('Notes are required.');
        //     return false;
        // }
        // Add other validation rules as needed
        return true;
    };

    const onDelete = () => {
        console.log('Delete function called');

        ConfirmationWindow.show(
            `Vai tiešām vēlaties dzēst pierakstu?`,
            async () => {
                var id = selectedAppointment.id;

                data.removeAppointmentWithID(id);
                
                try {
                    var url = `/api/calendar-page/drag-table/appointment/${id}`

                    await ApiService.delete(url);
                    console.log('Deleted appointment');
                    onWindowClose();
                } catch (error) {
                    console.log(`AppointmentInputForm (onDelete) DELETE error: `);
                    console.log(error);
                }
            },
            () => { }
        );
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
                    <div className="window-form">
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
                                    options={appointmentTypes}
                                    nameColumn={'type_name'}
                                    value={formData.appointment_type != null ? formData.appointment_type : ''}
                                    handleOnChange={(value) => { onChange(value, 'appointment_type'); }}
                                    handleAddOption={(value) => onAddOption(value, 'appointment_type')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'appointment_type')}
                                    placeholder="Ievadi vizītes veidu"
                                />
                            </div>
                        </div>

                        <div className="form-row buttons">
                            <button type="button" className="cancel-button" onClick={onCancel}>Atcelt</button>
                            <button type="button" className="save-button" onClick={onSave}>Saglabāt</button>
                            <button type="button" className="delete-button" onClick={onDelete}>Dzēst</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
