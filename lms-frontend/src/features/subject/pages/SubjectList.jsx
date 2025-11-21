import { useEffect, useMemo, useState } from "react";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { getListSubject } from "@/features/subject/api/subjectService.js";
import SubjectCard from "@/features/subject/components/SubjectCard.jsx";
import "../styles/subject-list.css";

export default function SubjectList() {
    const [all, setAll] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const [kw, setKw] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(9);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const { items } = await getListSubject({ page: 1, size: 500 });
            setAll(items || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => setKw(q.trim().toLowerCase()), 300);
        return () => clearTimeout(t);
    }, [q]);

    // về trang 1 khi đổi keyword
    useEffect(() => {
        setPage(1);
    }, [kw]);

    // lọc theo keyword (không sort gì thêm)
    const processed = useMemo(() => {
        let data = [...all];

        if (kw) {
            data = data.filter(
                (it) =>
                    (it?.title || "").toLowerCase().includes(kw) ||
                    (it?.description || "").toLowerCase().includes(kw) ||
                    (it?.audience || "").toLowerCase().includes(kw)
            );
        }

        return data;
    }, [all, kw]);

    // cắt trang
    useEffect(() => {
        const start = (page - 1) * rows;
        setItems(processed.slice(start, start + rows));
    }, [processed, page, rows]);

    const onPageChange = (e) => {
        const newPage = Math.floor(e.first / e.rows) + 1;
        setPage(newPage);
        setRows(e.rows);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const total = processed.length;

    return (
        <div className="ourp-wrap">
            {/* ===== Header GIỐNG PROGRAM ===== */}
            <div className="ourp-head">
                <h1 className="ourp-title">Our Subjects</h1>

                <div className="ourp-right">
                    <div className="ourp-searchbar">
                        <span className="p-input-icon-left ourp-input">
                            <i className="pi pi-search" />
                            <InputText
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by name, description, or audience…"
                                className="w-full"
                                aria-label="Search subjects"
                            />
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== List ===== */}
            {loading && (
                <div className="grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="col-12 md:col-6 lg:col-4">
                            <div className="card skeleton-card">
                                <Skeleton height="180px" className="mb-3" />
                                <Skeleton width="70%" className="mb-2" />
                                <Skeleton width="40%" className="mb-3" />
                                <Skeleton height="40px" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && total === 0 && (
                <div className="empty-state">
                    <img alt="No data" src="/no-data-illustration.svg" />
                    <h3>No matching subjects found</h3>
                    <p>Try a different keyword.</p>
                </div>
            )}

            {!loading && total > 0 && (
                <>
                    <div className="program-card">
                        <div className="grid">
                            {items.map((p) => (
                                <div key={p.id} className="col-12 md:col-6 lg:col-4">
                                    <div className="pg-cell">
                                        <SubjectCard subject={p} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== Paginator GIỐNG PROGRAM ===== */}
                    <Paginator
                        className="ourp-paginator"
                        first={(page - 1) * rows}
                        rows={rows}
                        totalRecords={total}
                        onPageChange={onPageChange}
                        rowsPerPageOptions={[9, 12, 18, 24]}
                    />
                </>
            )}
        </div>
    );
}
