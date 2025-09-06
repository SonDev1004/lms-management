// components/CalendarView.jsx
import React from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import EventCard from './EventCard';
import CustomToolbar from './CustomToolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function CalendarView({ localizer, events, view, setView, onEventClick, eventPropGetter }) {
    const eventRenderer = (props) => <EventCard {...props} currentView={view} onEventClick={onEventClick} />;

    return (
        <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            selectable={false}
            eventPropGetter={eventPropGetter}
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
