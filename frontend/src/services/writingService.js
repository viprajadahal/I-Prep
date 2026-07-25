import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('iprep-token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const writingService = {
  getPrompts: (params = {}) => {
    const query = {};
    if (params.module) query.module = params.module;
    if (params.task_type) query.task_type = params.task_type;
    if (params.subtype) query.subtype = params.subtype;
    return api.get('/writing/prompts', { params: query });
  },
  getPromptsByTaskType: (taskType) => api.get(`/writing/prompts/${taskType}`),
  getRandomPrompt: (taskType) => api.get(`/writing/prompts/${taskType}/random`),
  submitEssay: (data) => api.post('/writing/submit', data),
  evaluateEssay: (essayId) => api.post('/writing/evaluate', { essay_id: essayId }),
  getEssays: () => api.get('/writing/essays'),
  getEssay: (essayId) => api.get(`/writing/essays/${essayId}`),
  getHistory: () => api.get('/writing/history'),
  getResult: (essayId) => api.get(`/writing/results/${essayId}`),
  getResultsBatch: () => api.get('/writing/results-batch'),
  getAssistant: (promptId) => api.get(`/writing/assistant/${promptId}`),
};

export default writingService;
