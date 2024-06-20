import React, { useState, useEffect } from 'react';

import { useCalendarContext } from '../../contexts/CalendarContext.jsx';

import { ActionState } from '../../hooks/useActionStateHook.jsx';

import unavailabilityForm from '../../data/unavailabilityForm.jsx';

import getEventFormFunctions from './utils/getEventFormFunctions.jsx';
import getDisallowedFormFunctions from './utils/getDisallowedFormFunctions.jsx';

import './EventFormComponent.css'

export default function EventFormComponent({formTags}) {
    const { 
        selectedEvent, getEvent,
        selectedDisallowedDate, getDisallowedDate,
        actionState
    } = useCalendarContext();

    var initialCheck = () => {
        switch (actionState) {
            case ActionState.ADD :
                return selectedEvent;
            case ActionState.UNAVAILABILITY :
                return selectedDisallowedDate;
        }
        return false;
    }

    return (
        <>
            {initialCheck() && 
                <_EventFormComponent 
                    formTags={formTags}
                />
            }
        </>
    );
}

function _EventFormComponent({formTags}) {
    const { 
        events,
        getEvent, setEvent, deleteEvent,

        selectedEvent,
        setSelectedEvent,

        getDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate,

        actionState
    } = useCalendarContext();

    // useEffect(() => {
    //     switch (actionState) {
    //         case ActionState.ADD :
    //             const event = getEvent(selectedEvent.id);
    //             setSelectedEvent(event);
    //             break;
    //         case ActionState.UNAVAILABILITY :
    //             const date = getDisallowedDate(selectedDisallowedDate.id);
    //             setSelectedDisallowedDate(date);
    //             break;
    //     }
    // }, [selectedEvent, selectedDisallowedDate]);

    var functions = {};
    var currentFormTags = [];
    var selectedValue = null;

    switch (actionState) {
        case ActionState.ADD :
            functions = getEventFormFunctions({formTags});
            currentFormTags = formTags;
            selectedValue = selectedEvent;
            break;

        case ActionState.UNAVAILABILITY :
            functions = getDisallowedFormFunctions({formTags});
            currentFormTags = unavailabilityForm;
            selectedValue = selectedDisallowedDate;
            break;
    }

    return (
        <div className="global-component">
            <div style={{ top: '10px', left: '10px' }}>
                <button onClick={functions.handleCloseButtonClick}>
                    X
                </button>
            </div>
            <form>
                {currentFormTags.map((tag, index) => {
                    const TagComponent = tag.component;

                    return (
                        <TagComponent 
                            key={index} 
                            name={tag.name} 
                            value={selectedValue[tag.name] || ""} 
                            onChange={functions.handleInputUpdate} 
                        />
                    );
                })}
            </form>
            <button onClick={functions.handleSaveClick}>
                Saglabāt
            </button>
            <button onClick={functions.handleDeleteClick}>
                Dzēst
            </button>
        </div>
    );
}
