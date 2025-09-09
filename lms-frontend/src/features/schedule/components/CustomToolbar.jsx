import React from 'react';
import { Button } from 'primereact/button';
import moment from 'moment';

export default function CustomToolbar(toolbarProps) {
    const goToBack = () => toolbarProps.onNavigate('PREV');
    const goToNext = () => toolbarProps.onNavigate('NEXT');
    const goToToday = () => toolbarProps.onNavigate('TODAY');
    const date = toolbarProps.date || new Date();
    const weekNumber = moment(date).isoWeek();
    const monthNumber = date.getMonth() + 1;
    const label = toolbarProps.label;
    return (
        <div className="rbc-toolbar custom-toolbar p-d-flex p-jc-between p-ai-center">
            <div className="p-d-flex p-ai-center p-gap-2">
                <Button icon="pi pi-chevron-left" className="p-button-text" onClick={goToBack} />
                <Button icon="pi pi-calendar" label="Hôm nay" className="p-button-outlined p-button-sm" onClick={goToToday} />
                <Button icon="pi pi-chevron-right" className="p-button-text" onClick={goToNext} />
                <div className="toolbar-label p-ml-3">{label}</div>
                {toolbarProps.view === 'week' && <div className="week-header p-ml-3">Tuần {weekNumber} - Tháng {monthNumber}</div>}
            </div>
            <div className="p-d-flex p-ai-center p-gap-2" />
        </div>
    );
}
