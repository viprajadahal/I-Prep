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

const mockTestService = {
  getTests: () => api.get('/mock-tests'),
  getTest: (id) => api.get(`/mock-tests/${id}`),
  startTest: (id) => api.post(`/mock-tests/${id}/start`),
  submitTest: (id, data) => api.post(`/mock-tests/${id}/submit`, data),
  getTestResults: (id) => api.get(`/mock-tests/${id}/results`),
  getTestHistory: () => api.get('/mock-tests/history'),
};

export default mockTestService;