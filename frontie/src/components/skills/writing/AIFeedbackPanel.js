import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ScoreRing = ({ label, score, color, size = 64 }) => {
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="#e5e7eb" strokeWidth="4" fill="none" className="dark:stroke-gray-700" />
          <motion.circle
            cx={size/2} cy={size/2} r={radius}
            stroke={color || getColor(score)}
            strokeWidth="4" fill="none" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(score)}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{label}</span>
    </div>
  );
};

const AIFeedbackPanel = ({ result, prompt, essayText, onBack, onRetry }) => {
  const getBandLabel = (score) => {
    const band = score / 10;
    if (band >= 8.0) return 'Excellent';
    if (band >= 7.0) return 'Very Good';
    if (band >= 6.0) return 'Good';
    if (band >= 5.0) return 'Modest';
    return 'Needs Improvement';
  };

  const bandScore = (result.overall_score / 10).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Writing
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-cardDark rounded-2xl p-8 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 size={24} className="text-green-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Evaluation Complete</h2>
        </div>

        {prompt.image_url && (
          <div className="mb-6">
            <img
              src={`${API_BASE_URL}${prompt.image_url}`}
              alt={prompt.title || 'Task diagram'}
              className="w-full max-h-64 object-contain rounded-lg border border-gray-100 dark:border-gray-800"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-8 mb-8 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">{bandScore}</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Overall Band</div>
            <div className="text-xs text-gray-400">{getBandLabel(result.overall_score)}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <ScoreRing label="Task Achievement" score={result.overall_score} color="#7c3aed" />
          <ScoreRing label="Coherence" score={result.coherence_score} color="#4c6ef5" />
          <ScoreRing label="Vocabulary" score={result.vocabulary_score} color="#f59e0b" />
          <ScoreRing label="Grammar" score={result.grammar_score} color="#10b981" />
        </div>

        {result.feedback && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <MessageSquare size={16} /> Detailed Feedback
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
              {result.feedback.split('\n\n').map((section, idx) => {
                const [title, ...rest] = section.split(': ');
                return (
                  <div key={idx} className="mb-3 last:mb-0">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{rest.join(': ')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result.grammar_errors && result.grammar_errors.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <AlertTriangle size={16} /> Grammar Errors
            </h3>
            <div className="space-y-2">
              {result.grammar_errors.slice(0, 5).map((err, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-red-700 dark:text-red-300">{err.message}</span>
                    {err.suggestion && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">→ {err.suggestion}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.vocabulary_details && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <BookOpen size={16} /> Vocabulary Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{result.vocabulary_details.word_count}</div>
                <div className="text-xs text-gray-400">Total Words</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{result.vocabulary_details.unique_word_count}</div>
                <div className="text-xs text-gray-400">Unique Words</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{result.vocabulary_details.sentence_count}</div>
                <div className="text-xs text-gray-400">Sentences</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{result.vocabulary_details.advanced_vocab_count}</div>
                <div className="text-xs text-gray-400">Advanced Words</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Back to Writing
          </button>
          <button onClick={onRetry} className="gradient-btn text-sm flex items-center gap-2">
            <RefreshCw size={16} /> Retry Essay
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AIFeedbackPanel;
