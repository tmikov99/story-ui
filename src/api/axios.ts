import axios from 'axios';
import { refreshToken } from './auth';
import { handleSessionExpired, handleSessionRefresh } from '../utils/sessionHelpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const PUBLIC_ENDPOINTS: { method?: string; pattern: RegExp }[] = [
  { method: 'GET', pattern: /^\/user\/[^/]+$/ },
  { method: 'POST', pattern: /^\/user\/forgot-password$/ },
  { method: 'POST', pattern: /^\/user\/reset-password$/ },
  { method: 'GET', pattern: /^\/story\/genres$/ },
  { method: 'GET', pattern: /^\/comments\/story\/[^/]+$/ },
  { method: 'POST', pattern: /^\/auth\/login$/ },
  { method: 'POST', pattern: /^\/auth\/logout$/ },
  { method: 'POST', pattern: /^\/auth\/register$/ },
  { method: 'GET', pattern: /^\/auth\/refresh$/ },
  { method: 'GET', pattern: /^\/auth\/verify$/ },
];

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

function isPublicEndpoint(url?: string, method?: string): boolean {
  if (!url || !method) return false;
  
  return PUBLIC_ENDPOINTS.some(({ pattern, method: m }) => {
    return pattern.test(url) && (!m || m === method.toUpperCase());
  });
}

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');

  if (token && !isPublicEndpoint(config.url, config.method)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.response.data.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await refreshToken();
        return handleSessionRefresh(res).then(() => {
          processQueue(null, res.token);
          originalRequest.headers["Authorization"] = `Bearer ${res.token}`;
          return axiosInstance(originalRequest);
        });
      } catch (err) {
        processQueue(err, null);
        return handleSessionExpired();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;