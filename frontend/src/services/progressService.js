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

const progressService = {
  getOverallProgress: () => api.get('/progress/overall'),
  getWeeklyProgress: () => api.get('/progress/weekly'),
  getMonthlyProgress: () => api.get('/progress/monthly'),
  getSkillBreakdown: () => api.get('/progress/skills'),
  getRecentActivity: (limit = 10) => api.get(`/progress/activity?limit=${limit}`),
  getPracticeStreak: () => api.get('/progress/streak'),
  getStudyHours: () => api.get('/progress/study-hours'),
  getRecommendedLessons: () => api.get('/progress/recommended'),
  getBandHistory: () => api.get('/progress/band-history'),
};

export default progressService;