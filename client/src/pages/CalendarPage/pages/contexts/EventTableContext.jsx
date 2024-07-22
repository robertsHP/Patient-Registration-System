import React, { createContext, useState } from 'react';

export const EventTableContext = createContext();

export const EventTableProvider = ({ children }) => {
    const [eventRowEffectTrigger, setEventRowEffectTrigger] = useState(0);
    const [sumRowEffectTrigger, setSumRowEffectTrigger] = useState(0);

    const triggerEventRowEffect = () => {
        setEventRowEffectTrigger(prev => prev + 1);
    };

    const triggerSumRowEffect = () => {
        setSumRowEffectTrigger(prev => prev + 1);
    };

    return (
        <EventTableContext.Provider value={
            { 
                eventRowEffectTrigger, triggerEventRowEffect,
                sumRowEffectTrigger, triggerSumRowEffect
            }
        }>
            {children}
        </EventTableContext.Provider>
    );
};