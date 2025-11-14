import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "../styles/dialogs.css";

export default function EditAccountDialog({ visible, onHide, value, onSave, roleOptions, statusOptions }){
    const [form, setForm] = useState(value || {});
    useEffect(()=>{ setForm(value || {}); }, [value]);

    const change = (k,v)=> setForm(prev => ({...prev, [k]:v}));

    return (
        <Dialog className="am-dialog" header="Edit Account" visible={visible} onHide={onHide} dismissableMask draggable={false} style={{width:560}}>
            <div className="field">
                <label className="label">Full Name</label>
                <input className="p-inputtext p-component" value={form.name||""} onChange={e=>change("name", e.target.value)} />
            </div>
            <div className="field">
                <label className="label">Email Address</label>
                <input disabled className="p-inputtext p-component" value={form.email||""} />
            </div>
            <div className="field">
                <label className="label">Role</label>
                <Dropdown value={form.role||null} onChange={(e)=>change("role", e.value)} options={roleOptions}/>
            </div>
            <div className="field">
                <label className="label">Status</label>
                <Dropdown value={form.status||null} onChange={(e)=>change("status", e.value)} options={statusOptions}/>
            </div>
            <div className="field">
                <label className="label">Notes</label>
                <textarea className="p-inputtextarea p-inputtext p-component" rows={3} placeholder={`Account for ${form?.name||""}`}/>
            </div>

            <div className="footer">
                <Button label="Close" className="p-button-text" onClick={onHide}/>
                <Button label="Save" icon="pi pi-check" onClick={()=>onSave(form)} />
            </div>
        </Dialog>
    );
}
