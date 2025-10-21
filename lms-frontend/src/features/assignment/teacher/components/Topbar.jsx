import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function Topbar({ title, status="Draft", onPreview, onSave, onPublish }) {
    return (
        <header className="exb-topbar">
            <div className="exb-topbar-left">
                <h1 className="exb-title">{title}</h1>
                <Tag className="ml-2" value={status} severity="warning" rounded />
            </div>

            <div className="exb-topbar-right">
                <Button text icon="pi pi-eye" label="Preview" onClick={onPreview} className="mr-2"/>
                <Button text icon="pi pi-save" label="Save" onClick={onSave} className="mr-2"/>
                <Button icon="pi pi-send" label="Publish" onClick={onPublish}/>
                <Button text icon="pi pi-ellipsis-h" className="ml-2"/>
            </div>
        </header>
    );
}
