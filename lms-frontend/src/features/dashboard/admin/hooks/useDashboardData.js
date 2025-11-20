import { useEffect, useState } from "react";
import { kpis, quickActions, activities, licenses } from "../mocks/dashboard";

export default function useDashboardData() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ kpis: [], quickActions: [], activities: [], licenses: [] });

    useEffect(() => {
        const t = setTimeout(() => {
            setData({ kpis, quickActions, activities, licenses });
            setLoading(false);
        }, 300);
        return () => clearTimeout(t);
    }, []);

    return { ...data, loading };
}
