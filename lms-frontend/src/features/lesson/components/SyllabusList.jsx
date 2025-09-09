import React from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";

export default function SyllabusList({ course, syllabusData, onOpenDetail }) {
    return (
        <div className="syllabus-list p-d-flex p-flex-column p-mt-2">
            {syllabusData.map((item, idx) => {
                const isCurrent =
                    idx === Math.max(0, Math.min(syllabusData.length - 1, (course?.lessonsCompleted ?? 1) - 1));

                return (
                    <Panel
                        key={item.id}
                        className={`syllabus-card ${isCurrent ? "current" : ""}`}
                        header={
                            <div className="p-d-flex p-jc-between p-ai-center syllabus-card-main">
                                <div className="p-d-flex p-ai-center" style={{ gap: 10 }}>
                                    <strong className="syllabus-title" style={{ fontSize: 16 }}>{item.title}</strong>
                                </div>
                                <div className="syllabus-actions p-d-flex p-ai-center" role="group" aria-label="Hành động tuần">
                                    <Button
                                        icon="pi pi-eye"
                                        className="p-button-rounded p-button-text cd-icon-btn"
                                        onClick={() => onOpenDetail?.(item)}
                                        aria-label="Xem chi tiết"
                                    />
                                </div>
                            </div>
                        }
                    >
                        <div className="p-p-2 small-muted" style={{ fontSize: 13 }}>
                            {item.desc && item.desc.length > 0
                                ? item.desc
                                : "Nhấn xem chi tiết để mở cửa sổ chứa mô tả, mục tiêu và tài liệu."}
                        </div>
                    </Panel>
                );
            })}
        </div>
    );
}
