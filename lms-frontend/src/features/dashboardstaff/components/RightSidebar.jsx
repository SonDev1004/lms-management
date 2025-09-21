import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RecentActivity from './RecentActivity';
import UpcomingActivities from './UpcomingActivities';
import '../styles/RightSidebar.css';

export default function RightSidebar({ recent = [], upcoming = [], tasks = [] }){
    const [taskState, setTaskState] = useState(() => tasks.map((t, i) => ({ id: t.id ?? i, title: t.title, level: t.level || 'low', done: !!t.done })));

    const toggle = (id) => {
        setTaskState(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    return (
        <aside className="rs-sidebar">
            <div className="rs-section">
                <RecentActivity items={recent} />
            </div>

            <div className="rs-section">
                <UpcomingActivities items={upcoming} />
            </div>

            <div className="rs-section rs-priority">
                <div className="rs-card">
                    <div className="rs-card-header">
                        <h3>Priority Tasks</h3>
                    </div>
                    <ul className="rs-task-list">
                        {taskState.map(t => (
                            <li key={t.id} className={`rs-task ${t.done ? 'done' : ''}`}>
                                <label className="rs-task-row">
                                    <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                                    <span className="rs-task-title">{t.title}</span>
                                </label>
                                <span className={`rs-badge ${t.level}`}>{t.level[0].toUpperCase() + t.level.slice(1)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}

RightSidebar.propTypes = {
    recent: PropTypes.array,
    upcoming: PropTypes.array,
    tasks: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.any, title: PropTypes.string, level: PropTypes.string, done: PropTypes.bool }))
};
