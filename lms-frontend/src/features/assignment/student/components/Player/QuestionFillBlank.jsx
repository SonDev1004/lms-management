import React from 'react';
import { InputText } from 'primereact/inputtext';
import QuestionFrame from './QuestionFrame';

export default function QuestionFillBlank({ question, onAnswer, onClear, onSave, onFlag }){
    return (
        <QuestionFrame meta={question.meta} badge={question.meta.badge} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <InputText className="p-inputtext-lg w-full" placeholder={question.placeholder} value={question.answer||''} onChange={(e)=>onAnswer(e.target.value)} />
            <small className="p-text-secondary mt-2 block">Answer is case-insensitive</small>
        </QuestionFrame>
    );
}
