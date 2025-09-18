import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const formatPrice = (price) =>
    typeof price === "number"
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
        : "—";

const SubjectCard = ({ subject }) => {
    const navigate = useNavigate();

    const {
        id,
        title = "Chủ đề chưa đặt tên",
        image,
        fee,
        isActive = true,
    } = subject ?? {};

    const cover = image || "/noimg.png"; // ảnh fallback
    const canView = Boolean(id);

    const goDetail = () => {
        if (canView) navigate(`/subject/${id}`);
    };

    return (
        <Card
            className="m-2 shadow-2 border-round-lg surface-card hover:shadow-4 transition-duration-200 cursor-pointer"
            style={{ minHeight: "320px" }}
            onClick={goDetail}
            aria-label={`Môn học: ${title}`}
            role="button"
        >
            {/* Ảnh: giữ tỉ lệ 16:9, bo góc */}
            <div className="mb-3 border-round overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/noimg.png")}
                />
            </div>

            <h4 className="text-900 font-bold mb-2 line-height-3 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {title}
            </h4>

            {/* Hàng tag: trạng thái bên trái, học phí bên phải */}
            <div className="flex justify-content-between align-items-center mb-3">
                <Tag
                    value={isActive ? "Đang mở" : "Tạm dừng"}
                    severity={isActive ? "success" : "warning"}
                    rounded
                />
                <Tag
                    value={`Từ ${formatPrice(Number(fee))}`}
                    severity="info"
                    rounded
                />
            </div>

            <Button
                label="Xem chi tiết"
                icon="pi pi-arrow-right"
                className="w-full"
                onClick={(e) => {
                    e.stopPropagation();
                    goDetail();
                }}
                disabled={!canView}
            />
        </Card>
    );
};

export default SubjectCard;
