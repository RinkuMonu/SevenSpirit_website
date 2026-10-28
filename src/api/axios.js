import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://api.sevenspirit.in/api/v1';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://api.sevenspirit.in';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

const api = axios.create({ baseURL: API_URL, timeout: 20000 });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && localStorage.getItem('token') && !url.startsWith('/auth/')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => {
  const data = e?.response?.data;
  if (typeof data === 'string' && data) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors) && data.errors.length) return data.errors[0]?.msg || data.errors[0]?.message || data.errors[0];
  if (data?.details) return data.details;
  return e?.message || 'Something went wrong. Please try again.';
};
export default api;
