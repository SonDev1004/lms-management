import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/dashboard.css';

import useStudentDashboard from '../hooks/useStudentDashboard';
import SummaryPills from '../components/SummaryPills';
import CourseCard from '../components/CourseCard';
import AssignmentCard from '../components/AssignmentCard';
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
    const { loading, course, assignments, suggestions, filledCount } = useStudentDashboard();

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    return (
        <div className="sd-container">
            <div className="sd-grid">
                <div>
                    <h3 className="sd-header">XEM NHANH QUÁ TRÌNH HỌC CỦA BẠN</h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="sd-card sd-small-card sd-compact">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 10, background: '#eef4fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="pi pi-book" style={{ fontSize: '1.15rem', color: 'var(--accent)' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>Bạn đang theo học 1 khóa học</div>
                                    <div className="muted-2">Phát triển kỹ năng của bạn qua khóa học IELTS</div>
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
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>Bạn đã học xong 1 khóa học</div>
                                    <div className="muted-2">Xem lại khóa học IELTS của bạn tại DOL</div>
                                </div>

                                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Completed courses &nbsp; <i className="pi pi-angle-right"></i></div>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                <div className="summary-pill"><i className="pi pi-calendar"></i> Đi học <strong style={{ color: 'var(--success)', marginLeft: 6 }}>16</strong> buổi</div>
                                <div style={{ width: 8 }} />
                                <div className="summary-pill"><i className="pi pi-book"></i> Luyện tập <strong style={{ color: 'var(--success)', marginLeft: 6 }}>208</strong> bài</div>
                                <div style={{ width: 8 }} />
                                <div className="summary-pill"><i className="pi pi-file"></i> Hoàn thành <strong style={{ color: 'var(--success)', marginLeft: 6 }}>9</strong> assignment</div>
                            </div>
                        </div>

                        <div>
                            <div className="section-title">KHÓA ĐANG HỌC (1)</div>
                            <CourseCard course={course} filledCount={filledCount} />
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="section-title">BÀI ASSIGNMENT CẦN HOÀN THÀNH (1)</div>
                            {assignments.map(a => <AssignmentCard key={a.id} assign={a} />)}
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="section-title">KHÓA HỌC GỢI Ý CHO BẠN</div>
                            <div className="sd-card sd-small-card suggest-card">
                                <div className="suggest-ico" style={{ background: 'linear-gradient(180deg,#ff4d4f,#ff9a9a)' }}>{suggestions[0].tag}</div>
                                <div>
                                    <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Tiếp theo khóa IELTS 7.0</div>
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
