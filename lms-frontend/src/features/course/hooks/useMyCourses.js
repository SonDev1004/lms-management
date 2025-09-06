import { useEffect, useMemo, useState } from "react";
import StudentService from "@/features/student/api/studentService.js";
import { getCourseThemeStable } from "@/shared/lib/colorsCourseCard.js";

export default function useMyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true); setError(null);
        StudentService.getMyCourses()
            .then((data) => { if (mounted) setCourses(data); })
            .catch((e) => { if (mounted) setError(e); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const now = useMemo(() => new Date(), []);
    const uiCourses = useMemo(() => courses.map((c) => {
        const theme = getCourseThemeStable(c);
        const startDate = c.start_date ? new Date(c.start_date) : null;
        const hasStarted = startDate ? now >= startDate : false;
        const hasFinished = startDate ? now > startDate && !c.is_active : false;
        const clickable = Boolean(c.is_active && hasStarted && !hasFinished);
        return { ...c,
            subjectColor: theme.accent, accentText: theme.accentText,
            metaTextColor: theme.metaTextColor, metaBg: theme.metaBg,
            startDate, hasStarted, hasFinished, clickable,
        };
    }), [courses, now]);

    return { loading, error, courses: uiCourses };
}
