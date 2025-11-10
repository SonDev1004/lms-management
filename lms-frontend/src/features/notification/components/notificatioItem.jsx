import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { formatDateShort } from '../utils/date';

const TYPE_MAP = {
    assignment: { label: 'Assignment', color: '#2563eb' },
    event: { label: 'Event', color: '#f97316' },
    feedback: { label: 'Feedback', color: '#7c3aed' },
    system: { label: 'System', color: '#6b7280' },
};

export default function NotificatioItem({ n, onOpen, onDelete }) {
    const t = TYPE_MAP[n.type] || { label: n.type, color: '#9ca3af' };
    const snippet = (msg, len = 120) => (msg && msg.length > len ? msg.slice(0, len) + '...' : msg);

    return (
        <div
            className={`notification-item ${n.read ? 'notification-read' : 'notification-unread'} border-${n.type}`}
            onClick={() => onOpen(n)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onOpen(n);
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`status-dot ${n.read ? 'dot-read' : 'dot-unread'}`} aria-hidden />
                <Avatar label={(n.sender || 'S')[0]} shape="circle" size="large" style={{ backgroundColor: '#556ee6', color: 'white' }} />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="notification-title" title={n.title}>
                                {n.title}
                            </div>
                            {!n.read && <div className="badge-new" aria-hidden> Mới </div>}
                        </div>
                        <div className="notification-meta" title={`${n.sender} • ${formatDateShort(n.date)}${n.course ? ` • ${n.course}` : ''}`}>
                            {n.sender} • {formatDateShort(n.date)}{n.course ? ` • ${n.course}` : ''}
                        </div>
                    </div>

                    <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                        <Chip label={t.label} className={`p-chip chip-${n.type}`} style={{ backgroundColor: t.color, color: 'white' }} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                            <Button icon="pi pi-eye" className="p-button-text p-button-sm" onClick={() => onOpen(n)} aria-label={`Xem ${n.title}`} />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-text p-button-sm p-button-danger"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!window.confirm('Are you sure want to delete?')) return;
                                    await onDelete(n.id);
                                }}
                                aria-label={`Delete ${n.title}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="notification-message">{snippet(n.message)}</div>
            </div>
        </div>
    );
}
