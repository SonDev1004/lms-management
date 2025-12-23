import React, {useMemo, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {Badge} from "primereact/badge";
import {Divider} from "primereact/divider";
import NotificationList from "../components/notificationList.jsx";
import NotificationViewDialog from "../components/dialogs/notificationDetailDialog.jsx";
import {useNotifications} from "../hooks/useNotifications";

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
        {label: "All", value: null, icon: "pi-list", color: "#3b82f6"},
        {label: "Assignment", value: "assignment", icon: "pi-book", color: "#8b5cf6"},
        {label: "Event", value: "event", icon: "pi-calendar", color: "#10b981"},
        {label: "Feedback", value: "feedback", icon: "pi-comments", color: "#f59e0b"},
        {label: "System", value: "system", icon: "pi-cog", color: "#6b7280"}
    ];

    const statusOptions = [
        {label: "All", value: null},
        {label: "Haven't read yet", value: "unread"},
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

    // Statistics by type
    const typeStats = useMemo(() => {
        const stats = {};
        TABS.forEach(tab => {
            if (tab.value === null) {
                stats['all'] = notifications.length;
            } else {
                stats[tab.value] = notifications.filter(
                    n => (n.type || "").toLowerCase() === tab.value
                ).length;
            }
        });
        return stats;
    }, [notifications]);

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.isSeen).map(n => n.id);
        for (const id of unreadIds) {
            await markRead(id);
        }
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Marked all as read",
            life: 2000
        });
    };

    return (
        <div className="p-4" style={{maxWidth: '1400px', margin: '0 auto'}}>
            <Toast ref={toast} position="top-right"/>

            {/* Header */}
            <div className="mb-4 p-4 bg-white border-round-lg shadow-3">
                <div className="flex justify-content-between align-items-start">
                    <div>
                        <h1 className="m-0 text-3xl font-bold text-900">
                            <i className="pi pi-bell mr-3 text-blue-500"></i>
                            Notifications
                        </h1>
                        <p className="mt-2 mb-0 text-600">
                            Follow the latest announcements and updates
                        </p>
                    </div>

                    <div className="flex align-items-center gap-3">
                        {unreadCount > 0 && (
                            <Badge
                                value={unreadCount}
                                severity="danger"
                                size="large"
                                style={{fontSize: '1.1rem', padding: '0.5rem 0.75rem'}}
                            />
                        )}
                        <Button
                            label="Refresh"
                            icon="pi pi-refresh"
                            className="p-button-outlined"
                            onClick={load}
                            loading={loading}
                        />
                        {unreadCount > 0 && (
                            <Button
                                label="Read them all"
                                icon="pi pi-check-circle"
                                className="p-button-outlined p-button-success"
                                onClick={markAllAsRead}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-round-lg" style={{borderTop: '4px solid #3b82f6'}}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">General announcement</div>
                                <div className="text-3xl font-bold text-900">{notifications.length}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(59, 130, 246, 0.1)'
                                }}
                            >
                                <i className="pi pi-inbox text-blue-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-round-lg" style={{borderTop: '4px solid #ef4444'}}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Haven't read yet</div>
                                <div className="text-3xl font-bold text-900">{unreadCount}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(239, 68, 68, 0.1)'
                                }}
                            >
                                <i className="pi pi-envelope text-red-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card className="shadow-2 border-round-lg" style={{borderTop: '4px solid #10b981'}}>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 font-medium mb-2">Read</div>
                                <div className="text-3xl font-bold text-900">
                                    {notifications.length - unreadCount}
                                </div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center border-circle"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(16, 185, 129, 0.1)'
                                }}
                            >
                                <i className="pi pi-check text-green-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-3 shadow-2">
                {/* Type Tabs */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {TABS.map((tab) => {
                        const count = tab.value === null ? typeStats['all'] : typeStats[tab.value];
                        const isActive = filterType === tab.value;

                        return (
                            <button
                                key={tab.label}
                                onClick={() => setFilterType(tab.value)}
                                className="border-none cursor-pointer transition-all duration-200"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    background: isActive
                                        ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                                        : '#f1f5f9',
                                    color: isActive ? 'white' : '#64748b',
                                    fontWeight: isActive ? 'bold' : '500',
                                    transform: isActive ? 'translateY(-2px)' : 'none',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                                }}
                            >
                                <i className={`pi ${tab.icon} mr-2`}></i>
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className="ml-2 border-circle"
                                        style={{
                                            background: isActive ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                                            padding: '0.2rem 0.5rem',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <Divider/>

                {/* Search and Status Filter */}
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-search"/>
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search notifications..."
                                className="w-full"
                                style={{paddingLeft: '2.5rem'}}
                            />
                        </span>
                    </div>

                    <div className="col-12 md:col-4">
                        <Dropdown
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(e) => setStatusFilter(e.value)}
                            optionLabel="label"
                            placeholder="Status Filter"
                            className="w-full"
                        />
                    </div>
                </div>
            </Card>

            {/* Notifications List */}
            <Card className="shadow-3">
                <div className="flex align-items-center justify-content-between mb-3">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-list text-blue-500" style={{fontSize: '1.5rem'}}></i>
                        <h3 className="m-0 text-xl font-semibold text-900">
                            Notification Results
                        </h3>
                        <Badge
                            value={`${filtered.length} result`}
                            severity="info"
                        />
                    </div>

                    {filtered.length !== notifications.length && (
                        <Button
                            label="Xóa bộ lọc"
                            icon="pi pi-filter-slash"
                            className="p-button-text p-button-sm"
                            onClick={() => {
                                setQuery("");
                                setFilterType(null);
                                setStatusFilter(null);
                            }}
                        />
                    )}
                </div>

                <Divider/>

                {loading && filtered.length === 0 ? (
                    <div className="text-center p-5">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                        <p className="mt-3 text-600">Loading notification...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center p-5">
                        <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                        <h3 className="text-600">No notification</h3>
                        <p className="text-500">
                            {query || filterType || statusFilter
                                ? "No results were found that matched the filter"
                                : "You don't have any notifications yet"}
                        </p>
                    </div>
                ) : (
                    <NotificationList
                        notifications={filtered}
                        loading={loading}
                        onMarkRead={markRead}
                        onDelete={(idOrObj) => remove(idOrObj)}
                    />
                )}
            </Card>

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