import React, {useEffect, useMemo, useState, useRef} from 'react';
import axios from 'axios';
import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment-timezone';
import {Toolbar} from 'primereact/toolbar';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';
import {Toast} from 'primereact/toast';
import {MultiSelect} from 'primereact/multiselect';
import {OverlayPanel} from 'primereact/overlaypanel';
import {initMock, restoreMock, fetchEvents, deleteEventById} from '../../mocks/mockSchedule.js';
import './Schedule.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.tz.setDefault('Asia/Ho_Chi_Minh');
const localizer = momentLocalizer(moment);
const TIMEZONE = 'Asia/Ho_Chi_Minh';

export default function Schedule() {
    const [_loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [newEvent, setNewEvent] = useState({title: '', start: '', end: '', teacher: '', room: '', type: ''});
    const [filters, setFilters] = useState({types: [], teachers: [], search: ''});
    const [view, setView] = useState('month');
    const [showSidebar] = useState(true);
    const [onlyMine, setOnlyMine] = useState(false);
    const toastRef = useRef(null);
    const mockRef = useRef(null);
    const overlayRef = useRef(null);
    const calendarCardRef = useRef(null);

    const parseEvent = (e) => {
        const parseDateField = (d) => {
            if (!d) return null;
            if (d instanceof Date) return d;
            try {
                return moment.tz(String(d), TIMEZONE).toDate();
            } catch (ex) {
                console.warn(ex);
                return new Date(d);
            }
        };
        return {
            ...e, start: parseDateField(e.start), end: parseDateField(e.end),
        };
    };

    const formatEventTime = (date) => {
        if (!date) return '';
        try {
            return moment(date).tz(TIMEZONE).format('YYYY-MM-DD HH:mm');
        } catch (ex) {
            console.warn(ex);
            return date.toLocaleString();
        }
    };

    useEffect(() => {
        mockRef.current = initMock();
        return () => {
            try {
                restoreMock();
            } catch (e) {
                console.warn(e);
            }
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchEvents()
            .then((ev) => {
                if (!mounted) return;
                const normalized = (ev || []).map(parseEvent);
                setEvents(normalized);
            })
            .catch((err) => {
                console.error(err);
                toastRef.current && toastRef.current.show({
                    severity: 'error', summary: 'Lỗi', detail: 'Không tải được lịch học.'
                });
            })
            .finally(() => mounted && setLoading(false));
        return () => (mounted = false);
    }, []);

    const teacherOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.teacher).filter(Boolean)));
        return s.map((t) => ({label: t, value: t}));
    }, [events]);

    const typeOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.type).filter(Boolean)));
        return s.map((t) => ({label: t, value: t}));
    }, [events]);

    const filteredEvents = useMemo(() => {
        const q = (filters.search || '').trim().toLowerCase();
        return events.filter((e) => {
            if (onlyMine && !e.isMine) return false;
            if (filters.types.length && !filters.types.includes(e.type)) return false;
            if (filters.teachers.length && !filters.teachers.includes(e.teacher)) return false;
            if (q) {
                const hay = `${e.title} ${e.teacher} ${e.room} ${e.type}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [events, filters, onlyMine]);

    const eventStyleGetter = (event) => {
        const base = {style: {borderRadius: '8px', padding: '6px 8px', border: 'none', boxShadow: 'none'}};
        switch (event.type) {
            case 'Practice':
                base.style.background = '#fffaf0';
                base.style.color = '#7a4a00';
                break;
            case 'One-on-one':
                base.style.background = '#e8f7ff';
                base.style.color = '#063b4e';
                break;
            case 'Lecture':
                base.style.background = '#eef2ff';
                base.style.color = '#2a2a8f';
                break;
            default:
                base.style.background = '#e6fffa';
                base.style.color = '#065f46';
        }
        base.style.opacity = 0.98;
        return base;
    };

    const EventComponent = ({event, currentView}) => {
        const typeIcon = '📘';
        const showType = currentView !== 'month';
        return (<div
            className="rbc-event-card"
            onClick={(ev) => {
                setSelectedEvent(event);
                overlayRef.current && overlayRef.current.toggle(ev.currentTarget);
            }}
            role="button"
            aria-label={`Sự kiện ${event.title}`}>
            <div className="rbc-event-card-title">{typeIcon} {event.title}</div>
            <div className="rbc-event-card-meta">👩‍🏫 {event.teacher} · 📍 {event.room}</div>
            {showType && <div className="rbc-event-card-type">📘 {event.type}</div>}
        </div>);
    };

    const CustomToolbar = (toolbarProps) => {
        const goToBack = () => toolbarProps.onNavigate('PREV');
        const goToNext = () => toolbarProps.onNavigate('NEXT');
        const goToToday = () => toolbarProps.onNavigate('TODAY');
        const date = toolbarProps.date || new Date();
        const weekNumber = moment(date).isoWeek();
        const monthNumber = date.getMonth() + 1;
        const label = toolbarProps.label;
        return (<div className="rbc-toolbar custom-toolbar p-d-flex p-jc-between p-ai-center">
            <div className="p-d-flex p-ai-center p-gap-2">
                <Button icon="pi pi-chevron-left" className="p-button-text" onClick={goToBack}/>
                <Button icon="pi pi-calendar" label="Hôm nay" className="p-button-outlined p-button-sm"
                        onClick={goToToday}/>
                <Button icon="pi pi-chevron-right" className="p-button-text" onClick={goToNext}/>
                <div className="toolbar-label p-ml-3">{label}</div>
                {toolbarProps.view === 'week' &&
                    <div className="week-header p-ml-3">Tuần {weekNumber} - Tháng {monthNumber}</div>}
            </div>
            <div className="p-d-flex p-ai-center p-gap-2">
                <div className="view-info"/>
            </div>
        </div>);
    };
    const handleCreate = async () => {
        try {
            const payload = {
                title: newEvent.title,
                start: new Date(newEvent.start).toISOString(),
                end: new Date(newEvent.end).toISOString(),
                teacher: newEvent.teacher,
                room: newEvent.room,
                type: newEvent.type,
            };
            const res = await axios.post('/api/events', payload);
            const e = res.data.event;
            const parsed = parseEvent(e);
            setEvents((prev) => [...prev, parsed]);
            setShowCreate(false);
            toastRef.current && toastRef.current.show({
                severity: 'success', summary: 'Thành công', detail: 'Đã thêm sự kiện.'
            });
        } catch (err) {
            console.error(err);
            toastRef.current && toastRef.current.show({
                severity: 'error', summary: 'Lỗi', detail: 'Không thể thêm sự kiện.'
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        try {
            await deleteEventById(selectedEvent.id);
            setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
            setSelectedEvent(null);
            toastRef.current && toastRef.current.show({
                severity: 'success', summary: 'Đã xoá', detail: 'Sự kiện đã được xoá.'
            });
        } catch (err) {
            console.error(err);
            toastRef.current && toastRef.current.show({
                severity: 'error', summary: 'Lỗi', detail: 'Không thể xoá sự kiện.'
            });
        }
    };

    const applyFilters = () => {
        toastRef.current && toastRef.current.show({severity: 'info', summary: 'Bộ lọc', detail: 'Đã áp dụng bộ lọc.'});
    };

    const clearFilters = () => setFilters({types: [], teachers: [], search: ''});

    const removeFilterChip = (kind, value) => {
        if (kind === 'type') setFilters((s) => ({...s, types: s.types.filter((t) => t !== value)}));
        if (kind === 'teacher') setFilters((s) => ({...s, teachers: s.teachers.filter((t) => t !== value)}));
    };

    const appliedCount = filters.types.length + filters.teachers.length + (filters.search ? 1 : 0) + (onlyMine ? 1 : 0);

    return (<div className="p-m-4 schedule-page">
        <Toast ref={toastRef}/>
        <Toolbar className="p-mb-3" left={() => <h2 className="p-m-0 title">Thời khoá biểu - Trung tâm</h2>}
                 right={() => (<div className="p-d-flex p-ai-center p-gap-2"/>)}/>

        <div className="p-grid">
            {showSidebar && (<div className="p-col-12 p-md-3">
                <Card className="filter-card p-mb-3">
                    <div className="p-d-flex p-flex-column">
                        <div className="p-d-flex p-ai-center p-jc-between p-mb-2">
                            <div className="p-d-flex p-ai-center p-gap-2">
                                <i className="pi pi-filter"/>
                                <strong>Bộ lọc</strong>
                                {appliedCount > 0 && <span className="applied-badge">{appliedCount}</span>}
                            </div>
                        </div>

                        <div className="p-grid p-mb-2 p-mt-2">
                            <div className="p-col-12">
                                <label className="p-mb-1">Loại lớp</label>
                                <MultiSelect value={filters.types} options={typeOptions}
                                             onChange={(e) => setFilters((s) => ({...s, types: e.value}))}
                                             placeholder="Chọn loại (có thể chọn nhiều)" display="chip"
                                             showClear/>
                            </div>
                            <div className="p-col-12">
                                <label className="p-mb-1">Giáo viên</label>
                                <MultiSelect value={filters.teachers} options={teacherOptions}
                                             onChange={(e) => setFilters((s) => ({...s, teachers: e.value}))}
                                             placeholder="Chọn giáo viên (có thể chọn nhiều)" display="chip"
                                             showClear/>
                            </div>
                        </div>

                        <div className="p-d-flex p-jc-between p-ai-center p-pt-2">
                            <div className="p-d-flex p-gap-2">
                                <Button icon="pi pi-check" label="Áp dụng" onClick={applyFilters}
                                        className="p-button-apply"/>
                                <Button icon="pi pi-times" label="Xoá" onClick={clearFilters}
                                        className="p-button-clear"/>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>)}

            <div className={showSidebar ? 'p-col-12 p-md-9' : 'p-col-12'}>
                <div className="p-mb-2 p-d-flex p-jc-between p-ai-center">
                    <div className="applied-chips p-d-flex p-ai-center p-gap-2">
                        {filters.types.map((t) => (
                            <span key={t} className="chip" onClick={() => removeFilterChip('type', t)}>{t}
                                <small>✕</small></span>))}
                        {filters.teachers.map((t) => (
                            <span key={t} className="chip" onClick={() => removeFilterChip('teacher', t)}>{t}
                                <small>✕</small></span>))}
                        {filters.search && <span className="chip">🔎 {filters.search} <small
                            onClick={() => setFilters((s) => ({...s, search: ''}))}>✕</small></span>}
                        {onlyMine && <span className="chip">👤 Chỉ lớp của tôi <small
                            onClick={() => setOnlyMine(false)}>✕</small></span>}
                    </div>
                    <div className="p-d-flex p-ai-center p-gap-2"/>
                </div>

                <div ref={calendarCardRef} className="calendar-card p-shadow-3 p-p-3">
                    <BigCalendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{height: 650}}
                        selectable={false}
                        onSelectEvent={(e) => setSelectedEvent(e)}
                        onDoubleClickEvent={(e) => setSelectedEvent(e)}
                        eventPropGetter={eventStyleGetter}
                        views={{month: true, week: true, day: true, agenda: true}}
                        view={view}
                        onView={(v) => setView(v)}
                        components={{
                            event: (props) => <EventComponent {...props} currentView={view}/>, toolbar: CustomToolbar
                        }}
                    />
                </div>
            </div>
        </div>

        <OverlayPanel ref={overlayRef} showCloseIcon={false} className="event-overlay" dismissable>
            {selectedEvent ? (<div className="p-d-flex p-flex-column p-gap-1">
                <div className="small">📍 {selectedEvent.room}</div>
                <div className="p-text-bold">{selectedEvent.title}</div>
                <div className="small">👩‍🏫 {selectedEvent.teacher}</div>
                <div
                    className="small">{formatEventTime(selectedEvent.start)} — {formatEventTime(selectedEvent.end)}</div>
                <div className="chip-type">📘 {selectedEvent.type}</div>
            </div>) : null}
        </OverlayPanel>

        <Dialog header={selectedEvent ? selectedEvent.title : ''} visible={!!selectedEvent} style={{width: '420px'}}
                footer={<div>
                    <Button label="Huỷ" icon="pi pi-times" onClick={() => setSelectedEvent(null)}
                            className="p-button-text"/>
                    <Button label="Xoá" icon="pi pi-trash" onClick={handleDelete} className="p-button-danger"/>
                </div>} onHide={() => setSelectedEvent(null)}>
            {selectedEvent && (<div className="p-fluid">
                <div className="p-field">
                    <label>Thời gian</label>
                    <p>{formatEventTime(selectedEvent.start)} — {formatEventTime(selectedEvent.end)}</p>
                </div>
                <div className="p-field">
                    <label>Giáo viên</label>
                    <p>{selectedEvent.teacher}</p>
                </div>
                <div className="p-field">
                    <label>Phòng</label>
                    <p>{selectedEvent.room}</p>
                </div>
                <div className="p-field">
                    <label>Loại</label>
                    <p>{selectedEvent.type}</p>
                </div>
            </div>)}
        </Dialog>

        <Dialog header="Tạo sự kiện mới" visible={showCreate} style={{width: '520px'}} footer={<div>
            <Button label="Huỷ" icon="pi pi-times" onClick={() => setShowCreate(false)} className="p-button-text"/>
            <Button label="Tạo" icon="pi pi-plus" onClick={handleCreate}/>
        </div>} onHide={() => setShowCreate(false)}>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12">
                    <label>Tiêu đề</label>
                    <InputText value={newEvent.title}
                               onChange={(e) => setNewEvent((s) => ({...s, title: e.target.value}))}/>
                </div>
                <div className="p-field p-col-6">
                    <label>Ngày giờ bắt đầu (ISO)</label>
                    <InputText placeholder="2025-09-08T08:30:00" value={newEvent.start}
                               onChange={(e) => setNewEvent((s) => ({...s, start: e.target.value}))}/>
                </div>
                <div className="p-field p-col-6">
                    <label>Ngày giờ kết thúc (ISO)</label>
                    <InputText placeholder="2025-09-08T10:00:00" value={newEvent.end}
                               onChange={(e) => setNewEvent((s) => ({...s, end: e.target.value}))}/>
                </div>
                <div className="p-field p-col-6">
                    <label>Giáo viên</label>
                    <InputText value={newEvent.teacher}
                               onChange={(e) => setNewEvent((s) => ({...s, teacher: e.target.value}))}/>
                </div>
                <div className="p-field p-col-6">
                    <label>Phòng</label>
                    <InputText value={newEvent.room}
                               onChange={(e) => setNewEvent((s) => ({...s, room: e.target.value}))}/>
                </div>
                <div className="p-field p-col-12">
                    <label>Loại</label>
                    <Dropdown value={newEvent.type} options={typeOptions}
                              onChange={(e) => setNewEvent((s) => ({...s, type: e.value}))}
                              placeholder="Chọn loại"/>
                </div>
            </div>
        </Dialog>
    </div>);
}