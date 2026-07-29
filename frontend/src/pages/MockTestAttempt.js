import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  StopCircle,
  Send,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Mic,
  Trash2,
  Loader2,
  Headphones,
  BookOpen,
  PenTool,
  X,
  BarChart3,
} from 'lucide-react';
import mockTestService from '../services/mockTestService';
import { useAuth } from '../context/AuthContext';
import useTimer from '../hooks/useTimer';

const SECTION_TYPES = ['listening', 'reading', 'writing', 'speaking'];

const SECTION_META = {
  listening: { icon: Headphones, label: 'Listening', color: 'blue' },
  reading: { icon: BookOpen, label: 'Reading', color: 'green' },
  writing: { icon: PenTool, label: 'Writing', color: 'purple' },
  speaking: { icon: Mic, label: 'Speaking', color: 'orange' },
};

const COLOR_MAP = {
  blue: {
    active: 'bg-blue-500 text-white',
    tab: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
    light: 'bg-blue-50 dark:bg-blue-900/20',
  },
  green: {
    active: 'bg-green-500 text-white',
    tab: 'text-green-600 dark:text-green-400',
    border: 'border-green-500',
    light: 'bg-green-50 dark:bg-green-900/20',
  },
  purple: {
    active: 'bg-purple-500 text-white',
    tab: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500',
    light: 'bg-purple-50 dark:bg-purple-900/20',
  },
  orange: {
    active: 'bg-orange-500 text-white',
    tab: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500',
    light: 'bg-orange-50 dark:bg-orange-900/20',
  },
};

function debounce(fn, ms) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

function useDebouncedCallback(fn, ms) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = debounce(fn, ms);
    return () => ref.current?.cancel();
  }, [fn, ms]);
  return useCallback((...args) => ref.current?.(...args), []);
}

function TimerDisplay({ seconds, label, critical = false }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const formatted = h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      critical
        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }`}>
      <Clock size={14} />
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-bold font-mono">{formatted}</span>
    </div>
  );
}

function QuestionNavGrid({ questions, answers, marked, currentIdx, onSelect, sectionResults }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {questions.map((q, i) => {
        const writingKey = q.question_type === 'writing_task' ? `writing_task_${i + 1}` : null;
        const isAnswered = writingKey
          ? (answers[writingKey]?.answer_text || '').trim().length > 0
          : (answers[q.id]?.answer_text || '').trim().length > 0;
        const isMarked = marked.has(q.id);
        const isCurrent = i === currentIdx;
        const result = sectionResults?.results?.find(r => r.question_id === q.id);
        const hasResult = !!result;
        return (
          <button
            key={q.id}
            onClick={() => onSelect(i)}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center relative
              ${isCurrent
                ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-surface-dark bg-blue-500 text-white'
                : hasResult
                  ? result.is_correct
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : isAnswered
                    ? isMarked
                      ? 'bg-yellow-400 dark:bg-yellow-600 text-white'
                      : 'bg-green-500 text-white'
                    : isMarked
                      ? 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {i + 1}
            {isMarked && (
              <Bookmark size={8} className="absolute -top-0.5 -right-0.5 text-yellow-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ListeningSection({ section, answers, onAnswer, marked, onToggleMark, activeQuestionId, activePassage, onPassageChange, sectionResults, onScoreSection, scoringSection }) {
  const passages = useMemo(() => section.passages || [], [section.passages]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const audioRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const passage = passages[activePassage];
  const audioSrc = passage ? `${API_BASE}/mock-tests/audio/${passage.id}` : null;

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError(false);
    audio.load();
    audio.play().catch(() => setAudioError(true));
    setIsPlaying(true);
    setReplayCount(c => c + 1);
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play(); setIsPlaying(true); }
    else { audio.pause(); setIsPlaying(false); }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!activeQuestionId || passages.length <= 1) return;
    for (let i = 0; i < passages.length; i++) {
      if (passages[i].questions?.some(q => q.id === activeQuestionId)) {
        if (i !== activePassage) { handleStop(); onPassageChange(i); setReplayCount(0); }
        break;
      }
    }
  }, [activeQuestionId, passages]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('ended', onEnd);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [activePassage]);

  return (
    <div className="space-y-6">
      {passages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Listening Part {activePassage + 1} of {passages.length}
            </h4>
            <div className="flex gap-1">
              {passages.map((_, i) => (
                <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${
                  i === activePassage ? 'bg-blue-500' : i < activePassage ? 'bg-blue-300' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { handleStop(); onPassageChange(i); setReplayCount(0); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePassage === i
                    ? 'bg-blue-500 text-white'
                    : i < activePassage
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i < activePassage ? '✓ ' : ''}Part {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/50 mb-3">
            <Headphones size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {passage?.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Listen carefully, then answer the questions below
          </p>
        </div>

        <audio ref={audioRef} preload="auto" className="hidden">
          {audioSrc && <source src={audioSrc} type="audio/mpeg" />}
        </audio>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play size={18} fill="white" /> Play Audio
            </button>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                isPlaying
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-500/25'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Pause size={18} /> {audioRef.current && !audioRef.current.paused ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-105 active:scale-95"
            >
              <StopCircle size={18} /> Stop
            </button>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Playing audio...
              </span>
            </div>
          )}

          {audioError && (
            <p className="text-sm text-red-500">
              Audio failed to load. Click "Play Audio" to retry.
            </p>
          )}

          {replayCount > 0 && !isPlaying && !audioError && (
            <p className="text-xs text-gray-400">
              Played {replayCount} time{replayCount > 1 ? 's' : ''} — You can replay as many times as needed
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <PenTool size={14} /> Questions
        </h4>
        {passage?.questions
          .sort((a, b) => a.question_order - b.question_order)
          .map((q) => {
            const result = sectionResults?.results?.find(r => r.question_id === q.id);
            return (
              <QuestionInput
                key={q.id}
                question={q}
                value={answers[q.id]?.answer_text || ''}
                onChange={(val) => onAnswer(q.id, val, 'listening')}
                isMarked={marked.has(q.id)}
                onToggleMark={() => onToggleMark(q.id)}
                isActive={activeQuestionId === q.id}
                result={result || null}
              />
            );
          })}

        {sectionResults && (
          <div className={`rounded-xl p-4 border ${
            sectionResults.correct_count === sectionResults.total_count
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
              : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} className={
                sectionResults.correct_count === sectionResults.total_count
                  ? 'text-green-500' : 'text-blue-500'
              } />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Listening Results
              </h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {sectionResults.correct_count} out of {sectionResults.total_count} correct
              {' '}({sectionResults.scored_marks}/{sectionResults.total_marks} marks)
            </p>
          </div>
        )}

        {!sectionResults && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScoreSection}
            disabled={scoringSection}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scoringSection ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Checking answers...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Check My Answers
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ReadingSection({ section, answers, onAnswer, marked, onToggleMark, activeQuestionId, activePassage, onPassageChange, sectionResults, onScoreSection, scoringSection }) {
  const passages = section.passages || [];

  useEffect(() => {
    if (!activeQuestionId || passages.length <= 1) return;
    for (let i = 0; i < passages.length; i++) {
      if (passages[i].questions?.some(q => q.id === activeQuestionId)) {
        if (i !== activePassage) onPassageChange(i);
        break;
      }
    }
  }, [activeQuestionId, passages]);

  return (
    <div className="space-y-4">
      {passages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Reading Passage {activePassage + 1} of {passages.length}
            </h4>
            <div className="flex gap-1">
              {passages.map((_, i) => (
                <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${
                  i === activePassage ? 'bg-green-500' : i < activePassage ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => onPassageChange(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePassage === i
                    ? 'bg-green-500 text-white'
                    : i < activePassage
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i < activePassage ? '✓ ' : ''}Passage {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            {passages[activePassage]?.title}
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {passages[activePassage]?.passage_text}
          </div>
        </div>

        <div className="space-y-4">
          {passages[activePassage]?.questions
            .sort((a, b) => a.question_order - b.question_order)
            .map((q) => {
              const result = sectionResults?.results?.find(r => r.question_id === q.id);
              return (
                <QuestionInput
                  key={q.id}
                  question={q}
                  value={answers[q.id]?.answer_text || ''}
                  onChange={(val) => onAnswer(q.id, val, 'reading')}
                  isMarked={marked.has(q.id)}
                  onToggleMark={() => onToggleMark(q.id)}
                  isActive={activeQuestionId === q.id}
                  result={result || null}
                />
              );
            })}

          {sectionResults && (
            <div className={`rounded-xl p-4 border ${
              sectionResults.correct_count === sectionResults.total_count
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
                : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-green-500" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Reading Results
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {sectionResults.correct_count} out of {sectionResults.total_count} correct
                {' '}({sectionResults.scored_marks}/{sectionResults.total_marks} marks)
              </p>
            </div>
          )}

          {!sectionResults && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onScoreSection}
              disabled={scoringSection}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scoringSection ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking answers...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Check My Answers
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartDisplay({ data }) {
  if (!data || !data.type) return null;

  if (data.type === 'bar_chart') {
    const maxVal = Math.max(...data.series.flatMap(s => s.values));
    const colors = data.colors || ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{data.title}</h4>
        {data.y_axis && <p className="text-[10px] text-gray-400 mb-4">{data.y_axis}</p>}
        <div className="flex items-end gap-1.5 h-48 mb-2">
          {data.categories.map((cat, ci) => (
            <div key={ci} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
              <div className="flex gap-0.5 items-end w-full h-full">
                {data.series.map((s, si) => (
                  <div key={si} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[8px] text-gray-500 dark:text-gray-400 mb-0.5">{s.values[ci]}</span>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${(s.values[ci] / maxVal) * 85}%`,
                        backgroundColor: colors[si % colors.length],
                        minHeight: '2px',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mb-3">
          {data.categories.map((cat, ci) => (
            <div key={ci} className="flex-1 text-center text-[9px] font-medium text-gray-500 dark:text-gray-400 truncate">
              {cat}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center pt-2 border-t border-gray-100 dark:border-gray-700">
          {data.series.map((s, si) => (
            <div key={si} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[si % colors.length] }} />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'table') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 overflow-x-auto">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{data.title}</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-600">
              {data.headers.map((h, i) => (
                <th key={i} className="text-left py-2 px-3 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className={`py-2 px-3 ${ci === 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 tabular-nums'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.type === 'flow_diagram') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{data.title}</h4>
        <div className="flex flex-col items-center gap-0">
          {data.stages.map((stage, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div className="w-full max-w-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{stage.label}</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{stage.detail}</p>
              </div>
              {i < data.stages.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <div className="w-0.5 h-3 bg-blue-300 dark:bg-blue-700" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-blue-300 dark:border-t-blue-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function WritingSection({ section, answers, onAnswer, marked, onToggleMark, activeQuestionId, activeTask, onTaskChange }) {
  const [analyses, setAnalyses] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const writingQuestions = useMemo(() => {
    const qs = [];
    (section.passages || []).forEach(p => {
      (p.questions || []).forEach(q => {
        if (q.question_type === 'writing_task') qs.push(q);
      });
    });
    if (qs.length === 0) {
      (section.questions || []).forEach(q => {
        if (q.question_type === 'writing_task') qs.push(q);
      });
    }
    return qs.sort((a, b) => a.question_order - b.question_order);
  }, [section]);

  const currentQuestion = writingQuestions[activeTask] || writingQuestions[0];
  const essayPrompt = currentQuestion?.question_text || '';
  const isTask1 = activeTask === 0;
  const minWords = isTask1 ? 150 : 250;
  const writingKey = `writing_task_${activeTask + 1}`;

  const taskTexts = (answers[writingKey]?.answer_text != null ? answers[writingKey].answer_text : '') || (answers[currentQuestion?.id]?.answer_text != null ? answers[currentQuestion?.id].answer_text : '') || '';
  const wordCount = taskTexts.trim() ? taskTexts.trim().split(/\s+/).length : 0;
  const currentAnalysis = analyses[activeTask];

  const handleAnalyze = async () => {
    if (!taskTexts.trim()) return;

    const words = taskTexts.trim().split(/\s+/);
    const hasVowel = (w) => /[aeiou]/i.test(w);
    const englishLike = words.filter(w => hasVowel(w) && w.length > 1);
    const vowelChars = taskTexts.toLowerCase().split('').filter(c => /[aeiou]/.test(c)).length;
    const alphaChars = taskTexts.toLowerCase().split('').filter(c => /[a-z]/.test(c)).length;
    const vowelRatio = alphaChars > 0 ? vowelChars / alphaChars : 0;
    const englishRatio = words.length > 0 ? englishLike.length / words.length : 0;

    if (englishRatio < 0.4 || vowelRatio < 0.2) {
      alert('Your text does not appear to contain meaningful English words. Please write your response in proper English before analyzing.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await mockTestService.analyzeWriting({
        text: taskTexts,
        task_number: activeTask + 1,
      });
      setAnalyses(prev => ({ ...prev, [activeTask]: res.data }));
    } catch (err) {
      console.error('Failed to analyze writing:', err);
      alert('Failed to analyze. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {writingQuestions.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Writing Task {activeTask + 1} of {writingQuestions.length}
            </h4>
            <div className="flex gap-1">
              {writingQuestions.map((_, i) => (
                <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${
                  i === activeTask ? 'bg-purple-500' : i < activeTask ? 'bg-purple-300' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {writingQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => onTaskChange(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTask === i
                    ? 'bg-purple-500 text-white'
                    : i < activeTask
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i < activeTask ? '✓ ' : ''}Task {i + 1}
                {analyses[i] && <span className="ml-1">&#10003;</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {essayPrompt && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <PenTool size={18} className="text-purple-500" />
            <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300">
              {isTask1 ? 'Task 1 — Report Writing' : 'Task 2 — Essay'}
            </h3>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {essayPrompt}
          </p>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-purple-200/50 dark:border-purple-800/50">
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {isTask1 ? 'Write at least 150 words' : 'Write at least 250 words'}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isTask1 ? 'Describe and summarise the key features' : 'Discuss both views and give your opinion'}
            </span>
          </div>
        </div>
      )}

      {currentQuestion?.options && typeof currentQuestion.options === 'object' && currentQuestion.options.type && (
        <ChartDisplay data={currentQuestion.options} />
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Your Response</label>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            wordCount === 0
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              : wordCount < minWords
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          }`}>
            {wordCount} / {minWords} words
          </span>
        </div>
        <textarea
          key={writingKey}
          value={taskTexts}
          onChange={(e) => {
            onAnswer(
              currentQuestion?.id,
              e.target.value,
              'writing',
              writingKey
            );
          }}
          placeholder="Write your essay here..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full h-72 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={analyzing || !taskTexts.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {analyzing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing your writing...
          </>
        ) : (
          <>
            <BarChart3 size={16} />
            {currentAnalysis ? 'Re-analyze Writing' : 'Analyze My Writing'}
          </>
        )}
      </motion.button>

      {currentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Task {activeTask + 1} Analysis
            </h3>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
              currentAnalysis.estimated_band >= 7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : currentAnalysis.estimated_band >= 5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              Band {currentAnalysis.estimated_band.toFixed(1)}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'Words', value: currentAnalysis.word_count, color: 'blue' },
              { label: 'Sentences', value: currentAnalysis.sentence_count, color: 'purple' },
              { label: 'Paragraphs', value: currentAnalysis.paragraph_count, color: 'green' },
              { label: 'Avg Words/Sent', value: currentAnalysis.avg_sentence_length, color: 'orange' },
              { label: 'Vocab Richness', value: `${currentAnalysis.vocab_richness}%`, color: 'pink' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`text-center p-2 rounded-xl bg-${color}-50 dark:bg-${color}-900/20`}>
                <div className={`text-lg font-bold text-${color}-600 dark:text-${color}-400`}>{value}</div>
                <div className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</div>
              </div>
            ))}
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Grammar', score: currentAnalysis.grammar_score, color: 'blue' },
              { label: 'Vocabulary', score: currentAnalysis.vocabulary_score, color: 'purple' },
              { label: 'Task Response', score: currentAnalysis.task_response_score, color: 'green' },
              { label: 'Coherence', score: currentAnalysis.coherence_score, color: 'orange' },
              { label: 'Sentence Variety', score: currentAnalysis.sentence_variety_score, color: 'pink' },
            ].map(({ label, score, color }) => (
              <div key={label} className={`text-center p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20`}>
                <div className={`text-2xl font-bold ${
                  score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>{score.toFixed(1)}</div>
                <div className={`text-[10px] font-semibold text-${color}-600 dark:text-${color}-400 uppercase mt-1`}>{label}</div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentAnalysis.feedback}
          </div>

          {/* Punctuation Issues */}
          {currentAnalysis.punctuation_issues?.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                <AlertCircle size={13} />
                Punctuation Issues ({currentAnalysis.missing_commas} missing commas, {currentAnalysis.repeated_words} repeated words)
              </h4>
              <ul className="space-y-1.5">
                {currentAnalysis.punctuation_issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grammar Issues */}
          {currentAnalysis.grammar_issues?.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-200 dark:border-orange-800/30">
              <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1.5">
                <AlertCircle size={13} />
                Grammar Issues
              </h4>
              <ul className="space-y-1.5">
                {currentAnalysis.grammar_issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spelling Errors */}
          {currentAnalysis.spelling_errors > 0 && (
            <div className="bg-red-50/80 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800/30">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
                <AlertCircle size={13} />
                Spelling Errors — {currentAnalysis.spelling_errors} found
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Possible misspellings detected. Review your spelling carefully — errors reduce vocabulary score.
              </p>
            </div>
          )}

          {/* Complex Structures */}
          {currentAnalysis.complex_structures > 0 && (
            <div className="bg-purple-50/80 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800/30">
              <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1.5">
                <BarChart3 size={13} />
                Complex Structures — {currentAnalysis.complex_structures} total
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.relative_clauses > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                    Relative clauses: {currentAnalysis.relative_clauses}
                  </span>
                )}
                {currentAnalysis.conditionals > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                    Conditionals: {currentAnalysis.conditionals}
                  </span>
                )}
                {currentAnalysis.passive_voice > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                    Passive voice: {currentAnalysis.passive_voice}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Topic Sentences */}
          {currentAnalysis.topic_sentence_count > 0 && (
            <div className="bg-green-50/80 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800/30">
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Topic Sentences — {currentAnalysis.topic_sentence_count} detected
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                {currentAnalysis.topic_sentence_count >= currentAnalysis.paragraph_count - 1
                  ? 'Good — most paragraphs have clear topic sentences.'
                  : 'Some paragraphs may lack clear topic sentences.'}
              </p>
            </div>
          )}

          {/* Prompt Reuse */}
          {currentAnalysis.low_reuse && (
            <div className="bg-yellow-50/80 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800/30">
              <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 mb-1 flex items-center gap-1.5">
                <AlertCircle size={13} />
                Repeated Phrasing Detected
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Similar word patterns repeated — paraphrase to show lexical range.
              </p>
            </div>
          )}

          {/* Task Features */}
          <div className="grid grid-cols-2 gap-3">
            {currentAnalysis.has_data_description && (
              <div className="bg-blue-50/80 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-200 dark:border-blue-800/30">
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Data Description</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Data trends and figures described</p>
              </div>
            )}
            {currentAnalysis.has_position_statement && (
              <div className="bg-blue-50/80 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-200 dark:border-blue-800/30">
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Position Statement</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Clear opinion or position stated</p>
              </div>
            )}
            {currentAnalysis.has_examples && (
              <div className="bg-blue-50/80 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-200 dark:border-blue-800/30">
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Examples</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Supporting examples provided</p>
              </div>
            )}
          </div>

          {currentAnalysis.strengths?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">Strengths</h4>
              <ul className="space-y-1">
                {currentAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentAnalysis.weaknesses?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Areas to Improve</h4>
              <ul className="space-y-1">
                {currentAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <AlertCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentAnalysis.recommendations?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Recommendations</h4>
              <ul className="space-y-1">
                {currentAnalysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <ChevronRight size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ===== NLP LanguageTool Analysis ===== */}
          {currentAnalysis.nlp_grammar && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                <BarChart3 size={14} />
                LanguageTool NLP Analysis
              </h4>

              {/* Grammar (LanguageTool) */}
              <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800/30 mb-3">
                <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                  Grammar (LanguageTool) — Score: {currentAnalysis.nlp_grammar.score}/10
                </h5>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {currentAnalysis.nlp_grammar.error_count} errors found
                  </span>
                  {currentAnalysis.nlp_grammar.error_count > 0 && (
                    <span className="text-[10px] text-gray-500">
                      ({currentAnalysis.nlp_grammar.error_density}% error density)
                    </span>
                  )}
                </div>
                {Object.keys(currentAnalysis.nlp_grammar.categories || {}).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Object.entries(currentAnalysis.nlp_grammar.categories).map(([cat, count]) => (
                      <span key={cat} className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                        {cat} ({count})
                      </span>
                    ))}
                  </div>
                )}
                {currentAnalysis.nlp_grammar.issues?.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {currentAnalysis.nlp_grammar.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">&#8226;</span>
                        <span>{issue.message}</span>
                        {issue.suggestions?.length > 0 && (
                          <span className="text-[10px] text-green-600 dark:text-green-400 ml-1">
                            Suggestion: {issue.suggestions.join(', ')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vocabulary Analysis */}
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800/30 mb-3">
                <h5 className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2">
                  Vocabulary Analysis — Score: {currentAnalysis.nlp_vocabulary.score}/10
                </h5>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {currentAnalysis.nlp_vocabulary.vocabulary_richness}%
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase">Richness</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {currentAnalysis.nlp_vocabulary.lexical_diversity}%
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase">Diversity</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {currentAnalysis.nlp_vocabulary.complex_word_ratio}%
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase">Complex Words</div>
                  </div>
                </div>
                {currentAnalysis.nlp_vocabulary.academic_words_used?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">Academic words: </span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      {currentAnalysis.nlp_vocabulary.academic_words_used.join(', ')}
                    </span>
                  </div>
                )}
                {currentAnalysis.nlp_vocabulary.informal_words_found?.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800/30">
                    <span className="text-[10px] font-semibold text-yellow-600 dark:text-yellow-400">Informal words found: </span>
                    <span className="text-[10px] text-yellow-700 dark:text-yellow-300">
                      {currentAnalysis.nlp_vocabulary.informal_words_found.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Coherence Analysis */}
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800/30 mb-3">
                <h5 className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">
                  Coherence &amp; Cohesion — Score: {currentAnalysis.nlp_coherence.score}/10
                </h5>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                      {currentAnalysis.nlp_coherence.total_transition_words}
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase">Transition Words</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                      {currentAnalysis.nlp_coherence.unique_transition_categories}
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase">Categories</div>
                  </div>
                </div>
                {Object.keys(currentAnalysis.nlp_coherence.transitions_used || {}).length > 0 && (
                  <div className="space-y-1 mb-2">
                    {Object.entries(currentAnalysis.nlp_coherence.transitions_used).map(([category, words]) => (
                      <div key={category} className="text-[10px]">
                        <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
                          {category.replace('_', ' ')}:
                        </span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{words.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-[10px] text-gray-500">
                  <span>Topic sentences: {currentAnalysis.nlp_coherence.topic_sentence_ratio}%</span>
                  <span>Para consistency: {currentAnalysis.nlp_coherence.para_consistency}%</span>
                  <span>Sent length variation: {currentAnalysis.nlp_coherence.sentence_length_variation}%</span>
                </div>
              </div>

              {/* Task Achievement Analysis */}
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-200 dark:border-orange-800/30 mb-3">
                <h5 className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-2">
                  Task Achievement — Score: {currentAnalysis.nlp_task_achievement.score}/10
                </h5>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={currentAnalysis.nlp_task_achievement.has_introduction ? 'text-green-500' : 'text-red-400'}>
                      {currentAnalysis.nlp_task_achievement.has_introduction ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Introduction</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={currentAnalysis.nlp_task_achievement.has_body ? 'text-green-500' : 'text-red-400'}>
                      {currentAnalysis.nlp_task_achievement.has_body ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Body paragraphs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={currentAnalysis.nlp_task_achievement.has_conclusion ? 'text-green-500' : 'text-red-400'}>
                      {currentAnalysis.nlp_task_achievement.has_conclusion ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Conclusion</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={currentAnalysis.nlp_task_achievement.word_count_met ? 'text-green-500' : 'text-red-400'}>
                      {currentAnalysis.nlp_task_achievement.word_count_met ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Word count ({currentAnalysis.nlp_task_achievement.word_count}/{currentAnalysis.nlp_task_achievement.min_required})
                    </span>
                  </div>
                </div>
              </div>

              {/* NLP Suggestions */}
              {currentAnalysis.nlp_suggestions?.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
                  <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">NLP Suggestions</h5>
                  <ul className="space-y-1.5">
                    {currentAnalysis.nlp_suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-blue-400 mt-0.5 flex-shrink-0">&#8226;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function analyzeSpeakingRecording(transcript, source) {
  if (!transcript || !source) return null;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const sourceWords = norm(source);
  const transcriptWords = norm(transcript);
  const sourceSet = new Set(sourceWords);
  const transcriptSet = new Set(transcriptWords);

  let matched = 0;
  transcriptWords.forEach(w => { if (sourceSet.has(w)) matched++; });
  const accuracy = transcriptWords.length > 0 ? Math.round((matched / transcriptWords.length) * 100) : 0;

  const uniqueWords = transcriptSet.size;
  const totalWords = transcriptWords.length || 1;
  const lexicalDiversity = Math.round((uniqueWords / totalWords) * 100);

  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;
  const fluencyScore = Math.min(100, Math.round(
    (accuracy * 0.5) + (lexicalDiversity * 0.3) + (Math.min(avgWordsPerSentence, 20) * 2)
  ));

  const missingWords = sourceWords.filter(w => !transcriptSet.has(w));
  const extraWords = transcriptWords.filter(w => !sourceSet.has(w) && w.length > 3);

  let grade = 'C';
  if (accuracy >= 90 && lexicalDiversity >= 60) grade = 'A';
  else if (accuracy >= 75 && lexicalDiversity >= 45) grade = 'B';

  return { accuracy, lexicalDiversity, fluencyScore, grade, totalWords: transcriptWords.length, sourceWordCount: sourceWords.length, missingWords: missingWords.slice(0, 10), extraWords: extraWords.slice(0, 5), sentenceCount: sentences.length };
}

function SpeakingSection({ section, answers, onAnswer, marked, onToggleMark, speakingRecordings, onUpdateRecording, activeQuestionId, activePassage, onPassageChange }) {
  const passages = section.passages || [];
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  const [analyzingNLP, setAnalyzingNLP] = useState(false);
  const [micError, setMicError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const activePartRef = useRef(0);
  const recordingTimeRef = useRef(0);
  const transcriptRef = useRef('');

  const currentRecording = speakingRecordings[activePassage] || {};
  const passage = passages[activePassage];
  const sourceText = passage?.passage_text || '';

  const startRecording = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Microphone requires HTTPS or localhost. Your browser does not support mic access on this page.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setAnalysis(null);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const partIdx = activePartRef.current;
        const srcText = passages[partIdx]?.passage_text || '';
        const finalAnalysis = analyzeSpeakingRecording(transcriptRef.current, srcText);
        setAnalysis(finalAnalysis);
        onUpdateRecording(partIdx, {
          audio_url: url,
          audio_blob: blob,
          duration_seconds: recordingTimeRef.current,
          transcript: transcriptRef.current,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + ' ';
            }
          }
          if (transcript.trim()) {
            transcriptRef.current = transcript.trim();
            const partIdx = activePartRef.current;
            const srcText = passages[partIdx]?.passage_text || '';
            const result = analyzeSpeakingRecording(transcript.trim(), srcText);
            setAnalysis(result);
            onUpdateRecording(partIdx, {
              ...speakingRecordings[partIdx] || {},
              audio_url: speakingRecordings[partIdx]?.audio_url || null,
              audio_blob: speakingRecordings[partIdx]?.audio_blob || null,
              duration_seconds: recordingTimeRef.current,
              transcript: transcript.trim(),
            });
          }
        };
        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was denied. Please allow mic access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicError('No microphone found. Please connect a microphone and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setMicError('Microphone is already in use by another application. Please close other apps using the mic.');
      } else {
        setMicError(`Microphone error: ${err.message || 'Unknown error'}. Try using Chrome or Edge on localhost.`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setIsPaused(false);
    if (currentRecording.transcript && sourceText) {
      const result = analyzeSpeakingRecording(currentRecording.transcript, sourceText);
      setAnalysis(result);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const deleteRecording = () => {
    stopRecording();
    setRecordingTime(0);
    setAnalysis(null);
    setNlpAnalysis(null);
    onUpdateRecording(activePassage, {
      audio_url: null,
      audio_blob: null,
      duration_seconds: 0,
      transcript: '',
    });
  };

  const handleNLPAnalysis = async () => {
    const transcript = currentRecording.transcript || '';
    if (!transcript.trim()) return;
    setAnalyzingNLP(true);
    try {
      const res = await mockTestService.analyzeSpeakingNLP({
        transcript: transcript,
        part_number: activePassage + 1,
        duration_seconds: currentRecording.duration_seconds || recordingTimeRef.current,
      });
      setNlpAnalysis(res.data);
    } catch (err) {
      console.error('Failed to analyze speaking:', err);
    } finally {
      setAnalyzingNLP(false);
    }
  };

  useEffect(() => {
    activePartRef.current = activePassage;
  }, [activePassage]);

  useEffect(() => {
    recordingTimeRef.current = recordingTime;
  }, [recordingTime]);

  const formatRecTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="space-y-4">
      {passages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Speaking Part {activePassage + 1} of {passages.length}
            </h4>
            <div className="flex gap-1">
              {passages.map((_, i) => (
                <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${
                  i === activePassage ? 'bg-orange-500' : i < activePassage ? 'bg-orange-300' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { onPassageChange(i); setRecordingTime(0); setAnalysis(null); setNlpAnalysis(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePassage === i
                    ? 'bg-orange-500 text-white'
                    : i < activePassage
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i < activePassage ? '✓ ' : ''}Part {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {sourceText && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={18} className="text-orange-500" />
            <h3 className="text-sm font-bold text-orange-700 dark:text-orange-300">
              {passage?.title || `Part ${activePassage + 1}`}
            </h3>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {sourceText}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-500/25"
            >
              <Mic size={16} />
              Start Recording
            </motion.button>
          ) : (
            <>
              {isPaused ? (
                <motion.button whileTap={{ scale: 0.95 }} onClick={resumeRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all">
                  <Play size={16} /> Resume
                </motion.button>
              ) : (
                <motion.button whileTap={{ scale: 0.95 }} onClick={pauseRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-all">
                  <Pause size={16} /> Pause
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.95 }} onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all">
                <StopCircle size={16} /> Stop
              </motion.button>
            </>
          )}

          {currentRecording.audio_url && !isRecording && (
            <>
              <audio controls src={currentRecording.audio_url} className="h-9" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={deleteRecording}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-all">
                <Trash2 size={14} /> Delete
              </motion.button>
            </>
          )}

          {(isRecording || isPaused) && (
            <div className="flex items-center gap-2 text-red-500">
              <div className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-sm font-mono font-bold">{formatRecTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {micError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{micError}</p>
          </div>
        )}

        {currentRecording.transcript && !isRecording && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Your Transcript</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentRecording.transcript}</p>
          </div>
        )}

        {analysis && !isRecording && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> Analysis Results
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <div className={`text-2xl font-bold ${analysis.accuracy >= 80 ? 'text-green-600' : analysis.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{analysis.accuracy}%</div>
                <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase mt-1">Accuracy</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Words matched</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <div className={`text-2xl font-bold ${analysis.lexicalDiversity >= 60 ? 'text-green-600' : analysis.lexicalDiversity >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{analysis.lexicalDiversity}%</div>
                <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase mt-1">Vocabulary</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Unique words</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <div className={`text-2xl font-bold ${analysis.fluencyScore >= 75 ? 'text-green-600' : analysis.fluencyScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{analysis.fluencyScore}</div>
                <div className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase mt-1">Fluency</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Overall score</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500">Overall Grade:</span>
              <span className={`text-lg font-bold px-3 py-0.5 rounded-lg ${
                analysis.grade === 'A' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                analysis.grade === 'B' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' :
                'bg-red-100 dark:bg-red-900/30 text-red-600'
              }`}>{analysis.grade}</span>
              <span className="text-xs text-gray-400 ml-2">
                {analysis.totalWords} / {analysis.sourceWordCount} words spoken
              </span>
            </div>

            {analysis.missingWords.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold text-red-500">Missed words: </span>
                <span className="text-gray-500">{analysis.missingWords.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {currentRecording.transcript && !isRecording && (
          <button
            onClick={handleNLPAnalysis}
            disabled={analyzingNLP}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {analyzingNLP ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing Speech...
              </>
            ) : (
              <>
                <Mic size={16} />
                Analyze My Speaking
              </>
            )}
          </button>
        )}

        {nlpAnalysis && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Mic size={16} className="text-indigo-500" /> NLP Speech Analysis
            </h4>

            {nlpAnalysis.estimated_band && (
              <div className="flex items-center gap-4">
                <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600">{nlpAnalysis.estimated_band}</div>
                  <div className="text-[10px] font-semibold text-indigo-500 uppercase mt-1">Est. Band</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{nlpAnalysis.word_count}</div>
                  <div className="text-[10px] font-semibold text-purple-500 uppercase mt-1">Words</div>
                </div>
                {nlpAnalysis.fluency_metrics && (
                  <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">{nlpAnalysis.fluency_metrics.words_per_minute}</div>
                    <div className="text-[10px] font-semibold text-orange-500 uppercase mt-1">WPM</div>
                  </div>
                )}
              </div>
            )}

            {nlpAnalysis.nlp_grammar && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Grammar</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {nlpAnalysis.nlp_grammar.error_count || 0} issues found
                  {nlpAnalysis.nlp_grammar.score != null && <span className="ml-2 text-indigo-600">({Math.round(nlpAnalysis.nlp_grammar.score)}%)</span>}
                </p>
                {nlpAnalysis.nlp_grammar.issues && nlpAnalysis.nlp_grammar.issues.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {nlpAnalysis.nlp_grammar.issues.slice(0, 5).map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs">
                        <AlertCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-red-700 dark:text-red-300">{issue.message}</span>
                          {issue.context && <span className="text-gray-400 ml-1">in "{issue.context}"</span>}
                          {issue.suggestions && issue.suggestions.length > 0 && (
                            <span className="text-green-600 dark:text-green-400 ml-1">→ {issue.suggestions[0]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {nlpAnalysis.nlp_vocabulary && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Vocabulary</h5>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {nlpAnalysis.nlp_vocabulary.ttr != null && (
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="text-lg font-bold text-purple-600">{Math.round(nlpAnalysis.nlp_vocabulary.ttr * 100)}%</div>
                      <div className="text-[10px] text-purple-500">Diversity</div>
                    </div>
                  )}
                  {nlpAnalysis.nlp_vocabulary.academic_word_count != null && (
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-lg font-bold text-blue-600">{nlpAnalysis.nlp_vocabulary.academic_word_count}</div>
                      <div className="text-[10px] text-blue-500">Academic Words</div>
                    </div>
                  )}
                  {nlpAnalysis.nlp_vocabulary.informal_count != null && (
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="text-lg font-bold text-orange-600">{nlpAnalysis.nlp_vocabulary.informal_count}</div>
                      <div className="text-[10px] text-orange-500">Informal Words</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {nlpAnalysis.nlp_coherence && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Coherence</h5>
                <div className="flex flex-wrap gap-2">
                  {nlpAnalysis.nlp_coherence.transition_count != null && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {nlpAnalysis.nlp_coherence.transition_count} transition words
                    </span>
                  )}
                  {nlpAnalysis.nlp_coherence.score != null && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Score: {Math.round(nlpAnalysis.nlp_coherence.score)}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {nlpAnalysis.fluency_metrics && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Fluency Metrics</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                    <span className="text-gray-500">Avg words/sentence</span>
                    <span className="font-bold text-orange-600">{nlpAnalysis.fluency_metrics.avg_words_per_sentence}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                    <span className="text-gray-500">Sentences</span>
                    <span className="font-bold text-orange-600">{nlpAnalysis.fluency_metrics.sentence_count}</span>
                  </div>
                  {nlpAnalysis.fluency_metrics.filler_words && nlpAnalysis.fluency_metrics.filler_words.length > 0 && (
                    <div className="col-span-2 flex justify-between p-2 rounded bg-red-50 dark:bg-red-900/20">
                      <span className="text-red-500">Filler words</span>
                      <span className="font-bold text-red-600">{nlpAnalysis.fluency_metrics.filler_words.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {nlpAnalysis.nlp_suggestions && nlpAnalysis.nlp_suggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Suggestions</h5>
                <ul className="space-y-1">
                  {nlpAnalysis.nlp_suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-blue-500">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionInput({ question, value, onChange, isMarked, onToggleMark, isActive, result }) {
  const renderInput = () => {
    switch (question.question_type) {
      case 'mcq':
      case 'multiple_choice': {
        const options = question.options
          ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options)
          : [];
        if (!options.length) {
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          );
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const optText = typeof opt === 'string' ? opt : opt.text || opt;
              const isSelected = value === optText;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(optText)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {letter}
                  </span>
                  <span className={`text-sm ${isSelected ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {optText}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }

      case 'true_false_ng':
      case 'true_false_not_given':
      case 'true_false':
      case 'yes_no': {
        const opts = question.question_type === 'yes_no'
          ? ['Yes', 'No', 'Not Given']
          : ['True', 'False', 'Not Given'];
        return (
          <div className="flex gap-2 flex-wrap">
            {opts.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                  value === opt
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        );
    }
  };

  const typeLabels = {
    form_completion: 'Form Completion',
    fill_blank: 'Fill in the Blank',
    short_answer: 'Short Answer',
    sentence_completion: 'Sentence Completion',
    mcq: 'Multiple Choice',
    multiple_choice: 'Multiple Choice',
    true_false: 'True / False / Not Given',
    true_false_ng: 'True / False / Not Given',
    true_false_not_given: 'True / False / Not Given',
    yes_no: 'Yes / No / Not Given',
    matching: 'Matching',
    matching_headings: 'Matching Headings',
    summary_completion: 'Summary Completion',
    diagram_label: 'Diagram Labelling',
  };

  return (
    <div id={`question-${question.id}`} className={`bg-white dark:bg-surface-cardDark rounded-xl p-4 border shadow-sm transition-all duration-200 ${
      result
        ? result.is_correct
          ? 'border-green-400 dark:border-green-500 ring-2 ring-green-400/30 bg-green-50/50 dark:bg-green-900/10'
          : 'border-red-400 dark:border-red-500 ring-2 ring-red-400/30 bg-red-50/50 dark:bg-red-900/10'
        : isActive
          ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10'
          : 'border-gray-100 dark:border-gray-800'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-500">Q{question.question_order}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {typeLabels[question.question_type] || question.question_type}
            </span>
            {question.marks > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-900 dark:text-white">{question.question_text}</p>
        </div>
        <button
          onClick={onToggleMark}
          className={`p-1.5 rounded-lg transition-all ${
            isMarked
              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
          title="Mark for review"
        >
          {isMarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
      {renderInput()}
      {result && !result.is_correct && (
        <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle size={12} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400">Incorrect</span>
          </div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            Correct answer: <span className="font-semibold text-green-600 dark:text-green-400">{result.correct_answer.join(' / ')}</span>
          </p>
        </div>
      )}
      {result && result.is_correct && (
        <div className="mt-3 p-2.5 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400">Correct! +{result.marks} mark{result.marks !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            Submit Test
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SaveIndicator({ saving, saved }) {
  if (saving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 size={12} className="animate-spin" />
        Saving...
      </div>
    );
  }
  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-1.5 text-xs text-green-500"
      >
        <CheckCircle2 size={12} />
        Saved
      </motion.div>
    );
  }
  return null;
}

export default function MockTestAttempt() {
  const { attempt_id } = useParams();
  const navigate = useNavigate();
  useAuth();

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [speakingRecordings, setSpeakingRecordings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(true);
  const [activePassages, setActivePassages] = useState({});
  const [sectionResults, setSectionResults] = useState(null);
  const [scoringSection, setScoringSection] = useState(false);
  const [activeWritingTask, setActiveWritingTask] = useState(0);

  const globalTimer = useTimer(testData?.remaining_time_seconds || 0, false);
  const sectionTimer = useTimer(0, false);

  const sections = useMemo(() => 
    testData?.sections?.sort((a, b) => a.section_order - b.section_order) || [],
    [testData]
  );
  const currentSection = sections[currentSectionIdx];

  const allQuestions = useMemo(() => {
    if (!currentSection) return [];
    const sectionType = currentSection.section_type;
    const passages = [...(currentSection.passages || [])].sort((a, b) => (a.passage_order || 0) - (b.passage_order || 0));
    const hasPassages = passages.length > 0;

    if (hasPassages && (sectionType === 'listening' || sectionType === 'reading')) {
      const activeIdx = activePassages[currentSectionIdx] || 0;
      const passage = passages[activeIdx];
      return (passage?.questions || []).sort((a, b) => a.question_order - b.question_order);
    }

    const qs = [];
    passages.forEach(p => (p.questions || []).forEach(q => qs.push(q)));
    (currentSection.questions || []).forEach(q => { if (!q.passage_id) qs.push(q); });
    return qs;
  }, [currentSection, currentSectionIdx, activePassages]);

  const currentQuestion = allQuestions[currentQuestionIdx];

  const currentSectionTiming = testData?.section_timings?.find(
    (t) => t.section_type === currentSection?.section_type
  );

  const fetchTestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mockTestService.getTest(attempt_id);
      const data = response.data;
      setTestData(data);

      const initialAnswers = {};
      (data.user_answers || []).forEach((a) => {
        initialAnswers[a.question_id] = a;
      });
      setAnswers(initialAnswers);

      const sectionIdx = SECTION_TYPES.indexOf(data.current_section);
      if (sectionIdx >= 0) setCurrentSectionIdx(sectionIdx);

      if (data.status !== 'in_progress') {
        navigate(`/mock-tests/${attempt_id}/results`);
        return;
      }
    } catch (err) {
      console.error('Failed to load test:', err);
      setError('Failed to load test data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [attempt_id, navigate]);

  useEffect(() => {
    fetchTestData();
  }, [fetchTestData]);

  useEffect(() => {
    if (testData && testData.status === 'in_progress') {
      globalTimer.restart(testData.remaining_time_seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testData]);

  useEffect(() => {
    if (currentSection && currentSectionTiming) {
      const remaining = currentSectionTiming.remaining_seconds || currentSectionTiming.time_limit_seconds || 0;
      sectionTimer.restart(remaining);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSectionIdx, currentSection]);

  useEffect(() => {
    if (globalTimer.seconds === 0 && testData) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalTimer.seconds]);

  useEffect(() => {
    if (sectionTimer.seconds === 0 && currentSection) {
      if (currentSectionIdx < sections.length - 1) {
        handleSectionChange(currentSectionIdx + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTimer.seconds]);

  const saveAnswer = useCallback(async (questionId, answerText, section, writingKey) => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        attempt_id: parseInt(attempt_id),
        question_id: questionId,
        answer_text: answerText,
        is_marked_for_review: marked.has(questionId),
        section: section,
      };
      await mockTestService.saveAnswer(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save answer:', err);
    } finally {
      setSaving(false);
    }
  }, [attempt_id, marked]);

  const debouncedSave = useDebouncedCallback(saveAnswer, 1500);

  const handleAnswer = useCallback((questionId, value, section, writingKey) => {
    setAnswers((prev) => ({
      ...prev,
      [writingKey || questionId]: {
        ...(prev[writingKey || questionId] || {}),
        question_id: questionId,
        answer_text: value,
        section,
      },
    }));
    debouncedSave(questionId, value, section, writingKey);
  }, [debouncedSave]);

  const handleToggleMark = useCallback((questionId) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const handleSectionChange = useCallback((idx) => {
    if (idx < 0 || idx >= sections.length) return;
    setCurrentSectionIdx(idx);
    setCurrentQuestionIdx(0);
    setSectionResults(null);
    if (sections[idx]?.section_type === 'writing') {
      setActiveWritingTask(0);
    }
  }, [sections]);

  const handleQuestionNav = useCallback((idx) => {
    setCurrentQuestionIdx(idx);
    const q = allQuestions[idx];
    if (q) {
      setTimeout(() => {
        const el = document.getElementById(`question-${q.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else {
          setTimeout(() => {
            const retry = document.getElementById(`question-${q.id}`);
            if (retry) retry.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }, 100);
    }
  }, [allQuestions]);

  const handleSpeakingUpdate = useCallback((partIdx, data) => {
    setSpeakingRecordings((prev) => ({
      ...prev,
      [partIdx]: { ...(prev[partIdx] || {}), ...data },
    }));
  }, []);

  const handleScoreSection = useCallback(async () => {
    if (scoringSection || !currentSection) return;
    const sectionType = currentSection.section_type;
    if (sectionType !== 'listening' && sectionType !== 'reading') return;

    try {
      setScoringSection(true);
      const res = await mockTestService.scoreSection({
        attempt_id: parseInt(attempt_id),
        section_type: sectionType,
      });
      setSectionResults(res.data);
    } catch (err) {
      console.error('Failed to score section:', err);
      alert('Failed to check answers. Please try again.');
    } finally {
      setScoringSection(false);
    }
  }, [scoringSection, currentSection, attempt_id]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting) return;

    if (!autoSubmit) {
      setShowSubmitDialog(true);
      return;
    }

    try {
      setSubmitting(true);
      sectionTimer.pause();
      globalTimer.pause();

      const writingAnswers = [];
      const writingSection = sections.find((s) => s.section_type === 'writing');
      if (writingSection) {
        const writingQuestions = [];
        (writingSection.passages || []).forEach(p => {
          (p.questions || []).forEach(q => {
            if (q.question_type === 'writing_task') writingQuestions.push(q);
          });
        });
        if (writingQuestions.length === 0) {
          (writingSection.questions || []).forEach(q => {
            if (q.question_type === 'writing_task') writingQuestions.push(q);
          });
        }
        writingQuestions.sort((a, b) => a.question_order - b.question_order);
        writingQuestions.forEach((q, i) => {
          const key = `writing_task_${i + 1}`;
          const answer = answers[key] || answers[q.id];
          if (answer && answer.answer_text) {
            writingAnswers.push({
              task_number: i + 1,
              text: answer.answer_text,
            });
          }
        });
      }

      const speakingParts = sections.find((s) => s.section_type === 'speaking')?.passages || [];
      const speakingRecs = speakingParts.map((_, i) => {
        const rec = speakingRecordings[i] || {};
        return {
          part_number: i + 1,
          audio_url: rec.audio_url || '',
          transcript: rec.transcript || '',
          duration_seconds: rec.duration_seconds || 0,
        };
      });

      await mockTestService.submitTest({
        attempt_id: parseInt(attempt_id),
        writing_answers: writingAnswers,
        speaking_recordings: speakingRecs,
      });

      navigate(`/mock-tests/${attempt_id}/results`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  }, [submitting, answers, speakingRecordings, attempt_id, navigate, sections, sectionTimer, globalTimer]);

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    handleSubmit(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSubmit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-medium mb-4">{error}</p>
          <button onClick={fetchTestData} className="gradient-btn text-sm !py-2.5 px-6">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const globalSecs = globalTimer.seconds;
  const sectionSecs = sectionTimer.seconds;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-surface-cardDark/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mock-tests')}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Exit test"
            >
              <X size={18} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                {testData?.title}
              </h1>
              <p className="text-[10px] text-gray-400">{testData?.difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TimerDisplay seconds={globalSecs} label="Global" critical={globalSecs < 300} />
            <TimerDisplay seconds={sectionSecs} label="Section" critical={sectionSecs < 60} />
            <SaveIndicator saving={saving} saved={saved} />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          {sections.map((section, i) => {
            const meta = SECTION_META[section.section_type];
            const Icon = meta.icon;
            const colors = COLOR_MAP[meta.color];
            const isActive = i === currentSectionIdx;
            const isCompleted = i < currentSectionIdx;
            const hasQuestions = (section.passages || []).some((p) => p.questions?.length > 0) || section.questions?.length > 0;

            return (
              <React.Fragment key={section.id}>
                <button
                  onClick={() => handleSectionChange(i)}
                  disabled={!hasQuestions}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? colors.active
                      : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : hasQuestions
                          ? `${colors.tab} hover:bg-gray-100 dark:hover:bg-gray-800`
                          : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={13} /> : <Icon size={13} />}
                  {meta.label}
                </button>
                {i < sections.length - 1 && (
                  <div className={`w-4 h-0.5 ${
                    i < currentSectionIdx ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Question Nav */}
        <AnimatePresence>
          {showNavPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-cardDark overflow-hidden flex-shrink-0"
            >
              <div className="p-4 w-[260px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {currentSection?.section_type === 'listening' || currentSection?.section_type === 'reading'
                      ? `Passage ${(activePassages[currentSectionIdx] || 0) + 1}`
                      : SECTION_META[currentSection?.section_type]?.label || 'Questions'
                    } ({allQuestions.length})
                  </h3>
                  <button
                    onClick={() => setShowNavPanel(false)}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
                <QuestionNavGrid
                  questions={allQuestions}
                  answers={answers}
                  marked={marked}
                  currentIdx={currentQuestionIdx}
                  onSelect={handleQuestionNav}
                  sectionResults={sectionResults}
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-600" />
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-3 h-3 rounded bg-yellow-400" />
                    <span>Marked for review</span>
                  </div>
                  {sectionResults && (
                    <>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span>Correct</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span>Incorrect</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Nav Button */}
        {!showNavPanel && (
          <button
            onClick={() => setShowNavPanel(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-700 rounded-r-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection?.section_type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentSection?.section_type === 'listening' && (
                  <ListeningSection
                    section={currentSection}
                    answers={answers}
                    onAnswer={handleAnswer}
                    marked={marked}
                    onToggleMark={handleToggleMark}
                    activeQuestionId={currentQuestion?.id}
                    activePassage={activePassages[currentSectionIdx] || 0}
                    onPassageChange={(pIdx) => {
                      setActivePassages(prev => ({ ...prev, [currentSectionIdx]: pIdx }));
                      setCurrentQuestionIdx(0);
                      setSectionResults(null);
                    }}
                    sectionResults={currentSection?.section_type === 'listening' ? sectionResults : null}
                    onScoreSection={handleScoreSection}
                    scoringSection={scoringSection}
                  />
                )}

                {currentSection?.section_type === 'reading' && (
                  <ReadingSection
                    section={currentSection}
                    answers={answers}
                    onAnswer={handleAnswer}
                    marked={marked}
                    onToggleMark={handleToggleMark}
                    activeQuestionId={currentQuestion?.id}
                    activePassage={activePassages[currentSectionIdx] || 0}
                    onPassageChange={(pIdx) => {
                      setActivePassages(prev => ({ ...prev, [currentSectionIdx]: pIdx }));
                      setCurrentQuestionIdx(0);
                      setSectionResults(null);
                    }}
                    sectionResults={currentSection?.section_type === 'reading' ? sectionResults : null}
                    onScoreSection={handleScoreSection}
                    scoringSection={scoringSection}
                  />
                )}

                {currentSection?.section_type === 'writing' && (
                  <WritingSection
                    section={currentSection}
                    answers={answers}
                    onAnswer={handleAnswer}
                    marked={marked}
                    onToggleMark={handleToggleMark}
                    activeQuestionId={currentQuestion?.id}
                    activeTask={activeWritingTask}
                    onTaskChange={(taskIdx) => setActiveWritingTask(taskIdx)}
                  />
                )}

                {currentSection?.section_type === 'speaking' && (
                  <SpeakingSection
                    section={currentSection}
                    answers={answers}
                    onAnswer={handleAnswer}
                    marked={marked}
                    onToggleMark={handleToggleMark}
                    speakingRecordings={speakingRecordings}
                    onUpdateRecording={handleSpeakingUpdate}
                    activeQuestionId={currentQuestion?.id}
                    activePassage={activePassages[currentSectionIdx] || 0}
                    onPassageChange={(pIdx) => {
                      setActivePassages(prev => ({ ...prev, [currentSectionIdx]: pIdx }));
                      setCurrentQuestionIdx(0);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 z-40 bg-white/90 dark:bg-surface-cardDark/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentQuestion && (
              <button
                onClick={() => handleToggleMark(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  marked.has(currentQuestion.id)
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {marked.has(currentQuestion.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {marked.has(currentQuestion.id) ? 'Unmark' : 'Mark for Review'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentSectionIdx > 0 && (
              <button
                onClick={() => handleSectionChange(currentSectionIdx - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <ChevronLeft size={14} />
                {SECTION_META[sections[currentSectionIdx - 1]?.section_type]?.label || 'Previous'}
              </button>
            )}

            {(() => {
              const sectionType = currentSection?.section_type;
              const passages = currentSection?.passages || [];
              const hasMultiplePassages = passages.length > 1;
              const activePIdx = activePassages[currentSectionIdx] || 0;
              const isLastPassage = activePIdx >= passages.length - 1;
              const isLastSection = currentSectionIdx >= sections.length - 1;

              const writingQuestions = [];
              if (sectionType === 'writing') {
                (currentSection.passages || []).forEach(p => {
                  (p.questions || []).forEach(q => {
                    if (q.question_type === 'writing_task') writingQuestions.push(q);
                  });
                });
                if (writingQuestions.length === 0) {
                  (currentSection.questions || []).forEach(q => {
                    if (q.question_type === 'writing_task') writingQuestions.push(q);
                  });
                }
                writingQuestions.sort((a, b) => a.question_order - b.question_order);
              }
              const hasMultipleWritingTasks = writingQuestions.length > 1;
              const activeWritingIdx = activeWritingTask;
              const isLastWritingTask = activeWritingIdx >= writingQuestions.length - 1;

              if (sectionType === 'writing' && hasMultipleWritingTasks && !isLastWritingTask) {
                return (
                  <button
                    onClick={() => setActiveWritingTask(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/25 transition-all"
                  >
                    Next Task ({activeWritingIdx + 2} of {writingQuestions.length})
                    <ChevronRight size={14} />
                  </button>
                );
              }

              if (hasMultiplePassages && !isLastPassage) {
                return (
                  <button
                    onClick={() => {
                      setActivePassages(prev => ({ ...prev, [currentSectionIdx]: activePIdx + 1 }));
                      setCurrentQuestionIdx(0);
                      setSectionResults(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    Next Passage ({activePIdx + 2} of {passages.length})
                    <ChevronRight size={14} />
                  </button>
                );
              }

              if (!isLastSection) {
                const nextSectionType = sections[currentSectionIdx + 1]?.section_type;
                return (
                  <button
                    onClick={() => handleSectionChange(currentSectionIdx + 1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    Continue to {SECTION_META[nextSectionType]?.label || 'Next Section'}
                    <ChevronRight size={14} />
                  </button>
                );
              }

              if (isLastSection) {
                return (
                  <button
                    onClick={() => handleSubmit(false)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-gradient-accent text-white hover:opacity-90 shadow-lg shadow-red-500/25 transition-all"
                  >
                    <Send size={14} />
                    Submit Test
                  </button>
                );
              }

              return null;
            })()}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
        title="Submit Test?"
        message="Are you sure you want to submit your test? You won't be able to change your answers after submission."
      />
    </div>
  );
}
