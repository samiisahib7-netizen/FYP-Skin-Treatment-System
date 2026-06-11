let items = [
  {
    _id: 'n1',
    type: 'appointment',
    title: 'Appointment confirmed',
    message: 'Your appointment with Dr. Ayesha Khan is confirmed for Monday 10:00.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'n2',
    type: 'order',
    title: 'Order shipped',
    message: 'Your skincare order is on the way.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function mockListNotifications(params = {}) {
  const list = params.unreadOnly ? items.filter((n) => !n.isRead) : [...items];
  return Promise.resolve(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

export function mockUnreadCount() {
  return Promise.resolve({ count: items.filter((n) => !n.isRead).length });
}

export function mockMarkRead(id) {
  items = items.map((n) => (n._id === id ? { ...n, isRead: true } : n));
  return Promise.resolve(items.find((n) => n._id === id));
}

export function mockMarkAllRead() {
  items = items.map((n) => ({ ...n, isRead: true }));
  return Promise.resolve();
}
