import React from 'react';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import './styles/assignment.css';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section className="as-hero">
            <h1 className="as-hero__title">Modern Exercise Interface</h1>
            <p className="as-hero__subtitle">A contemporary, distraction-free interface for completing exercises with multiple question types, progress tracking, and comprehensive review capabilities.</p>

            <div className="as-hero__pills">
                <Tag value="6 Question Types" icon="pi pi-list" className="as-pill" />
                <Tag value="Responsive Design" icon="pi pi-users" className="as-pill" />
                <Tag value="Timer & Progress" icon="pi pi-clock" className="as-pill" />
            </div>

            <div className="as-hero__card">
                <div className="as-card__header">English Proficiency Assessment</div>
                <p className="as-card__sub">Complete assessment covering reading, listening, and writing skills</p>
                <div className="as-card__stats">
                    <div className="as-stat">
                        <div className="as-stat__num">6</div>
                        <div className="as-stat__label">Questions</div>
                    </div>
                    <div className="as-stat">
                        <div className="as-stat__num as-stat__num--green">60</div>
                        <div className="as-stat__label">Minutes</div>
                    </div>
                    <div className="as-stat">
                        <div className="as-stat__num as-stat__num--purple">3</div>
                        <div className="as-stat__label">Attempts</div>
                    </div>
                    <div className="as-stat">
                        <i className="pi pi-check" />
                        <div className="as-stat__label">Review</div>
                    </div>
                </div>

                <ul className="as-card__types">
                    <li><span className="dot dot-blue" />MCQ - Single Answer</li>
                    <li><span className="dot dot-purple" />Fill in the Blank</li>
                    <li><span className="dot dot-red" />Listening Fill Blank</li>
                    <li><span className="dot dot-green" />MCQ - Multiple Answers</li>
                    <li><span className="dot dot-orange" />Listening MCQ</li>
                    <li><span className="dot dot-indigo" />Essay (Long Form)</li>
                </ul>

                <Button label="Start Exercise Demo" icon="pi pi-play" className="as-start" onClick={() => navigate('/assignment/student/exercise')} />
            </div>

            <div className="as-feature-cards">
                <div className="as-feature">
                    <div className="as-feature__icon pi pi-book" />
                    <h3>Multiple Question Types</h3>
                    <p>Support for MCQ, fill-in-the-blank, listening comprehension, and essay questions with rich interactions.</p>
                </div>
                <div className="as-feature">
                    <div className="as-feature__icon pi pi-clock" />
                    <h3>Progress Tracking</h3>
                    <p>Real-time progress indicators, question mapping, and timer functionality with auto-submit capabilities.</p>
                </div>
                <div className="as-feature">
                    <div className="as-feature__icon pi pi-users" />
                    <h3>Responsive Design</h3>
                    <p>Optimized for desktop, tablet, and mobile devices with adaptive layouts and touch-friendly controls.</p>
                </div>
            </div>
        </section>
    );
}