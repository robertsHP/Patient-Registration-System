import React, { useState } from 'react';

import InputAndSelect from '../../../../../components/InputAndSelect';

import './AppointmentInputForm.css';

export default function AppointmentInputForm ({ selectedAppointment, setSelectedAppointment }) {
    const [formData, setFormData] = useState({
        begin_date: '',
        end_date: '',
        notes: '',
        doc_name: '',
        pat_name: '',
    });
    const [doctors, setDoctors] = useState(['Dr. Smith', 'Dr. Jones']);
    const [patients, setPatients] = useState(['John Doe', 'Jane Smith']);

    const handleCloseModal = () => {
        setSelectedAppointment(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddOption = (e, type) => {
        if (e.key === 'Enter') {
            const newOption = e.target.value;
            if (newOption && type === 'doctor') {
                setDoctors([...doctors, newOption]);
            } else if (newOption && type === 'patient') {
                setPatients([...patients, newOption]);
            }
            setFormData({ ...formData, [type === 'doctor' ? 'doc_name' : 'pat_name']: newOption });
            e.target.value = '';
        }
    };

    const handleDeleteOption = (option, type) => {
        if (type === 'doctor') {
            setDoctors(doctors.filter(doc => doc !== option));
            if (formData.doc_name === option) 
                setFormData({ ...formData, doc_name: '' });
        } else if (type === 'patient') {
            setPatients(patients.filter(pat => pat !== option));
            if (formData.pat_name === option) 
                setFormData({ ...formData, pat_name: '' });
        }
    };

    const handleSave = () => {
        console.log('Save function called');
    };

    const handleDelete = () => {
        console.log('Delete function called');
    };

    // console.log(selectedAppointment);

    return (
        <div className="window-overlay">
            <div className="window">
                <div className="window-header">
                    <button className="close-button" onClick={handleCloseModal}>
                        X
                    </button>
                </div>
                <form className="window-form">
                    <label htmlFor="pat_name">Patient Name:</label>
                    <InputAndSelect
                        options={patients}
                        value={formData.pat_name}
                        onChange={(value) => handleSelectChange(value, 'pat_name')}
                        onAddOption={(option) => handleAddOption(option, 'pat_name')}
                        onDeleteOption={(option) => handleDeleteOption(option, 'pat_name')}
                        placeholder="Select or type a patient name"
                    />

                    <label htmlFor="begin_date">Begin Date:</label>
                    <input
                        type="datetime-local"
                        id="begin_date"
                        name="begin_date"
                        value={formData.begin_date}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="end_date">End Date:</label>
                    <input
                        type="datetime-local"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="doc_name">Doctor Name:</label>
                    <InputAndSelect
                        options={doctors}
                        value={formData.doc_name}
                        onChange={(value) => handleSelectChange(value, 'doc_name')}
                        onAddOption={(option) => handleAddOption(option, 'doc_name')}
                        onDeleteOption={(option) => handleDeleteOption(option, 'doc_name')}
                        placeholder="Select or type a doctor name"
                    />

                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleDelete}>Delete</button>
                </form>
            </div>
        </div>
    );
}