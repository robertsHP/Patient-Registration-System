import React, { useState } from 'react';

function SearchComponent () {
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
        </form>
    );
}

export default SearchComponent;