import React, { useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import NotificationList from "../components/NotificationList.jsx"; // Sửa tên file viết hoa
import { useNotifications } from "../hooks/useNotifications";
import "../styles/Notifications.css";

// util nhỏ: bỏ tag HTML để search theo text
function stripHtml(html = "") {
    try {
        const div = document.createElement("div");
        div.innerHTML = html;
        return (div.textContent || div.innerText || "").trim();
    } catch {
        return html;
    }
}

export default function NotificationsPage() {
    const toast = useRef(null);

    // TODO: truyền userId từ auth store/context của bạn để bật realtime socket
    // ví dụ: const { currentUser } = useAuthStore(); const userId = currentUser?.id;
    const userId = undefined;

    const {
        notifications,
        loading,
        load,
        markRead,
        markAllRead,
        remove,
        setNotifications,
    } = useNotifications({ userId });

    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);

    const [lastDeleted, setLastDeleted] = useState(null);
    const [lastStateBeforeMarkAll, setLastStateBeforeMarkAll] = useState(null);

    // Tabs giữ nguyên, nhưng so sánh theo type từ BE (vd: "General", "Course", ...)
    // Ta sẽ normalize về lowercase khi filter.
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
            // BE fields: title, content(HTML), isSeen, type(String), url, severity, postedDate
            const nType = (n.type || "").toLowerCase();
            const nTitle = (n.title || "").toLowerCase();
            const nContentText = stripHtml(n.content || "").toLowerCase();

            // 1) filter theo tab type (client-side mapping)
            if (filterType && nType !== filterType) return false;

            // 2) filter theo trạng thái đọc/chưa đọc
            if (statusFilter === "unread" && n.isSeen) return false;
            if (statusFilter === "read" && !n.isSeen) return false;

            // 3) search theo title + content text
            if (!q) return true;
            return nTitle.includes(q) || nContentText.includes(q);
        });
    }, [notifications, query, filterType, statusFilter]);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isSeen).length,
        [notifications]
    );

    const handleMarkRead = async (id) => {
        await markRead(id);
        toast.current?.show({
            severity: "success",
            summary: "Read",
            detail: "Marked one notification as read.",
            life: 1500,
        });
    };

    const handleDelete = async (id) => {
        const item = notifications.find((x) => x.id === id);
        if (!item) return;
        if (!window.confirm("Are you sure you want to delete this notification?"))
            return;

        setLastDeleted(item);
        await remove(id); // Hiện BE chưa có DELETE → remove local
        toast.current?.show({
            severity: "warn",
            summary: "Deleted",
            detail: "You can undo this action for a few seconds.",
            life: 4000,
        });

        setTimeout(
            () => setLastDeleted((cur) => (cur && cur.id === item.id ? null : cur)),
            8000
        );
    };

    const undoDelete = () => {
        if (!lastDeleted) return;
        setNotifications((prev) =>
            [...prev, lastDeleted].sort(
                (a, b) =>
                    new Date(b.postedDate || 0).getTime() -
                    new Date(a.postedDate || 0).getTime()
            )
        );
        toast.current?.show({
            severity: "info",
            summary: "Undo",
            detail: "Notification has been restored.",
            life: 2000,
        });
        setLastDeleted(null);
    };

    const handleMarkAll = async () => {
        if (unreadCount === 0) return;
        // lưu lại trạng thái isSeen để undo
        setLastStateBeforeMarkAll(
            notifications.map((n) => ({ id: n.id, isSeen: n.isSeen }))
        );
        await markAllRead();
        toast.current?.show({
            severity: "success",
            summary: "Completed",
            detail: "All notifications have been marked as read.",
            life: 3000,
        });
    };

    const undoMarkAll = () => {
        if (!lastStateBeforeMarkAll) return;
        setNotifications((prev) =>
            prev.map((n) => {
                const old = lastStateBeforeMarkAll.find((o) => o.id === n.id);
                return old ? { ...n, isSeen: old.isSeen } : n;
            })
        );
        toast.current?.show({
            severity: "info",
            summary: "Undo",
            detail: "State has been restored.",
            life: 2000,
        });
        setLastStateBeforeMarkAll(null);
    };

    const handleDeleteRead = () => {
        if (!window.confirm("Are you sure you want to delete all read notifications?"))
            return;
        setNotifications((prev) => prev.filter((n) => !n.isSeen));
        toast.current?.show({
            severity: "warn",
            summary: "Deleted",
            detail: "Read notifications have been deleted.",
            life: 2500,
        });
    };

    return (
        <div className="notifications-page p-p-6">
            <Toast ref={toast} />

            <div className="notifications-container">
                <div className="notifications-header">
                    <div>
                        <h2 className="notifications-title">Notification</h2>
                        <div className="notifications-sub" aria-live="polite">
                            {unreadCount} Unread Notification
                        </div>
                    </div>

                    <div className="controls">
                        <div className="tabs" role="tablist" aria-label="Notification Types">
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
                                placeholder="Search by title or content..."
                                aria-label="Search notifications"
                            />
                        </div>

                        <Dropdown
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(e) => setStatusFilter(e.value)}
                            optionLabel="label"
                            placeholder="Status"
                            aria-label="Filter by status"
                        />

                        <Button
                            icon="pi pi-check"
                            label="Mark all as read"
                            onClick={handleMarkAll}
                            disabled={unreadCount === 0}
                            aria-label="Mark all as read"
                        />
                        <Button
                            icon="pi pi-refresh"
                            label="Refresh"
                            onClick={load}
                            aria-label="Refresh list"
                        />
                    </div>
                </div>

                <div className="layout">
                    <div>
                        <NotificationList
                            notifications={filtered}
                            loading={loading}
                            onMarkRead={handleMarkRead}
                            onDelete={handleDelete}
                        />
                    </div>

                    <div>
                        <div className="status-card" aria-live="polite">
                            <div className="small-muted">Unread</div>
                            <div className="notifications-count">{unreadCount}</div>

                            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                                <Button
                                    label="Delete Read"
                                    className="p-button-danger"
                                    onClick={handleDeleteRead}
                                    disabled={!notifications.some((n) => n.isSeen)}
                                    aria-label="Delete read notifications"
                                />
                                <Button
                                    label="Filter: Unread"
                                    className="p-button-outlined"
                                    onClick={() => setStatusFilter("unread")}
                                />
                            </div>

                            <div style={{ marginTop: 12 }}>
                                {lastDeleted && (
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <div className="small-muted">
                                            You just deleted a notification.
                                        </div>
                                        <Button label="Undo" onClick={undoDelete} />
                                    </div>
                                )}

                                {lastStateBeforeMarkAll && (
                                    <div
                                        style={{
                                            marginTop: 8,
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className="small-muted">You just marked all as read.</div>
                                        <Button label="Undo" onClick={undoMarkAll} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
