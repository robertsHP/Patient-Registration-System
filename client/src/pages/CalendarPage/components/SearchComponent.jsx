import React, { useState } from 'react';

import './SearchComponent.css'

export default function SearchComponent () {
    const [term, setTerm] = useState('');

    const onInputChange = (event) => {
        setTerm(event.target.value);
    };

    const onFormSubmit = (event) => {
        event.preventDefault();
        // You can do something with term here like sending it to an API
    };

    return (
        <form onSubmit={onFormSubmit}>
            <input 
                type="text" 
                value={term} 
                onChange={onInputChange} 
                placeholder="Search..."
            />
            <div className="row-container">
                <div className="row-item">Row 1</div>
                <div className="row-item">Row 2</div>
                <div className="row-item">Row 3</div>
                {/* Add more rows as needed */}
            </div>
        </form>
    );
}