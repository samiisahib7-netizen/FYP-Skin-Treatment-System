/**
 * Analytics controller — admin dashboard KPIs and charts.
 *   GET /analytics/overview
 *   GET /analytics/appointments-by-status
 *   GET /analytics/orders-by-status
 *   GET /analytics/revenue-by-month
 */
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Order = require('../models/Order');
const Patient = require('../models/Patient');
const Payment = require('../models/Payment');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

exports.overview = asyncHandler(async (req, res) => {
  const today = startOfToday();
  const monthStart = startOfMonth();

  const [
    totalUsers,
    totalDoctors,
    totalPatients,
    appointmentsToday,
    pendingAppointments,
    totalOrders,
    revenueMonthAgg,
    revenueAllAgg,
    recentAppointments,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments({ date: { $gte: today }, status: { $ne: 'cancelled' } }),
    Appointment.countDocuments({ status: 'pending' }),
    Order.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Appointment.find({ status: { $ne: 'cancelled' } })
      .sort('-createdAt')
      .limit(5)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } }),
    Order.find()
      .sort('-placedAt')
      .limit(5)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalDoctors,
      totalPatients,
      appointmentsToday,
      pendingAppointments,
      totalOrders,
      revenueMonth: revenueMonthAgg[0]?.total || 0,
      revenueAll: revenueAllAgg[0]?.total || 0,
      recentAppointments,
      recentOrders,
    },
  });
});

exports.appointmentsByStatus = asyncHandler(async (req, res) => {
  const rows = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const data = rows.map((r) => ({ status: r._id, count: r.count }));
  res.json({ success: true, data });
});

exports.ordersByStatus = asyncHandler(async (req, res) => {
  const rows = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const data = rows.map((r) => ({ status: r._id, count: r.count }));
  res.json({ success: true, data });
});

exports.revenueByMonth = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const rows = await Payment.aggregate([
    { $match: { status: 'succeeded', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = rows.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    revenue: r.revenue,
    payments: r.count,
  }));

  res.json({ success: true, data });
});
