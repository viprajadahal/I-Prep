import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  BookOpen,
} from 'lucide-react';
import WritingAssistant from './WritingAssistant';
import LetterFormatGuide from './LetterFormatGuide';

const LetterEditor = ({ prompt, onBack, onSubmit, submitting, evaluating }) => {
  const [text, setText] = useState('');
  const [learningMode, setLearningMode] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const textareaRef = useRef(null);
  const autoSaveRef = useRef(null);

  const wordCount = useMemo(() => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [text]);

  const charCount = useMemo(() => text.length, [text]);

  const minWords = 150;
  const validation = useMemo(() => {
    if (!learningMode || text.trim().length === 0) return [];
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const checks = [];

    const hasGreeting = /\bdear\b/i.test(text) || /\bhi\b/i.test(text) || /\bhello\b/i.test(text);
    checks.push({
      label: hasGreeting ? 'Greeting detected' : 'Greeting not detected',
      ok: hasGreeting,
    });

    const hasClosing = /\byours\b/i.test(text) || /\bregards\b/i.test(text) || /\bwishes\b/i.test(text) || /\bcheers\b/i.test(text) || /\bthank/i.test(text) || /\bsincerely\b/i.test(text);
    checks.push({
      label: hasClosing ? 'Closing detected' : 'Closing not detected',
      ok: hasClosing,
    });

    checks.push({
      label: paragraphs.length < 2 ? 'Only one paragraph detected' : `${paragraphs.length} paragraphs detected`,
      ok: paragraphs.length >= 2,
    });

    if (wordCount > 0 && wordCount < minWords) {
      checks.push({
        label: `${wordCount}/${minWords} words`,
        ok: false,
      });
    } else if (wordCount >= minWords) {
      checks.push({
        label: `Word target reached`,
        ok: true,
      });
    }

    return checks;
  }, [text, learningMode, wordCount]);

  const saveDraft = useCallback((showFeedback = true) => {
    const data = { text, timestamp: Date.now(), wordCount };
    localStorage.setItem(`writing_draft_${prompt.id}`, JSON.stringify(data));
    if (showFeedback) {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }
    setLastSaved(new Date());
  }, [text, wordCount, prompt.id]);

  const loadDraft = useCallback(() => {
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
  }, []);

  const resumeDraft = () => {
    if (draftData) {
      setText(draftData.text || '');
    }
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(`writing_draft_${prompt.id}`);
    setShowDraftPrompt(false);
  };

  useEffect(() => {
    loadDraft();
  }, [loadDraft, prompt.id]);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (text.trim().length > 0) {
        saveDraft(false);
      }
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [saveDraft, text]);

  const handleSubmit = () => {
    onSubmit(text);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your letter? This cannot be undone.')) {
      setText('');
    }
  };

  return (
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

        {learningMode && (
          <div className="space-y-3">
            <LetterFormatGuide letterType={prompt.subtype === 'informal_letter' ? 'Informal' : prompt.subtype === 'semi_formal_letter' ? 'Semi-formal' : 'Formal'} />
            <WritingAssistant promptId={prompt.id} promptText={prompt.prompt_text} />
          </div>
        )}

        {learningMode && validation.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {validation.map((v, i) => (
              <span
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  v.ok
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30'
                }`}
              >
                {v.ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {v.label}
              </span>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-surface-cardDark rounded-2xl shadow-soft border border-gray-50 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Letter</span>
              <button
                onClick={() => setLearningMode(!learningMode)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
              >
                {learningMode ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                Learning Mode
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing your letter here...&#10;&#10;Remember to include the correct greeting, body paragraphs and closing."
            className="w-full px-6 py-5 min-h-[450px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none text-[15px] leading-[1.8]"
          />
        </div>

        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
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
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || evaluating || text.trim().length < 10}
            className="gradient-btn text-sm !py-3 !px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            ) : evaluating ? (
              <><Loader2 size={16} className="animate-spin" /> Evaluating...</>
            ) : (
              <><Send size={16} /> Submit Letter</>
            )}
          </button>
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

function formatTimeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default LetterEditor;
