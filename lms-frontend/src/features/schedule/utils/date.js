import moment from 'moment-timezone';
const TIMEZONE = 'Asia/Ho_Chi_Minh';

export function parseDateField(d) {
    if (!d) return null;
    if (d instanceof Date) return d;
    try {
        return moment.tz(String(d), TIMEZONE).toDate();
    } catch (ex) {
        console.warn(ex);
        return new Date(d);
    }
}

export function parseEvent(e) {
    return {
        ...e,
        start: parseDateField(e.start),
        end: parseDateField(e.end),
    };
}

export function formatEventTime(date) {
    if (!date) return '';
    try {
        return moment(date).tz(TIMEZONE).format('YYYY-MM-DD HH:mm');
    } catch (ex) {
        console.warn(ex);
        return date.toLocaleString();
    }
}
