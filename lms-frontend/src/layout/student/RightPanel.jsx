import React from 'react';
import { Card } from 'primereact/card';
import './dashboard.css';

export default function RightPanel({
                                       title = 'IELTS 6.0',
                                       completed = null,
                                       total = null,
                                       teacher = null,
                                       lessons = null,
                                       examDay = null
                                   }) {
    const showNumber = (n) => (typeof n === 'number' && !Number.isNaN(n) ? n : 'N/A');
    const hasProgress = typeof completed === 'number' && typeof total === 'number' && total > 0;
    const pct = hasProgress ? Math.round((completed / total) * 100) : 0;

    return (
        <Card className="right-panel-card">
            <div className="right-panel-inner">
                <h4 className="rp-title">{title}</h4>

                <div className="rp-row">
                    <div className="rp-label">Teacher</div>
                    <div className="rp-value">{teacher || <span className="placeholder">Updating...</span>}</div>
                </div>

                <div className="rp-row">
                    <div className="rp-label">Completed</div>
                    <div className="rp-value">{showNumber(completed)} <span className="rp-sep">|</span> {showNumber(total)}</div>
                </div>

                {hasProgress && (
                    <div className="rp-progress-wrap" aria-hidden>
                        <div className="rp-progress-track">
                            <div className="rp-progress-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
                        </div>
                        <div className="rp-progress-pct">{pct}%</div>
                    </div>
                )}

                <div className="rp-row">
                    <div className="rp-label">Course lessons</div>
                    <div className="rp-value">{lessons ?? <span className="placeholder">N/A</span>}</div>
                </div>

                <div className="rp-row">
                    <div className="rp-label">Exam day</div>
                    <div className="rp-value">{examDay || <span className="placeholder">N/A</span>}</div>
                </div>
            </div>
        </Card>
    );
}
