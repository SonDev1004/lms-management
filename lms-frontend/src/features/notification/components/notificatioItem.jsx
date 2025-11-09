import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

const TYPE_MAP = {
    assignment: { label: 'Assignment', color: '#2563eb' },
    event:      { label: 'Event',      color: '#f97316' },
    feedback:   { label: 'Feedback',   color: '#7c3aed' },
    system:     { label: 'System',     color: '#6b7280' },
};

const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
};
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN") : "");

export default function NotificatioItem({ n, onOpen, onDelete }) {
    const isRead  = !!n.isSeen;
    const message = n.content ?? "";
    const dateVal = n.postedDate ?? null;
    const t = TYPE_MAP[n.type] || { label: (n.type || 'System'), color: '#9ca3af' };

    const snippet = (msg, len = 140) => {
        const plain = stripHtml(msg || "");
        return plain.length > len ? plain.slice(0, len) + "…" : plain;
    };

    return (
        <div
            className={`notification-item ${isRead ? 'notification-read' : 'notification-unread'} border-${n.type}`}
            onClick={() => onOpen?.(n)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(n); }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`status-dot ${isRead ? 'dot-read' : 'dot-unread'}`} aria-hidden />
                <Avatar label={(n.sender || 'S')[0]} shape="circle" size="large" style={{ backgroundColor: '#556ee6', color: 'white' }} />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="notification-title" title={n.title}>{n.title}</div>
                            {!isRead && <div className="badge-new">Mới</div>}
                        </div>
                        <div className="notification-meta">
                            {n.sender} • {fmtDate(dateVal)}{n.course ? ` • ${n.course}` : ''}
                        </div>
                    </div>

                    <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                        <Chip label={t.label.toUpperCase()} className={`p-chip chip-${n.type}`} style={{ backgroundColor: t.color, color: 'white' }} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                            <Button icon="pi pi-eye" className="p-button-text p-button-sm" onClick={() => onOpen?.(n)} aria-label={`Xem ${n.title}`} />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-text p-button-sm p-button-danger"
                                onClick={(e) => { e.stopPropagation(); onDelete?.(n.id); }}
                                aria-label={`Delete ${n.title}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="notification-message">{snippet(message)}</div>
            </div>
        </div>
    );
}
