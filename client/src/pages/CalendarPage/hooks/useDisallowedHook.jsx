import React, { useEffect, useState } from 'react';

export default function useDisallowedHook (initialDisallowedDates, initialDisallowedDateID) {
    const [disallowedDates, setDisallowedDates] = useState(initialDisallowedDates);
    const [disallowedDateID, _setDisallowedDateID] = useState(initialDisallowedDateID);

    const getDisallowedDate = (id) => {
        return disallowedDates.find(date => date.id == id);
    }

    const [
        selectedDisallowedDate, 
        setSelectedDisallowedDate
    ] = useState(getDisallowedDate(disallowedDateID) || null);

    const setDisallowedDateID = (id) => {
        _setDisallowedDateID(id);
        setSelectedDisallowedDate(getDisallowedDate(id));
    }

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
        setDisallowedDates(prevDates => prevDates.filter(date => date.id !== id));

        if(selectedDisallowedDate != null) {
            if(id == selectedDisallowedDate.id) {
                _setDisallowedDateID(-1);
                setDisallowedDate(null);
            }
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
                // console.log({...selectedDisallowedDate, ...values});
                setSelectedDisallowedDate(
                    {...selectedDisallowedDate, ...values}
                );
            }
        }
    }

    return { 
        disallowedDates, setDisallowedDates, 
        disallowedDateID, setDisallowedDateID, 
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate
    };
}
