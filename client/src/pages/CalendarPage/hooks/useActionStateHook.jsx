import React, { useEffect, useState } from 'react';

/**
 * Enum representing the different types of actions.
 * @enum {string}
 */
export const ActionState = {
    ADD: {
        name: 'add', 
        description: 'Pievienot pierakstu'
    },
    UNAVAILABILITY: {
        name: 'update', 
        description: 'Nepieejamo datumu pievienošana'
    }
};

export default function useActionStateHook (mode) {
    const [actionState, setActionState] = useState(mode);
    
    return {
        actionState,
        setActionState
    };
}