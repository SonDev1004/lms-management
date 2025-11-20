import {useEffect, useMemo, useState} from "react";
import {Paginator} from "primereact/paginator";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Skeleton} from "primereact/skeleton";
import {getListSubject} from "@/features/subject/api/subjectService.js";
import SubjectCard from "@/features/subject/components/SubjectCard.jsx";
import "../styles/subject-list.css";

const SORTS = [
    {label: "Default", value: "default"},
    {label: "Name (A → Z)", value: "title-asc"},
    {label: "Name (Z → A)", value: "title-desc"},
    {label: "Tuition: Low to High", value: "price-asc"},
    {label: "Tuition: High to Low", value: "price-desc"},
];

export default function SubjectList() {
    const [all, setAll] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState("");
    const [kw, setKw] = useState("");
    const [sort, setSort] = useState("default");
    const [paging, setPaging] = useState({page: 1, size: 9});

    const fetchAll = async () => {
        try {
            setLoading(true);
            const {items} = await getListSubject({page: 1, size: 500});
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
        setPaging((p) => ({...p, page: 1}));
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
        const val = (s) =>
            (s.tuitionMin ?? s.tuitionMax ?? s.fee ?? 0) * 1;

        switch (sort) {
            case "title-asc":
                data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                break;
            case "title-desc":
                data.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
                break;
            case "price-asc":
                data.sort((a, b) => val(a) - val(b));
                break;
            case "price-desc":
                data.sort((a, b) => val(b) - val(a));
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
        setPaging({page, size: e.rows});
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const clearFilters = () => {
        setQ("");
        setSort("default");
        setPaging({page: 1, size: 9});
    };

    return (
        <div className="mx-auto px-3 py-6 subject-wrapper">
            <div className="subject-header">
                <div>
                    <h1 className="subject-title">Our Subjects</h1>
                    <p className="subject-sub">
                        Explore currently available subjects — simple and easy to browse.
                    </p>
                </div>

                {/* Filter bar */}
                <div className="subject-toolbar">
                    {/* Search (full width on mobile) */}
                    <span className="p-input-icon-left subject-search">
                        <i className="pi pi-search"/>
                        <InputText
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by name, description, or audience…"
                        />
                    </span>

                    {/* Controls on the right */}
                    <div className="subject-controls">
                        <div className="subject-control">
                            <label className="subject-label">Sort by</label>
                            <Dropdown
                                options={SORTS}
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.value);
                                    setPaging((p) => ({...p, page: 1}));
                                }}
                                className="subject-sort"
                            />
                        </div>

                        <div className="subject-control">
                            <label className="subject-label">Show</label>
                            <Dropdown
                                value={paging.size}
                                options={[6, 9, 12, 18].map((n) => ({
                                    label: String(n),
                                    value: n,
                                }))}
                                onChange={(e) =>
                                    setPaging((p) => ({...p, size: e.value, page: 1}))
                                }
                                className="subject-size"
                            />
                        </div>

                        <div className="subject-meta">
                            <span className="subject-count">{processed.length} Subject</span>
                            {(q || sort !== "default" || paging.size !== 9) && (
                                <button
                                    type="button"
                                    className="subject-clear"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid">
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="col-12 md:col-6 lg:col-4">
                            <div className="card skeleton-card">
                                <Skeleton height="180px" className="mb-3"/>
                                <Skeleton width="70%" className="mb-2"/>
                                <Skeleton width="40%" className="mb-3"/>
                                <Skeleton height="40px"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length ? (
                <>
                    <div className="grid">
                        {items.map((p) => (
                            <div key={p.id} className="col-12 md:col-6 lg:col-4">
                                <SubjectCard subject={p}/>
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
                    <img alt="No data" src="/no-data-illustration.svg"/>
                    <h3>No matching subjects found</h3>
                    <p>Try a different keyword or remove sorting options.</p>
                </div>
            )}
        </div>
    );
}
