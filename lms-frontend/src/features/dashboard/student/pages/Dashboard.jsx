import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/dashboard.css';

import useStudentDashboard from '../hooks/useStudentDashboard.js';
import SummaryPills from '../components/SummaryPills.jsx';
import CourseCard from '../components/CourseCard.jsx';
import AssignmentCard from '../components/AssignmentCard.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function DashboardPage() {
    const { loading, course, assignments, suggestions, filledCount } = useStudentDashboard();

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    return (
        <div className="sd-container">
            <div className="sd-grid">
                <div>
                    <h3 className="sd-header">QUICK VIEW OF YOUR LEARNING PROGRESS</h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="sd-card sd-small-card sd-compact">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 10, background: '#eef4fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="pi pi-book" style={{ fontSize: '1.15rem', color: 'var(--accent)' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>You are enrolled in 1 course</div>
                                    <div className="muted-2">Develop your skills through the IELTS course</div>
                                </div>
                                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>In-progress courses &nbsp; <i className="pi pi-angle-right"></i></div>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                <SummaryPills />
                            </div>
                        </div>

                        <div className="sd-card sd-small-card sd-compact">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 10, background: '#eaf9ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="pi pi-star" style={{ fontSize: '1.15rem', color: 'var(--success)' }}></i>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>You have completed 1 course</div>
                                    <div className="muted-2">Review your IELTS course at DOL</div>
                                </div>

                                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Completed courses &nbsp; <i className="pi pi-angle-right"></i></div>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                <div className="summary-pill"><i className="pi pi-calendar"></i> Attended <strong style={{ color: 'var(--success)', marginLeft: 6 }}>16</strong> sessions</div>
                                <div style={{ width: 8 }} />
                                <div className="summary-pill"><i className="pi pi-book"></i> Practiced <strong style={{ color: 'var(--success)', marginLeft: 6 }}>208</strong> exercises</div>
                                <div style={{ width: 8 }} />
                                <div className="summary-pill"><i className="pi pi-file"></i> Completed <strong style={{ color: 'var(--success)', marginLeft: 6 }}>9</strong> assignments</div>
                            </div>
                        </div>

                        <div>
                            <div className="section-title">CURRENT COURSE (1)</div>
                            <CourseCard course={course} filledCount={filledCount} />
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="section-title">ASSIGNMENTS TO COMPLETE (1)</div>
                            {assignments.map(a => <AssignmentCard key={a.id} assign={a} />)}
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="section-title">COURSES SUGGESTED FOR YOU</div>
                            <div className="sd-card sd-small-card suggest-card">
                                <div className="suggest-ico" style={{ background: 'linear-gradient(180deg,#ff4d4f,#ff9a9a)' }}>{suggestions[0].tag}</div>
                                <div>
                                    <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Next after IELTS 7.0 course</div>
                                    <div style={{ fontWeight: 800, fontSize: 18 }}>{suggestions[0].title}</div>
                                    <div style={{ color: 'var(--muted)', marginTop: 8 }}><i className="pi pi-book" style={{ marginRight: 6 }}></i> {suggestions[0].meta}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Sidebar course={course} />

            </div>
        </div>
    );
}
