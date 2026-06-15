import api from './api';

export const doctorService = {
  list: (params) => api.get('/doctors', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/doctors/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/doctors', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/doctors/${id}`, payload).then((r) => r.data.data),
  delete: (id) => api.delete(`/doctors/${id}`).then((r) => r.data),
  getAvailability: (id) => api.get(`/doctors/${id}/availability`).then((r) => r.data.data),
};

export default doctorService;
