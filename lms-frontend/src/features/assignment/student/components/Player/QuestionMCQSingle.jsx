import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import QuestionFrame from './QuestionFrame';

export default function QuestionMCQSingle({ question, onAnswer, onClear, onSave, onFlag }){
    const value = question.answer;
    return (
        <QuestionFrame meta={question.meta} badge={question.meta.badge} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <div className="as-list">
                {question.options.map((opt, idx) => (
                    <label key={idx} className={`as-opt ${value===idx?'checked':''}`}>
                        <RadioButton inputId={`q${question.id}_o${idx}`} name={`q${question.id}`} value={idx} onChange={(e)=>onAnswer(idx)} checked={value===idx} />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
        </QuestionFrame>
    );
}