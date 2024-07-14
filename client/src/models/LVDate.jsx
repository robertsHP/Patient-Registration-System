
export default class LVDate {
    #date

    constructor(...args) {
        this.setDate(...args);
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    setDate (...args) {
        if (args.length == 1) {
            var newDate = args[0];

            // console.log(newDate);

            if (newDate instanceof LVDate) {
                this.#date = new Date(newDate.getDate());
            } else if (newDate instanceof Date || typeof newDate == 'string') {
                this.#date = new Date(newDate);
            } else {
                throw new Error("Invalid date format");
            }
        } else {
            const [year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = args;

            this.#date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds));
            if (isNaN(this.#date)) {
                throw new Error("Invalid date format");
            }
        }
    }

    setYear(year) {
        this.#date.setUTCFullYear(year);
    }

    setMonth(month) {
        this.#date.setUTCMonth(month - 1); // months are zero-indexed
    }

    setDay(day) {
        this.#date.setUTCDate(day);
    }

    setHours(hours) {
        this.#date.setUTCHours(hours);
    }

    setMinutes(minutes) {
        this.#date.setUTCMinutes(minutes);
    }

    setSeconds(seconds) {
        this.#date.setUTCSeconds(seconds);
    }

    setMilliseconds(milliseconds) {
        this.#date.setUTCMilliseconds(milliseconds);
    }

    getFullYear() {
        return this.#date.getUTCFullYear();
    }

    getMonth() {
        return this.#date.getUTCMonth() + 1; // months are zero-indexed
    }

    getDate() {
        return this.#date;
    }

    getDay() {
        return this.#date.getUTCDay();
    }

    getHours() {
        return this.#date.getUTCHours();
    }

    getMinutes() {
        return this.#date.getUTCMinutes();
    }

    getSeconds() {
        return this.#date.getUTCSeconds();
    }

    getMilliseconds() {
        return this.#date.getUTCMilliseconds();
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
