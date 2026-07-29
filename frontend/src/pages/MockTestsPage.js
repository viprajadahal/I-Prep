import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Loader2,
  RefreshCw,
  Trophy,
  History,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react';
import LandingLayout from '../components/layout/LandingLayout';
import mockTestService from '../services/mockTestService';
import { useAuth } from '../context/AuthContext';

const MockTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        const hardcoded = [
          { id: 1, title: 'Full IELTS Academic Test #1', duration_minutes: 165, difficulty: 'Academic', sections: 4, completed: false, total_attempts: 0, attempts: [] },
          { id: 2, title: 'Full IELTS Academic Test #2', duration_minutes: 165, difficulty: 'Academic', sections: 4, completed: false, total_attempts: 0, attempts: [] },
          { id: 3, title: 'Full IELTS Academic Test #3', duration_minutes: 165, difficulty: 'Academic', sections: 4, completed: false, total_attempts: 0, attempts: [] },
        ];
        setTests(hardcoded);
      } else {
        const response = await mockTestService.getTests();
        setTests(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch tests:', err);
      setError('Failed to load mock tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setStarting(testId);
      const response = await mockTestService.startTest(testId);
      const attemptId = response.data.attempt_id;
      navigate(`/mock-tests/${attemptId}`);
    } catch (err) {
      console.error('Failed to start test:', err);
      alert('Failed to start test. Please try again.');
    } finally {
      setStarting(null);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <LandingLayout>
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mock Tests
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Simulate the real IELTS exam experience with timed full tests
          </p>
          <button
            onClick={() => navigate('/mock-tests/progress')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-sm font-semibold transition-all"
          >
            <BarChart3 size={16} /> View Your Progress
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <span className="ml-3 text-gray-500">Loading mock tests...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchTests} className="gradient-btn text-sm !py-2.5 px-6">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList size={20} className="text-gray-600 dark:text-gray-300" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {test.title}
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    Duration: {formatDuration(test.duration_minutes)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    Sections: {test.sections}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
                    {test.difficulty}
                  </span>
                </div>

                {test.completed && test.best_score !== null && test.best_score !== undefined ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-500">
                        <Trophy size={16} />
                        <span className="text-sm font-semibold">Best: Band {test.best_score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.score !== null && test.score !== undefined && (
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Latest: Band {test.score}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {test.total_attempts} attempt{test.total_attempts !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {test.attempts && test.attempts.length >= 1 && (
                      <div>
                        <button
                          onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <History size={12} />
                          {test.attempts.length > 1 ? 'View history' : 'View details'}
                          {expandedTest === test.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        <AnimatePresence>
                          {expandedTest === test.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                {test.attempts.slice().reverse().map((a, i) => (
                                  <div key={a.attempt_id} className="flex items-center justify-between text-xs py-1 px-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                                    <span className="text-gray-500">{formatDate(a.completed_at)}</span>
                                    <span className={`font-semibold ${a.overall_band >= 7 ? 'text-green-500' : a.overall_band >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                                      {a.overall_band !== null ? `Band ${a.overall_band}` : 'N/A'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartTest(test.id)}
                      disabled={starting === test.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {starting === test.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} />
                          Retake Test
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartTest(test.id)}
                    disabled={starting === test.id}
                    className="gradient-btn text-sm !py-2.5 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {starting === test.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <PlayCircle size={16} />
                        Start Test
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </LandingLayout>
  );
};

export default MockTestsPage;
