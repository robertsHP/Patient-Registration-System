import React, { useState } from 'react';

import '../../../global.css'
import './SearchComponent.css'

export default function SearchComponent ({events}) {
    const [term, setTerm] = useState('');

    const onInputChange = (event) => {
        setTerm(event.target.value);
    };

    const onFormSubmit = (event) => {
        event.preventDefault();
        // You can do something with term here like sending it to an API
    };

    // Filter the events based on the search term
    const filteredEvents = Object.keys(events).filter(key => 
        events[key].name.toLowerCase().includes(term.toLowerCase()) ||
        events[key].start.toLowerCase().includes(term.toLowerCase()) ||
        events[key].end.toLowerCase().includes(term.toLowerCase())
    );

    return (
        <div className="global-component">
            <input 
                type="text" 
                value={term} 
                onChange={onInputChange} 
                placeholder="Meklēt..."
            />
            <div className="row-container">
                {filteredEvents.map((key) => (
                    <a key={key}>
                        <div className="row-item">
                            {events[key].name+", "+events[key].start+", "+events[key].end}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}