import React, { useEffect, useState } from 'react';

export default function useDisallowedHook (initialDisallowedDates, initialDisallowedDateID) {
    const [disallowedDates, setDisallowedDates] = useState(initialDisallowedDates);

    const getDisallowedDate = (id) => {
        return disallowedDates.find(date => date.id == id);
    }

    const [
        selectedDisallowedDate, 
        setSelectedDisallowedDate
    ] = useState(getDisallowedDate(initialDisallowedDateID) || null);

    const setDisallowedDate = (id, updatedDate) => {
        setDisallowedDates(disallowedDates.map(
            date => date.id == id ? updatedDate : date
        ));

        if(selectedDisallowedDate != null) {
            if(id == selectedDisallowedDate.id) {
                setSelectedDisallowedDate(updatedDate);
            }
        }
    }

    const deleteDisallowedDate = (id) => {
        console.log(id);

        setDisallowedDates(disallowedDates => 
            disallowedDates.filter(date => date.id != id)
        );

        console.log(disallowedDates);

        if (selectedDisallowedDate && id === selectedDisallowedDate.id) {
            setSelectedDisallowedDate(null);
        }
    }

    const updateDisallowedDate = (id, values) => {
        setDisallowedDates(disallowedDates.map(
            date => date.id == id 
            ? 
            {...date, ...values} 
            : 
            date
        ));

        if(selectedDisallowedDate != null) {
            if(id == selectedDisallowedDate.id) {
                setSelectedDisallowedDate(
                    {...selectedDisallowedDate, ...values}
                );
            }
        }
    }

    return { 
        disallowedDates, setDisallowedDates,  
        getDisallowedDate, setDisallowedDate, 
        selectedDisallowedDate, setSelectedDisallowedDate,
        updateDisallowedDate, deleteDisallowedDate,
    };
}
