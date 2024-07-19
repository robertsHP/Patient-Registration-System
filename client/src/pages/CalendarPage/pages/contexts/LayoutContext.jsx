import React, { createContext, useState } from 'react';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [layoutChangeTrigger, setLayoutChangeTrigger] = useState(0);

    const triggerLayoutChange = () => {
        setLayoutChangeTrigger(prev => prev + 1);
    };

    return (
        <LayoutContext.Provider value={{ layoutChangeTrigger, triggerLayoutChange }}>
            {children}
        </LayoutContext.Provider>
    );
};