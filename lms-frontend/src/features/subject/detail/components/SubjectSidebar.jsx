import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

function formatVND(v) {
    if (v == null || isNaN(v)) return null;
    try {
        return new Intl.NumberFormat('vi-VN').format(Number(v)) + ' VND';
    } catch {
        return `${Number(v).toLocaleString('vi-VN')} VND`;
    }
}

function parseDateParts(dateStr) {
    // Hỗ trợ "MM/DD/YYYY", "YYYY-MM-DD", ISO
    if (!dateStr) return { day: '--', dow: '' };
    const tryParse = new Date(dateStr);
    if (!isNaN(tryParse)) {
        const day = String(tryParse.getDate()).padStart(2, '0');
        const dow = tryParse.toLocaleDateString('en-US', { weekday: 'short' });
        return { day, dow };
    }
    // fallback MM/DD
    const segs = dateStr.split('/');
    const day = segs[1] || '--';
    return { day, dow: '' };
}

export default function SubjectSidebar({ subject, onSelectUpcoming }) {
    if (!subject) return null;

    const duration =
        subject.duration ??
        (subject.sessionNumber ? `${Math.ceil(subject.sessionNumber / 2)} weeks` : '8 weeks');

    const sessionsPerWeek = subject.sessionsPerWeek ?? '2 sessions/week';
    const mode = subject.mode ?? 'Hybrid';

    const feeRange =
        subject.feeRange ??
        (formatVND(subject.fee) || '3.2–4.2M VND');

    const upcomings = useMemo(() => {
        return (subject.classes ?? [])
            .slice(0, 4)
            .map((c, i) => {
                const parts = parseDateParts(c.startDate);
                return {
                    id: c.courseId ?? i,
                    day: parts.day,
                    dow: c.day || parts.dow || '',
                    time: c.schedule || '',
                    raw: c,
                };
            });
    }, [subject?.classes]);

    return (
        <aside className="sd-aside" aria-label="Subject sidebar">
            {/* Quick Facts */}
            <div className="sd-aside__card">
                <h4 className="sd-h4" style={{ marginTop: 0 }}>Quick Facts</h4>
                <ul className="sd-facts" role="list">
                    <li>
                        <i className="pi pi-clock" aria-hidden />
                        <span>Duration</span>
                        <b className="sd-val">{duration}</b>
                    </li>
                    <li>
                        <i className="pi pi-users" aria-hidden />
                        <span>Sessions</span>
                        <b className="sd-val">{sessionsPerWeek}</b>
                    </li>
                    <li>
                        <i className="pi pi-map-marker" aria-hidden />
                        <span>Mode</span>
                        <b className="sd-val">{mode}</b>
                    </li>
                    <li>
                        <i className="pi pi-dollar" aria-hidden />
                        <span>Fee range</span>
                        <b className="sd-val">{feeRange}</b>
                    </li>
                </ul>
            </div>

            {/* Upcoming Sessions */}
            <div className="sd-aside__card">
                <h4 className="sd-h4" style={{ marginTop: 0 }}>Upcoming Sessions</h4>
                <div className="sd-dates">
                    {upcomings.length ? (
                        upcomings.map(u => (
                            <button
                                key={u.id}
                                className="sd-date"
                                type="button"
                                onClick={() => onSelectUpcoming?.(u.raw)}
                                aria-label={`Session ${u.dow ? u.dow + ' ' : ''}${u.time || ''}`}
                            >
                                <div className="sd-date__day">{u.day}</div>
                                <div className="sd-date__meta">
                                    {u.dow}
                                    <span>{u.time}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-600">No upcoming sessions.</div>
                    )}
                </div>
            </div>

            {/* Need Help */}
            <div className="sd-aside__card">
                <h4 className="sd-h4" style={{ marginTop: 0 }}>Need Help?</h4>
                <div className="sd-help">
                    <div>
                        <i className="pi pi-phone" aria-hidden />{' '}
                        <a href="tel:+84123456789">+84 123 456 789</a>
                    </div>
                    <div>
                        <i className="pi pi-envelope" aria-hidden />{' '}
                        <a href="mailto:support@example.com">support@example.com</a>
                    </div>
                </div>
            </div>
        </aside>
    );
}

SubjectSidebar.propTypes = {
    subject: PropTypes.object,
    onSelectUpcoming: PropTypes.func,
};
