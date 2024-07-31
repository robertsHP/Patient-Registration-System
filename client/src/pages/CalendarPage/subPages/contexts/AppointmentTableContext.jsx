import React, { createContext, useState } from 'react';

export const AppointmentTableContext = createContext();

export const AppointmentTableProvider = ({ children }) => {
    const [appointmentRowEffectTrigger, setAppointmentRowEffectTrigger] = useState(0);
    const [sumRowEffectTrigger, setSumRowEffectTrigger] = useState(0);

    const triggerAppointmentRowEffect = () => {
        setAppointmentRowEffectTrigger(prev => prev + 1);
    };

    const triggerSumRowEffect = () => {
        setSumRowEffectTrigger(prev => prev + 1);
    };

    return (
        <AppointmentTableContext.Provider value={
            { 
                appointmentRowEffectTrigger, triggerAppointmentRowEffect,
                sumRowEffectTrigger, triggerSumRowEffect
            }
        }>
            {children}
        </AppointmentTableContext.Provider>
    );
};