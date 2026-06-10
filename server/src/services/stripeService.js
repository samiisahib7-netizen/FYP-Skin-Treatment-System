/**
 * Stripe helper — creates PaymentIntents.
 * Falls back to mock mode when STRIPE_SECRET_KEY is not configured (dev/demo).
 */
const Stripe = require('stripe');

const SECRET = process.env.STRIPE_SECRET_KEY || '';
const IS_MOCK = !SECRET || SECRET.includes('replace_me');

let stripe = null;
if (!IS_MOCK) {
  stripe = new Stripe(SECRET);
}

/** PKR amounts are stored as whole rupees; Stripe expects smallest currency unit (paisa). */
function toStripeAmount(pkr) {
  return Math.round(Number(pkr) * 100);
}

exports.isMockMode = () => IS_MOCK;

exports.createPaymentIntent = async ({ amount, metadata }) => {
  if (IS_MOCK) {
    const id = `pi_mock_${Date.now()}`;
    return {
      id,
      client_secret: `${id}_secret_mock`,
      mock: true,
    };
  }

  const intent = await stripe.paymentIntents.create({
    amount: toStripeAmount(amount),
    currency: 'pkr',
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return intent;
};

exports.retrievePaymentIntent = async (paymentIntentId) => {
  if (IS_MOCK) {
    return { id: paymentIntentId, status: 'succeeded', mock: true };
  }
  return stripe.paymentIntents.retrieve(paymentIntentId);
};
