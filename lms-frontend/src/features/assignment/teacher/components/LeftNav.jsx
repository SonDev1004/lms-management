import React from "react";
import { Button } from "primereact/button";

const steps = [
    {key:0, label:"Details", sub:"Basic information", icon:"pi pi-info-circle"},
    {key:1, label:"Items", sub:"Question builder", icon:"pi pi-plus-circle"},
    {key:2, label:"Settings", sub:"Exercise configuration", icon:"pi pi-cog"},
    {key:3, label:"Review & Publish", sub:"Final review", icon:"pi pi-check-circle"},
];

export default function LeftNav({step, setStep, itemsCount=0, points=0}) {
    return (
        <aside className="exb-leftnav">
            <div className="exb-leftnav-title">Exercise Builder</div>
            <div className="exb-leftnav-sub">Create and configure your exercise</div>

            <ul className="exb-step-list">
                {steps.map((s)=>(
                    <li key={s.key}
                        className={`exb-step ${step===s.key ? 'active':''}`}
                        onClick={()=>setStep(s.key)}>
                        <i className={s.icon}/>
                        <div className="exb-step-meta">
                            <div className="exb-step-label">{s.label}</div>
                            <div className="exb-step-sub">{s.sub}</div>
                        </div>
                        <i className="pi pi-angle-right exb-step-chevron"/>
                    </li>
                ))}
            </ul>

            <div className="exb-progress">
                <div className="exb-progress-label">Progress:</div>
                <div className="exb-progress-bar"><span style={{width:`${(step+1)/4*100}%`}}/></div>
                {step===1 && <div className="exb-progress-mini">{itemsCount} items • {points} pts</div>}
            </div>
        </aside>
    );
}
