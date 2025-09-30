import React, { useState, useEffect } from 'react';
import useStaffDashboard from '../hooks/useStaffDashboard.js';
import Sidebar from '../components/Sidebar.jsx';
import SummaryPills from '../components/SummaryPills.jsx';
import EnrollmentChart from '../components/EnrollmentChart.jsx';
import LevelDonut from '../components/LevelDonut.jsx';
import NewStudentsTable from '../components/NewStudentsTable.jsx';
import LeaveApprovalPanel from '../components/LeaveApprovalPanel.jsx';
import '../styles/dashboard.css';

export default function DashboardStaff() {
    const {
        summary,
        enrollment,
        levels,
        recent,
        upcoming,
        students,
        leaveRequests: initialLeaveRequests,
        downloadCSV,
    } = useStaffDashboard();

    const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests || []);

    useEffect(() => {
        setLeaveRequests(initialLeaveRequests || []);
    }, [initialLeaveRequests]);

    const handleApprove = (reqOrId) => {
        const id = typeof reqOrId === 'object' ? reqOrId.id : reqOrId;
        setLeaveRequests((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, status: 'approved' } : r
            )
        );
        console.log('APPROVED (parent):', reqOrId);
    };

    const handleReject = (reqOrId) => {
        const id = typeof reqOrId === 'object' ? reqOrId.id : reqOrId;
        setLeaveRequests((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, status: 'rejected' } : r
            )
        );
        console.log('REJECTED (parent):', reqOrId);
    };

    return (
        <div className="dashboard-root">
            <Sidebar />
            <main className="dashboard-main">
                <header className="top-row">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! Here's what's happening today.</p>
                    </div>
                </header>

                <SummaryPills summary={summary} />

                <div className="two-column">
                    <div className="col-left">
                        <EnrollmentChart data={enrollment} />
                        <div className="small-cards-row">
                            <LevelDonut data={levels} />
                        </div>
                        <NewStudentsTable students={students} onExport={downloadCSV} />
                    </div>

                    <LeaveApprovalPanel
                        recent={recent}
                        upcoming={upcoming}
                        leaveRequests={leaveRequests}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </div>
            </main>
        </div>
    );
}
