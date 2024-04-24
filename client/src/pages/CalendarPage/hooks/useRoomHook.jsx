import React, { useEffect, useState } from 'react';

export default function useRoomHook (initialRooms, initialRoomID) {
    const [rooms, setRooms] = useState(initialRooms);

    const getRoom = (id) => {
        return rooms.find(room => room.id == id);
    }

    const [
        selectedRoom, 
        setSelectedRoom
    ] = useState(getRoom(initialRoomID) || null);

    const getRoomWithNumber = (num) => {
        return rooms.find(room => room.num == num);
    }

    const setRoom = (id, updateRoom) => {
        setRooms(rooms.map(
            room => room.id == id ? updateRoom : room
        ));

        if(selectedRoom != null) {
            if(id == selectedRoom.id) {
                setSelectedRoom(updateRoom);
            }
        }
    }

    const deleteRoom = (id) => {
        setRooms(prevRooms => prevRooms.filter(room => room.id != id));

        if(selectedRoom != null) {
            if(id == selectedRoom.id) {
                setSelectedRoom(null);
            }
        }
    }

    const updateRoom = (id, values) => {
        setRooms(rooms.map(
            room => room.id == id 
            ? 
            {...room, ...values} 
            : 
            room
        ));

        if(selectedRoom != null) {
            if(id == selectedRoom.id) {
                setSelectedRoom({...selectedRoom, ...values});
            }
        }
    }


    return { 
        rooms, setRooms, 
        getRoom, getRoomWithNumber, 
        setRoom, deleteRoom, updateRoom,
        selectedRoom, setSelectedRoom
    };
}
