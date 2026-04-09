import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flashmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Flashcards
export const flashcardApi = {
  list: (subject) => api.get('/flashcards', { params: subject ? { subject } : {} }),
  create: (data) => api.post('/flashcards', data),
  update: (id, data) => api.put(`/flashcards/${id}`, data),
  remove: (id) => api.delete(`/flashcards/${id}`),
  subjects: () => api.get('/flashcards/subjects'),
};

// AI
export const aiApi = {
  generate: (text) => api.post('/ai/generate', { text }),
};

export default api;
