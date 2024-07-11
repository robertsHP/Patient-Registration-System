import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './SumRow.css';

export default function SumRow({ data, config }) {


    // const [dateSums, setDateSums] = useState([]);
    // const [totalSum, setTotalSum] = useState(0);

    // useEffect(() => {
    //     const updatedDateSums = config.dateLayout.map(dateItem => {
    //         const date = new Date(dateItem.title);
    //         return Object.values(data.rooms).reduce((sum, room) => {
    //             return sum + room.events.reduce((eventSum, event) => 
    //                 eventSum + (isEventOnDate(event, date) ? 1 : 0)
    //             , 0);
    //         }, 0);
    //     });
    //     setDateSums(updatedDateSums);

    //     const updatedTotalSum = updatedDateSums.reduce((sum, dateSum) => sum + dateSum, 0);
    //     setTotalSum(updatedTotalSum);
    // }, [localEvents]);






    // Helper function to check if an event occurs on a specific date
    const isEventOnDate = (event, date) => {
        const eventStart = new Date(event.begin_date);
        const eventEnd = new Date(event.end_date);

        return date >= eventStart && date <= eventEnd;
    };

    const dateSums = config.dateLayout.map(dateItem => {
        const year = data.date.getFullYear();
        const month = data.date.getMonth();
        const date = new Date(year, month, dateItem.title);

        return Object.values(data.rooms).reduce((sum, room) => {
            return sum + room.events.reduce((eventSum, event) => 
                eventSum + (isEventOnDate(event, date) ? 1 : 0)
            , 0);
        }, 0);
    });

    const sumColumnStart = config.columnWidths.slice(0, config.columnWidths.length - 2).reduce((acc, width) => acc + width, 0);
    const totalSum = dateSums.reduce((acc, sum) => acc + sum, 0);

    return (
        <GridLayout
            className="layout"
            layout={[
                ...config.dateLayout.map((item, index) => ({
                    i: item.i,
                    x: config.columnWidths.slice(0, index + 2).reduce((acc, width) => acc + width, 0),
                    y: 0,
                    w: config.columnWidths[index + 2],
                    h: 1,
                    static: true,
                })),
                { 
                    i: 'sum-column', 
                    x: sumColumnStart, 
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
            {dateSums.map((sum, index) => (
                <div key={config.dateLayout[index].i} className="grid-cell">
                    {sum}
                </div>
            ))}
            <div key="sum-column" className="grid-cell header">{totalSum}</div>
        </GridLayout>
    );
}