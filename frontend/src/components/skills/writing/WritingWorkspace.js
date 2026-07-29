import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  Save,
  Maximize2,
  RotateCcw,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { SUBTYPE_META, DIFFICULTY_META } from '../../../constants/writingCategories';
import writingService from '../../../services/writingService';
import AIFeedbackPanel from './AIFeedbackPanel';
import WritingAssistant from './WritingAssistant';
import LetterEditor from './LetterEditor';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function formatTimeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

const WritingWorkspace = ({ prompt, onBack }) => {
  const [essayText, setEssayText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);
  const essayTextRef = useRef(essayText);
  const submittingRef = useRef(submitting);
  const evaluatingRef = useRef(evaluating);
  const resultRef = useRef(result);
  essayTextRef.current = essayText;
  submittingRef.current = submitting;
  evaluatingRef.current = evaluating;
  resultRef.current = result;

  const meta = SUBTYPE_META[prompt.subtype] || { label: prompt.title, icon: null, color: '#7c3aed' };
  const diffMeta = DIFFICULTY_META[prompt.difficulty] || DIFFICULTY_META.intermediate;
  const Icon = meta.icon;
  const isTask1 = prompt.task_type === 'Task 1';
  const isAcademic = prompt.module === 'academic';
  const isGTTask1 = !isAcademic && isTask1;
  const estTime = isTask1 ? 20 : 40;
  const minWords = isTask1 ? 150 : 250;

  const wordCount = essayText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = essayText.length;

  useEffect(() => {
    setTimeLeft(estTime * 60);
    setTimerRunning(true);
    return () => clearInterval(timerRef.current);
  }, [estTime]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            const txt = essayTextRef.current;
            if (txt.trim().length > 10 && !submittingRef.current && !evaluatingRef.current && !resultRef.current) {
              handleSubmit();
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerRunning]);

  useEffect(() => {
    if (!isGTTask1) {
      autoSaveRef.current = setInterval(() => {
        if (essayText.trim().length > 0) {
          saveDraft(false);
        }
      }, 30000);
      return () => clearInterval(autoSaveRef.current);
    }
  }, [isGTTask1, essayText]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const saveDraft = (showFeedback = true) => {
    const data = { text: essayText, timestamp: Date.now(), wordCount };
    localStorage.setItem(`writing_draft_${prompt.id}`, JSON.stringify(data));
    if (showFeedback) {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }
    setLastSaved(new Date());
  };

  const loadDraft = () => {
    if (isGTTask1) return;
    try {
      const raw = localStorage.getItem(`writing_draft_${prompt.id}`);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.text && data.text.trim().length > 0) {
          setDraftData(data);
          setShowDraftPrompt(true);
        }
      }
    } catch {}
  };

  const resumeDraft = () => {
    if (draftData) {
      setEssayText(draftData.text || '');
    }
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(`writing_draft_${prompt.id}`);
    setShowDraftPrompt(false);
  };

  useEffect(() => {
    loadDraft();
  }, [prompt.id]);

  const handleSubmit = async (text) => {
    const submitText = text || essayText;
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    setTimerRunning(false);

    try {
      const submitRes = await writingService.submitEssay({
        title: prompt.title,
        prompt_id: prompt.id,
        text: submitText,
      });
      const essayId = submitRes.data.id;
      setSubmitting(false);
      setEvaluating(true);

      const evalRes = await writingService.evaluateEssay(essayId);
      setResult(evalRes.data);
    } catch (err) {
      console.error('Submit error:', err.response?.status, err.response?.data, err.message);
      setSubmitError(err.response?.data?.detail || `Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? This cannot be undone.')) {
      setEssayText('');
      setResult(null);
      setTimeLeft(estTime * 60);
      setTimerRunning(true);
    }
  };

  if (result) {
    return (
      <AIFeedbackPanel
        result={result}
        prompt={prompt}
        essayText={essayText}
        onBack={onBack}
        onRetry={() => {
          setResult(null);
          setEssayText('');
          setTimeLeft(estTime * 60);
          setTimerRunning(true);
        }}
      />
    );
  }

  if (isGTTask1) {
    return (
      <div className={`flex flex-col h-[calc(100vh-4rem)] ${fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
        <Header
          prompt={prompt}
          meta={meta}
          diffMeta={diffMeta}
          Icon={Icon}
          timeLeft={timeLeft}
          formatTime={formatTime}
          onBack={onBack}
          minWords={minWords}
          estTime={estTime}
        />
        <LetterEditor
          prompt={prompt}
          onBack={onBack}
          onSubmit={handleSubmit}
          submitting={submitting}
          evaluating={evaluating}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] ${fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      <Header
        prompt={prompt}
        meta={meta}
        diffMeta={diffMeta}
        Icon={Icon}
        timeLeft={timeLeft}
        formatTime={formatTime}
        onBack={onBack}
        minWords={minWords}
        estTime={estTime}
        draftSaved={draftSaved}
        onSaveDraft={() => saveDraft(true)}
        lastSaved={lastSaved}
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Question
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {prompt.prompt_text}
            </p>
          </div>

          {isAcademic && isTask1 && prompt.image_url && (
            <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Diagram
              </h3>
              <img
                src={`${API_BASE_URL}${prompt.image_url}`}
                alt={prompt.title || 'Task diagram'}
                className="w-full max-h-96 object-contain rounded-lg border border-gray-100 dark:border-gray-800"
              />
            </div>
          )}

          <WritingAssistant promptId={prompt.id} promptText={prompt.prompt_text} />

          <div className="bg-white dark:bg-surface-cardDark rounded-2xl shadow-soft border border-gray-50 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Essay</span>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
                <span className={wordCount >= minWords ? 'text-green-500' : 'text-yellow-500'}>
                  Target: {minWords}
                </span>
                {lastSaved && (
                  <span className="text-gray-400">Saved {formatTimeSince(lastSaved)}</span>
                )}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Start writing your essay here..."
              className="w-full px-6 py-4 min-h-[400px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none text-[15px] leading-relaxed"
            />
          </div>

          {submitError && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
              <AlertCircle size={16} />
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={() => saveDraft(true)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  draftSaved
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Save size={14} /> {draftSaved ? 'Saved!' : 'Save Draft'}
              </button>
              <button onClick={() => setFullscreen(!fullscreen)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Maximize2 size={14} /> {fullscreen ? 'Exit' : 'Fullscreen'}
              </button>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={submitting || evaluating}
              className="gradient-btn text-sm !py-3 !px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting...</>
              ) : evaluating ? (
                <><Loader2 size={16} className="animate-spin" /> Evaluating...</>
              ) : (
                <><Send size={16} /> Submit Essay</>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDraftPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                  <BookOpen size={20} className="text-violet-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Continue Draft?</h3>
                  <p className="text-xs text-gray-400">You have a saved draft for this task</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                You left off with {draftData?.wordCount || 0} words written. Would you like to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={discardDraft}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={resumeDraft}
                  className="flex-1 gradient-btn text-sm"
                >
                  Resume
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ prompt, meta, diffMeta, Icon, timeLeft, formatTime, onBack, minWords, estTime, draftSaved, onSaveDraft, lastSaved }) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
    className="shrink-0 bg-white dark:bg-surface-cardDark border-b border-gray-100 dark:border-gray-800 px-6 py-3"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} style={{ color: meta.color }} />}
          <span className="font-bold text-gray-900 dark:text-white text-sm">{meta.label}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/30 text-xs font-medium text-violet-600 dark:text-violet-400 capitalize">
          {prompt.module}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
          {prompt.task_type}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffMeta.color}`}>
          {diffMeta.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={14} />
          <span className={`font-mono font-bold ${timeLeft < 120 ? 'text-red-500' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        {onSaveDraft && (
          <button
            onClick={onSaveDraft}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              draftSaved
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Save size={13} />
            {draftSaved ? 'Saved!' : 'Save Draft'}
          </button>
        )}
        <span className="text-xs text-gray-400">{minWords} words min</span>
        <span className="text-xs text-gray-400">{estTime} min</span>
      </div>
    </div>
  </motion.div>
);

export default WritingWorkspace;
