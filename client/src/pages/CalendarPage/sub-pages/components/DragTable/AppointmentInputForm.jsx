import React, { useState, useEffect } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputSelector from '../../../../../components/InputSelector.jsx';

import ApiService from '../../../../../services/ApiService.js';

import './AppointmentInputForm.css';

export default function AppointmentInputForm({ data, selectedAppointment, setSelectedAppointment }) {
    const [formData, setFormData] = useState({
        patient: selectedAppointment.patient,
        begin_date: selectedAppointment.begin_date,
        end_date: selectedAppointment.end_date,
        notes: selectedAppointment.notes,
        doctor: selectedAppointment.doctor,
        hotel_stay_start: selectedAppointment.hotel_stay_start,
        hotel_stay_end: selectedAppointment.hotel_stay_end,
        appointment_type: selectedAppointment.appointment_type
    });
    
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointmentTypes, setAppointmentTypes] = useState([]);

    useEffect(() => {
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

        console.log(formData);

        fetchData();
    }, []);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onChange = (value, label) => {
        if (label === 'patient') {
            setFormData({ 
                ...formData, 
                patient: value,
            });
        } else {
            setFormData({ ...formData, [label]: value });
        }
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
            } else if (label === 'appointment_type') {
                setAppointmentTypes([...appointmentTypes, newValue]);
            }
        } catch (error) {
            console.log(`AppointmentInputForm (${label}) POST error: `, error);
        }
    };

    const onDeleteOption = async (option, label) => {
        try {
            await ApiService.delete(`/api/${label}/${option.id}`);

            if (label === 'doctor') {
                setDoctors(doctors.filter(doc => doc.id !== option.id));
            } else if (label === 'patient') {
                setPatients(patients.filter(pat => pat.id !== option.id));
            } else if (label === 'appointment_type') {
                setAppointmentTypes(appointmentTypes.filter(type => type.id !== option.id));
            }
        } catch (error) {
            console.log(`AppointmentInputForm (${label}) DELETE error: `, error);
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
                    var url = `/api/calendar-page/drag-table/appointment/${id}`;

                    await ApiService.delete(url);
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
                                <InputSelector
                                    options={patients}
                                    nameColumn={'pat_name'}
                                    value={
                                        formData.patient != null ? 
                                            formData.patient.pat_name 
                                            : 
                                            ''
                                    }
                                    handleOnChange={(patient) => onChange(patient, 'patient')}
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
                                    value={
                                        formData.patient != null ? 
                                            formData.patient.phone_num != null ?
                                                formData.patient.phone_num
                                                :
                                                ''
                                            : 
                                            ''
                                    }
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
                                        value={formData.begin_date.getDateStringForHTMLTag()}
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
                                        value={formData.end_date.getDateStringForHTMLTag()}
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
                                        value={
                                            formData.hotel_stay_start ?
                                                formData.hotel_stay_start.getDateStringForHTMLTag()
                                                :
                                                ''
                                        }
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_end">Hotel Stay End:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_end"
                                        name="hotel_stay_end"
                                        value={
                                            formData.hotel_stay_end ?
                                                formData.hotel_stay_end.getDateStringForHTMLTag()
                                                :
                                                ''
                                        }
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
                                    value={
                                        formData.notes ?
                                            formData.notes 
                                            :
                                            ''
                                    }
                                    onChange={onInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="doc_name">Doctor Name:</label>
                                <InputSelector
                                    options={doctors}
                                    nameColumn={'doc_name'}
                                    value={
                                        formData.doctor != null ? 
                                            formData.doctor.doc_name 
                                            : 
                                            ''
                                    }
                                    handleOnChange={(value) => { onChange(value, 'doctor'); }}
                                    handleAddOption={(value) => onAddOption(value, 'doctor')}
                                    handleDeleteOption={(value) => onDeleteOption(value, 'doctor')}
                                    placeholder="Ievadi ārsta vārdu un uzvārdu"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="appointment_type">Appointment Type:</label>
                                <InputSelector
                                    options={appointmentTypes}
                                    nameColumn={'type_name'}
                                    value={
                                        formData.appointment_type != null ? 
                                            formData.appointment_type.type_name 
                                            : 
                                            ''
                                    }
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
