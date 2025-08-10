import React from 'react';
import './dashboard.css';

export default function CourseCard({ title = 'Course', progress = 0, finalTest = '-' }) {
    const pct = Math.max(0, Math.min(100, progress));

    return (
        <div className="course-card course-card--large">
            <div className="course-inner">
                <div className="left">
                    <h4 className="course-title">{title}</h4>

                    <div className="course-progress-wrap">
                        <div className="progress-pill" aria-hidden>
                            <div className="progress-pill-track">
                                <div className="progress-pill-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="progress-pill-label">{Math.round(pct)}%</div>
                        </div>

                        <div className="progress-text">{pct === 100 ? 'Completed' : `${Math.round(pct)}% completed`}</div>
                    </div>
                </div>

                <div className="right">
                    <button className="btn-cta btn-cta--big" aria-label="Continue Learning">
                        Continue
                        <br />
                        Learning
                    </button>
                    <div className="final-test">
                        Final test: <strong>{finalTest}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
