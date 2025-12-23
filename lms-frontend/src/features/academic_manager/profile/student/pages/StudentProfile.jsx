import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Topbar from "../components/Topbar.jsx";
import Header from "../components/Header.jsx";
import Tabs from "../components/Tabs.jsx";
import OverviewPanel from "../components/panels/OverviewPanel.jsx";
import CoursesPanel from "../components/panels/CoursesPanel.jsx";
import AttendancePanel from "../components/panels/AttendancePanel.jsx";
import GradesPanel from "../components/panels/GradesPanel.jsx";
import FeedbackPanel from "../components/panels/FeedbackPanel.jsx";

import userAdminService from "@/features/admin/api/userAdminService.js";

import "../styles/student-profile.css";

export default function StudentProfile() {
    const { id } = useParams(); // userId
    const navigate = useNavigate();
    const location = useLocation();

    const [stu, setStu] = useState(null);
    const [courses, setCourses] = useState([]);

    const [tab, setTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceOverview, setAttendanceOverview] = useState(null);
    const [attendanceDetails, setAttendanceDetails] = useState([]);

    const goBack = () => {
        if (location.key !== "default") navigate(-1);
        else navigate("/staff/student-manager");
    };

    // Load profile + courses
    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const [profile, courseList] = await Promise.all([
                    userAdminService.getStaffStudentProfile(id),
                    userAdminService.getStaffStudentCourses(id),
                ]);

                if (!alive) return;

                setStu({
                    id: String(profile.id),
                    userName: profile.userName,
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    isActive: profile.isActive,
                    roleName: profile.roleName,
                });

                setCourses(Array.isArray(courseList) ? courseList : []);
            } catch (e) {
                if (alive) setStu(null);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    // default selected course
    useEffect(() => {
        if (!courses?.length) return;
        if (selectedCourseId != null) return;
        setSelectedCourseId(courses[0]?.courseId ?? null);
    }, [courses, selectedCourseId]);

    // Load attendance overview + details when in Attendance tab
    useEffect(() => {
        let alive = true;

        if (tab !== "attendance") return;
        if (!selectedCourseId) return;

        (async () => {
            setAttendanceLoading(true);
            try {
                const [ov, dt] = await Promise.all([
                    userAdminService.getStaffStudentAttendanceOverview(id, selectedCourseId),
                    userAdminService.getStaffStudentAttendanceDetails(id, selectedCourseId),
                ]);

                if (!alive) return;
                setAttendanceOverview(ov || null);
                setAttendanceDetails(Array.isArray(dt) ? dt : []);
            } catch {
                if (!alive) return;
                setAttendanceOverview(null);
                setAttendanceDetails([]);
            } finally {
                if (alive) setAttendanceLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [tab, id, selectedCourseId]);

    const listCourses = useMemo(() => {
        return (courses || []).map((c) => ({
            courseId: c.courseId,
            code: c.code,
            title: c.title,
            status: c.status,
            startDate: c.startDate,
            endDate: c.endDate,
        }));
    }, [courses]);

    if (loading) {
        return (
            <div className="sp-page">
                <Topbar onBack={goBack} />
                <div className="sp-card">Loading...</div>
            </div>
        );
    }

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
            <Header student={stu} onEdit={() => {}} />
            <Tabs active={tab} onChange={setTab} />

            {tab === "overview" && <OverviewPanel courses={listCourses} />}
            {tab === "courses" && <CoursesPanel courses={listCourses} />}
            {tab === "attendance" && (
                <AttendancePanel
                    student={stu}
                    courses={listCourses}
                    overview={attendanceOverview}
                    details={attendanceDetails}
                    selectedCourseId={selectedCourseId}
                    onCourseChange={setSelectedCourseId}
                    loading={attendanceLoading}
                />
            )}
            {tab === "grades" && <GradesPanel student={stu} courses={listCourses} />}
            {tab === "feedback" && <FeedbackPanel student={stu} />}
        </div>
    );
}
