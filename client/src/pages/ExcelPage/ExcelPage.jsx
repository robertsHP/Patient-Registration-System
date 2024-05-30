import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

import './ExcelPage.css'

const getMonthDays = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
};
  
const initialData = (year, month) => {
    const days = getMonthDays(year, month);
    const layout = [];
    days.forEach((day, index) => {
        layout.push({ i: `day-${index}`, x: index, y: 0, w: 1, h: 1, static: true, date: day });
    });
    return {
        layout,
        events: [
            { i: 'event-1', x: 0, y: 1, w: 3, h: 1, title: 'Event 1' }  // Initial event spanning 3 days
        ]
    };
};

export default function ExcelPage() {
    const [data, setData] = useState(initialData(2024, 4));  // May 2024

    const onLayoutChange = (layout) => {
        setData(prevData => ({
          ...prevData,
          events: prevData.events.map(event => {
            const newLayout = layout.find(l => l.i === event.i);
            if (newLayout) {
              const overlappedEvent = prevData.events.find(e => e.i !== event.i && areOverlapping(e, newLayout));
              if (!overlappedEvent || newLayout.x >= event.x) { // Check if not overlapping or dragging right
                return { ...event, ...newLayout };
              }
            }
            return event;
          })
        }));
      };
      
      const areOverlapping = (event1, event2) => {
        return (
          event1.y === event2.y && // Events are on the same row
          !(event1.x + event1.w <= event2.x || event2.x + event2.w <= event1.x) // No horizontal gap between events
        );
      };
  
    return (
        <div>
            <h1>Event Scheduler</h1>
            <GridLayout
                className="layout"
                layout={[...data.layout, ...data.events]}
                cols={data.layout.length}
                rowHeight={50}
                width={1200}
                onLayoutChange={onLayoutChange}
                draggableHandle=".event-title"
            >
                {data.layout.map(item => (
                    <div key={item.i} className="day-cell">
                        {item.date.getDate()}
                    </div>
                ))}
                {data.events.map(event => (
                    <div key={event.i} className="event">
                        <div className="event-title">{event.title}</div>
                    </div>
                ))}
            </GridLayout>
        </div>
    );
}
