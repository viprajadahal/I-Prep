import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  BookOpen, Filter, AlertTriangle, Eye, FileText, Upload, Download
} from 'lucide-react';

const API_URL = 'http://localhost:8000';
const CATEGORIES = ['Reading', 'Writing', 'Listening', 'Speaking', 'General'];

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Reading' });
  const [error, setError] = useState('');

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page.toString(), limit: '10', search, category: categoryFilter });
      const response = await axios.get(`${API_URL}/api/v1/admin/resources?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(response.data.resources);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const openAddModal = () => {
    setEditingResource(null);
    setFormData({ title: '', description: '', category: 'Reading' });
    setSelectedFile(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (r) => {
    setEditingResource(r);
    setFormData({ title: r.title, description: r.description || '', category: r.category });
    setSelectedFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingResource) {
        await axios.put(`${API_URL}/api/v1/admin/resources/${editingResource.id}`, formData, { headers });
      } else {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('category', formData.category);
        if (selectedFile) {
          form.append('file', selectedFile);
        }
        await axios.post(`${API_URL}/api/v1/admin/resources`, form, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/v1/admin/resources/${deletingResource.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeletingResource(null);
      fetchResources();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getCategoryColor = (cat) => {
    const colors = { Reading: 'bg-blue-100 text-blue-800', Writing: 'bg-green-100 text-green-800',
      Listening: 'bg-purple-100 text-purple-800', Speaking: 'bg-orange-100 text-orange-800',
      General: 'bg-gray-100 text-gray-800' };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resources Management</h1>
        <button onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search resources..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BookOpen size={48} className="mb-4 text-gray-300" />
            <p>No resources found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloads</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{r.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{r.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(r.category)}`}>{r.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.file_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(r.file_size)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.download_count || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setShowPreview(r)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye size={16} /></button>
                        <button onClick={() => openEditModal(r)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => { setDeletingResource(r); setShowDeleteModal(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} resources
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

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Resource Details</h2>
              <button onClick={() => setShowPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-sm text-gray-500">Title</label><p className="font-medium">{showPreview.title}</p></div>
              <div><label className="text-sm text-gray-500">Description</label><p>{showPreview.description || 'No description'}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-500">Category</label>
                  <p><span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(showPreview.category)}`}>{showPreview.category}</span></p></div>
                <div><label className="text-sm text-gray-500">File Type</label><p>{showPreview.file_type}</p></div>
                <div><label className="text-sm text-gray-500">File Name</label><p>{showPreview.file_name}</p></div>
                <div><label className="text-sm text-gray-500">Size</label><p>{formatFileSize(showPreview.file_size)}</p></div>
              </div>
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setShowPreview(null)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editingResource ? 'Edit' : 'Add'} Resource</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} rows={3}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {!editingResource && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                    <input type="file" id="file-upload" className="hidden"
                      accept=".pdf,.docx,.pptx,.mp3,.mp4,.zip"
                      onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <label htmlFor="file-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                      {selectedFile ? selectedFile.name : 'Click to upload file'}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PPTX, MP3, MP4, ZIP</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingResource ? 'Update' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Resource</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete <strong>{deletingResource?.title}</strong>?</p>
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

export default AdminResourcesPage;
