

export default class DataStorage {
    constructor() {
        this.events = [];
        this.rooms = [];
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