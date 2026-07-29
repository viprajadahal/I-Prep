import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
      localStorage.removeItem('iprep-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', null, { params: { email, password } }),
  register: (data) => api.post('/auth/register', data),
  logout: () => { localStorage.removeItem('iprep-token'); },
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
  getPrompts: () => api.get('/writing/prompts'),
  submitEssay: (data) => api.post('/writing/submit', data),
  evaluateEssay: (essayId) => api.post('/writing/evaluate', { essay_id: essayId }),
  getEssays: () => api.get('/writing/essays'),
  getHistory: () => api.get('/writing/history'),
  getResult: (essayId) => api.get(`/writing/results/${essayId}`),
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
  getTest: (attemptId) => api.get(`/mock-tests/${attemptId}`),
  startTest: (testId) => api.post(`/mock-tests/start/${testId}`),
  saveAnswer: (data) => api.post('/mock-tests/save-answer', data),
  submitTest: (data) => api.post('/mock-tests/submit', data),
  getTestResults: (attemptId) => api.get(`/mock-tests/results/${attemptId}`),
};

export default api;