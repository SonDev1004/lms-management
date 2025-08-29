//Chuyển đổi tên roleName để hiển thị đúng đường dẫn URL.

const roleToRoute = (role) => {
    const map = {
        ADMIN_IT: "admin",
        STUDENT: "student",
        ACADEMIC_MANAGER: "staff",
        TEACHER: "teacher",
    };
    return map[role] || "";
}

export default roleToRoute;