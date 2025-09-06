import React from 'react';

export default function EventCard({ event, currentView, onEventClick }) {
    const typeIcon = '📘';
    const showType = currentView !== 'month';

    return (
        <div
            className="rbc-event-card"
            onClick={(ev) => {
                if (typeof onEventClick === 'function') onEventClick(event, ev.currentTarget);
            }}
            role="button"
            aria-label={`Sự kiện ${event.title}`}
        >
            <div className="rbc-event-card-title">{typeIcon} {event.title}</div>
            <div className="rbc-event-card-meta">👩‍🏫 {event.teacher} · 📍 {event.room}</div>
            {showType && <div className="rbc-event-card-type">📘 {event.type}</div>}
        </div>
    );
}
