import React from 'react';
import { ProgressBar } from 'primereact/progressbar';

export default function Sidebar({ course }) {
    return (
        <aside>
            <div className="sidebar-card sd-card">
                <div className="title">Recent Session</div>
                <div className="muted" style={{ marginTop: 8 }}>IELTS 7.0 · Phase 1 · LS</div>
                <div style={{ marginTop: 12, fontWeight: 700 }}>Session 04<span style={{ color: 'var(--muted)', fontWeight: 500 }}>Sun, 07/09</span></div>
                <div style={{ marginTop: 8, color: 'var(--muted)' }}>You’ve completed this session. Review your lesson and do extra exercises!</div>
                <div style={{ marginTop: 10, color: 'var(--accent)', fontWeight: 700 }}>View Summary</div>
            </div>

            <div className="sidebar-card sd-card">
                <div className="title">Complete your profile information</div>
                <div className="profile-progress"><ProgressBar value={50} style={{ height: '0.7rem', borderRadius: 8 }} /></div>
                <div style={{ marginTop: 8 }}><a href="#" style={{ color: 'var(--accent)' }}>Your profile →</a></div>
            </div>

            <div className="sidebar-card sd-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 800 }}>IELTS 7.0 Course</div>
                        <div className="muted" style={{ marginTop: 6 }}>You've completed {course.progress}% of the course TB-IELTS-7.0-24.08.2025...</div>
                    </div>
                    <div className="circular-box">
                        <div className="circular-number">{course.progress}%</div>
                        <div style={{ marginTop: 6 }}><i className="pi pi-sync" style={{ fontSize: 20 }}></i></div>
                    </div>
                </div>
            </div>

            <div className="sidebar-card sd-card">
                <div style={{ fontWeight: 800 }}>Do an exercise to start your first streak!</div>
                <div className="muted" style={{ marginTop: 8 }}>Your highest streak belongs to the IELTS 7.0 course</div>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: 56, height: 72, borderRadius: 10, background: '#fff0ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="pi pi-fire" style={{ fontSize: 28, color: 'var(--danger)' }}></i>
                    </div>
                </div>
            </div>
        </aside>
    );
}
