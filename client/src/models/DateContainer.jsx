
export default class DateContainer {
    constructor(year, month, day) {
        this.setDate(new Date());
    }

    // Ensure the date is a valid Date object
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    getYear () {
        console.log(this.date.getFullYear());

        return this.date.getFullYear();
    }

    getMonth () {
        console.log(this.date.getMonth());

        return this.date.getMonth();
    }

    getDay () {
        console.log(this.date.getDay());

        return this.date.getDay();
    }

    // Set the date and store it in the Latvian time zone format
    setDate(date) {
        if (DateContainer.isValidDate(new Date(date))) {
            const options = { timeZone: 'Europe/Riga', hour12: false };
            const latvianDateStr = new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
            this.date = new Date(latvianDateStr);

            console.log(this.date);
        } else {
            throw new Error('Invalid date format');
        }
    }

    // Get the stored date object
    getDate() {
        return this.date;
    }

    // Format the stored date in the given locale and options
    format(locale = 'en-GB', options = {}) {
        if (!DateContainer.isValidDate(this.date)) {
            throw new Error('Invalid date');
        }
        const formatter = new Intl.DateTimeFormat(locale, options);
        return formatter.format(this.date);
    }

    // Format the stored date for the Latvian time zone
    formatForLatvianTimeZone() {
        return this.format('en-GB', {
            timeZone: 'Europe/Riga',
            timeZoneName: 'short'
        });
    }

    // Return the stored date in ISO string format
    toISOString() {
        return this.date.toISOString();
    }
}