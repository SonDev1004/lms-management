// src/pages/TuitionRevenueDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../styles/tokens.css";
import "../styles/dashboard.css";

import FilterBar from "../components/FilterBar";
import KPI from "../components/KPI";
import TransactionsTable from "../components/TransactionsTable";
import MonthlyRevenueChart from "../components/MonthlyRevenueChart";

import { fmtVND } from "../utils/format";
import {
    fetchMonthlyTransactions,
    fetchRevenueSummary,
} from "../api/tuitionRevenueApi";

/** Parse "MM/YYYY" -> { year, month } */
function parseMonthLabel(label) {
    const [mm, yyyy] = label.split("/");
    return { year: Number(yyyy), month: Number(mm) };
}

export default function TuitionRevenueDashboard() {
    // ===== FILTER STATE =====
    const [primaryMonth, setPrimaryMonth] = useState("09/2025");
    const [compareOn, setCompareOn] = useState(true);
    const [compareMonth, setCompareMonth] = useState("11/2025");

    const [status, setStatus] = useState("SUCCESS");
    const [programId, setProgramId] = useState(0);
    const [subjectId, setSubjectId] = useState(0);

    const [viewMode, setViewMode] = useState("table"); // table | chart

    // ===== DERIVED LABEL =====
    const monthLabel = useMemo(() => {
        const [mm, yyyy] = primaryMonth.split("/");
        const d = new Date(+yyyy, +mm - 1, 1);
        return d.toLocaleString("en-US", { month: "long", year: "numeric" });
    }, [primaryMonth]);

    // ===== DATA =====
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load data khi filter đổi
    useEffect(() => {
        let alive = true;
        const { year, month } = parseMonthLabel(primaryMonth);
        const filter = { year, month, status, programId, subjectId };

        (async () => {
            setLoading(true);
            try {
                const [txData, summaryData] = await Promise.all([
                    fetchMonthlyTransactions(filter),
                    fetchRevenueSummary(filter),
                ]);

                if (!alive) return;
                setRows(Array.isArray(txData) ? txData : []);
                setSummary(summaryData);
            } catch (err) {
                if (alive) {
                    console.error("[TuitionRevenue] load data failed:", err);
                    setRows([]);
                    setSummary(null);
                }
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [primaryMonth, status, programId, subjectId]);

    // ===== KPI =====
    const totalCollected = useMemo(() => {
        if (summary) return Number(summary.totalCollected || 0);
        return rows
            .filter((r) => r.status === "Success")
            .reduce((s, r) => s + (r.amount || 0), 0);
    }, [summary, rows]);

    const transactionsCount = summary
        ? summary.transactions ?? 0
        : rows.length;

    const avgTicket = useMemo(() => {
        if (summary) return Number(summary.avgTicket || 0);
        const successCount = rows.filter((r) => r.status === "Success").length;
        if (!successCount) return 0;
        return Math.round(totalCollected / successCount);
    }, [summary, rows, totalCollected]);

    const refundCount = summary
        ? summary.failedCount ?? 0
        : rows.filter((r) => r.status === "Failed").length;

    const refundAmount = useMemo(() => {
        if (summary) return Number(summary.refundAmount || 0);
        return rows
            .filter((r) => r.status === "Failed")
            .reduce((s, r) => s + (r.amount || 0), 0);
    }, [summary, rows]);

    // ===== CHART SERIES từ rows thật =====
    const chartSeries = useMemo(() => {
        if (!rows || !rows.length) return [];

        const byDay = new Map();

        rows.forEach((r) => {
            if (!r.date || r.status !== "Success") return;
            const d = new Date(r.date);
            if (Number.isNaN(d.getTime())) return;

            const day = d.getDate();
            const label = `${String(day).padStart(2, "0")}/${String(
                d.getMonth() + 1
            ).padStart(2, "0")}`;

            const prev = byDay.get(day) || { day, label, value: 0 };
            prev.value += r.amount || 0;
            byDay.set(day, prev);
        });

        return Array.from(byDay.values())
            .sort((a, b) => a.day - b.day)
            .map(({ label, value }) => ({ label, value }));
    }, [rows]);

    // ===== RENDER =====
    return (
        <div className="wrap">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <div className="title">AdminIT · Tuition Revenue Dashboard</div>
                    <div className="sub">
                        View and compare monthly tuition revenue with detailed analytics
                    </div>
                </div>

                {/* FilterBar */}
                <FilterBar
                    primaryMonth={primaryMonth}
                    setPrimaryMonth={setPrimaryMonth}
                    compareOn={compareOn}
                    setCompareOn={setCompareOn}
                    compareMonth={compareMonth}
                    setCompareMonth={setCompareMonth}
                    status={status}
                    setStatus={setStatus}
                    programId={programId}
                    setProgramId={setProgramId}
                    subjectId={subjectId}
                    setSubjectId={setSubjectId}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onExport={() => {}}
                />

                {/* Compare chips */}
                {compareOn && (
                    <div
                        style={{
                            marginTop: 24,
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <span className="chip gray">Month A: {monthLabel}</span>
                        <span className="chip gray">Month B: {compareMonth}</span>
                    </div>
                )}

                {/* KPI grid */}
                <div className="kpi-grid">
                    <KPI
                        tone="green"
                        value={fmtVND(totalCollected)}
                        label="Total Collected"
                    />
                    <KPI
                        tone="blue"
                        value={transactionsCount}
                        label="Transactions"
                    />
                    <KPI
                        tone="purple"
                        value={fmtVND(avgTicket)}
                        label="Avg. Ticket"
                    />
                    <KPI
                        tone="red"
                        value={refundCount}
                        label="Refunds"
                        extra={
                            <div style={{ color: "#9ca3af", fontWeight: 500 }}>
                                {fmtVND(refundAmount)}
                            </div>
                        }
                    />
                </div>

                {/* Chart / Table */}
                {viewMode === "chart" && (
                    <MonthlyRevenueChart series={chartSeries} />
                )}

                {viewMode === "table" && (
                    <div style={{ marginTop: 24 }}>
                        <TransactionsTable rows={rows} loading={loading} />
                    </div>
                )}

                <div className="footer-badge">Made by MGX</div>
            </div>
        </div>
    );
}
