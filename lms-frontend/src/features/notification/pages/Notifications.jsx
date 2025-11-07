import React, { useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import NotificationList from "../components/NotificationList.jsx";
import { useNotifications } from "../hooks/useNotifications";
import "../styles/Notifications.css";

function stripHtml(html = "") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
}

export default function NotificationsPage() {
    const toast = useRef(null);

    const {
        notifications, loading, load, markRead, markAllRead, remove
    } = useNotifications({
        onPopup: (n) => {
            console.log("[POPUP] got", n);
            toast.current?.show({
                severity: "info",
                summary: n.title || "Thông báo mới",
                detail: (n.content || "").replace(/<[^>]+>/g, ""),
                life: 5000,
            });
        },
    });

    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);

    const TABS = [
        { label: "All", value: null },
        { label: "Assignment", value: "assignment" },
        { label: "Event", value: "event" },
        { label: "Feedback", value: "feedback" },
        { label: "System", value: "system" },
    ];
    const statusOptions = [
        { label: "All", value: null },
        { label: "Unread", value: "unread" },
        { label: "Read", value: "read" },
    ];

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return notifications.filter((n) => {
            const nType = (n.type || "").toLowerCase();
            const nTitle = (n.title || "").toLowerCase();
            const nContent = stripHtml(n.content || "").toLowerCase();

            if (filterType && nType !== filterType) return false;
            if (statusFilter === "unread" && n.isSeen) return false;
            if (statusFilter === "read" && !n.isSeen) return false;
            if (!q) return true;
            return nTitle.includes(q) || nContent.includes(q);
        });
    }, [notifications, query, filterType, statusFilter]);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isSeen).length,
        [notifications]
    );

    return (
        <div className="notifications-page p-p-6">
            <Toast ref={toast} position="top-right" />
            <div className="notifications-container">
                <div className="notifications-header">
                    <h2>Notifications</h2>
                    <div>{unreadCount} unread</div>
                    <div className="controls">
                        <div className="tabs">
                            {TABS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`tab-btn ${filterType === t.value ? "active" : ""}`}
                                    onClick={() => setFilterType(t.value)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                            />
                        </div>

                        <Dropdown
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(e) => setStatusFilter(e.value)}
                            optionLabel="label"
                            placeholder="Status"
                        />

                        <Button icon="pi pi-refresh" label="Refresh" onClick={load} />
                    </div>
                </div>

                <NotificationList
                    notifications={filtered}
                    loading={loading}
                    onMarkRead={(id) => markRead(id)}
                    onDelete={(id) => remove(id)}
                />
            </div>
        </div>
    );
}
