import React from 'react';
import '../styles/subjectchip.css';

export default function SubjectChips({ list = [] }) {
    const shown = list.slice(0, 2);
    const extra = list.length - shown.length;

    return (
        <div className="course-chips">
            {shown.map((code) => (
                <span key={code} className="chip-pill">
                    {code}
                </span>
            ))}
            {extra > 0 && (
                <span className="chip-pill chip-more">
                    +{extra}
                </span>
            )}
        </div>
    );
}
