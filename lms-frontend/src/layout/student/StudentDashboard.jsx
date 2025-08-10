import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import AssignmentCard from './AssignmentCard';
import './dashboard.css';

export default function StudentDashboard() {
    const [username, setUsername] = useState('Guest');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        setUsername(u.username || u.name || 'Guest');
        const userId = u.id || u.userId || '';

        fetch('/api/dashboard?userId=' + userId)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(data => {
                setCourses(data.courses || []);
                setAssignments(data.assignments || []);
                setStats(data.stats || {});
            })
            .catch(err => {
                setCourses([{ id: 1, code: 'TB-IELTS-6.0-2024', progress: 100, finalTest: 6.5 }]);
                setAssignments([]);
                setStats({ completed: 8, total: 12, teacher: 'John Doe' });
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="dashboard-root no-right">
            <aside className="left-col">
                <div className="welcome">
                    <h2>Hey <span className="username">{username}</span>, let's do homework</h2>
                </div>

                <div className="courses-area">
                    {isLoading ? (
                        <div className="placeholder-list">
                            <div className="placeholder-card" />
                            <div className="placeholder-card" />
                        </div>
                    ) : (
                        courses.length ? courses.map(c => (
                            <CourseCard
                                key={c.id}
                                title={c.code || c.level || 'Course'}
                                progress={c.progress ?? 0}
                                finalTest={c.finalTest}
                            />
                        )) : (
                            <div className="empty-course">
                                <div className="empty-emoji">📚</div>
                                <div>No courses yet</div>
                                <small>Enroll in a course to start learning</small>
                            </div>
                        )
                    )}
                </div>
            </aside>

            <main className="center-col">
                <div className="section-header">
                    <h3>My Assignments</h3>
                    <div className="section-meta">{assignments.length} items</div>
                </div>

                <div className="assignment-grid">
                    {isLoading ? (
                        <>
                            <div className="assignment-card skeleton" />
                            <div className="assignment-card skeleton" />
                        </>
                    ) : assignments.length ? (
                        assignments.map(a => <AssignmentCard key={a.id} {...a} />)
                    ) : (
                        <>
                            <AssignmentCard title="Writing task 2" assignedDate="-" progress={0} score={null} />
                            <AssignmentCard title="Speaking Part 1" assignedDate="-" progress={0} score={null} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
