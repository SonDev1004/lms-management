// components/EventCard.jsx
import React from 'react';

// event, title, start, end, resource được truyền sẵn
export default function EventCard({ event }) {
    // Format giờ/phút
    const start = event.start instanceof Date ? event.start : new Date(event.start);
    const end = event.end instanceof Date ? event.end : new Date(event.end);
    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ fontSize: 13, lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{event.title}</div>
            <div style={{ fontSize: 12 }}>{event.resource}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{startStr} - {endStr}
            </div>
        </div>
    );
}
