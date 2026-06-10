/**
 * Patient — pay for a pending order (Stripe or demo mode).
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import StripePaymentForm from '@/components/payments/StripePaymentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import paymentService from '@/services/paymentService';
import { orderStatusVariant } from '@/utils/orderHelpers';

export default function PayOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  usePageTitle('Pay Order');

  const [order, setOrder] = useState(null);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const o = await orderService.get(id);
        if (o.status !== 'pending') {
          toast.error('This order is not awaiting payment');
          navigate('/patient/orders', { replace: true });
          return;
        }
        setOrder(o);
        const pi = await paymentService.createIntent({ type: 'order', refId: id });
        setIntent(pi);
      } catch (e) {
        toast.error(e.response?.data?.message || e.message || 'Failed to load payment');
        navigate('/patient/orders', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loading variant="fullscreen" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title="Complete payment" description="Secure checkout powered by Stripe." icon={CreditCard} />

      <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order #{order?._id?.slice(-6)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order?.items?.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>PKR {(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
              <span>Total</span>
              <span>PKR {order?.totalAmount?.toLocaleString()}</span>
            </div>
            <Badge variant={orderStatusVariant(order?.status)}>{order?.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <StripePaymentForm
              clientSecret={intent?.clientSecret}
              paymentIntentId={intent?.paymentIntentId}
              onSuccess={() => navigate('/patient/orders', { replace: true })}
            />
            <Button asChild variant="ghost" className="mt-4 w-full">
              <Link to="/patient/orders">Cancel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
