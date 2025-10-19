import React from 'react';
import { Button } from 'primereact/button';

export default function QuestionFrame({ meta, badge, children, onClear, onSave, onFlag }){
    return (
        <div className="as-qframe">
            <div className="as-qbadge">{badge}</div>
            <h2 className="as-qtitle">{meta.title}</h2>
            <p className="as-qsubtitle">{meta.subtitle}</p>
            <div className="as-qcontent">{children}</div>
            <div className="as-qactions">
                <Button label="Clear Response" className="p-button-text" onClick={onClear} />
                <Button label="Save" icon="pi pi-save" className="p-button-text" onClick={onSave} />
                <Button label="Report Issue" icon="pi pi-exclamation-triangle" className="p-button-text p-button-warning ml-auto" onClick={onFlag} />
            </div>
        </div>
    );
}
