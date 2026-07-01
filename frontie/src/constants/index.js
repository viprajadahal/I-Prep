export const ROUTES = {
  HOME: '/',
  PRACTICE: '/practice',
  MOCK_TESTS: '/mock-tests',
  DASHBOARD: '/dashboard',
  DASHBOARD_READING: '/dashboard/reading',
  DASHBOARD_WRITING: '/dashboard/writing',
  DASHBOARD_LISTENING: '/dashboard/listening',
  DASHBOARD_SPEAKING: '/dashboard/speaking',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PROFILE: '/dashboard/profile',
  RESOURCES: '/resources',
  LOGIN: '/login',
  REGISTER: '/register',
};

export const IELTS_BANDS = ['4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

export const SKILL_TYPES = {
  LISTENING: 'listening',
  READING: 'reading',
  WRITING: 'writing',
  SPEAKING: 'speaking',
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  Advanced: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export const LESSON_TYPES = {
  TASK1: 'task1',
  TASK2: 'task2',
};

export const SPEAKING_PARTS = {
  PART1: 1,
  PART2: 2,
  PART3: 3,
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  USER_PROFILE: '/users/profile',
  USER_AVATAR: '/users/avatar',
  PROGRESS_OVERALL: '/progress/overall',
  PROGRESS_WEEKLY: '/progress/weekly',
  READING_PASSAGES: '/reading/passages',
  WRITING_TASKS: '/writing/tasks',
  LISTENING_PASSAGES: '/listening/passages',
  SPEAKING_TOPICS: '/speaking/topics',
  MOCK_TESTS: '/mock-tests',
};

export const TIMER_DEFAULTS = {
  READING: 1200,
  LISTENING: 1800,
  WRITING: 2400,
  SPEAKING: 900,
  MOCK_TEST: 8100,
};