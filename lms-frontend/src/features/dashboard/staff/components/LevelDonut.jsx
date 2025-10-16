import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card } from 'primereact/card';
import '../styles/LevelDonut.css';

export default function LevelDonut({ data, showStars = true, maxStars = 5 }) {
    const happyTokens = ['happy', 'satisfied', 'good'];

    function findHappyIndex(labels = []) {
        if (!labels) return -1;
        for (let i = 0; i < labels.length; i++) {
            const l = String(labels[i]).toLowerCase();
            if (happyTokens.some(tok => l.includes(tok))) return i;
        }
        return -1;
    }

    let happyCount = 0;
    let total = 0;
    let detectedLabel = null;
    let fallbackUsed = false;

    if (data && Array.isArray(data.values) && Array.isArray(data.labels)) {
        const labels = data.labels;
        const values = data.values.map(v => Number(v) || 0);
        total = values.reduce((s, x) => s + x, 0);
        const idx = findHappyIndex(labels);
        if (idx >= 0) {
            happyCount = values[idx];
            detectedLabel = labels[idx];
        } else {
            happyCount = values[0] || 0;
            detectedLabel = labels[0] || 'Label 0';
            fallbackUsed = true;
        }
    } else if (data && Array.isArray(data.feedbackList)) {
        const list = data.feedbackList;
        total = list.length;
        for (const item of list) {
            if (!item) continue;
            if (typeof item.rating === 'number') {
                if (item.rating >= 4) happyCount++;
                continue;
            }
            const text = (item.sentiment || item.status || item.feedback || '').toString().toLowerCase();
            if (text) {
                if (happyTokens.some(tok => text.includes(tok))) happyCount++;
            } else {
                if (typeof item.score === 'number') {
                    if (item.score >= 0.75) happyCount++;
                }
            }
        }
        detectedLabel = 'Feedback summary';
    } else {
        return (
            <Card className="ld-card">
                <h3 className="ld-title">Student Satisfaction Rate</h3>
                <p className="ld-empty">No valid data. Please provide <code>{'{ labels, values }'}</code> or <code>{'{ feedbackList }'}</code> format.</p>
            </Card>
        );
    }

    const ratio = total > 0 ? (happyCount / total) * 100 : 0;
    const ratioText = total > 0 ? `${Number(ratio.toFixed(0))}%` : '0%';

    const chartData = {
        labels: ['Satisfied', 'Others'],
        datasets: [
            {
                data: [happyCount, Math.max(0, total - happyCount)],
                hoverOffset: 6,
                backgroundColor: ['#2E8B57', '#E9ECEF'],
                borderWidth: 0
            }
        ]
    };

    const options = {
        plugins: { legend: { display: false } },
        cutout: '72%',
        maintainAspectRatio: false,
        animation: { duration: 400 }
    };

    const starValue = (ratio / 100) * maxStars;

    return (
        <Card className="ld-card">
            <h3 className="ld-title">Student Satisfaction Rate</h3>

            <div className="ld-chart-wrap">
                <div className="ld-chart-area">
                    <Doughnut data={chartData} options={options} />
                </div>

                <div className="ld-center">
                    <div className="ld-percent">{ratioText}</div>
                    <div className="ld-sub">{`${happyCount}/${total}`}</div>
                </div>
            </div>

            {showStars && (
                <div className="ld-stars-wrap" aria-hidden>
                    <StarRow value={starValue} max={maxStars} />
                </div>
            )}

            <div className="ld-legend">
                <div className="ld-legend-item">
                    <span className="ld-swatch" style={{ backgroundColor: '#2E8B57' }} />
                    <span>Satisfied</span>
                </div>
                <div className="ld-legend-item">
                    <span className="ld-swatch" style={{ backgroundColor: '#E9ECEF' }} />
                    <span>Others</span>
                </div>
            </div>

            <div className="ld-note">
                <small>
                    Source: summary of feedback from all courses.
                    {fallbackUsed ? ' — Note: using the first label as fallback.' : ''}
                </small>
            </div>
        </Card>
    );
}

function StarRow({ value = 0, max = 5 }) {
    const stars = [];
    for (let i = 0; i < max; i++) {
        const starIndex = i + 1;
        const fill = Math.min(Math.max(value - i, 0), 1);
        stars.push(<Star key={i} fill={fill} />);
    }

    return (
        <div className="ld-star-row">
            {stars}
            <div className="ld-star-text">{`${Number(value.toFixed(2))}/${max}`}</div>
        </div>
    );
}

function Star({ fill = 0 }) {
    const pct = Math.round(fill * 100);
    const clipId = `clip-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <svg className="ld-star" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <defs>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={`${pct}%`} height="100%" />
                </clipPath>
            </defs>

            <path
                d="M12 .587l3.668 7.431L23.6 9.75l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.336-8.794L.4 9.75l7.932-1.732L12 .587z"
                fill="#E9ECEF"
            />
            <g clipPath={`url(#${clipId})`}>
                <path
                    d="M12 .587l3.668 7.431L23.6 9.75l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.336-8.794L.4 9.75l7.932-1.732L12 .587z"
                    fill="#F6BD2A"
                />
            </g>
            <path
                d="M12 .587l3.668 7.431L23.6 9.75l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.336-8.794L.4 9.75l7.932-1.732L12 .587z"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="0.4"
            />
        </svg>
    );
}
