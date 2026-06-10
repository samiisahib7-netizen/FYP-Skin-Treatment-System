import api from './api';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
const STRIPE_MOCK =
  USE_MOCK || (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').includes('replace_me');

export const paymentService = {
  createIntent: (payload) =>
    api.post('/payments/intent', payload).then((r) => ({ ...r.data.data, mock: r.data.data.mock || STRIPE_MOCK })),

  confirm: (paymentIntentId) =>
    api.post('/payments/confirm', { paymentIntentId }).then((r) => r.data.data),

  isStripeMock: () => STRIPE_MOCK,
};

export default paymentService;
