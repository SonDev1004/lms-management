import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { programs } from "@/mocks/homeDataMock.js";
import ProgramHero from "../components/ProgramHero";
import ProgramSteps from "../components/ProgramSteps";
import ProgramTracks from "../components/ProgramTracks";
import ProgramDetails from "../components/ProgramDetails";

const ProgramDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const program = programs?.[id];

    if (!program) {
        return (
            <div className="p-6 text-center">
                <h2>Không tìm thấy chương trình</h2>
                <button className="p-button" onClick={() => navigate("/")}>
                    Về trang chủ
                </button>
            </div>
        );
    }

    const onConsult = () => {
        toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Chúng tôi sẽ liên hệ với bạn trong 24h",
        });
    };

    const onRegisterTrack = (trackId) => {
        const selectedTrack = program.tracks.find((t) => t.id === trackId);
        if (!selectedTrack) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Không tìm thấy lịch',
                detail: 'Vui lòng chọn lại.',
            });
            return;
        }

        const payload = {
            type: 'program',
            programId: program.id,
            trackId,
            title: `${program.title} - ${selectedTrack.label}`,
            price: program.price,
            startDate: selectedTrack.start,
            schedule: `${selectedTrack.dow} ${selectedTrack.time}`,
            meta: { totalHours: program.totalHours, track: selectedTrack },
        };

        // 👉 Điều hướng sang trang Đăng ký (enrollment)
        navigate('/dang-ky', { state: { selectedItem: payload } });
    };
    return (
        <div className="p-4">
            <Toast ref={toast} />
            <div className="max-w-6xl mx-auto">
                <ProgramHero program={program} onConsult={onConsult} />

                <ProgramSteps steps={program.steps} />

                <div className="grid">
                    <div className="col-12 md:col-8">
                        {/* Có thể đặt Steps ở đây nếu muốn, nhưng UI hiện giữ như trên */}
                        <Divider />
                        <ProgramDetails details={program.details} />
                    </div>
                    <div className="col-12 md:col-4">
                        <ProgramTracks
                            tracks={program.tracks}
                            onRegisterTrack={onRegisterTrack}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetail;
