import React from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export default function ReviewPublishStep({ meta, items }) {
    const totalPts = items.reduce((s,i)=>s+(i.points||0),0);
    return (
        <Card className="exb-card p-4">
            <h2 className="exb-h2">Review & Publish</h2>
            <Card className="p-4" style={{maxWidth:720}}>
                <div className="exb-summary-title">Exercise Summary</div>
                <div className="exb-summary-grid">
                    <div><b>Title:</b> {meta.title || "Untitled Exercise"}</div>
                    <div><b>Items:</b> {items.length}</div>
                    <div><b>Total Points:</b> {totalPts}</div>
                    <div><b>Status:</b> <Tag value={meta.status || "Draft"} severity="warning" rounded/></div>
                </div>
            </Card>
        </Card>
    );
}
