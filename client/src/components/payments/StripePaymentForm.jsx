/**
 * Stripe Elements payment form — or mock pay button when keys are not configured.
 */
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import paymentService from '@/services/paymentService';

const PUBLISHABLE = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = PUBLISHABLE.includes('replace_me') ? null : loadStripe(PUBLISHABLE);

function CheckoutForm({ paymentIntentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (error) throw new Error(error.message);
      await paymentService.confirm(paymentIntent?.id || paymentIntentId);
      toast.success('Payment successful!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || busy}>
        {busy ? 'Processing…' : 'Pay now'}
      </Button>
    </form>
  );
}

function MockPayButton({ paymentIntentId, onSuccess }) {
  const [busy, setBusy] = useState(false);

  const handleMockPay = async () => {
    setBusy(true);
    try {
      await paymentService.confirm(paymentIntentId);
      toast.success('Payment successful! (demo mode)');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-dashed border-amber-300 bg-amber-50 p-4">
      <p className="text-sm text-amber-900">
        Stripe test keys are not configured. Use demo payment to simulate checkout.
      </p>
      <Button type="button" className="w-full" disabled={busy} onClick={handleMockPay}>
        {busy ? 'Processing…' : 'Simulate payment (demo)'}
      </Button>
    </div>
  );
}

export default function StripePaymentForm({ clientSecret, paymentIntentId, onSuccess }) {
  if (!clientSecret) return null;

  const isMock = paymentService.isStripeMock() || clientSecret.includes('_mock');

  if (isMock || !stripePromise) {
    return <MockPayButton paymentIntentId={paymentIntentId} onSuccess={onSuccess} />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm paymentIntentId={paymentIntentId} onSuccess={onSuccess} />
    </Elements>
  );
}
