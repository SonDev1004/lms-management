import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import QuestionFrame from './QuestionFrame';

export default function QuestionMCQMultiple({ question, onAnswer, onClear, onSave, onFlag }){
    const value = question.answer || [];
    const toggle = (i) => {
        const set = new Set(value);
        if (set.has(i)) set.delete(i); else set.add(i);
        onAnswer(Array.from(set).sort());
    };
    return (
        <QuestionFrame meta={question.meta} badge={question.meta.badge} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <div className="as-list">
                {question.options.map((opt, idx) => (
                    <label key={idx} className={`as-opt ${value.includes(idx)?'checked':''}`}>
                        <Checkbox inputId={`q${question.id}_o${idx}`} onChange={() => toggle(idx)} checked={value.includes(idx)} />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
        </QuestionFrame>
    );
}
