import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

// format tiền VND
const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
function getProgramStatus(program) {
    const isOpen = program?.is_active === 1 || program?.isActive === true;
    return isOpen
        ? { label: "Đang mở", severity: "success" }
        : { label: "Tạm dừng", severity: "danger" };
}
const ProgramCard = ({ program }) => {
    const navigate = useNavigate();

    const cover =
        program.imageUrl && program.imageUrl.trim() !== ""
            ? program.imageUrl
            : "/noimg.png";
    const status = getProgramStatus(program);
    return (
        <Card className="m-2 shadow-2 border-round-lg" style={{ minHeight: "300px" }}>
            <div className="text-center">
                <div style={{ position: "relative" }}>
                    <img
                        src={cover}
                        alt={program?.title}
                        className="w-full h-8rem object-cover border-round mb-3"
                        loading="lazy"
                    />
                    <Tag
                        value={status.label}
                        severity={status.severity}
                        rounded
                        className="text-xs"
                        style={{ position: "absolute", top: 8, left: 8 }}
                    />
                </div>
                <h4 className="text-900 font-bold mb-2">{program.title}</h4>

                {program.description && (
                    <p className="text-600 mb-3 line-height-3">{program.description}</p>
                )}

                <div className="flex justify-content-end align-items-center mb-3">
                    <Tag value={`Học phí ${formatPrice(program.fee)}`} severity="success" />
                </div>

                <Button
                    label="Xem chi tiết"
                    icon="pi pi-arrow-right"
                    className="w-full"
                    onClick={() => navigate(`/program/${program.id}`)}
                />
            </div>
        </Card>
    );
};

export default ProgramCard;
