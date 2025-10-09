import React, { useState } from "react";
import { Button } from "primereact/button";

const SubjectOutline = ({ outline = [], subject }) => {
    const bullets = subject?.syllabus?.length ? subject.syllabus : outline;
    const [openAll, setOpenAll] = useState(true);

    return (
        <section className="sd-card border rounded-2xl p-4 mb-3 bg-white">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Course Syllabus</h3>
                <Button
                    icon={`pi ${openAll ? "pi-angle-up" : "pi-angle-down"}`}
                    label={openAll ? "Collapse all" : "Expand all"}
                    className="p-button-text"
                    onClick={() => setOpenAll(v => !v)}
                />
            </div>

            {Array.isArray(subject?.syllabus) && subject.syllabus.length > 0 ? (
                <ul className="mt-2">
                    {subject.syllabus.map((wk, i) => (
                        <li key={i} className="border-top-1 surface-border py-3">
                            <details open={openAll}>
                                <summary className="font-medium cursor-pointer">
                                    <b>Week {wk.week}</b> - {wk.title}
                                </summary>
                                <ul className="pl-4 mt-2 list-disc">
                                    {wk.points?.map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                            </details>
                        </li>
                    ))}
                </ul>
            ) : (
                // Nếu chỉ có outline dạng bullet
                <ul className="pl-4 mt-2 list-disc">
                    {bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
            )}
        </section>
    );
};

export default SubjectOutline;
