import React, { useEffect, useState } from 'react';

export default function useRoomManagementHook (initialRooms, initialRoomID) {
    const [rooms, setRooms] = useState(initialRooms);
    const [roomID, setRoomID] = useState(initialRoomID);

    const getRoom = (id) => {
        return rooms.find(room => room.id == id);
    }

    const setRoom = (updateRoom) => {
        setEvents(rooms.map(
            room => room.id == updateRoom.id ? updateRoom : room
        ));
    }

    return { rooms, setRooms, roomID, setRoomID, getRoom, setRoom };
}
