import { useEffect, useState } from "react";
import { programService } from "../lib/programService";

export default function useStaffProgramList() {
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, avgEnrollment: 0 });
    const [programs, setPrograms] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({ category: null, level: null, status: null });

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        Promise.all([programService.getStats(), programService.getPrograms(query, filters)])
            .then(([s, list]) => {
                if (!mounted) return;
                setStats(s);
                setPrograms(list);
            })
            .finally(() => mounted && setLoading(false));

        return () => (mounted = false);
    }, [query, filters]);

    return {
        stats,
        programs,
        selected,
        setSelected,
        loading,
        query,
        setQuery,
        filters,
        setFilters,
    };
}
