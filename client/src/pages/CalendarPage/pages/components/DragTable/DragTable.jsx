import React, { useState, useEffect, useContext } from 'react';

import useTableConfigurations from '../../hooks/useTableConfigurations.jsx';
import usePageRefresh from '../../../../../hooks/usePageRefresh.jsx';

import GridUI from './GridUI.jsx';
import ColumnRow from './ColumnRow.jsx';
import RoomRow from './RoomRow.jsx';
import SumRow from './SumRow.jsx';
import AppointmentInputForm from './AppointmentInputForm.jsx';

// import { EventTableProvider, EventTableContext } from '../../contexts/EventTableContext.jsx';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './DragTable.css';

function DragTableContent ({ data }) {
    const config = useTableConfigurations(data.date);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [inputFormData, setInputFormData] = useState(null);

    const pageRefreshed = usePageRefresh();

    return (
        <div className="grid-container">
            <GridUI 
                data={data} 
            />
            <ColumnRow config={config} />
            {typeof data.rooms !== 'undefined' && data.rooms != null &&
                (data.rooms.length !== 0 &&
                    data.rooms.map((room) => 
                        room && (
                            <div 
                                key={`room-${room.id}`} 
                                className="grid-cell" 
                                style={{ gridColumn: `span ${config.cols}` }}
                            >
                                <RoomRow
                                    data={data}
                                    roomID={room.id}
                                    config={config}
                                    selectedAppointment={selectedAppointment}
                                    setSelectedAppointment={setSelectedAppointment}

                                    inputFormData={inputFormData}
                                    setInputFormData={setInputFormData}

                                    pageRefreshed={pageRefreshed}
                                />
                            </div>
                        )
                    )
                )
            }
            <SumRow data={data} config={config} />
            {selectedAppointment && 
                <AppointmentInputForm 
                    selectedAppointment={selectedAppointment} 
                    setSelectedAppointment={setSelectedAppointment} 
                />
            }
        </div>
    );
}

export default function DragTable ({data}) {
    return (
        // <EventTableProvider>
            <DragTableContent 
                data={data}
            />
        // </EventTableProvider>
    );
}