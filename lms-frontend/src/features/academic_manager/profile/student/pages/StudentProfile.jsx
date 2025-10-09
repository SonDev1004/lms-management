import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import Topbar from '../components/Topbar.jsx';
import Header from '../components/Header.jsx';
import Tabs from '../components/Tabs.jsx';
import OverviewPanel from '../components/panels/OverviewPanel.jsx';
import CoursesPanel from '../components/panels/CoursesPanel.jsx';
import AttendancePanel from '../components/panels/AttendancePanel.jsx';
import GradesPanel from '../components/panels/GradesPanel.jsx';
import FeedbackPanel from '../components/panels/FeedbackPanel.jsx';

import EditStudentDialog from '@/features/academic_manager/list/student/components/EditStudentDialog.jsx';
import { mockStudents as STUDENTS } from '@/features/academic_manager/list/student/mocks/students.js';

import '../styles/student-profile.css';
import { letterFromScore } from '../utils/studentProfile.utils';

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const base = useMemo(() => STUDENTS.find((s) => s.id === id), [id]);
    const [stu, setStu] = useState(base);
    useEffect(() => setStu(base), [base]);

    const [tab, setTab] = useState('overview');
    const [openEdit, setOpenEdit] = useState(false);

    const goBack = () => {
        if (location.key !== 'default') navigate(-1);
        else navigate('/staff/student-manager');
    };

    const listCourses = useMemo(() => {
        if (!stu) return [];
        const codes = stu.courses || [];
        const items = codes.map((code) => {
            const progress = stu?.progress?.[code];
            const g = stu?.grades?.[code];
            const total =
                g?.total ??
                (g &&
                Number.isFinite(g.midterm) &&
                Number.isFinite(g.final) &&
                Number.isFinite(g.assignments)
                    ? Math.round((g.midterm + g.final + g.assignments) / 3)
                    : null);
            return { code, progress, letter: total != null ? letterFromScore(total) : '', ...g, total };
        });

        if (!items.some((i) => i.progress != null) && codes.length) {
            const fallback = {
                CS101: { progress: 85, letter: 'A-' },
                MATH201: { progress: 72, letter: 'B+' },
                PHYS101: { progress: 90, letter: 'A' },
            };
            return codes.map((c) => ({ code: c, ...(fallback[c] || { progress: 0, letter: '' }) }));
        }
        return items;
    }, [stu]);

    if (!stu) {
        return (
            <div className="sp-page">
                <Topbar onBack={goBack} />
                <div className="sp-card">Student not found.</div>
            </div>
        );
    }

    return (
        <div className="sp-page">
            <Topbar onBack={goBack} student={stu} />
            <Header student={stu} onEdit={() => setOpenEdit(true)} />
            <Tabs active={tab} onChange={setTab} />

            {tab === 'overview'   && <OverviewPanel courses={listCourses} />}
            {tab === 'courses'    && <CoursesPanel  courses={listCourses} />}
            {tab === 'attendance' && <AttendancePanel student={stu} />}
            {tab === 'grades'     && <GradesPanel student={stu} courses={listCourses} />}
            {tab === 'feedback'   && <FeedbackPanel student={stu} />}

            <EditStudentDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                student={stu}
                onSaved={(newStu) => setStu((s) => ({ ...s, ...newStu }))}
            />
        </div>
    );
}
