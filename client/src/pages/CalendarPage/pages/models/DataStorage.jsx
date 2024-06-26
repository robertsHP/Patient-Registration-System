

export default class DataStorage {
    constructor() {
        this.events = [];
        this.rooms = [];
    }

    addEvents(events) {
        this.events = events;
    }

    addRooms(rooms) {
        this.rooms = rooms;
    }

    addEvent(event) {
        this.events.push(event);
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    getEvents() {
        return this.events;
    }

    getRooms() {
        return this.rooms;
    }
}