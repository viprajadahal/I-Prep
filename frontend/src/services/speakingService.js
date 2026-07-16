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

const speakingService = {
  getTopics: () => api.get('/speaking/topics'),
  getTopic: (id) => api.get(`/speaking/topics/${id}`),
  getCueCards: (part) => api.get(`/speaking/cue-cards?part=${part}`),
  submitRecording: (id, file) => {
    const formData = new FormData();
    formData.append('recording', file);
    return api.post(`/speaking/topics/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getFeedback: (id) => api.get(`/speaking/topics/${id}/feedback`),
  getFluencyAnalysis: (id) => api.get(`/speaking/topics/${id}/fluency`),
  getPronunciationScore: (id) => api.get(`/speaking/topics/${id}/pronunciation`),
  getSpeakingProgress: () => api.get('/speaking/progress'),
};

export default speakingService;