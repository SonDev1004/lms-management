import React from "react";

export default function KPI({ tone, value, label, extra }){
    return (
        <div className="card p-6">
            <div className={`kpi ${tone}`}>
                <div className="value">{value}</div>
                <div className="label">{label}</div>
                {extra}
            </div>
        </div>
    );
}
