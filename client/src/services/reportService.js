import api from './api';
import { mockListReports, mockUploadReport } from './mock/reports.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BASE = API_URL.replace(/\/api\/v1$/, '');

export const reportService = {
  list: () =>
    USE_MOCK ? mockListReports() : api.get('/reports').then((r) => r.data.data),

  get: (id) => api.get(`/reports/${id}`).then((r) => r.data.data),

  upload: (formData) =>
    USE_MOCK
      ? mockUploadReport(formData)
      : api
          .post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((r) => r.data.data),

  delete: (id) => api.delete(`/reports/${id}`).then((r) => r.data),

  /** Full URL for opening/downloading a report file */
  fileUrl: (path) => (path?.startsWith('http') ? path : `${BASE}${path}`),
};

export default reportService;
