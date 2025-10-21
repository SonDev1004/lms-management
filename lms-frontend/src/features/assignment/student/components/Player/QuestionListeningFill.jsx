import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import QuestionFrame from './QuestionFrame';
import AudioPlayer from './AudioPlayer';

export default function QuestionListeningFill({ question, onAnswer, onClear, onSave, onFlag }){
    const [plays, setPlays] = useState(0);
    return (
        <QuestionFrame meta={question.meta} badge={`${question.meta.badge} • Max ${question.maxPlays} plays`} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <AudioPlayer src={question.audio} maxPlays={question.maxPlays} onPlayedChange={setPlays} />
            <InputText className="p-inputtext-lg w-full" placeholder={question.placeholder} value={question.answer||''} onChange={(e)=>onAnswer(e.target.value)} disabled={plays===0} />
            <small className="p-text-secondary mt-2 block">Answer is case-insensitive</small>
        </QuestionFrame>
    );
}