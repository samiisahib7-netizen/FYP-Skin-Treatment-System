import api from './api';
import {
  mockListNotifications,
  mockUnreadCount,
  mockMarkRead,
  mockMarkAllRead,
} from './mock/notifications.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const notificationService = {
  list: (params) =>
    USE_MOCK
      ? mockListNotifications(params)
      : api.get('/notifications', { params }).then((r) => r.data.data),

  unreadCount: () =>
    USE_MOCK
      ? mockUnreadCount()
      : api.get('/notifications/unread-count').then((r) => r.data.data),

  markRead: (id) =>
    USE_MOCK
      ? mockMarkRead(id)
      : api.patch(`/notifications/${id}/read`).then((r) => r.data.data),

  markAllRead: () =>
    USE_MOCK ? mockMarkAllRead() : api.patch('/notifications/read-all').then((r) => r.data),
};

export default notificationService;
