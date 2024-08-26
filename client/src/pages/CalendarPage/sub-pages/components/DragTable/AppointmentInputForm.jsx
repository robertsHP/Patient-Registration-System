import React, { useState, useEffect } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow.jsx';
import InputSelector from '../../../../../components/InputSelector.jsx';

import LVDate from '../../../../../models/LVDate.jsx';

import ApiService from '../../../../../services/ApiService.js';

import * as dragTableUtilities from './utils/dragTableUtilities.jsx';

import './AppointmentInputForm.css';

export default function AppointmentInputForm(props) {
    if (props.selectedAppointmentData.appointment == undefined) {
        return <></>;
    }

    const [formData, setFormData] = useState({
        patient:            props.selectedAppointmentData.appointment.patient,
        begin_date:         props.selectedAppointmentData.appointment.begin_date,
        end_date:           props.selectedAppointmentData.appointment.end_date,
        notes:              props.selectedAppointmentData.appointment.notes,
        doctor:             props.selectedAppointmentData.appointment.doctor,
        hotel_stay_start:   props.selectedAppointmentData.appointment.hotel_stay_start,
        hotel_stay_end:     props.selectedAppointmentData.appointment.hotel_stay_end,
        appointment_type:   props.selectedAppointmentData.appointment.appointment_type
    });

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [errors, setErrors] = useState({});

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

        fetchData();
    }, []);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        console.log(formData);
    };

    const onChange = (value, label) => {
        setFormData({ ...formData, [label]: value });
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
        props.setSelectedAppointmentData(null);
    };

    const onCancel = () => {
        onWindowClose();
    };

    const validateForm = () => {
        const getDateValueAsLVObject = (date) => {
            if (typeof date == 'string') {
                date = new LVDate(date);
            }
            return date;
        };

        const newErrors = {};

        if (!formData.patient) {
            newErrors.patient = 'Patient is required.';
        }
        if (!formData.begin_date) {
            newErrors.begin_date = 'Start date is required.';
        }
        if (!formData.end_date) {
            newErrors.end_date = 'End date is required.';
        }
        if (formData.begin_date && formData.end_date) {
            var beginDate = getDateValueAsLVObject(formData.begin_date);
            var endDate = getDateValueAsLVObject(formData.end_date);

            if(beginDate.getObject() > endDate.getObject()) {
                newErrors.dateOrder = 'Start date cannot be after the end date.';
            }
        }
        if (formData.hotel_stay_start && formData.hotel_stay_end) {
            var hotelStayStart = getDateValueAsLVObject(formData.hotel_stay_start);
            var hotelStayEnd = getDateValueAsLVObject(formData.hotel_stay_end);

            if(hotelStayStart.getObject() > hotelStayEnd.getObject()) {
                newErrors.hotelDateOrder = 'Hotel stay start date cannot be after the hotel stay end date.';
            }
        }

        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    };

    const onSave = (e) => {
        const updateAppointment = async () => {
            const id = props.selectedAppointmentData.appointment.id;
            const url = `/api/calendar-page/drag-table/appointment/${id}`;
    
            try {
                const roomID = props.selectedAppointmentData.roomID;

                var convertedFormData = dragTableUtilities.convertAppointmentForSendingToDB(
                    roomID,
                    formData
                );

                // console.log(convertedFormData);

                const response = await ApiService.put(url, convertedFormData);
                console.log('Updated appointment', response);

                var appointment = dragTableUtilities.convertAppointmentForLayoutSupport(
                    formData,
                    props.data.date,
                    props.config
                );

                props.data.setAppointmentWithID(roomID, appointment);
                onWindowClose();
            } catch (error) {
                console.log('AppointmentInputForm (onSave) PUT error: ', error);
            }
        };

        e.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            updateAppointment();
        }
    };

    const onDelete = () => {
        ConfirmationWindow.show(
            'Vai tiešām vēlaties dzēst pierakstu?',
            async () => {
                const id = props.selectedAppointmentData.appointment.id;

                props.data.removeAppointmentWithID(
                    props.selectedAppointmentData.roomID,
                    id
                );

                try {
                    const url = `/api/calendar-page/drag-table/appointment/${id}`;
                    await ApiService.delete(url);

                    onWindowClose();
                } catch (error) {
                    console.log('AppointmentInputForm (onDelete) DELETE error: ', error);
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
                                {errors.patient && <div className="error-message">{errors.patient}</div>}
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
                                        value={
                                            formData.begin_date instanceof LVDate ? 
                                                formData.begin_date.getDateStringForHTMLTag()
                                                :
                                                formData.begin_date
                                        }
                                        onChange={onInputChange}
                                        required
                                    />
                                    {errors.begin_date && 
                                        <div className="error-message">
                                            {errors.begin_date}
                                        </div>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end_date">End Date:</label>
                                    <input
                                        type="datetime-local"
                                        id="end_date"
                                        name="end_date"
                                        value={
                                            formData.end_date instanceof LVDate ? 
                                                formData.end_date.getDateStringForHTMLTag()
                                                :
                                                formData.end_date
                                        }
                                        onChange={onInputChange}
                                        required
                                    />
                                    {errors.end_date && <div className="error-message">{errors.end_date}</div>}
                                    {errors.dateOrder && <div className="error-message">{errors.dateOrder}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_start">Hotel Stay Start:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_start"
                                        name="hotel_stay_start"
                                        value={
                                            formData.hotel_stay_start instanceof LVDate ? 
                                                formData.hotel_stay_start.getDateStringForHTMLTag()
                                                :
                                                formData.hotel_stay_start
                                        }
                                        onChange={onInputChange}
                                    />
                                    {errors.hotelDateOrder && <div className="error-message">{errors.hotelDateOrder}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_end">Hotel Stay End:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_end"
                                        name="hotel_stay_end"
                                        value={
                                            formData.hotel_stay_end instanceof LVDate ? 
                                                formData.hotel_stay_end.getDateStringForHTMLTag()
                                                :
                                                formData.hotel_stay_end
                                        }
                                        onChange={onInputChange}
                                    />
                                    {errors.hotelDateOrder && <div className="error-message">{errors.hotelDateOrder}</div>}
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
                                    handleOnChange={(value) => onChange(value, 'doctor')}
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
                                        formData.appointment_type ? 
                                            formData.appointment_type.type_name 
                                            : 
                                            ''
                                    }
                                    handleOnChange={(value) => onChange(value, 'appointment_type')}
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
