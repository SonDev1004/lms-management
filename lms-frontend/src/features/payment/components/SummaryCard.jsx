import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { formatAmount } from '@/features/payment/utils/money';

const getClassStatusSeverity = (name = '') => {
    const s = name.toLowerCase();
    if (s.includes('đang')) return 'success';
    if (s.includes('khai')) return 'info';
    if (s.includes('kết')) return 'secondary';
    return 'info';
};

export default function SummaryCard({ selectedItem = {}, basePrice = 0 }) {
    const title = selectedItem.title || selectedItem.name || 'Course';

    return (
        <Card className="card-left">
            <div className="left-top">
                <h3 className="left-title">{title}</h3>
                <div className="left-price">
                    <span className="amount">{formatAmount(basePrice)}</span>
                    <span className="currency">VND</span>
                </div>
            </div>

            <Divider className="my-4" />

            {selectedItem.type === 'subject' && selectedItem.meta?.subject && (
                <ul className="left-spec">
                    <li>
                        <span>Mã lịch học:</span>
                        <strong>{selectedItem.meta?.class?.schedule || 'MON-WED-FRI'}</strong>
                    </li>
                    <li>
                        <span>Mã khóa học:</span>
                        <strong>{selectedItem.meta.subject.code || '--'}</strong>
                    </li>
                    <li>
                        <span>Tổng số buổi:</span>
                        <strong>{selectedItem.meta.subject.sessionNumber ?? 0} buổi</strong>
                    </li>
                    {!!selectedItem.meta?.class?.statusName && (
                        <li>
                            <span>Trạng thái:</span>
                            <Tag
                                value={selectedItem.meta.class.statusName}
                                severity={getClassStatusSeverity(selectedItem.meta.class.statusName)}
                            />
                        </li>
                    )}
                </ul>
            )}

            {selectedItem.type === 'program' && selectedItem.meta?.track && (
                <ul className="left-spec">
                    <li><span>Lịch học:</span><strong>{selectedItem.meta.track.label}</strong></li>
                    <li><span>Số khóa:</span><strong>{selectedItem.meta.aggregate?.courseCount ?? 0}</strong></li>
                    <li><span>Tổng số buổi:</span><strong>{selectedItem.meta.aggregate?.totalSessions ?? 0}</strong></li>
                </ul>
            )}

            <ul className="left-list">
                <li><i className="pi pi-users" /> Age 3–16</li>
                <li><i className="pi pi-globe" /> Online/Offline</li>
                <li><i className="pi pi-chart-line" /> Max 12 students</li>
                <li><i className="pi pi-shield" /> Hoàn tiền 100%</li>
                <li><i className="pi pi-lock" /> Thanh toán bảo mật</li>
            </ul>
        </Card>
    );
}
