import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Exercise from './Exercise';

export default function AssignmentStudentRoutes() {
    return (
        <Routes>
            <Route path="/assignment/student" element={<Landing />} />
            <Route path="/assignment/student/exercise" element={<Exercise />} />
            <Route path="*" element={<Navigate to="/assignment/student" replace />} />
        </Routes>
    );
}
