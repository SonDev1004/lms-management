export const fetchAssignments = (courseId, studentId) => {
    const assignments = [
        {id: 'a1', title: 'Reading - Week 2', due: '2025-08-10', studentStatus: 'not_submitted'},
        {id: 'a2', title: 'Writing Task 1', due: '2025-08-05', studentStatus: 'graded', grade: 7.5},
        {id: 'a3', title: 'Listening Quiz 1', due: '2025-08-12', studentStatus: 'submitted'},
        {id: 'a4', title: 'Speaking Practice 1', due: '2025-08-15', studentStatus: 'not_submitted'},
        {id: 'a5', title: 'Grammar Quiz - Tenses', due: '2025-08-18', studentStatus: 'submitted'},
        {id: 'a6', title: 'Vocabulary Assignment - Week 3', due: '2025-08-20', studentStatus: 'graded', grade: 8.0},
        {id: 'a7', title: 'Reading Comprehension Test', due: '2025-08-22', studentStatus: 'not_submitted'},
        {id: 'a8', title: 'Essay Writing - Task 2', due: '2025-08-25', studentStatus: 'graded', grade: 6.5},
        {id: 'a9', title: 'Listening Quiz 2', due: '2025-08-27', studentStatus: 'submitted'},
        {id: 'a10', title: 'Speaking Mock Test', due: '2025-08-30', studentStatus: 'not_submitted'},
        {id: 'a11', title: 'Final Writing Exam', due: '2025-09-02', studentStatus: 'graded', grade: 7.0},
        {id: 'a12', title: 'Midterm Reading Exam', due: '2025-09-05', studentStatus: 'not_submitted'},
        {id: 'a13', title: 'Listening Dictation', due: '2025-09-07', studentStatus: 'submitted'}
    ];

    return new Promise((resolve) => {
        setTimeout(() => resolve(assignments), 400);
    });
};
