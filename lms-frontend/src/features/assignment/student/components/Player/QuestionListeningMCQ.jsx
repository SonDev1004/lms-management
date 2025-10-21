import React, { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import QuestionFrame from './QuestionFrame';
import AudioPlayer from './AudioPlayer';

export default function QuestionListeningMCQ({ question, onAnswer, onClear, onSave, onFlag }){
    const [plays, setPlays] = useState(0);
    const value = question.answer;
    return (
        <QuestionFrame meta={question.meta} badge={`${question.meta.badge} • Max ${question.maxPlays} plays`} onClear={onClear} onSave={onSave} onFlag={onFlag}>
            <AudioPlayer src={question.audio} maxPlays={question.maxPlays} onPlayedChange={setPlays} />
            <div className="as-list">
                {question.options.map((opt, idx) => (
                    <label key={idx} className={`as-opt ${value===idx?'checked':''}`}>
                        <RadioButton name={`q${question.id}`} value={idx} onChange={()=>onAnswer(idx)} checked={value===idx} disabled={plays===0} />
                        <span>{opt}</span>
                    </label>
                ))}
            </div>
        </QuestionFrame>
    );
}
