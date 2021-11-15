export class DateHelper {
    static getCurrentDate() {
        let today: Date = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        // @ts-ignore
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    static getCurrentTime(unixTimestamp) {
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
        const date = new Date(unixTimestamp);
// Hours part from the timestamp
        const hours = date.getHours();
// Minutes part from the timestamp
        const minutes = '0' + date.getMinutes();
// Seconds part from the timestamp

// Will display time in 10:30:23 format
        return hours + ':' + minutes.substr(-2);
    }

    static formatMovementDate = (date, locale) => {
        const calcDaysPassed = (date1, date2) =>
            Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

        const daysPassed = calcDaysPassed(new Date(), date);

            if (daysPassed === 0) return 'היום';


        // if (daysPassed <= 7) return `${daysPassed} days ago`;
        return new Intl.DateTimeFormat(locale).format(date);
    };
}
