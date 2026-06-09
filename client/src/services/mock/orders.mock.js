const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let orders = [
  {
    _id: 'ord_seed_1',
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    items: [{ productId: 'prod_1', name: 'Gentle Foaming Cleanser', price: 1200, quantity: 2, image: '' }],
    totalAmount: 2400,
    shippingAddress: 'House 12, Model Town, Lahore',
    status: 'pending',
    placedAt: new Date().toISOString(),
  },
];

export async function mockListOrders() {
  await delay();
  return [...orders];
}

export async function mockCreateOrder(payload) {
  await delay();
  const items = payload.items.map((line) => ({
    productId: line.productId,
    name: 'Product',
    price: 1200,
    quantity: line.quantity,
    image: '',
  }));
  const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const order = {
    _id: `ord_${Date.now()}`,
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    items,
    totalAmount,
    shippingAddress: payload.shippingAddress,
    status: 'pending',
    placedAt: new Date().toISOString(),
  };
  orders = [order, ...orders];
  return order;
}

export async function mockUpdateOrderStatus(id, status) {
  await delay();
  const idx = orders.findIndex((o) => o._id === id);
  if (idx === -1) throw new Error('Order not found');
  orders[idx] = { ...orders[idx], status };
  return orders[idx];
}
