import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

export default function useDataFetch(floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);

    const getDayIndex = (date, monthStart) => {
        const startDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
        return Math.floor((new Date(date) - startDate) / (1000 * 60 * 60 * 24));
    };

    const convertRoomDataToLayout = (curRooms) => {
        if (!curRooms) {
            return;
        }
        const newRooms = curRooms.map((room) => ({
            ...room,
            events: room.events.map(event => ({
                ...event,
                i: `event-${event.id_event}`,
                x: getDayIndex(event.begin_date, date) + 8,
                y: 0,
                w: getDayIndex(event.end_date, date) - getDayIndex(event.begin_date, date) + 1,
                h: 1
            }))
        }));
        return newRooms;
    };
    
    const convertLayoutToRoomData = (curRooms) => {
        if (!curRooms) {
            return;
        }
        const newRooms = curRooms.map(room => ({
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
        return newRooms;
    };

    const getRoomWithID = (id) => {
        return rooms.find(room => room.id_room === id);
    };

    const setRoomWithID = (id, room) => {
        setRooms(rooms.map(r => r.id_room === id ? room : r));
    };

    const getEventWithID = (roomID, eventID) => {
        const room = getRoomByID(roomID);
        if (!room) {
            return null;
        }
        return room.events.find(event => event.id_event === eventID);
    };

    const setEventWithID = (roomID, event) => {
        const room = getRoomByID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            events: room.events.map(e => e.id_event === id ? event : e)
        });
    };

    const removeEventWithID = (roomID, eventID) => {
        const room = getRoomByID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            events: room.events.filter(e => e.id_event !== eventID)
        });
    };

    useEffect(() => {
        var params = `?floorId=${floorID}&year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
    
        ApiService.get('/api/calendar-page/table'+params)
        .then(result => {
            setRooms(convertRoomDataToLayout(result.data[0].rooms));
        })
        .catch(error => {
            console.error('Failed to get data in useDataFetch - ' + error);
        });
    }, [floorID, date]);

    return { 
        date, setDate,
        rooms, setRooms,
        getRoomWithID, setRoomWithID,
        getEventWithID, setEventWithID, removeEventWithID,
        convertRoomDataToLayout,
        convertLayoutToRoomData
    };
}
