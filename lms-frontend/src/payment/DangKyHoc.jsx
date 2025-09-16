import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axiosClient from "@/shared/api/axiosClient";
import urls from "@/shared/constants/urls.js";

const DangKyHoc = () => {
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPrograms = await axiosClient.get(urls.listProgram);
                const resSubjects = await axiosClient.get(urls.listSubject);

                console.log("📌 Programs API:", resPrograms.data);
                console.log("📌 Subjects API:", resSubjects.data);

                setPrograms(resPrograms.data?.result?.items || []);
                setSubjects(resSubjects.data?.result?.items || []);
            } catch (err) {
                console.error("❌ Lỗi khi load dữ liệu:", err);
            }
        };
        fetchData();
    }, []);



    const handlePayment = async () => {
        console.log(urls.payment);
        try {
            const res = await axiosClient.post(urls.payment, {
                programId: selectedProgram,
                subjectId: selectedSubject,
                amount: 150000,
            });

            console.log("📌 API Response:", res.data);

            // check đúng chỗ
            if (res.data?.result?.paymentUrl) {
                window.location.href = res.data.result.paymentUrl;
            } else {
                alert("❌ Không nhận được URL thanh toán");
            }
        } catch (error) {
            console.error("❌ Lỗi khi tạo thanh toán:", error);
            alert("❌ Không tạo được thanh toán");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Đăng ký học</h2>
            <div className="p-fluid w-80">
                <div className="field">
                    <label>Chọn Chương trình</label>
                    <Dropdown
                        value={selectedProgram}
                        options={programs.map((p) => ({ label: p.title, value: p.id }))}
                        onChange={(e) => setSelectedProgram(e.value)}
                        placeholder="-- Chọn chương trình --"
                    />
                </div>
                <div className="field">
                    <label>Chọn Môn học</label>
                    <Dropdown
                        value={selectedSubject}
                        options={subjects.map((s) => ({ label: s.title, value: s.id }))}
                        onChange={(e) => setSelectedSubject(e.value)}
                        placeholder="-- Chọn môn học --"
                    />
                </div>
                <Button
                    label="Thanh toán"
                    onClick={handlePayment}
                    className="mt-4"
                    disabled={!selectedProgram && !selectedSubject}
                />
            </div>
        </div>
    );
};

export default DangKyHoc;
