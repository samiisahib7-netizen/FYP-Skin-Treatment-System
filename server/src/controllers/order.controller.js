/**
 * Order controller.
 *   GET    /orders              patient (own) | admin (all)
 *   GET    /orders/:id          patient (own) | admin
 *   POST   /orders              patient — checkout
 *   PATCH  /orders/:id/status   admin
 */
const Product = require('../models/Product');
const Order = require('../models/Order');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser } = require('../utils/roleProfile');

const POPULATE = [
  { path: 'patientId', populate: { path: 'userId', select: '-password' } },
  { path: 'riderId', populate: { path: 'userId', select: '-password' } },
];

async function assertCanViewOrder(req, order) {
  if (req.user.role === 'admin') return;
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || order.patientId.toString() !== patient._id.toString()) {
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

exports.updateStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw new ApiError(403, 'Only admins can update order status');

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const { status } = req.body;
  const allowed = ADMIN_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    throw new ApiError(400, `Cannot change status from '${order.status}' to '${status}'`);
  }

  order.status = status;
  await order.save();

  const data = await Order.findById(order._id).populate(POPULATE);
  res.json({ success: true, message: 'Order status updated.', data });
});
