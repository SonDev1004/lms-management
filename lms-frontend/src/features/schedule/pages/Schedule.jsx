// pages/Schedule.jsx
import React, { useRef, useState } from 'react';
import moment from 'moment-timezone';
import { momentLocalizer } from 'react-big-calendar';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import useSchedule from '../hooks/useSchedule';
import CalendarView from '../components/CalendarView';
import SidebarFilters from '../components/SidebarFilters';
import EventOverlay from '../components/EventOverlay';
import CreateEventDialog from '../components/dialogs/CreateEventDialog';
import EventDetailDialog from '../components/dialogs/EventDetailDialog';
import '../styles/Schedule.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

moment.tz.setDefault('Asia/Ho_Chi_Minh');
const localizer = momentLocalizer(moment);

export default function SchedulePage() {
    const { filteredEvents, filters, setFilters, teacherOptions, typeOptions, onlyMine, addEvent, removeEvent } = useSchedule();
    const [view, setView] = useState('month');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const toastRef = useRef(null);
    const overlayRef = useRef(null);

    const appliedCount = filters.types.length + filters.teachers.length + (filters.search ? 1 : 0) + (onlyMine ? 1 : 0);

    const handleApply = () => toastRef.current && toastRef.current.show({ severity: 'info', summary: 'Bộ lọc', detail: 'Đã áp dụng bộ lọc.' });
    const handleClear = () => setFilters({ types: [], teachers: [], search: '' });

    const eventStyleGetter = (event) => {
        const base = { style: { borderRadius: '8px', padding: '6px 8px', border: 'none', boxShadow: 'none' } };
        switch (event.type) {
            case 'Practice':
                base.style.background = '#fffaf0'; base.style.color = '#7a4a00'; break;
            case 'One-on-one':
                base.style.background = '#e8f7ff'; base.style.color = '#063b4e'; break;
            case 'Lecture':
                base.style.background = '#eef2ff'; base.style.color = '#2a2a8f'; break;
            default:
                base.style.background = '#e6fffa'; base.style.color = '#065f46';
        }
        base.style.opacity = 0.98;
        return base;
    };

    // when event card clicked -> anchor overlay to element
    const handleEventClick = (event, target) => {
        setSelectedEvent(event);
        if (overlayRef.current && target) {
            overlayRef.current.toggle(target);
        }
    };

    const handleCreate = async (payload) => {
        try {
            // try to parse ISO strings as in original
            const normalized = {
                ...payload,
                start: new Date(payload.start).toISOString(),
                end: new Date(payload.end).toISOString(),
            };
            await addEvent(normalized);
            setShowCreate(false);
            toastRef.current && toastRef.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm sự kiện.' });
        } catch (err) {
            console.error(err);
            toastRef.current && toastRef.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm sự kiện.' });
        }
    };

    const handleDelete = async (event) => {
        if (!event) return;
        try {
            await removeEvent(event.id);
            setSelectedEvent(null);
            toastRef.current && toastRef.current.show({ severity: 'success', summary: 'Đã xoá', detail: 'Sự kiện đã được xoá.' });
        } catch (err) {
            console.error(err);
            toastRef.current && toastRef.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xoá sự kiện.' });
        }
    };

    return (
        <div className="p-m-4 schedule-page">
            <Toast ref={toastRef} />
            <Toolbar className="p-mb-3" left={() => <h2 className="p-m-0 title">Thời khoá biểu - Trung tâm</h2>} right={() => (
                <div className="p-d-flex p-ai-center p-gap-2">
                </div>
            )} />

            <div className="p-grid">
                <div className="p-col-12 p-md-3">
                    <SidebarFilters filters={filters} setFilters={setFilters} teacherOptions={teacherOptions} typeOptions={typeOptions}
                                    onApply={handleApply} onClear={handleClear} appliedCount={appliedCount} />
                </div>

                <div className="p-col-12 p-md-9">
                    <div className="calendar-card p-shadow-3 p-p-3">
                        <CalendarView localizer={localizer} events={filteredEvents} view={view} setView={setView}
                                      onEventClick={handleEventClick} eventPropGetter={eventStyleGetter} />
                    </div>
                </div>
            </div>

            <EventOverlay overlayRef={overlayRef} selectedEvent={selectedEvent} />

            <EventDetailDialog event={selectedEvent} visible={!!selectedEvent} onHide={() => setSelectedEvent(null)} onDelete={handleDelete} />

            <CreateEventDialog visible={showCreate} onHide={() => setShowCreate(false)} onCreate={handleCreate} typeOptions={typeOptions} />
        </div>
    );
}
