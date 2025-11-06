import React, { useState } from 'react';
import { Button } from 'primereact/button';

export default function SubjectOutline({ outline = [], subject }) {
    const hasSyllabus = Array.isArray(subject?.syllabus) && subject.syllabus.length > 0;
    const [openAll, setOpenAll] = useState(true);

    return (
        <section className="sd-card">
            <div className="flex align-items-center justify-content-between">
                <h3 className="sd-h3">Course Syllabus</h3>
                <Button
                    icon={`pi ${openAll ? 'pi-angle-up' : 'pi-angle-down'}`}
                    label={openAll ? 'Collapse all' : 'Expand all'}
                    className="p-button-text"
                    onClick={() => setOpenAll(v => !v)}
                />
            </div>

            {hasSyllabus ? (
                <ul className="sd-acc">
                    {subject.syllabus.map((wk, i) => (
                        <li key={i} className={`sd-acc__item ${openAll ? 'is-open' : ''}`}>
                            <button
                                className="sd-acc__head"
                                onClick={e => e.currentTarget.parentElement.classList.toggle('is-open')}
                            >
                                <b>Week {wk.week}</b> - {wk.title}
                                <i className="pi pi-chevron-down" />
                            </button>
                            <div className="sd-acc__body">
                                <ul className="sd-acc__bullets">
                                    {(wk.points || []).map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <h4 className="sd-h4">Learning Outcomes</h4>
                    <ul className="sd-list">
                        {outline.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </>
            )}
        </section>
    );
}
