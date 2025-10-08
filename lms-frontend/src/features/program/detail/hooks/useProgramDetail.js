
import { useEffect, useState } from "react";
import { getProgramDetail } from "../api/programService";

export default function useProgramDetail(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getProgramDetail(id);
                if (isMounted) setData(res);
            } catch (e) {
                if (isMounted) setError(e?.message || "Failed to load program");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [id]);

    return { data, loading, error };
}
