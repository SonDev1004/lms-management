
import React from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import EventCard from './EventCard';
import CustomToolbar from './CustomToolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Schedule.css';

export default function CalendarView({ localizer, events, view, setView, onEventClick, eventPropGetter }) {
    const eventRenderer = (props) => <EventCard {...props} currentView={view} onEventClick={onEventClick} />;

    const isPastDate = (date) => {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const today = new Date();
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return d < t;
    };
    //
    // const dayPropGetter = (date) => {
    //     if (date < today) {
    //         return {
    //             style: { color: '#999', opacity: 0.5 }
    //         };
    //     }
    //     return {};
    // };

    const dayPropGetter = (date) => {
        if (isPastDate(date)) {
            return { className: 'rbc-day-past' };
        }
        return {};
    };

    return (
        <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            selectable={false}
            eventPropGetter={eventPropGetter}
            dayPropGetter={dayPropGetter}
            views={{ month: true, week: true, day: true, agenda: true }}
            view={view}
            onView={setView}
            components={{
                event: eventRenderer,
                toolbar: CustomToolbar
            }}
        />
    );
}
