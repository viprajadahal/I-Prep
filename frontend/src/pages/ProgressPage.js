import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Trophy, Target, BarChart3,
  Loader2, ArrowRight, ChevronDown, ChevronUp,
  Headphones, BookOpen, PenTool, Mic,
} from 'lucide-react';
import LandingLayout from '../components/layout/LandingLayout';
import mockTestService from '../services/mockTestService';
import { useAuth } from '../context/AuthContext';

const SECTION_COLORS = {
  listening: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  reading: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' },
  writing: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
  speaking: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' },
};

const SECTION_ICONS = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchProgress();
  }, [isAuthenticated]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await mockTestService.getProgress();
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const bandColor = (band) => {
    if (band >= 7) return 'text-green-500';
    if (band >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <LandingLayout>
        <div className="section-container py-20 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span className="ml-3 text-gray-500">Loading progress...</span>
        </div>
      </LandingLayout>
    );
  }

  if (error) {
    return (
      <LandingLayout>
        <div className="section-container py-20 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchProgress} className="gradient-btn text-sm !py-2.5 px-6">Retry</button>
        </div>
      </LandingLayout>
    );
  }

  const { total_attempts, best_overall_band, average_overall_band, attempts } = progress || {};

  return (
    <LandingLayout>
      <div className="section-container py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Progress</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your IELTS performance across all mock tests</p>
        </motion.div>

        {total_attempts === 0 ? (
          <div className="text-center py-20">
            <Target size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-6">No completed tests yet. Take your first mock test!</p>
            <button onClick={() => navigate('/mock-tests')} className="gradient-btn text-sm !py-2.5 px-6 flex items-center gap-2 mx-auto">
              View Mock Tests <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Trophy size={20} className="text-indigo-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Best Band</span>
                </div>
                <div className={`text-4xl font-bold ${bandColor(best_overall_band)}`}>{best_overall_band}</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp size={20} className="text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Average Band</span>
                </div>
                <div className={`text-4xl font-bold ${bandColor(average_overall_band)}`}>{average_overall_band}</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BarChart3 size={20} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tests Completed</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{total_attempts}</div>
              </motion.div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-gray-400" /> Attempt History
            </h2>

            <div className="space-y-4">
              {attempts.slice().reverse().map((attempt, ai) => (
                <motion.div key={attempt.attempt_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ai * 0.05 }}
                  className="bg-white dark:bg-surface-cardDark rounded-2xl shadow-soft border border-gray-50 dark:border-gray-800 overflow-hidden">
                  <button
                    onClick={() => setExpandedAttempt(expandedAttempt === attempt.attempt_id ? null : attempt.attempt_id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        AI
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{attempt.test_title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(attempt.completed_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${bandColor(attempt.overall_band)}`}>Band {attempt.overall_band}</span>
                      {expandedAttempt === attempt.attempt_id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {expandedAttempt === attempt.attempt_id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-gray-100 dark:border-gray-800">
                      <div className="p-5 space-y-4">
                        {attempt.sections.map((sec) => {
                          const colors = SECTION_COLORS[sec.section_type] || SECTION_COLORS.listening;
                          const Icon = SECTION_ICONS[sec.section_type] || Headphones;
                          const barPct = sec.total > 0 ? Math.round((sec.score / sec.total) * 100) : 0;
                          return (
                            <div key={sec.section_type} className="flex items-center gap-4">
                              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                                <Icon size={15} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{sec.label}</span>
                                  <span className="text-xs font-bold">
                                    <span className={bandColor(sec.band)}>Band {sec.band}</span>
                                    {sec.total > 0 && <span className="text-gray-400 ml-2">({sec.score}/{sec.total})</span>}
                                  </span>
                                </div>
                                {sec.total > 0 && (
                                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${barPct}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        <button
                          onClick={() => navigate(`/mock-tests/${attempt.attempt_id}/results`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 transition-colors"
                        >
                          View Full Results <ArrowRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </LandingLayout>
  );
};

export default ProgressPage;
