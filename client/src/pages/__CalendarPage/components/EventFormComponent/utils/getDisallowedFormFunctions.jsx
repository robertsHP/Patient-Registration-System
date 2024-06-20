import React, { useState } from 'react';

import { useCalendarContext } from '../../../contexts/CalendarContext.jsx';
// import { formatDate } from './utilFunctions.jsx';

export default function getDisallowedFormFunctions ({formTags}) {
    const { 
        disallowedDates, setDisallowedDates, 
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate
    } = useCalendarContext();

    // const [form, setForm] = useState(() => {
    //     return formTags.reduce((form, tag) => {
    //         const label = tag.name;
    //         const value = selectedDisallowedDate[label] || '';

    //         form[label] = value;

    //         return form;
    //     }, {});
    // });

    const handleInputUpdate = (event) => {
        const { name, value } = event.target;
        const updatedDate = { 
            ...selectedDisallowedDate, 
            [name]: value 
        };

        // Swap start and end dates if needed
        if (updatedDate.start && updatedDate.end && updatedDate.start > updatedDate.end) {
            const { start, end } = updatedDate;
            updatedDate.start = end;
            updatedDate.end = start;
        }

        setSelectedDisallowedDate(updatedDate);
        // setForm(updatedDate);

        // console.log(selectedDisallowedDate);
    };

    const handleCloseButtonClick = () => {
        setSelectedDisallowedDate(null);
    };

    const handleSaveClick = () => {
        setDisallowedDate(selectedDisallowedDate.id, selectedDisallowedDate);
        // setForm(updatedDate);

        // console.log(events);

        // console.log('Save clicked!');
    };

    const handleDeleteClick = () => {
        // console.log(disallowedDates);
        // console.log(selectedDisallowedDate.id);
        
        deleteDisallowedDate(selectedDisallowedDate.id);
        setDisallowedDate(null);

        // console.log(selectedDisallowedDate);

        // console.log('Delete clicked!');
    };

    return {
        handleInputUpdate: handleInputUpdate,
        handleCloseButtonClick: handleCloseButtonClick,
        handleSaveClick: handleSaveClick,
        handleDeleteClick: handleDeleteClick
    };
}