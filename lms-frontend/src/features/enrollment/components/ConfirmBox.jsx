// src/features/enrollment/components/ConfirmBox.jsx
import React from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

const formatVND = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(v) || 0);

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

const ConfirmBox = ({ selectedItem, formatPrice = formatVND }) => {
    if (!selectedItem) return null;

    const isProgram = selectedItem.type === "program";
    const isSubject = selectedItem.type === "subject";

    // Dữ liệu chung
    const price = formatPrice(selectedItem.price);

    // Dữ liệu cho program/track
    const agg = selectedItem.meta?.aggregate ?? {};
    const courses = selectedItem.meta?.courses ?? [];

    // Dữ liệu cho subject/class
    const sMeta = selectedItem.meta ?? {};
    const sClass = sMeta.class;

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Xác Nhận Thông Tin</h2>

            {/* Thông tin tổng quan */}
            <Card className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <h3 className="text-xl font-bold text-primary mb-2">{selectedItem.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Tag value={isProgram ? "Chương trình" : "Môn học"} severity="info" />
                        </div>

                        {/* Chỉ hiển thị tổng quan track khi là program */}
                        {isProgram && (
                            <>
                                <p>
                                    <strong>Số lớp:</strong> {agg.courseCount ?? 0}
                                </p>
                                <p>
                                    <strong>Tổng số buổi:</strong> {agg.totalSessions ?? 0}
                                </p>
                                {(agg.startRange?.firstStartDate || agg.startRange?.lastStartDate) && (
                                    <p>
                                        <strong>Thời gian khai giảng:</strong>{" "}
                                        {formatDate(agg.startRange?.firstStartDate)}
                                        {agg.startRange?.lastStartDate ? ` - ${formatDate(agg.startRange?.lastStartDate)}` : ""}
                                    </p>
                                )}
                                {Array.isArray(agg.schedules) && agg.schedules.length > 0 && (
                                    <p>
                                        <strong>Lịch học:</strong> {agg.schedules.join(" | ")}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Giá */}
                    <div className="col-12 md:col-4 text-right">
                        <div className="text-3xl font-bold text-primary">{price}</div>
                    </div>
                </div>
            </Card>

            {/* Thông tin lớp đã chọn khi đăng ký theo subject */}
            {isSubject && sClass && (
                <Card className="mb-4">
                    <h4 className="text-lg font-bold mb-3">Thông tin lớp đã chọn</h4>
                    <div className="text-600 text-sm">
                        <div>
                            <strong>Môn học:</strong> {sMeta.subject?.title} ({sMeta.subject?.code})
                        </div>
                        <div>
                            <strong>Lớp:</strong> {sClass.title}{" "}
                            <span className="text-600">({sClass.code || "—"})</span>
                        </div>
                        <div>
                            <strong>Khai giảng:</strong> {formatDate(sClass.startDate)} {" • "}
                            <strong>Lịch học:</strong> {sClass.schedule || "—"}
                        </div>
                        <div>
                            <strong>Số buổi:</strong> {sClass.sessions ?? 0} {" • "}
                            <strong>Sức chứa:</strong> {sClass.capacity ?? 0}
                        </div>
                    </div>
                </Card>
            )}

            {/* Danh sách lớp trong track khi là program và có courses */}
            {isProgram && courses.length > 0 && (
                <Card>
                    <h4 className="text-lg font-bold mb-3">Danh sách lớp</h4>
                    <ul className="m-0 pl-3">
                        {courses.map((c) => (
                            <li key={c.id} className="mb-2">
                                <div className="font-medium">
                                    {c.title} <span className="text-600">({c.code})</span>
                                </div>
                                <div className="text-600 text-sm">
                                    Khai giảng: {formatDate(c.startDate)} • Lịch: {c.schedule || "—"} •{" "}
                                    {c.sessions ?? 0} buổi
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </>
    );
};

export default ConfirmBox;
