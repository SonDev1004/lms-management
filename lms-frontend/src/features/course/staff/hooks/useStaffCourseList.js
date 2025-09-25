import { useState, useEffect } from 'react';
import { dataService } from '../lib/dataService';

export default function useStaffCourseList() {
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, avgEnrollment: 0 });
    const [courses, setCourses] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        Promise.all([dataService.getStats(), dataService.getCourses(query)])
            .then(([s, list]) => {
                if (!mounted) return;
                setStats(s);
                setCourses(list);
            })
            .finally(() => mounted && setLoading(false));

        return () => (mounted = false);
    }, [query]);

    const onSelectionChange = (e) => setSelected(e.value || []);
    const selectAll = () => setSelected([...courses]);
    const clearSelection = () => setSelected([]);

    return {
        stats,
        courses,
        selected,
        onSelectionChange,
        selectAll,
        clearSelection,
        loading,
        query,
        setQuery,
    };
}
