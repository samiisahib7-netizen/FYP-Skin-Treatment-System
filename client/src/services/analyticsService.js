import api from './api';
import {
  mockOverview,
  mockAppointmentsByStatus,
  mockOrdersByStatus,
  mockRevenueByMonth,
} from './mock/analytics.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const analyticsService = {
  overview: () =>
    USE_MOCK ? mockOverview() : api.get('/analytics/overview').then((r) => r.data.data),

  appointmentsByStatus: () =>
    USE_MOCK
      ? mockAppointmentsByStatus()
      : api.get('/analytics/appointments-by-status').then((r) => r.data.data),

  ordersByStatus: () =>
    USE_MOCK
      ? mockOrdersByStatus()
      : api.get('/analytics/orders-by-status').then((r) => r.data.data),

  revenueByMonth: () =>
    USE_MOCK
      ? mockRevenueByMonth()
      : api.get('/analytics/revenue-by-month').then((r) => r.data.data),
};

export default analyticsService;
