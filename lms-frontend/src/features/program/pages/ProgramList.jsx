import { useEffect, useMemo, useState } from "react";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { getListProgram } from "@/features/program/api/programService";
import ProgramCard from "@/features/home/component/ProgramCard";
import "../styles/ourprogram.css";

export default function ProgramList() {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingQ, setPendingQ] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(9);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const { items } = await getListProgram({ page: 1, size: 999 });
            setAllItems(items || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            setQuery(pendingQ.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [pendingQ]);

    const filtered = useMemo(() => {
        if (!query) return allItems;
        const kw = query.toLowerCase();
        return allItems.filter((p) =>
            [p.title, p.code, p.description].some((t) =>
                (t || "").toLowerCase().includes(kw)
            )
        );
    }, [allItems, query]);

    const total = filtered.length;
    const activeCount = allItems.filter(p => p.isActive).length;

    const pagedItems = useMemo(() => {
        const start = (page - 1) * rows;
        return filtered.slice(start, start + rows);
    }, [filtered, page, rows]);

    const onPageChange = (e) => {
        const newPage = Math.floor(e.first / e.rows) + 1;
        setPage(newPage);
        setRows(e.rows);
    };

    return (
        <div className="programs-page-wrapper">
            {/* ========== LEFT SIDEBAR ========== */}
            <aside className="programs-sidebar-left">
                <div className="sidebar-sticky">
                    {/* Quick Stats */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-chart-bar mr-2"></i>
                            Quick Stats
                        </h3>
                        <div className="info-card">
                            <div className="info-card__label">Total Programs</div>
                            <div className="info-card__value">{allItems.length}</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card__label">Active Programs</div>
                            <div className="info-card__value">{activeCount}</div>
                        </div>
                        <div className="info-card">
                            <div className="info-card__label">
                                {query ? 'Search Results' : 'Showing'}
                            </div>
                            <div className="info-card__value">{filtered.length}</div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-list mr-2"></i>
                            Categories
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="sidebar-link">
                                <i className="pi pi-book mr-2"></i>
                                English Programs
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-desktop mr-2"></i>
                                STEAM Programs
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-file-edit mr-2"></i>
                                Exam Preparation
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-sun mr-2"></i>
                                Summer Camps
                            </div>
                            <div className="sidebar-link">
                                <i className="pi pi-briefcase mr-2"></i>
                                Business English
                            </div>
                        </div>
                    </div>

                    {/* Help & Support */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-question-circle mr-2"></i>
                            Need Help?
                        </h3>
                        <div className="sidebar-panel__content">
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                                Our admissions team is ready to help you find the perfect program.
                            </p>
                            <Button
                                label="Contact Us"
                                icon="pi pi-phone"
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
                            <i className="pi pi-briefcase mr-2" style={{ color: '#3b82f6', fontSize: '36px' }}></i>
                            Our Programs
                        </h1>
                    </div>

                    <div className="ourp-right">
                        <div className="ourp-searchbar">
                            <span className="p-input-icon-left ourp-input">
                                <i className="pi pi-search" />
                                <InputText
                                    value={pendingQ}
                                    onChange={(e) => setPendingQ(e.target.value)}
                                    placeholder="Search by name, code, or description..."
                                    className="w-full"
                                    aria-label="Search programs"
                                />
                            </span>

                            {pendingQ && (
                                <Button
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    severity="secondary"
                                    onClick={() => setPendingQ("")}
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

                {/* Search Info & Count */}
                {query && (
                    <div className="flex align-items-center gap-2 mb-3 p-3 bg-white border-round-lg shadow-1">
                        <i className="pi pi-filter" style={{ color: '#3b82f6' }}></i>
                        <span style={{ color: 'var(--ourp-muted)' }}>
                            Searching for: <strong style={{ color: 'var(--ourp-ink)' }}>"{query}"</strong>
                        </span>
                        <Badge value={`${filtered.length} result${filtered.length !== 1 ? 's' : ''}`} severity="info" />
                    </div>
                )}

                {!query && total > 0 && (
                    <div className="flex justify-content-end mb-2">
                        <Badge
                            value={`Total: ${total} program${total !== 1 ? 's' : ''}`}
                            severity="info"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.65rem' }}
                        />
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center p-6 bg-white border-round-lg shadow-2 my-4">
                        <i className="pi pi-spin pi-spinner text-4xl" style={{ color: '#3b82f6' }}></i>
                        <p className="mt-3 mb-0" style={{ color: 'var(--ourp-muted)', fontWeight: 500 }}>
                            Loading programs...
                        </p>
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
                            {query ? 'No programs found' : 'No programs available'}
                        </h3>
                        <p className="m-0" style={{ color: 'var(--ourp-muted)' }}>
                            {query
                                ? `No programs match your search "${query}"`
                                : 'There are no programs available at the moment'}
                        </p>
                        {query && (
                            <Button
                                label="Clear search"
                                icon="pi pi-times"
                                className="p-button-text mt-3"
                                onClick={() => setPendingQ("")}
                            />
                        )}
                    </div>
                )}

                {/* Programs Grid */}
                {!loading && total > 0 && (
                    <div className="program-card">
                        <div className="grid">
                            {pagedItems.map((p) => (
                                <div key={p.id} className="col-12 md:col-6 lg:col-4">
                                    <div className="pg-cell">
                                        <ProgramCard program={p} />
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
                        rowsPerPageOptions={[6, 9, 12, 18]}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                        currentPageReportTemplate="Showing {first} - {last} of {totalRecords} programs"
                    />
                )}
            </main>

            {/* ========== RIGHT SIDEBAR ========== */}
            <aside className="programs-sidebar-right">
                <div className="sidebar-sticky">
                    {/* Promotional Ad 1 */}
                    <div className="ad-panel">
                        <h3 className="ad-panel__title">
                            <i className="pi pi-gift mr-2"></i>
                            Early Bird Discount
                        </h3>
                        <p className="ad-panel__text">
                            Register now and save up to 20% on all programs!
                        </p>
                        <button className="ad-panel__cta">Learn More</button>
                    </div>

                    {/* Upcoming Events */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-calendar mr-2"></i>
                            Upcoming Events
                        </h3>
                        <div className="sidebar-panel__content">
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-home mr-2" style={{ color: '#3b82f6' }}></i>
                                    Open House
                                </div>
                                <div className="event-item__date">📅 Jan 15, 2025</div>
                            </div>
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-users mr-2" style={{ color: '#10b981' }}></i>
                                    Free Trial Class
                                </div>
                                <div className="event-item__date">📅 Jan 20, 2025</div>
                            </div>
                            <div className="event-item">
                                <div className="event-item__title">
                                    <i className="pi pi-comments mr-2" style={{ color: '#f59e0b' }}></i>
                                    Parent Workshop
                                </div>
                                <div className="event-item__date">📅 Jan 25, 2025</div>
                            </div>
                        </div>
                    </div>

                    {/* Promotional Ad 2 */}
                    <div className="ad-panel" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <h3 className="ad-panel__title">
                            <i className="pi pi-megaphone mr-2"></i>
                            New Program Alert
                        </h3>
                        <p className="ad-panel__text">
                            Check out our brand new AI & Robotics course!
                        </p>
                        <button className="ad-panel__cta">Explore Now</button>
                    </div>

                    {/* Testimonial */}
                    <div className="sidebar-panel">
                        <h3 className="sidebar-panel__title">
                            <i className="pi pi-star-fill mr-2"></i>
                            Student Success
                        </h3>
                        <div className="sidebar-panel__content">
                            <div style={{
                                background: '#f8fafc',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '3px solid #3b82f6'
                            }}>
                                <p style={{ fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                                    "The STEAM program helped my child develop critical thinking skills and creativity!"
                                </p>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#475569'
                                }}>
                                    <i className="pi pi-user mr-2" style={{ color: '#3b82f6' }}></i>
                                    Parent of Emily, Age 10
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}