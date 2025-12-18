import {useEffect, useMemo, useState} from "react";
import {fetchStudentSchedule, fetchTeacherSchedule, fetchAcademySchedule} from "../api/scheduleService.js";

// role: "STUDENT" | "TEACHER" | "ACADEMY"
export default function useSchedule(role = "ACADEMY") {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({types: [], teachers: [], search: ""});
    const [onlyMine, setOnlyMine] = useState(false);

    const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const today = new Date();
        const year = today.getFullYear();

        // 👇 LẤY CẢ 3 NĂM: năm hiện tại - 1  →  năm hiện tại + 1
        const fromDate = new Date(year - 1, 0, 1);    // 01-01-(year-1)
        const toDate = new Date(year + 1, 11, 31);  // 31-12-(year+1)

        const from = formatDate(fromDate);
        const to = formatDate(toDate);

        const loader =
            role === "STUDENT"
                ? fetchStudentSchedule(from, to)
                : role === "TEACHER"
                    ? fetchTeacherSchedule(from, to)

                    : fetchAcademySchedule(from, to);

        loader
            .then((res) => {
                const data = res.data?.result || res.data || [];
                const mapped = data.map((item) => ({
                    id: item.sessionId,
                    title: item.courseTitle || "Session",
                    start: combineDateTime(item.date, item.startTime),
                    end: combineDateTime(item.date, item.endTime),
                    teacher: item.teacherName,
                    type: item.subjectTitle,
                    room: item.roomName,
                    isMine: true,
                }));
                setEvents(mapped);
            })
            .catch((err) => {
                console.error("load schedule error", err);
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [role]);

    const teacherOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.teacher).filter(Boolean)));
        return s.map((t) => ({label: t, value: t}));
    }, [events]);

    const typeOptions = useMemo(() => {
        const s = Array.from(new Set(events.map((ev) => ev.type).filter(Boolean)));
        return s.map((t) => ({label: t, value: t}));
    }, [events]);

    const filteredEvents = useMemo(() => {
        const q = (filters.search || "").trim().toLowerCase();
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

    async function addEvent() {
        throw new Error("Add event is disabled for this role");
    }

    async function removeEvent() {
        throw new Error("Delete event is disabled for this role");
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

function combineDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const [y, m, d] = String(dateStr).split("-").map(Number);
    const [hh, mm, ss] = String(timeStr).split(":").map(Number);
    return new Date(y, m - 1, d, hh ?? 0, mm ?? 0, ss ?? 0);
}
