import React from 'react';
import { Button } from 'primereact/button';

export default function TopBar({ title, timeLeft, onLeave }) {
    return (
        <div className="as-topbar">
            <div className="as-topbar__title">{title}</div>
            <div className="as-topbar__right">
                <i className="pi pi-clock" />
                <span className="as-topbar__time">{timeLeft}</span>
                <Button label="Leave" icon="pi pi-sign-out" className="p-button-text p-button-rounded" onClick={onLeave} />
            </div>
        </div>
    );
}