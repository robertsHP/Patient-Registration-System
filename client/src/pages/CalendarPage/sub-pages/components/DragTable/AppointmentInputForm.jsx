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

    useEffect(() => {
        console.log(formData);
    }, [formData]);


    const onInputChange = (label, value) => {
        console.log("onInputChange");

        const getFinalValue = (label, data) => {
            const splitLabel = label.split('.');

            return {
                ...data,
                [splitLabel[1]]: value
            };
        }

        var finalLabel = label;
        var finalValue = value;

        if (label.includes('patient')) {
            finalLabel = 'patient';
            finalValue = getFinalValue(label, formData[finalLabel]);
        } else if (label.includes('doctor')) {
            finalLabel = 'doctor';
            finalValue = getFinalValue(label, formData[finalLabel]);
        } else if (label.includes('appointment_type')) {
            finalLabel = 'appointment_type';
            finalValue = getFinalValue(label, formData[finalLabel]);
        }

        setFormData({ 
            ...formData, 
            [finalLabel]: finalValue 
        });
    };

    const onSelectChange = (label, value) => {
        console.log("onSelectChange");

        setFormData({
            ...formData,
            [label]: value,
            hasChanged: true
        });
    };

    const onDeleteOption = async (label, option) => {
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

                var newFormData = {
                    ...formData,
                    begin_date: typeof formData.begin_date === "string" ?
                        new LVDate(formData.begin_date)
                        :
                        formData.begin_date,
                    end_date: typeof formData.end_date === "string" ?
                        new LVDate(formData.end_date)
                        :
                        formData.end_date,
                    hotel_stay_start: typeof formData.hotel_stay_start === "string" ?
                        new LVDate(formData.hotel_stay_start)
                        :
                        formData.hotel_stay_start,
                    hotel_stay_end: typeof formData.hotel_stay_end === "string" ?
                        new LVDate(formData.hotel_stay_end)
                        :
                        formData.hotel_stay_end,
                };

                var newAppointment = dragTableUtilities.convertAppointmentForLayoutSupport(
                    {
                        ...props.selectedAppointmentData.appointment,
                        ...newFormData
                    },
                    props.data.date,
                    props.config
                );

                var newAppointmentForDB = dragTableUtilities.convertAppointmentForSendingToDB(
                    roomID,
                    newAppointment
                );

                var result = await ApiService.put(url, newAppointmentForDB);

                console.log(result);

                props.data.setAppointmentWithID(roomID, id, newAppointment);
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
                                <label htmlFor="pat_name">Pacienta vārds:</label>
                                <InputSelector
                                    options={patients}
                                    nameColumn={'pat_name'}
                                    value={
                                        formData.patient != null ? 
                                            formData.patient.pat_name 
                                            :
                                            ''
                                    }
                                    defaultValue={{
                                        id: null,
                                        pat_name: null,
                                        phone_num: null
                                    }}
                                    handleInputChange={(value) => onInputChange('patient.pat_name', value['pat_name'])}
                                    handleSelectOption={(value) => onSelectChange('patient', value)}

                                    handleDeleteOption={(value) => onDeleteOption('patient', value)}
                                    placeholder=""
                                />
                                {errors.patient && <div className="error-message">{errors.patient}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="phone_num">Pacienta tel. nr.:</label>
                                <input
                                    type="text"
                                    id="phone_num"
                                    name="phone_num"
                                    value={
                                        formData.patient != null ? 
                                            formData.patient.phone_num != null ?
                                                formData.patient.phone_num
                                                :
                                                ''
                                            : 
                                            ''
                                    }
                                    onChange={(e) => onInputChange('patient.phone_num', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <div className="form-group">
                                    <label htmlFor="begin_date">Sākuma datums:</label>
                                    <input
                                        type="datetime-local"
                                        id="begin_date"
                                        name="begin_date"
                                        value={
                                            formData.begin_date == null ? 
                                                ""
                                                :
                                                formData.begin_date instanceof LVDate ? 
                                                    formData.begin_date.getDateStringForHTMLTag()
                                                    :
                                                    formData.begin_date
                                        }
                                        onChange={(e) => onInputChange('begin_date', e.target.value)}
                                        required
                                    />
                                    {errors.begin_date && 
                                        <div className="error-message">
                                            {errors.begin_date}
                                        </div>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end_date">Beigu datums:</label>
                                    <input
                                        type="datetime-local"
                                        id="end_date"
                                        name="end_date"
                                        value={
                                            formData.end_date == null ? 
                                                ""
                                                :
                                                formData.end_date instanceof LVDate ? 
                                                    formData.end_date.getDateStringForHTMLTag()
                                                    :
                                                    formData.end_date
                                        }
                                        onChange={(e) => onInputChange('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <div className="error-message">{errors.end_date}</div>}
                                    {errors.dateOrder && <div className="error-message">{errors.dateOrder}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hotel_stay_start">Viesnīcas sākuma datums:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_start"
                                        name="hotel_stay_start"
                                        value={
                                            formData.hotel_stay_start == null ? 
                                                ""
                                                :
                                                formData.hotel_stay_start instanceof LVDate ? 
                                                    formData.hotel_stay_start.getDateStringForHTMLTag()
                                                    :
                                                    formData.hotel_stay_start
                                        }
                                        onChange={(e) => onInputChange('hotel_stay_start', e.target.value)}
                                    />
                                    {errors.hotelDateOrder && 
                                        <div className="error-message">
                                            {errors.hotelDateOrder}
                                        </div>
                                    }
                                </div>

                                <div className="form-group">
                                    <label htmlFor="hotel_stay_end">Viesnīcas beigu datums:</label>
                                    <input
                                        type="datetime-local"
                                        id="hotel_stay_end"
                                        name="hotel_stay_end"
                                        value={
                                            formData.hotel_stay_end == null ? 
                                                ""
                                                :
                                                formData.hotel_stay_end instanceof LVDate ? 
                                                    formData.hotel_stay_end.getDateStringForHTMLTag()
                                                    :
                                                    formData.hotel_stay_end
                                        }
                                        onChange={(e) => onInputChange('hotel_stay_end', e.target.value)}
                                    />
                                    {errors.hotelDateOrder && <div className="error-message">{errors.hotelDateOrder}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="notes">Piezīmes:</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={
                                        formData.notes ?
                                            formData.notes 
                                            :
                                            ''
                                    }
                                    onChange={(e) => onInputChange('notes', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="doc_name">Ārsts:</label>
                                <InputSelector
                                    options={doctors}
                                    nameColumn={'doc_name'}
                                    value={
                                        formData.doctor != null ? 
                                            formData.doctor.doc_name 
                                            : 
                                            ''
                                    }
                                    defaultValue={{
                                        id: null,
                                        doc_name: null
                                    }}
                                    handleInputChange={(value) => onInputChange('doctor.doc_name', value['doc_name'])}
                                    handleSelectOption={(value) => onSelectChange('doctor', value)}

                                    handleDeleteOption={(value) => onDeleteOption('doctor', value)}
                                    placeholder=""
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="appointment_type">Pieraksta veids:</label>
                                <InputSelector
                                    options={appointmentTypes}
                                    nameColumn={'type_name'}
                                    value={
                                        formData.appointment_type ? 
                                            formData.appointment_type.type_name 
                                            : 
                                            ''
                                    }
                                    defaultValue={{
                                        id: null,
                                        type_name: null
                                    }}
                                    handleInputChange={(value) => onInputChange('appointment_type.type_name', value['type_name'])}
                                    handleSelectOption={(value) => onSelectChange('appointment_type', value)}

                                    handleDeleteOption={(value) => onDeleteOption('appointment_type', value)}
                                    placeholder=""
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
