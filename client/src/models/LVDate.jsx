
export default class LVDate {
    #date

    constructor(...args) {
        this.setObject(...args);
    }

    setObject (...args) {
        if (args.length == 1) {
            var newDate = args[0];

            if (newDate instanceof LVDate) {
                this.#date = new Date(newDate.getObject());
            } else if (newDate instanceof Date || typeof newDate == 'string') {
                this.#date = new Date(newDate);
            } else {
                throw new Error("Invalid date format");
            }
        } else {
            const [year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = args;

            this.#date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
            
            if (isNaN(this.#date)) {
                throw new Error("Invalid date format");
            }
        }
    }

    setYear(year) {
        this.#date.setFullYear(year);
    }

    setMonth(month) {
        this.#date.setMonth(month - 1); // months are zero-indexed
    }

    setDate(date) {
        this.#date.setDate(date);
    }

    setDay(day) {
        this.#date.setDay(day);
    }

    setHours(hours) {
        this.#date.setHours(hours);
    }

    setMinutes(minutes) {
        this.#date.setMinutes(minutes);
    }

    setSeconds(seconds) {
        this.#date.setSeconds(seconds);
    }

    setMilliseconds(milliseconds) {
        this.#date.setMilliseconds(milliseconds);
    }

    getFullYear() {
        return this.#date.getFullYear();
    }

    getMonth() {
        return this.#date.getMonth() + 1; // months are zero-indexed
    }

    getDate() {
        return this.#date.getDate();
    }

    getObject() {
        return this.#date;
    }

    getDay() {
        return this.#date.getDay();
    }

    getHours() {
        return this.#date.getHours();
    }

    getMinutes() {
        return this.#date.getMinutes();
    }

    getSeconds() {
        return this.#date.getSeconds();
    }

    getMilliseconds() {
        return this.#date.getMilliseconds();
    }

    toISOString() {
        return this.#date.toISOString();
    }

    toDateString() {
        return this.#date.toDateString();
    }

    toTimeString() {
        return this.#date.toTimeString();
    }

    toLocaleDateString(locale = 'en-US', options) {
        return this.#date.toLocaleDateString(locale, options);
    }

    toLocaleTimeString(locale = 'en-US', options) {
        return this.#date.toLocaleTimeString(locale, options);
    }

    toLatvianDateString(options) {
        return this.#date.toLocaleDateString('lv-LV', options);
    }

    toLatvianTimeString(options) {
        return this.#date.toLocaleTimeString('lv-LV', options);
    }
}
