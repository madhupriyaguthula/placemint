import axios from 'axios';
const BASE = 'http://localhost:3000/api';

const api = axios.create({ baseURL: BASE });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const register       = (d) => api.post('/auth/register', d);
export const login          = (d) => api.post('/auth/login', d);
export const getMe          = ()  => api.get('/auth/me');
export const saveProfile    = (d) => api.put('/auth/profile', d);
export const getLeetCode    = (u) => api.get(`/leetcode/${u}`);
export const getGitHub      = (u) => api.get(`/github/${u}`);
export const getCodeChef    = (u) => api.get(`/codechef/${u}`);
export const analyzeProfile = (d) => api.post('/analyze', d);