import React, { useState, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import TrackCoursesDialog from "./TrackCoursesDialog";

const defaultLoadCourses =
    (subjects = []) =>
        async (track) => {
            const all = subjects.flatMap((s) => s.courses || []);
            const code = String(track?.trackCode || track?.code || "")
                .trim()
                .toLowerCase();

            return all
                .filter(
                    (c) =>
                        String(c.trackCode || "")
                            .trim()
                            .toLowerCase() === code
                )
                .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
        };

const ENROLLING_CODE = 3;

function isCourseEnrolling(course) {
    if (!course) return false;

    if (typeof course.status === "number") {
        return course.status === ENROLLING_CODE;
    }

    if (typeof course.status === "string") {
        return course.status.toUpperCase() === "ENROLLING";
    }

    if (typeof course.statusName === "string") {
        return course.statusName.toUpperCase() === "ENROLLING";
    }

    return false;
}

function getTrackMeta(courses = []) {
    const hasAny = courses.length > 0;
    const hasOpen = courses.some(isCourseEnrolling);

    if (!hasAny) {
        return {
            canRegister: false,
            tagText: "No classes available",
            tagSeverity: "warning",
        };
    }

    if (!hasOpen) {
        return {
            canRegister: false,
            tagText: "Registration closed",
            tagSeverity: "secondary",
        };
    }

    return {
        canRegister: true,
        tagText: "Open for registration",
        tagSeverity: "success",
    };
}

/** UI: track list + dialog to view classes by track */
const ProgramTracks = ({
                           title = "Select Schedule",
                           tracks = [],
                           subjects = [],
                           loadCourses,
                           onRegisterTrack,
                           onSelectCourse,
                       }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const loadCoursesImpl = useCallback(
        loadCourses || defaultLoadCourses(subjects),
        [loadCourses, subjects]
    );

    const trackCoursesMap = useMemo(() => {
        const all = subjects.flatMap((s) => s.courses || []);
        const map = new Map();
        for (const c of all) {
            const code = (c.trackCode || "").trim().toLowerCase();
            if (!code) continue;
            if (!map.has(code)) map.set(code, []);
            map.get(code).push(c);
        }
        for (const [k, arr] of map.entries()) {
            arr.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
            map.set(k, arr);
        }
        return map;
    }, [subjects]);

    const openDialog = (track) => {
        setSelectedTrack(track);
        setDialogOpen(true);
    };

    if (!tracks?.length) {
        return (
            <Card className="shadow-2 border-round-2xl">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-700 mb-3">
                    No schedules available for this program.
                </p>
                <Button
                    label="Request consultation"
                    icon="pi pi-phone"
                    className="w-full"
                    disabled
                />
            </Card>
        );
    }

    return (
        <div className="mb-5">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            <div className="flex flex-column gap-3">
                {tracks.map((t) => {
                    const code = t.trackCode || t.code;
                    const label = t.trackLabel || t.label || code;
                    const codeKey = (t?.code || "").trim().toLowerCase();
                    const coursesOfTrack = trackCoursesMap.get(codeKey) || [];
                    const meta = getTrackMeta(coursesOfTrack);

                    return (
                        <Card
                            key={code}
                            title={
                                <div className="flex align-items-center justify-content-between gap-3">
                                    <div className="flex flex-column">
                                        <span className="text-xl font-bold text-primary">
                                            {label}
                                        </span>
                                        <small className="text-600 mt-1">
                                            <Tag
                                                value={`Schedule code: ${code}`}
                                                severity="info"
                                                rounded
                                            />
                                        </small>
                                    </div>

                                    <div className="hidden md:flex gap-2">
                                        <Button
                                            label="View classes"
                                            icon="pi pi-search"
                                            outlined
                                            onClick={() => openDialog(t)}
                                        />
                                        <Button
                                            label="Register"
                                            icon="pi pi-shopping-cart"
                                            onClick={() => onRegisterTrack?.(t.code)}
                                            disabled={!meta.canRegister}
                                            className={meta.canRegister ? "" : "p-button-secondary"}
                                            tooltip={
                                                meta.canRegister
                                                    ? ""
                                                    : "Registration not open yet or closed after session #3"
                                            }
                                            tooltipOptions={{ position: "top" }}
                                        />
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex md:hidden gap-2 mt-2">
                                <Button
                                    label="View classes"
                                    icon="pi pi-search"
                                    outlined
                                    className="w-6"
                                    onClick={() => openDialog(t)}
                                />
                                <Button
                                    label="Register"
                                    icon="pi pi-shopping-cart"
                                    className={`w-6 ${
                                        meta.canRegister ? "" : "p-button-secondary"
                                    }`}
                                    onClick={() => onRegisterTrack?.(t.code)}
                                    disabled={!meta.canRegister}
                                />
                            </div>
                        </Card>
                    );
                })}
            </div>

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
