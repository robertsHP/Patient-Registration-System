import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { excelData } from '../data/excelData.js';

function getDaysInAMonth (month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getDateColumns(month, year) {
    const daysAmount = getDaysInAMonth(month, year);
    let columns = [];
    for (let i = 1; i <= daysAmount - 1; i++)
        columns.push({header: i, key: i, width: 5});
    return columns;
}

function filterEventsByMonth (year, month, events) {
    return events.filter(item => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);

        return (startDate.getMonth() === month && startDate.getFullYear() === year) ||
                (endDate.getMonth() === month && endDate.getFullYear() === year);
    });
}

export const exportExcel = async (month, year, events) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('January 2024');

    worksheet.columns = [
        { header: 'Num.', key: 'num', width: 10 },
        { header: 'Bed', key: 'bed', width: 32 },
        { header: 'Name, Surname', key: 'name', width: 32 },
        ...getDateColumns(month, year,)
    ];

    var filteredEvents = filterEventsByMonth(year, month, events);

    Object.entries(excelData.beds).forEach(([roomNum, beds]) => {

        beds.forEach(function(bed) {
            worksheet.addRow({ num: roomNum, bed: bed});
        });

        // worksheet.addRow({ num: 23, item: 'big bed', name: 'John Doe' });
    });

    // // Add rows. Replace with your actual data.
    // worksheet.addRow({ num: 23, item: 'big bed', name: 'John Doe' });
    // worksheet.addRow({ num: 23, item: 'sofa', name: '' });
    // worksheet.addRow({ num: 24, item: 'big bed', name: 'Jane Doe' });
    
    // // Save workbook to file
    // workbook.xlsx.writeBuffer()
    //     .then((buffer) => {
    //         saveAs(new Blob([buffer]), "MyFile.xlsx");
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
};