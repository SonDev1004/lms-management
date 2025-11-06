import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Index.css';

export default function SummaryPills({ stats = {}, entity }) {
    const detected =
        entity ||
        (('avgEnrollment' in stats) || ('fillRate' in stats) ? 'courses' : 'students');

    const total =
        stats.total ??
        stats.totalStudents ??
        stats.totalCourses ??
        stats.count ??
        0;

    const active =
        stats.active ??
        stats.activeStudents ??
        stats.activeCourses ??
        0;

    const inactive =
        stats.inactive ??
        stats.inactiveStudents ??
        stats.inactiveCourses ??
        Math.max(Number(total) - Number(active), 0);
    const metricValue =
        detected === 'courses'
            ? (stats.avgEnrollment ?? stats.fillRate ?? 0)
            : (stats.avgScore ?? stats.averageScore ?? stats.avg ?? 0);

    const labels =
        detected === 'courses'
            ? {
                total: 'Total Courses',
                active: 'Active Courses',
                inactive: 'Inactive Courses',
                metric: 'Avg Enrollment',
            }
            : {
                total: 'Total Students',
                active: 'Active Students',
                inactive: 'Inactive Students',
                metric: 'Average Score',
            };
    const isPercent =
        detected === 'students' || (metricValue <= 1 ? true : metricValue > 1);

    const displayMetric =
        metricValue <= 1 ? (metricValue * 100) : metricValue;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="small-muted">{labels.total}</div>
                <div className="value-big">{Number(total) || 0}</div>
            </div>
            <div className="stat-card">
                <div className="small-muted">{labels.active}</div>
                <div className="value-big" style={{ color: '#10b981' }}>
                    {Number(active) || 0}
                </div>
            </div>
            <div className="stat-card">
                <div className="small-muted">{labels.inactive}</div>
                <div className="value-big" style={{ color: '#ef4444' }}>
                    {Number(inactive) || 0}
                </div>
            </div>
            <div className="stat-card">
                <div className="small-muted">{labels.metric}</div>
                <div className="value-big" style={{ color: '#2563eb' }}>
                    {Number(displayMetric || 0).toFixed(1)}{isPercent ? '%' : ''}
                </div>
            </div>
        </div>
    );
}

SummaryPills.propTypes = {
    stats: PropTypes.object,
    entity: PropTypes.oneOf(['students', 'courses']),
};
