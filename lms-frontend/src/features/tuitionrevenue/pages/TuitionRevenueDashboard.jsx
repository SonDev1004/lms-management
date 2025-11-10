import React, { useMemo, useState } from "react";
import "../styles/tokens.css";
import "../styles/dashboard.css";
import FilterBar from "../components/FilterBar";
import KPI from "../components/KPI";
import TransactionsTable from "../components/TransactionsTable";
import { fmtVND } from "../utils/format";
import { buildMonthSeries, buildTransactions } from "../mocks/data";

export default function TuitionRevenueDashboard() {
    // ======= Filters state =======
    const [primaryMonth, setPrimaryMonth] = useState("06/2025");
    const [compareOn, setCompareOn] = useState(true);
    const [compareMonth, setCompareMonth] = useState("11/2025");

    // ======= Derived labels / data =======
    const monthLabel = useMemo(() => {
        const [mm, yyyy] = primaryMonth.split("/");
        const d = new Date(+yyyy, +mm - 1, 1);
        return d.toLocaleString("en-US", { month: "long", year: "numeric" });
    }, [primaryMonth]);

    const series = useMemo(() => buildMonthSeries(monthLabel), [monthLabel]);

    const rows = useMemo(() => buildTransactions(50), []);

    const totalCollected = useMemo(
        () => rows.filter(r => r.status === "Success").reduce((s, r) => s + r.amount, 0),
        [rows]
    );
    const transactionsCount = rows.length;
    const avgTicket = Math.round(
        totalCollected / Math.max(1, rows.filter(r => r.status === "Success").length)
    );
    const refundCount = rows.filter(r => r.status === "Failed").length;
    const refundAmount = rows
        .filter(r => r.status === "Failed")
        .reduce((s, r) => s + r.amount, 0);

    return (
        <div className="wrap">
            <div className="container">
                <div className="header">
                    <div className="title">AdminIT · Tuition Revenue Dashboard</div>
                    <div className="sub">View and compare monthly tuition revenue with detailed analytics</div>
                </div>

                <FilterBar
                    primaryMonth={primaryMonth}
                    setPrimaryMonth={setPrimaryMonth}
                    compareOn={compareOn}
                    setCompareOn={setCompareOn}
                    compareMonth={compareMonth}
                    setCompareMonth={setCompareMonth}
                    onExport={() => {
                    }}
                />

                {compareOn && (
                    <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span className="chip gray">Month A: {monthLabel}</span>
                        <span className="chip gray">Month B: {compareMonth}</span>
                    </div>
                )}

                <div className="kpi-grid">
                    <KPI tone="green" value={fmtVND(totalCollected)} label="Total Collected" />
                    <KPI tone="blue" value={transactionsCount} label="Transactions" />
                    <KPI tone="purple" value={fmtVND(avgTicket)} label="Avg. Ticket" />
                    <KPI
                        tone="red"
                        value={refundCount}
                        label="Refunds"
                        extra={<div style={{ color: "#9ca3af", fontWeight: 500 }}>{fmtVND(refundAmount)}</div>}
                    />
                </div>

                <div style={{ marginTop: 24 }}>
                    <TransactionsTable rows={rows} />
                </div>

                <div className="footer-badge">Made by MGX</div>
            </div>
        </div>
    );
}
