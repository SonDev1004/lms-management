import React from 'react';
import { Card } from 'primereact/card';

export default function CourseCard({ course, filledCount = 0 }) {
    const segments = Array.from({ length: 12 });

    return (
        <Card className="course-card sd-card">
            <div className="course-top">
                <div style={{ flex: 1 }}>
                    <img className="course-logo" src={course.brand} alt="brand" onError={(e) => { e.currentTarget.style.background = '#f2f2f2'; e.currentTarget.src = 'https://via.placeholder.com/84x44?text=IELTS'; }} />
                    <div className="course-title">{course.title}</div>

                    <div className="meta-row">
                        <div><i className="pi pi-book" style={{ marginRight: 6 }}></i> {course.level}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}><i className="pi pi-map-marker" style={{ marginRight: 6 }}></i> {course.location}</div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        {course.days.map((d) => <span key={d} className="tag-day">{d}</span>)}
                    </div>

                    <div className="next-session">
                        <div className="label">Next session:</div>
                        <div className="line"><div><i className="pi pi-calendar" style={{ marginRight: 8 }}></i>{course.next.date}</div><div><i className="pi pi-clock" style={{ marginRight: 8 }}></i>{course.next.time}</div></div>
                        <div className="line" style={{ marginTop: 6 }}><div><i className="pi pi-map-marker" style={{ marginRight: 8 }}></i>{course.next.room}</div><div></div></div>
                    </div>

                    <div className="progress-track">
                        {segments.map((_, i) => {
                            const filled = i < filledCount;
                            return (<div key={i} className="progress-seg"><div className="fill" style={{ width: filled ? '100%' : '0%' }}></div></div>);
                        })}
                        <div className="progress-counter">{course.sessionsDone} / {course.sessionsTotal} <i className="pi pi-fire" style={{ color: 'var(--danger)', marginLeft: 8 }}></i></div>
                    </div>

                </div>
            </div>
        </Card>
    );
}