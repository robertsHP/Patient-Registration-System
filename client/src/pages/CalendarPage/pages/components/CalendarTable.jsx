import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  EVENT: 'event'
};

const DraggableEvent = ({ event }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.EVENT,
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '4px',
        backgroundColor: 'lightblue',
        cursor: 'move',
        marginBottom: '4px'
      }}
    >
      {event.title}
    </div>
  );
};

const DroppableCell = ({ date, room, onDropEvent, children }) => {
  const [, drop] = useDrop({
    accept: ItemType.EVENT,
    drop: (item) => onDropEvent(item.event, date, room),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <td ref={drop} style={{ minWidth: '100px', minHeight: '50px', border: '1px solid black' }}>
      {children}
    </td>
  );
};

const CalendarTable = () => {
  const [events, setEvents] = useState([
    { id: 0, title: 'Event 1', date: 1, room: 'Room A' },
    { id: 1, title: 'Event 2', date: 2, room: 'Room B' }
  ]);

  const rooms = ['Room A', 'Room B', 'Room C'];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleDropEvent = (event, newDate, newRoom) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) =>
        e.id === event.id ? { ...e, date: newDate, room: newRoom } : e
      )
    );
  };

  const renderEvents = (date, room) => {
    return events
      .filter((event) => event.date === date && event.room === room)
      .map((event) => (
        <DraggableEvent key={event.id} event={event} />
      ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <table>
        <thead>
          <tr>
            <th>Room / Date</th>
            {daysInMonth.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room}>
              <td>{room}</td>
              {daysInMonth.map((day) => (
                <DroppableCell key={day} date={day} room={room} onDropEvent={handleDropEvent}>
                  {renderEvents(day, room)}
                </DroppableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
};

export default CalendarTable;
