import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: 'http://14.225.198.117:8081/api/', // Change to your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
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

export default axiosClient;