import React, { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';

import ApiService from '../../../services/ApiService.js';

import './SearchPage.css';

export default function SearchPage() {
    const [searchText, setSearchText] = useState('');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const handleSearch = async () => {
        if(searchText.length != 0) {
            try {
                var result = [];

                result = await ApiService.get(`/api/calendar-page/search/patient/${searchText}`);
            
                setPatients(result);
            } catch (error) {
                console.log("useDataFetch error: ");
                console.log(error);
            }
        }
    };

    const handlePatientSelect = async (id) => {
        try {
            var result = [];

            console.log(id);

            result = await ApiService.get(`/api/calendar-page/search/appointments/${id}`);

            console.log(result);

            setAppointments(result);
        } catch (error) {
            console.log("useDataFetch error: ");
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-page">
            <div className="search-page__section">
                <div className="search-page__search-bar">
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Search names..."
                        className="search-page__search-input"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-page__search-button"
                    >
                        <FaSearch />
                    </button>
                </div>
                <ul className="search-page__results-list">
                    {patients.length === 0 ? (
                        <p>Nav rezultāti</p>
                    ) : (
                        <ul>
                            {patients.map((patient) => (
                                <li key={`patient-${patient.id}`}>
                                    <button
                                        onClick={() => handlePatientSelect(patient.id)}
                                        className="search-page__result-button"
                                    >
                                        {`${patient.id}: ${patient.pat_name}, (${patient.phone_num})`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </ul>
            </div>
            <div className="search-page__details-section">
                {appointments.length === 0 ? (
                    <p>Nav rezultāti</p>
                ) : (
                    <ul className="search-page__details-list">
                        {appointments.map((appointment, index) => (
                            <li key={index}>
                                <button className="search-page__detail-button">
                                    <h3>{appointment.source_table}</h3>
                                    <p>ID: {appointment.id}</p>
                                    <p>Patient ID: {appointment.id_patient}</p>
                                    <p>Begin Date: {new Date(appointment.begin_date).toLocaleString()}</p>
                                    {appointment.end_date && (
                                        <p>End Date: {new Date(appointment.end_date).toLocaleString()}</p>
                                    )}
                                    <p>Notes: {appointment.notes}</p>
                                    <p>Doctor ID: {appointment.id_doctor}</p>
                                    {appointment.id_room && <p>Room ID: {appointment.id_room}</p>}
                                    {appointment.hotel_stay_start && (
                                        <p>Hotel Stay Start: {new Date(appointment.hotel_stay_start).toLocaleString()}</p>
                                    )}
                                    {appointment.hotel_stay_end && (
                                        <p>Hotel Stay End: {new Date(appointment.hotel_stay_end).toLocaleString()}</p>
                                    )}
                                    {appointment.id_appointment_type && (
                                        <p>Appointment Type ID: {appointment.id_appointment_type}</p>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
