import { useEffect, useMemo, useState, useCallback } from "react";
import { getListProgram } from "@/features/program/api/programService.js";

const CATEGORY_MAP = {
    IELTS: "IELTS",
    TOEIC: "TOEIC",
    JUNIOR: "Junior",
    SPEAKING: "Speaking",
    GRAMMAR: "Grammar & Vocab",
    VOCAB: "Grammar & Vocab",
};

function inferCategory(code = "") {
    const key = (code || "").trim().toUpperCase();
    return CATEGORY_MAP[key] ?? "IELTS";
}

export function mapProgramCardProps(item) {
    return {
        id: item.id,
        title: item.title,
        levelText: item.levelText ?? "",
        duration: item.duration ?? "8–12 weeks",
        sessionsPerWeek: item.sessionsPerWeek ?? 3,
        target: item.target ?? "6.5+",
        tuitionMin: item.tuitionMin ?? item.fee ?? 0,
        tuitionMax: item.tuitionMax ?? item.fee ?? 0,
        audience: item.audience ?? "",
        popular: Boolean(item.isPopular ?? false),
        category: inferCategory(item.code),
    };
}

export function usePrograms() {
    const [state, setState] = useState({
        items: [],
        paging: { page: 1, size: 10, totalPages: 0, totalItems: 0 },
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async (page = 1, size = 50) => {
        setState((s) => ({ ...s, loading: true, error: null }));
        try {
            const { items, paging } = await getListProgram({ page, size });
            const mapped = (items || []).map(mapProgramCardProps);
            setState({ items: mapped, paging, loading: false, error: null });
        } catch (e) {
            setState((s) => ({ ...s, loading: false, error: e || new Error("Load programs failed") }));
        }
    }, []);

    useEffect(() => {
        fetchData(1, 6);
    }, [fetchData]);

    const byCategory = useMemo(() => {
        const group = new Map();
        for (const it of state.items) {
            const cat = it.category || "IELTS";
            if (!group.has(cat)) group.set(cat, []);
            group.get(cat).push(it);
        }
        return group;
    }, [state.items]);

    return {
        ...state,
        byCategory,
        refetch: fetchData,
    };
}
