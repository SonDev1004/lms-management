import React from "react";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const badge = (status = "") => {
    const k = status.toLowerCase();
    if (k.includes("full")) return <Tag severity="danger" value="Full" rounded />;
    if (k.includes("fill")) return <Tag severity="warning" value="Filling fast" rounded />;
    return <Tag severity="success" value="Open" rounded />;
};

const SubjectClassTable = ({ classes = [], onRegister }) => {
    return (
        <section className="sd-card border rounded-2xl p-4 bg-white">
            <h3 className="text-lg font-semibold mb-2">Sessions</h3>

            <div className="border surface-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-blue-50 text-900 font-semibold px-3 py-2">
                    <div className="col-4">Date &amp; Time</div>
                    <div className="col-3">Room / Zoom</div>
                    <div className="col-2">Capacity</div>
                    <div className="col-1">Status</div>
                    <div className="col-2">Action</div>
                </div>

                {classes.map((c) => (
                    <div key={c.courseId} className="grid grid-cols-12 px-3 py-3 border-top-1 surface-border">
                        <div className="col-4">
                            <div className="font-medium">{c.startDate}</div>
                            <div className="text-600 text-sm">{c.schedule}</div>
                        </div>
                        <div className="col-3">{c.place || c.room || "—"}</div>
                        <div className="col-2">{c.capacity || "—"}</div>
                        <div className="col-1">{badge(c.status || c.statusName)}</div>
                        <div className="col-2">
                            <Button
                                label={(c.status || "").toLowerCase().includes("full") ? "Full" : "Enroll"}
                                disabled={(c.status || "").toLowerCase().includes("full")}
                                onClick={() => onRegister?.(c.courseId, c.courseTitle, c.schedule, c.startDate)}
                            />
                        </div>
                    </div>
                ))}

                {(!classes || classes.length === 0) && (
                    <div className="p-3 text-center text-600">Chưa có lớp mở đăng ký.</div>
                )}
            </div>
        </section>
    );
};

export default SubjectClassTable;
