// src/features/subject/components/SubjectOutline.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';

const SubjectOutline = ({ outline = [] }) => {
    if (!outline.length) return null;

    return (
        <Card className="mb-4">
            <Panel header="Nội dung / Bố cục môn học" toggleable>
                <div className="grid">
                    {outline.map((item, index) => (
                        <div key={index} className="col-12 md:col-6 lg:col-3">
                            <div className="flex align-items-center gap-2 mb-2">
                                <div className="w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center">
                                    <span className="text-white text-sm font-bold">{index + 1}</span>
                                </div>
                                <span className="font-semibold text-900">{item}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>
        </Card>
    );
};

export default SubjectOutline;
