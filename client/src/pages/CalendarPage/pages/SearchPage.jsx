import React, { useState } from 'react';

import { FaSearch } from 'react-icons/fa';

import './SearchPage.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [names, setNames] = useState([]);
    const [details, setDetails] = useState([]);

    const searchNames = async (query) => {

        // ApiService.get(`/api/drag-table/get-rooms?${params}`)
        // .then(result => {
        //     console.log(result);

        //     const data = result.data[0].rooms;
        //     const finalData = convertRoomDataToLayout(data);

        //     setRooms(finalData);
        //     triggerFullDataUpdate();
        // })
        // .catch((error) => {
        //     console.log("useDataFetch error: ");
        //     console.log(error);
        // });

        // Replace with your API call
        return ['Alice', 'Bob', 'Charlie', 'David'];
    };
      
    const fetchDetails = async (name) => {
        // Replace with your API call
        return { name, details: `Details about ${name}` };
    };

    const handleSearch = async () => {
        const result = await searchNames(query);
        setNames(result);
    };

    const handleSelectName = async (name) => {
        const result = await fetchDetails(name);
        setDetails((prevDetails) => [...prevDetails, result]);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-page">
            <div className="search-section">
                <div className="search-bar">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Search names..."
                        className="search-input"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button"
                    >
                        <FaSearch />
                    </button>
                </div>
                <ul className="results-list">
                {names.map((name) => (
                    <li key={name}>
                        <button
                            onClick={() => handleSelectName(name)}
                            className="result-button"
                        >
                            {name}
                        </button>
                    </li>
                ))}
                </ul>
            </div>
            <div className="details-section">
                <ul className="details-list">
                    {details.map((detail, index) => (
                        <li key={index}>
                            <button className="detail-button">
                                <h3>{detail.name}</h3>
                                <p>{detail.details}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
