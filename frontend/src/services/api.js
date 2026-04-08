import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('nexus-store');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    } catch {}
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nexus-store');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── User ──────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

// ── Career ────────────────────────────────────────────────────────
export const careerAPI = {
  predict: (data) => api.post('/career/predict', data),
};

// ── Simulation ────────────────────────────────────────────────────
export const simulationAPI = {
  start:  (data) => api.post('/simulation/start', data),
  submit: (data) => api.post('/simulation/submit', data),
};

// ── Knowledge Gaps ────────────────────────────────────────────────
export const knowledgeAPI = {
  detect: (data) => api.post('/knowledge/gaps', data),
};

// ── Future Prediction ─────────────────────────────────────────────
export const futureAPI = {
  predict: (data) => api.post('/future/predict', data),
};

// ── Chat ──────────────────────────────────────────────────────────
export const chatAPI = {
  send: (data) => api.post('/chat', data),
};

export default api;
