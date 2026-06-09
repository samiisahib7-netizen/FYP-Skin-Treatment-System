/**
 * Patient — checkout (shipping address + place order).
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import useCartStore from '@/store/cartStore';
import orderService from '@/services/orderService';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, 'Enter a complete shipping address'),
});

export default function PatientCheckout() {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingAddress: '' },
  });

  useEffect(() => {
    if (items.length === 0) navigate('/patient/cart', { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const onSubmit = async (values) => {
    try {
      await orderService.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: values.shippingAddress,
      });
      clear();
      toast.success('Order placed! Payment will be added in the next step.');
      navigate('/patient/orders');
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Checkout failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Checkout" description="Confirm shipping and place your order." icon={CreditCard} />

      <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>PKR {(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Payment integration (Stripe) arrives on Day 4.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Delivery address</Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="House no., street, city"
                  rows={4}
                  {...register('shippingAddress')}
                />
                {errors.shippingAddress ? (
                  <p className="text-sm text-destructive">{errors.shippingAddress.message}</p>
                ) : null}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Placing order…' : 'Place order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
