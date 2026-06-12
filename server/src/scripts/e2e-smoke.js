/**
 * E2E smoke test — exercises the full happy path across all modules.
 * Usage: node src/scripts/e2e-smoke.js
 * Requires API server running on PORT (default 5000).
 */
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api/v1`;

async function req(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status} ${path}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

async function login(email, password) {
  const r = await req('POST', '/auth/login', { body: { email, password } });
  return r.data.token;
}

async function run() {
  console.log('[e2e] starting full smoke test…\n');

  const h = await fetch(`${BASE}/health`).then((r) => r.json());
  console.log(`✓ health (emailMock=${h.data?.emailMock})`);

  const patientToken = await login('patient@skintreatment.local', 'Patient@12345');
  const doctorToken = await login('doctor@skintreatment.local', 'Doctor@12345');
  const adminToken = await login('admin@skintreatment.local', 'Admin@12345');
  const riderToken = await login('rider@skintreatment.local', 'Rider@12345');
  console.log('✓ all roles login');

  const doctors = await req('GET', '/doctors');
  const doctorId = doctors.data[0].doctor?._id || doctors.data[0]._id;
  const e2eDate = new Date(Date.now() + 86400000 * 10);
  e2eDate.setUTCHours(0, 0, 0, 0);
  const appt = await req('POST', '/appointments', {
    token: patientToken,
    body: {
      doctorId,
      date: e2eDate.toISOString(),
      timeSlot: '09:00-09:30',
      reason: 'E2E test',
    },
  });
  console.log(`✓ book appointment (${appt.data._id})`);

  await req('PATCH', `/appointments/${appt.data._id}/status`, {
    token: doctorToken,
    body: { status: 'confirmed' },
  });
  console.log('✓ doctor confirms appointment');

  const products = await req('GET', '/products');
  const productId = products.data[0]._id;
  const order = await req('POST', '/orders', {
    token: patientToken,
    body: { items: [{ productId, quantity: 1 }], shippingAddress: 'E2E Test Address' },
  });
  console.log(`✓ create order (${order.data._id})`);

  const intent = await req('POST', '/payments/intent', {
    token: patientToken,
    body: { type: 'order', refId: order.data._id },
  });
  await req('POST', '/payments/confirm', {
    token: patientToken,
    body: { paymentIntentId: intent.data.paymentIntentId },
  });
  console.log('✓ pay order');

  const riders = await req('GET', '/riders', { token: adminToken });
  const riderId = riders.data[0].rider._id;
  await req('PATCH', `/orders/${order.data._id}/assign-rider`, {
    token: adminToken,
    body: { riderId },
  });
  await req('PATCH', `/orders/${order.data._id}/status`, {
    token: riderToken,
    body: { status: 'out-for-delivery' },
  });
  await req('PATCH', `/orders/${order.data._id}/status`, {
    token: riderToken,
    body: { status: 'delivered' },
  });
  console.log('✓ rider delivers order');

  try {
    await req('POST', '/reviews', {
      token: patientToken,
      body: { targetType: 'product', targetId: productId, rating: 5, comment: 'E2E great!' },
    });
    console.log('✓ product review');
  } catch (e) {
    if (e.status === 409) console.log('· product review already exists (ok)');
    else throw e;
  }

  const notes = await req('GET', '/notifications', { token: patientToken });
  console.log(`✓ notifications (${notes.data.length})`);

  const analytics = await req('GET', '/analytics/overview', { token: adminToken });
  console.log(`✓ analytics (users=${analytics.data.totalUsers}, revenue=${analytics.data.revenueMonth})`);

  await req('POST', '/auth/forgot-password', { body: { email: 'patient@skintreatment.local' } });
  console.log('✓ forgot-password email');

  console.log('\n[e2e] ALL PASSED ✅');
}

run().catch((err) => {
  console.error('\n[e2e] FAILED:', err.message);
  process.exit(1);
});
