/**
 * Order controller.
 *   GET    /orders                    patient | admin | rider
 *   GET    /orders/:id                patient | admin | rider
 *   POST   /orders                    patient
 *   PATCH  /orders/:id/status         admin | rider (limited)
 *   PATCH  /orders/:id/assign-rider   admin
 */
const Product = require('../models/Product');
const Order = require('../models/Order');
const Patient = require('../models/Patient');
const Rider = require('../models/Rider');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser, getRiderByUser } = require('../utils/roleProfile');

const POPULATE = [
  { path: 'patientId', populate: { path: 'userId', select: '-password' } },
  { path: 'riderId', populate: { path: 'userId', select: '-password' } },
];

function refId(doc) {
  return doc?._id?.toString() || doc?.toString();
}

async function assertCanViewOrder(req, order) {
  if (req.user.role === 'admin') return;

  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || refId(order.patientId) !== patient._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  if (req.user.role === 'rider') {
    const rider = await Rider.findOne({ userId: req.user._id });
    const assignedId = refId(order.riderId);
    if (!rider || !assignedId || assignedId !== rider._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  throw new ApiError(403, 'Forbidden');
}

exports.listOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const q = {};
  if (status) q.status = status;

  if (req.user.role === 'patient') {
    const patient = await getPatientByUser(req.user._id);
    q.patientId = patient._id;
  } else if (req.user.role === 'rider') {
    const rider = await getRiderByUser(req.user._id);
    q.riderId = rider._id;
  }

  const items = await Order.find(q).sort('-placedAt').populate(POPULATE);
  res.json({ success: true, data: items });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(POPULATE);
  if (!order) throw new ApiError(404, 'Order not found');
  await assertCanViewOrder(req, order);
  res.json({ success: true, data: order });
});

exports.createOrder = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Only patients can place orders');

  const patient = await getPatientByUser(req.user._id);
  const { items, shippingAddress } = req.body;

  const orderItems = [];
  let totalAmount = 0;

  for (const line of items) {
    const product = await Product.findById(line.productId);
    if (!product || !product.isActive) {
      throw new ApiError(400, `Product not available: ${line.productId}`);
    }
    if (product.stock < line.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
      image: product.images?.[0] || '',
    });
    totalAmount += product.price * line.quantity;
    product.stock -= line.quantity;
    await product.save();
  }

  const order = await Order.create({
    patientId: patient._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    status: 'pending',
  });

  const data = await Order.findById(order._id).populate(POPULATE);
  res.status(201).json({ success: true, message: 'Order placed.', data });
});

const ADMIN_TRANSITIONS = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['out-for-delivery', 'cancelled'],
  'out-for-delivery': ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const RIDER_TRANSITIONS = {
  'out-for-delivery': ['delivered'],
  shipped: ['out-for-delivery'],
};

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const { status } = req.body;
  const role = req.user.role;

  if (role === 'admin') {
    const allowed = ADMIN_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new ApiError(400, `Cannot change status from '${order.status}' to '${status}'`);
    }
  } else if (role === 'rider') {
    const rider = await getRiderByUser(req.user._id);
    if (!order.riderId || order.riderId.toString() !== rider._id.toString()) {
      throw new ApiError(403, 'This delivery is not assigned to you');
    }
    const allowed = RIDER_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new ApiError(400, `Cannot change status from '${order.status}' to '${status}'`);
    }
  } else {
    throw new ApiError(403, 'Forbidden');
  }

  order.status = status;
  await order.save();

  const data = await Order.findById(order._id).populate(POPULATE);
  res.json({ success: true, message: 'Order status updated.', data });
});

exports.assignRider = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw new ApiError(403, 'Only admins can assign riders');

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (!['paid', 'shipped'].includes(order.status)) {
    throw new ApiError(400, 'Rider can only be assigned to paid or shipped orders');
  }

  const rider = await Rider.findById(req.body.riderId);
  if (!rider) throw new ApiError(404, 'Rider not found');

  order.riderId = rider._id;
  if (order.status === 'paid') order.status = 'shipped';
  await order.save();

  const data = await Order.findById(order._id).populate(POPULATE);
  res.json({ success: true, message: 'Rider assigned.', data });
});
