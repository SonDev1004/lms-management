import React from 'react';
import './dashboard.css';

export default function AssignmentCard({
                                           id,
                                           title = 'Assignment',
                                           assignedDate = '-',
                                           progress = 0,
                                           score = null
                                       }) {
    const handleClick = () => {
        if (id) window.location.href = `/assignment/${id}`;
        else window.location.hash = '#score';
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') handleClick();
    };

    return (
        <div
            className="assignment-card"
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyPress={onKeyPress}
            aria-label={`Open ${title}`}
        >
            <div className="avatar">
                <div className="avatar-inner" />
            </div>

            <div className="content">
                <h4 className="assignment-title">{title}</h4>
                <div className="meta">
                    Assigned date: <span className="small-muted">{assignedDate}</span>
                </div>
            </div>

            <div className="right">
                <div className="progress-text">{Math.round(progress)}%</div>
                <div className="score-link">
                    <span className="score-pill">{score === null ? 'Score' : score}</span>
                </div>
            </div>
        </div>
    );
}
