import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import NotificationList from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/Notifications.css';

export default function NotificationsPage() {
    const toast = useRef(null);
    const { notifications, loading, load, markRead, markAllRead, remove, setNotifications } = useNotifications();
    const [query, setQuery] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);

    const [lastDeleted, setLastDeleted] = useState(null);
    const [lastStateBeforeMarkAll, setLastStateBeforeMarkAll] = useState(null);

    const TABS = [
        { label: 'Tất cả', value: null },
        { label: 'Bài tập', value: 'assignment' },
        { label: 'Sự kiện', value: 'event' },
        { label: 'Phản hồi', value: 'feedback' },
        { label: 'Hệ thống', value: 'system' },
    ];

    const statusOptions = [
        { label: 'Tất cả', value: null },
        { label: 'Chưa đọc', value: 'unread' },
        { label: 'Đã đọc', value: 'read' },
    ];

    const filtered = notifications.filter((n) => {
        const q = query.trim().toLowerCase();
        if (filterType && n.type !== filterType) return false;
        if (statusFilter === 'unread' && n.read) return false;
        if (statusFilter === 'read' && !n.read) return false;
        if (!q) return true;
        return (
            (n.title || '').toLowerCase().includes(q) ||
            (n.message || '').toLowerCase().includes(q) ||
            (n.sender || '').toLowerCase().includes(q) ||
            ((n.course || '').toLowerCase().includes(q))
        );
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkRead = async (id) => {
        await markRead(id);
        toast.current?.show({ severity: 'success', summary: 'Đã đọc', detail: 'Đã đánh dấu 1 thông báo là đã đọc.', life: 1500 });
    };

    const handleDelete = async (id) => {
        const item = notifications.find((x) => x.id === id);
        if (!item) return;
        if (!window.confirm('Bạn có chắc muốn xoá thông báo này?')) return;
        setLastDeleted(item);
        await remove(id);
        toast.current?.show({ severity: 'warn', summary: 'Đã xoá', detail: 'Bạn có thể hoàn tác trong vài giây.', life: 4000 });
        setTimeout(() => setLastDeleted((cur) => (cur && cur.id === item.id ? null : cur)), 8000);
    };

    const undoDelete = () => {
        if (!lastDeleted) return;
        setNotifications(prev =>
            [...prev, lastDeleted].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        toast.current?.show({ severity: 'info', summary: 'Hoàn tác', detail: 'Đã khôi phục thông báo.', life: 2000 });
        setLastDeleted(null);
    };


    const handleMarkAll = async () => {
        if (unreadCount === 0) return;
        setLastStateBeforeMarkAll(notifications.map((n) => ({ id: n.id, read: n.read })));
        await markAllRead();
        toast.current?.show({ severity: 'success', summary: 'Hoàn tất', detail: 'Đã đánh dấu tất cả.', life: 3000 });
    };

    const undoMarkAll = () => {
        if (!lastStateBeforeMarkAll) return;
        setNotifications((prev) =>
            prev.map((n) => {
                const old = lastStateBeforeMarkAll.find((o) => o.id === n.id);
                return old ? { ...n, read: old.read } : n;
            })
        );
        toast.current?.show({ severity: 'info', summary: 'Hoàn tác', detail: 'Trạng thái đã được phục hồi.', life: 2000 });
        setLastStateBeforeMarkAll(null);
    };

    const handleDeleteRead = () => {
        if (!window.confirm('Bạn có chắc muốn xoá tất cả thông báo đã đọc?')) return;
        setNotifications((prev) => prev.filter((n) => !n.read));
        toast.current?.show({ severity: 'warn', summary: 'Đã xoá', detail: 'Các thông báo đã đọc đã bị xoá.', life: 2500 });
    };

    return (
        <div className="notifications-page p-p-6">
            <Toast ref={toast} />

            <div className="notifications-container">
                <div className="notifications-header">
                    <div>
                        <h2 className="notifications-title">Thông báo</h2>
                        <div className="notifications-sub" aria-live="polite">
                            {unreadCount} thông báo chưa đọc
                        </div>
                    </div>

                    <div className="controls">
                        <div className="tabs" role="tablist" aria-label="Loại thông báo">
                            {TABS.map((t) => (
                                <button
                                    key={t.label}
                                    className={`tab-btn ${filterType === t.value ? 'active' : ''}`}
                                    onClick={() => {
                                        setFilterType(t.value);
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tiêu đề, nội dung, người gửi, khoá học..." aria-label="Tìm thông báo" />
                        </div>

                        <Dropdown value={statusFilter} options={statusOptions} onChange={(e) => setStatusFilter(e.value)} optionLabel="label" placeholder="Trạng thái" aria-label="Lọc trạng thái" />

                        <Button icon="pi pi-check" label="Đánh dấu tất cả" onClick={handleMarkAll} disabled={unreadCount === 0} aria-label="Đánh dấu tất cả đã đọc" />
                        <Button icon="pi pi-refresh" label="Làm mới" onClick={load} aria-label="Làm mới danh sách" />
                    </div>
                </div>

                <div className="layout">
                    <div>
                        <NotificationList notifications={filtered} loading={loading} onMarkRead={handleMarkRead} onDelete={handleDelete} />
                    </div>

                    <div>
                        <div className="status-card" aria-live="polite">
                            <div className="small-muted">Chưa đọc</div>
                            <div className="notifications-count">{unreadCount}</div>

                            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                <Button label="Xoá đã đọc" className="p-button-danger" onClick={handleDeleteRead} disabled={!notifications.some((n) => n.read)} aria-label="Xoá các thông báo đã đọc" />
                                <Button label="Lọc: Chưa đọc" className="p-button-outlined" onClick={() => setStatusFilter('unread')} />
                            </div>

                            <div style={{ marginTop: 12 }}>
                                {lastDeleted && (
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <div className="small-muted">Bạn vừa xoá 1 thông báo.</div>
                                        <Button label="Hoàn tác" onClick={undoDelete} />
                                    </div>
                                )}

                                {lastStateBeforeMarkAll && (
                                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <div className="small-muted">Bạn vừa đánh dấu tất cả.</div>
                                        <Button label="Hoàn tác" onClick={undoMarkAll} />
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
