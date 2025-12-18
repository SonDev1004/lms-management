import { useEffect, useMemo, useState, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
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
        return <Tag value="Urgent" severity="danger" className="w-8rem justify-content-center" />;
    if (s === 0)
        return <Tag value="Info" severity="info" className="w-8rem justify-content-center" />;
    return (
        <Tag
            value="Normal"
            severity="success"
            className="w-8rem justify-content-center"
        />
    );
};

const receiverRoleBody = (row) => {
    if (!row.receiverRole) return "-";
    return (
        <Tag
            value={row.receiverRole}
            severity="secondary"
            className="justify-content-center"
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

    return (
        <div className="p-4 md:p-5 bg-white rounded-2xl shadow-sm">
            <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4 gap-3">
                <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-1">
                        Notification center
                    </h2>
                    <p className="m-0 text-500 text-sm">
                        Quản lý thông báo đã hẹn giờ và lịch sử đã gửi.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-refresh"
                        label="Reload"
                        className="p-button-text"
                        onClick={load}
                    />
                    <Button
                        icon="pi pi-filter-slash"
                        label="Clear filters"
                        className="p-button-text"
                        onClick={resetFilter}
                    />
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-column md:flex-row gap-3 mb-4">
                <span className="p-input-icon-left flex-1">
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
                    className="w-full md:w-14rem"
                    placeholder="Severity"
                />

                <Dropdown
                    value={receiverRole}
                    options={roleOptions}
                    onChange={(e) => setReceiverRole(e.value)}
                    className="w-full md:w-16rem"
                    placeholder="Receiver role"
                />

                <Calendar
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    placeholder="Date range"
                    className="w-full md:w-18rem"
                    showIcon
                />
            </div>

            <TabView>
                {/* QUEUE */}
                <TabPanel header={`Scheduled (Queue) – ${queue.length}`}>
                    <DataTable
                        value={queue}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="Không có thông báo nào đang hẹn giờ."
                        size="small"
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column
                            header="Scheduled time"
                            body={(row) => formatDateTime(row.scheduledDate)}
                            style={{ width: "14rem" }}
                        />
                        <Column field="title" header="Title" />
                        <Column
                            header="Severity"
                            body={(row) => severityTag(row.severity)}
                            style={{ width: "8rem" }}
                        />
                        <Column
                            header="Receiver role"
                            body={receiverRoleBody}
                            style={{ width: "10rem" }}
                        />
                    </DataTable>
                </TabPanel>

                {/* HISTORY */}
                <TabPanel header={`History (Sent) – ${history.length}`}>
                    <DataTable
                        value={history}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="Chưa có thông báo nào đã gửi."
                        size="small"
                        stripedRows
                        responsiveLayout="scroll"
                    >
                        <Column
                            header="Sent time"
                            body={(row) => formatDateTime(row.postedDate)}
                            style={{ width: "14rem" }}
                        />
                        <Column field="title" header="Title" />
                        <Column
                            header="Severity"
                            body={(row) => severityTag(row.severity)}
                            style={{ width: "8rem" }}
                        />
                        <Column
                            header="Receiver role"
                            body={receiverRoleBody}
                            style={{ width: "10rem" }}
                        />
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
}
