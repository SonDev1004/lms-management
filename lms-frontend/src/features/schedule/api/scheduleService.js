import axiosClient from "@/shared/api/axiosClient.js";
import urls from "@/shared/constants/urls.js";

export const fetchTeacherSchedule = (from, to) =>
    axiosClient.get(urls.teacherSchedule(from, to));

export const fetchStudentSchedule = (from, to) =>
    axiosClient.get(urls.studentSchedule(from, to));
