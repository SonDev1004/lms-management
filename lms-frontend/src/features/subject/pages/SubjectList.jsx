import { useEffect, useMemo, useState } from "react";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
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

    // lọc theo keyword
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
        <div className="programs-page-wrapper">
            {/* ========== LEFT SIDEBAR ========== */}
            <aside className="programs-sidebar-left">
                <div className="sidebar-sticky">
                    {/* Quick Stats */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-chart-line mr-2"></i>
                            Quick Stats
                        </h3>
                        <div className="info-card">
                            <div className="info-card__label">Total Subjects</div>
                            <div className="info-card__value">{all.length}</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card__label">
                                {kw ? 'Search Results' : 'Showing'}
                            </div>
                            <div className="info-card__value">{processed.length}</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card__label">Current Page</div>
                            <div className="info-card__value">{page}</div>
                        </div>
                    </div>

                    {/* Subject Levels */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-chart-bar mr-2"></i>
                            Subject Levels
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="sidebar-link">
                                <i className="pi pi-star mr-2"></i>
                                Beginner Level
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-star-fill mr-2"></i>
                                Intermediate Level
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-bolt mr-2"></i>
                                Advanced Level
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-trophy mr-2"></i>
                                Expert Level
                            </div>
                        </div>
                    </div>

                    {/* Popular Topics */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-heart-fill mr-2"></i>
                            Popular Topics
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="sidebar-link">
                                <i className="pi pi-comments mr-2"></i>
                                Communication Skills
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-book mr-2"></i>
                                Grammar & Writing
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-volume-up mr-2"></i>
                                Pronunciation
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-briefcase mr-2"></i>
                                Business English
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-question-circle mr-2"></i>
                            Need Guidance?
                        </h3>
                        <div className="sidebar-panel__content">
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                                Not sure which subject fits your needs? Let our advisors help you!
                            </p>
                            <Button
                                label="Get Advice"
                                icon="pi pi-comments"
                                outlined
                                size="small"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            <main className="programs-main-content">
                {/* Header */}
                <div className="ourp-head">
                    <div>
                        <h1 className="ourp-title">
                            <i className="pi pi-book mr-2" style={{ color: '#3b82f6', fontSize: '36px' }}></i>
                            Our Subjects
                        </h1>
                    </div>

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

                            {q && (
                                <Button
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    severity="secondary"
                                    onClick={() => setQ("")}
                                    aria-label="Clear search"
                                />
                            )}

                            <Button
                                icon="pi pi-refresh"
                                rounded
                                outlined
                                onClick={fetchAll}
                                loading={loading}
                                tooltip="Refresh"
                                tooltipOptions={{ position: 'bottom' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Search Info */}
                {kw && (
                    <div className="flex align-items-center gap-2 mb-3 p-3 bg-white border-round-lg shadow-1">
                        <i className="pi pi-filter" style={{ color: '#3b82f6' }}></i>
                        <span style={{ color: 'var(--ourp-muted)' }}>
                            Searching for: <strong style={{ color: 'var(--ourp-ink)' }}>"{kw}"</strong>
                        </span>
                        <Badge value={`${processed.length} result${processed.length !== 1 ? 's' : ''}`} severity="info" />
                    </div>
                )}

                {!kw && total > 0 && (
                    <div className="flex justify-content-end mb-2">
                        <Badge
                            value={`Total: ${total} subject${total !== 1 ? 's' : ''}`}
                            severity="info"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.65rem' }}
                        />
                    </div>
                )}

                {/* Loading State */}
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

                {/* Empty State */}
                {!loading && total === 0 && (
                    <div className="text-center p-6 bg-white border-round-lg shadow-2">
                        <div
                            className="inline-flex align-items-center justify-content-center border-circle mb-4"
                            style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)'
                            }}
                        >
                            <i className="pi pi-inbox text-5xl" style={{ color: '#93c5fd' }}></i>
                        </div>
                        <h3 className="mb-2" style={{ color: 'var(--ourp-ink)', fontWeight: 600 }}>
                            {kw ? 'No subjects found' : 'No subjects available'}
                        </h3>
                        <p className="m-0" style={{ color: 'var(--ourp-muted)' }}>
                            {kw
                                ? `No subjects match your search "${kw}"`
                                : 'There are no subjects available at the moment'}
                        </p>
                        {kw && (
                            <Button
                                label="Clear search"
                                icon="pi pi-times"
                                className="p-button-text mt-3"
                                onClick={() => setQ("")}
                            />
                        )}
                    </div>
                )}

                {/* Subjects Grid */}
                {!loading && total > 0 && (
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
                )}

                {/* Paginator */}
                {!loading && total > rows && (
                    <Paginator
                        className="ourp-paginator"
                        first={(page - 1) * rows}
                        rows={rows}
                        totalRecords={total}
                        onPageChange={onPageChange}
                        rowsPerPageOptions={[9, 12, 18, 24]}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                        currentPageReportTemplate="Showing {first} - {last} of {totalRecords} subjects"
                    />
                )}
            </main>

            {/* ========== RIGHT SIDEBAR ========== */}
            <aside className="programs-sidebar-right">
                <div className="sidebar-sticky">
                    {/* Special Offer */}
                    <div className="ad-panel" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <h3 className="ad-panel__title">
                            <i className="pi pi-gift mr-2"></i>
                            Subject Bundle Deals
                        </h3>
                        <p className="ad-panel__text">
                            Combine 3+ subjects and get 25% off your enrollment!
                        </p>
                        <button className="ad-panel__cta">View Bundles</button>
                    </div>

                    {/* Learning Tips */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-lightbulb mr-2"></i>
                            Learning Tips
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-check-circle mr-2" style={{ color: '#10b981' }}></i>
                                    Set Daily Goals
                                </div>
                                <div className="event-item__date">Practice 15-30 min daily</div>
                            </div>
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-users mr-2" style={{ color: '#3b82f6' }}></i>
                                    Join Study Groups
                                </div>
                                <div className="event-item__date">Learn with peers</div>
                            </div>
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-video mr-2" style={{ color: '#f59e0b' }}></i>
                                    Watch Resources
                                </div>
                                <div className="event-item__date">Extra learning materials</div>
                            </div>
                        </div>
                    </div>

                    {/* Certification */}
                    <div className="ad-panel" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <h3 className="ad-panel__title">
                            <i className="pi pi-verified mr-2"></i>
                            Get Certified!
                        </h3>
                        <p className="ad-panel__text">
                            Complete subjects and earn official certificates recognized worldwide.
                        </p>
                        <button className="ad-panel__cta">Learn More</button>
                    </div>

                    {/* Success Story */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-star-fill mr-2"></i>
                            Success Story
                        </h3>
                        <div className="sidebar-panel__content">
                            <div style={{
                                background: '#f8fafc',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '3px solid #10b981'
                            }}>
                                <p style={{ fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                                    "After completing 6 subjects, I improved my English proficiency by 2 levels!"
                                </p>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#475569'
                                }}>
                                    <i className="pi pi-user mr-2" style={{ color: '#10b981' }}></i>
                                    Michael T., Business Professional
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-link mr-2"></i>
                            Quick Links
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="sidebar-link">
                                <i className="pi pi-calendar mr-2"></i>
                                Class Schedule
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-download mr-2"></i>
                                Study Materials
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-chart-line mr-2"></i>
                                Progress Tracking
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}