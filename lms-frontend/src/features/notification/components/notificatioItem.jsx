import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';

const TYPE_MAP = {
    assignment: {
        label: 'Assignment',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.1)',
        icon: 'pi-book'
    },
    event: {
        label: 'Event',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: 'pi-calendar'
    },
    feedback: {
        label: 'Feedback',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: 'pi-comments'
    },
    system: {
        label: 'System',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        icon: 'pi-cog'
    },
};

const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
};

const fmtDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just finished";
    if (minutes < 60) return `${minutes} MINUTES AGO`;
    if (hours < 24) return `${hours} HOURS AGO`;
    if (days < 7) return `${days} DAYS AGO`;
    return date.toLocaleDateString("vi-VN");
};

export default function NotificatioItem({ n, onOpen, onDelete }) {
    const isRead = !!n.isSeen;
    const message = n.content ?? "";
    const dateVal = n.postedDate ?? null;
    const t = TYPE_MAP[n.type] || {
        label: n.type || 'Khác',
        color: '#9ca3af',
        bgColor: 'rgba(156, 163, 175, 0.1)',
        icon: 'pi-info-circle'
    };

    const snippet = (msg, len = 120) => {
        const plain = stripHtml(msg || "");
        return plain.length > len ? plain.slice(0, len) + "…" : plain;
    };

    const avatarColor = isRead ? '#94a3b8' : '#3b82f6';

    return (
        <Card
            className="cursor-pointer transition-all transition-duration-200 hover:shadow-4"
            style={{
                borderLeft: `4px solid ${isRead ? '#e2e8f0' : t.color}`,
                background: isRead ? '#fafafa' : 'white',
                opacity: isRead ? 0.85 : 1
            }}
            onClick={() => onOpen?.(n)}
        >
            <div className="flex gap-3">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <Avatar
                            label={(n.sender || 'S')[0].toUpperCase()}
                            shape="circle"
                            size="xlarge"
                            style={{
                                background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}dd 100%)`,
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}
                        />
                        {!isRead && (
                            <div
                                className="absolute border-circle"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    background: '#ef4444',
                                    top: '0',
                                    right: '0',
                                    border: '2px solid white'
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                    <div className="flex justify-content-between align-items-start mb-2">
                        <div className="flex-1">
                            <div className="flex align-items-center gap-2 mb-1">
                                <h4 className="m-0 text-900 font-semibold line-height-3">
                                    {n.title}
                                </h4>
                                {!isRead && (
                                    <Badge
                                        value="NEW"
                                        severity="danger"
                                        style={{
                                            fontSize: '0.65rem',
                                            padding: '0.2rem 0.4rem'
                                        }}
                                    />
                                )}
                            </div>

                            <div className="flex align-items-center gap-2 text-sm text-600 mb-2 flex-wrap">
                                <span className="font-semibold">{n.sender}</span>
                                <span>•</span>
                                <span>{fmtDate(dateVal)}</span>
                                {n.course && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium">{n.course}</span>
                                    </>
                                )}
                            </div>

                            <p className="m-0 text-700 line-height-3">
                                {snippet(message)}
                            </p>
                        </div>

                        {/* Actions Section */}
                        <div
                            className="flex-shrink-0 ml-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-column gap-2 align-items-end">
                                <div
                                    className="flex align-items-center gap-2 px-2 py-1 border-round-lg"
                                    style={{
                                        background: t.bgColor,
                                        border: `1px solid ${t.color}30`
                                    }}
                                >
                                    <i className={`pi ${t.icon}`} style={{ color: t.color, fontSize: '0.9rem' }}></i>
                                    <span
                                        className="font-semibold text-sm"
                                        style={{ color: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                </div>

                                <div className="flex gap-1">
                                    <Button
                                        icon="pi pi-eye"
                                        rounded
                                        text
                                        severity="info"
                                        size="small"
                                        tooltip="See details"
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={() => onOpen?.(n)}
                                        aria-label={`View ${n.title}`}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        rounded
                                        text
                                        severity="danger"
                                        size="small"
                                        tooltip="Delete"
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.(n.id);
                                        }}
                                        aria-label={`Delete ${n.title}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}