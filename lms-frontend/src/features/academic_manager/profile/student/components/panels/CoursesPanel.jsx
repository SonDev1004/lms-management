import React from 'react';

export default function CoursesPanel({ courses }) {
    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <span><i className="pi pi-book sp-ic" /> Enrolled Courses</span>
            </div>
            <div className="sp-progress-list">
                {courses.map((c) => (
                    <div key={c.code} style={{ marginBottom: 18 }}>
                        <div className="sp-prog-row">
                            <div className="sp-prog-label">{c.code}</div>
                            {!!c.letter && <span className="sp-grade-badge">{c.letter}</span>}
                        </div>
                        <div className="sp-prog-bar">
                            <div className="sp-prog-fill" style={{ width: `${c.progress ?? 0}%` }} />
                        </div>
                        <div className="sp-prog-sub">{c.progress ?? 0}% Complete</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
