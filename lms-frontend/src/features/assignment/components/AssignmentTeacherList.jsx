//Show danh sách các bài tập đã giao cho buổi học hôm đó
const AssignmentTeacherList = ({ sessionId, assignments = [] }) => {
    //Lọc các bài tập có session_id trùng với sessionId được truyền vào
    const sessionAssignment = assignments.filter(assignment => assignment.session_id === sessionId);

    //Nếu không có bài tập nào được giao thì show dòng return
    if (sessionAssignment.length === 0) {
        return <div>No assignments have been given for this session.</div>;
    }
    return (
        <ul>
            {sessionAssignment.map(asg => (
                <li key={asg.id}>
                    <b>{asg.title}</b> &nbsp;
                    (Due date: {new Date(asg.due_date).toLocaleDateString()} - Max score: {asg.max_score})
                </li>
            ))}
        </ul>);
}

export default AssignmentTeacherList;