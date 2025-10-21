import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function ItemCard({index, item, active, onSelect, onDuplicate, onDelete, children}) {
    return (
        <section className={`exb-item-card ${active?'active':''}`} onClick={onSelect}>
            <div className="exb-item-chiprow">
                <span className="exb-number">{index}</span>
                <Tag value={item.typeLabel}/>
                <Tag value={`${item.points} pts`} className="ml-2" />
                <Tag value="Required" severity="secondary" className="ml-2" />
                <span className="exb-error"><i className="pi pi-exclamation-circle"/>  {item.errors?.length||0} errors</span>
                <span className="exb-spacer"/>
                <Button text icon="pi pi-chevron-down" className="mr-2"/>
                <Button text icon="pi pi-copy" onClick={(e)=>{e.stopPropagation(); onDuplicate();}}/>
                <Button text icon="pi pi-trash" severity="danger" onClick={(e)=>{e.stopPropagation(); onDelete();}}/>
            </div>
            <div className="exb-item-body">{children}</div>
        </section>
    );
}
