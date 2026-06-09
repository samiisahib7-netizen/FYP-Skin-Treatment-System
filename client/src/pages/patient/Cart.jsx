/**
 * Patient — shopping cart.
 */
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import useCartStore from '@/store/cartStore';

export default function PatientCart() {
  usePageTitle('Cart');
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <DashboardLayout>
      <PageHeader title="Shopping cart" description="Review items before checkout." icon={ShoppingCart} />

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse the store and add skincare products."
          actionLabel="Go to store"
          onAction={() => navigate('/patient/store')}
        />
      ) : (
        <div className="mx-auto max-w-2xl space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">PKR {item.price.toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty(item.productId, Math.min(item.quantity + 1, item.stock ?? 99))}
                    disabled={item.quantity >= (item.stock ?? 99)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.productId)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <p className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
            <span className="text-lg font-semibold">Subtotal</span>
            <span className="text-lg font-bold">PKR {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/patient/store">Continue shopping</Link>
            </Button>
            <Button className="flex-1" onClick={() => navigate('/patient/checkout')}>
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
