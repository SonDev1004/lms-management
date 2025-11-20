import React, { useMemo, useState } from "react";
import { fmtVND, shortDate, exportCSV } from "../utils/format";

function CopyTxn({ text }) {
    const [copied, setCopied] = useState(false);
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {}
    };
    return (
        <button className={`copy ${copied ? "is-copied" : ""}`} onClick={onCopy} title="Copy TranNo">
            <span className="mono">{text}</span>
            <span aria-hidden style={{ marginLeft: 6 }}>{copied ? "✅" : "📋"}</span>
        </button>
    );
}

export default function TransactionsTable({ rows }) {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({ key: "date", dir: "desc" });

    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        const base = kw
            ? rows.filter(
                (r) =>
                    r.student.toLowerCase().includes(kw) ||
                    r.program.toLowerCase().includes(kw) ||
                    r.subject.toLowerCase().includes(kw) ||
                    r.bank.toLowerCase().includes(kw) ||
                    r.method.toLowerCase().includes(kw) ||
                    r.tranNo.toLowerCase().includes(kw) ||
                    r.orderInfo.toLowerCase().includes(kw)
            )
            : rows;

        const sorted = [...base].sort((a, b) => {
            const va = a[sort.key];
            const vb = b[sort.key];
            if (va === vb) return 0;
            const t = va > vb ? 1 : -1;
            return sort.dir === "asc" ? t : -t;
        });

        return sorted;
    }, [rows, q, sort]);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const view = filtered.slice(start, start + pageSize);
    const pages = Math.max(1, Math.ceil(total / pageSize));

    const toggleSort = (key) =>
        setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

    const Th = ({ children, k }) => (
        <th
            onClick={() => toggleSort(k)}
            className={sort.key === k ? "sorted" : ""}
            style={{ cursor: "pointer", userSelect: "none" }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {children}
                <span style={{ color: "#9ca3af" }}>
          {sort.key === k ? (sort.dir === "asc" ? "↑" : "↓") : "↕︎"}
        </span>
            </div>
        </th>
    );

    return (
        <div className="card p-6">
            {/* Header toolbar */}
            <div className="toolbar">
                <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
                    Transaction Details{" "}
                    <span style={{ color: "#6b7280", fontWeight: 500 }}>({total} transactions)</span>
                </div>
                <button className="btn" onClick={() => exportCSV(filtered)} title="Export CSV">
                    ⬇️ Export CSV
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 16 }}>
                <input
                    className="search"
                    placeholder="Search transactions..."
                    value={q}
                    onChange={(e) => {
                        setQ(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <table className="table no-horizontal-scroll">
                <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "7%"  }} />
                </colgroup>

                <thead>
                <tr>
                    <Th k="date">Date</Th>
                    <Th k="student">Student</Th>
                    <Th k="program">Program → Subject</Th>
                    <Th k="amount">Amount</Th>
                    <Th k="method">Method / Bank</Th>
                    <Th k="tranNo">TranNo</Th>
                    <Th k="status">Status</Th>
                </tr>
                </thead>

                <tbody>
                {view.map((r) => (
                    <tr key={r.id}>
                        <td>{shortDate(r.date)}</td>

                        <td>
                            <div className="cell-title">{r.student}</div>
                            <div className="cell-sub">{r.code}</div>
                        </td>

                        <td>
                            <div className="cell-title">{r.program}</div>
                            <div className="cell-sub">{r.subject}</div>
                        </td>

                        <td className="amount nowrap">
                            <strong className="mono">{fmtVND(r.amount)}</strong>
                            <small>đ</small>
                        </td>

                        <td className="mb-col">
                            <div className="mb-line nowrap">
                  <span className="nowrap" role="img" aria-label={r.method}>
                    {r.method === "Cash" ? "💵" : r.method === "Credit Card" ? "💳" : "🏧"}
                  </span>
                                <span className="nowrap"> {r.method}</span>
                            </div>
                            <div className="mb-line nowrap">
                                <span className="nowrap" role="img" aria-label={r.bank}>🏦</span>
                                <span className="nowrap"> {r.bank}</span>
                            </div>
                        </td>

                        <td className="tran-no nowrap">
                            <CopyTxn text={r.tranNo} />
                        </td>

                        <td>
                            {r.status === "Success" ? (
                                <span className="chip green"><span className="dot" />Success</span>
                            ) : (
                                <span className="chip red"><span className="dot" />Failed</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="row-end">
                <div style={{ fontSize: 14, color: "#6b7280" }}>Rows:</div>
                <select
                    className="rows-select"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(+e.target.value);
                        setPage(1);
                    }}
                >
                    {[10, 20, 30].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>

                <button className="btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                <div>{page} / {pages}</div>
                <button className="btn" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>›</button>
                <button className="btn" onClick={() => setPage(pages)} disabled={page >= pages}>»</button>
            </div>
        </div>
    );
}
