export default class LVDate {
    #date

    constructor(...args) {
        this.setObject(...args);
    }

    setObject(...args) {
        if (args.length == 1) {
            var newDate = args[0];
            
            if (newDate == null) {
                this.#date = null;
            } else if (newDate instanceof LVDate) {
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
        if (this.#date === null) return;
        this.#date.setFullYear(year);
    }

    setMonth(month) {
        if (this.#date === null) return;
        this.#date.setMonth(month - 1); // months are zero-indexed
    }

    setDate(date) {
        if (this.#date === null) return;
        this.#date.setDate(date);
    }

    setDay(day) {
        if (this.#date === null) return;
        this.#date.setDay(day);
    }

    setHours(hours) {
        if (this.#date === null) return;
        this.#date.setHours(hours);
    }

    setMinutes(minutes) {
        if (this.#date === null) return;
        this.#date.setMinutes(minutes);
    }

    setSeconds(seconds) {
        if (this.#date === null) return;
        this.#date.setSeconds(seconds);
    }

    setMilliseconds(milliseconds) {
        if (this.#date === null) return;
        this.#date.setMilliseconds(milliseconds);
    }

    incrementYear(years = 1) {
        if (this.#date === null) return;
        this.#date.setFullYear(this.#date.getFullYear() + years);
    }

    decrementYear(years = 1) {
        if (this.#date === null) return;
        this.incrementYear(-years);
    }

    incrementMonth(months = 1) {
        if (this.#date === null) return;
        this.#date.setMonth(this.#date.getMonth() + months);
    }

    decrementMonth(months = 1) {
        if (this.#date === null) return;
        this.incrementMonth(-months);
    }

    incrementDate(days = 1) {
        if (this.#date === null) return;
        this.#date.setDate(this.#date.getDate() + days);
    }

    decrementDate(days = 1) {
        if (this.#date === null) return;
        this.incrementDate(-days);
    }

    incrementHours(hours = 1) {
        if (this.#date === null) return;
        this.#date.setHours(this.#date.getHours() + hours);
    }

    decrementHours(hours = 1) {
        if (this.#date === null) return;
        this.incrementHours(-hours);
    }

    incrementMinutes(minutes = 1) {
        if (this.#date === null) return;
        this.#date.setMinutes(this.#date.getMinutes() + minutes);
    }

    decrementMinutes(minutes = 1) {
        if (this.#date === null) return;
        this.incrementMinutes(-minutes);
    }

    incrementSeconds(seconds = 1) {
        if (this.#date === null) return;
        this.#date.setSeconds(this.#date.getSeconds() + seconds);
    }

    decrementSeconds(seconds = 1) {
        if (this.#date === null) return;
        this.incrementSeconds(-seconds);
    }

    incrementMilliseconds(milliseconds = 1) {
        if (this.#date === null) return;
        this.#date.setMilliseconds(this.#date.getMilliseconds() + milliseconds);
    }

    decrementMilliseconds(milliseconds = 1) {
        if (this.#date === null) return;
        this.incrementMilliseconds(-milliseconds);
    }

    getFullYear() {
        return this.#date === null ? null : this.#date.getFullYear();
    }

    getMonth() {
        return this.#date === null ? null : this.#date.getMonth() + 1; // months are zero-indexed
    }

    getDate() {
        return this.#date === null ? null : this.#date.getDate();
    }

    getObject() {
        return this.#date;
    }

    getDay() {
        //(this.#date.getDay() - 1 + 7) % 7

        // return this.#date === null ? null : this.#date.getDay();

        return this.#date === null ? null : (this.#date.getDay() - 1 + 7) % 7;
    }

    getHours() {
        return this.#date === null ? null : this.#date.getHours();
    }

    getMinutes() {
        return this.#date === null ? null : this.#date.getMinutes();
    }

    getSeconds() {
        return this.#date === null ? null : this.#date.getSeconds();
    }

    getMilliseconds() {
        return this.#date === null ? null : this.#date.getMilliseconds();
    }

    getDateStringForHTMLTag() {
        if (this.#date === null) return '';
        const year = this.#date.getFullYear();
        const month = String(this.#date.getMonth() + 1).padStart(2, '0');
        const dateNum = String(this.#date.getDate()).padStart(2, '0');
        const hours = String(this.#date.getHours()).padStart(2, '0');
        const minutes = String(this.#date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${dateNum}T${hours}:${minutes}`;
    }

    toISOString() {
        return this.#date === null ? '' : this.#date.toISOString();
    }

    toDateString() {
        return this.#date === null ? '' : this.#date.toDateString();
    }

    toTimeString() {
        return this.#date === null ? '' : this.#date.toTimeString();
    }

    toLocaleDateString(locale = 'en-US', options) {
        return this.#date === null ? '' : this.#date.toLocaleDateString(locale, options);
    }

    toLocaleTimeString(locale = 'en-US', options) {
        return this.#date === null ? '' : this.#date.toLocaleTimeString(locale, options);
    }

    toLatvianDateString(options) {
        return this.#date === null ? '' : this.#date.toLocaleDateString('lv-LV', options);
    }

    toLatvianTimeString(options) {
        return this.#date === null ? '' : this.#date.toLocaleTimeString('lv-LV', options);
    }
}
