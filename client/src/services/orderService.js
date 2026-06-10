import api from './api';
import { mockListOrders, mockCreateOrder, mockUpdateOrderStatus } from './mock/orders.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const orderService = {
  list: (params) =>
    USE_MOCK
      ? mockListOrders(params)
      : api.get('/orders', { params }).then((r) => r.data.data),

  get: (id) =>
    USE_MOCK
      ? mockListOrders().then((list) => {
          const o = list.find((x) => x._id === id);
          if (!o) throw new Error('Order not found');
          return o;
        })
      : api.get(`/orders/${id}`).then((r) => r.data.data),

  create: (payload) =>
    USE_MOCK
      ? mockCreateOrder(payload)
      : api.post('/orders', payload).then((r) => r.data.data),

  updateStatus: (id, status) =>
    USE_MOCK
      ? mockUpdateOrderStatus(id, status)
      : api.patch(`/orders/${id}/status`, { status }).then((r) => r.data.data),

  assignRider: (id, riderId) =>
    api.patch(`/orders/${id}/assign-rider`, { riderId }).then((r) => r.data.data),
};

export default orderService;
