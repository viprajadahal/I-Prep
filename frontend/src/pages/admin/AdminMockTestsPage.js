import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  ClipboardList, AlertTriangle, BookOpen, Headphones, Mic
} from 'lucide-react';

const API_URL = 'http://localhost:8000';

const TABS = [
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'speaking', label: 'Speaking', icon: Mic },
  { id: 'listening', label: 'Listening', icon: Headphones },
];

const AdminMockTestsPage = () => {
  const [activeTab, setActiveTab] = useState('reading');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [error, setError] = useState('');

  const [readingForm, setReadingForm] = useState({
    title: '', passage_text: '', difficulty: 'medium',
    questions: [],
  });
  const [speakingForm, setSpeakingForm] = useState({
    text: '', difficulty: 'Beginner', category: 'General', examiner_audio_path: '',
  });
  const [listeningForm, setListeningForm] = useState({
    title: '', difficulty: 'easy', audio_path: '', questions_json: '[]', answers_json: '[]',
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page.toString(), limit: '10', search });
      const response = await axios.get(`${API_URL}/api/v1/admin/mock-tests/${activeTab}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      setItems(data.passages || data.questions || data.tests || []);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAddModal = () => {
    setEditingItem(null);
    setReadingForm({ title: '', passage_text: '', difficulty: 'medium', questions: [] });
    setSpeakingForm({ text: '', difficulty: 'Beginner', category: 'General', examiner_audio_path: '' });
    setListeningForm({ title: '', difficulty: 'easy', audio_path: '', questions_json: '[]', answers_json: '[]' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    if (activeTab === 'reading') {
      setReadingForm({
        title: item.title,
        passage_text: item.passage_text || '',
        difficulty: item.difficulty || 'medium',
        questions: [],
      });
    } else if (activeTab === 'speaking') {
      setSpeakingForm({
        text: item.text,
        difficulty: item.difficulty || 'Beginner',
        category: item.category || 'General',
        examiner_audio_path: item.examiner_audio_path || '',
      });
    } else {
      setListeningForm({
        title: item.title,
        difficulty: item.difficulty || 'easy',
        audio_path: item.audio_path || '',
        questions_json: '[]',
        answers_json: '[]',
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      let url = `${API_URL}/api/v1/admin/mock-tests/${activeTab}`;
      let formData;

      if (activeTab === 'reading') formData = readingForm;
      else if (activeTab === 'speaking') formData = speakingForm;
      else formData = listeningForm;

      if (editingItem) {
        await axios.put(`${url}/${editingItem.id}`, formData, { headers });
      } else {
        await axios.post(url, formData, { headers });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/v1/admin/mock-tests/${activeTab}/${deletingItem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const getForm = () => {
    if (activeTab === 'reading') return readingForm;
    if (activeTab === 'speaking') return speakingForm;
    return listeningForm;
  };

  const setForm = (data) => {
    if (activeTab === 'reading') setReadingForm(data);
    else if (activeTab === 'speaking') setSpeakingForm(data);
    else setListeningForm(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mock Tests Management</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Add */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab} tests...`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add {activeTab === 'reading' ? 'Passage' : activeTab === 'speaking' ? 'Question' : 'Test'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ClipboardList size={48} className="mb-4 text-gray-300" />
            <p>No {activeTab} tests found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title / Text</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                  {activeTab === 'reading' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  )}
                  {activeTab === 'speaking' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-md">
                        {item.title || item.text}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.difficulty === 'hard' || item.difficulty === 'Advanced'
                          ? 'bg-red-100 text-red-800'
                          : item.difficulty === 'medium' || item.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    {activeTab === 'reading' && (
                      <td className="px-6 py-4 text-sm text-gray-500">{item.question_count || 0}</td>
                    )}
                    {activeTab === 'speaking' && (
                      <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => { setDeletingItem(item); setShowDeleteModal(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
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
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
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
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'reading' ? 'Passage' : activeTab === 'speaking' ? 'Question' : 'Test'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

              {activeTab === 'reading' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" required value={readingForm.title}
                      onChange={(e) => setReadingForm({ ...readingForm, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passage Text</label>
                    <textarea required value={readingForm.passage_text} rows={8}
                      onChange={(e) => setReadingForm({ ...readingForm, passage_text: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select value={readingForm.difficulty}
                      onChange={(e) => setReadingForm({ ...readingForm, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'speaking' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                    <textarea required value={speakingForm.text} rows={3}
                      onChange={(e) => setSpeakingForm({ ...speakingForm, text: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select value={speakingForm.difficulty}
                        onChange={(e) => setSpeakingForm({ ...speakingForm, difficulty: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input type="text" value={speakingForm.category}
                        onChange={(e) => setSpeakingForm({ ...speakingForm, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Audio Path (optional)</label>
                    <input type="text" value={speakingForm.examiner_audio_path}
                      onChange={(e) => setSpeakingForm({ ...speakingForm, examiner_audio_path: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'listening' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" required value={listeningForm.title}
                      onChange={(e) => setListeningForm({ ...listeningForm, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select value={listeningForm.difficulty}
                        onChange={(e) => setListeningForm({ ...listeningForm, difficulty: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Audio Path</label>
                      <input type="text" value={listeningForm.audio_path}
                        onChange={(e) => setListeningForm({ ...listeningForm, audio_path: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Questions JSON</label>
                    <textarea value={listeningForm.questions_json} rows={3}
                      onChange={(e) => setListeningForm({ ...listeningForm, questions_json: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answers JSON</label>
                    <textarea value={listeningForm.answers_json} rows={3}
                      onChange={(e) => setListeningForm({ ...listeningForm, answers_json: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                  </div>
                </>
              )}

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
              <h3 className="text-lg font-semibold mb-2">Delete Item</h3>
              <p className="text-gray-500 mb-6">Are you sure? This action cannot be undone.</p>
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

export default AdminMockTestsPage;
