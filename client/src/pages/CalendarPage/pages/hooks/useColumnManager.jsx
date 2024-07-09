import React, { useEffect, useState } from 'react';

// export default function useColumnManager (daysOfMonth) {
//     const columnWidths = [4, 4, ...daysOfMonth.map(() => 1), 1, 4];

//     const getSumOfAllColumnsWidths = () => {
//         return columnWidths.reduce((acc, width) => acc + width, 0);
//     }

//     const getWidthSumTilStartColumnBeginning = () => {
//         return columnWidths.slice(0, 2).reduce((acc, width) => acc + width, 0);
//     };

//     const getWidthSumTilEndColumnBeginning = () => {
//         return columnWidths.slice(2, columnWidths.length - 2).reduce((acc, width) => acc + width, dateColumnsStart);
//     };

//     return { 
//         columnWidths,
//         getSumOfAllColumnsWidths,
//         getWidthSumTilStartColumnBeginning,
//         getWidthSumTilEndColumnBeginning
//     };
// }




export default function useColumnManager (daysOfMonth) {
    const columnWidths = { 
        'start': [4, 4], 
        'dates': daysOfMonth.map(() => 1), 
        'end': [1, 4]
    };

    const getSumOfAllColumnsWidths = () => {
        return Object.values(columnWidths).flat().reduce((acc, width) => acc + width, 0);
    }

    const getWidthSumTilStartColumnBeginning = () => {
        return Object.values(columnWidths).flat().slice(0, 2).reduce((acc, width) => acc + width, 0);
    };

    const getWidthSumTilEndColumnBeginning = () => {
        const datesColumnsWidthSum = Object.values(columnWidths).flat().slice(2, columnWidths['dates'].length + 2).reduce((acc, width) => acc + width, 0);
        const endColumnsWidthSum = Object.values(columnWidths).flat().slice(columnWidths['dates'].length + 2).reduce((acc, width) => acc + width, 0);

        return datesColumnsWidthSum + endColumnsWidthSum;
    };

    return { 
        columnWidths,
        getSumOfAllColumnsWidths,
        getWidthSumTilStartColumnBeginning,
        getWidthSumTilEndColumnBeginning
    };
}