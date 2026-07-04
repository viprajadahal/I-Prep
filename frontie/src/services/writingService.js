import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('iprep-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const writingService = {
  getTasks: () => api.get('/writing/tasks'),
  getTask: (id) => api.get(`/writing/tasks/${id}`),
  getTask1Lessons: () => api.get('/writing/tasks/task1'),
  getTask2Lessons: () => api.get('/writing/tasks/task2'),
  submitTask: (id, data) => api.post(`/writing/tasks/${id}/submit`, data),
  getFeedback: (id) => api.get(`/writing/tasks/${id}/feedback`),
  getScoreHistory: () => api.get('/writing/scores'),
  getWritingProgress: () => api.get('/writing/progress'),
};

export default writingService;