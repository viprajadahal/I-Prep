import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const ReadingPage = () => {
  const [passages, setPassages] = useState([]);
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const [passage, setPassage] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [highlighted, setHighlighted] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const passageRef = useRef(null);

  // fetch passage list on mount
  useEffect(() => {
    fetch("http://localhost:8000/reading/passages")
      .then(res => res.json())
      .then(data => setPassages(data))
      .catch(err => console.error("Failed to load passages:", err));
  }, []);

  // fetch selected passage with questions
  useEffect(() => {
    if (!selectedPassageId) return;
    setLoading(true);
    setSubmitted(false);
    setResult(null);
    setSelectedAnswers({});
    setCurrentPage(0);
    setTimeLeft(1200);

    fetch(`http://localhost:8000/reading/passages/${selectedPassageId}`)
      .then(res => res.json())
      .then(data => {
        setPassage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load passage:", err);
        setLoading(false);
      });
  }, [selectedPassageId]);

  // countdown timer
  useEffect(() => {
    if (!selectedPassageId || submitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedPassageId, submitted, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId, value) => {
    if (!submitted) {
      setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleSubmit = async () => {
    const answers = Object.entries(selectedAnswers).map(([question_id, answer]) => ({
      question_id: parseInt(question_id),
      answer: String(answer)
    }));

    try {
      const response = await fetch("http://localhost:8000/reading/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ passage_id: selectedPassageId, answers })
      });

      const resultData = await response.json();
      setSubmitted(true);
      setResult(resultData);
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setHighlighted(prev => [...prev, selection.toString().trim()]);
    }
  };

  const questions = passage?.questions || [];
  const questionsPerPage = 2;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const pageQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );
  const progress = questions.length
    ? (Object.keys(selectedAnswers).length / questions.length) * 100
    : 0;

  const getQuestionResult = (questionId) => {
    if (!result) return null;
    return result.question_results?.find(r => r.question_id === questionId);
  };

  const renderQuestion = (question) => {
    const qResult = getQuestionResult(question.id);

    if (question.question_type === 'mcq') {
      return (
        <div className="space-y-2">
          {question.options.map((option, optIdx) => {
            const isSelected = selectedAnswers[question.id] === option;
            const isCorrect = submitted && qResult?.correct_answer === option;
            const isWrong = submitted && isSelected && !qResult?.is_correct;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(question.id, option)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700 dark:text-green-400'
                  : isWrong ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-700 dark:text-red-400'
                  : isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 text-primary-700'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-200'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                {option}
                {isCorrect && <CheckCircle2 size={14} className="inline ml-2 text-green-500" />}
                {isWrong && <XCircle size={14} className="inline ml-2 text-red-500" />}
              </button>
            );
          })}
          {submitted && qResult && (
            <p className="text-xs text-gray-500 mt-1">
              Correct: <span className="font-medium text-green-600">{qResult.correct_answer}</span>
            </p>
          )}
        </div>
      );
    }

    if (question.question_type === 'true_false_ng') {
      return (
        <div className="space-y-2">
          {['true', 'false', 'not given'].map((option) => {
            const isSelected = selectedAnswers[question.id] === option;
            const isCorrect = submitted && qResult?.correct_answer === option;
            const isWrong = submitted && isSelected && !qResult?.is_correct;
            return (
              <button
                key={option}
                onClick={() => handleSelect(question.id, option)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border capitalize ${
                  isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700'
                  : isWrong ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-700'
                  : isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 text-primary-700'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 hover:border-gray-200'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option.toUpperCase()}
                {isCorrect && <CheckCircle2 size={14} className="inline ml-2 text-green-500" />}
                {isWrong && <XCircle size={14} className="inline ml-2 text-red-500" />}
              </button>
            );
          })}
          {submitted && qResult && (
            <p className="text-xs text-gray-500 mt-1">
              Correct: <span className="font-medium text-green-600 capitalize">{qResult.correct_answer}</span>
            </p>
          )}
        </div>
      );
    }

    if (question.question_type === 'fill_blank') {
      const isCorrect = submitted && qResult?.is_correct;
      const isWrong = submitted && qResult && !qResult?.is_correct;
      return (
        <div>
          <input
            type="text"
            value={selectedAnswers[question.id] || ''}
            onChange={(e) => handleSelect(question.id, e.target.value)}
            disabled={submitted}
            placeholder="Type your answer here..."
            className={`w-full px-4 py-3 rounded-xl text-sm border transition-all outline-none ${
              isCorrect ? 'bg-green-50 border-green-200 text-green-700'
              : isWrong ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          />
          {submitted && qResult && (
            <p className="text-xs text-gray-500 mt-1">
              Correct: <span className="font-medium text-green-600">{
                Array.isArray(qResult.correct_answer)
                  ? qResult.correct_answer.join(' / ')
                  : qResult.correct_answer
              }</span>
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  // passage selector screen
  if (!selectedPassageId) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 flex items-center justify-center">
              <BookOpen size={20} className="text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reading Practice
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Choose a passage to begin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passages.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPassageId(p.id)}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 cursor-pointer hover:border-purple-200 dark:hover:border-purple-800 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-700 flex items-center justify-center">
                  <BookOpen size={18} className="text-purple-500" />
                </div>
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  {p.difficulty}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {p.passage_text.substring(0, 120)}...
              </p>
              <div className="mt-4 flex items-center gap-1 text-purple-500 text-sm font-medium">
                Start Practice <ArrowRight size={14} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading passage...</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => setSelectedPassageId(null)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 flex items-center justify-center">
            <BookOpen size={20} className="text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reading Practice
          </h1>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-surface-cardDark rounded-xl px-4 py-2 shadow-soft border border-gray-50 dark:border-gray-800">
          <Clock size={16} className="text-gray-400" />
          <span className={`text-sm font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
          {passage?.difficulty}
        </span>
        <div className="flex-1">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
            <div
              className="h-1.5 bg-gradient-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {Object.keys(selectedAnswers).length}/{questions.length}
        </span>
      </div>

      {submitted && result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Results</h3>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-purple-600">{result.score}/{result.total_questions}</p>
              <p className="text-xs text-gray-400 mt-1">Overall Score</p>
            </div>
            <div className="flex-1 space-y-2">
              {result.skill_breakdown?.map((skill) => (
                <div key={skill.skill_type} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 capitalize w-20">{skill.skill_type}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-1.5 bg-purple-400 rounded-full"
                      style={{ width: `${(skill.correct / skill.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{skill.correct}/{skill.total}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setSelectedPassageId(null)}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            Try Another Passage
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {passage?.title}
            </h3>
            <button
              onClick={handleHighlight}
              className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
            >
              <Highlighter size={16} className="text-gray-400" />
            </button>
          </div>
          <div
            ref={passageRef}
            className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto pr-2"
          >
            {passage?.passage_text}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {pageQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-gray-400 capitalize">
                  {question.skill_type} · {question.question_type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {question.question_text}
              </p>
              {renderQuestion(question)}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              <ChevronLeft size={16} className="inline mr-1" />
              Previous
            </button>

            {currentPage < totalPages - 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Next
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitted}
                className="gradient-btn text-sm !py-2 flex items-center gap-1.5"
              >
                Submit Answers
                <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {highlighted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Highlighted Text
          </h4>
          <div className="space-y-2">
            {highlighted.map((text, idx) => (
              <div key={idx} className="text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg px-3 py-2">
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReadingPage;