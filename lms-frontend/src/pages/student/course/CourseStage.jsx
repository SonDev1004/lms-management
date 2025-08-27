import React, { useState } from 'react';
import './CourseStage.css';

import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';

export default function CourseStage() {
    const [variant] = useState('prime');

    const course = {
        title: 'TB-IELTS-7.0-24.08.2025-13:30',
        level: 'IELTS 7.0',
        mode: 'Offline',
        classmates: [
            'https://i.pravatar.cc/40?img=12',
            'https://i.pravatar.cc/40?img=5',
            'https://i.pravatar.cc/40?img=15',
            'https://i.pravatar.cc/40?img=20'
        ],
        start: '24/08/2025',
        end: '02/11/2025',
        teacherAvatar: 'https://i.pravatar.cc/64?img=32',
        stages: [
            {
                title: 'Speaking, Listening 7.0',
                status: 'In progress',
                time: '13:30 - 16:30',
                place: 'Center TB',
                sessions: '6 buổi học',
                dateRange: '24/08 - 14/09',
                hint: 'Bạn đang học tới giai đoạn này'
            },
            {
                title: 'Writing 7.0',
                status: 'Upcoming',
                time: '13:30 - 16:30',
                place: 'Center TB',
                sessions: '9 buổi học',
                dateRange: '20/09 - 18/10',
                hint: 'DOL đang chuẩn bị khóa học cho bạn!'
            },
            {
                title: 'Reading 7.0',
                status: 'Upcoming',
                time: '13:30 - 16:30',
                place: 'Center TB',
                sessions: '5 buổi học',
                dateRange: '19/10 - 02/11',
                hint: 'DOL đang chuẩn bị khóa học cho bạn!'
            }
        ]
    };

    return (
        <div className="page">
            {variant === 'prime' ? (
                <PrimeVariant course={course} />
            ) : (
                <FlexVariant course={course} />
            )}
        </div>
    );
}

function PrimeVariant({ course }) {
    return (
        <div className="container">
            <section className="left">
                <h2 className="title">{course.title}</h2>

                <div className="card">
                    <div className="row">
                        <div>
                            <div className="label">Your classmates</div>
                            <div className="avatars">
                                {course.classmates.map((src, i) => (
                                    <Avatar image={src} shape="circle" size="large" key={i} className="avatar" />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="label">Course duration</div>
                            <div className="small">Start: {course.start}</div>
                            <div className="small">End: {course.end}</div>
                        </div>

                        <div className="teacherCol">
                            <div className="label">Teachers</div>
                            <Avatar image={course.teacherAvatar} shape="circle" size="large" />
                        </div>
                    </div>
                </div>
            </section>

            <aside className="right">
                <div className="stageHeader">Khóa học này có {course.stages.length} giai đoạn</div>
                <div className="stageList">
                    {course.stages.map((stage, idx) => (
                        <div key={idx} className="stageCard">
                            <div className="stageMeta">
                                <div className="stageLeft">
                                    <div className="stageTop">Giai đoạn {idx + 1} · Bình thường</div>
                                    <div className="stageTitle">{stage.title}</div>

                                    <div className="infoRow">
                                        <i className="pi pi-clock" aria-hidden="true" />
                                        <span>{stage.time}</span>
                                        <i className="pi pi-map-marker" style={{ marginLeft: 8 }} aria-hidden="true" />
                                        <span>{stage.place}</span>
                                    </div>

                                    <div className="infoRow">
                                        <i className="pi pi-calendar" aria-hidden="true" />
                                        <span>{stage.sessions}</span>
                                        <span>·</span>
                                        <span>{stage.dateRange}</span>
                                    </div>

                                    {stage.hint && <div className="hint">{stage.hint}</div>}
                                </div>

                                <div className="stageRight">
                                    <Tag value={stage.status} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}

function FlexVariant({ course }) {
    return (
        <div className="container">
            <section className="left">
                <h2 className="title">{course.title}</h2>

                <div className="card">
                    <div className="row">
                        <div>
                            <div className="label">Your classmates</div>
                            <div className="avatars">
                                {course.classmates.map((src, i) => (
                                    <img src={src} alt="avatar" key={i} className="imgAvatar" />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="label">Course duration</div>
                            <div className="small">Start: {course.start}</div>
                            <div className="small">End: {course.end}</div>
                        </div>

                        <div className="teacherCol">
                            <div className="label">Teachers</div>
                            <img src={course.teacherAvatar} alt="teacher" className="teacherImg" />
                        </div>
                    </div>
                </div>
            </section>

            <aside className="right">
                <div className="stageHeader">Khóa học này có {course.stages.length} giai đoạn</div>
                <div className="stageList">
                    {course.stages.map((stage, idx) => (
                        <div key={idx} className="stageCard">
                            <div className="stageMeta">
                                <div className="stageLeft">
                                    <div className="stageTop">Giai đoạn {idx + 1} · Bình thường</div>
                                    <div className="stageTitle">{stage.title}</div>

                                    <div className="infoRow">
                                        <span className="pi pi-clock" />
                                        <span>{stage.time}</span>
                                        <span className="pi pi-map-marker" style={{ marginLeft: 8 }} />
                                        <span>{stage.place}</span>
                                    </div>

                                    <div className="infoRow">
                                        <span className="pi pi-calendar" />
                                        <span>{stage.sessions}</span>
                                        <span>·</span>
                                        <span>{stage.dateRange}</span>
                                    </div>

                                    {stage.hint && <div className="hint">{stage.hint}</div>}
                                </div>

                                <div className="stageRight">
                                    <div className="statusPill">{stage.status}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
