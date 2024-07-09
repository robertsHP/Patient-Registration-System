import React, { useState, useEffect } from 'react';

import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ColumnRow from './ColumnRow';
import EventRow from './EventRow';
import SumRow from './SumRow';

import './EventTable.css';

// Helper function to get all days of a specific month and year
const getDaysOfMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

// Helper function to convert date to day index
const getDayIndex = (date, monthStart) => {
    const startDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    return Math.floor((new Date(date) - startDate) / (1000 * 60 * 60 * 24));
};

// Function to convert room data to grid layout format
const fromRoomDataToLayout = (rooms, monthStart) => {
    return rooms.map((room, rIndex) => ({
        ...room,
        events: room.events.map(event => ({
            ...event,
            i: `event-${event.id_event}`,
            x: getDayIndex(event.begin_date, monthStart) + 8, // Adjusting start day index to grid position (consider column offsets)
            y: 0,
            w: getDayIndex(event.end_date, monthStart) - getDayIndex(event.begin_date, monthStart) + 1,
            h: 1
        }))
    }));
};


const fromLayoutToRoomData = (rooms) => {
    return rooms.map(room => ({
        ...room,
        events: room.events.filter(event => event.i.startsWith('event-')).map(event => ({
            notes: event.notes,
            doctor: {
                doc_name: event.doctor.doc_name,
                id_doctor: event.doctor.id_doctor
            },
            patient: {
                pat_name: event.patient.pat_name,
                phone_num: event.patient.phone_num,
                id_patient: event.patient.id_patient,
                patient_type: {
                    pat_type: event.patient.patient_type.pat_type,
                    id_pat_type: event.patient.patient_type.id_pat_type
                },
                hotel_stay_end: event.patient.hotel_stay_end,
                hotel_stay_start: event.patient.hotel_stay_start
            },
            end_date: new Date(event.end_date),
            id_event: parseInt(event.i.split('-')[1]),
            begin_date: new Date(event.begin_date)
        }))
    }));
};



export default function EventTable({ date, setDate, rooms, setRooms }) {
    const daysOfMonth = getDaysOfMonth(date.getFullYear(), date.getMonth());
    const columnWidths = [4, 4, ...daysOfMonth.map(() => 1), 1, 4];
    const dateLayout = daysOfMonth.map((day, index) => ({
        i: `day-${index}`, 
        x: index + 8, // Adjusting for fixed columns
        y: 0,
        w: 1,
        h: 1,
        static: true,
        title: day.getDate()
    }));
    const width = 1200;

    const [nextEventId, setNextEventId] = useState(
        rooms.flatMap(room => room.events.map(event => event.id_event)).length
    );
    const sumOfAllColWidths = columnWidths.reduce((acc, width) => acc + width, 0);
    const preparedRooms = fromRoomDataToLayout(rooms, new Date(date.getFullYear(), date.getMonth(), 1));
    
    const reconvertedRooms = fromLayoutToRoomData(preparedRooms);

    return (
        <div className="grid-container">
            <ColumnRow
                dateLayout={dateLayout}
                width={width}
                columnWidths={columnWidths}
                sumOfAllColWidths={sumOfAllColWidths}
            />
            {preparedRooms.map((room, roomIndex) => (
                <div key={`room-${room.id_room}`} className="grid-cell" style={{ gridColumn: `span ${sumOfAllColWidths}` }}>
                    <EventRow
                        room={room}
                        width={width}
                        nextEventId={nextEventId}
                        setNextEventId={setNextEventId}
                        columnWidths={columnWidths}
                        sumOfAllColWidths={sumOfAllColWidths}
                    />
                </div>
            ))}
            <SumRow 
                dateLayout={dateLayout} 
                width={width} 
                columnWidths={columnWidths} 
                sumOfAllColWidths={sumOfAllColWidths} 
                rooms={rooms} 
            />
        </div>
    );
}
