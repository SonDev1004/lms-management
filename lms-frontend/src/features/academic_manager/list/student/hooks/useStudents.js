import { useCallback, useMemo, useState } from 'react';
import { searchStudents } from '../mocks/students.js';

export function useStudents() {
    const [q, setQ] = useState('');
    const [status, setStatus] = useState(null);
    const [cls, setCls] = useState(null);

    const data = useMemo(
        () => searchStudents({ q, status: status ?? '', cls: cls ?? '' }),
        [q, status, cls]
    );

    const exportCSV = useCallback(() => {
        if (!data.length) return;
        const headers = ['id', 'name', 'email', 'class', 'status', 'enrolledOn', 'gpa'];
        const csv = [
            headers.join(','),
            ...data.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'students.csv';
        a.click();
    }, [data]);

    return {
        data,
        filters: { q, status, cls },
        setFilters: { setQ, setStatus, setCls },
        exportCSV,
    };
}
