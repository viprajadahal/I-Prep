import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('iprep-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('iprep-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getProgress: () => api.get('/users/progress'),
};

export const readingAPI = {
  getPassages: () => api.get('/reading/passages'),
  getPassage: (id) => api.get(`/reading/passages/${id}`),
  submitAnswers: (id, data) => api.post(`/reading/passages/${id}/submit`, data),
};

export const writingAPI = {
  getTasks: () => api.get('/writing/tasks'),
  getTask: (id) => api.get(`/writing/tasks/${id}`),
  submitTask: (id, data) => api.post(`/writing/tasks/${id}/submit`, data),
};

export const listeningAPI = {
  getPassages: () => api.get('/listening/passages'),
  getPassage: (id) => api.get(`/listening/passages/${id}`),
  submitAnswers: (id, data) => api.post(`/listening/passages/${id}/submit`, data),
};

export const speakingAPI = {
  getTopics: () => api.get('/speaking/topics'),
  getTopic: (id) => api.get(`/speaking/topics/${id}`),
  submitRecording: (id, data) => api.post(`/speaking/topics/${id}/submit`, data),
};

export const mockTestAPI = {
  getTests: () => api.get('/mock-tests'),
  getTest: (id) => api.get(`/mock-tests/${id}`),
  startTest: (id) => api.post(`/mock-tests/${id}/start`),
  submitTest: (id, data) => api.post(`/mock-tests/${id}/submit`, data),
};

export default api;