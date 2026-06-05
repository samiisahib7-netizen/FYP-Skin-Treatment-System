/**
 * Mock auth data — used only while the backend is not yet wired.
 * Replaced by real API calls in the integration step.
 */

const MOCK_USERS = [
  {
    _id: 'u_admin_1',
    name: 'Site Admin',
    email: 'admin@skintreatment.local',
    password: 'Admin@12345',
    role: 'admin',
  },
  {
    _id: 'u_doctor_1',
    name: 'Dr. Ayesha Khan',
    email: 'doctor@skintreatment.local',
    password: 'Doctor@12345',
    role: 'doctor',
  },
  {
    _id: 'u_patient_1',
    name: 'Test Patient',
    email: 'patient@skintreatment.local',
    password: 'Patient@12345',
    role: 'patient',
  },
  {
    _id: 'u_rider_1',
    name: 'Rider Ali',
    email: 'rider@skintreatment.local',
    password: 'Rider@12345',
    role: 'rider',
  },
];

const MOCK_TOKEN = (id) => `mock.${id}.${Date.now()}`;

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

/** Mock login — returns { token, user } or throws. */
export async function mockLogin({ email, password }) {
  await delay();
  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) throw new Error('No account found for this email.');
  if (user.password !== password) throw new Error('Incorrect password.');
  // eslint-disable-next-line no-unused-vars
  const { password: _pwd, ...safe } = user;
  return { token: MOCK_TOKEN(user._id), user: safe };
}

/** Mock register — creates a patient by default. */
export async function mockRegister({ name, email, password }) {
  await delay();
  if (MOCK_USERS.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = { _id: `u_patient_${Date.now()}`, name, email, role: 'patient' };
  return { token: MOCK_TOKEN(newUser._id), user: newUser };
}

/** Mock forgot password — pretends to send an email. */
export async function mockForgotPassword({ email }) {
  await delay(400);
  return { message: 'If an account exists, a reset link has been sent.' };
}

/** Mock reset password — always succeeds in mock mode. */
export async function mockResetPassword({ password }) {
  await delay(400);
  return { message: 'Password updated successfully.' };
}

/** Mock /me — returns a fake current user. */
export async function mockMe() {
  await delay(200);
  const user = MOCK_USERS[2];
  // eslint-disable-next-line no-unused-vars
  const { password: _pwd, ...safe } = user;
  return safe;
}

export const MOCK_CREDENTIALS = MOCK_USERS.map(({ email, password, role, name }) => ({
  email,
  password,
  role,
  name,
}));
