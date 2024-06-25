

export default class Event {
    constructor(id, room, patientName, start, end) {
        this.id = id;
        this.room = room;
        this.patientName = patientName;
        this.start = start;
        this.end = end;
    }

    getDetails() {
        return `
            ${this.id}, ${this.room}, ${this.patientName}, ${this.start}, ${this.end}
        `;
    }
}