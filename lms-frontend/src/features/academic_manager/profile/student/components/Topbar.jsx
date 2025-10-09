import React from 'react';

export default function Topbar({ onBack, student }) {
    return (
        <div className="sp-topbar" style={{ marginBottom: 10 }}>
            <button className="sp-back" onClick={onBack}>← Back to Students</button>
            <h1 className="sp-title">Student Profile</h1>
            <div className="sp-subtitle">Detailed information for {student?.name}</div>
        </div>
    );
}
