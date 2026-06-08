import api from './api';
import { mockListPrescriptions, mockCreatePrescription } from './mock/prescriptions.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const prescriptionService = {
  list: () =>
    USE_MOCK
      ? mockListPrescriptions()
      : api.get('/prescriptions').then((r) => r.data.data),

  get: (id) => api.get(`/prescriptions/${id}`).then((r) => r.data.data),

  getByAppointment: (appointmentId) =>
    api.get(`/prescriptions/appointment/${appointmentId}`).then((r) => r.data.data),

  create: (payload) =>
    USE_MOCK
      ? mockCreatePrescription(payload)
      : api.post('/prescriptions', payload).then((r) => r.data.data),
};

export default prescriptionService;
