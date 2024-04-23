import React, { useEffect, useState } from 'react';

/**
 * Enum representing the different types of actions.
 * @enum {string}
 */
export const ActionState = {
    ADD: {
        name: 'add', 
        description: 'Pievienot pierakstu',
        color1: '#3788D8',
        color2: '#FF9B9B'
    },
    UNAVAILABILITY: {
        name: 'update', 
        description: 'Nepieejamo datumu pievienošana',
        color1: '#FF9B9B',
        color2: '#3788D8'
    }
};

export default function useActionStateHook (mode) {
    const [actionState, setActionState] = useState(mode);
    
    return {
        actionState,
        setActionState
    };
}