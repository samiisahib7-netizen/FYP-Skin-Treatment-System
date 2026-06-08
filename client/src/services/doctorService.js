import api from './api';

export const doctorService = {
  list: (params) => api.get('/doctors', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/doctors/${id}`).then((r) => r.data.data),
  getAvailability: (id) => api.get(`/doctors/${id}/availability`).then((r) => r.data.data),
};

export default doctorService;
