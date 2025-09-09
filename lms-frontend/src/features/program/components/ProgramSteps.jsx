// src/features/program/components/ProgramSteps.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';

const ProgramSteps = ({ steps = [] }) => {
    const model = steps.map((s) => ({ label: s.label, command: () => {} }));

    return (
        <Card className="mb-4">
            <h2 className="text-2xl font-bold mb-4">Lộ Trình Học Tập</h2>
            <Steps model={model} activeIndex={0} className="mb-4" />
            <div className="bg-yellow-50 p-3 border-round border-left-3 border-yellow-500">
                <p className="text-sm text-700 m-0">
                    <i className="pi pi-info-circle mr-2" />
                    <strong>Lưu ý:</strong> Môn học tiếp theo sẽ tự động mở khi bạn hoàn thành môn trước đó.
                </p>
            </div>
        </Card>
    );
};

export default ProgramSteps;
