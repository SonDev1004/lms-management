import React from 'react';
import { Card } from 'primereact/card';

export default function Sidebar(){
    return (
        <aside className="sidebar">
            <Card>
                <div className="brand">Staff Dashboard</div>
                <nav className="side-nav">
                    <div>Overview</div>
                    <div>Students</div>
                    <div>Courses</div>
                    <div>Reports</div>
                </nav>
            </Card>
        </aside>
    );
}