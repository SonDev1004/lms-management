import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../styles/dialogs.css";

export default function ConfirmDialog({ visible, title="Confirm", message, onNo, onYes }){
    return (
        <Dialog className="am-dialog" header={title} visible={visible} onHide={onNo} dismissableMask draggable={false} style={{width:560}}>
            <div style={{display:"flex", gap:12, alignItems:"flex-start", padding:"6px 2px 16px"}}>
                <i className="pi pi-question-circle" style={{fontSize:22, marginTop:2}}/>
                <div style={{lineHeight:1.55}}>{message}</div>
            </div>
            <div className="footer">
                <Button label="No" className="p-button-text" onClick={onNo}/>
                <Button label="Yes" onClick={onYes}/>
            </div>
        </Dialog>
    );
}
