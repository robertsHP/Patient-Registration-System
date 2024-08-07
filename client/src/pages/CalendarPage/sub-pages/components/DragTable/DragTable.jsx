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

export default function DragTable ({ data, config }) {
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const pageRefreshed = usePageRefresh();

    const addRoom = () => {
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
                                    selectedAppointment={selectedAppointment}
                                    setSelectedAppointment={setSelectedAppointment}
                                    pageRefreshed={pageRefreshed}
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
            {selectedAppointment && 
                <AppointmentInputForm 
                    data={data}
                    selectedAppointment={selectedAppointment} 
                    setSelectedAppointment={setSelectedAppointment} 
                />
            }
        </div>
    );
}

