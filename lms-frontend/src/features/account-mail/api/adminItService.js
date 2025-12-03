import axiosClient from "@/shared/api/axiosClient.js";
import {AppUrls} from "@/shared/constants/index.js";

/**
 * Tạo tài khoản mới cho user:
 * - Gán role theo roleId
 * - BE tự generate password tạm
 * - BE gửi mail luôn
 *
 * @param {{ userName: string, email: string, firstName: string, lastName: string, roleId: number }} payload
 * @returns {Promise<any>} user (UserResponse)
 */
export async function createUserAccount(payload) {
    const response = await axiosClient.post(
        AppUrls.createUser,
        payload
    );

    // ApiResponse<UserResponse>
    // { code, message, result }
    return response.data?.result;
}

/**
 * (Optional) load danh sách role để đổ vào Dropdown
 * Nếu bạn đã có API GET /api/admin-it/roles
 */
export async function fetchAllRoles() {
    const response = await axiosClient.get(AppUrls.getAllRoles);
    return response.data?.result || [];
}
