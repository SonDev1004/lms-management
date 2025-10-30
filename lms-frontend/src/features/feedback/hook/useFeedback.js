import { useEffect, useMemo, useState } from "react";
import { listFeedback } from "../api/feedbackService";

export function useFeedback(initial = {}) {
    const [params, setParams] = useState({ page: 0, pageSize: 8, sort: "newest", status: "All", category: "All", q: "", ...initial });
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const refresh = async (patch = {}) => {
        const next = { ...params, ...patch };
        setParams(next);
        setLoading(true);
        const res = await listFeedback(next);
        setRows(res.data);
        setTotal(res.total);
        setLoading(false);
    };

    useEffect(() => {
        refresh({});
    }, []);

    const state = useMemo(() => ({ params, rows, total, loading }), [params, rows, total, loading]);
    return { state, refresh };
}