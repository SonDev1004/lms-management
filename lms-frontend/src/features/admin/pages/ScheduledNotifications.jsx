import { useEffect, useMemo, useState, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { format, startOfDay, endOfDay } from "date-fns";

import {
    getScheduledNotifications,
    getSentNotifications,
} from "@/features/notification/api/notificationService";

const severityOptions = [
    { label: "All severities", value: null },
    { label: "Info (0)", value: 0 },
    { label: "Normal (1)", value: 1 },
    { label: "Urgent (2)", value: 2 },
];

const stripHtml = (html = "") =>
    html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return format(d, "dd/MM/yyyy HH:mm");
};

const severityTag = (sev) => {
    const s = Number(sev ?? 1);
    if (s === 2)
        return (
            <Tag
                value="Urgent"
                severity="danger"
                className="px-3 py-2 text-sm font-semibold"
                icon="pi pi-exclamation-triangle"
            />
        );
    if (s === 0)
        return (
            <Tag
                value="Info"
                severity="info"
                className="px-3 py-2 text-sm font-semibold"
                icon="pi pi-info-circle"
            />
        );
    return (
        <Tag
            value="Normal"
            severity="success"
            className="px-3 py-2 text-sm font-semibold"
            icon="pi pi-check-circle"
        />
    );
};

const receiverRoleBody = (row) => {
    if (!row.receiverRole) return <span className="text-gray-400">-</span>;
    return (
        <Tag
            value={row.receiverRole}
            className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold"
            icon="pi pi-users"
        />
    );
};

export default function ScheduledNotifications() {
    const [queueRaw, setQueueRaw] = useState([]);
    const [historyRaw, setHistoryRaw] = useState([]);

    // filters
    const [keyword, setKeyword] = useState("");
    const [severity, setSeverity] = useState(null);
    const [receiverRole, setReceiverRole] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const [queue, history] = await Promise.all([
                getScheduledNotifications(),
                getSentNotifications(),
            ]);
            setQueueRaw(queue || []);
            setHistoryRaw(history || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // role options build từ data thực tế
    const roleOptions = useMemo(() => {
        const set = new Set();
        [...queueRaw, ...historyRaw].forEach((n) => {
            if (n.receiverRole) set.add(n.receiverRole.toUpperCase());
        });
        const arr = Array.from(set).sort();
        return [
            { label: "All receiver roles", value: null },
            ...arr.map((r) => ({ label: r, value: r })),
        ];
    }, [queueRaw, historyRaw]);

    // reset filter
    const resetFilter = () => {
        setKeyword("");
        setSeverity(null);
        setReceiverRole(null);
        setDateRange(null);
    };

    const applyFilter = useCallback(
        (rows, isQueue) => {
            if (!rows || !rows.length) return [];

            const kw = keyword.trim().toLowerCase();
            const [start, end] =
                dateRange && dateRange[0] && dateRange[1]
                    ? [startOfDay(dateRange[0]), endOfDay(dateRange[1])]
                    : [null, null];

            return rows
                .filter((row) => {
                    if (!kw) return true;
                    const combined =
                        (row.title || "") +
                        " " +
                        stripHtml(row.content || "");
                    return combined.toLowerCase().includes(kw);
                })
                .filter((row) => {
                    if (severity == null) return true;
                    return Number(row.severity) === Number(severity);
                })
                .filter((row) => {
                    if (!receiverRole) return true;
                    const r = (row.receiverRole || "").toUpperCase();
                    return r === receiverRole.toUpperCase();
                })
                .filter((row) => {
                    if (!start || !end) return true;
                    const raw = isQueue ? row.scheduledDate : row.postedDate;
                    if (!raw) return false;
                    const d = new Date(raw);
                    if (Number.isNaN(d.getTime())) return false;
                    return d >= start && d <= end;
                })
                .sort((a, b) => {
                    const da = new Date(
                        (isQueue ? a.scheduledDate : a.postedDate) || 0
                    ).getTime();
                    const db = new Date(
                        (isQueue ? b.scheduledDate : b.postedDate) || 0
                    ).getTime();
                    return db - da; // newest first
                });
        },
        [keyword, severity, receiverRole, dateRange]
    );

    const queue = useMemo(
        () => applyFilter(queueRaw, true),
        [applyFilter, queueRaw]
    );
    const history = useMemo(
        () => applyFilter(historyRaw, false),
        [applyFilter, historyRaw]
    );

    // Stats cards data
    const stats = useMemo(() => {
        const urgentQueue = queue.filter(n => Number(n.severity) === 2).length;
        const totalSent = history.length;
        const recentSent = history.filter(n => {
            const d = new Date(n.postedDate);
            const now = new Date();
            const daysDiff = (now - d) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        }).length;

        return [
            {
                title: "Scheduled",
                value: queue.length,
                icon: "pi pi-clock",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50"
            },
            {
                title: "Urgent Queue",
                value: urgentQueue,
                icon: "pi pi-exclamation-triangle",
                color: "from-red-500 to-pink-500",
                bgColor: "from-red-50 to-pink-50"
            },
            {
                title: "Total Sent",
                value: totalSent,
                icon: "pi pi-send",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50"
            },
            {
                title: "Last 7 Days",
                value: recentSent,
                icon: "pi pi-chart-line",
                color: "from-purple-500 to-indigo-500",
                bgColor: "from-purple-50 to-indigo-50"
            }
        ];
    }, [queue, history]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between gap-3 mb-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Notification Center
                            </h1>
                            <p className="text-gray-600 text-lg m-0">
                                Manage scheduled and sent notifications across the platform
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-refresh"
                                label="Reload"
                                className="p-button-outlined"
                                onClick={load}
                            />
                            <Button
                                icon="pi pi-filter-slash"
                                label="Clear Filters"
                                className="p-button-outlined p-button-danger"
                                onClick={resetFilter}
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className="flex justify-content-between align-items-start mb-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex align-items-center justify-content-center shadow-lg`}>
                                        <i className={`${stat.icon} text-white text-xl`}></i>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters Card */}
                    <Card className="shadow-xl border-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Search title / content..."
                                    className="w-full"
                                />
                            </span>

                            <Dropdown
                                value={severity}
                                options={severityOptions}
                                onChange={(e) => setSeverity(e.value)}
                                className="w-full"
                                placeholder="All severities"
                            />

                            <Dropdown
                                value={receiverRole}
                                options={roleOptions}
                                onChange={(e) => setReceiverRole(e.value)}
                                className="w-full"
                                placeholder="All receiver roles"
                            />

                            <Calendar
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                placeholder="Date range"
                                className="w-full"
                                showIcon
                            />
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Card className="shadow-xl border-none">
                    <TabView className="elegant-tabs">
                        {/* QUEUE */}
                        <TabPanel
                            header={
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-clock"></i>
                                    <span>Scheduled Queue</span>
                                    <Tag value={queue.length} className="ml-2" severity="info" />
                                </div>
                            }
                        >
                            <DataTable
                                value={queue}
                                loading={loading}
                                paginator
                                rows={10}
                                emptyMessage="No scheduled notifications"
                                size="small"
                                stripedRows
                                responsiveLayout="scroll"
                                className="elegant-table"
                            >
                                <Column
                                    header="Scheduled Time"
                                    body={(row) => (
                                        <div className="flex align-items-center gap-2">
                                            <i className="pi pi-calendar text-indigo-600"></i>
                                            <span className="font-semibold">{formatDateTime(row.scheduledDate)}</span>
                                        </div>
                                    )}
                                    style={{ width: "16rem" }}
                                />
                                <Column
                                    field="title"
                                    header="Title"
                                    body={(row) => <span className="font-medium text-gray-800">{row.title}</span>}
                                />
                                <Column
                                    header="Severity"
                                    body={(row) => severityTag(row.severity)}
                                    style={{ width: "10rem" }}
                                />
                                <Column
                                    header="Receiver Role"
                                    body={receiverRoleBody}
                                    style={{ width: "12rem" }}
                                />
                            </DataTable>
                        </TabPanel>

                        {/* HISTORY */}
                        <TabPanel
                            header={
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-send"></i>
                                    <span>Sent History</span>
                                    <Tag value={history.length} className="ml-2" severity="success" />
                                </div>
                            }
                        >
                            <DataTable
                                value={history}
                                loading={loading}
                                paginator
                                rows={10}
                                emptyMessage="No sent notifications"
                                size="small"
                                stripedRows
                                responsiveLayout="scroll"
                                className="elegant-table"
                            >
                                <Column
                                    header="Sent Time"
                                    body={(row) => (
                                        <div className="flex align-items-center gap-2">
                                            <i className="pi pi-calendar-check text-green-600"></i>
                                            <span className="font-semibold">{formatDateTime(row.postedDate)}</span>
                                        </div>
                                    )}
                                    style={{ width: "16rem" }}
                                />
                                <Column
                                    field="title"
                                    header="Title"
                                    body={(row) => <span className="font-medium text-gray-800">{row.title}</span>}
                                />
                                <Column
                                    header="Severity"
                                    body={(row) => severityTag(row.severity)}
                                    style={{ width: "10rem" }}
                                />
                                <Column
                                    header="Receiver Role"
                                    body={receiverRoleBody}
                                    style={{ width: "12rem" }}
                                />
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>

            <style jsx>{`
                :global(.elegant-tabs .p-tabview-nav) {
                    background: linear-gradient(to right, #f0f9ff, #faf5ff) !important;
                    border: none !important;
                    border-radius: 12px 12px 0 0 !important;
                    padding: 0.5rem !important;
                }

                :global(.elegant-tabs .p-tabview-nav li .p-tabview-nav-link) {
                    border: none !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                }

                :global(.elegant-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
                    background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
                }

                :global(.elegant-table .p-datatable-thead > tr > th) {
                    background: linear-gradient(to right, #f0f9ff, #faf5ff) !important;
                    color: #4b5563 !important;
                    font-weight: 700 !important;
                    border: none !important;
                }

                :global(.elegant-table .p-datatable-tbody > tr) {
                    transition: all 0.3s ease !important;
                }

                :global(.elegant-table .p-datatable-tbody > tr:hover) {
                    background: linear-gradient(to right, #f0f9ff, #faf5ff) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1) !important;
                }

                :global(.p-card) {
                    border-radius: 1rem !important;
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(10px) !important;
                }

                :global(.p-button) {
                    border-radius: 0.75rem !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                }

                :global(.p-button:hover) {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
                }

                :global(.p-inputtext) {
                    border-radius: 0.75rem !important;
                    transition: all 0.3s ease !important;
                }

                :global(.p-inputtext:focus) {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
                }

                :global(.p-dropdown) {
                    border-radius: 0.75rem !important;
                }

                :global(.p-calendar) {
                    border-radius: 0.75rem !important;
                }
            `}</style>
        </div>
    );
}