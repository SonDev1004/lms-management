import React from 'react';

export default function ProgressItem({ label, value, grade }) {
    return (
        <div className="sp-prog-item">
            <div className="sp-prog-row">
                <div className="sp-prog-label">{label}</div>
                {!!grade && <span className="sp-grade-badge">{grade}</span>}
            </div>
            <div className="sp-prog-bar">
                <div className="sp-prog-fill" style={{ width: `${value ?? 0}%` }} />
            </div>
            <div className="sp-prog-sub">{value ?? 0}% Complete</div>
        </div>
    );
}
