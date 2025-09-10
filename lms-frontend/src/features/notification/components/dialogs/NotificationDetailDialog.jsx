// src/components/dialogs/NotificationDetailDialog.jsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { formatDateShort } from '../../utils/date';

const TYPE_MAP = {
    assignment: { label: 'Bài tập', color: '#2563eb' },
    event: { label: 'Sự kiện', color: '#f97316' },
    feedback: { label: 'Phản hồi', color: '#7c3aed' },
    system: { label: 'Hệ thống', color: '#6b7280' },
};

export default function NotificationDetailDialog({ visible, onHide, notification, onDelete }) {
    return (
        <Dialog
            header={
                notification ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar label={(notification.sender || 'S')[0]} shape="circle" style={{ backgroundColor: '#556ee6', color: 'white' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{notification.title}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                                {notification.sender} • {formatDateShort(notification.date)}
                                {notification.course ? ` • ${notification.course}` : ''}
                            </div>
                        </div>
                        {notification.type && <Chip label={TYPE_MAP[notification.type]?.label || notification.type} style={{ backgroundColor: TYPE_MAP[notification.type]?.color || '#9ca3af', color: 'white' }} />}
                    </div>
                ) : (
                    'Chi tiết'
                )
            }
            visible={visible}
            style={{ width: '46vw', maxWidth: 900 }}
            onHide={onHide}
        >
            {notification ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ color: '#374151', lineHeight: 1.6 }}>{notification.message}</div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button label="Đóng" className="p-button-text" onClick={onHide} />
                        <Button
                            label="Xoá"
                            icon="pi pi-trash"
                            onClick={async () => {
                                if (!window.confirm('Bạn có chắc muốn xoá?')) return;
                                await onDelete(notification.id);
                                onHide();
                            }}
                        />
                    </div>
                </div>
            ) : null}
        </Dialog>
    );
}
