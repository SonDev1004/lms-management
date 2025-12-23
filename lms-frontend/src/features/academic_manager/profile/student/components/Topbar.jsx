import React, { useMemo } from "react";

export default function Topbar({ onBack, student }) {
    const fullName = useMemo(() => {
        const fn = student?.firstName?.trim?.() || "";
        const ln = student?.lastName?.trim?.() || "";
        const name = `${fn} ${ln}`.trim();
        return name || student?.userName || student?.email || "";
    }, [student]);

    return (
        <div className="sp-topbar" style={{ marginBottom: 10 }}>
            <button className="sp-back" onClick={onBack}>← Back to Students</button>
            <h1 className="sp-title">Student Profile</h1>
            <div className="sp-subtitle">Detailed information for {fullName}</div>
        </div>
    );
}
