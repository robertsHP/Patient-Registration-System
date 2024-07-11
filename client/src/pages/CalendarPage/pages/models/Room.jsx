
export default class Room {
    constructor(id, number, beds) {
        this.id = id;
        this.number = number;
        this.beds = beds;
        this.events = [];
    }

    getDetails() {
        return `
            ${this.id}, ${this.number}, ${this.beds}
        `;
    }
}