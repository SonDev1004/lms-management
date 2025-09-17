// src/features/program/hooks/useProgramDetail.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailProgram } from "@/features/program/api/programService.js";

export default function useProgramDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toastRef = useRef(null);

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Scroll top khi đổi id
    useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);

    // Fetch detail
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getDetailProgram(id);
                if (!mounted) return;
                if (!data) { setError("Không tìm thấy chương trình."); return; }
                setProgram(data);
            } catch (e) {
                console.error(e);
                if (mounted) setError("Có lỗi khi tải dữ liệu. Vui lòng thử lại.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    // Lọc course theo trackCode
    const loadCoursesByTrack = useCallback(async (track) => {
        if (!program || !track) return [];
        const all = program.subjects.flatMap((s) => s.courses || []);
        const code = (track.code || "").trim().toLowerCase();
        return all
            .filter((c) => (c.trackCode || "").trim().toLowerCase() === code)
            .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
    }, [program]);

    // Tư vấn
    const onConsult = useCallback(() => {
        toastRef.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Chúng tôi sẽ liên hệ với bạn trong 24h",
        });
    }, []);

    // Đăng ký theo track (program-level)
    const onRegisterTrack = useCallback((trackCode) => {
        const t = program?.tracks?.find((x) => x.code === trackCode);
        if (!t) {
            toastRef.current?.show({ severity: "warn", summary: "Không tìm thấy lịch", detail: "Vui lòng chọn lại." });
            return;
        }
        navigate("/dang-ky", {
            state: {
                selectedItem: {
                    type: "program",
                    programId: program.id,
                    trackCode,
                    title: `${program.title} - ${t.label}`,
                    price: program.fee,
                    meta: { track: t },
                },
            },
        });
    }, [navigate, program]);

    // Đăng ký course (course-level)
    const onSelectCourse = useCallback((course) => {
        navigate("/dang-ky", {
            state: {
                selectedItem: {
                    type: "course",
                    courseId: course.id,
                    title: course.title,
                    price: program.fee, // nếu sau này fee theo course, cập nhật tại đây
                    meta: {
                        programId: program.id,
                        programTitle: program.title,
                        courseCode: course.code?.trim?.(),
                        trackCode: course.trackCode,
                        startDate: course.startDate,
                        schedule: course.schedule,
                    },
                },
            },
        });
    }, [navigate, program]);

    const goBack = useCallback(() => navigate(-1), [navigate]);

    return {
        // state
        program, loading, error, toastRef,
        // handlers
        onConsult, onRegisterTrack, onSelectCourse, loadCoursesByTrack, goBack,
    };
}
