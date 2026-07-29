import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const mockTestService = {
  getTests: () => api.get('/mock-tests'),
  getProgress: () => api.get('/mock-tests/progress'),
  getTest: (attemptId) => api.get(`/mock-tests/${attemptId}`),
  startTest: (testId) => api.post(`/mock-tests/start/${testId}`),
  saveAnswer: (data) => api.post('/mock-tests/save-answer', data),
  submitTest: (data) => api.post('/mock-tests/submit', data),
  getTestResults: (attemptId) => api.get(`/mock-tests/results/${attemptId}`),
  analyzeWriting: (data) => api.post('/mock-tests/analyze-writing', data),
  analyzeSpeakingNLP: (data) => api.post('/mock-tests/analyze-speaking', data),
  scoreSection: (data) => api.post('/mock-tests/score-section', data),
};

export default mockTestService;