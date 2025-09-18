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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Fetch detail
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDetailProgram(id);
        if (!mounted) return;
        if (!data) {
          setError("Không tìm thấy chương trình.");
          return;
        }
        setProgram(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Có lỗi khi tải dữ liệu. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Lọc course theo trackCode
  const loadCoursesByTrack = useCallback(
    async (track) => {
      if (!program || !track) return [];
      const all = program.subjects.flatMap((s) => s.courses || []);
      const code = (track.code || "").trim().toLowerCase();
      return all
        .filter((c) => (c.trackCode || "").trim().toLowerCase() === code)
        .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
    },
    [program],
  );

  // Tư vấn
  const onConsult = useCallback(() => {
    toastRef.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: "Chúng tôi sẽ liên hệ với bạn trong 24h",
    });
  }, []);

  // Đăng ký theo track
    const onRegisterTrack = useCallback((trackCode) => {
        const t = program?.tracks?.find((x) => x.code === trackCode);
        if (!t) {
            toastRef.current?.show({ severity: "warn", summary: "Không tìm thấy lịch", detail: "Vui lòng chọn lại." });
            return;
        }

        // Lấy toàn bộ course thuộc track
        const code = (trackCode || "").trim().toLowerCase();
        const coursesInTrack = (program?.subjects ?? [])
            .flatMap(s => (s.courses ?? []).map(c => ({ ...c, subjectId: s.id, subjectTitle: s.title })))
            .filter(c => (c.trackCode || "").trim().toLowerCase() === code);

        // Tính toán tổng hợp
        const byDate = (d) => (d ? new Date(d).getTime() : Number.POSITIVE_INFINITY);
        const startDates = coursesInTrack.map(c => c.startDate).filter(Boolean);
        const firstStart = startDates.length ? new Date(Math.min(...startDates.map(d => new Date(d)))).toISOString() : null;
        const lastStart  = startDates.length ? new Date(Math.max(...startDates.map(d => new Date(d)))).toISOString() : null;

        const schedules = Array.from(new Set(coursesInTrack.map(c => (c.schedule || "").trim()).filter(Boolean)));

        const statuses = coursesInTrack.reduce((acc, c) => {
            const k = (c.statusName || "UNKNOWN").toUpperCase();
            acc[k] = (acc[k] || 0) + 1;
            return acc;
        }, {});

        const totalSessions = coursesInTrack.reduce((sum, c) => sum + (Number(c.sessions) || 0), 0);
        const capacityTotal = coursesInTrack.reduce((sum, c) => sum + (Number(c.capacity) || 0), 0);

        const payload = {
            type: "program",
            programId: program.id,
            trackCode,
            title: `${program.title} - ${t.label}`,
            price: Number(program.fee) || 0,
            meta: {
                track: t,
                courses: coursesInTrack.map(c => ({
                    id: c.id,
                    title: c.title,
                    code: c.code,
                    startDate: c.startDate,
                    schedule: c.schedule,
                    sessions: c.sessions,
                    capacity: c.capacity,
                    statusName: c.statusName,
                    subjectId: c.subjectId,
                    subjectTitle: c.subjectTitle,
                })),
                aggregate: {
                    courseCount: coursesInTrack.length,
                    totalSessions,
                    startRange: { firstStartDate: firstStart, lastStartDate: lastStart },
                    schedules,
                    statuses,
                    capacityTotal,
                },
            },
        };

        console.log("Payload gửi sang /dang-ky:", payload);

        // 🚫 Tránh lồng thêm { payload } không cần thiết, để đồng bộ với các nơi khác
        navigate("/dang-ky", { state: { selectedItem: payload } });

    }, [navigate, program]);

  const goBack = useCallback(() => navigate(-1), [navigate]);

  return {
    // state
    program,
    loading,
    error,
    toastRef,
    // handlers
    onConsult,
    onRegisterTrack,
    loadCoursesByTrack,
    goBack,
  };
}
