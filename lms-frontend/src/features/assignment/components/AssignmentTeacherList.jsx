//Show danh sách các bài tập đã giao cho buổi học hôm đó
const AssignmentTeacherList = ({ sessionId, assignments = [] }) => {
    //Lọc các bài tập có session_id trùng với sessionId được truyền vào
    const sessionAssignment = assignments.filter(assignment => assignment.session_id === sessionId);

    //Nếu không có bài tập nào được giao thì show dòng return
    if (sessionAssignment.length === 0) {
        return <div>Buổi học chưa có bài tập nào được giao.</div>;
    }
    return (
        <ul>
            {sessionAssignment.map(asg => (
                <li key={asg.id}>
                    <b>{asg.title}</b> &nbsp;
                    (Hạn nộp: {new Date(asg.due_date).toLocaleDateString()} - Điểm tối đa: {asg.max_score})
                </li>
            ))}
        </ul>);
}

export default AssignmentTeacherList;