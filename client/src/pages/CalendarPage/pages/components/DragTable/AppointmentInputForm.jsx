import React, { useState, useEffect } from 'react';

import ConfirmationWindow from '../../../../../components/ConfirmationWindow';
import InputAndSelect from '../../../../../components/InputAndSelect';

import ApiService from '../../../../../services/ApiService.js';

import './AppointmentInputForm.css';

export default function AppointmentInputForm ({ selectedAppointment, setSelectedAppointment }) {
    const [formData, setFormData] = useState({
        patient: null,
        begin_date: '',
        end_date: '',
        notes: '',
        doc_name: null,
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
            ApiService.post(`/api/input-form/${label}`, newValue)
            .then((result) => {
                newValue.id = result;
                setOptionsList([...optionsList, newValue]);
                setFormData({ ...formData, label: newValue });
            })
            .catch((error) => {
                console.log(`AppointmentInputForm (${label}) POST error: `);
                console.log(error);
            });
        };

        if (label == 'doctor') {
            addOption(
                { doc_name: value },
                label,
                doctors,
                setDoctors
            );
        } else if (label == 'patient') {
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
                    ApiService.delete(`/api/input-form/${label}/${option.id}`, option)
                    .then((result) => {
                        console.log(result);

                        setOptionsList(
                            optionsList.filter(value => value !== option)
                        );
                        if (formData[label].id === option.id) 
                            setFormData({ ...formData, label: null});
                    })
                    .catch((error) => {
                        console.log(`AppointmentInputForm (${label}) DELETE error: `);
                        console.log(error);
                    });
                },
                () => {}
            );
        };

        if (label == 'doctor') {
            deleteOption(
                `
                    Vai tiešām vēlaties dzēst ārstu? 
                    Visi dati, kas ir saistīti ar šo personu tiks neatgriezeniski dzēsti.
                `,
                option, label, doctors
            );
        } else if (label == 'patient') {
            deleteOption(
                `
                    Vai tiešām vēlaties dzēst pacientu? 
                    Visi dati, kas ir saistīti ar šo personu tiks neatgriezeniski dzēsti.
                `,
                option, label, patients
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
                        <label htmlFor="pat_name">Patient Name:</label>
                        <InputAndSelect
                            options={patients}
                            nameColumn={'pat_name'}
                            value={
                                formData.patient != null ? formData.patient.pat_name : ''
                            }
                            handleOnChange={(value) => {onChange(value, 'patient');}}
                            handleAddOption={(value) => onAddOption(value, 'patient')}
                            handleDeleteOption={(value) => onDeleteOption(value, 'patient')}
                            placeholder="Select or type a patient name"
                        />

                        <label htmlFor="begin_date">Begin Date:</label>
                        <input
                            type="datetime-local"
                            id="begin_date"
                            name="begin_date"
                            value={formData.begin_date}
                            onChange={onInputChange}
                            required
                        />

                        <label htmlFor="end_date">End Date:</label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={onInputChange}
                            required
                        />

                        <label htmlFor="notes">Notes:</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={onInputChange}
                            required
                        />

                        {/* <label htmlFor="doc_name">Doctor Name:</label>
                        <InputAndSelect
                            options={doctors}
                            value={
                                formData.doctor != null ? formData.doctor.doc_name : ''
                            }
                            onChange={(value) => handleSelectChange(value, 'doc_name')}
                            onAddOption={(option) => handleAddOption(option, 'doc_name')}
                            onDeleteOption={(option) => handleDeleteOption(option, 'doc_name')}
                            placeholder="Select or type a doctor name"
                        /> */}

                        <button type="button" onClick={onSave}>Save</button>
                        <button type="button" onClick={onDelete}>Delete</button>
                    </form>
                </div>
            </div>
        </>
    );
}

