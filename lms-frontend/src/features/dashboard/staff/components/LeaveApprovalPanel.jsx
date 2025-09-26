import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RecentActivity from './RecentActivity.jsx';
import UpcomingActivities from './UpcomingActivities.jsx';
import '../styles/LeaveApprovalPanel.css';

export default function LeaveApprovalPanel({
                                               recent = [],
                                               upcoming = [],
                                               leaveRequests = [],
                                               onApprove = () => {},
                                               onReject = () => {}
                                           }) {
    const [requests, setRequests] = useState(() =>
        (leaveRequests || []).map((r, i) => ({
            id: r.id ?? i,
            teacherName: r.teacherName || r.staff || r.name || 'Không rõ',
            date: r.date || r.from || r.startDate || null,
            reason: r.reason || '',
            status: (r.status || 'pending').toLowerCase()
        }))
    );

    const updateStatus = (id, newStatus) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleApprove = (id) => {
        const req = requests.find(r => r.id === id);
        if (!req) return;
        updateStatus(id, 'approved');
        onApprove({ ...req, status: 'approved' });
    };

    const handleReject = (id) => {
        const req = requests.find(r => r.id === id);
        if (!req) return;
        const ok = window.confirm('Bạn có chắc muốn từ chối đơn này?');
        if (!ok) return;
        updateStatus(id, 'rejected');
        onReject({ ...req, status: 'rejected' });
    };

    const formatDate = (d) => d || '-';

    // đặt các đơn pending lên đầu
    const sorted = requests.slice().sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return a.id - b.id;
    });

    return (
        <aside className="leave-sidebar">
            <div className="leave-section">
                <RecentActivity items={recent} />
            </div>

            <div className="leave-section">
                <UpcomingActivities items={upcoming} />
            </div>

            <div className="leave-section leave-approval">
                <div className="leave-card">
                    <div className="leave-card-header">
                        <h3>Phê duyệt nghỉ phép giáo viên</h3>
                        <small className="leave-sub">Các đơn chờ xử lý ở trên cùng</small>
                    </div>

                    <ul className="leave-request-list">
                        {sorted.length === 0 && (
                            <li className="leave-empty">Không có đơn nào.</li>
                        )}

                        {sorted.map(r => (
                            <li key={r.id} className={`leave-request ${r.status}`}>
                                <div className="leave-request-main">
                                    <div className="leave-request-title">
                                        <strong className="teacher-name">{r.teacherName}</strong>
                                        <span className={`leave-status ${r.status}`}>
                                            {r.status[0].toUpperCase() + r.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="leave-request-meta">
                                        <div className="leave-date">{formatDate(r.date)}</div>
                                        {r.reason && <div className="leave-reason">Lý do: {r.reason}</div>}
                                    </div>
                                </div>

                                <div className="leave-request-actions">
                                    {r.status === 'pending' ? (
                                        <>
                                            <button className="btn-approve" onClick={() => handleApprove(r.id)}>Duyệt</button>
                                            <button className="btn-reject" onClick={() => handleReject(r.id)}>Từ chối</button>
                                        </>
                                    ) : (
                                        <div className="leave-done-note">{r.status === 'approved' ? 'Approved' : 'Rejected'}</div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}

LeaveApprovalPanel.propTypes = {
    recent: PropTypes.array,
    upcoming: PropTypes.array,
    leaveRequests: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any,
        staff: PropTypes.string,
        teacherName: PropTypes.string,
        date: PropTypes.string,
        reason: PropTypes.string,
        status: PropTypes.oneOf(['pending', 'approved', 'rejected'])
    })),
    onApprove: PropTypes.func,
    onReject: PropTypes.func
};
