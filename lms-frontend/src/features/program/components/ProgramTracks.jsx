// src/features/program/components/ProgramTracks.jsx
import React, { useState, useCallback } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import TrackCoursesDialog from "./TrackCoursesDialog";

/** Ghép loader mặc định: lọc courses theo trackCode (trim + lowercase an toàn) */
const defaultLoadCourses =
    (subjects = []) =>
        async (track) => {
            const all = subjects.flatMap((s) => s.courses || []);
            const code = (track?.code || "").trim().toLowerCase();
            return all
                .filter((c) => (c.trackCode || "").trim().toLowerCase() === code)
                .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
        };

/** UI: danh sách lịch học (track) + popup xem lớp theo lịch */
const ProgramTracks = ({
                           title = "Chọn Lịch Học",
                           tracks = [],                // [{ code, label }]
                           subjects = [],              // để fallback loadCourses
                           loadCourses,                // async (track) => Course[]
                           onRegisterTrack,            // (trackCode) => void
                           onSelectCourse,             // (course) => void
                       }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const loadCoursesImpl = useCallback(
        loadCourses || defaultLoadCourses(subjects),
        [loadCourses, subjects]
    );

    const openDialog = (track) => {
        setSelectedTrack(track);
        setDialogOpen(true);
    };

    if (!tracks?.length) {
        return (
            <Card className="shadow-2 border-round-2xl">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-700 mb-3">Hiện chưa có lịch học nào cho chương trình này.</p>
                <Button
                    label="Nhận tư vấn lịch học"
                    icon="pi pi-phone"
                    className="w-full"
                    onClick={() => openDialog(null)}
                    disabled
                />
            </Card>
        );
    }

    return (
        <div className="mb-5">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            <div className="flex flex-column gap-3">
                {tracks.map((t) => (
                    <Card
                        key={t.code}
                        className="shadow-2 border-round-2xl"
                        title={
                            <div className="flex align-items-center justify-content-between gap-3">
                                <div className="flex flex-column">
                                    <span className="text-xl font-bold text-primary">{t.label}</span>
                                    <small className="text-600 mt-1">
                                        <Tag value={`Mã lịch: ${t.code}`} severity="info" rounded />
                                    </small>
                                </div>
                                <div className="hidden md:flex gap-2">
                                    <Button
                                        label="Xem lớp"
                                        icon="pi pi-search"
                                        outlined
                                        onClick={() => openDialog(t)}
                                    />
                                    <Button
                                        label="Đăng ký"
                                        icon="pi pi-shopping-cart"
                                        onClick={() => onRegisterTrack?.(t.code)}
                                    />
                                </div>
                            </div>
                        }
                    >
                        {/* CTA cho mobile (stack dọc) */}
                        <div className="flex md:hidden gap-2 mt-2">
                            <Button
                                label="Xem lớp"
                                icon="pi pi-search"
                                outlined
                                className="w-6"
                                onClick={() => openDialog(t)}
                            />
                            <Button
                                label="Đăng ký"
                                icon="pi pi-shopping-cart"
                                className="w-6"
                                onClick={() => onRegisterTrack?.(t.code)}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Popup xem lớp theo lịch */}
            <TrackCoursesDialog
                visible={dialogOpen}
                track={selectedTrack}
                onHide={() => setDialogOpen(false)}
                loadCourses={loadCoursesImpl}
                onSelectCourse={onSelectCourse}
            />
        </div>
    );
};

export default ProgramTracks;
