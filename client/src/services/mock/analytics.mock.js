export function mockOverview() {
  return Promise.resolve({
    totalUsers: 128,
    totalDoctors: 14,
    totalPatients: 98,
    appointmentsToday: 23,
    pendingAppointments: 5,
    totalOrders: 42,
    revenueMonth: 240000,
    revenueAll: 1250000,
    recentAppointments: [],
    recentOrders: [],
  });
}

export function mockAppointmentsByStatus() {
  return Promise.resolve([
    { status: 'completed', count: 45 },
    { status: 'confirmed', count: 12 },
    { status: 'pending', count: 5 },
    { status: 'cancelled', count: 3 },
  ]);
}

export function mockOrdersByStatus() {
  return Promise.resolve([
    { status: 'delivered', count: 28 },
    { status: 'paid', count: 8 },
    { status: 'shipped', count: 4 },
    { status: 'pending', count: 2 },
  ]);
}

export function mockRevenueByMonth() {
  return Promise.resolve([
    { month: 'Jan 2026', revenue: 180000, payments: 24 },
    { month: 'Feb 2026', revenue: 210000, payments: 31 },
    { month: 'Mar 2026', revenue: 195000, payments: 28 },
    { month: 'Apr 2026', revenue: 240000, payments: 35 },
    { month: 'May 2026', revenue: 260000, payments: 38 },
    { month: 'Jun 2026', revenue: 220000, payments: 32 },
  ]);
}
