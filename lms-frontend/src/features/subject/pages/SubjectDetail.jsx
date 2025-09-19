import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import { SubjectHero, SubjectOutline, SubjectClassTable } from '../components';
import { getSubjectDetail } from '@/features/subject/api/subjectService.js';

const SubjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                // Nếu backend cần số thì parseInt; nếu không cần thì giữ nguyên.
                const data = await getSubjectDetail(Number(id));
                if (!mounted) return;
                setSubject(data);
            } catch (e) {
                console.error(e);
                if (mounted) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Lỗi tải dữ liệu',
                        detail: 'Không thể tải chi tiết môn học.',
                    });
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const handleRegister = (courseId, className, schedule, startDate) => {
        if (!subject) return;

        const selectedClass = subject.classes?.find((c) => c.courseId === courseId);
        if (!selectedClass) {
            toast.current?.show({
                severity: "warn",
                summary: "Không tìm thấy lớp",
                detail: "Vui lòng chọn lại.",
            });
            return;
        }

        // ✅ Payload gọn, nhất quán với kiểu "subject"
        const payload = {
            type: "subject",
            subjectId: subject.id,
            // tiêu đề hiển thị cho người dùng
            title: `${subject.title} - ${className || selectedClass.courseTitle}`,
            price: Number(subject.fee) || 0,

            // Nếu bạn muốn giữ riêng “môn” và “lớp đã chọn” cho trang confirm render rõ ràng:
            meta: {
                subject: {
                    id: subject.id,
                    code: subject.code,
                    title: subject.title,
                    sessionNumber: subject.sessionNumber,
                },
                // lớp user đã chọn
                class: {
                    id: selectedClass.courseId,
                    title: selectedClass.courseTitle || className,
                    code: selectedClass.courseCode,
                    startDate: startDate ?? selectedClass.startDate,
                    schedule: schedule ?? selectedClass.schedule,
                    sessions: selectedClass.plannedSessions,
                    capacity: selectedClass.capacity,
                    status: selectedClass.status,
                    statusName: selectedClass.statusName,
                },
                // (tùy chọn) nếu muốn list toàn bộ lớp của môn để người dùng đối chiếu nhanh
                // classes: subject.classes
            },
        };

        console.log("Payload đăng ký (subject):", payload);
        navigate("/payment", { state: { selectedItem: payload } });
    };


    // Suy ra outline tạm từ description (mỗi dòng là 1 bullet), nếu muốn:
    const outline =
        subject?.description
            ?.split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean) ?? [];

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <div className="max-w-6xl mx-auto">
                {loading && <div className="text-600">Đang tải chi tiết môn học…</div>}

                {/* Chỉ render khi đã có subject */}
                {!loading && subject && (
                    <>
                        <SubjectHero subject={subject} />
                        <SubjectOutline outline={outline} />
                        <SubjectClassTable classes={subject.classes ?? []} onRegister={handleRegister} />
                    </>
                )}

                {!loading && !subject && (
                    <div className="text-center text-600">Không tìm thấy môn học.</div>
                )}
            </div>
        </div>
    );
};

export default SubjectDetail;
