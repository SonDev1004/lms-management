import React from 'react';
import { Card } from 'primereact/card';
import '../styles/SummaryPills.css';


export default function SummaryPills({ summary }){
    return (
        <div className="summary-pills">
            <Card className="pill">
                <div className="pill-title">Total Students</div>
                <div className="pill-value">{summary.totalStudents.toLocaleString()}</div>
                <div className="pill-trend">+12%</div>
            </Card>
            <Card className="pill">
                <div className="pill-title">Active Students</div>
                <div className="pill-value">{summary.activeStudents.toLocaleString()}</div>
                <div className="pill-trend">+8%</div>
            </Card>
            <Card className="pill">
                <div className="pill-title">Open Courses</div>
                <div className="pill-value">{summary.openCourses}</div>
                <div className="pill-trend">+3</div>
            </Card>
            <Card className="pill">
                <div className="pill-title">Monthly Revenue</div>
                <div className="pill-value">${summary.monthlyRevenue.toLocaleString()}</div>
            </Card>
        </div>
    );
}
