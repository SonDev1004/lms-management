import React, {useMemo, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import NotificationList from "../components/notificationList.jsx";
import NotificationViewDialog from "../components/dialogs/notificationDetailDialog.jsx";
import {useNotifications} from "../hooks/useNotifications";
import "../styles/Notifications.css";

const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
};

export default function NotificationsPage() {
    const toast = useRef(null);
    const {notifications, loading, load, markRead, remove} = useNotifications({
        enableSocket: true,
        onPopup: (n) =>
            toast.current?.show({
                severity: n.isSeen ? "info" : "success",
                summary: n.title,
                detail: stripHtml(n.content || ""),
                life: 5000
            })
    });

    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [open, setOpen] = useState(false);
    const [selected] = useState(null);

    const TABS = [
        {label: "All", value: null},
        {label: "Assignment", value: "assignment"},
        {label: "Event", value: "event"},
        {label: "Feedback", value: "feedback"},
        {label: "System", value: "system"}
    ];
    const statusOptions = [
        {label: "All", value: null},
        {label: "Unread", value: "unread"},
        {label: "Read", value: "read"}
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
            <Toast ref={toast} position="top-right"/>

            <div className="notifications-container">
                <div className="notifications-header">
                    <div>
                        <h2 className="notifications-title">Notifications</h2>
                        <p className="notifications-sub">
                            {unreadCount} unread notifications
                        </p>
                    </div>

                    <div className="controls">
                        <div className="tabs">
                            {TABS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`tab-btn ${
                                        filterType === t.value ? "active" : ""
                                    }`}
                                    onClick={() => setFilterType(t.value)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-input-icon-left search-input">
                            <i className="pi pi-search"/>
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search notifications"
                            />
                        </div>

                        <Dropdown
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(e) => setStatusFilter(e.value)}
                            optionLabel="label"
                            placeholder="Status"
                            className="status-dropdown"
                        />

                        <Button
                            icon="pi pi-refresh"
                            label="Refresh"
                            onClick={load}
                            className="refresh-btn"
                        />
                    </div>
                </div>

                <NotificationList
                    notifications={filtered}
                    loading={loading}
                    onMarkRead={markRead}
                    onDelete={(idOrObj) => remove(idOrObj)}
                />

            </div>

            <NotificationViewDialog
                visible={open}
                noti={selected}
                onClose={() => setOpen(false)}
                onDelete={(id) => {
                    remove(id ?? selected);
                    setOpen(false);
                }}
            />
        </div>
    );
}
