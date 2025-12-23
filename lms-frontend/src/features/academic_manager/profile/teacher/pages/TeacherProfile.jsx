import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import userAdminService from "@/features/admin/api/userAdminService.js";
import "../styles/teacher-profile.css";

function statusSeverity(isActive) {
    return isActive ? "success" : "danger";
}

export default function TeacherProfile() {
    const { id } = useParams(); // userId
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [profile, setProfile] = useState(null);
    const [courses, setCourses] = useState([]);

    const goBack = () => {
        if (location.key !== "default") navigate(-1);
        else navigate("/admin/teacher-list");
    };

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const [p, cs] = await Promise.all([
                    userAdminService.getStaffTeacherProfile(id),
                    userAdminService.getStaffTeacherCourses(id),
                ]);
                if (!alive) return;

                setProfile({
                    id: p?.id ?? id,
                    userName: p?.userName ?? "",
                    email: p?.email ?? "",
                    firstName: p?.firstName ?? "",
                    lastName: p?.lastName ?? "",
                    roleName: p?.roleName ?? "",
                    isActive: typeof p?.isActive === "boolean" ? p.isActive : true,
                });

                setCourses(Array.isArray(cs) ? cs : []);
            } catch (e) {
                if (!alive) return;
                setErr(e?.message || "Cannot load teacher profile.");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    const fullName = useMemo(() => {
        const fn = profile?.firstName?.trim() || "";
        const ln = profile?.lastName?.trim() || "";
        const name = `${fn} ${ln}`.trim();
        return name || profile?.userName || `Teacher #${id}`;
    }, [profile, id]);

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    if (err) {
        return (
            <div style={{ padding: 24 }}>
                <Button label="Back" icon="pi pi-arrow-left" outlined onClick={goBack} />
                <div style={{ marginTop: 12, color: "crimson" }}>{err}</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ padding: 24 }}>
                <Button label="Back" icon="pi pi-arrow-left" outlined onClick={goBack} />
                <div style={{ marginTop: 12 }}>Teacher not found.</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 1150, margin: "0 auto", display: "grid", gap: 16 }}>
            <div className="flex align-items-center justify-content-between flex-wrap gap-2">
                <Button label="Back" icon="pi pi-arrow-left" outlined onClick={goBack} />
                <div className="flex align-items-center gap-2">
                    <Tag value={profile.isActive ? "Active" : "Inactive"} severity={statusSeverity(profile.isActive)} />
                    <Tag value={profile.roleName || "TEACHER"} severity="info" />
                </div>
            </div>

            <Card>
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{fullName}</div>
                        <div className="text-500" style={{ marginTop: 6 }}>
                            <div><b>Email:</b> {profile.email || "--"}</div>
                            <div><b>Username:</b> {profile.userName || "--"}</div>
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="text-500">Teacher ID</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{profile.id}</div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex align-items-center justify-content-between mb-3">
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Courses</div>
                    <div className="text-500">{courses.length} course(s)</div>
                </div>

                <DataTable
                    value={courses}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage="No courses"
                    responsiveLayout="scroll"
                >
                    <Column field="code" header="Code" sortable style={{ width: 160 }} />
                    <Column field="title" header="Course" sortable />
                    <Column field="startDate" header="Start date" sortable style={{ width: 180 }} />
                    <Column field="status" header="Status" sortable style={{ width: 160 }} />
                </DataTable>
            </Card>
        </div>
    );
}
