// hooks/useSchedule.js
import { useEffect, useMemo, useRef, useState } from 'react';
import { initMock, restoreMock, fetchEvents, deleteEventById } from '../mocks/mockSchedule';
import { parseEvent } from '../utils/date';

export default function useSchedule() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ types: [], teachers: [], search: '' });
    const [onlyMine, setOnlyMine] = useState(false);
    const mockRef = useRef(null);

    useEffect(() => {
        mockRef.current = initMock?.();
        return () => {
            try { restoreMock?.(); } catch (e) { console.warn(e); }
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchEvents()
            .then((ev) => {
                if (!mounted) return;
                setEvents((ev || []).map(parseEvent));
            })
            .catch((err) => {
                console.error('fetchEvents error', err);
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const teacherOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.teacher).filter(Boolean)));
        return s.map((t) => ({ label: t, value: t }));
    }, [events]);

    const typeOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.type).filter(Boolean)));
        return s.map((t) => ({ label: t, value: t }));
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

    async function addEvent(payload) {
        const res = await createEvent(payload);
        const e = res.event || res;
        setEvents((prev) => [...prev, parseEvent(e)]);
        return parseEvent(e);
    }

    async function removeEvent(id) {
        await deleteEventById(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
    }

    return {
        loading,
        events,
        filteredEvents,
        filters,
        setFilters,
        teacherOptions,
        typeOptions,
        onlyMine,
        setOnlyMine,
        addEvent,
        removeEvent,
        setEvents,
    };
}
