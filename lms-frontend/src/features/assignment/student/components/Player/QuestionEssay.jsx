import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import QuestionFrame from './QuestionFrame';

export default function QuestionEssay({ question, onAnswer, onClear, onSave, onFlag }){
    const count = (question.answer||'').trim().split(/\s+/).filter(Boolean).length;
    const helper = `Recommended: ${question.minWords}-${question.maxWords} words`;
    return (
        <QuestionFrame meta={question.meta} badge={question.meta.badge} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <InputTextarea autoResize rows={10} className="w-full" placeholder="Write your response here..." value={question.answer||''} onChange={(e)=>onAnswer(e.target.value)} />
            <div className="as-essay__meta">
                <small className="p-text-secondary">{helper}</small>
                <small className={`p-text-secondary ${count>question.maxWords?'text-red-500':''}`}>{count} words</small>
            </div>
        </QuestionFrame>
    );
}