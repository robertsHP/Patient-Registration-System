import React from 'react';

import './EventInputForm.css';

export default function EventInputForm ({ selectedEvent, setSelectedEvent }) {

    // console.log(event);

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-window">
            <button className="close-button" onClick={handleCloseModal}>
                &times;
            </button>
            <form className="modal-form">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
                
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
    
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    );
}