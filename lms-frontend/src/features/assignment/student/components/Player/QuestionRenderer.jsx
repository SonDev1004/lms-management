import React from 'react';
import QuestionMCQSingle from './QuestionMCQSingle';
import QuestionMCQMultiple from './QuestionMCQMultiple';
import QuestionFillBlank from './QuestionFillBlank';
import QuestionListeningMCQ from './QuestionListeningMCQ';
import QuestionListeningFill from './QuestionListeningFill';
import QuestionEssay from './QuestionEssay';

export default function QuestionRenderer(props){
    switch(props.question.type){
        case 'mcq-single': return <QuestionMCQSingle {...props} />;
        case 'mcq-multiple': return <QuestionMCQMultiple {...props} />;
        case 'fill-blank': return <QuestionFillBlank {...props} />;
        case 'listening-mcq': return <QuestionListeningMCQ {...props} />;
        case 'listening-fill': return <QuestionListeningFill {...props} />;
        case 'essay': return <QuestionEssay {...props} />;
        default: return null;
    }
}
