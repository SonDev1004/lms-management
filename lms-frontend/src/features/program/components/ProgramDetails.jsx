// src/features/program/components/ProgramDetails.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';

const ProgramDetails = ({ details = [] }) => {
    if (!details.length) return null;

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Chi Tiết Từng Bước</h2>
            <Accordion multiple>
                {details.map((detail, index) => (
                    <AccordionTab key={index} header={`${index + 1}. ${detail.step}`}>
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <h5 className="text-primary">Mục tiêu</h5>
                                <p className="text-700">{detail.objective}</p>
                            </div>
                            <div className="col-12 md:col-4">
                                <h5 className="text-primary">Nội dung chính</h5>
                                <ul className="text-700">
                                    {detail.content?.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="col-12 md:col-4">
                                <h5 className="text-primary">Đầu ra</h5>
                                <p className="text-700">{detail.output}</p>
                            </div>
                        </div>
                    </AccordionTab>
                ))}
            </Accordion>
        </Card>
    );
};

export default ProgramDetails;
