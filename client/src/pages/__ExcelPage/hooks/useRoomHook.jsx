import React, { useEffect, useState } from 'react';

export default function useWidthManagementHook (initialWidths) {
    const [widths, setWidths] = useState(initialWidths);
    const sumOfAllWidths = columnWidths.reduce((acc, width) => acc + width, 0);

    const getSumOfAllWidths = () => {
        if(rooms) {
            return rooms.find(room => room.id == id);
        }
        return null;
    }

    return { 
        widths, setWidths
    };
}
