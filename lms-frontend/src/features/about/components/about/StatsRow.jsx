import React from "react";
import { stats } from "../../mocks/about.mocks.js";

export default function StatsRow() {
    return (
        <div>
            <h2 className="section-title center">Trusted by Thousands Across Vietnam</h2>
            <div className="stats-row">
                {stats.map((s) => (
                    <div key={s.label} className="stat">
                        <div className={`stat-value ${s.color}`}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
