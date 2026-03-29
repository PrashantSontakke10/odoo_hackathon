import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Maps to corresponding express backend
});

// Interceptor to auto-inject JWT token to all protected route hits
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
