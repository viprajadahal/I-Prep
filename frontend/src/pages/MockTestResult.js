import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronRight,
  Target,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import mockTestService from '../services/mockTestService';
import { useAuth } from '../context/AuthContext';

const SECTION_CONFIG = {
  listening: { icon: Headphones, color: '#4c6ef5', label: 'Listening' },
  reading: { icon: BookOpen, color: '#22c55e', label: 'Reading' },
  writing: { icon: PenTool, color: '#f59e0b', label: 'Writing' },
  speaking: { icon: Mic, color: '#ec4899', label: 'Speaking' },
};

const BAND_COLORS = {
  excellent: '#22c55e',
  good: '#4c6ef5',
  average: '#f59e0b',
  poor: '#ef4444',
};

const getBandColor = (band) => {
  if (band >= 7.0) return BAND_COLORS.excellent;
  if (band >= 5.5) return BAND_COLORS.average;
  return BAND_COLORS.poor;
};

const getBandLabel = (band) => {
  if (band >= 8.0) return 'Excellent';
  if (band >= 7.0) return 'Good';
  if (band >= 5.5) return 'Average';
  return 'Needs Work';
};

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '--';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OverallBandDisplay = ({ band }) => {
  const color = getBandColor(band);
  const circumference = 2 * Math.PI * 70;
  const progress = (band / 9) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-extrabold"
            style={{ color }}
          >
            {band.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Overall Band
          </span>
        </div>
      </div>
      <span
        className="mt-3 px-4 py-1 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {getBandLabel(band)}
      </span>
    </motion.div>
  );
};

const SectionBandCard = ({ section, index }) => {
  const config = SECTION_CONFIG[section.key];
  const Icon = config.icon;
  const color = getBandColor(section.band);
  const pct = section.total > 0 ? (section.score / section.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon size={20} style={{ color: config.color }} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {config.label}
          </h4>
          <p className="text-xs text-gray-400">
            {section.score !== undefined
              ? `${section.score}/${section.total}`
              : section.band?.toFixed(1)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <span
            className="text-2xl font-bold"
            style={{ color }}
          >
            {section.band.toFixed(1)}
          </span>
        </div>
      </div>
      {section.total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Score</span>
            <span>{pct.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const TimingCard = ({ timing, index }) => {
  const config = SECTION_CONFIG[timing.section_type];
  const Icon = config.icon;
  const pct =
    timing.time_limit_seconds > 0
      ? (timing.time_spent_seconds / timing.time_limit_seconds) * 100
      : 0;
  const overTime = pct > 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-white dark:bg-surface-cardDark rounded-xl p-4 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon size={16} style={{ color: config.color }} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {config.label}
        </span>
        {overTime && (
          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
            Over Time
          </span>
        )}
      </div>
      <div className="flex items-end justify-between text-sm">
        <div>
          <span className={`font-semibold ${overTime ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(timing.time_spent_seconds)}
          </span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-400">{formatTime(timing.time_limit_seconds)}</span>
        </div>
        <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
          className="h-full rounded-full"
          style={{ backgroundColor: overTime ? '#ef4444' : config.color }}
        />
      </div>
    </motion.div>
  );
};

const QuestionReviewRow = ({ q, index }) => {
  const isCorrect = q.is_correct;
  const isSkipped = q.is_skipped;

  let statusBg = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  let StatusIcon = CheckCircle2;
  let statusColor = 'text-green-500';

  if (isSkipped) {
    statusBg = 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    StatusIcon = MinusCircle;
    statusColor = 'text-gray-400';
  } else if (!isCorrect) {
    statusBg = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    StatusIcon = XCircle;
    statusColor = 'text-red-500';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-xl border p-4 ${statusBg}`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon size={18} className={`${statusColor} mt-0.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
            {q.question_text}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
              {q.question_type?.replace(/_/g, ' ')}
            </span>
            {!isSkipped && (
              <>
                <span className="text-xs text-gray-400">Your answer:</span>
                <span
                  className={`text-xs font-medium ${
                    isCorrect
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {q.user_answer || '(empty)'}
                </span>
              </>
            )}
            {!isSkipped && !isCorrect && q.correct_answer && (
              <>
                <span className="text-xs text-gray-400">Correct:</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {Array.isArray(q.correct_answer)
                    ? q.correct_answer.join(' / ')
                    : q.correct_answer}
                </span>
              </>
            )}
            {isSkipped && q.correct_answer && (
              <>
                <span className="text-xs text-gray-400">Answer:</span>
                <span className="text-xs font-medium text-gray-500">
                  {Array.isArray(q.correct_answer)
                    ? q.correct_answer.join(' / ')
                    : q.correct_answer}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CriterionBarChart = ({ criteria, label }) => {
  const data = Object.entries(criteria).map(([key, value]) => ({
    name: key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    score: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} angle={-15} textAnchor="end" height={60} />
        <YAxis domain={[0, 9]} stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="score" fill="#4c6ef5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const SpeakingRadarChart = ({ criteria }) => {
  const data = Object.entries(criteria).map(([key, value]) => ({
    skill: key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    score: value,
    fullMark: 9,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#ec4899"
          fill="#ec4899"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const AnalysisDetailCard = ({ analysis, type, index }) => {
  const isWriting = type === 'writing';
  const taskLabel = isWriting ? `Task ${analysis.task_number}` : `Part ${analysis.part_number}`;
  const color = isWriting ? '#f59e0b' : '#ec4899';

  const criteria = isWriting
    ? {
        grammar: analysis.grammar_score,
        vocabulary: analysis.vocabulary_score,
        task_response: analysis.task_response_score,
        coherence: analysis.coherence_score,
        sentence_variety: analysis.sentence_variety_score,
      }
    : {
        grammar: analysis.grammar_score,
        vocabulary: analysis.vocabulary_score,
        fluency: analysis.fluency_score,
        pronunciation: analysis.pronunciation_score,
        coherence: analysis.coherence_score,
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          {taskLabel}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Estimated Band</span>
          <span
            className="text-xl font-bold px-3 py-0.5 rounded-lg"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {analysis.estimated_band.toFixed(1)}
          </span>
        </div>
      </div>

      {isWriting && analysis.word_count !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Word Count: {analysis.word_count}
        </p>
      )}
      {!isWriting && analysis.duration_seconds !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Duration: {formatTime(analysis.duration_seconds)}
        </p>
      )}

      <div className="mb-5">
        {isWriting ? (
          <CriterionBarChart criteria={criteria} />
        ) : (
          <SpeakingRadarChart criteria={criteria} />
        )}
      </div>

      {analysis.feedback && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-5">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {analysis.feedback}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysis.strengths?.length > 0 && (
          <div>
            <h5 className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
              <TrendingUp size={14} /> Strengths
            </h5>
            <ul className="space-y-1">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                  <CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.weaknesses?.length > 0 && (
          <div>
            <h5 className="flex items-center gap-1.5 text-sm font-semibold text-red-500 dark:text-red-400 mb-2">
              <TrendingDown size={14} /> Weaknesses
            </h5>
            <ul className="space-y-1">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                  <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.recommendations?.length > 0 && (
          <div>
            <h5 className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 dark:text-blue-400 mb-2">
              <Lightbulb size={14} /> Recommendations
            </h5>
            <ul className="space-y-1">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                  <ChevronRight size={12} className="text-blue-400 mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PRIORITY_STYLES = {
  high: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  low: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    text: 'text-green-700 dark:text-green-300',
  },
};

const MockTestResult = () => {
  const { attempt_id } = useParams();
  const attemptId = attempt_id;
  const navigate = useNavigate();
  useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('listening');
  const [analysisTab, setAnalysisTab] = useState('writing');

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockTestService.getTestResults(attemptId);
      setResult(response.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load test results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sectionBands = result
    ? [
        { key: 'listening', band: result.listening_band, score: result.listening_score, total: result.listening_total },
        { key: 'reading', band: result.reading_band, score: result.reading_score, total: result.reading_total },
        { key: 'writing', band: result.writing_band, score: null, total: null },
        { key: 'speaking', band: result.speaking_band, score: null, total: null },
      ]
    : [];

  const sectionChartData = sectionBands.map((s) => ({
    name: SECTION_CONFIG[s.key].label,
    band: s.band,
    fill: SECTION_CONFIG[s.key].color,
  }));

  const accuracyData = result?.performance_summary
    ? [
        { name: 'Correct', value: result.performance_summary.total_correct, color: '#22c55e' },
        {
          name: 'Incorrect',
          value:
            result.performance_summary.total_questions -
            result.performance_summary.total_correct -
            result.performance_summary.total_skipped,
          color: '#ef4444',
        },
        { name: 'Skipped', value: result.performance_summary.total_skipped, color: '#9ca3af' },
      ]
    : [];

  const filteredQuestions = result?.question_review
    ? result.question_review.filter((q) => q.section === activeTab)
    : [];

  const tabs = ['listening', 'reading', 'writing', 'speaking'];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 size={40} className="animate-spin text-primary-500" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading your results...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-8 shadow-soft border border-gray-50 dark:border-gray-800 text-center max-w-md"
        >
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchResults}
              className="gradient-btn text-sm !py-2.5 px-6"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/mock-tests')}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Back to Mock Tests
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <div className="section-container py-8 max-w-6xl">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/mock-tests')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Mock Tests
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {result.test_title}
              </h1>
              <p className="text-sm text-gray-400">
                Completed {formatDate(result.ended_at)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium w-fit">
              <CheckCircle2 size={14} />
              {result.status?.charAt(0).toUpperCase() + result.status?.slice(1)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-8 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <OverallBandDisplay band={result.overall_band} />
            <div className="flex-1 w-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Section Scores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sectionBands.map((s, i) => (
                  <SectionBandCard key={s.key} section={s} index={i} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Section Band Comparison
              </h3>
              <BarChart3 size={18} className="text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0, 9]} stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="band" radius={[6, 6, 0, 0]}>
                  {sectionChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Overall Accuracy
              </h3>
              <Target size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.performance_summary?.accuracy?.toFixed(1)}%
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {result.performance_summary?.total_correct} / {result.performance_summary?.total_questions} correct
                {result.performance_summary?.total_skipped > 0 &&
                  ` (${result.performance_summary.total_skipped} skipped)`}
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              {accuracyData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {result.section_timings?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Time Management
              </h3>
              <Clock size={18} className="text-gray-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.section_timings.map((t, i) => (
                <TimingCard key={t.section_type} timing={t} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Question Review
            </h3>
            <span className="text-sm text-gray-400">
              {result.question_review?.length || 0} questions
            </span>
          </div>

          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const config = SECTION_CONFIG[tab];
              const Icon = config.icon;
              const count = result.question_review?.filter((q) => q.section === tab).length || 0;
              const correct =
                result.question_review?.filter((q) => q.section === tab && q.is_correct).length ||
                0;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {config.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {correct}/{count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, i) => (
                  <QuestionReviewRow key={q.question_id} q={q} index={i} />
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400 py-8"
                >
                  No questions in this section
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {(result.writing_analyses?.length > 0 || result.speaking_analyses?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Detailed Analysis
              </h3>
            </div>

            {result.writing_analyses?.length > 0 &&
              result.speaking_analyses?.length > 0 && (
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setAnalysisTab('writing')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      analysisTab === 'writing'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <PenTool size={16} />
                    Writing Analysis
                  </button>
                  <button
                    onClick={() => setAnalysisTab('speaking')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      analysisTab === 'speaking'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Mic size={16} />
                    Speaking Analysis
                  </button>
                </div>
              )}

            <AnimatePresence mode="wait">
              {analysisTab === 'writing' && result.writing_analyses?.length > 0 && (
                <motion.div
                  key="writing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {result.writing_analyses.map((a, i) => (
                    <AnalysisDetailCard
                      key={a.task_number}
                      analysis={a}
                      type="writing"
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
              {analysisTab === 'speaking' && result.speaking_analyses?.length > 0 && (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {result.speaking_analyses.map((a, i) => (
                    <AnalysisDetailCard
                      key={a.part_number}
                      analysis={a}
                      type="speaking"
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {result.recommendations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb size={20} className="text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => {
                const style = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.medium;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    className={`flex items-start gap-3 rounded-xl border p-4 ${style.bg} ${style.border}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`}
                    />
                    <div>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${style.text}`}
                      >
                        {rec.category}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                        {rec.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mock-tests')}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Mock Tests
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mock-tests')}
            className="gradient-btn flex items-center justify-center gap-2 !px-8 !py-3"
          >
            <RotateCcw size={18} />
            Retake Test
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MockTestResult;
