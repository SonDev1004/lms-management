import { useEffect, useState } from 'react';
import { findTeacher } from '../mocks/teacher.js';

export default function useTeacher(teacherId) {
    const [teacher, setTeacher] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTeacher(findTeacher(teacherId));
            setLoading(false);
        }, 250); // mock delay
        return () => clearTimeout(timer);
    }, [teacherId]);

    return { teacher, loading };
}
