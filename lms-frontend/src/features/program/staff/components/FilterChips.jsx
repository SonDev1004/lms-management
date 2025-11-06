import React from "react";
import { Button } from "primereact/button";

export default function FilterChips({ level, status, onClear }) {
    if (!level && !status) return null;
    return (
        <div className="chips-row">
            {level && <span className="chip">Level: {level}</span>}
            {status && <span className="chip">Status: {status}</span>}
            <Button label="Clear filters" className="p-button-text" onClick={onClear} />
        </div>
    );
}
