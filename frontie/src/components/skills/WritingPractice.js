import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import writingService from '../../services/writingService';

const WritingPractice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [essayText, setEssayText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
      setLoading(false);
      return;
    }

    const fetchPrompt = async () => {
      try {
        const res = await writingService.getPrompts();
        const found = res.data.find((p) => p.id === parseInt(id));
        if (found) {
          setPrompt(found);
        } else {
          setError('Prompt not found.');
        }
      } catch (err) {
        console.error('Failed to load prompt:', err);
        setError('Failed to load prompt.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id, location.state]);

  const wordCount = essayText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const handleSubmitAndEvaluate = async () => {
    if (essayText.trim().length < 10) {
      setSubmitError('Essay must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setResult(null);

    try {
      const submitRes = await writingService.submitEssay({
        title: prompt.title,
        text: essayText,
      });
      const submittedEssayId = submitRes.data.id;

      setSubmitting(false);
      setEvaluating(true);

      const evalRes = await writingService.evaluateEssay(submittedEssayId);
      setResult(evalRes.data);
    } catch (err) {
      console.error('Submit/evaluate failed:', err);
      setSubmitError(
        err.response?.data?.detail || 'Failed to submit essay. Please try again.'
      );
    } finally {
      setSubmitting(false);
      setEvaluating(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/writing');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-violet-500" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading prompt...</span>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <p className="text-red-500">{error || 'Prompt not found.'}</p>
        <button onClick={handleBack} className="mt-4 gradient-btn text-sm">
          Back to Writing
        </button>
      </div>
    );
  }

  const difficultyLabel = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  const difficultyColors = {
    beginner: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          Back to Writing
        </button>

        <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {prompt.title}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                difficultyColors[prompt.difficulty] || difficultyColors.intermediate
              }`}
            >
              {difficultyLabel[prompt.difficulty] || prompt.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 capitalize">
              {prompt.task_type}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {prompt.prompt_text}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              40 min recommended
            </span>
            <span>{wordCount} words</span>
          </div>
        </div>
      </motion.div>

      {!result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Essay
            </label>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Start writing your essay here..."
              rows={14}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-sm leading-relaxed"
            />

            {submitError && (
              <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                Minimum 10 characters required
              </span>
              <button
                onClick={handleSubmitAndEvaluate}
                disabled={submitting || evaluating || essayText.trim().length < 10}
                className="gradient-btn text-sm !py-2.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : evaluating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit & Evaluate
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-green-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Evaluation Complete
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <ScoreCard label="Overall" score={result.overall_score} />
              <ScoreCard label="Grammar" score={result.grammar_score} />
              <ScoreCard label="Vocabulary" score={result.vocabulary_score} />
              <ScoreCard label="Coherence" score={result.coherence_score} />
            </div>

            {result.feedback && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Feedback
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {result.feedback}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBack}
              className="gradient-btn text-sm"
            >
              Back to Writing
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ScoreCard = ({ label, score }) => {
  const getColor = (s) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className={`text-2xl font-bold ${getColor(score)}`}>
        {Math.round(score)}%
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
};

export default WritingPractice;
