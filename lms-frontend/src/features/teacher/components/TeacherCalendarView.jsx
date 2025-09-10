import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import vi from 'date-fns/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventCard from './EventCard';
import '../styles/teacher.css';

const locales = { vi };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const events = [
    {
        title: 'Dạy lớp TOEIC A',
        start: new Date(2025, 8, 10, 8, 0),
        end: new Date(2025, 8, 10, 9, 0),
        resource: 'Phòng 101',
    },
    {
        title: 'Dạy lớp IELTS B',
        start: new Date(2025, 8, 10, 14, 0),
        end: new Date(2025, 8, 10, 16, 0),
        resource: 'Phòng 302',
    },
    {
        title: 'Dạy lớp Speaking C',
        start: new Date(2024, 8, 11, 9, 0),
        end: new Date(2024, 8, 11, 11, 0),
        resource: 'Phòng 203',
    },
    {
        title: 'Họp giáo viên',
        start: new Date(2025, 8, 12, 17, 30),
        end: new Date(2025, 8, 12, 19, 30),
        resource: 'Phòng họp',
    },
    {
        title: 'Dạy lớp TOEIC B',
        start: new Date(2025, 8, 13, 8, 0),
        end: new Date(2025, 8, 13, 10, 0),
        resource: 'Phòng 105',
    },
    {
        title: 'Dạy lớp Writing A',
        start: new Date(2025, 8, 14, 15, 0),
        end: new Date(2025, 8, 14, 17, 0),
        resource: 'Phòng 206',
    },
];



export default function CalendarTest() {
    const [selectedEventId, setSelectedEventId] = useState(null);

    const eventPropGetter = (event, start, end, isSelected) => {
        let backgroundColor = "#1976d2";
        // Tùy biến từng event nếu muốn
        if (event.title === "Dạy lớp TOEIC A") backgroundColor = "#e53935";
        if (event.title === "Dạy lớp IELTS B") backgroundColor = "#1976d2";
        if (event.title === "Họp giáo viên") backgroundColor = "#43a047";
        if (event.title === "Dạy lớp Writing A") backgroundColor = "#0288d1";

        return {
            style: {
                backgroundColor,
                color: "#fff",
                borderRadius: 8,
                fontWeight: 500,
                opacity: 1, // QUAN TRỌNG
                border: "none",
            },
        };
    };


    return (
        <div style={{ height: 1000, minHeight: 800 }}>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
                components={{
                    event: EventCard,
                    timeGridEvent: EventCard
                }}
                eventPropGetter={eventPropGetter}
                onSelectEvent={event => setSelectedEventId(event.title + event.start)}
            />
        </div>
    );
}
