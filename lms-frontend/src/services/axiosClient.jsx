import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
}

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: 'http://14.225.198.117:8081/api/', // Change to your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: set a timeout for requests
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage (or cookies, context, etc.)
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.code === 1006 &&
            error.response.data.message === 'Unauthenticated' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err))
            }
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const response = await axiosClient.post('auth/refresh', {refreshToken});
                const accessToken = response.data.result.accessToken;

                localStorage.setItem('accessToken', accessToken);
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear()
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
)

export default axiosClient;