import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";

const unwrap = (res) => res?.data?.result ?? res?.data ?? res;

const authApi = {
    forgotPassword(emailOrUsername) {
        return axiosClient
            .post(AppUrls.forgotPassword, { emailOrUsername })
            .then(unwrap);
    },

    resetPassword({ token, newPassword, confirmPassword }) {
        return axiosClient
            .post(AppUrls.resetPassword, { token, newPassword, confirmPassword })
            .then(unwrap);
    },

    changePassword({ oldPassword, newPassword, confirmPassword }) {
        return axiosClient
            .post(AppUrls.changePassword, { oldPassword, newPassword, confirmPassword })
            .then(unwrap);
    },
};

export default authApi;
