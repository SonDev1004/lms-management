import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import NotificatioItem from './notificatioItem.jsx';
import NotificationDetailDialog from './dialogs/notificationDetailDialog.jsx';

export default function NotificationList({ notifications = [], loading, onMarkRead, onDelete }) {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(6);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const openDetail = (n) => {
        setSelected(n);
        setOpen(true);
        if (!n.read) onMarkRead(n.id);
    };

    const handlePageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    return (
        <div>
            <Card className="notifications-card">
                {loading ? (
                    <div style={{ padding: 24, textAlign: 'center' }}>Đang tải...</div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center' }}>Không có thông báo.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {notifications.slice(first, first + rows).map((n) => (
                            <NotificatioItem key={n.id} n={n} onOpen={openDetail} onDelete={onDelete} />
                        ))}
                    </div>
                )}

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Paginator first={first} rows={rows} totalRecords={notifications.length} onPageChange={handlePageChange} />
                </div>
            </Card>

            <NotificationDetailDialog visible={open} onHide={() => setOpen(false)} notification={selected} onDelete={onDelete} />
        </div>
    );
}
