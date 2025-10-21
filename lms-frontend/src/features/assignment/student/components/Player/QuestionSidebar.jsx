import React from 'react';
import { Badge } from 'primereact/badge';

export default function QuestionSidebar({ questions, current, onJump, answeredCount }) {
    return (
        <aside className="as-sidebar">
            <div className="as-sidebar__head">
                <div className="as-sidebar__title">Questions</div>
                <div className="as-progress">
                    <div className="as-progress__bar" style={{ width: `${Math.round((answeredCount / questions.length) * 100)}%` }} />
                </div>
                <small>{answeredCount} of {questions.length} answered</small>
            </div>

            <div className="as-sidebar__grid">
                {questions.map((q) => (
                    <button
                        key={q.id}
                        className={`as-qbtn ${current === q.index ? 'is-active' : ''} ${q.answer && (Array.isArray(q.answer) ? q.answer.length>0 : (typeof q.answer==='string'? q.answer.trim().length>0: q.answer!==null)) ? 'is-answered' : ''}`}
                        onClick={() => onJump(q.index)}
                    >
                        {q.index}
                        {q.flags?.flagged && <Badge value=" " severity="warning" className="as-flag" title="Flagged" />}
                    </button>
                ))}
            </div>


        </aside>
    );
}
