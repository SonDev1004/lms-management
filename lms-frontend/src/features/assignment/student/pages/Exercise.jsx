import React, { useEffect, useMemo, useReducer } from 'react';
import TopBar from '../components/Player/TopBar';
import QuestionSidebar from '../components/Player/QuestionSidebar';
import QuestionRenderer from '../components/Player/QuestionRenderer';
import PlayerLayout from '../components/Player/PlayerLayout';
import { Button } from 'primereact/button';
import { assessmentMock } from '../mocks/assessment.mock';
import { fetchAssessment, saveAssessment } from '../api/assessmentApi';
import '../styles/assignment.css';
import { useNavigate } from 'react-router-dom';

const initState = (persisted) => {
    const base = persisted || assessmentMock;
    return {
        id: base.id,
        title: base.title,
        durationMinutes: base.durationMinutes,
        startedAt: Date.now(),
        timeLeftSec: base.durationMinutes*60,
        questions: base.questions,
        currentIndex: 1,
        submitting: false,
    };
};

function reducer(state, action){
    switch(action.type){
        case 'tick':
            return { ...state, timeLeftSec: Math.max(0, state.timeLeftSec-1) };
        case 'jump':
            return { ...state, currentIndex: action.index };
        case 'answer': {
            const next = state.questions.map((q)=> q.index===state.currentIndex ? { ...q, answer: action.value } : q);
            return { ...state, questions: next };
        }
        case 'clear': {
            const next = state.questions.map((q)=> q.index===state.currentIndex ? { ...q, answer: Array.isArray(q.answer)?[]: (typeof q.answer==='string'?'':null) } : q);
            return { ...state, questions: next };
        }
        case 'flag': {
            const next = state.questions.map((q)=> q.index===state.currentIndex ? { ...q, flags: { ...q.flags, flagged: !q.flags.flagged } } : q);
            return { ...state, questions: next };
        }
        case 'persisted':
            return initState(action.payload);
        default:
            return state;
    }
}

export default function Exercise(){
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, null, ()=>initState(null));

    // load persisted if any
    useEffect(()=>{
        fetchAssessment().then((persisted)=>{ if(persisted) dispatch({type:'persisted', payload: persisted}); });
    },[]);

    // timer
    useEffect(()=>{
        if(state.timeLeftSec<=0) return;
        const id = setInterval(()=> dispatch({type:'tick'}), 1000);
        return ()=> clearInterval(id);
    }, [state.timeLeftSec]);

    // autosave
    useEffect(()=>{ saveAssessment(state); }, [state]);

    const current = useMemo(()=> state.questions.find(q=> q.index===state.currentIndex), [state]);
    const answeredCount = useMemo(()=> state.questions.filter((q)=>{
        const v = q.answer;
        if (Array.isArray(v)) return v.length>0;
        if (typeof v==='string') return v.trim().length>0;
        return v!==null && v!==undefined;
    }).length, [state.questions]);

    const timeLeft = useMemo(()=>{
        const m = Math.floor(state.timeLeftSec/60).toString().padStart(2,'0');
        const s = (state.timeLeftSec%60).toString().padStart(2,'0');
        return `${m}:${s}`;
    }, [state.timeLeftSec]);

    const next = () => dispatch({ type:'jump', index: Math.min(state.currentIndex+1, state.questions.length) });
    const prev = () => dispatch({ type:'jump', index: Math.max(1, state.currentIndex-1) });

    const onSubmit = () => {
        // mimic submit; you can call real API here
        navigate('/assignment/student');
    };

    return (
        <div className="as-container">
            <TopBar title={state.title} timeLeft={timeLeft} onLeave={()=>navigate('/assignment/student')} />
            <div className="as-content">
                <PlayerLayout
                    sidebar={<QuestionSidebar questions={state.questions} current={state.currentIndex} onJump={(i)=>dispatch({type:'jump', index:i})} answeredCount={answeredCount} />}
                    main={<QuestionRenderer
                        question={current}
                        onAnswer={(v)=>dispatch({type:'answer', value:v})}
                        onClear={()=>dispatch({type:'clear'})}
                        onSave={()=>saveAssessment(state)}
                        onFlag={()=>dispatch({type:'flag'})}
                    />}
                    footer={
                        <div className="as-footer">
                            <Button label="Previous" icon="pi pi-chevron-left" className="p-button-text" onClick={prev} />
                            {state.currentIndex<state.questions.length ? (
                                <Button label="Next" iconPos="right" icon="pi pi-chevron-right" className="as-next" onClick={next} />
                            ) : (
                                <Button label="Submit Exercise" className="as-submit" onClick={onSubmit} />
                            )}
                        </div>
                    }
                />
            </div>
        </div>
    );
}