import { useEffect, useMemo, useState } from "react";
import {
    getProgramsPSPage,
    countProgramsByActivePS,
} from "@/features/program/api/programService.js";

export default function useStaffProgramList() {
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, avgEnrollment: 0 });
    const [programs, setPrograms] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    // chuẩn hoá theo DB
    const [keyword, setKeyword] = useState("");
    const [isActive, setIsActive] = useState(null); // null | true | false

    // paging (0-based UI)
    const [page0, setPage0] = useState(0);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        let alive = true;

        (async () => {
            setLoading(true);
            try {
                const [pageRes, activeCnt, inactiveCnt] = await Promise.all([
                    getProgramsPSPage({
                        page0,
                        size,
                        keyword: keyword?.trim() ? keyword.trim() : undefined,
                        isActive,
                        pageBase: 1, // bạn đang dùng hệ page=1 trong service hiện tại
                    }),
                    countProgramsByActivePS(true, 1),
                    countProgramsByActivePS(false, 1),
                ]);

                if (!alive) return;

                const items = pageRes?.items || [];
                const total =
                    pageRes?.totalItems ??
                    pageRes?.totalElements ??
                    pageRes?.total ??
                    items.length;

                // map đúng schema DB
                const rows = items.map((p) => ({
                    id: p.id,
                    code: p.code,
                    title: p.title,
                    fee: p.fee ?? 0,
                    minStudent: p.minStudent ?? 0,
                    maxStudent: p.maxStudent ?? 0,
                    description: p.description ?? "",
                    imageUrl: p.imageUrl ?? "",
                    isActive: !!p.isActive,
                }));

                setPrograms(rows);
                setTotalItems(Number(total) || 0);

                const totalCnt = (activeCnt ?? 0) + (inactiveCnt ?? 0);
                setStats({
                    total: totalCnt,
                    active: activeCnt ?? 0,
                    inactive: inactiveCnt ?? 0,
                    avgEnrollment: 0, // DB hiện chưa có số course/program => để 0
                });
            } finally {
                alive && setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [keyword, isActive, page0, size]);

    return {
        stats,
        programs,
        selected,
        setSelected,
        loading,

        keyword,
        setKeyword,
        isActive,
        setIsActive,

        page0,
        setPage0,
        size,
        setSize,
        totalItems,
    };
}
