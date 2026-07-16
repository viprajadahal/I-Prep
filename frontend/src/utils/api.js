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
  console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('[API REQUEST HEADERS]', config.headers);
  if (config.params) {
    console.log('[API REQUEST PARAMS]', config.params);
  }
  if (config.data && !(config.data instanceof FormData)) {
    console.log('[API REQUEST DATA]', config.data);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.config.method.toUpperCase()} ${response.config.baseURL}${response.config.url} - Status: ${response.status}`);
    console.log('[API RESPONSE DATA]', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API ERROR] ${error.config.method.toUpperCase()} ${error.config.baseURL}${error.config.url} - Status: ${error.response.status}`);
      console.error('[API ERROR RESPONSE]', error.response.data);
      console.error('[API ERROR HEADERS]', error.response.headers);
    } else if (error.request) {
      console.error('[API ERROR] No response received', error.request);
    } else {
      console.error('[API ERROR]', error.message);
    }
    if (error.response?.status === 401 && !error.config.url.includes('/resources')) {
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