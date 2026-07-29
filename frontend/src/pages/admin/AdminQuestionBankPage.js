import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  FileText, AlertTriangle, Filter
} from 'lucide-react';

const API_URL = 'http://localhost:8000';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'MCQ' },
  { value: 'true_false_ng', label: 'True/False/NG' },
  { value: 'fill_blank', label: 'Fill in Blank' },
  { value: 'matching', label: 'Matching' },
];

const SKILL_TYPES = ['Reading', 'Writing', 'Listening', 'Speaking'];

const AdminQuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);
  const [passages, setPassages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    passage_id: '',
    question_type: 'mcq',
    question_text: '',
    options: '',
    correct_answer: '',
    skill_type: '',
  });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(), limit: '10', search,
        question_type: typeFilter, skill_type: skillFilter,
      });
      const response = await axios.get(`${API_URL}/api/v1/admin/question-bank?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data.questions);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, skillFilter]);

  const fetchPassages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/admin/mock-tests/reading?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassages(response.data.passages || []);
    } catch (err) {
      console.error('Failed to fetch passages:', err);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchPassages();
  }, [fetchPassages]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      passage_id: passages[0]?.id || '',
      question_type: 'mcq',
      question_text: '',
      options: '',
      correct_answer: '',
      skill_type: '',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingItem(q);
    setFormData({
      passage_id: q.passage_id,
      question_type: q.question_type,
      question_text: q.question_text,
      options: q.options ? JSON.stringify(q.options, null, 2) : '',
      correct_answer: q.correct_answer ? JSON.stringify(q.correct_answer) : '',
      skill_type: q.skill_type || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      let parsedOptions = null;
      let parsedAnswer = formData.correct_answer;

      if (formData.options) {
        try { parsedOptions = JSON.parse(formData.options); } catch { setError('Invalid JSON in options'); return; }
      }
      try { parsedAnswer = JSON.parse(formData.correct_answer); } catch { parsedAnswer = formData.correct_answer; }

      const payload = {
        passage_id: parseInt(formData.passage_id),
        question_type: formData.question_type,
        question_text: formData.question_text,
        options: parsedOptions,
        correct_answer: parsedAnswer,
        skill_type: formData.skill_type || null,
      };

      if (editingItem) {
        await axios.put(`${API_URL}/api/v1/admin/question-bank/${editingItem.id}`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/api/v1/admin/question-bank`, payload, { headers });
      }
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/v1/admin/question-bank/${deletingItem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeletingItem(null);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <button onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search questions..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Types</option>
              {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={skillFilter}
              onChange={(e) => { setSkillFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Skills</option>
              {SKILL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText size={48} className="mb-4 text-gray-300" />
            <p>No questions found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passage</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-md">{q.question_text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {QUESTION_TYPES.find(t => t.value === q.question_type)?.label || q.question_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{q.skill_type || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{q.passage_title}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { setDeletingItem(q); setShowDeleteModal(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} questions
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
                <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">{editingItem ? 'Edit' : 'Add'} Question</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passage</label>
                  <select required value={formData.passage_id}
                    onChange={(e) => setFormData({ ...formData, passage_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select passage</option>
                    {passages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea required value={formData.question_text} rows={3}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options (JSON array, optional)</label>
                <textarea value={formData.options} rows={3}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder='["Option A", "Option B", "Option C", "Option D"]'
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <input required value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Type</label>
                  <select value={formData.skill_type}
                    onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">None</option>
                    {SKILL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Question</h3>
              <p className="text-gray-500 mb-6">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionBankPage;
