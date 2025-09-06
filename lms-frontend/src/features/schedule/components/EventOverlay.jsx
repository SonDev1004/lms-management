import React from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { formatEventTime } from '../utils/date';

export default function EventOverlay({ overlayRef, selectedEvent }) {
    return (
        <OverlayPanel ref={overlayRef} showCloseIcon={false} className="event-overlay" dismissable>
            {selectedEvent ? (
                <div className="p-d-flex p-flex-column p-gap-1">
                    <div className="small">📍 {selectedEvent.room}</div>
                    <div className="p-text-bold">{selectedEvent.title}</div>
                    <div className="small">👩‍🏫 {selectedEvent.teacher}</div>
                    <div className="small">{formatEventTime(selectedEvent.start)} — {formatEventTime(selectedEvent.end)}</div>
                    <div className="chip-type">📘 {selectedEvent.type}</div>
                </div>
            ) : null}
        </OverlayPanel>
    );
}
