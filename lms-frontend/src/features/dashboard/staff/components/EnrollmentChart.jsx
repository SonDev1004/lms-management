import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Card } from "primereact/card";
import "../styles/EnrollmentChart.css";
import { enrollmentMock } from "../mocks/mockData.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const normalize = (raw) => {
    if (!raw) return null;

    if (raw.labels && Array.isArray(raw.newEnrollments) && Array.isArray(raw.completions)) {
        return raw;
    }

    const payload = raw.data || raw.payload || raw.result || raw;

    if (payload?.labels && (payload.newEnrollments || payload.new_enrollments) && payload.completions) {
        return {
            labels: payload.labels,
            newEnrollments: payload.newEnrollments || payload.new_enrollments,
            completions: payload.completions,
        };
    }

    if (Array.isArray(payload) && payload.length && typeof payload[0] === "object") {
        return {
            labels: payload.map((r) => r.label || r.month || r.date || ""),
            newEnrollments: payload.map((r) =>
                Number(r.new ?? r.newEnrollments ?? r.new_enrollments ?? r.new_enroll ?? 0)
            ),
            completions: payload.map((r) =>
                Number(r.complete ?? r.completions ?? r.completion ?? r.completions_count ?? 0)
            ),
        };
    }

    return null;
};

export default function EnrollmentChart({ data: propData = null, apiUrl = null, title = "Enrollment Volume Over Time" }) {
    const chartRef = useRef(null);
    const [data, setData] = useState(propData);
    const [loading, setLoading] = useState(Boolean(apiUrl && !propData));
    const [error, setError] = useState(null);
    const [retryKey, setRetryKey] = useState(0);
//api
    useEffect(() => {
        if (!apiUrl) return;
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(apiUrl, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                const norm = normalize(json) || normalize(json.data || json.payload || json.result);
                if (norm) setData(norm);
                else throw new Error("Invalid data format from API");
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Fetch error");
                    setData(null);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [apiUrl, retryKey]);
//chart
    const chartData = useMemo(() => {
        const labels = data?.labels ?? [];
        const newEnrollments = data?.newEnrollments ?? [];
        const completions = data?.completions ?? [];
        const len = Math.max(labels.length, newEnrollments.length, completions.length);

        const pad = (arr) => [...(arr || []).slice(0, len), ...Array(len - (arr?.length || 0)).fill(0)];

        return {
            labels,
            datasets: [
                { label: "New Enrollments", data: pad(newEnrollments), tension: 0.3, pointRadius: 3 },
                { label: "Completions", data: pad(completions), tension: 0.3, pointRadius: 3 },
            ],
        };
    }, [data]);
//chart opitions
    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom", labels: { boxWidth: 12, usePointStyle: true } },
                tooltip: { mode: "index", intersect: false },
            },
            interaction: { mode: "nearest", intersect: false },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#6b7280" } },
                y: { grid: { color: "rgba(15,23,42,0.05)" }, ticks: { color: "#6b7280", beginAtZero: true } },
            },
        }),
        []
    );
//bg
    const applyGradient = useCallback(() => {
        const chart = chartRef.current;
        if (!chart?.ctx || !chart.chartArea) return;

        const { ctx, chartArea } = chart;
        const height = chartArea.bottom - chartArea.top || chart.height || 360;

        const gradients = [
            { color: "#3b82f6", stops: ["rgba(59,130,246,0.35)", "rgba(59,130,246,0.06)"] },
            { color: "#10b981", stops: ["rgba(16,185,129,0.30)", "rgba(16,185,129,0.05)"] },
        ];

        gradients.forEach((g, i) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, g.stops[0]);
            gradient.addColorStop(1, g.stops[1]);
            if (chart.data.datasets[i]) {
                chart.data.datasets[i].backgroundColor = gradient;
                chart.data.datasets[i].borderColor = g.color;
                chart.data.datasets[i].pointBackgroundColor = "#fff";
                chart.data.datasets[i].pointBorderColor = g.color;
            }
        });

        chart.update();
    }, []);

    useEffect(() => {
        applyGradient();
        const t = setTimeout(applyGradient, 150);
        return () => clearTimeout(t);
    }, [chartData, applyGradient]);

    const hasData = (chartData.labels || []).length > 0;

    return (
        <Card className="big-card">
            <h3>{title}</h3>

            {loading ? (
                <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>Loading chart...</div>
            ) : error ? (
                <div style={{ padding: 16, color: "#ef4444" }}>
                    <div style={{ marginBottom: 8 }}>Error: {error}</div>
                    {apiUrl && (
                        <button onClick={() => setRetryKey((k) => k + 1)} style={{ padding: "6px 10px", borderRadius: 6 }}>
                            Retry
                        </button>
                    )}
                </div>
            ) : (
                <div className="chart-container" style={{ minHeight: 260 }} role="img" aria-label="Enrollment chart">
                    <Line
                        ref={chartRef}
                        data={
                            hasData
                                ? chartData
                                : {
                                    labels: enrollmentMock.labels,
                                    datasets: [
                                        { ...chartData.datasets[0], data: enrollmentMock.newEnrollments },
                                        { ...chartData.datasets[1], data: enrollmentMock.completions },
                                    ],
                                }
                        }
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
