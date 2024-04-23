import React, { useEffect, useState } from 'react';

export default function useRoomHook (initialRooms, initialRoomID) {
    const [rooms, setRooms] = useState(initialRooms);
    const [roomID, setRoomID] = useState(initialRoomID);

    const getRoom = (id) => {
        return rooms.find(room => room.id == id);
    }

    const getRoomWithNumber = (num) => {
        return rooms.find(room => room.num == num);
    }

    const setRoom = (id, updateRoom) => {
        setRooms(rooms.map(
            room => room.id == id ? updateRoom : room
        ));
    }

    return { rooms, setRooms, roomID, setRoomID, getRoom, getRoomWithNumber, setRoom };
}
