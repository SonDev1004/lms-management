import React, { useRef, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card } from 'primereact/card';
import '../styles/EnrollmentChart.css';
import { enrollmentMock } from '../mocks/mockData.js';

const normalize = (raw) => {
    if (!raw) return null;

    if (raw.labels && Array.isArray(raw.labels)
        && Array.isArray(raw.newEnrollments) && Array.isArray(raw.completions)) {
        return raw;
    }

    const payload = raw.data || raw.payload || raw.result || raw;

    if (payload.labels && (payload.new_enrollments || payload.newEnrollments) && payload.completions) {
        return {
            labels: payload.labels,
            newEnrollments: payload.newEnrollments || payload.new_enrollments,
            completions: payload.completions,
        };
    }

    if (Array.isArray(payload) && payload.length && typeof payload[0] === 'object') {
        const labels = payload.map(r => r.label || r.month || r.date || '');
        const newEnrollments = payload.map(r => Number(r.new ?? r.newEnrollments ?? r.new_enrollments ?? r.new_enroll ?? 0));
        const completions = payload.map(r => Number(r.complete ?? r.completions ?? r.completion ?? r.completions_count ?? 0));
        return { labels, newEnrollments, completions };
    }

    return null;
};

export default function EnrollmentChart({
                                            data: propData = null,
                                            apiUrl = null,
                                            title = 'Enrollment Volume Over Time',
                                        }) {
    const chartRef = useRef(null);
    const [data, setData] = useState(propData);
    const [loading, setLoading] = useState(Boolean(apiUrl && !propData));
    const [error, setError] = useState(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        if (!apiUrl) return;
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(apiUrl, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(json => {
                const norm = normalize(json);
                if (norm) setData(norm);
                else {
                    const tryData = normalize(json.data || json.payload || json.result);
                    if (tryData) setData(tryData);
                    else {
                        setError('Invalid data format from API');
                        setData(null);
                    }
                }
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                setError(err.message || 'Fetch error');
                setData(null);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [apiUrl, retryKey]);

    const chartData = useMemo(() => {
        const labels = (data && data.labels) || [];
        const newEnrollments = (data && data.newEnrollments) || [];
        const completions = (data && data.completions) || [];

        const len = Math.max(labels.length, newEnrollments.length, completions.length, 0);
        const pad = (arr) => {
            const res = (arr || []).slice(0, len);
            while (res.length < len) res.push(0);
            return res;
        };

        return {
            labels: labels.length ? labels : [],
            datasets: [
                {
                    label: 'New Enrollments',
                    data: pad(newEnrollments),
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                },
                {
                    label: 'Completions',
                    data: pad(completions),
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                },
            ],
        };
    }, [data]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
            tooltip: { mode: 'index', intersect: false },
        },
        interaction: { mode: 'nearest', intersect: false },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#6b7280' } },
            y: { grid: { color: 'rgba(15,23,42,0.05)' }, ticks: { color: '#6b7280', beginAtZero: true } },
        },
    }), []);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || !chart.ctx) return;

        const applyGradient = () => {
            try {
                if (!chart.chartArea) return;
                const ctx = chart.ctx;
                const height = chart.chartArea.bottom - chart.chartArea.top || chart.height || 360;

                const g1 = ctx.createLinearGradient(0, 0, 0, height);
                g1.addColorStop(0, 'rgba(59,130,246,0.35)');
                g1.addColorStop(1, 'rgba(59,130,246,0.06)');

                const g2 = ctx.createLinearGradient(0, 0, 0, height);
                g2.addColorStop(0, 'rgba(16,185,129,0.30)');
                g2.addColorStop(1, 'rgba(16,185,129,0.05)');

                if (chart.data && chart.data.datasets?.[0]) {
                    chart.data.datasets[0].backgroundColor = g1;
                    chart.data.datasets[0].borderColor = '#3b82f6';
                    chart.data.datasets[0].pointBackgroundColor = '#fff';
                    chart.data.datasets[0].pointBorderColor = '#3b82f6';
                }
                if (chart.data && chart.data.datasets?.[1]) {
                    chart.data.datasets[1].backgroundColor = g2;
                    chart.data.datasets[1].borderColor = '#10b981';
                    chart.data.datasets[1].pointBackgroundColor = '#fff';
                    chart.data.datasets[1].pointBorderColor = '#10b981';
                }
                chart.update();
            } catch (e) {
            }
        };

        applyGradient();
        const t = setTimeout(applyGradient, 150);
        return () => clearTimeout(t);
    }, [chartData]);

    const hasData = (chartData.labels || []).length > 0;

    return (
        <Card className="big-card">
            <h3>{title}</h3>

            {loading ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>Loading chart...</div>
            ) : error ? (
                <div style={{ padding: 16, color: '#ef4444' }}>
                    <div style={{ marginBottom: 8 }}>Error: {error}</div>
                    {apiUrl && (
                        <div>
                            <button
                                onClick={() => {
                                    setRetryKey(k => k + 1);
                                }}
                                style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="chart-container" style={{ minHeight: 260 }} role="img" aria-label="Enrollment chart">
                    <Line
                        ref={chartRef}
                        data={hasData ? chartData : {
                            labels: enrollmentMock.labels,
                            datasets: [
                                { ...chartData.datasets[0], data: enrollmentMock.newEnrollments },
                                { ...chartData.datasets[1], data: enrollmentMock.completions },
                            ],
                        }}
                        options={options}
                    />
                </div>
            )}
        </Card>
    );
}

EnrollmentChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string),
        newEnrollments: PropTypes.arrayOf(PropTypes.number),
        completions: PropTypes.arrayOf(PropTypes.number),
    }),
    apiUrl: PropTypes.string,
    title: PropTypes.string,
};
