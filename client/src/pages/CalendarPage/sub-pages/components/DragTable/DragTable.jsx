import React, { useState, useEffect, useContext } from 'react';

import usePageRefresh from '../../../../../hooks/usePageRefresh.jsx';

import ApiService from '../../../../../services/ApiService';

import GridUI from './GridUI.jsx';
import ColumnRow from './ColumnRow.jsx';
import RoomRow from './RoomRow.jsx';
import SumRow from './SumRow.jsx';
import AppointmentInputForm from './AppointmentInputForm.jsx';

// import { EventTableProvider, EventTableContext } from '../../contexts/EventTableContext.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './DragTable.css';

export default function DragTable ({ data, config, queryParams }) {
    const pageRefreshed = usePageRefresh();

    const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);
    const [rowRefreshCounters, setRowRefreshCounters] = useState({});

    const addRoom = async () => {
        const saveRoomToDB = async (newRoom) => {
            var newRoom = {
                room_num: "",
                id_floor: data.floorID
            };

            try {
                const result = await ApiService.post(`/api/global/room`, newRoom);
                newRoom.id = result;
                newRoom.appointments = [];

                if(newRoom.id != null) {
                    data.setRooms([...data.rooms, newRoom]);
                }
            } catch (error) {
                console.log(`DragTable (addRoom) POST error: `, error);
            }
        };

        saveRoomToDB();
    };

    const deleteRoomRow = async (roomID) => {
        console.log("DELETE ROOM ROW");
    
        try {
            const params = `/api/calendar-page/drag-table/delete-room/${roomID}`;
            await ApiService.delete(params);
    
            // Update the data.rooms by filtering out the deleted room
            const updatedRooms = data.rooms.filter((room) => room.id !== roomID);
            
            // Update the state with the new room list
            data.setRooms(updatedRooms);
    
        } catch (error) {
            console.log("DragTable (deleteRoomRow) error: ");
            console.log(error);
        }
    };

    const refreshRoom = (roomID) => {
        setRowRefreshCounters(prevState => ({
            ...prevState,
            [roomID]: (prevState[roomID] || 0) + 1
        }));
    };

    return (
        <div className="drag-table">
            <GridUI 
                data={data} 
            />
            <ColumnRow config={config} />
            {typeof data.rooms !== 'undefined' && data.rooms != null &&
                (data.rooms.length !== 0 &&
                    data.rooms.map((room) => {
                        return (
                            <div key={`room-${room.id}`}>
                                <RoomRow
                                    data={data}
                                    roomID={room.id}
                                    config={config}
                                    selectedAppointmentData={selectedAppointmentData}
                                    setSelectedAppointmentData={setSelectedAppointmentData}
                                    pageRefreshed={pageRefreshed}
                                    deleteRoomRow={deleteRoomRow}
                                    refreshRoom={refreshRoom}
                                />
                            </div>
                        );
                    })
                )
            }

            <button onClick={addRoom} className="add-room-button">
                Pievienot telpu
            </button>

            <SumRow data={data} config={config} />
            {selectedAppointmentData && 
                <AppointmentInputForm 
                    data={data}
                    selectedAppointmentData={selectedAppointmentData} 
                    setSelectedAppointmentData={setSelectedAppointmentData} 
                    refreshRoom={refreshRoom}
                />
            }
        </div>
    );
}

