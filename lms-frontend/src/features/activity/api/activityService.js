export const fetchActivities = (courseId, studentId) => {
    const activities = [
        {id: 'act1', date: new Date(Date.now() - 2 * 60 * 60 * 1000), text: 'GV đã tải lên: LessonView 02 - Reading'},
        {id: 'act2', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), text: 'GV đã bình luận: Writing Task 1'},
        {id: 'act3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), text: 'GV đã chấm điểm: Listening Quiz 1'},
        {id: 'act4', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), text: 'GV đã thêm: LessonView 03 - Vocabulary'},
        {id: 'act5', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Writing Task 2'},
        {id: 'act6', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), text: 'GV đã đăng: Pronunciation Audio'},
        {id: 'act7', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Grammar Quiz - Tenses'},
        {id: 'act8', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), text: 'GV đã bình luận: Essay Writing'},
        {id: 'act9', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), text: 'GV đã thêm: LessonView 05 - Listening'},
        {id: 'act10', date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), text: 'HS đã tham gia Speaking Mock Test'},
        {id: 'act11', date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), text: 'GV đã tải lên: Reading Comprehension Test'},
        {id: 'act12', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), text: 'GV đã chấm điểm: Vocabulary Assignment'},
        {id: 'act13', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), text: 'HS đã nộp: Listening Dictation'}
    ];

    return new Promise((resolve) => {
        setTimeout(() => resolve(activities), 300);
    });
};
