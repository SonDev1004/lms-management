import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import { clearAssessment } from '../api/assessmentApi';

export default function Landing(){
    useEffect(()=>{ clearAssessment(); },[]);
    return <Hero/>;
}