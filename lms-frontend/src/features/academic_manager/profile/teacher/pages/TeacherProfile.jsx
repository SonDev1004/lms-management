import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';

import useTeacher from '../hooks/useTeacher';
import TeacherHeaderBar from '../components/TeacherHeaderBar';
import OverviewTab from '../components/OverviewTab';
import SubjectsTable from '../components/SubjectsTable';
import Timetable from '../components/Timetable';
import AttendanceTable from '../components/AttendanceTable';
import GradingTable from '../components/GradingTable';
import FeedbackList from '../components/FeedbackList';
import DocumentsTable from '../components/DocumentsTable';
import EditTeacherDialog from '../components/EditTeacherDialog';
import AssignClassDialog from '../components/AssignClassDialog';
import '../styles/teacher-profile.css';
import '../styles/TeacherHeaderBar.css';
const TAB_KEY = 'tp:lastTab';

export default function TeacherProfile() {
    const toast = useRef(null);
    const { id } = useParams();
    const { teacher, loading } = useTeacher(id);

    const [data, setData] = useState();
    const [error, setError] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);

    const [activeIndex, setActiveIndex] = useState(() => {
        const saved = Number(localStorage.getItem(TAB_KEY));
        return Number.isFinite(saved) ? saved : 0;
    });

    useEffect(() => {
        setData(teacher);
    }, [teacher]);

    const campuses = useMemo(() => {
        const set = new Set((teacher?.classes || []).map(c => c.campus).filter(Boolean));
        return Array.from(set);
    }, [teacher]);

    const handleSaveProfile = useCallback((form) => {
        try {
            setData(prev => ({ ...prev, ...form }));
            setEditOpen(false);
            toast.current?.show({ severity: 'success', summary: 'Saved', detail: 'Profile updated (mock).' });
        } catch (e) {
            setError('Failed to save profile.');
        }
    }, []);

    const handleAssign = useCallback((cls) => {
        try {
            const newClass = {
                id: `C-${Math.floor(Math.random() * 900 + 100)}`,
                ...cls
            };
            setData(prev => ({ ...prev, classes: [...(prev?.classes || []), newClass] }));
            setAssignOpen(false);
            toast.current?.show({ severity: 'success', summary: 'Assigned', detail: 'Class added (mock).' });
        } catch (e) {
            setError('Failed to assign class.');
        }
    }, []);

    const onTabChange = (e) => {
        setActiveIndex(e.index);
        localStorage.setItem(TAB_KEY, String(e.index));
    };

    if (loading) {
        return (
            <div className="tp-container">
                <div className="p-card p-4 mb-3">
                    <div className="flex gap-3">
                        <Skeleton shape="circle" size="4rem" />
                        <div className="flex-1">
                            <Skeleton width="40%" height="1.8rem" className="mb-2" />
                            <Skeleton width="25%" />
                        </div>
                    </div>
                </div>
                <Skeleton width="100%" height="2.75rem" className="mb-3" />
                <div className="grid" style={{ gap: '1rem' }}>
                    <Skeleton height="18rem" />
                    <Skeleton height="18rem" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tp-container">
                <div className="p-card p-4">
                    <h3>Something went wrong</h3>
                    <p className="muted">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="tp-container">No data.</div>;
    }

    const counts = {
        classes: data.classes?.length || 0,
        sessions: data.sessions?.length || 0,
        grading: data.grading?.length || 0,
        feedback: data.feedback?.length || 0,
        documents: data.documents?.length || 0
    };

    const TabLabel = ({ text, count }) => (
        <span>
      {text}
            {!!count && <span className="ml-2 chip">{count}</span>}
    </span>
    );

    return (
        <div className="tp-container">
            <Toast ref={toast} position="top-right" />
            <TeacherHeaderBar teacher={data} onEdit={() => setEditOpen(true)} />

            <TabView className="tp-tabs" activeIndex={activeIndex} onTabChange={onTabChange}>
                <TabPanel header="Overview">
                    <OverviewTab teacher={data} />
                </TabPanel>

                <TabPanel header={<TabLabel text="Subjects & Classes" count={counts.classes} />}>
                    <SubjectsTable classes={data.classes} onAssign={() => setAssignOpen(true)} />
                </TabPanel>

                <TabPanel header="Timetable">
                    <Timetable classes={data.classes} />
                </TabPanel>

                <TabPanel header={<TabLabel text="Attendance" count={counts.sessions} />}>
                    <AttendanceTable sessions={data.sessions} />
                </TabPanel>

                <TabPanel header={<TabLabel text="Grading" count={counts.grading} />}>
                    <GradingTable items={data.grading} />
                </TabPanel>

                <TabPanel header={<TabLabel text="Feedback" count={counts.feedback} />}>
                    <FeedbackList items={data.feedback} />
                </TabPanel>

                <TabPanel header={<TabLabel text="Documents" count={counts.documents} />}>
                    <DocumentsTable items={data.documents} />
                </TabPanel>
            </TabView>

            {editOpen && (
                <EditTeacherDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    value={data}
                    onSave={handleSaveProfile}
                />
            )}

            {assignOpen && (
                <AssignClassDialog
                    open={assignOpen}
                    onClose={() => setAssignOpen(false)}
                    onSave={handleAssign}
                    subjects={data.subjectsDetail || []}
                    campuses={campuses}
                />
            )}
        </div>
    );
}
