import React, { useState } from 'react';

import { useCalendarContext } from '../../../contexts/CalendarContext.jsx';
// import { formatDate } from './utilFunctions.jsx';

export default function getDisallowedFormFunctions ({formTags}) {
    const { 
        disallowedDates, setDisallowedDates, 
        disallowedDateID, setDisallowedDateID, 
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate
    } = useCalendarContext();

    const initialCheck = () => {
        return getDisallowedDate(disallowedDateID);
    }

    const [form, setForm] = useState(() => {
        return formTags.reduce((form, tag) => {
            const label = tag.name;
            const value = selectedDisallowedDate[label] || '';

            form[label] = value;

            return form;
        }, {});
    });

    const handleInputUpdate = (event) => {
        const { name, value } = event.target;
        const updatedDate = { 
            id: selectedDisallowedDate.id, 
            ...form, 
            [name]: value 
        };

        // Swap start and end dates if needed
        if (updatedDate.start && updatedDate.end && updatedDate.start > updatedDate.end) {
            const { start, end } = updatedDate;
            updatedDate.start = end;
            updatedDate.end = start;
        }

        setSelectedDisallowedDate(updatedDate);
        setForm(updatedDate);

        console.log(selectedDisallowedDate);
    };

    const handleCloseButtonClick = () => {
        setDisallowedDateID(-1);
    };

    const handleSaveClick = () => {
        setDisallowedDate(selectedDisallowedDate.id, selectedDisallowedDate);

        // console.log(events);

        console.log('Save clicked!');
    };

    const handleDeleteClick = () => {
        console.log(disallowedDates);
        console.log(selectedDisallowedDate.id);
        
        deleteDisallowedDate(selectedDisallowedDate.id);

        console.log(disallowedDates);

        console.log('Delete clicked!');
    };

    return {
        initialCheck: initialCheck,
        handleInputUpdate: handleInputUpdate,
        handleCloseButtonClick: handleCloseButtonClick,
        handleSaveClick: handleSaveClick,
        handleDeleteClick: handleDeleteClick
    };
}