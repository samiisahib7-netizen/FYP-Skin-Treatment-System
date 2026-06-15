import api from './api';

export const riderService = {
  list: () => api.get('/riders').then((r) => r.data.data),
  get: (id) => api.get(`/riders/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/riders', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/riders/${id}`, payload).then((r) => r.data.data),
  delete: (id) => api.delete(`/riders/${id}`).then((r) => r.data),
};

export default riderService;
