import React from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

const levels = ["Beginner","Elementary","Pre-Intermediate","Intermediate","Upper-Intermediate","Advanced"]
    .map(l=>({label:l,value:l}));

export default function DetailsStep({meta, onChange}) {
    return (
        <Card className="exb-card p-4">
            <h2 className="exb-h2">Exercise Details</h2>

            <div className="exb-field">
                <label className="exb-label">Title <span>*</span></label>
                <InputText value={meta.title} placeholder="Untitled Exercise"
                           onChange={(e)=>onChange({...meta, title:e.target.value})}/>
                <div className="exb-help">Students will see this name.</div>
            </div>

            <div className="exb-field">
                <label className="exb-label">Description</label>
                <InputTextarea autoResize rows={4} placeholder="Brief description of the exercise"
                               value={meta.description}
                               onChange={(e)=>onChange({...meta, description:e.target.value})}/>
            </div>

            <div className="exb-grid">
                <div className="exb-col">
                    <label className="exb-label">Subject/Course</label>
                    <InputText value={meta.subject} placeholder="e.g., Mathematics"
                               onChange={(e)=>onChange({...meta, subject:e.target.value})}/>
                </div>
                <div className="exb-col">
                    <label className="exb-label">Unit/Module</label>
                    <InputText value={meta.unit} placeholder="e.g., Unit 3"
                               onChange={(e)=>onChange({...meta, unit:e.target.value})}/>
                </div>
            </div>

            <div className="exb-grid">
                <div className="exb-col">
                    <label className="exb-label">Level</label>
                    <Dropdown value={meta.level} options={levels} placeholder="Select level"
                              onChange={(e)=>onChange({...meta, level:e.value})}/>
                </div>
                <div className="exb-col">
                    <label className="exb-label">Estimated Time (minutes)</label>
                    <InputNumber value={meta.estMinutes} min={1}
                                 onValueChange={(e)=>onChange({...meta, estMinutes:e.value})}/>
                </div>
            </div>
        </Card>
    );
}
