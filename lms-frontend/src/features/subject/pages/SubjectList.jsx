import { useEffect, useMemo, useState } from "react";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { getListSubject } from "@/features/subject/api/subjectService.js";
import SubjectCard from "@/features/subject/components/SubjectCard.jsx";
import "../styles/subject-list.css";

const SORTS = [
    { label: "Mặc định", value: "default" },
    { label: "Tên (A → Z)", value: "title-asc" },
    { label: "Tên (Z → A)", value: "title-desc" },
    { label: "Học phí tăng dần", value: "price-asc" },
    { label: "Học phí giảm dần", value: "price-desc" },
];

export default function SubjectList() {
    const [all, setAll] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const [kw, setKw] = useState("");
    const [sort, setSort] = useState("default");
    const [paging, setPaging] = useState({ page: 1, size: 9 });

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

    // reset về trang 1 khi đổi keyword
    useEffect(() => {
        setPaging((p) => ({ ...p, page: 1 }));
    }, [kw]);

    // lọc + sort
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

        switch (sort) {
            case "title-asc":
                data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                break;
            case "title-desc":
                data.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
                break;
            case "price-asc":
                data.sort(
                    (a, b) =>
                        (a.tuitionMin ?? a.tuitionMax ?? 0) -
                        (b.tuitionMin ?? b.tuitionMax ?? 0)
                );
                break;
            case "price-desc":
                data.sort(
                    (a, b) =>
                        (b.tuitionMin ?? b.tuitionMax ?? 0) -
                        (a.tuitionMin ?? a.tuitionMax ?? 0)
                );
                break;
            default:
                break;
        }

        return data;
    }, [all, kw, sort]);

    // cắt trang
    useEffect(() => {
        const start = (paging.page - 1) * paging.size;
        setItems(processed.slice(start, start + paging.size));
    }, [processed, paging.page, paging.size]);

    const onPageChange = (e) => {
        const page = Math.floor(e.first / e.rows) + 1;
        setPaging({ page, size: e.rows });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const clearFilters = () => {
        setQ("");
        setSort("default");
        setPaging({ page: 1, size: 9 });
    };

    return (
        <div className="mx-auto px-3 py-6 subject-wrapper">
            <div className="subject-header">
                <div>
                    <h1 className="subject-title">Môn học của trung tâm</h1>
                    <p className="subject-sub">
                        Khám phá các môn học đang mở tuyển — giao diện tinh gọn, dễ duyệt.
                    </p>
                </div>

                {/* Filter bar */}
                <div className="subject-toolbar">
                    {/* Search (full width on mobile) */}
                    <span className="p-input-icon-left subject-search">
            <i className="pi pi-search" />
            <InputText
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên, mô tả, đối tượng…"
            />
          </span>

                    {/* Controls on the right */}
                    <div className="subject-controls">
                        <div className="subject-control">
                            <label className="subject-label">Sắp xếp</label>
                            <Dropdown
                                options={SORTS}
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.value);
                                    setPaging((p) => ({ ...p, page: 1 }));
                                }}
                                className="subject-sort"
                            />
                        </div>

                        <div className="subject-control">
                            <label className="subject-label">Hiển thị</label>
                            <Dropdown
                                value={paging.size}
                                options={[6, 9, 12, 18].map((n) => ({
                                    label: String(n),
                                    value: n,
                                }))}
                                onChange={(e) =>
                                    setPaging((p) => ({ ...p, size: e.value, page: 1 }))
                                }
                                className="subject-size"
                            />
                        </div>

                        <div className="subject-meta">
                            <span className="subject-count">{processed.length} môn</span>
                            {(q || sort !== "default" || paging.size !== 9) && (
                                <button
                                    type="button"
                                    className="subject-clear"
                                    onClick={clearFilters}
                                >
                                    Xóa lọc
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
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
            ) : items.length ? (
                <>
                    <div className="grid">
                        {items.map((p) => (
                            <div key={p.id} className="col-12 md:col-6 lg:col-4">
                                <SubjectCard subject={p} />
                            </div>
                        ))}
                    </div>

                    <Paginator
                        className="mt-4"
                        first={(paging.page - 1) * paging.size}
                        rows={paging.size}
                        totalRecords={processed.length}
                        onPageChange={onPageChange}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    />
                </>
            ) : (
                <div className="empty-state">
                    <img alt="No data" src="/no-data-illustration.svg" />
                    <h3>Không tìm thấy môn phù hợp</h3>
                    <p>Hãy thử từ khóa khác hoặc bỏ sắp xếp.</p>
                </div>
            )}
        </div>
    );
}
