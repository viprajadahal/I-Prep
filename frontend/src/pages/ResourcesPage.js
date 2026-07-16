import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Video,
  Download,
  Eye,
  Search,
  Upload,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Music,
  Play,
  Clock,
} from 'lucide-react';
import LandingLayout from '../components/layout/LandingLayout';
import VideoPlayer from '../components/common/VideoPlayer';
import resourceService from '../services/resourceService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Reading', 'Writing', 'Listening', 'Speaking', 'General'];
const STATIC_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type) => {
  const typeLower = type?.toLowerCase();
  if (typeLower === 'pdf' || typeLower === 'document') {
    return { icon: FileText, colorClass: 'text-red-500', bgClass: 'bg-red-50 dark:bg-red-900/20' };
  }
  if (typeLower === 'video' || typeLower === 'mp4') {
    return { icon: Video, colorClass: 'text-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-900/20' };
  }
  if (typeLower === 'audio' || typeLower === 'mp3') {
    return { icon: Music, colorClass: 'text-green-500', bgClass: 'bg-green-50 dark:bg-green-900/20' };
  }
  if (typeLower === 'docx' || typeLower === 'word') {
    return { icon: FileText, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 dark:bg-blue-900/20' };
  }
  if (typeLower === 'ppt' || typeLower === 'pptx' || typeLower === 'powerpoint') {
    return { icon: FileText, colorClass: 'text-orange-500', bgClass: 'bg-orange-50 dark:bg-orange-900/20' };
  }
  if (typeLower === 'zip') {
    return { icon: FileText, colorClass: 'text-yellow-500', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' };
  }
  return { icon: FileText, colorClass: 'text-purple-500', bgClass: 'bg-purple-50 dark:bg-purple-900/20' };
};

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : type === 'error'
        ? 'bg-red-500 text-white'
        : 'bg-blue-500 text-white'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle size={16} />
    ) : type === 'error' ? (
      <AlertCircle size={16} />
    ) : (
      <Loader2 size={16} className="animate-spin" />
    )}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-75">
      <X size={14} />
    </button>
  </motion.div>
);

const ResourceModal = ({ isOpen, onClose, onSave, resource, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    file_type: 'PDF',
    duration: '',
    file: null,
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && resource) {
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        category: resource.category || 'General',
        file_type: resource.file_type || 'PDF',
        duration: resource.duration || '',
        file: null,
      });
    } else {
      setFormData({ title: '', description: '', category: 'General', file_type: 'PDF', duration: '', file: null });
    }
  }, [isEditing, resource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('file_type', formData.file_type);
      if (formData.duration) {
        fd.append('duration', formData.duration);
      }
      if (formData.file) {
        fd.append('file', formData.file);
      }
      await onSave(fd);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Resource' : 'Upload Resource'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File Type</label>
                  <select
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPT">PPT</option>
                    <option value="PPTX">PPTX</option>
                    <option value="MP3">MP3</option>
                    <option value="ZIP">ZIP</option>
                    <option value="Video">Video (MP4/WebM/MOV)</option>
                  </select>
                </div>
              </div>
              {formData.file_type === 'Video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (e.g., 12:35)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="12:35"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File {isEditing && '(leave empty to keep current)'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.ppt,.pptx,.zip,.mp3,.mp4,.webm,.mov"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-violet-50 file:text-violet-600 dark:file:bg-violet-900/20 dark:file:text-violet-400 hover:file:bg-violet-100"
                />
              </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {isEditing ? 'Update' : 'Upload'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ResourcesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [uploadMode, setUploadMode] = useState(false);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[ResourcesPage] Fetching resources with search:', searchQuery, 'category:', activeCategory);
      let response;
      if (searchQuery.trim() || activeCategory !== 'All') {
        const params = {};
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        console.log('[ResourcesPage] Using params:', params);
        response = await resourceService.getResources(params);
      } else {
        console.log('[ResourcesPage] No params, fetching all resources');
        response = await resourceService.getResources();
      }
      console.log('[ResourcesPage] Response received:', response);
      if (response.data && response.data.success) {
        console.log('[ResourcesPage] Resources data:', response.data.data);
        setResources(response.data.data || []);
      } else if (response.data && Array.isArray(response.data)) {
        console.log('[ResourcesPage] Direct array response:', response.data);
        setResources(response.data);
      } else {
        console.log('[ResourcesPage] Unexpected response format:', response.data);
        setResources([]);
      }
    } catch (err) {
      console.error('[ResourcesPage] Error fetching resources:', err);
      if (err.response?.status === 404) {
        showToast('No resources found.', 'error');
      } else if (err.response?.status === 500) {
        showToast('Something went wrong. Please try again.', 'error');
      } else if (err.code === 'ERR_NETWORK') {
        showToast('Unable to connect to server.', 'error');
      } else {
        showToast(err.response?.data?.detail || err.message || 'Failed to load resources.', 'error');
      }
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchResources, searchQuery, activeCategory]);

  const handleDownload = async (resource) => {
    try {
      setDownloadingId(resource.id);
      const response = await resourceService.downloadResource(resource.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setResources((prev) =>
        prev.map((r) => (r.id === resource.id ? { ...r, download_count: r.download_count + 1 } : r))
      );
      showToast('Download started', 'success');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Download failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };



  const handleUpload = async (formData) => {
    try {
      const response = await resourceService.upload(formData);
      if (response.data.success) {
        showToast('Resource uploaded successfully', 'success');
        setUploadMode(false);
        fetchResources();
      }
    } catch (err) {
      showToast(err.response?.data?.detail || 'Upload failed', 'error');
      throw err;
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await resourceService.update(editingResource.id, formData);
      if (response.data.success) {
        showToast('Resource updated successfully', 'success');
        setUploadMode(false);
        setEditingResource(null);
        fetchResources();
      }
    } catch (err) {
      showToast(err.response?.data?.detail || 'Update failed', 'error');
      throw err;
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}"? This action cannot be undone.`)) return;
    try {
      setDeletingId(resource.id);
      const response = await resourceService.delete(resource.id);
      if (response.data.success) {
        showToast('Resource deleted', 'success');
        fetchResources();
      }
    } catch (err) {
      showToast(err.response?.data?.detail || 'Delete failed', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setUploadMode(true);
  };

  const openUploadModal = () => {
    setEditingResource(null);
    setUploadMode(true);
  };

  const handleCategoryChange = (category) => {
    setSearchQuery('');
    setActiveCategory(category);
  };

  const handleWatchVideo = (resource) => {
    const videoUrl = `${STATIC_BASE_URL}/${resource.file_path}`;
    const thumbnailUrl = resource.thumbnail_url
      ? `${STATIC_BASE_URL}/${resource.thumbnail_url}`
      : null;
    setCurrentVideo({
      url: videoUrl,
      title: resource.title,
      thumbnailUrl,
    });
    setVideoPlayerOpen(true);
  };

  return (
    <LandingLayout>
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Resources
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Download study materials, guides, and templates to boost your preparation
          </p>
        </motion.div>

         <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
           <div className="relative flex-1 w-full max-w-md">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input
               type="text"
               placeholder="Search resources..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-cardDark text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
             />
           </div>
           {isAdmin && (
             <button
               onClick={() => setUploadMode(true)}
               className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
             >
               <Upload size={16} />
               Upload Resource
             </button>
           )}
         </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 h-48 animate-pulse"
              />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No study resources available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {resources.map((resource, index) => {
               const { icon: IconComponent, colorClass, bgClass } = getFileIcon(resource.file_type);
               const isVideo = resource.file_type?.toLowerCase() === 'video' || 
                               resource.file_name?.toLowerCase().endsWith('.mp4') ||
                               resource.file_name?.toLowerCase().endsWith('.webm') ||
                               resource.file_name?.toLowerCase().endsWith('.mov');

              return (
                   <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                  >
                    {/* Thumbnail for video resources */}
                    {isVideo && resource.thumbnail_url ? (
                      <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video">
                        <img
                          src={`${STATIC_BASE_URL}/${resource.thumbnail_url}`}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play size={18} className="text-gray-900 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-white text-[10px] font-medium">
                            {resource.duration}
                          </div>
                        )}
                      </div>
                    ) : isVideo ? (
                      <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center">
                        <div className={`w-14 h-14 rounded-full ${bgClass} flex items-center justify-center`}>
                          <Play size={24} className={colorClass} fill="currentColor" />
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-white text-[10px] font-medium">
                            {resource.duration}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="flex items-center gap-3 mb-3">
                      {!isVideo && (
                        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
                          <IconComponent size={20} className={colorClass} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {resource.title}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {isVideo && resource.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {resource.duration}
                            </span>
                          )}
                          {!isVideo && (resource.file_size ? formatFileSize(resource.file_size) : resource.file_type)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        {resource.category}
                      </span>
                      {isVideo && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Video
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Uploaded: {new Date(resource.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {resource.description || 'No description available'}
                    </p>

                  <div className="flex gap-2">
                    {isVideo ? (
                      <button
                        onClick={() => handleWatchVideo(resource)}
                        className="flex-1 px-3 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={14} fill="currentColor" />
                        Watch Video
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId === resource.id}
                        className="flex-1 px-3 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {downloadingId === resource.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        Download
                      </button>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEditModal(resource)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource)}
                        disabled={deletingId === resource.id}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {deletingId === resource.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

         <ResourceModal
           isOpen={uploadMode}
           onClose={() => { setUploadMode(false); setEditingResource(null); }}
           onSave={editingResource ? handleUpdate : handleUpload}
           resource={editingResource}
           isEditing={!!editingResource}
         />

        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <VideoPlayer
          isOpen={videoPlayerOpen}
          onClose={() => { setVideoPlayerOpen(false); setCurrentVideo(null); }}
          videoUrl={currentVideo?.url}
          title={currentVideo?.title}
          thumbnailUrl={currentVideo?.thumbnailUrl}
        />
      </div>
    </LandingLayout>
  );
};

export default ResourcesPage;
