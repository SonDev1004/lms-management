import React from "react";
import "../styles/filterbar.css";

export default function FilterBar({
                                      primaryMonth,
                                      setPrimaryMonth,
                                      compareOn,
                                      setCompareOn,
                                      compareMonth,
                                      setCompareMonth,
                                      status,
                                      setStatus,
                                      programId,
                                      setProgramId,
                                      subjectId,
                                      setSubjectId,
                                      viewMode,
                                      setViewMode,
                                      onExport,
                                  }) {
    // chuyển "MM/YYYY" -> "YYYY-MM" cho input month
    const primaryMonthValue = primaryMonth
        ? primaryMonth.split("/").reverse().join("-")
        : "";

    const compareMonthValue = compareMonth
        ? compareMonth.split("/").reverse().join("-")
        : "";

    const handlePrimaryChange = (e) => {
        const v = e.target.value; // "2025-09" hoặc "" nếu Clear
        if (!v) {
            setPrimaryMonth("");
            return;
        }
        const [yyyy, mm] = v.split("-");
        setPrimaryMonth(`${mm}/${yyyy}`); // lưu lại dạng "MM/YYYY"
    };

    const handleCompareChange = (e) => {
        const v = e.target.value;
        if (!v) {
            setCompareMonth("");
            return;
        }
        const [yyyy, mm] = v.split("-");
        setCompareMonth(`${mm}/${yyyy}`);
    };

    return (
        <div className="filter-bar">
            {/* Primary Month */}
            <div className="filter-item">
                <label>Primary Month</label>
                <input
                    type="month"
                    value={primaryMonthValue}
                    onChange={handlePrimaryChange}
                />
            </div>

            {/* Compare mode */}
            <div className="filter-item">
                <label>Compare Mode</label>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={compareOn}
                        onChange={(e) => setCompareOn(e.target.checked)}
                    />
                    <span className="slider" />
                </label>
            </div>

            {/* Compare Month */}
            {compareOn && (
                <div className="filter-item">
                    <label>Compare Month</label>
                    <input
                        type="month"
                        value={compareMonthValue}
                        onChange={handleCompareChange}
                    />
                </div>
            )}

            {/* STATUS */}
            <div className="filter-item">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="ALL">All</option>
                </select>
            </div>

            {/* PROGRAM */}
            <div className="filter-item">
                <label>Program</label>
                <select
                    value={programId}
                    onChange={(e) => setProgramId(Number(e.target.value))}
                >
                    <option value={0}>All programs</option>
                    {/* sau này map thêm options thật */}
                </select>
            </div>

            {/* SUBJECT */}
            <div className="filter-item">
                <label>Subject</label>
                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(Number(e.target.value))}
                >
                    <option value={0}>All subjects</option>
                </select>
            </div>

            {/* VIEW MODE */}
            <div className="filter-item">
                <label>View Mode</label>
                <div className="view-buttons">
                    <button
                        className={viewMode === "table" ? "active" : ""}
                        onClick={() => setViewMode("table")}
                    >
                        Table
                    </button>
                    <button
                        className={viewMode === "chart" ? "active" : ""}
                        onClick={() => setViewMode("chart")}
                    >
                        Chart
                    </button>
                </div>
            </div>

            {/* Export */}
            <div className="filter-item export">
                <button onClick={onExport}>Export CSV</button>
            </div>
        </div>
    );
}
