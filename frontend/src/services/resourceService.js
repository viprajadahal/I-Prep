import api from '../utils/api';

const resourceService = {
  getResources: (params = {}) => api.get('/resources', { params }),

  searchResources: (query, category = null) => {
    const params = { search: query };
    if (category && category !== 'All') {
      params.category = category;
    }
    return api.get('/resources', { params });
  },

  filterResources: (category) => api.get('/resources', { params: { category } }),

  getById: (id) => api.get(`/resources/${id}`),

  upload: (formData) => api.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  update: (id, formData) => api.put(`/resources/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  delete: (id) => api.delete(`/resources/${id}`),

  downloadResource: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
};

export default resourceService;
