import api from './api';
import {
  mockListAppointments,
  mockCreateAppointment,
  mockUpdateAppointmentStatus,
} from './mock/appointments.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const appointmentService = {
  list: (params) =>
    USE_MOCK
      ? mockListAppointments(params)
      : api.get('/appointments', { params }).then((r) => r.data.data),

  get: (id) => api.get(`/appointments/${id}`).then((r) => r.data.data),

  create: (payload) =>
    USE_MOCK
      ? mockCreateAppointment(payload)
      : api.post('/appointments', payload).then((r) => r.data.data),

  updateStatus: (id, status) =>
    USE_MOCK
      ? mockUpdateAppointmentStatus(id, status)
      : api.patch(`/appointments/${id}/status`, { status }).then((r) => r.data.data),

  updateNotes: (id, notes) =>
    api.put(`/appointments/${id}`, { notes }).then((r) => r.data.data),
};

export default appointmentService;
