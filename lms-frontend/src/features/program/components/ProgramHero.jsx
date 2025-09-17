// src/features/program/components/ProgramHero.jsx
import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

const ProgramHero = ({ program, onConsult }) => {
    if (!program) return null;

    return (
        <Card className="shadow-3 border-round-2xl">
            {/* Đặt ảnh + nội dung CHUNG 1 GRID để không có khoảng trắng */}
            <div className="grid align-items-center md:align-items-start gap-3">
                {/* Ảnh: 5/12 – bo góc lớn, không ép chiều cao quá lớn */}
                <div className="col-12 md:col-5">
                    <img
                        src={program.image || "/noimg.png"}
                        alt={program.title}
                        className="w-full h-16rem md:h-18rem lg:h-20rem object-cover border-round-2xl shadow-2"
                    />
                </div>

                {/* Nội dung: 7/12 */}
                <div className="col-12 md:col-7">
                    <h1 className="text-3xl md:text-4xl font-bold text-900 mb-2">
                        {program.title}
                    </h1>

                    {program.description && (
                        <p className="text-700 line-height-3 mb-3">
                            {program.description}
                        </p>
                    )}

                    {/* Thông tin nhanh */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {program.code && <Tag value={`Mã: ${program.code}`} severity="info" rounded />}
                        {(program.minStudents || program.maxStudents) && (
                            <Tag
                                value={`Sĩ số: ${program.minStudents ?? "?"}-${program.maxStudents ?? "?"}`}
                                severity="warning"
                                rounded
                            />
                        )}
                        <Tag value={formatPrice(program.fee)} severity="success" rounded />
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            label="Nhận tư vấn miễn phí"
                            icon="pi pi-phone"
                            className="w-full md:w-auto p-button-lg p-button-outlined"
                            onClick={onConsult}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProgramHero;
