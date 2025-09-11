import { useEffect, useMemo, useState } from 'react';
import { course as mockCourse, assignments as mockAssignments, suggestions as mockSuggestions } from '../mocks/mockData';

export default function useStudentDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        const t = setTimeout(() => {
            setData({ course: mockCourse, assignments: mockAssignments, suggestions: mockSuggestions });
            setLoading(false);
        }, 200);
        return () => clearTimeout(t);
    }, []);

    const filledCount = useMemo(() => Math.round((data.course?.sessionsDone / data.course?.sessionsTotal) * 12 || 0), [data.course]);

    return { loading, ...data, filledCount };
}


