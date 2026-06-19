/**
 * Comprehensive Full System Test — Day 8 (v2 — fixed)
 * Tests ALL endpoints across all modules:
 *   ✓ Success cases (200/201)
 *   ✓ Auth failures (401)
 *   ✓ Role-based access (403)
 *   ✓ Validation errors (400)
 *   ✓ Not found (404)
 *   ✓ Edge cases (duplicates, overlaps, past dates)
 *   ✓ Full happy-path E2E flow
 *
 * Usage: node src/scripts/comprehensive-test.js
 * Requires server running on PORT (default 5000).
 */
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 5000}/api/v1`;
let PASS = 0,
  FAIL = 0;
const errors = [];

async function req(method, path, { token, body, expectedStatus } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  const ok = expectedStatus ? res.status === expectedStatus : res.ok;
  return { ok, status: res.status, data: json };
}

async function check(label, fn) {
  try {
    const result = await fn();
    if (result.ok) {
      PASS++;
      console.log(`  ✓ ${label}`);
    } else {
      FAIL++;
      const msg = `✗ ${label} — HTTP ${result.status}: ${JSON.stringify(result.data).slice(0, 150)}`;
      errors.push(msg);
      console.log(`  ${msg}`);
    }
  } catch (e) {
    FAIL++;
    const msg = `✗ ${label} — EXCEPTION: ${e.message}`;
    errors.push(msg);
    console.log(`  ${msg}`);
  }
}

async function login(email, password) {
  const r = await req('POST', '/auth/login', { body: { email, password } });
  if (!r.ok) throw new Error(`Login failed for ${email}: ${r.status}`);
  return r.data.data.token;
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────
async function run() {
  console.log('\n' + '='.repeat(70));
  console.log('  COMPREHENSIVE SYSTEM TEST — DAY 8 (v2)');
  console.log('='.repeat(70) + '\n');

  // ── 1. HEALTH CHECK ──
  console.log('─── 1. HEALTH CHECK ───');
  await check('Health endpoint returns success', async () => {
    const h = await fetch(`${BASE}/health`).then((r) => r.json());
    return {
      ok: h.success === true && h.data?.uptime > 0,
      status: 200,
      data: h,
    };
  });

  // ── 2. AUTH ──
  console.log('\n─── 2. AUTHENTICATION ───');
  let patientToken, doctorToken, adminToken, riderToken;

  await check('Register new patient (201)', async () => {
    const r = await req('POST', '/auth/register', {
      body: {
        name: 'Test Patient New',
        email: `testpatient${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001234567',
        role: 'patient',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('Register duplicate email (400)', async () => {
    const r = await req('POST', '/auth/register', {
      body: {
        name: 'Admin Dup',
        email: 'admin@skintreatment.local',
        password: 'Admin@12345',
        role: 'patient',
      },
    });
    return { ok: r.status === 400 || r.status === 409, status: r.status, data: r.data };
  });

  await check('Register with weak password (400)', async () => {
    const r = await req('POST', '/auth/register', {
      body: { name: 'Weak', email: 'weak@test.com', password: '123', role: 'patient' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('Login as admin (200)', async () => {
    adminToken = await login('admin@skintreatment.local', 'Admin@12345');
    return { ok: !!adminToken, status: 200, data: { hasToken: !!adminToken } };
  });

  await check('Login as doctor (200)', async () => {
    doctorToken = await login('doctor@skintreatment.local', 'Doctor@12345');
    return { ok: !!doctorToken, status: 200, data: { hasToken: !!doctorToken } };
  });

  await check('Login as patient (200)', async () => {
    patientToken = await login('patient@skintreatment.local', 'Patient@12345');
    return { ok: !!patientToken, status: 200, data: { hasToken: !!patientToken } };
  });

  await check('Login as rider (200)', async () => {
    riderToken = await login('rider@skintreatment.local', 'Rider@12345');
    return { ok: !!riderToken, status: 200, data: { hasToken: !!riderToken } };
  });

  await check('Login wrong password (401)', async () => {
    const r = await req('POST', '/auth/login', {
      body: { email: 'admin@skintreatment.local', password: 'WrongPass123!' },
    });
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('Login non-existent user (401)', async () => {
    const r = await req('POST', '/auth/login', {
      body: { email: 'nobody@nonexistent.com', password: 'Test@12345' },
    });
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('GET /me with valid token (200)', async () => {
    const r = await req('GET', '/auth/me', { token: patientToken });
    return { ok: r.status === 200 && r.data.data?.email, status: r.status, data: r.data };
  });

  await check('GET /me without token (401)', async () => {
    const r = await req('GET', '/auth/me');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('Change password with wrong old password (400)', async () => {
    const r = await req('POST', '/auth/change-password', {
      token: patientToken,
      body: { oldPassword: 'WrongOldPass123!', newPassword: 'NewPass@12345' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('POST /logout (200)', async () => {
    const r = await req('POST', '/auth/logout', { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // Re-login after logout
  patientToken = await login('patient@skintreatment.local', 'Patient@12345');

  await check('POST /forgot-password (200)', async () => {
    const r = await req('POST', '/auth/forgot-password', {
      body: { email: 'patient@skintreatment.local' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('POST /forgot-password non-existent email (200 safe)', async () => {
    const r = await req('POST', '/auth/forgot-password', {
      body: { email: 'nonexistent@test.com' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 3. USER CRUD ──
  console.log('\n─── 3. USER CRUD ───');

  await check('GET /users (admin) — list (200)', async () => {
    const r = await req('GET', '/users', { token: adminToken });
    return {
      ok: r.status === 200 && Array.isArray(r.data.data?.items),
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /users (patient) — forbidden (403)', async () => {
    const r = await req('GET', '/users', { token: patientToken });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('GET /users (no token) — unauthorized (401)', async () => {
    const r = await req('GET', '/users');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('POST /users (admin) — create doctor (201)', async () => {
    const r = await req('POST', '/users', {
      token: adminToken,
      body: {
        name: 'Test Dr. New',
        email: `drnew${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001112233',
        role: 'doctor',
        specialization: 'Dermatologist',
        consultationFee: 1500,
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /users (doctor) — forbidden (403)', async () => {
    const r = await req('POST', '/users', {
      token: doctorToken,
      body: { name: 'Hack', email: 'hack@test.com', password: 'Test@12345', role: 'patient' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /users — duplicate email (400)', async () => {
    const r = await req('POST', '/users', {
      token: adminToken,
      body: {
        name: 'Dup',
        email: 'admin@skintreatment.local',
        password: 'Test@12345',
        role: 'patient',
      },
    });
    return { ok: r.status === 400 || r.status === 409, status: r.status, data: r.data };
  });

  await check('POST /users — missing fields (400)', async () => {
    const r = await req('POST', '/users', { token: adminToken, body: { role: 'patient' } });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('GET /users/:id (admin) (200)', async () => {
    const list = await req('GET', '/users', { token: adminToken });
    const id = list.data.data?.items?.[0]?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'No users found' } };
    const r = await req('GET', `/users/${id}`, { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /users/:id (no token) (401)', async () => {
    const list = await req('GET', '/users', { token: adminToken });
    const id = list.data.data?.items?.[0]?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'No users found' } };
    const r = await req('GET', `/users/${id}`);
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('PUT /users/:id (admin) (200)', async () => {
    const list = await req('GET', '/users', { token: adminToken });
    const id = list.data.data?.items?.find((u) => u.role === 'patient')?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'No patient user' } };
    const r = await req('PUT', `/users/${id}`, {
      token: adminToken,
      body: { name: 'Updated Patient', isActive: false },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PUT /users/:id (patient) — forbidden (403)', async () => {
    const list = await req('GET', '/users', { token: adminToken });
    const id = list.data.data?.items?.[0]?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'No users' } };
    const r = await req('PUT', `/users/${id}`, { token: patientToken, body: { name: 'Hacked' } });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PUT /users/invalid-id — fails (400/404)', async () => {
    const r = await req('PUT', '/users/000000000000000000000000', {
      token: adminToken,
      body: { name: 'Nope' },
    });
    return { ok: r.status === 400 || r.status === 404, status: r.status, data: r.data };
  });

  await check('PUT /users/profile (patient) (200)', async () => {
    const r = await req('PUT', '/users/profile', {
      token: patientToken,
      body: { name: 'Self Updated', phone: '03009999999' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PUT /users/profile (no token) (401)', async () => {
    const r = await req('PUT', '/users/profile', { body: { name: 'No Token' } });
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('DELETE /users/:id (admin) (200)', async () => {
    const create = await req('POST', '/users', {
      token: adminToken,
      body: {
        name: 'Delete Me',
        email: `deleteme${Date.now()}@test.com`,
        password: 'Test@12345',
        role: 'patient',
      },
    });
    const id = create.data.data?.user?._id || create.data.data?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'Failed to create user' } };
    const r = await req('DELETE', `/users/${id}`, { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('DELETE /users/:id (patient) — forbidden (403)', async () => {
    const list = await req('GET', '/users', { token: adminToken });
    const id = list.data.data?.items?.find((u) => u.role === 'doctor')?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'No doctor found' } };
    const r = await req('DELETE', `/users/${id}`, { token: patientToken });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  // ── 4. DOCTOR CRUD ──
  console.log('\n─── 4. DOCTOR CRUD ───');

  await check('GET /doctors (public) (200)', async () => {
    const r = await req('GET', '/doctors');
    return { ok: r.status === 200 && Array.isArray(r.data.data), status: r.status, data: r.data };
  });

  await check('GET /doctors/:id (public) (200)', async () => {
    const list = await req('GET', '/doctors');
    if (!list.data.data?.length) return { ok: false, status: 404, data: { message: 'No doctors' } };
    const item = list.data.data.find((d) => d.doctor);
    if (!item?.doctor?._id) return { ok: false, status: 404, data: { message: 'No doctor with profile' } };
    const r = await req('GET', `/doctors/${item.doctor._id}`);
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /doctors/:id/availability (auth) (200)', async () => {
    const list = await req('GET', '/doctors');
    const item = list.data.data?.find((d) => d.doctor);
    if (!item?.doctor?._id) return { ok: false, status: 404, data: { message: 'No doctor with profile' } };
    const r = await req('GET', `/doctors/${item.doctor._id}/availability`, {
      token: patientToken,
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /doctors/:id/availability (no token) (401)', async () => {
    const list = await req('GET', '/doctors');
    const item = list.data.data?.find((d) => d.doctor);
    if (!item?.doctor?._id) return { ok: false, status: 404, data: { message: 'No doctor' } };
    const r = await req('GET', `/doctors/${item.doctor._id}/availability`);
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('POST /doctors (admin) (201)', async () => {
    const r = await req('POST', '/doctors', {
      token: adminToken,
      body: {
        name: 'New Test Doctor',
        email: `doccreate${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001112244',
        specialization: 'Dermatologist',
        consultationFee: 2000,
        qualifications: 'MBBS, FCPS',
        experience: 10,
        bio: 'Expert dermatologist',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /doctors (patient) — forbidden (403)', async () => {
    const r = await req('POST', '/doctors', {
      token: patientToken,
      body: {
        name: 'Hack',
        email: `hackdoc${Date.now()}@test.com`,
        password: 'Test@12345',
        specialization: 'General',
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /doctors — missing fields (400)', async () => {
    const r = await req('POST', '/doctors', { token: adminToken, body: { name: 'Incomplete' } });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('PUT /doctors/:id (admin) (200)', async () => {
    const list = await req('GET', '/doctors');
    const item = list.data.data?.find((d) => d.doctor);
    if (!item?.doctor?._id) return { ok: false, status: 404, data: { message: 'No doctor' } };
    const r = await req('PUT', `/doctors/${item.doctor._id}`, {
      token: adminToken,
      body: { consultationFee: 2500, experience: 12 },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('DELETE /doctors/:id (admin) (200)', async () => {
    const create = await req('POST', '/doctors', {
      token: adminToken,
      body: {
        name: 'Temp Doc Del',
        email: `tempdocdel${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001115566',
        specialization: 'General',
        consultationFee: 1000,
      },
    });
    // createDoctor returns data: { ...user.toObject(), doctor } — doctor._id at data.doctor._id
    const id = create.data.data?.doctor?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'Failed to create doctor' } };
    const r = await req('DELETE', `/doctors/${id}`, { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /doctors/invalid-id (404)', async () => {
    const r = await req('GET', '/doctors/000000000000000000000000');
    return { ok: r.status === 404, status: r.status, data: r.data };
  });

  // ── 5. PATIENT CRUD ──
  console.log('\n─── 5. PATIENT CRUD ───');

  await check('GET /patients (admin) (200)', async () => {
    const r = await req('GET', '/patients', { token: adminToken });
    return { ok: r.status === 200 && Array.isArray(r.data.data), status: r.status, data: r.data };
  });

  await check('GET /patients (doctor) (200)', async () => {
    const r = await req('GET', '/patients', { token: doctorToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /patients (patient) — forbidden (403)', async () => {
    const r = await req('GET', '/patients', { token: patientToken });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('GET /patients/:id (patient self) (200)', async () => {
    const r = await req('GET', '/patients', { token: adminToken });
    if (!r.data.data?.length) return { ok: false, status: 404, data: { message: 'No patients' } };
    const item = r.data.data.find((p) => p.patient);
    if (!item?.patient?._id) return { ok: false, status: 404, data: { message: 'No patient with profile' } };
    const r2 = await req('GET', `/patients/${item.patient._id}`, { token: patientToken });
    return { ok: r2.status === 200, status: r2.status, data: r2.data };
  });

  await check('POST /patients (admin) (201)', async () => {
    const r = await req('POST', '/patients', {
      token: adminToken,
      body: {
        name: 'New Patient',
        email: `patcreate${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001117788',
        gender: 'male',
        dateOfBirth: '1995-06-15',
        address: 'Test Address',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /patients (patient) — forbidden (403)', async () => {
    const r = await req('POST', '/patients', {
      token: patientToken,
      body: {
        name: 'Hack',
        email: `hackpat${Date.now()}@test.com`,
        password: 'Test@12345',
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PUT /patients/:id (patient self) (200)', async () => {
    const list = await req('GET', '/patients', { token: adminToken });
    const item = list.data.data?.find((p) => p.patient);
    if (!item?.patient?._id) return { ok: false, status: 404, data: { message: 'No patient' } };
    const r = await req('PUT', `/patients/${item.patient._id}`, {
      token: patientToken,
      body: { address: 'Updated Address 123', medicalHistory: 'None' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('DELETE /patients/:id (admin) (200)', async () => {
    const create = await req('POST', '/patients', {
      token: adminToken,
      body: {
        name: 'Temp Patient Del',
        email: `temppatdel${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001119900',
        gender: 'female',
      },
    });
    // createPatient returns data: { ...user.toObject(), patient } — patient._id at data.patient._id
    const id = create.data.data?.patient?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'Failed to create' } };
    const r = await req('DELETE', `/patients/${id}`, { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 6. RIDER CRUD ──
  console.log('\n─── 6. RIDER CRUD ───');

  await check('GET /riders (admin) (200)', async () => {
    const r = await req('GET', '/riders', { token: adminToken });
    return { ok: r.status === 200 && Array.isArray(r.data.data), status: r.status, data: r.data };
  });

  await check('GET /riders (patient) — forbidden (403)', async () => {
    const r = await req('GET', '/riders', { token: patientToken });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /riders (admin) (201)', async () => {
    const r = await req('POST', '/riders', {
      token: adminToken,
      body: {
        name: 'New Rider',
        email: `ridercreate${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001112255',
        vehicleNumber: 'LEG-1234',
        serviceArea: 'Sheikhupura',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /riders (rider) — forbidden (403)', async () => {
    const r = await req('POST', '/riders', {
      token: riderToken,
      body: {
        name: 'Hack',
        email: `hackrider${Date.now()}@test.com`,
        password: 'Test@12345',
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PUT /riders/:id (rider self) (200)', async () => {
    const list = await req('GET', '/riders', { token: adminToken });
    const item = list.data.data?.find((r) => r.rider);
    if (!item?.rider?._id) return { ok: false, status: 404, data: { message: 'No rider' } };
    const r = await req('PUT', `/riders/${item.rider._id}`, {
      token: riderToken,
      body: { serviceArea: 'Lahore' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('DELETE /riders/:id (admin) (200)', async () => {
    const create = await req('POST', '/riders', {
      token: adminToken,
      body: {
        name: 'Temp Rider Del',
        email: `tempriderdel${Date.now()}@test.com`,
        password: 'Test@12345',
        phone: '03001113344',
        vehicleNumber: 'XYZ-9999',
        serviceArea: 'Test',
      },
    });
    // createRider returns data: { ...user.toObject(), rider } — rider._id at data.rider._id
    const id = create.data.data?.rider?._id;
    if (!id) return { ok: false, status: 404, data: { message: 'Failed to create' } };
    const r = await req('DELETE', `/riders/${id}`, { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 7. APPOINTMENTS ──
  console.log('\n─── 7. APPOINTMENTS ───');

  let apptId;
  const doctorsList = await req('GET', '/doctors');
  const doctorItem = doctorsList.data.data?.find((d) => d.doctor);
  const seededDoctorId = doctorItem?.doctor?._id;

  await check('GET /appointments (patient) (200)', async () => {
    const r = await req('GET', '/appointments', { token: patientToken });
    return {
      ok: r.status === 200 && Array.isArray(r.data.data),
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /appointments (no token) (401)', async () => {
    const r = await req('GET', '/appointments');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('POST /appointments (patient) (201)', async () => {
    if (!seededDoctorId) return { ok: false, status: 404, data: { message: 'No doctor profile found' } };
    const apptDate = new Date(Date.now() + 86400000 * 15);
    apptDate.setUTCHours(0, 0, 0, 0);
    const r = await req('POST', '/appointments', {
      token: patientToken,
      body: {
        doctorId: seededDoctorId,
        date: apptDate.toISOString(),
        timeSlot: '12:00-12:30',
        reason: 'Comprehensive test appointment',
      },
      expectedStatus: 201,
    });
    apptId = r.data.data?._id;
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /appointments (doctor) — forbidden (403)', async () => {
    if (!seededDoctorId) return { ok: false, status: 404, data: { message: 'No doctor' } };
    const r = await req('POST', '/appointments', {
      token: doctorToken,
      body: {
        doctorId: seededDoctorId,
        date: new Date().toISOString(),
        timeSlot: '11:00-11:30',
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /appointments — duplicate slot (409)', async () => {
    if (!apptId || !seededDoctorId) return { ok: false, status: 404, data: { message: 'No appt' } };
    const apptDate = new Date(Date.now() + 86400000 * 15);
    apptDate.setUTCHours(0, 0, 0, 0);
    const r = await req('POST', '/appointments', {
      token: patientToken,
      body: {
        doctorId: seededDoctorId,
        date: apptDate.toISOString(),
        timeSlot: '12:00-12:30',
        reason: 'Duplicate',
      },
    });
    return { ok: r.status === 400 || r.status === 409, status: r.status, data: r.data };
  });

  await check('POST /appointments — past date (400)', async () => {
    if (!seededDoctorId) return { ok: false, status: 404, data: { message: 'No doctor' } };
    const pastDate = new Date('2020-01-01').toISOString();
    const r = await req('POST', '/appointments', {
      token: patientToken,
      body: {
        doctorId: seededDoctorId,
        date: pastDate,
        timeSlot: '09:00-09:30',
        reason: 'Past test',
      },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('PATCH /appointments/:id/status — confirm (doctor) (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('PATCH', `/appointments/${apptId}/status`, {
      token: doctorToken,
      body: { status: 'confirmed' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /appointments/:id/status (patient) — forbidden (403)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('PATCH', `/appointments/${apptId}/status`, {
      token: patientToken,
      body: { status: 'confirmed' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PATCH /appointments/:id/status — invalid status (400)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('PATCH', `/appointments/${apptId}/status`, {
      token: doctorToken,
      body: { status: 'invalid-status' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('PUT /appointments/:id (doctor notes) (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('PUT', `/appointments/${apptId}`, {
      token: doctorToken,
      body: { notes: 'Test follow-up notes' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /appointments/:id/status — complete (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('PATCH', `/appointments/${apptId}/status`, {
      token: doctorToken,
      body: { status: 'completed' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /appointments/:id (patient) (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('GET', `/appointments/${apptId}`, { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 8. PRESCRIPTIONS ──
  console.log('\n─── 8. PRESCRIPTIONS ───');

  await check('GET /prescriptions (patient) (200)', async () => {
    const r = await req('GET', '/prescriptions', { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('POST /prescriptions (doctor) (201)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    // NOTE: validator expects field name 'medicines', NOT 'medications'
    const r = await req('POST', '/prescriptions', {
      token: doctorToken,
      body: {
        appointmentId: apptId,
        diagnosis: 'Skin allergy test diagnosis',
        medicines: [
          {
            name: 'Cetirizine',
            dosage: '10mg',
            duration: '7 days',
            instructions: 'Once daily',
          },
        ],
        notes: 'Avoid sunlight',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /prescriptions (patient) — forbidden (403)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('POST', '/prescriptions', {
      token: patientToken,
      body: { appointmentId: apptId, diagnosis: 'Hack', medicines: [] },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /prescriptions — missing fields (400)', async () => {
    const r = await req('POST', '/prescriptions', {
      token: doctorToken,
      body: { appointmentId: apptId || '000000000000000000000000' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('GET /prescriptions/:id (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const rxList = await req('GET', '/prescriptions', { token: patientToken });
    const rx = rxList.data.data?.[0];
    if (!rx?._id) return { ok: false, status: 404, data: { message: 'No prescriptions found' } };
    const r = await req('GET', `/prescriptions/${rx._id}`, { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /prescriptions/appointment/:appointmentId (200)', async () => {
    if (!apptId) return { ok: false, status: 404, data: { message: 'No apptId' } };
    const r = await req('GET', `/prescriptions/appointment/${apptId}`, {
      token: patientToken,
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 9. PRODUCTS ──
  console.log('\n─── 9. PRODUCTS ───');

  let productId;

  await check('GET /products (public) (200)', async () => {
    const r = await req('GET', '/products');
    return {
      ok: r.status === 200 && Array.isArray(r.data.data),
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /products/:id (public) (200)', async () => {
    const list = await req('GET', '/products');
    if (!list.data.data?.length) return { ok: false, status: 404, data: { message: 'No products' } };
    productId = list.data.data[0]._id;
    const r = await req('GET', `/products/${productId}`);
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('POST /products (admin) (201)', async () => {
    const r = await req('POST', '/products', {
      token: adminToken,
      body: {
        name: 'Test Moisturizer',
        description: 'A comprehensive test product',
        price: 499,
        category: 'moisturizers',
        stock: 100,
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /products (doctor) — forbidden (403)', async () => {
    const r = await req('POST', '/products', {
      token: doctorToken,
      body: { name: 'Hack Product', price: 999, category: 'other' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /products — missing price (400)', async () => {
    const r = await req('POST', '/products', {
      token: adminToken,
      body: { name: 'No Price', category: 'other' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('POST /products — negative price (400)', async () => {
    const r = await req('POST', '/products', {
      token: adminToken,
      body: { name: 'Neg Price', price: -100, category: 'other' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  // ── 10. ORDERS / RIDER DELIVERY ──
  console.log('\n─── 10. ORDERS & RIDER DELIVERY ───');

  let orderId;

  await check('GET /orders (patient) (200)', async () => {
    const r = await req('GET', '/orders', { token: patientToken });
    return {
      ok: r.status === 200 && Array.isArray(r.data.data),
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /orders (no token) (401)', async () => {
    const r = await req('GET', '/orders');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('POST /orders (patient) (201)', async () => {
    const products = await req('GET', '/products');
    if (!products.data.data?.length) return { ok: false, status: 404, data: { message: 'No products' } };
    const pid = products.data.data[0]._id;
    const r = await req('POST', '/orders', {
      token: patientToken,
      body: {
        items: [{ productId: pid, quantity: 2 }],
        shippingAddress: 'Test City, Test Area, House 123',
      },
      expectedStatus: 201,
    });
    orderId = r.data.data?._id;
    productId = pid;
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /orders (doctor) — forbidden (403)', async () => {
    const r = await req('POST', '/orders', {
      token: doctorToken,
      body: {
        items: [{ productId: productId || '000000000000000000000000', quantity: 1 }],
        shippingAddress: 'N/A',
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /orders — empty items (400)', async () => {
    const r = await req('POST', '/orders', {
      token: patientToken,
      body: { items: [], shippingAddress: 'Test City Address' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('POST /orders — negative quantity (400)', async () => {
    const r = await req('POST', '/orders', {
      token: patientToken,
      body: {
        items: [{ productId: productId || '000000000000000000000000', quantity: -1 }],
        shippingAddress: 'Test City Address',
      },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  // ── 11. PAYMENTS ──
  console.log('\n─── 11. PAYMENTS ───');

  await check('POST /payments/intent (patient) (200)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('POST', '/payments/intent', {
      token: patientToken,
      body: { type: 'order', refId: orderId },
    });
    return { ok: r.status === 200 && r.data.data?.paymentIntentId, status: r.status, data: r.data };
  });

  await check('POST /payments/intent (no token) (401)', async () => {
    const r = await req('POST', '/payments/intent', {
      body: { type: 'order', refId: '000000000000000000000000' },
    });
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('POST /payments/intent (admin) — forbidden (403)', async () => {
    const r = await req('POST', '/payments/intent', {
      token: adminToken,
      body: { type: 'order', refId: orderId || '000000000000000000000000' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /payments/confirm (patient) (200)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const intent = await req('POST', '/payments/intent', {
      token: patientToken,
      body: { type: 'order', refId: orderId },
    });
    if (!intent.data.data?.paymentIntentId) {
      return { ok: false, status: 500, data: { message: 'No intent created' } };
    }
    const r = await req('POST', '/payments/confirm', {
      token: patientToken,
      body: { paymentIntentId: intent.data.data.paymentIntentId },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('POST /payments/confirm — fake intent (400/404)', async () => {
    const r = await req('POST', '/payments/confirm', {
      token: patientToken,
      body: { paymentIntentId: 'pi_fake_invalid_12345' },
    });
    return { ok: r.status === 400 || r.status === 404, status: r.status, data: r.data };
  });

  // ── 12. RIDER ASSIGN & ORDER STATUS FLOW ──
  console.log('\n─── 12. RIDER ASSIGNMENT & DELIVERY FLOW ───');

  // Get the seeded rider's profile ID (the one riderToken belongs to)
  // Must match by email to avoid picking up temp riders created during this test
  const ridersList = await req('GET', '/riders', { token: adminToken });
  const seededRiderItem = ridersList.data.data?.find((r) => r.rider && r.email === 'rider@skintreatment.local');
  const seededRiderId = seededRiderItem?.rider?._id;

  await check('PATCH /orders/:id/assign-rider (admin) (200)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    if (!seededRiderId) return { ok: false, status: 404, data: { message: 'No seeded rider' } };
    const r = await req('PATCH', `/orders/${orderId}/assign-rider`, {
      token: adminToken,
      body: { riderId: seededRiderId },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /orders/:id/assign-rider (patient) — forbidden (403)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/assign-rider`, {
      token: patientToken,
      body: { riderId: seededRiderId || '000000000000000000000000' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PATCH /orders/:id/assign-rider — invalid rider (400/404)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/assign-rider`, {
      token: adminToken,
      body: { riderId: '000000000000000000000000' },
    });
    return { ok: r.status === 400 || r.status === 404, status: r.status, data: r.data };
  });

  // Rider updates status using the SAME rider whose token we have
  await check('PATCH /orders/:id/status (rider) — out-for-delivery (200)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/status`, {
      token: riderToken,
      body: { status: 'out-for-delivery' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /orders/:id/status (rider) — delivered (200)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/status`, {
      token: riderToken,
      body: { status: 'delivered' },
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /orders/:id/status (patient) — forbidden (403)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/status`, {
      token: patientToken,
      body: { status: 'delivered' },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('PATCH /orders/:id/status — invalid status (400)', async () => {
    if (!orderId) return { ok: false, status: 404, data: { message: 'No orderId' } };
    const r = await req('PATCH', `/orders/${orderId}/status`, {
      token: riderToken,
      body: { status: 'invalid-status' },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  // ── 13. REVIEWS ──
  console.log('\n─── 13. REVIEWS ───');

  await check('GET /reviews (public) — with query (200)', async () => {
    const products = await req('GET', '/products');
    const pid = products.data.data?.[0]?._id;
    if (!pid) return { ok: false, status: 404, data: { message: 'No product' } };
    const r = await req('GET', `/reviews?targetType=product&targetId=${pid}`);
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /reviews/mine (patient) (200)', async () => {
    const r = await req('GET', '/reviews/mine', { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /reviews/mine (no token) (401)', async () => {
    const r = await req('GET', '/reviews/mine');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  // productId was captured during order creation — it's from the product list, and the order is now delivered
  await check('POST /reviews (patient — delivered product) (201)', async () => {
    if (!productId) return { ok: false, status: 404, data: { message: 'No productId' } };
    const r = await req('POST', '/reviews', {
      token: patientToken,
      body: {
        targetType: 'product',
        targetId: productId,
        rating: 5,
        comment: 'Excellent product!',
      },
      expectedStatus: 201,
    });
    return { ok: r.status === 201, status: r.status, data: r.data };
  });

  await check('POST /reviews (patient) — duplicate (409)', async () => {
    if (!productId) return { ok: false, status: 404, data: { message: 'No productId' } };
    const r = await req('POST', '/reviews', {
      token: patientToken,
      body: {
        targetType: 'product',
        targetId: productId,
        rating: 3,
        comment: 'Duplicate!',
      },
    });
    return { ok: r.status === 409, status: r.status, data: r.data };
  });

  await check('POST /reviews (doctor) — forbidden (403)', async () => {
    const r = await req('POST', '/reviews', {
      token: doctorToken,
      body: {
        targetType: 'product',
        targetId: productId || '000000000000000000000000',
        rating: 5,
      },
    });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('POST /reviews — invalid rating (400)', async () => {
    const r = await req('POST', '/reviews', {
      token: patientToken,
      body: {
        targetType: 'product',
        targetId: productId || '000000000000000000000000',
        rating: 99,
      },
    });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  // ── 14. NOTIFICATIONS ──
  console.log('\n─── 14. NOTIFICATIONS ───');

  await check('GET /notifications (patient) (200)', async () => {
    const r = await req('GET', '/notifications', { token: patientToken });
    return {
      ok: r.status === 200 && Array.isArray(r.data.data),
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /notifications (no token) (401)', async () => {
    const r = await req('GET', '/notifications');
    return { ok: r.status === 401, status: r.status, data: r.data };
  });

  await check('GET /notifications/unread-count (200)', async () => {
    const r = await req('GET', '/notifications/unread-count', { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /notifications/:id/read (200)', async () => {
    const notes = await req('GET', '/notifications', { token: patientToken });
    if (!notes.data.data?.length) return { ok: false, status: 404, data: { message: 'No notifications' } };
    const r = await req('PATCH', `/notifications/${notes.data.data[0]._id}/read`, {
      token: patientToken,
    });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('PATCH /notifications/read-all (200)', async () => {
    const r = await req('PATCH', '/notifications/read-all', { token: patientToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 15. ANALYTICS ──
  console.log('\n─── 15. ANALYTICS ───');

  await check('GET /analytics/overview (admin) (200)', async () => {
    const r = await req('GET', '/analytics/overview', { token: adminToken });
    return {
      ok: r.status === 200 && r.data.data?.totalUsers !== undefined,
      status: r.status,
      data: r.data,
    };
  });

  await check('GET /analytics/overview (patient) — forbidden (403)', async () => {
    const r = await req('GET', '/analytics/overview', { token: patientToken });
    return { ok: r.status === 403, status: r.status, data: r.data };
  });

  await check('GET /analytics/appointments-by-status (admin) (200)', async () => {
    const r = await req('GET', '/analytics/appointments-by-status', { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /analytics/orders-by-status (admin) (200)', async () => {
    const r = await req('GET', '/analytics/orders-by-status', { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  await check('GET /analytics/revenue-by-month (admin) (200)', async () => {
    const r = await req('GET', '/analytics/revenue-by-month', { token: adminToken });
    return { ok: r.status === 200, status: r.status, data: r.data };
  });

  // ── 16. EDGE CASES ──
  console.log('\n─── 16. EDGE CASES & ERROR HANDLING ───');

  await check('GET /nonexistent-route (404)', async () => {
    const r = await req('GET', '/nonexistent-route');
    return { ok: r.status === 404, status: r.status, data: r.data };
  });

  await check('POST /auth/login with empty body (400)', async () => {
    const r = await req('POST', '/auth/login', { body: {} });
    return { ok: r.status === 400, status: r.status, data: r.data };
  });

  await check('GET /users/invalid-objectid (400)', async () => {
    const r = await req('GET', '/users/invalid-id-format', { token: adminToken });
    return { ok: r.status === 400 || r.status === 500, status: r.status, data: r.data };
  });

  // ── RESULTS ──
  console.log('\n' + '='.repeat(70));
  console.log('  TEST RESULTS SUMMARY');
  console.log('='.repeat(70));
  console.log(`  TOTAL:  ${PASS + FAIL}  |  PASSED: ${PASS}  |  FAILED: ${FAIL}`);
  console.log(`  SUCCESS RATE: ${((PASS / (PASS + FAIL)) * 100).toFixed(1)}%`);

  if (errors.length) {
    console.log('\n  FAILED TESTS:');
    errors.forEach((e) => console.log(`    ${e}`));
  }

  console.log(
    `\n  ${FAIL === 0 ? '✅ ALL TESTS PASSED — SYSTEM IS READY FOR SUBMISSION' : '❌ SOME TESTS FAILED — REVIEW ABOVE'}`
  );
  console.log('='.repeat(70) + '\n');

  process.exit(FAIL > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('\n[FATAL]', err);
  process.exit(1);
});
