import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './SumRow.css';

export default function SumRow({ data, config }) {
    const [dateSums, setDateSums] = useState([]);
    const [totalSum, setTotalSum] = useState(0);

    // Helper function to check if an event occurs on a specific date
    const isEventOnDate = (event, date) => {
        const eventStart = new Date(event.begin_date);
        const eventEnd = new Date(event.end_date);

        // console.log();

        return date >= eventStart && date <= eventEnd;
    };

    useEffect(() => {
        const updatedDateSums = config.dateLayout.map(dateItem => {
            const year = data.date.getFullYear();
            const month = data.date.getMonth();
            const date = new Date(year, month, dateItem.num);

            return Object.values(data.rooms).reduce((sum, room) => {
                console.log(sum);
                return sum + room.events.reduce((eventSum, event) => 
                    eventSum + (isEventOnDate(event, date) ? 1 : 0)
                , 0);
            }, 0);
        });
        setDateSums(updatedDateSums);

        const updatedTotalSum = updatedDateSums.reduce((sum, dateSum) => sum + dateSum, 0);
        setTotalSum(updatedTotalSum);

        console.log('!!!updatedDateSums');
    }, [data.rooms]);

    return (
        <GridLayout
            className="layout"
            layout={[
                { 
                    i: 'room-gap', 
                    x: 0, 
                    y: 0, 
                    w: config.columnWidths[0], 
                    h: 1, 
                    static: true 
                },
                { i
                    : 'name-gap', 
                    x: config.columnWidths[0], 
                    y: 0, 
                    w: config.columnWidths[1], 
                    h: 1, 
                    static: true 
                },
                ...config.dateLayout.map((item, index) => ({
                    ...item,
                    x: config.columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                    y: 0,
                    w: config.columnWidths[index + 2],
                    h: 1,
                    static: true
                })),
                { 
                    i: 'sum-column', 
                    x: config.columnWidths.slice(0, config.columnWidths.length - 2)
                        .reduce((acc, width) => acc + width, 0), 
                    y: 0, 
                    w: config.columnWidths[config.columnWidths.length - 2], 
                    h: 1, 
                    static: true 
                }
            ]}
            cols={config.cols}
            rowHeight={config.rowHeight}
            width={config.width}
            isDraggable={false}
            isResizable={false}
        >
            <div key="room-gap"></div>
            <div key="name-gap"></div>
            {dateSums.map((sum, index) => (
                <div key={config.dateLayout[index].i} className="grid-cell">
                    {sum}
                </div>
            ))}
            <div key="sum-column" className="grid-cell">{totalSum}</div>
        </GridLayout>
    );
}