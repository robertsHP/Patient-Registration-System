import React, { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';

import ApiService from '../../../services/ApiService.js';

import useNavigation from '../../../hooks/useNavigation.jsx';
import routes from '../../../routes/routes.jsx';

import './SearchPage.css';

export default function SearchPage() {
    const { navigateTo } = useNavigation();

    const [searchText, setSearchText] = useState('');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const initialSearchText = queryParams.get('search') || '';
        setSearchText(initialSearchText);
        if (initialSearchText) {
            handleSearch(initialSearchText);
        }
    }, [window.location.search]);

    useEffect(() => {
        console.log("appointments");
        console.log(appointments);
    }, [appointments]);

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

    const handleAppointmentSelect = async (appointment) => {
        if (appointment.source_table == "drag_table") {
            var calendar = routes.system.pages.calendar;
            var beds = calendar.subPages.beds;

            navigateTo(calendar.url+beds.url+beds.getDefaultURLValues());
        } else if (appointment.source_table == "input_table") {
            var calendar = routes.system.pages.calendar;
            var sauna = calendar.subPages.sauna;

            navigateTo(calendar.url+sauna.url+sauna.getDefaultURLValues());
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
                                <button 
                                    onClick={() => handleAppointmentSelect(appointment)}
                                    className="search-page__detail-button"
                                >
                                    <p>
                                        Telpa: {
                                            appointment.source_table == "drag_table" ? 
                                                "Gultas" 
                                                : 
                                                "Pirts"
                                        }
                                    </p>
                                    <p>Sākuma datums: {new Date(appointment.begin_date).toLocaleString()}</p>
                                    {appointment.end_date && (
                                        <p>Beigu Datums: {new Date(appointment.end_date).toLocaleString()}</p>
                                    )}
                                    <p>Piezīmes: {appointment.notes}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
